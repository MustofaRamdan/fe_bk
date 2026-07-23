"use client"

import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"
import { getImageUrl } from "@/lib/image"


export interface PostDetail {
  id: number
  title: string
  content: string
  thumbnail: string | null
  publishedAt: Date | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface ArtikelDetailClientProps {
  post: PostDetail
  apiUrl: string
}

export default function ArtikelDetailClient({ post, apiUrl }: ArtikelDetailClientProps) {
  const router = useRouter()

  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }

  return (
    <DesktopLayout>
      {/* Main Content */}
      <main style={mainContent}>
        {/* Breadcrumb */}
        <nav style={breadcrumb}>
          <span style={breadcrumbItem} onClick={() => router.push("/")}>Dashboard</span>
          <span style={breadcrumbSeparator}>&rsaquo;</span>
          <span style={breadcrumbItem} onClick={() => router.push("/artikel")}>Artikel</span>
          <span style={breadcrumbSeparator}>&rsaquo;</span>
          <span style={breadcrumbActive}>Detail</span>
        </nav>

        {/* Tombol Kembali */}
        <button style={btnBack} onClick={() => router.push("/artikel")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{marginRight: 6}}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Daftar Artikel
        </button>

        {/* Card Detail */}
        <div style={detailCard}>
          {/* Thumbnail */}
          {post.thumbnail ? (
            <div style={imageWrapper}>
                <img
                  src={getImageUrl(post.thumbnail, apiUrl)}
                  alt={post.title}
                  style={detailImage}
                />
            </div>
          ) : (
            <div style={noImage}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Judul */}
          <h2 style={detailTitle}>{post.title}</h2>

          {/* Tanggal */}
          <div style={metaInfo}>
            <span style={metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" style={{marginRight: 4}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Dipublikasikan: {formatDate(post.publishedAt)}
            </span>
            <span style={metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" style={{marginRight: 4}}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Diperbarui: {formatDate(post.updatedAt)}
            </span>
          </div>

          {/* Garis pemisah */}
          <div style={divider}></div>

          {/* Konten HTML */}
          <div 
            style={detailContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
    </DesktopLayout>
  )
}

// ============ STYLES ============

const mainContent = {
  padding: "20px",
  maxWidth: 800,
  margin: "0 auto",
}

const breadcrumb = {
  fontSize: 12,
  color: "#666",
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 16,
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

const btnBack = {
  background: "transparent",
  color: "#687E50",
  border: "none",
  padding: "8px 0",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  marginBottom: 16,
}

const detailCard = {
  background: "white",
  padding: "24px",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
}

const imageWrapper = {
  width: "100%",
  height: 280,
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 20,
}

const detailImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
}

const noImage = {
  width: "100%",
  height: 200,
  borderRadius: 8,
  background: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
}

const detailTitle = {
  fontSize: 24,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 12px 0",
  lineHeight: 1.3,
}

const metaInfo = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 16,
  marginBottom: 16,
}

const metaItem = {
  fontSize: 13,
  color: "#666",
  display: "flex",
  alignItems: "center",
}

const divider = {
  height: 1,
  background: "#eee",
  marginBottom: 20,
}

const detailContent = {
  fontSize: 15,
  color: "#444",
  lineHeight: "1.8",
  textAlign: "justify" as const,
}
