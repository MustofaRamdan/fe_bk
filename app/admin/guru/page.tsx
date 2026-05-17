"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Guru = {
  id: number
  nama: string
  jabatan: string
  kelas: string
  foto?: string | null
}

export default function GuruPage() {
    const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [data, setData] = useState<Guru[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchGuru = async () => {
    try {
      const res = await fetch(`${api}/api/guru`)
      const json = await res.json()
      setData(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuru()
  }, [])

  const filtered = data.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus?")) return
    try {
      await fetch(`${api}/api/guru/${id}`, { method: "DELETE" })
      fetchGuru()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div style={pageWrapper}>
        <header style={header}><h1 style={headerTitle}>Admin BK</h1></header>
        <main style={mainContent}>
          <p style={{ padding: 40, textAlign: "center", color: "#666" }}>Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div style={pageWrapper}>
      {/* Inject CSS untuk media query */}
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />

      {/* Header */}
      <header style={header}>
        <button style={menuButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 style={headerTitle}>Admin BK</h1>
        <div style={userIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Data Guru BK</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Data Guru BK</span>
          </nav>
        </div>

        {/* Search & Add Button */}
        <div style={toolbar}>
          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Cari guru..."
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
          <button style={btnAdd} onClick={() => router.push("/guru/tambah")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah
          </button>
        </div>

        {/* Grid Cards */}
        {filtered.length === 0 ? (
          <div style={emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p>Belum ada data guru</p>
          </div>
        ) : (
          <div className="guru-grid">
            {filtered.map((g) => (
              <div key={g.id} style={card}>
                {/* Foto */}
                <div style={imageWrapper}>
                  <img
                    src={
                      g.foto
                        ? `${api}${g.foto}`
                        : "/no-image.png"
                    }
                    alt={g.nama}
                    style={cardImage}
                  />
                  <div style={kelasBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    {g.kelas}
                  </div>
                </div>

                {/* Content */}
                <div style={cardContent}>
                  <h3 style={cardName}>{g.nama}</h3>
                  <p style={cardJabatan}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {g.jabatan}
                  </p>

                  {/* Actions */}
                  <div style={cardActions}>
                    <button style={btnEdit} onClick={() => router.push(`/guru/edit/${g.id}`)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button style={btnDelete} onClick={() => handleDelete(g.id)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// CSS Media Query
const responsiveStyles = `
  .guru-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  @media (min-width: 768px) {
    .guru-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }
  
  @media (min-width: 1024px) {
    .guru-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
`

// Styles
const pageWrapper = {
  background: "#e8e8e8",
  minHeight: "100vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const header = {
  background: "#6b7c4e",
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
  padding: "16px",
  maxWidth: 1200,
  margin: "0 auto",
}

const titleSection = {
  marginBottom: 16,
}

const pageTitle = {
  fontSize: 20,
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
  gap: 10,
  marginBottom: 16,
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
  background: "#6b7c4e",
  color: "white",
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap" as const,
}

const emptyState = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#999",
}

const card = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
}

const imageWrapper = {
  position: "relative" as const,
  width: "100%",
  aspectRatio: "3/4",
  overflow: "hidden",
}

const cardImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
}

const kelasBadge = {
  position: "absolute" as const,
  bottom: 6,
  left: 6,
  background: "rgba(107, 124, 78, 0.9)",
  color: "white",
  padding: "3px 8px",
  borderRadius: 20,
  fontSize: 10,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: 4,
}

const cardContent = {
  padding: "10px 12px 12px",
}

const cardName = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 4px 0",
}

const cardJabatan = {
  fontSize: 12,
  color: "#666",
  margin: "0 0 10px 0",
  display: "flex",
  alignItems: "center",
}

const cardActions = {
  display: "flex",
  gap: 6,
}

const btnEdit = {
  flex: 1,
  background: "#166534",
  color: "white",
  padding: "6px 8px",
  border: "none",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
}

const btnDelete = {
  flex: 1,
  background: "#dc2626",
  color: "white",
  padding: "6px 8px",
  border: "none",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
}