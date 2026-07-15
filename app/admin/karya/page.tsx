"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import Pagination from "@/components/Pagination"

type Karya = {
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
  disetujuiOleh: string | null
}

export default function KaryaSiswaPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [karyas, setKaryas] = useState<Karya[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const fetchKaryas = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/karya?status=DITERIMA`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const json = await res.json()
      setKaryas(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKaryas()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus karya ini?")) return
    try {
      const token = localStorage.getItem("token")
      await fetch(`${api}/api/karya/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      fetchKaryas()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const filtered = karyas.filter((k) => {
    const judul = k.judul || ""
    const namaPembuat = k.namaPembuat || ""
    return (
      judul.toLowerCase().includes(search.toLowerCase()) ||
      namaPembuat.toLowerCase().includes(search.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <AdminLayout>
        <main style={mainContent}>
          {/* Title & Breadcrumb */}
          <div style={titleSection}>
            <h2 style={pageTitle}>Karya Siswa</h2>
            <nav style={breadcrumb}>
              <span style={breadcrumbItem}>Dashboard</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbActive}>Karya Siswa</span>
            </nav>
          </div>

          {/* Search & Add Button */}
          <div style={toolbar}>
            <div style={searchWrapper}>
              <input type="text" placeholder="Cari..." style={searchInput} disabled />
            </div>
            <button style={{...btnAdd, opacity: 0.6}} disabled>Tambah Data</button>
          </div>

          {/* Cards Skeletons */}
          <div style={cardsContainer}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={card} className="animate-pulse">
                <div style={{...thumbnailWrapper, background: "#f3f4f1"}}></div>
                <div style={cardContent}>
                  <div style={{width: "50%", height: 20, background: "#f3f4f1", borderRadius: 4, marginBottom: 12}}></div>
                  <div style={{width: "100%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
                  <div style={{width: "80%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 16}}></div>
                  <div style={{width: "40%", height: 12, background: "#f3f4f1", borderRadius: 4, marginBottom: 12}}></div>
                  <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
                    <div style={{width: 70, height: 26, background: "#f3f4f1", borderRadius: 6}}></div>
                    <div style={{width: 70, height: 26, background: "#f3f4f1", borderRadius: 6}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Karya Siswa</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Karya Siswa</span>
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
          <button style={btnAdd} onClick={() => router.push("/karya/tambah?from=admin")}>
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
              <div key={k.id} style={card}>
                {/* Thumbnail */}
                <div style={thumbnailWrapper}>
                  <img
                    src={
                      k.thumbnail
                        ? `${process.env.NEXT_PUBLIC_API_URL}${k.thumbnail}`
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
                    {k.disetujuiOleh && (
                      <div style={infoRow}>
                        <span style={infoLabel}>Disetujui</span>
                        <span style={infoSeparator}>:</span>
                        <span style={{ ...infoValue, color: "#166534", fontWeight: 600 }}>{k.disetujuiOleh}</span>
                      </div>
                    )}
                  </div>

                  {/* Tanggal */}
                  <p style={cardDate}>{formatDate(k.createdAt)}</p>

                  {/* Actions */}
                  <div style={cardActions}>
                    <button
                      style={btnEdit}
                      onClick={() => router.push(`/admin/karya/edit/${k.id}`)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      style={btnDelete}
                      onClick={() => handleDelete(k.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Hapus
                    </button>
                  </div>
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
      </main>
    </AdminLayout>
  )
}

// Styles
const pageWrapper = {
  background: "#e8e8e8",
  minHeight: "100vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const header = {
  background: "#687E50",
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
}

const menuButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
}

const headerTitle = {
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
  letterSpacing: "0.5px",
}

const userIcon = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "2px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}

const mainContent = {
  padding: "20px",
  maxWidth: 800,
  margin: "0 auto",
}

const titleSection = {
  marginBottom: 16,
}

const pageTitle = {
  fontSize: 22,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 6px 0",
}

const breadcrumb = {
  fontSize: 12,
  color: "#666",
  display: "flex",
  alignItems: "center",
  gap: 6,
}

const breadcrumbItem = {
  color: "#666",
  cursor: "pointer",
}

const breadcrumbSeparator = {
  color: "#999",
  fontSize: 14,
}

const breadcrumbActive = {
  color: "#333",
  fontWeight: 600,
}

const toolbar = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
  alignItems: "center",
}

const searchWrapper = {
  position: "relative" as const,
  flex: 1,
}

const searchInput = {
  width: "100%",
  padding: "10px 36px 10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  background: "white",
  boxSizing: "border-box" as const,
}

const searchIcon = {
  position: "absolute" as const,
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
}

const btnAdd = {
  background: "#687E50",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap" as const,
}

const cardsContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
}

const card = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
}

const thumbnailWrapper = {
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  background: "#f0f2eb",
}

const thumbnailImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
}

const cardContent = {
  padding: "16px 20px 20px",
}

const cardTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 8px 0",
}

const cardDeskripsi = {
  fontSize: 14,
  color: "#555",
  lineHeight: 1.6,
  margin: "0 0 12px 0",
}

const linkSection = {
  marginBottom: 12,
}

const sectionLabel = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 4px 0",
}

const linkUrl = {
  fontSize: 14,
  color: "#3b82f6",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
}

const infoSection = {
  marginBottom: 12,
}

const infoRow = {
  display: "flex",
  fontSize: 14,
  color: "#555",
  marginBottom: 2,
}

const infoLabel = {
  width: 70,
  flexShrink: 0,
}

const infoSeparator = {
  width: 20,
  flexShrink: 0,
}

const infoValue = {
  flex: 1,
}

const cardDate = {
  fontSize: 13,
  color: "#999",
  margin: "0 0 12px 0",
}

const cardActions = {
  display: "flex",
  justifyContent: "flex-end" as const,
  gap: 8,
}

const btnEdit = {
  background: "#166534",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4,
}

const btnDelete = {
  background: "#dc2626",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4,
}

const emptyState = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#999",
}