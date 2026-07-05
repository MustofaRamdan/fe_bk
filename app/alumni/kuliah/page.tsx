"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"
import Pagination from "@/components/Pagination"

interface Alumni {
  id: number
  namaLengkap: string
  tahunLulus: string
  namaKampus: string | null
  programStudi: string | null
  tahunMasukKuliah: string | null
  jalurMasuk: string | null
}

export default function Page() {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  const router = useRouter()
  const [data, setData] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetch(`${api}/api/alumni?status=KULIAH&statusPengajuan=DITERIMA`)
      .then((r) => r.json())
      .then((j) => setData(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [api])

  const filtered = data.filter((a) =>
    a.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    (a.namaKampus || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.programStudi || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.jalurMasuk || "").toLowerCase().includes(search.toLowerCase())
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const getJalurDetails = (jalur: string | null) => {
    const j = (jalur || "").toUpperCase()
    if (j.includes("SNBP") || j.includes("PRESTASI")) {
      return { bg: "#e0f2fe", text: "#0369a1", label: jalur || "SNBP" }
    }
    if (j.includes("SNBT") || j.includes("TES")) {
      return { bg: "#dcfce7", text: "#15803d", label: jalur || "SNBT" }
    }
    if (j.includes("MANDIRI")) {
      return { bg: "#fef3c7", text: "#b45309", label: jalur || "Mandiri" }
    }
    if (j.includes("BEASISWA")) {
      return { bg: "#f3e8ff", text: "#7e22ce", label: jalur || "Beasiswa" }
    }
    return { bg: "#f3f4f6", text: "#4b5563", label: jalur || "Umum" }
  }

  return (
    <DesktopLayout>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* HERO SECTION */}
      <div className="alumni-hero">
        <div className="hero-icon-container">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
        <h2 className="hero-title">Alumni Kuliah</h2>
        <p className="hero-subtitle">
          Mencatat kontribusi alumni yang melanjutkan studi ke perguruan tinggi terbaik.
        </p>
        <span className="hero-badge">Total {data.length} Alumni</span>
      </div>

      {/* TABS */}
      <div className="tabs-container">
        <button className="tab-button active">
          Kuliah
        </button>
        <button onClick={() => router.push("/alumni/bekerja")} className="tab-button">
          Bekerja
        </button>
        <button onClick={() => router.push("/alumni/wirausaha")} className="tab-button">
          Wirausaha
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-section">
        <div className="search-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Cari nama, kampus, jurusan, atau jalur..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* CARDS LIST */}
      <div style={{ padding: "0 20px 40px" }}>
        {loading ? (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Memuat data alumni...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-container empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p>Tidak ada data alumni kuliah yang sesuai</p>
          </div>
        ) : (
          <>
            <div className="alumni-grid">
            {paginated.map((a) => {
              const jalur = getJalurDetails(a.jalurMasuk)
              return (
                <div key={a.id} className="alumni-grid-card">
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="avatar-circle">
                      {getInitials(a.namaLengkap)}
                    </div>
                    <div className="name-section">
                      <h3 className="alumni-name">{a.namaLengkap}</h3>
                      <span className="graduation-badge">
                        Lulusan {a.tahunLulus}
                      </span>
                    </div>
                  </div>

                  <div className="card-divider" />

                  {/* Card Details */}
                  <div className="card-details">
                    <div className="detail-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <div className="detail-content">
                        <label>Kampus</label>
                        <p>{a.namaKampus || "-"}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <div className="detail-content">
                        <label>Program Studi</label>
                        <p>{a.programStudi || "-"}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <div className="detail-content">
                        <label>Tahun Masuk</label>
                        <p>{a.tahunMasukKuliah || "-"}</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="detail-icon">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <div className="detail-content">
                        <label>Jalur Masuk</label>
                        <div style={{ marginTop: 2 }}>
                          <span
                            className="jalur-badge"
                            style={{
                              backgroundColor: jalur.bg,
                              color: jalur.text,
                            }}
                          >
                            {jalur.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </DesktopLayout>
  )
}

const styles = `
  .alumni-hero {
    background: linear-gradient(135deg, #687E50 0%, #4D5E3A 100%);
    padding: 40px 24px 48px;
    text-align: center;
    color: white;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .hero-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    backdrop-filter: blur(4px);
  }
  .hero-title {
    margin: 0 0 8px;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .hero-subtitle {
    margin: 0 auto 16px;
    max-width: 500px;
    opacity: 0.85;
    font-size: 14px;
    line-height: 1.5;
  }
  .hero-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(4px);
    display: inline-block;
  }

  .tabs-container {
    display: flex;
    justify-content: center;
    max-width: 500px;
    margin: -20px auto 0;
    padding: 0 20px;
    gap: 12px;
  }
  .tab-button {
    flex: 1;
    background: white;
    border: 1px solid rgba(0,0,0,0.06);
    padding: 12px 16px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
  }
  .tab-button:hover {
    background: #f8faf7;
    color: #687E50;
    border-color: #b8c6ab;
    transform: translateY(-2px);
  }
  .tab-button.active {
    background: #687E50;
    color: white;
    border-color: #687E50;
    box-shadow: 0 4px 15px rgba(104, 126, 80, 0.35);
  }

  .search-section {
    padding: 24px 20px 16px;
    max-width: 800px;
    margin: 0 auto;
  }
  .search-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 12px 20px;
    border-radius: 30px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    transition: all 0.3s ease;
  }
  .search-wrapper:focus-within {
    border-color: #687E50;
    box-shadow: 0 4px 16px rgba(104, 126, 80, 0.15);
  }
  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;
  }
  .search-input::placeholder {
    color: #94a3b8;
  }

  .alumni-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .alumni-grid-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    border: 1px solid #f1f5f0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .alumni-grid-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(104, 126, 80, 0.12);
    border-color: #dbe5d4;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #eef3e6;
    color: #687E50;
    font-weight: 800;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(104, 126, 80, 0.1);
  }
  .name-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .alumni-name {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
  }
  .graduation-badge {
    background: #f1f5f9;
    color: #475569;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    width: fit-content;
  }

  .card-divider {
    height: 1px;
    background: #f1f5f0;
  }

  .card-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .detail-icon {
    margin-top: 2px;
    color: #687E50;
    flex-shrink: 0;
  }
  .detail-content {
    display: flex;
    flex-direction: column;
  }
  .detail-content label {
    font-size: 10px;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .detail-content p {
    margin: 2px 0 0;
    font-size: 13px;
    color: #334155;
    font-weight: 600;
  }

  .jalur-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
  }

  .state-container {
    background: white;
    border-radius: 20px;
    padding: 60px 20px;
    text-align: center;
    color: #64748b;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
    margin: 40px auto;
  }
  .state-container.empty p {
    font-size: 14px;
    font-weight: 500;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #687E50;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .alumni-grid {
      grid-template-columns: 1fr;
    }
  }
`