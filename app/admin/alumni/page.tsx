"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import Pagination from "@/components/Pagination"

interface Alumni {
  id: number
  namaLengkap: string
  tahunLulus: string
  status: string
  namaKampus: string | null
  programStudi: string | null
  tahunMasukKuliah: string | null
  jalurMasuk: string | null
  namaPerusahaan: string | null
  tahunMasukKerja: string | null
  namaUsaha: string | null
  tahunAwalUsaha: string | null
  buktiPendukung: string | null
  disetujuiOleh: string | null
  createdAt: string
}

export default function AdminAlumniPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  const router = useRouter()
  const [data, setData] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"KULIAH" | "BEKERJA" | "WIRAUSAHA">("KULIAH")
  const [search, setSearch] = useState("")
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchAlumnis = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/alumni?statusPengajuan=DITERIMA`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      const json = await res.json()
      setData(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlumnis()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data alumni ini? Tindakan ini tidak dapat dibatalkan.")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/alumni/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error("Gagal menghapus data")
      alert("Data alumni berhasil dihapus.")
      fetchAlumnis()
      if (selectedAlumni?.id === id) {
        closeDetailModal()
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat menghapus data.")
    }
  }

  const openDetailModal = (alumni: Alumni) => {
    setSelectedAlumni(alumni)
    setDetailModalOpen(true)
    setAnimating(true)
  }

  const closeDetailModal = () => {
    setAnimating(false)
    setTimeout(() => {
      setDetailModalOpen(false)
      setSelectedAlumni(null)
    }, 300)
  }

  const getFileUrl = (path?: string | null) => {
    if (!path) return "#"
    if (path.startsWith("http")) return path
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${api}/${encodeURI(cleanPath)}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "-"
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const filtered = data
    .filter((a) => a.status === activeTab)
    .filter((a) =>
      a.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      (a.namaKampus || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.programStudi || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.namaPerusahaan || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.namaUsaha || "").toLowerCase().includes(search.toLowerCase())
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
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Title */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 4px 0" }}>Daftar Alumni</h2>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Kelola data penelusuran lulusan yang telah disetujui.</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => {
              setActiveTab("KULIAH")
              setCurrentPage(1)
            }}
            className={`tab-btn ${activeTab === "KULIAH" ? "active" : ""}`}
          >
            Kuliah
          </button>
          <button
            onClick={() => {
              setActiveTab("BEKERJA")
              setCurrentPage(1)
            }}
            className={`tab-btn ${activeTab === "BEKERJA" ? "active" : ""}`}
          >
            Bekerja
          </button>
          <button
            onClick={() => {
              setActiveTab("WIRAUSAHA")
              setCurrentPage(1)
            }}
            className={`tab-btn ${activeTab === "WIRAUSAHA" ? "active" : ""}`}
          >
            Wirausaha
          </button>
        </div>

        {/* SEARCH BAR */}
        <div style={{ marginBottom: "20px" }}>
          <div style={searchWrapper}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder={`Cari nama, ${activeTab === "KULIAH" ? "kampus, atau jurusan" : activeTab === "BEKERJA" ? "perusahaan" : "nama usaha"}...`}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={searchInput}
            />
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div className="spinner" style={{ margin: "0 auto 12px" }}></div>
            <p>Memuat data alumni...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div style={emptyState}>
            <p>Tidak ada data alumni yang sesuai</p>
          </div>
        ) : (
          <>
            <div className="admin-alumni-grid">
              {paginated.map((a) => (
                <div key={a.id} className="alumni-admin-card">
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div className="avatar">
                      {getInitials(a.namaLengkap)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={alumniName}>{a.namaLengkap}</h3>
                      <p style={alumniSub}>Lulusan {a.tahunLulus}</p>
                    </div>
                  </div>

                  <div className="card-divider" />

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {a.status === "KULIAH" && (
                      <>
                        <div className="info-row"><span className="label">Kampus:</span><span className="value">{a.namaKampus || "-"}</span></div>
                        <div className="info-row"><span className="label">Prodi:</span><span className="value">{a.programStudi || "-"}</span></div>
                      </>
                    )}
                    {a.status === "BEKERJA" && (
                      <>
                        <div className="info-row"><span className="label">Perusahaan:</span><span className="value">{a.namaPerusahaan || "-"}</span></div>
                        <div className="info-row"><span className="label">Tahun Masuk:</span><span className="value">{a.tahunMasukKerja || "-"}</span></div>
                      </>
                    )}
                    {a.status === "WIRAUSAHA" && (
                      <>
                        <div className="info-row"><span className="label">Nama Usaha:</span><span className="value">{a.namaUsaha || "-"}</span></div>
                        <div className="info-row"><span className="label">Berdiri:</span><span className="value">{a.tahunAwalUsaha || "-"}</span></div>
                      </>
                    )}
                    {a.disetujuiOleh && (
                      <div className="info-row" style={{ marginTop: "4px" }}>
                        <span className="label" style={{ color: "#166534" }}>Di-acc oleh:</span>
                        <span className="value" style={{ color: "#166534", fontWeight: 600 }}>{a.disetujuiOleh}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-divider" />

                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(a.id)}
                    >
                      Hapus
                    </button>
                    <button
                      className="btn-detail"
                      onClick={() => openDetailModal(a)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {/* DETAIL MODAL */}
      {detailModalOpen && selectedAlumni && (
        <div className={`modal-overlay ${animating ? "show" : "hide"}`} onClick={closeDetailModal}>
          <div className={`modal-content ${animating ? "show" : "hide"}`} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeDetailModal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "#333" }}>Detail Lengkap Alumni</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={detailSection}>
                <label style={detailLabel}>Nama Lengkap</label>
                <p style={detailValue}>{selectedAlumni.namaLengkap}</p>
              </div>

              <div style={detailSection}>
                <label style={detailLabel}>Tahun Lulus</label>
                <p style={detailValue}>Lulusan SMK Tahun {selectedAlumni.tahunLulus}</p>
              </div>

              <div style={detailSection}>
                <label style={detailLabel}>Status Kegiatan</label>
                <p style={{ ...detailValue, fontWeight: 700, color: "#687E50" }}>{selectedAlumni.status}</p>
              </div>

              <div style={{ height: "1px", background: "#f0f0f0" }} />

              {/* DYNAMIC BY STATUS */}
              {selectedAlumni.status === "KULIAH" && (
                <>
                  <div style={detailSection}>
                    <label style={detailLabel}>Perguruan Tinggi</label>
                    <p style={detailValue}>{selectedAlumni.namaKampus || "-"}</p>
                  </div>
                  <div style={detailSection}>
                    <label style={detailLabel}>Program Studi</label>
                    <p style={detailValue}>{selectedAlumni.programStudi || "-"}</p>
                  </div>
                  <div style={detailSection}>
                    <label style={detailLabel}>Tahun Masuk Kuliah</label>
                    <p style={detailValue}>{selectedAlumni.tahunMasukKuliah || "-"}</p>
                  </div>
                  <div style={detailSection}>
                    <label style={detailLabel}>Jalur Masuk</label>
                    <p style={detailValue}>{selectedAlumni.jalurMasuk || "-"}</p>
                  </div>
                </>
              )}

              {selectedAlumni.status === "BEKERJA" && (
                <>
                  <div style={detailSection}>
                    <label style={detailLabel}>Nama Perusahaan / Tempat Kerja</label>
                    <p style={detailValue}>{selectedAlumni.namaPerusahaan || "-"}</p>
                  </div>
                  <div style={detailSection}>
                    <label style={detailLabel}>Tahun Mulai Bekerja</label>
                    <p style={detailValue}>{selectedAlumni.tahunMasukKerja || "-"}</p>
                  </div>
                </>
              )}

              {selectedAlumni.status === "WIRAUSAHA" && (
                <>
                  <div style={detailSection}>
                    <label style={detailLabel}>Nama Usaha / Bisnis</label>
                    <p style={detailValue}>{selectedAlumni.namaUsaha || "-"}</p>
                  </div>
                  <div style={detailSection}>
                    <label style={detailLabel}>Mulai Berdiri</label>
                    <p style={detailValue}>Sejak Tahun {selectedAlumni.tahunAwalUsaha || "-"}</p>
                  </div>
                </>
              )}

              <div style={{ height: "1px", background: "#f0f0f0" }} />

              {/* BUKTI DATA */}
              <div style={detailSection}>
                <label style={detailLabel}>Bukti Pendukung</label>
                {selectedAlumni.buktiPendukung ? (
                  <a
                    href={getFileUrl(selectedAlumni.buktiPendukung)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bukti-link"
                    style={btnBukti}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Lihat Bukti Berkas
                  </a>
                ) : (
                  <span style={{ fontSize: "13px", color: "#999", fontStyle: "italic" }}>Tidak melampirkan berkas bukti pendukung</span>
                )}
              </div>

              {/* APPROVER INFO */}
              <div style={detailSection}>
                <label style={detailLabel}>Persetujuan Admin</label>
                <p style={{ ...detailValue, color: "#166534", fontWeight: 600 }}>
                  Disetujui oleh: {selectedAlumni.disetujuiOleh || "Guru BK (Default)"}
                </p>
                <p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                  Diproses pada: {formatDate(selectedAlumni.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

const inlineStyles = `
  .tab-btn {
    flex: 1;
    background: white;
    border: 1px solid #ddd;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }
  .tab-btn:hover {
    background: #fcfcfc;
    color: #687E50;
    border-color: #687E50;
  }
  .tab-btn.active {
    background: #687E50;
    color: white;
    border-color: #687E50;
    box-shadow: 0 2px 8px rgba(104,126,80,0.25);
  }

  .admin-alumni-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .alumni-admin-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid #f1f5f0;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f0f4eb;
    color: #687E50;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .card-divider {
    height: 1px;
    background: #f0f0f0;
  }

  .info-row {
    display: flex;
    font-size: 12px;
    line-height: 1.4;
  }
  .info-row .label {
    width: 85px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 10px;
  }
  .info-row .value {
    flex: 1;
    color: #334155;
    font-weight: 500;
  }

  .btn-detail {
    background: #687E50;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-detail:hover {
    background: #4D5E3A;
  }

  .btn-danger {
    background: white;
    color: #dc2626;
    border: 1px solid #dc2626;
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-danger:hover {
    background: #fef2f2;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
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
    max-width: 440px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.85) translateY(15px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .modal-content.show {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  .modal-content.hide {
    transform: scale(0.85) translateY(15px);
    opacity: 0;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .bukti-link {
    transition: all 0.2s ease;
  }
  .bukti-link:hover {
    background: #687E50 !important;
    color: white !important;
    border-color: #687E50 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(104,126,80,0.15);
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #687E50;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const searchWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
}

const searchInput = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "13px",
  color: "#333",
  background: "transparent",
}

const emptyState = {
  textAlign: "center" as const,
  padding: "40px 20px",
  color: "#999",
  background: "white",
  borderRadius: "12px",
  border: "1px solid #eee",
}

const alumniName = {
  margin: 0,
  fontSize: "14px",
  fontWeight: 700,
  color: "#1e293b",
}

const alumniSub = {
  margin: "2px 0 0 0",
  fontSize: "11px",
  color: "#64748b",
  fontWeight: 500,
}

const detailSection = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
}

const detailLabel = {
  fontSize: "10px",
  color: "#94a3b8",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
}

const detailValue = {
  fontSize: "13px",
  color: "#334155",
  margin: 0,
  fontWeight: 500,
}

const btnBukti = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "#eef3e6",
  color: "#687E50",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
  textDecoration: "none",
  border: "1px solid #d8e2cf",
  cursor: "pointer",
  transition: "all 0.2s ease",
  alignSelf: "flex-start" as const,
}
