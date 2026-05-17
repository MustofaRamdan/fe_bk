"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Drawer from "@/components/Drawer"
// ============================================
// INTERFACES — sesuai response backend Golang
// ============================================

interface Artikel {
  id: number
  title: string
  content: string
  thumbnail: string | null
  publishedAt: string | null
  createdAt: string
}

interface Guru {
  id: number
  nama: string
  jabatan: string
  foto: string | null
  createdAt: string
}

interface Karya {
  id: number
  judul: string
  thumbnail: string | null
  kategori: string
  createdAt: string
}

interface StatsKarir {
  persen: number
  jumlah: number
}

interface HomepageData {
  hero: Artikel | null
  artikel: Artikel[]
  guru: Guru[]
  karya: Karya[]
  totalAlumni: number
  statsKarir: {
    kuliah: StatsKarir
    kerja: StatsKarir
    wirausaha: StatsKarir
  }
}

export default function Homepage() {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  const router = useRouter()
  const [data, setData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch(`${api}/api/homepage`)
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal mengambil data")

      setData(json.data)
    } catch (err: any) {
      console.error("❌ Error fetch homepage:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPreviewText = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatImageUrl = (path: string | null) => {
    if (!path) return "/no-image.png"
    if (path.startsWith("http")) return path
    return `${api}${path}`
  }

  if (loading) {
    return (
      <div style={pageWrapper}>
        <header style={header}>
          <button style={menuButton} onClick={() => setDrawerOpen(true)}>
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
        <div style={{ textAlign: "center", padding: 60 }}>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={pageWrapper}>
        <header style={header}>
          <button
  style={menuButton}
  onClick={() => setDrawerOpen(true)}
>
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
        <div style={{ textAlign: "center", padding: 60, color: "#dc2626" }}>
          Error: {error}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={pageWrapper}>
      {/* ============================================
          HEADER
      ============================================ */}
      <header style={header}>
        <button
  style={menuButton}
  onClick={() => setDrawerOpen(true)}
>
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

      {/* ============================================
          HERO BANNER — Artikel Terbaru (REAL)
      ============================================ */}
      {data.hero && (
        <div
          style={heroBanner}
          onClick={() => router.push(`/artikel/${data.hero?.id}`)}
        >
          {data.hero.thumbnail ? (
            <img
              src={formatImageUrl(data.hero.thumbnail)}
              alt={data.hero.title}
              style={heroImage}
            />
          ) : (
            <div style={heroImagePlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* ============================================
          SELAMAT DATANG
      ============================================ */}
      <section style={welcomeSection}>
        <p style={welcomeSmall}>SELAMAT DATANG DI WEBSITE</p>
        <h2 style={welcomeTitle}>
          BIMBINGAN
          <br />
          KONSELING
        </h2>
        <p style={welcomeSubtitle}>SMK NEGERI 12 JAKARTA</p>

        <p style={welcomeDesc}>
          Bimbingan dan Konseling (BK) di SMKN 12 Jakarta merupakan layanan yang membantu peserta didik dalam mengembangkan potensi diri secara optimal, baik dalam bidang pribadi, sosial, belajar, maupun karir. Layanan BK juga membantu siswa dalam mengatasi masalah yang dihadapi serta merencanakan masa depan yang lebih baik.
        </p>

        <div style={welcomeButtons}>
          <button style={btnPrimary} onClick={() => router.push("/artikel")}>
            Lihat Artikel
          </button>
          <button style={btnSecondary}>Konseling</button>
        </div>
      </section>

      {/* ============================================
          GURU BK — Data Real dari Backend
      ============================================ */}
      <section style={guruSection}>
        <p style={guruLabel}>Guru Bimbingan Konseling</p>
        <p style={guruSublabel}>SMK Negeri 12 Jakarta</p>

        <div style={guruList}>
          {data.guru.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              Belum ada data guru
            </p>
          ) : (
            data.guru.map((g) => (
              <div key={g.id} style={guruCard}>
                <img
                  src={formatImageUrl(g.foto)}
                  alt={g.nama}
                  style={guruFoto}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.png"
                  }}
                />
                <p style={guruName}>{g.nama}</p>
                <p style={guruJabatan}>{g.jabatan}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============================================
          KARYA SISWA — Data Real dari Backend
      ============================================ */}
      <section style={karyaSection}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Karya Siswa</h3>
          <button style={btnLihatSemua} onClick={() => router.push("/karya")}>Lihat Semua ›</button>
        </div>

        <div style={karyaGrid}>
          {data.karya.length === 0 ? (
            <p style={{ color: "#999", fontSize: 12, gridColumn: "1 / -1" }}>
              Belum ada karya siswa
            </p>
          ) : (
            data.karya.slice(0, 2).map((k) => (
              <div key={k.id} style={karyaCard}>
                {k.thumbnail ? (
                  <img
                    src={formatImageUrl(k.thumbnail)}
                    alt={k.judul}
                    style={karyaImage}
                  />
                ) : (
                  <div style={karyaImagePlaceholder}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <p style={karyaTitle}>{k.judul}</p>
              </div>
            ))
          )}
        </div>

        <button style={btnTambahKarya}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Karya Siswa
        </button>
      </section>

      {/* ============================================
          TOTAL ALUMNI — Data Real
      ============================================ */}
      <section style={alumniSection}>
        <p style={alumniLabel}>Total Alumni</p>
        <p style={alumniValue}>{data.totalAlumni}</p>
        <p style={alumniSublabel}>Terdaftar</p>
      </section>

      {/* ============================================
          STATS KARIR ALUMNI — Data Real
      ============================================ */}
      <section style={statsSection}>
        {/* KULIAH */}
        <div style={statCardLarge}>
          <div style={statCardContent}>
            <h4 style={statCardTitle}>Kuliah</h4>
            <p style={statCardDesc}>
              Alumni yang melanjutkan studi ke perguruan tinggi
            </p>
            <div style={statNumberRow}>
              <div>
                <p style={statPercent}>{data.statsKarir.kuliah.persen}%</p>
                <p style={statSublabel}>{data.statsKarir.kuliah.jumlah} alumni</p>
              </div>
              <div style={statIconLarge}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c5d4a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* KERJA */}
        <div style={statCardLarge}>
          <div style={statCardContent}>
            <h4 style={statCardTitle}>Kerja</h4>
            <p style={statCardDesc}>
              Alumni yang telah bekerja di berbagai perusahaan
            </p>
            <div style={statNumberRow}>
              <div>
                <p style={statPercent}>{data.statsKarir.kerja.persen}%</p>
                <p style={statSublabel}>{data.statsKarir.kerja.jumlah} alumni</p>
              </div>
              <div style={statIconLarge}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c5d4a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* WIRAUSAHA */}
        <div style={statCardLarge}>
          <div style={statCardContent}>
            <h4 style={statCardTitle}>Wirausaha</h4>
            <p style={statCardDesc}>
              Alumni yang membangun bisnis sendiri
            </p>
            <div style={statNumberRow}>
              <div>
                <p style={statPercent}>{data.statsKarir.wirausaha.persen}%</p>
                <p style={statSublabel}>{data.statsKarir.wirausaha.jumlah} alumni</p>
              </div>
              <div style={statIconLarge}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c5d4a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ARTIKEL — Data Real (2 terbaru)
      ============================================ */}
      <section style={artikelSection}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Artikel</h3>
          <button style={btnLihatSemua} onClick={() => router.push("/artikel")}>
            Lihat Semua ›
          </button> 
        </div>

        <div style={artikelGrid}>
          {data.artikel.slice(0, 2).map((item) => (
            <div
              key={item.id}
              style={artikelCard}
              onClick={() => router.push(`/artikel/${item.id}`)}
            >
              {item.thumbnail ? (
                <img
                  src={formatImageUrl(item.thumbnail)}
                  alt={item.title}
                  style={artikelThumb}
                />
              ) : (
                <div style={artikelThumbPlaceholder}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7c4e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div style={artikelCardContent}>
                <p style={artikelCardText}>{getPreviewText(item.content, 80)}</p>
                <button style={btnBacaSelengkapnya}>Baca Selengkapnya</button>
              </div>
            </div>
          ))}
        </div>

        <button style={btnLihatSemuaArtikel} onClick={() => router.push("/artikel")}>
          Untuk lebih banyak artikel
        </button>
      </section>
      <Drawer
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
/>
    </div>
  )
}

// ============================================
// STYLES
// ============================================

const pageWrapper = {
  background: "#e8e8e8",
  minHeight: "100vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  paddingBottom: 40,
}

const header = {
  background: "#86a564",
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

// Hero
const heroBanner = {
  width: "100%",
  height: "clamp(220px, 38vw, 420px)",
  overflow: "hidden",
  cursor: "pointer",
  background: "#dfe8cf",
  position: "relative" as const,
}
const heroImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
}


const heroImagePlaceholder = {
  width: "100%",
  height: "100%",
  background: "#c5d4a8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

// Welcome
const welcomeSection = {
  padding: "24px 20px",
  textAlign: "center" as const,
}

const welcomeSmall = {
  fontSize: 11,
  color: "#6b7c4e",
  fontWeight: 600,
  letterSpacing: "1px",
  margin: "0 0 8px 0",
}

const welcomeTitle = {
  fontSize: 28,
  fontWeight: 800,
  color: "#333",
  margin: "0 0 4px 0",
  lineHeight: 1.1,
}

const welcomeSubtitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 16px 0",
}

const welcomeDesc = {
  fontSize: 12,
  color: "#555",
  lineHeight: 1.6,
  textAlign: "justify" as const,
  margin: "0 0 20px 0",
}

const welcomeButtons = {
  display: "flex",
  gap: 12,
  justifyContent: "center" as const,
}

const btnPrimary = {
  background: "#6b7c4e",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
}

const btnSecondary = {
  background: "#c5d4a8",
  color: "#333",
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
}

// Guru
const guruSection = {
  background: "#6b7c4e",
  padding: "24px 20px",
  marginBottom: 20,
}

const guruLabel = {
  fontSize: 13,
  fontWeight: 600,
  color: "white",
  margin: "0 0 2px 0",
}

const guruSublabel = {
  fontSize: 11,
  color: "rgba(255,255,255,0.8)",
  margin: "0 0 16px 0",
}

const guruList = {
  display: "flex",
  gap: 12,
  overflowX: "auto" as const,
  paddingBottom: 8,
}

const guruCard = {
  background: "rgba(255,255,255,0.15)",
  borderRadius: 12,
  padding: 16,
  minWidth: 100,
  textAlign: "center" as const,
  backdropFilter: "blur(10px)",
}

const guruFoto = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  objectFit: "cover" as const,
  margin: "0 auto 8px",
  display: "block",
}

const guruName = {
  fontSize: 11,
  fontWeight: 600,
  color: "white",
  margin: "0 0 2px 0",
}

const guruJabatan = {
  fontSize: 10,
  color: "rgba(255,255,255,0.8)",
  margin: 0,
}

// Karya Siswa
const karyaSection = {
  padding: "0 20px",
  marginBottom: 20,
}

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  color: "#333",
  margin: 0,
}

const btnLihatSemua = {
  background: "none",
  border: "none",
  color: "#6b7c4e",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
}

const karyaGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 12,
}

const karyaCard = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
}

const karyaImage = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover" as const,
  display: "block",
}

const karyaImagePlaceholder = {
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#f0f4e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const karyaTitle = {
  fontSize: 11,
  fontWeight: 500,
  color: "#333",
  padding: "8px 12px",
  margin: 0,
}

const btnTambahKarya = {
  width: "100%",
  background: "#6b7c4e",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

// Alumni
const alumniSection = {
  background: "#6b7c4e",
  margin: "0 20px 20px",
  borderRadius: 12,
  padding: "20px",
  textAlign: "center" as const,
}

const alumniLabel = {
  fontSize: 12,
  color: "rgba(255,255,255,0.9)",
  margin: "0 0 4px 0",
}

const alumniValue = {
  fontSize: 36,
  fontWeight: 700,
  color: "white",
  margin: "0 0 2px 0",
}

const alumniSublabel = {
  fontSize: 11,
  color: "rgba(255,255,255,0.8)",
  margin: 0,
}

// Stats
const statsSection = {
  padding: "0 20px",
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  marginBottom: 20,
}

const statCardLarge = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  overflow: "hidden",
}

const statCardContent = {
  padding: "20px",
}

const statCardTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#6b7c4e",
  margin: "0 0 8px 0",
}

const statCardDesc = {
  fontSize: 11,
  color: "#666",
  lineHeight: 1.5,
  margin: "0 0 16px 0",
}

const statNumberRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
}

const statPercent = {
  fontSize: 32,
  fontWeight: 700,
  color: "#6b7c4e",
  margin: "0 0 4px 0",
  lineHeight: 1,
}

const statSublabel = {
  fontSize: 10,
  color: "#999",
  margin: 0,
}

const statIconLarge = {
  opacity: 0.5,
}

// Artikel
const artikelSection = {
  padding: "0 20px",
}

const artikelGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 12,
}

const artikelCard = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  cursor: "pointer",
}

const artikelThumb = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover" as const,
  display: "block",
}
const artikelThumbPlaceholder = {
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#f0f4e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const artikelCardContent = {
  padding: 12,
}

const artikelCardText = {
  fontSize: 10,
  color: "#555",
  lineHeight: 1.4,
  margin: "0 0 8px 0",
  textAlign: "justify" as const,
}

const btnBacaSelengkapnya = {
  background: "#6b7c4e",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 500,
  cursor: "pointer",
}

const btnLihatSemuaArtikel = {
  width: "100%",
  background: "#6b7c4e",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
}

