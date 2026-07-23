"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"
import Pagination from "@/components/Pagination"
import { getImageUrl } from "@/lib/image"

export type Karya = {
  id: number
  judul: string
  deskripsi: string
  link: string | null
  namaPembuat: string
  kelas: string
  jurusan: string
  thumbnail: string | null
  status: string
  createdAt: string
}

interface KaryaClientProps {
  initialData: Karya[]
  apiUrl: string
}

export default function KaryaClient({ initialData, apiUrl }: KaryaClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedKarya, setSelectedKarya] = useState<Karya | null>(null)
  const itemsPerPage = 4

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const filtered = initialData.filter((k) =>
    k.judul.toLowerCase().includes(search.toLowerCase()) ||
    k.namaPembuat.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  return (
    <DesktopLayout>
      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Karya Siswa</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/")} >Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive} onClick={() => router.push("/karya")}>Karya Siswa</span>
          </nav>
        </div>

        {/* Search & Add Button */}
        <div style={toolbar}>
          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={searchInput}
            />
            <span style={searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
          <button style={btnAdd} onClick={() => router.push("/karya/tambah")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Data
          </button>
        </div>

        {/* Cards */}
        <div style={cardsContainer}>
          {paginated.length === 0 ? (
            <div style={emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Belum ada karya siswa</p>
            </div>
          ) : (
            paginated.map((k) => (
              <div key={k.id} style={{ ...card, cursor: "pointer" }} onClick={() => setSelectedKarya(k)}>
                {/* Thumbnail */}
                <div style={thumbnailWrapper}>
                  <img
                    src={getImageUrl(k.thumbnail, apiUrl)}
                    alt={k.judul}
                    style={thumbnailImage}
                  />

                </div>

                {/* Content */}
                <div style={cardContent}>
                  <h3 style={cardTitle}>{k.judul}</h3>
                  <p style={cardDeskripsi}>{k.deskripsi}</p>

                  {/* Link Karya */}
                  {k.link && (
                    <div style={linkSection}>
                      <h4 style={sectionLabel}>Link karya:</h4>
                      <a
                        href={k.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkUrl}
                      >
                        {k.link}
                      </a>
                    </div>
                  )}

                  {/* Dibuat Oleh */}
                  <div style={infoSection}>
                    <h4 style={sectionLabel}>Dibuat oleh:</h4>
                    <div style={infoRow}>
                      <span style={infoLabel}>Nama</span>
                      <span style={infoSeparator}>:</span>
                      <span style={infoValue}>{k.namaPembuat}</span>
                    </div>
                    <div style={infoRow}>
                      <span style={infoLabel}>Kelas</span>
                      <span style={infoSeparator}>:</span>
                      <span style={infoValue}>{k.kelas}</span>
                    </div>
                    <div style={infoRow}>
                      <span style={infoLabel}>Jurusan</span>
                      <span style={infoSeparator}>:</span>
                      <span style={infoValue}>{k.jurusan}</span>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <p style={cardDate}>{formatDate(k.createdAt)}</p>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Selected Karya Modal */}
        {selectedKarya && (
          <div style={modalOverlay} onClick={() => setSelectedKarya(null)}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={modalClose} onClick={() => setSelectedKarya(null)}>&times;</button>
              <div style={modalImageWrapper}>
                <img 
                  src={getImageUrl(selectedKarya.thumbnail, apiUrl)} 
                  alt={selectedKarya.judul} 
                  style={modalImage} 
                  onError={(e) => { (e.target as HTMLImageElement).src = "/no-image.png" }}
                />
              </div>
              <div style={modalDetails}>
                <h3 style={modalTitle}>{selectedKarya.judul}</h3>
                <p style={modalDescription}>{selectedKarya.deskripsi || "Tidak ada deskripsi."}</p>
                
                <div style={modalDivider} />
                
                <div style={modalAuthorSection}>
                  <h4 style={modalSectionTitle}>Dibuat Oleh:</h4>
                  <div style={modalInfoGrid}>
                    <div style={modalInfoRow}>
                      <span style={modalInfoLabel}>Nama</span>
                      <span style={modalInfoSeparator}>:</span>
                      <span style={modalInfoValue}>{selectedKarya.namaPembuat}</span>
                    </div>
                    <div style={modalInfoRow}>
                      <span style={modalInfoLabel}>Kelas</span>
                      <span style={modalInfoSeparator}>:</span>
                      <span style={modalInfoValue}>{selectedKarya.kelas}</span>
                    </div>
                    <div style={modalInfoRow}>
                      <span style={modalInfoLabel}>Jurusan</span>
                      <span style={modalInfoSeparator}>:</span>
                      <span style={modalInfoValue}>{selectedKarya.jurusan}</span>
                    </div>
                  </div>
                </div>
                
                {selectedKarya.link && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={modalSectionTitle}>Link Karya:</h4>
                    <a href={selectedKarya.link} target="_blank" rel="noopener noreferrer" style={modalLink}>
                      {selectedKarya.link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </DesktopLayout>
  )
}

// Styles
const mainContent = {
  padding: "20px",
  maxWidth: 800,
  margin: "0 auto",
}

const titleSection = { marginBottom: 16 }
const pageTitle = { fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 6px 0" }
const breadcrumb = { fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6 }
const breadcrumbItem = { color: "#666", cursor: "pointer" }
const breadcrumbSeparator = { color: "#999", fontSize: 14 }
const breadcrumbActive = { color: "#333", fontWeight: 600 }
const toolbar = { display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }
const searchWrapper = { position: "relative" as const, flex: 1 }
const searchInput = { width: "100%", padding: "10px 36px 10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", background: "white", boxSizing: "border-box" as const }
const searchIcon = { position: "absolute" as const, right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" as const }
const btnAdd = { background: "#687E50", color: "white", padding: "10px 16px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", whiteSpace: "nowrap" as const }
const cardsContainer = { display: "flex", flexDirection: "column" as const, gap: 16 }
const card = { background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer" }
const thumbnailWrapper = { width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: "#f0f2eb" }
const thumbnailImage = { width: "100%", height: "100%", objectFit: "cover" as const, display: "block" }
const cardContent = { padding: "16px 20px 20px" }
const cardTitle = { fontSize: 18, fontWeight: 700, color: "#333", margin: "0 0 8px 0" }
const cardDeskripsi = { fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 12px 0" }
const linkSection = { marginBottom: 12 }
const sectionLabel = { fontSize: 14, fontWeight: 700, color: "#333", margin: "0 0 4px 0" }
const linkUrl = { fontSize: 14, color: "#3b82f6", textDecoration: "underline", wordBreak: "break-all" as const }
const infoSection = { marginBottom: 12 }
const infoRow = { display: "flex", fontSize: 14, color: "#555", marginBottom: 2 }
const infoLabel = { width: 70, flexShrink: 0 }
const infoSeparator = { width: 20, flexShrink: 0 }
const infoValue = { flex: 1 }
const cardDate = { fontSize: 13, color: "#999", margin: "0 0 12px 0" }
const emptyState = { textAlign: "center" as const, padding: "60px 20px", color: "#999" }

// Modal Styles
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: 20,
}

const modalContent: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  position: "relative",
}

const modalClose: React.CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  background: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 28,
  height: 28,
  fontSize: 18,
  lineHeight: "26px",
  textAlign: "center",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
}

const modalImageWrapper: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#f0f2eb",
  overflow: "hidden",
  position: "relative",
}

const modalImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
}

const modalDetails: React.CSSProperties = {
  padding: "24px",
}

const modalCategory: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#687E50",
  background: "#f0f4e8",
  padding: "4px 8px",
  borderRadius: 4,
  display: "inline-block",
  marginBottom: 10,
}

const modalTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 10px 0",
}

const modalDescription: React.CSSProperties = {
  fontSize: 14,
  color: "#555",
  lineHeight: 1.6,
  margin: "0 0 20px 0",
}

const modalDivider: React.CSSProperties = {
  height: "1px",
  background: "#eee",
  margin: "20px 0",
}

const modalAuthorSection: React.CSSProperties = {
  background: "#f9fbf7",
  padding: "16px",
  borderRadius: 10,
  border: "1px solid #edf2e8",
}

const modalSectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 10px 0",
}

const modalInfoGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
}

const modalInfoRow: React.CSSProperties = {
  display: "flex",
  fontSize: 13,
  color: "#555",
}

const modalInfoLabel: React.CSSProperties = {
  width: 70,
  fontWeight: 500,
}

const modalInfoSeparator: React.CSSProperties = {
  marginRight: 8,
}

const modalInfoValue: React.CSSProperties = {
  fontWeight: 600,
  color: "#333",
}

const modalLink: React.CSSProperties = {
  fontSize: 13,
  color: "#687E50",
  textDecoration: "underline",
  wordBreak: "break-all",
}

