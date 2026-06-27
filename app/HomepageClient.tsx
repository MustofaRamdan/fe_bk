"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"

// ============================================
// INTERFACES
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

export interface HomepageData {
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

interface HomepageClientProps {
  initialData: HomepageData
  apiUrl: string
}

export default function HomepageClient({ initialData, apiUrl }: HomepageClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const data = initialData

  const getPreviewText = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatImageUrl = (path: string | null) => {
    if (!path) return "/no-image.png"
    if (path.startsWith("http")) return path
    return `${apiUrl}${path}`
  }

  return (
    <DesktopLayout>

        {/* ============================================
            HERO BANNER — Multiple Images
        ============================================ */}
        <div data-hero style={heroBanner}>
          <div style={heroGrid}>
            {data.hero && data.hero.thumbnail ? (
              <div
                style={heroMainImage}
                onClick={() => router.push(`/artikel/${data.hero?.id}`)}
              >
                <img
                  src={formatImageUrl(data.hero.thumbnail)}
                  alt={data.hero.title}
                  style={heroImg}
                />
              </div>
            ) : (
              <div style={heroPlaceholderBox}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
            {/* Additional hero images from artikel */}
            {data.artikel.slice(0, 2).map((item) => (
              <div
                key={item.id}
                style={heroSideImage}
                onClick={() => router.push(`/artikel/${item.id}`)}
              >
                {item.thumbnail ? (
                  <img
                    src={formatImageUrl(item.thumbnail)}
                    alt={item.title}
                    style={heroImg}
                  />
                ) : (
                  <div style={heroPlaceholderBox}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
            SEARCH BAR
        ============================================ */}
        <div data-search style={searchBarWrapper}>
          <div style={searchBar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari layanan BK, artikel, atau alumni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInput}
            />
          </div>
        </div>

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
            <button 
              style={{ ...btnSecondary, cursor: "pointer" }}
              onClick={() => router.push("/konseling")}
            >
              Konseling
            </button>
          </div>
        </section>

        {/* ============================================
            GURU BK — Data Real dari Backend
        ============================================ */}
        <section id="guru-section" style={guruSection}>
          <p style={guruLabel}>Guru Bimbingan Konseling</p>
          <p style={guruSublabel}>SMK Negeri 12 Jakarta</p>

          <div data-guru-list style={guruList}>
            {data.guru.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
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

          <div data-karya-grid style={karyaGrid}>
            {data.karya.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14, gridColumn: "1 / -1" }}>
                Belum ada karya siswa
              </p>
            ) : (
              data.karya.slice(0, 8).map((k) => (
                <div key={k.id} style={karyaCard}>
                  {k.thumbnail ? (
                    <img
                      src={formatImageUrl(k.thumbnail)}
                      alt={k.judul}
                      style={karyaImage}
                    />
                  ) : (
                    <div style={karyaImagePlaceholder}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

          <button 
            style={btnTambahKarya}
            onClick={() => router.push("/karya/tambah")}
          >
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
        <section data-stats style={statsSection}>
          {/* KULIAH */}
          <div 
            style={{ ...statCardLarge, cursor: "pointer" }}
            onClick={() => router.push("/alumni/kuliah")}
          >
            <div style={statCardContent}>
              <h4 style={statCardTitle}>Kuliah</h4>
              <p style={statCardDesc}>
                Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              </p>
              <div style={statNumberRow}>
                <div>
                  <p style={statPercent}>{data.statsKarir.kuliah.persen}%</p>
                  <p style={statSublabel}>Lorem Ipsum dolor</p>
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
          <div 
            style={{ ...statCardLarge, cursor: "pointer" }}
            onClick={() => router.push("/alumni/bekerja")}
          >
            <div style={statCardContent}>
              <h4 style={statCardTitle}>Kuliah</h4>
              <p style={statCardDesc}>
                Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              </p>
              <div style={statNumberRow}>
                <div>
                  <p style={statPercent}>{data.statsKarir.kerja.persen}%</p>
                  <p style={statSublabel}>Lorem Ipsum dolor</p>
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
          <div 
            data-stat-wirausaha
            style={{ ...statCardLarge, cursor: "pointer" }}
            onClick={() => router.push("/alumni/wirausaha")}
          >
            <div style={statCardContent}>
              <h4 style={statCardTitle}>Kuliah</h4>
              <p style={statCardDesc}>
                Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              </p>
              <div style={statNumberRow}>
                <div>
                  <p style={statPercent}>{data.statsKarir.wirausaha.persen}%</p>
                  <p style={statSublabel}>Lorem Ipsum dolor</p>
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
            ARTIKEL — Data Real (4 terbaru di desktop)
        ============================================ */}
        <section style={artikelSection}>
          <div style={sectionHeader}>
            <h3 style={sectionTitle}>Artikel</h3>
            <button style={btnLihatSemua} onClick={() => router.push("/artikel")}>
              Lihat Semua ›
            </button>
          </div>

          <div data-artikel-grid style={artikelGrid}>
            {data.artikel.slice(0, 4).map((item) => (
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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        </section>

        {/* ============================================
            FOOTER
        ============================================ */}
        <footer data-footer style={footerStyle}>
          <div style={footerContent}>
            <p style={footerText}>© 2024 Bimbingan Konseling — SMK Negeri 12 Jakarta</p>
          </div>
        </footer>
    </DesktopLayout>
  )
}

// ============================================
// STYLES
// ============================================

// Hero
const heroBanner: React.CSSProperties = {
  width: "100%",
  overflow: "hidden",
  background: "#dfe8cf",
  position: "relative",
}

const heroGrid: React.CSSProperties = {
  display: "flex",
  gap: 0,
  height: "clamp(220px, 38vw, 320px)",
}

const heroMainImage: React.CSSProperties = {
  flex: 2,
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
}

const heroSideImage: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
}

const heroImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
}

const heroPlaceholderBox: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#c5d4a8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

// Search Bar
const searchBarWrapper: React.CSSProperties = {
  padding: "16px 20px 0",
}

const searchBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "white",
  borderRadius: 8,
  padding: "10px 14px",
  border: "1px solid #ddd",
}

const searchInput: React.CSSProperties = {
  border: "none",
  outline: "none",
  fontSize: 14,
  color: "#333",
  flex: 1,
  background: "transparent",
}

// Welcome
const welcomeSection: React.CSSProperties = {
  padding: "24px 20px",
  textAlign: "center",
}

const welcomeSmall: React.CSSProperties = {
  fontSize: 12,
  color: "#687E50",
  fontWeight: 600,
  letterSpacing: "1px",
  margin: "0 0 8px 0",
}

const welcomeTitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: "#333",
  margin: "0 0 4px 0",
  lineHeight: 1.1,
}

const welcomeSubtitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 16px 0",
}

const welcomeDesc: React.CSSProperties = {
  fontSize: 14,
  color: "#555",
  lineHeight: 1.6,
  textAlign: "justify",
  margin: "0 0 20px 0",
}

const welcomeButtons: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
}

const btnPrimary: React.CSSProperties = {
  background: "#687E50",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

const btnSecondary: React.CSSProperties = {
  background: "#c5d4a8",
  color: "#333",
  padding: "12px 24px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

// Guru
const guruSection: React.CSSProperties = {
  background: "#687E50",
  padding: "24px 20px",
  marginBottom: 20,
}

const guruLabel: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "white",
  margin: "0 0 2px 0",
}

const guruSublabel: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.8)",
  margin: "0 0 16px 0",
}

const guruList: React.CSSProperties = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  paddingBottom: 8,
}

const guruCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  borderRadius: 12,
  padding: 16,
  minWidth: 120,
  textAlign: "center",
  backdropFilter: "blur(10px)",
}

const guruFoto: React.CSSProperties = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  objectFit: "cover",
  margin: "0 auto 8px",
  display: "block",
}

const guruName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "white",
  margin: "0 0 2px 0",
}

const guruJabatan: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.8)",
  margin: 0,
}

// Karya Siswa
const karyaSection: React.CSSProperties = {
  padding: "0 20px",
  marginBottom: 20,
}

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: 0,
}

const btnLihatSemua: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#687E50",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
}

const karyaGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 12,
}

const karyaCard: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
}

const karyaImage: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  display: "block",
}

const karyaImagePlaceholder: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#f0f4e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const karyaTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#333",
  padding: "10px 14px",
  margin: 0,
}

const btnTambahKarya: React.CSSProperties = {
  width: "100%",
  background: "#687E50",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

// Alumni
const alumniSection: React.CSSProperties = {
  background: "#687E50",
  margin: "0 20px 20px",
  borderRadius: 12,
  padding: "24px",
  textAlign: "center",
}

const alumniLabel: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.9)",
  margin: "0 0 4px 0",
}

const alumniValue: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 700,
  color: "white",
  margin: "0 0 2px 0",
}

const alumniSublabel: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.8)",
  margin: 0,
}

// Stats
const statsSection: React.CSSProperties = {
  padding: "0 20px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 20,
}

const statCardLarge: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  overflow: "hidden",
}

const statCardContent: React.CSSProperties = {
  padding: "24px",
}

const statCardTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#687E50",
  margin: "0 0 8px 0",
}

const statCardDesc: React.CSSProperties = {
  fontSize: 13,
  color: "#666",
  lineHeight: 1.5,
  margin: "0 0 16px 0",
}

const statNumberRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
}

const statPercent: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  color: "#687E50",
  margin: "0 0 4px 0",
  lineHeight: 1,
}

const statSublabel: React.CSSProperties = {
  fontSize: 12,
  color: "#999",
  margin: 0,
}

const statIconLarge: React.CSSProperties = {
  opacity: 0.5,
}

// Artikel
const artikelSection: React.CSSProperties = {
  padding: "0 20px",
  marginBottom: 20,
}

const artikelGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 12,
}

const artikelCard: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  cursor: "pointer",
}

const artikelThumb: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  display: "block",
}

const artikelThumbPlaceholder: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#f0f4e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const artikelCardContent: React.CSSProperties = {
  padding: 14,
}

const artikelCardText: React.CSSProperties = {
  fontSize: 12,
  color: "#555",
  lineHeight: 1.5,
  margin: "0 0 10px 0",
  textAlign: "justify",
}

const btnBacaSelengkapnya: React.CSSProperties = {
  background: "#687E50",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
}

// Footer
const footerStyle: React.CSSProperties = {
  background: "#3d4a2e",
  padding: "40px 20px",
  marginTop: 20,
}

const footerContent: React.CSSProperties = {
  textAlign: "center",
}

const footerText: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  fontSize: 13,
  margin: 0,
}
