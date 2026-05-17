"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Aktivitas {
  id: number
  nama: string
  aksi: string
  tanggal: string
  waktu: string
  avatar: string | null
  tipe: string
}

interface DashboardStats {
  totalSiswaAktif: number
  artikel: {
    total: number
    growth: number
    bulanIni: number
  }
guruBK: {
  total: number
  growth: number
}

karyaSiswa: {
  total: number
  growth: number
}

alumni: {
  total: number
  growth: number
}
  kuliah: number
  bekerja: number
  wirausaha: number
  layanan: number
  aktivitasTerbaru: Aktivitas[]
}

export default function DashboardPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${api}/api/dashboard`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Gagal mengambil data")

      setStats(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={pageWrapper}>
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
        <main style={mainContent}>
          <p style={{padding: 40, textAlign: "center"}}>Loading dashboard...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div style={pageWrapper}>
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
        <main style={mainContent}>
          <div style={errorBox}>{error}</div>
        </main>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div style={pageWrapper}>
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
        {/* Welcome Card */}
        <div style={welcomeCard}>
          <div style={welcomeText}>
            <h2 style={welcomeTitle}>Selamat datang, Admin!</h2>
            <p style={welcomeSubtitle}>Kelola konten website dengan mudah.</p>
          </div>
          <div style={welcomeImage}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <path d="M6 8h.01" />
              <path d="M6 12h.01" />
              <path d="M6 16h.01" />
              <path d="M10 8h8" />
              <path d="M10 12h8" />
              <path d="M10 16h5" />
            </svg>
          </div>
        </div>

        {/* Total Siswa Aktif */}
        <div style={siswaCard}>
          <div style={siswaContent}>
            <div style={siswaIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p style={siswaLabel}>Total Siswa Aktif</p>
              <p style={siswaValue}>{stats.totalSiswaAktif}</p>
            </div>
          </div>
          <div style={siswaIllustration}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

       
        <h3 style={sectionTitle}>Ringkasan Lainnya</h3>
        
        <div style={statsGrid}>
          
          <div 
            style={statCard} 
            onClick={() => router.push("/admin/artikel")}
          >
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p style={statLabel}>Artikel</p>
            <p style={statValue}>{stats.artikel.total}</p>
            <p style={statGrowth}>↗ {stats.artikel.growth > 0 ? '+' : ''}{stats.artikel.growth}%</p>
          </div>

          {/* Guru BK */}
                    <div 
            style={statCard} 
            onClick={() => router.push("/admin/guru")}
          >
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p style={statLabel}>Guru BK</p>
<p style={statValue}>{stats.guruBK.total}</p>
<p style={statGrowth}>
  ↗ {stats.guruBK.growth > 0 ? "+" : ""}
  {stats.guruBK.growth}%
</p>
          </div>

          {/* Karya Siswa */}
                    <div 
            style={statCard} 
            onClick={() => router.push("/admin/karya")}
          >
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p style={statLabel}>Karya Siswa</p>
<p style={statValue}>{stats.karyaSiswa.total}</p>
<p style={statGrowth}>
  ↗ {stats.karyaSiswa.growth > 0 ? "+" : ""}
  {stats.karyaSiswa.growth}%
</p>
          </div>

          {/* Alumni */}
          <div 
            style={statCard} 
            onClick={() => router.push("/admin/alumni/persetujuan")}
          >
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p style={statLabel}>Alumni</p>
<p style={statValue}>{stats.alumni.total}</p>
<p style={statGrowth}>
  ↗ {stats.alumni.growth > 0 ? "+" : ""}
  {stats.alumni.growth}%
</p>
          </div>

          {/* Kuliah */}
          <div style={statCard}>
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
            <p style={statLabel}>Kuliah</p>
            <p style={statValue}>{stats.kuliah}</p>
            <p style={statGrowth}>↗ 18%</p>
          </div>

          {/* Bekerja */}
          <div style={statCard}>
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <p style={statLabel}>Bekerja</p>
            <p style={statValue}>{stats.bekerja}</p>
            <p style={statGrowth}>↗ 18%</p>
          </div>

          {/* Wirausaha */}
          <div style={statCard}>
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p style={statLabel}>Wirausaha</p>
            <p style={statValue}>{stats.wirausaha}</p>
            <p style={statGrowth}>↗ 18%</p>
          </div>

          {/* Layanan */}
          <div style={statCard}>
            <div style={statIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p style={statLabel}>Layanan</p>
            <p style={statValue}>{stats.layanan}</p>
            <p style={statGrowth}>↗ 18%</p>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div style={aktivitasHeader}>
          <h3 style={sectionTitle}>Aktivitas Terbaru</h3>
          <button 
            style={btnLihatSemua}
            onClick={() => router.push("/admin/artikel")}
          >
            Lihat Semua
          </button>
        </div>

        <div style={aktivitasList}>
          {stats.aktivitasTerbaru.length === 0 ? (
            <p style={emptyText}>Belum ada aktivitas</p>
          ) : (
            stats.aktivitasTerbaru.map((item) => (
              <div
                  key={item.id}
                  style={aktivitasItem}
                  onClick={() => {
                    if (item.tipe === "karya") {
                      router.push("/admin/karya")
                    } else if (item.tipe === "alumni") {
                      router.push("/admin/alumni/persetujuan")
                    } else if (item.tipe === "artikel") {
                      router.push("/admin/artikel")
                    }
                  }}
                >
                <div style={aktivitasAvatar}>
                  {item.avatar ? (
                    <img 
                      src={item.avatar} 
                      alt="" 
                      style={{width: "100%", height: "100%", objectFit: "cover" as const, borderRadius: "50%"}}
                    />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <div style={aktivitasContent}>
                  <p style={aktivitasText}>
                    <strong style={aktivitasNama}>{item.nama}</strong> {item.aksi}
                  </p>
                  <p style={aktivitasWaktu}>
                    {item.waktu} • {new Date(item.tanggal).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                                  </div>
                <span style={aktivitasBadge}>Baru</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

// ============ STYLES ============

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
  maxWidth: 800,
  margin: "0 auto",
}

const welcomeCard = {
  background: "#d4d9c8",
  borderRadius: 16,
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
}

const welcomeText = {
  flex: 1,
}

const welcomeTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 4px 0",
}

const welcomeSubtitle = {
  fontSize: 13,
  color: "#555",
  margin: 0,
}

const welcomeImage = {
  width: 60,
  height: 60,
  background: "white",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const siswaCard = {
  background: "#c5d4a8",
  borderRadius: 16,
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
}

const siswaContent = {
  display: "flex",
  alignItems: "center",
  gap: 12,
}

const siswaIcon = {
  width: 48,
  height: 48,
  background: "#6b7c4e",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const siswaLabel = {
  fontSize: 14,
  fontWeight: 600,
  color: "#333",
  margin: "0 0 4px 0",
}

const siswaValue = {
  fontSize: 36,
  fontWeight: 700,
  color: "#333",
  margin: 0,
  lineHeight: 1,
}

const siswaIllustration = {
  opacity: 0.6,
}

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 12px 0",
}

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 20,
}

const statCard = {
  background: "white",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
}

const statIcon = {
  width: 36,
  height: 36,
  background: "#f0f4e8",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
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
  margin: "0 0 4px 0",
}

const statGrowth = {
  fontSize: 11,
  color: "#6b7c4e",
  margin: 0,
  fontWeight: 500,
}

const aktivitasHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
}

const btnLihatSemua = {
  background: "none",
  border: "none",
  color: "#6b7c4e",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
}

const aktivitasList = {
  background: "white",
  borderRadius: 12,
  padding: "16px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
}

const aktivitasItem = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 0",
  borderBottom: "1px solid #f0f0f0",
}

const aktivitasAvatar = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#f0f4e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}

const aktivitasContent = {
  flex: 1,
  minWidth: 0,
}

const aktivitasText = {
  fontSize: 13,
  color: "#333",
  margin: "0 0 2px 0",
  lineHeight: 1.4,
}

const aktivitasNama = {
  fontWeight: 600,
}

const aktivitasWaktu = {
  fontSize: 11,
  color: "#999",
  margin: 0,
}

const aktivitasBadge = {
  background: "#f0f4e8",
  color: "#6b7c4e",
  fontSize: 10,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 20,
  flexShrink: 0,
}

const emptyText = {
  textAlign: "center" as const,
  color: "#999",
  padding: "20px 0",
  fontSize: 13,
}

const errorBox = {
  background: "#fee2e2",
  border: "1px solid #ef4444",
  color: "#dc2626",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 14,
}