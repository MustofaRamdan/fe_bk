"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"

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
  keterangan: string | null
  email: string | null
  inginNotifEmail: boolean
  createdAt: string
}

type ModalType = "detail" | "setuju" | "tolak" | "tolakForm" | null

export default function PersetujuanPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [karyas, setKaryas] = useState<Karya[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKarya, setSelectedKarya] = useState<Karya | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [animating, setAnimating] = useState(false)
  
  // State untuk alasan penolakan
  const [alasanTolak, setAlasanTolak] = useState("")
  const [alasanError, setAlasanError] = useState("")

  const fetchKaryas = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/karya`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const json = await res.json()
      const pending = (json.data || []).filter((k: Karya) => k.status === "PENDING")
      setKaryas(pending)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKaryas()
  }, [])

  const openModal = (karya: Karya, type: ModalType) => {
    setSelectedKarya(karya)
    setModalType(type)
    setAnimating(true)
    // Reset alasan
    setAlasanTolak("")
    setAlasanError("")
  }

  const closeModal = () => {
    setAnimating(false)
    setTimeout(() => {
      setModalType(null)
      setSelectedKarya(null)
      setAlasanTolak("")
      setAlasanError("")
    }, 350)
  }

  const handleSetujui = async () => {
    if (!selectedKarya) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/karya/${selectedKarya.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ 
          status: "DITERIMA",
          // Kirim notifikasi email kalau siswa minta
          kirimNotif: selectedKarya.inginNotifEmail && selectedKarya.email
        })
      })
      if (!res.ok) throw new Error("Gagal menyetujui")
      setModalType("setuju")
      fetchKaryas()
    } catch (err) {
      console.error(err)
    }
  }

  // Buka form alasan penolakan
  const handleBukaTolak = () => {
    setModalType("tolakForm")
    setAlasanTolak("")
    setAlasanError("")
  }

  // Kirim penolakan dengan alasan
  const handleTolak = async () => {
    if (!selectedKarya) return
    
    // Validasi alasan
    if (!alasanTolak.trim()) {
      setAlasanError("Alasan penolakan wajib diisi")
      return
    }

    if (alasanTolak.trim().length < 10) {
      setAlasanError("Alasan minimal 10 karakter")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/karya/${selectedKarya.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ 
          status: "DITOLAK", 
          keterangan: alasanTolak.trim(),
          // Kirim notifikasi email kalau siswa minta
          kirimNotif: selectedKarya.inginNotifEmail && selectedKarya.email
        })
      })
      if (!res.ok) throw new Error("Gagal menolak")
      setModalType("tolak")
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

  if (loading) {
    return (
      <AdminLayout>
        <main style={mainContent}>
          <p style={{ padding: 40, textAlign: "center", color: "#666" }}>Loading...</p>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: modalStyles }} />

      <main style={mainContent}>
        <h2 style={pageTitle}>Karya Menunggu Persetujuan</h2>

        <div style={listContainer}>
          {karyas.length === 0 ? (
            <div style={emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p>Tidak ada karya menunggu persetujuan</p>
            </div>
          ) : (
            karyas.map((k) => (
              <div key={k.id} style={listItem} onClick={() => openModal(k, "detail")}>
                <div style={thumbnailWrapper}>
                  <img
                    src={
                      k.thumbnail
                        ? `${api}${k.thumbnail}`
                        : "/no-image.png"
                    }
                    alt={k.judul}
                    style={thumbnailImage}
                  />
                </div>
                <div style={itemContent}>
                  <h3 style={itemTitle}>{k.judul}</h3>
                  <p style={itemMeta}>Dikirim oleh: {k.namaPembuat}</p>
                  <p style={itemMeta}>kelas: {k.kelas}</p>
                  <p style={itemMeta}>Jurusan: {k.jurusan}</p>
                  <p style={itemDate}>{formatDate(k.createdAt)}</p>
                  {k.inginNotifEmail && k.email && (
                    <p style={emailBadge}>ðŸ“§ Notif Email: {k.email}</p>
                  )}
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
          {modalType === "detail" && selectedKarya && (
            <div className={`modal-content ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <button style={closeButton} onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <h3 style={modalTitle}>Detail Karya</h3>

              <div style={detailLayout}>
                <div style={detailImageWrapper}>
                  <img
                    src={
                      selectedKarya.thumbnail
                        ? `${api}${selectedKarya.thumbnail}`
                        : "/no-image.png"
                    }
                    alt={selectedKarya.judul}
                    style={detailImage}
                  />
                </div>

                <div style={detailInfo}>
                  <div style={detailSection}>
                    <h4 style={detailLabel}>Judul</h4>
                    <p style={detailValue}>{selectedKarya.judul}</p>
                  </div>

                  <div style={detailSection}>
                    <h4 style={detailLabel}>Deskripsi</h4>
                    <p style={detailValue}>{selectedKarya.deskripsi}</p>
                  </div>

                  {selectedKarya.link && (
                    <div style={detailSection}>
                      <h4 style={detailLabel}>Link Karya</h4>
                      <a href={selectedKarya.link} target="_blank" rel="noopener noreferrer" style={detailLink}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {selectedKarya.link}
                      </a>
                    </div>
                  )}

                  <div style={detailSection}>
                    <h4 style={detailLabel}>Dikirim oleh</h4>
                    <p style={detailValue}>
                      {selectedKarya.namaPembuat}<br/>
                      kelas: {selectedKarya.kelas}<br/>
                      Jurusan: {selectedKarya.jurusan}
                    </p>
                  </div>

                  {selectedKarya.inginNotifEmail && selectedKarya.email && (
                    <div style={detailSection}>
                      <h4 style={detailLabel}>Email Notifikasi</h4>
                      <p style={detailValue}>{selectedKarya.email}</p>
                    </div>
                  )}

                  <p style={detailDate}>{formatDate(selectedKarya.createdAt)}</p>
                </div>
              </div>

              <div style={modalActions}>
                <button style={btnTolak} onClick={handleBukaTolak}>Tolak</button>
                <button style={btnSetuju} onClick={handleSetujui}>Setujui</button>
              </div>
            </div>
          )}

          {/* FORM ALASAN PENOLAKAN */}
          {modalType === "tolakForm" && selectedKarya && (
            <div className={`modal-content ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <button style={closeButton} onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div style={tolakHeader}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <h3 style={tolakTitle}>Tolak Karya</h3>
              </div>

              <div style={tolakInfo}>
                <p style={tolakKaryaName}>{selectedKarya.judul}</p>
                <p style={tolakPembuat}>oleh {selectedKarya.namaPembuat}</p>
              </div>

              <div style={formGroup}>
                <label style={label}>
                  Alasan Penolakan <span style={required}>*</span>
                </label>
                <textarea
                  value={alasanTolak}
                  onChange={(e) => {
                    setAlasanTolak(e.target.value)
                    setAlasanError("")
                  }}
                  placeholder="Jelaskan alasan mengapa karya ini ditolak (minimal 10 karakter)..."
                  style={{
                    ...textarea,
                    borderColor: alasanError ? "#ef4444" : "#ddd"
                  }}
                  rows={5}
                />
                {alasanError && <p style={errorText}>{alasanError}</p>}
                <p style={charCount}>{alasanTolak.length} karakter</p>
              </div>

              <div style={tolakPreview}>
                <h4 style={previewLabel}>Preview Pesan ke Siswa:</h4>
                <div style={previewBox}>
                  <p style={previewText}>
                    Halo {selectedKarya.namaPembuat},<br/><br/>
                    Karya Anda dengan judul <strong>"{selectedKarya.judul}"</strong> belum dapat kami tampilkan dengan alasan:<br/><br/>
                    <em>{alasanTolak || "(Belum diisi)"}</em><br/><br/>
                    Silakan perbaiki dan kirim ulang. Terima kasih.
                  </p>
                </div>
              </div>

              <div style={modalActions}>
                <button style={btnCancel} onClick={() => setModalType("detail")}>Kembali</button>
                <button 
                  style={btnTolakConfirm}
                  onClick={handleTolak}
                >
                  Kirim Penolakan
                </button>
              </div>
            </div>
          )}

          {/* SUKSES SETUJUI */}
          {modalType === "setuju" && (
            <div className={`modal-content success-modal ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <div style={successIconWrapper}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={successTitle}>Karya berhasil disetujui</h3>
              <p style={successText}>Karya ditampilkan di halaman Karya Siswa.</p>
              {selectedKarya?.inginNotifEmail && selectedKarya?.email && (
                <p style={successText}>Notifikasi telah dikirim ke {selectedKarya.email}</p>
              )}
              <button style={btnOk} onClick={closeModal}>ok</button>
            </div>
          )}

          {/* SUKSES TOLAK */}
          {modalType === "tolak" && (
            <div className={`modal-content success-modal ${animating ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
              <div style={successIconWrapper}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#dc2626" />
                  <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={successTitle}>Karya Ditolak</h3>
              <p style={successText}>Karya tidak ditampilkan di halaman Karya Siswa.</p>
              {selectedKarya?.inginNotifEmail && selectedKarya?.email && (
                <p style={successText}>Notifikasi penolakan telah dikirim ke {selectedKarya.email}</p>
              )}
              <button style={btnOk} onClick={closeModal}>ok</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

// CSS Animasi
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
    padding: 32px;
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.7) translateY(30px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
  }
  
  .modal-content.show {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  
  .modal-content.hide {
    transform: scale(0.7) translateY(30px);
    opacity: 0;
  }
  
  .success-modal {
    text-align: center;
    padding: 40px 32px;
    align-items: center;
    justify-content: center;
    max-width: 420px;
  }
`

// ============ STYLES ============

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

const pageTitle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 20px 0",
}

const listContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
}

const listItem = {
  background: "white",
  borderRadius: 12,
  padding: "12px",
  display: "flex",
  gap: 12,
  cursor: "pointer",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
}

const thumbnailWrapper = {
  width: 80,
  height: 80,
  borderRadius: 8,
  overflow: "hidden",
  flexShrink: 0,
}

const thumbnailImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
}

const itemContent = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
}

const itemTitle = {
  fontSize: 15,
  fontWeight: 600,
  color: "#333",
  margin: "0 0 4px 0",
}

const itemMeta = {
  fontSize: 12,
  color: "#666",
  margin: "0 0 2px 0",
}

const itemDate = {
  fontSize: 12,
  color: "#999",
  margin: "4px 0 0 0",
}

const emailBadge = {
  fontSize: 11,
  color: "#687E50",
  background: "#f0f4e8",
  padding: "2px 8px",
  borderRadius: 10,
  margin: "4px 0 0 0",
  display: "inline-block",
}

const emptyState = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#999",
}

const closeButton = {
  position: "absolute" as const,
  top: 16,
  right: 16,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
}

const modalTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 20px 0",
}

// Detail styles
const detailLayout = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
  width: "100%",
}

const detailImageWrapper = {
  width: "100%",
  borderRadius: 12,
  overflow: "hidden",
}

const detailImage = {
  width: "100%",
  height: "auto",
  objectFit: "cover" as const,
  display: "block",
}

const detailInfo = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  width: "100%",
}

const detailSection = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 4,
}

const detailLabel = {
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
  margin: 0,
}

const detailValue = {
  fontSize: 14,
  color: "#555",
  lineHeight: 1.5,
  margin: 0,
}

const detailLink = {
  fontSize: 14,
  color: "#687E50",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  wordBreak: "break-all" as const,
}

const detailDate = {
  fontSize: 13,
  color: "#999",
  margin: "4px 0 0 0",
}

const modalActions = {
  display: "flex",
  gap: 12,
  marginTop: 20,
  width: "100%",
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

// Tolak Form styles
const tolakHeader = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
}

const tolakTitle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#dc2626",
  margin: 0,
}

const tolakInfo = {
  background: "#fef2f2",
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
}

const tolakKaryaName = {
  fontSize: 15,
  fontWeight: 600,
  color: "#333",
  margin: "0 0 4px 0",
}

const tolakPembuat = {
  fontSize: 13,
  color: "#666",
  margin: 0,
}

const formGroup = {
  marginBottom: 16,
  width: "100%",
}

const label = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  color: "#333",
  marginBottom: 6,
}

const required = {
  color: "#dc2626",
}

const textarea = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  fontFamily: "inherit",
  resize: "vertical" as const,
  minHeight: 100,
  outline: "none",
  boxSizing: "border-box" as const,
  lineHeight: 1.5,
}

const errorText = {
  fontSize: 12,
  color: "#dc2626",
  margin: "4px 0 0 0",
}

const charCount = {
  fontSize: 11,
  color: "#999",
  margin: "4px 0 0 0",
  textAlign: "right" as const,
}

const tolakPreview = {
  background: "#f8f9f5",
  padding: 16,
  borderRadius: 8,
  marginBottom: 16,
  width: "100%",
}

const previewLabel = {
  fontSize: 12,
  fontWeight: 600,
  color: "#687E50",
  margin: "0 0 8px 0",
}

const previewBox = {
  background: "white",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #e0e5d6",
}

const previewText = {
  fontSize: 13,
  color: "#555",
  lineHeight: 1.6,
  margin: 0,
}

const btnCancel = {
  flex: 1,
  background: "#e5e7eb",
  color: "#374151",
  padding: "12px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
}

const btnTolakConfirm = {
  flex: 1,
  background: "#dc2626",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

// Success styles
const successIconWrapper = {
  display: "flex",
  justifyContent: "center" as const,
  alignItems: "center",
  marginBottom: 20,
  width: "100%",
}

const successTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
}

const successText = {
  fontSize: 14,
  color: "#666",
  margin: "0 0 8px 0",
  lineHeight: 1.5,
  textAlign: "center" as const,
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
  marginTop: 12,
} 