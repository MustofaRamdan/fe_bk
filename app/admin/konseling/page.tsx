"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Konseling {
  id: number
  mode: string
  nama: string
  kelas: string
  jurusan: string
  email: string | null
  topik: string
  deskripsi: string
  inginJawabanEmail: boolean
  status: string
  jawaban: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminKonselingPage() {
      const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [data, setData] = useState<Konseling[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"SEMUA" | "MENUNGGU" | "DIPROSES" | "SELESAI">("SEMUA")
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Konseling | null>(null)
  const [jawaban, setJawaban] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch(`${api}/api/konseling`)
      const json = await res.json()
      if (res.ok) setData(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item: Konseling) => {
    setSelected(item)
    setJawaban(item.jawaban || "")
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelected(null)
    setJawaban("")
  }

  const handleSubmitJawaban = async () => {
    if (!selected || !jawaban.trim()) return

    setSending(true)
    try {
      const res = await fetch(`${api}/api/konseling/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      // Update local data
      setData(prev => prev.map(item => 
        item.id === selected.id 
          ? { ...item, jawaban, status: "SELESAI" }
          : item
      ))

      alert("Jawaban berhasil disimpan!")
      closeModal()

    } catch (err: any) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "MENUNGGU": return statusMenunggu
      case "DIPROSES": return statusDiproses
      case "SELESAI": return statusSelesai
      default: return statusMenunggu
    }
  }

  const filteredData = filter === "SEMUA" 
    ? data 
    : data.filter(item => item.status === filter)

  const stats = {
    total: data.length,
    menunggu: data.filter(d => d.status === "MENUNGGU").length,
    diproses: data.filter(d => d.status === "DIPROSES").length,
    selesai: data.filter(d => d.status === "SELESAI").length,
  }

  if (loading) {
    return (
      <div style={pageWrapper}>
        <Header />
        <main style={mainContent}><p style={{padding: 40, textAlign: "center"}}>Loading...</p></main>
      </div>
    )
  }

  return (
    <div style={pageWrapper}>
      <Header />

      <main style={mainContent}>
        {/* Title */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Konseling</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin/dashboard")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Konseling</span>
          </nav>
        </div>

        {/* Stats Cards */}
        <div style={statsGrid}>
          <div style={statCard}>
            <p style={statLabel}>Total</p>
            <p style={statValue}>{stats.total}</p>
          </div>
          <div style={{...statCard, background: "#fef3c7"}}>
            <p style={{...statLabel, color: "#92400e"}}>Menunggu</p>
            <p style={{...statValue, color: "#92400e"}}>{stats.menunggu}</p>
          </div>
          <div style={{...statCard, background: "#dbeafe"}}>
            <p style={{...statLabel, color: "#1e40af"}}>Diproses</p>
            <p style={{...statValue, color: "#1e40af"}}>{stats.diproses}</p>
          </div>
          <div style={{...statCard, background: "#dcfce7"}}>
            <p style={{...statLabel, color: "#166534"}}>Selesai</p>
            <p style={{...statValue, color: "#166534"}}>{stats.selesai}</p>
          </div>
        </div>

        {/* Filter */}
        <div style={filterBar}>
          {(["SEMUA", "MENUNGGU", "DIPROSES", "SELESAI"] as const).map((f) => (
            <button
              key={f}
              style={{
                ...filterBtn,
                ...(filter === f ? filterBtnActive : {})
              }}
              onClick={() => setFilter(f)}
            >
              {f === "SEMUA" ? "Semua" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={tableCard}>
          {filteredData.length === 0 ? (
            <p style={emptyText}>Tidak ada data konseling</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr style={tableHead}>
                    <th style={th}>ID</th>
                    <th style={th}>Mode</th>
                    <th style={th}>Pengirim</th>
                    <th style={th}>Topik</th>
                    <th style={th}>Status</th>
                    <th style={th}>Tanggal</th>
                    <th style={th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} style={tableRow}>
                      <td style={td}>#{item.id}</td>
                      <td style={td}>
                        <span style={{
                          ...modeBadge,
                          ...(item.mode === "anonim" ? modeAnonim : modeTerdaftar)
                        }}>
                          {item.mode === "anonim" ? "Anonim" : "Terdaftar"}
                        </span>
                      </td>
                      <td style={td}>
                        <div>
                          <p style={{margin: 0, fontWeight: 600, fontSize: 13}}>{item.nama}</p>
                          {item.mode === "terdaftar" && (
                            <p style={{margin: 0, fontSize: 11, color: "#999"}}>
                              {item.kelas} - {item.jurusan}
                            </p>
                          )}
                          {item.email && (
                            <p style={{margin: "2px 0 0", fontSize: 11, color: "#6b7c4e"}}>
                              📧 {item.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td style={td}>
                        <p style={{margin: 0, fontSize: 13}}>{item.topik}</p>
                        <p style={{margin: "4px 0 0", fontSize: 11, color: "#666", maxWidth: 200}}>
                          {item.deskripsi.substring(0, 60)}...
                        </p>
                      </td>
                      <td style={td}>
                        <span style={{...statusBadge, ...getStatusStyle(item.status)}}>
                          {item.status}
                        </span>
                      </td>
                      <td style={td}>
                        <p style={{margin: 0, fontSize: 12}}>
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </p>
                        <p style={{margin: "2px 0 0", fontSize: 11, color: "#999"}}>
                          {new Date(item.createdAt).toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"})}
                        </p>
                      </td>
                      <td style={td}>
                        <button 
                          style={item.status === "SELESAI" ? btnLihat : btnJawab}
                          onClick={() => openModal(item)}
                        >
                          {item.status === "SELESAI" ? "Lihat" : "Jawab"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ==================== MODAL ==================== */}
      {modalOpen && selected && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={modalHeader}>
              <h3 style={modalTitle}>
                {selected.status === "SELESAI" ? "Detail Jawaban" : "Jawab Konseling"}
              </h3>
              <button style={modalClose} onClick={closeModal}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={modalBody}>
              {/* Info Pengirim */}
              <div style={modalSection}>
                <h4 style={modalSectionTitle}>Informasi Pengirim</h4>
                <div style={infoGrid}>
                  <div>
                    <p style={infoLabel}>Mode</p>
                    <p style={infoValue}>{selected.mode === "anonim" ? "Anonim" : "Terdaftar"}</p>
                  </div>
                  <div>
                    <p style={infoLabel}>Nama</p>
                    <p style={infoValue}>{selected.nama}</p>
                  </div>
                  {selected.mode === "terdaftar" && (
                    <>
                      <div>
                        <p style={infoLabel}>Kelas</p>
                        <p style={infoValue}>{selected.kelas}</p>
                      </div>
                      <div>
                        <p style={infoLabel}>Jurusan</p>
                        <p style={infoValue}>{selected.jurusan}</p>
                      </div>
                    </>
                  )}
                  {selected.email && (
                    <div style={{gridColumn: "1 / -1"}}>
                      <p style={infoLabel}>Email (untuk jawaban)</p>
                      <p style={infoValue}>{selected.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Permasalahan */}
              <div style={modalSection}>
                <h4 style={modalSectionTitle}>Permasalahan</h4>
                <div style={topikBadge}>{selected.topik}</div>
                <p style={deskripsiText}>{selected.deskripsi}</p>
              </div>

              {/* Jawaban */}
              <div style={modalSection}>
                <h4 style={modalSectionTitle}>
                  {selected.status === "SELESAI" ? "Jawaban Anda" : "Tulis Jawaban"}
                </h4>
                
                {selected.status === "SELESAI" && selected.jawaban ? (
                  <div style={jawabanBox}>
                    <p style={{margin: 0, lineHeight: 1.6}}>{selected.jawaban}</p>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={jawaban}
                      onChange={(e) => setJawaban(e.target.value)}
                      placeholder="Tulis jawaban untuk siswa ini..."
                      style={modalTextarea}
                      rows={6}
                    />
                    {selected.inginJawabanEmail && selected.email && (
                      <p style={emailNotice}>
                        ℹ️ Jawaban akan dikirim ke email: {selected.email}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={modalFooter}>
              <button style={btnCancel} onClick={closeModal}>Tutup</button>
              {selected.status !== "SELESAI" && (
                <button
                  style={{...btnSubmit, ...(sending || !jawaban.trim() ? btnSubmitDisabled : {})}}
                  onClick={handleSubmitJawaban}
                  disabled={sending || !jawaban.trim()}
                >
                  {sending ? "Mengirim..." : "Simpan Jawaban"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== HEADER ====================
function Header() {
  return (
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
  )
}

// ==================== STYLES ====================

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
  padding: "20px",
  maxWidth: 1200,
  margin: "0 auto",
}

const titleSection = {
  marginBottom: 20,
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

// Stats
const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
  marginBottom: 20,
}

const statCard = {
  background: "white",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
}

const statLabel = {
  fontSize: 12,
  color: "#666",
  margin: "0 0 4px 0",
}

const statValue = {
  fontSize: 24,
  fontWeight: 700,
  color: "#333",
  margin: 0,
}

// Filter
const filterBar = {
  display: "flex",
  gap: 8,
  marginBottom: 16,
}

const filterBtn = {
  padding: "8px 16px",
  borderRadius: 20,
  border: "1px solid #ddd",
  background: "white",
  color: "#666",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
}

const filterBtnActive = {
  background: "#6b7c4e",
  color: "white",
  borderColor: "#6b7c4e",
}

// Table
const tableCard = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  overflow: "hidden",
}

const tableWrapper = {
  overflowX: "auto" as const,
}

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const tableHead = {
  background: "#f8f9f5",
}

const th = {
  padding: "12px 16px",
  textAlign: "left" as const,
  fontSize: 12,
  fontWeight: 600,
  color: "#666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  borderBottom: "1px solid #eee",
}

const tableRow = {
  borderBottom: "1px solid #f0f0f0",
}

const td = {
  padding: "16px",
  fontSize: 13,
  color: "#333",
  verticalAlign: "top" as const,
}

const emptyText = {
  textAlign: "center" as const,
  color: "#999",
  padding: 40,
  fontSize: 14,
}

// Badges
const modeBadge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 600,
}

const modeAnonim = {
  background: "#f3f4f6",
  color: "#6b7280",
}

const modeTerdaftar = {
  background: "#dbeafe",
  color: "#1e40af",
}

const statusBadge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 600,
}

const statusMenunggu = {
  background: "#fef3c7",
  color: "#92400e",
}

const statusDiproses = {
  background: "#dbeafe",
  color: "#1e40af",
}

const statusSelesai = {
  background: "#dcfce7",
  color: "#166534",
}

// Buttons
const btnJawab = {
  background: "#6b7c4e",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
}

const btnLihat = {
  background: "#e5e7eb",
  color: "#374151",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
}

// ==================== MODAL STYLES ====================

const modalOverlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 1000,
  backdropFilter: "blur(4px)",
}

const modalContent = {
  background: "white",
  borderRadius: 16,
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
}

const modalHeader = {
  padding: "20px 24px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const modalTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: 0,
}

const modalClose = {
  background: "none",
  border: "none",
  fontSize: 20,
  color: "#999",
  cursor: "pointer",
  padding: 0,
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
}

const modalBody = {
  padding: "20px 24px",
  overflowY: "auto" as const,
  flex: 1,
}

const modalSection = {
  marginBottom: 20,
  paddingBottom: 20,
  borderBottom: "1px solid #f0f0f0",
}

const modalSectionTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#6b7c4e",
  margin: "0 0 12px 0",
}

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
}

const infoLabel = {
  fontSize: 11,
  color: "#999",
  margin: "0 0 2px 0",
}

const infoValue = {
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
  margin: 0,
}

const topikBadge = {
  display: "inline-block",
  background: "#f0f4e8",
  color: "#6b7c4e",
  padding: "4px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 12,
}

const deskripsiText = {
  fontSize: 14,
  color: "#555",
  lineHeight: 1.6,
  margin: 0,
  background: "#f8f9f5",
  padding: 16,
  borderRadius: 8,
}

const jawabanBox = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  padding: 16,
  borderRadius: 8,
}

const modalTextarea = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  fontFamily: "inherit",
  resize: "vertical" as const,
  minHeight: 120,
  outline: "none",
  boxSizing: "border-box" as const,
}

const emailNotice = {
  fontSize: 12,
  color: "#6b7c4e",
  margin: "8px 0 0 0",
  background: "#f0f4e8",
  padding: "8px 12px",
  borderRadius: 6,
}

const modalFooter = {
  padding: "16px 24px",
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "flex-end" as const,
  gap: 12,
}

const btnCancel = {
  background: "#e5e7eb",
  color: "#374151",
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
}

const btnSubmit = {
  background: "#6b7c4e",
  color: "white",
  padding: "10px 24px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

const btnSubmitDisabled = {
  opacity: 0.6,
  cursor: "not-allowed",
}