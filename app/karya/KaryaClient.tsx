"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"

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
              onChange={(e) => setSearch(e.target.value)}
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
          {filtered.length === 0 ? (
            <div style={emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Belum ada karya siswa</p>
            </div>
          ) : (
            filtered.map((k) => (
              <div key={k.id} style={card}>
                {/* Thumbnail */}
                <div style={thumbnailWrapper}>
                  <img
                    src={
                      k.thumbnail
                        ? `${apiUrl}${k.thumbnail}`
                        : "/no-image.png"
                    }
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
const card = { background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)" }
const thumbnailWrapper = { width: "100%", height: 200, overflow: "hidden" }
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
