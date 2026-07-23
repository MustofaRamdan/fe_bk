"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"
import Pagination from "@/components/Pagination"
import { getImageUrl } from "@/lib/image"


const getPreviewHTML = (html: string) => {
  // hapus gambar dari konten
  return html.replace(/<img[^>]*>/g, "")
}

export interface Post {
  id: number
  title: string
  content: string
  thumbnail: string | null
  publishedAt: Date | null
  published: boolean
  createdAt: Date
}

interface ArtikelClientProps {
  initialData: Post[]
  apiUrl: string
}

export default function ArtikelClient({ initialData, apiUrl }: ArtikelClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredPosts = initialData.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/\//g, "/")
  }

  return (
    <DesktopLayout>
      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Artikel</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive} onClick={() => router.push("/artikel")}>Artikel</span>
          </nav>
        </div>

        {/* Search & Add Button */}
        <div style={toolbar}>
          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Cards */}
        <div style={cardsContainer}>
          {paginatedPosts.length === 0 ? (
            <p style={emptyText}>Belum ada artikel</p>
          ) : (
            paginatedPosts.map((post) => (
              <div
  key={post.id}
  style={card}
  onClick={() => router.push(`/artikel/${post.id}`)}
>
                <h3 style={cardTitle}>{post.title}</h3>
                <p style={cardDate}>{formatDate(post.publishedAt)}</p>
                
                {post.thumbnail && (
                  <div style={imageWrapper}>
                    <img
                       src={getImageUrl(post.thumbnail, apiUrl)}
                       alt={post.title}
                       style={cardImage}
                    />
                  </div>
                )}
                
                <div
                  className="preview-clamp"
                  style={cardContent}
                  dangerouslySetInnerHTML={{
                    __html: getPreviewHTML(post.content)
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </DesktopLayout>
  )
}

// Styles
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
  gap: 12,
  marginBottom: 20,
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

const cardsContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
}

const card = {
  background: "white",
  cursor: "pointer",
  transition: "0.2s",
  padding: "20px",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
}

const cardTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 4px 0",
}

const cardDate = {
  fontSize: 14,
  color: "#666",
  fontStyle: "italic",
  margin: "0 0 12px 0",
}

const imageWrapper = {
  width: "100%",
  height: 180,
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 12,
}

const cardImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
}

const cardContent = {
  fontSize: 14,
  color: "#555",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
  textAlign: "justify" as const,
}

const emptyText = {
  textAlign: "center" as const,
  color: "#999",
  padding: "40px 20px",
}
