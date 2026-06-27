"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"

type Alumni = {
  id: number
  namaLengkap: string
  tahunLulus: string
  status: string
  namaKampus: string | null
  programStudi: string | null
  tahunMasukKuliah: string | null
  namaPerusahaan: string | null
  tahunMasukKerja: string | null
  namaUsaha: string | null
  tahunAwalUsaha: string | null
  buktiPendukung: string | null
  statusPengajuan: string
  created_at: string
}

type ModalType = "detail" | "setuju" | "tolak" | null

const JENIS_OPTIONS = [
  { value: "SEMUA", label: "Cari semua jenis" },
  { value: "KULIAH", label: "Kuliah" },
  { value: "BEKERJA", label: "Kerja" },
  { value: "WIRAUSAHA", label: "Wirausaha" },
]

export default function PersetujuanAlumniPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [alumnis, setAlumnis] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [searchNama, setSearchNama] = useState("")
  const [filterJenis, setFilterJenis] = useState("SEMUA")
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [animating, setAnimating] = useState(false)

  const fetchAlumnis = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/alumni?statusPengajuan=PENDING`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const json = await res.json()
      setAlumnis(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlumnis()
  }, [])

  const openModal = (alumni: Alumni, type: ModalType) => {
    setSelectedAlumni(alumni)
    setModalType(type)
    setAnimating(true)
  }

const getFileUrl = (path?: string | null) => {
  if (!path) return "#"

  if (path.startsWith("http")) return path

  // hilangkan slash depan
  const cleanPath = path.startsWith("/") ? path.slice(1) : path

  return `${api}/${encodeURI(cleanPath)}`
}

  const closeModal = () => {
    setAnimating(false)
    setTimeout(() => {
      setModalType(null)
      setSelectedAlumni(null)
    }, 350)
  }

  const handleSetujui = async () => {
    if (!selectedAlumni) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/alumni/${selectedAlumni.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ statusPengajuan: "DITERIMA" })
      })
      if (!res.ok) throw new Error("Gagal menyetujui")
      setModalType("setuju")
      fetchAlumnis()
    } catch (err) {
      console.error(err)
    }
  }

  const handleTolak = async () => {
    if (!selectedAlumni) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/alumni/${selectedAlumni.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ statusPengajuan: "DITOLAK", keterangan: "Data tidak valid" })
      })
      if (!res.ok) throw new Error("Gagal menolak")
      setModalType("tolak")
      fetchAlumnis()
    } catch (err) {
      console.error(err)
    }
  }

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-"

  // convert ke ISO
  const iso = dateStr.replace(" ", "T")

  const d = new Date(iso)

  if (isNaN(d.getTime())) return "-"

  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

  // Filter alumni
  const filtered = alumnis.filter((a) => {
    const matchNama = a.namaLengkap.toLowerCase().includes(searchNama.toLowerCase())
    const matchJenis = filterJenis === "SEMUA" || a.status === filterJenis
    return matchNama && matchJenis
  })

  // Get info card berdasarkan status
  const getCardInfo = (alumni: Alumni) => {
    if (alumni.status === "KULIAH") {
      return `${alumni.status} - ${alumni.namaKampus || "?"}\nTahun Masuk: ${alumni.tahunMasukKuliah || "?"}`
    }
    if (alumni.status === "BEKERJA") {
      return `Kerja - ${alumni.namaPerusahaan || "?"}\nTahun Masuk: ${alumni.tahunMasukKerja || "?"}`
    }
    if (alumni.status === "WIRAUSAHA") {
      return `Wirausaha - ${alumni.namaUsaha || "?"}\nBerdiri Sejak: ${alumni.tahunAwalUsaha || "?"}`
    }
    return alumni.status
  }

  // Render detail popup berdasarkan jenis
  const renderDetailContent = () => {
    if (!selectedAlumni) return null

    const a = selectedAlumni

    // Header semua sama
    const header = (
      <>
        <div style={detailHeader}>
          <div style={avatarLarge}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </div>
          <div style={detailHeaderInfo}>
            <h3 style={detailName}>{a.namaLengkap}</h3>
            <p style={detailSub}>Alumni {a.tahunLulus}</p>
          </div>
          <span style={badgeJenis(a.status)}>{a.status}</span>
        </div>
        <div style={detailDivider} />
      </>
    )

    // Konten beda per jenis
    let content = null

    if (a.status === "KULIAH") {
      content = (
        <div style={detailBody}>
          <h4 style={detailSectionTitle}>Detail Data Kuliah</h4>
          <div style={detailRow}>
            <span style={detailLabel}>Perguruan Tinggi</span>
            <span style={detailValue}>{a.namaKampus || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Program Studi</span>
            <span style={detailValue}>{a.programStudi || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Tahun Masuk Kuliah</span>
            <span style={detailValue}>{a.tahunMasukKuliah || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Bukti Pendukung</span>
            <a 
            href={getFileUrl(a.buktiPendukung)}
            target="_blank"
            >
            Lihat Bukti
            </a>
          </div>
        </div>
      )
    } else if (a.status === "BEKERJA") {
      content = (
        <div style={detailBody}>
          <h4 style={detailSectionTitle}>Detail Data Pekerjaan</h4>
          <div style={detailRow}>
            <span style={detailLabel}>Nama Perusahaan</span>
            <span style={detailValue}>{a.namaPerusahaan || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Tahun Masuk Kerja</span>
            <span style={detailValue}>{a.tahunMasukKerja || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Bukti Pendukung</span>
<a 
  href={getFileUrl(a.buktiPendukung)}
  target="_blank"
>
  Lihat Bukti
</a>
          </div>
        </div>
      )
    } else if (a.status === "WIRAUSAHA") {
      content = (
        <div style={detailBody}>
          <h4 style={detailSectionTitle}>Detail Data Usaha</h4>
          <div style={detailRow}>
            <span style={detailLabel}>Nama Usaha</span>
            <span style={detailValue}>{a.namaUsaha || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Berdiri Sejak</span>
            <span style={detailValue}>{a.tahunAwalUsaha || "-"}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Bukti Pendukung</span>
            <a 
            href={getFileUrl(a.buktiPendukung)}
            target="_blank"
            >
            Lihat Bukti
            </a>
          </div>
        </div>
      )
    }

    return (
      <>
        {header}
        {content}
      </>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <main style={mainContent}>
          {/* Title */}
          <div style={titleSection}>
            <h2 style={pageTitle}>Pengajuan Data Alumni</h2>
            <p style={subtitle}>Daftar pengajuan data lanjutan dari alumni yang menunggu persetujuan</p>
          </div>

          {/* Filter & Search */}
          <div style={toolbar}>
            <div style={selectWrapper}>
              <select style={filterSelect} disabled>
                <option>Loading...</option>
              </select>
            </div>
            <div style={searchWrapper}>
              <input type="text" placeholder="Cari nama alumni..." style={searchInput} disabled />
            </div>
          </div>

          {/* List Alumni Skeleton */}
          <div style={listContainer}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{...cardItem, cursor: "default"}} className="animate-pulse">
                <div style={{...avatarSmall, background: "#f3f4f1"}}></div>
                <div style={cardContent}>
                  <div style={{width: "40%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 6}}></div>
                  <div style={{width: "60%", height: 12, background: "#f3f4f1", borderRadius: 4, marginBottom: 6}}></div>
                  <div style={{width: "30%", height: 10, background: "#f3f4f1", borderRadius: 4}}></div>
                </div>
                <div style={cardRight}>
                  <span style={{...badgeMenunggu, background: "#f3f4f1", color: "transparent"}}>Menunggu</span>
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
      <style dangerouslySetInnerHTML={{ __html: modalStyles }} />

      {/* Main Content */}
      <main style={mainContent}>
        {/* Title */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Pengajuan Data Alumni</h2>
          <p style={subtitle}>Daftar pengajuan data lanjutan dari alumni yang menunggu persetujuan</p>
        </div>

        {/* Filter & Search */}
        <div style={toolbar}>
          <div style={selectWrapper}>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              style={filterSelect}
            >
              {JENIS_OPTIONS.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
            <span style={selectArrowSmall}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>

          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Cari nama alumni..."
              value={searchNama}
              onChange={(e) => setSearchNama(e.target.value)}
              style={searchInput}
            />
            <span style={searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </div>

        {/* List Alumni */}
        <div style={listContainer}>
          {filtered.length === 0 ? (
            <div style={emptyState}>
              <p>Tidak ada pengajuan data alumni</p>
            </div>
          ) : (
            filtered.map((a) => (
              <div 
                key={a.id} 
                style={cardItem}
                onClick={() => openModal(a, "detail")}
              >
                <div style={avatarSmall}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ccc">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </div>
                <div style={cardContent}>
                  <p style={cardTitle}>{getCardInfo(a).split('\n')[0]}</p>
                  <p style={cardSub}>{getCardInfo(a).split('\n')[1]}</p>
                  <p style={cardDate}>{formatDate(a.created_at)}</p>
                </div>
                <div style={cardRight}>
                  <span style={badgeMenunggu}>Menunggu</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL */}
      {modalType && (
        <div className={`modal-overlay ${animating ? 'show' : 'hide'}`} onClick={closeModal}>
          
          {/* DETAIL */}
          {modalType === "detail" && selectedAlumni && (
            <div className={`modal-content ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <button style={closeButton} onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {renderDetailContent()}

              <div style={modalActions}>
                <button style={btnTolak} onClick={handleTolak}>Tolak</button>
                <button style={btnSetuju} onClick={handleSetujui}>Setujui</button>
              </div>
            </div>
          )}

          {/* SUKSES SETUJUI */}
          {modalType === "setuju" && selectedAlumni && (
            <div className={`modal-content result-modal ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <h3 style={resultTitle}>Hasil Keputusan</h3>
              
              <div style={resultIconSuccess}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <p style={resultStatusGreen}>Pengajuan Disetujui</p>
              <p style={resultDescGreen}>Data alumni telah berhasil disetujui.</p>

              <div style={resultInfoBox}>
                <div style={resultRow}>
                  <span style={resultLabel}>Nama Alumni</span>
                  <span style={resultValue}>{selectedAlumni.namaLengkap}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Jenis</span>
                  <span style={resultValue}>{selectedAlumni.status}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Tanggal Keputusan</span>
                  <span style={resultValue}>{formatDate(new Date().toISOString())}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Oleh</span>
                  <span style={resultValue}>Guru BK</span>
                </div>
              </div>

              <button style={btnOk} onClick={closeModal}>ok</button>
            </div>
          )}

          {/* TOLAK */}
          {modalType === "tolak" && selectedAlumni && (
            <div className={`modal-content result-modal ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <h3 style={resultTitle}>Hasil Keputusan</h3>
              
              <div style={resultIconReject}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#dc2626" />
                  <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <p style={resultStatusRed}>Pengajuan Ditolak</p>
              <p style={resultDescRed}>Pengajuan data ditolak.</p>

              <div style={resultInfoBox}>
                <div style={resultRow}>
                  <span style={resultLabel}>Nama Alumni</span>
                  <span style={resultValue}>{selectedAlumni.namaLengkap}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Jenis</span>
                  <span style={resultValue}>{selectedAlumni.status}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Tanggal Keputusan</span>
                  <span style={resultValue}>{formatDate(new Date().toISOString())}</span>
                </div>
                <div style={resultRow}>
                  <span style={resultLabel}>Oleh</span>
                  <span style={resultValue}>Guru BK</span>
                </div>
              </div>

              <button style={btnOk} onClick={closeModal}>ok</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

// CSS Animasi
// CSS Animasi - UPDATE untuk centering
const modalStyles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .modal-overlay.show { opacity: 1; }
  .modal-overlay.hide { opacity: 0; }
  
  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 420px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.8) translateY(20px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .modal-content.show {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  .modal-content.hide {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
  
  /* âœ… RESULT MODAL - CENTER EVERYTHING */
  .result-modal {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 40px 32px !important;
  }
  
  .result-modal > * {
    width: 100%;
  }
`

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
  margin: "0 0 4px 0",
}

const subtitle = {
  fontSize: 13,
  color: "#666",
  margin: "0 0 16px 0",
}

const toolbar = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
}

const selectWrapper = {
  position: "relative" as const,
  width: 140,
  flexShrink: 0,
}

const filterSelect = {
  width: "100%",
  padding: "10px 32px 10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 13,
  outline: "none",
  background: "white",
  appearance: "none" as const,
  cursor: "pointer",
  boxSizing: "border-box" as const,
}

const selectArrowSmall = {
  position: "absolute" as const,
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
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
  fontSize: 13,
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

const listContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
}

const cardItem = {
  background: "white",
  borderRadius: 10,
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
}

const avatarSmall = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}

const cardContent = {
  flex: 1,
}

const cardTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#333",
  margin: "0 0 2px 0",
  whiteSpace: "pre-line" as const,
}

const cardSub = {
  fontSize: 12,
  color: "#666",
  margin: "0 0 2px 0",
}

const cardDate = {
  fontSize: 12,
  color: "#999",
  margin: 0,
}

const cardRight = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
}

const badgeMenunggu = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 500,
}

const emptyState = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#999",
}

// Modal Detail Styles
const closeButton = {
  position: "absolute" as const,
  top: 16,
  right: 16,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
}

const detailHeader = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
}

const avatarLarge = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const detailHeaderInfo = {
  flex: 1,
}

const detailName = {
  fontSize: 16,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 2px 0",
}

const detailSub = {
  fontSize: 13,
  color: "#666",
  margin: 0,
}

const badgeJenis = (jenis: string) => ({
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 500,
  border: "1px solid",
  ...(jenis === "KULIAH" ? { color: "#2563eb", borderColor: "#2563eb", background: "#eff6ff" } :
     jenis === "BEKERJA" ? { color: "#7c3aed", borderColor: "#7c3aed", background: "#f5f3ff" } :
     { color: "#059669", borderColor: "#059669", background: "#ecfdf5" }),
})

const detailDivider = {
  height: 1,
  background: "#eee",
  margin: "0 0 16px 0",
}

const detailBody = {
  marginBottom: 20,
}

const detailSectionTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 12px 0",
}

const detailRow = {
  display: "flex",
  justifyContent: "space-between" as const,
  padding: "8px 0",
  borderBottom: "1px solid #f0f0f0",
}

const detailLabel = {
  fontSize: 13,
  color: "#666",
  flex: 1,
}

const detailValue = {
  fontSize: 13,
  color: "#333",
  fontWeight: 500,
  flex: 1,
  textAlign: "right" as const,
}

const detailLink = {
  fontSize: 13,
  color: "#3b82f6",
  textDecoration: "underline",
  flex: 1,
  textAlign: "right" as const,
}

const modalActions = {
  display: "flex",
  gap: 12,
  marginTop: 4,
}

const btnTolak = {
  flex: 1,
  background: "white",
  color: "#dc2626",
  padding: "12px 20px",
  border: "2px solid #dc2626",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

const btnSetuju = {
  flex: 1,
  background: "#22c55e",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

// Result Modal Styles
const resultTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 20px 0",
}

const resultIconSuccess = {
  marginBottom: 16,
  display: "flex",
  justifyContent: "center",
}

const resultIconReject = {
  marginBottom: 16,
  display: "flex",
  justifyContent: "center",
}

const resultStatusGreen = {
  fontSize: 16,
  fontWeight: 700,
  color: "#22c55e",
  margin: "0 0 4px 0",
}

const resultStatusRed = {
  fontSize: 16,
  fontWeight: 700,
  color: "#dc2626",
  margin: "0 0 4px 0",
}

const resultDescGreen = {
  fontSize: 14,
  color: "#22c55e",
  margin: "0 0 20px 0",
}

const resultDescRed = {
  fontSize: 14,
  color: "#dc2626",
  margin: "0 0 20px 0",
}

const resultInfoBox = {
  background: "#f9f9f9",
  borderRadius: 8,
  padding: 16,
  marginBottom: 20,
  width: "100%",
}

const resultRow = {
  display: "flex",
  justifyContent: "space-between" as const,
  padding: "6px 0",
}

const resultLabel = {
  fontSize: 13,
  color: "#666",
}

const resultValue = {
  fontSize: 13,
  color: "#333",
  fontWeight: 500,
}

const btnOk = {
  background: "#666",
  color: "white",
  padding: "12px 40px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  minWidth: 120,
}