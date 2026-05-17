"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const getPreviewHTML = (html: string) => {
  // hapus gambar dari konten
  return html.replace(/<img[^>]*>/g, "")
}

interface Post {
  id: number
  title: string
  content: string
  thumbnail: string | null
  publishedAt: Date | null
  published: boolean
  createdAt: Date
}

export default function ArtikelPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`
      )
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data")
      
      setPosts(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Gagal menghapus")
      
      setPosts(posts.filter(p => p.id !== id))
      alert("Artikel dihapus!")
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/\//g, "/")
  }

  const truncateContent = (content: string, maxLength: number = 250) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (loading) return <div style={pageWrapper}><p style={{padding: 20}}>Loading...</p></div>

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
        <h1 style={headerTitle}>BK SMKN 12</h1>
        <div style={userIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
      </header>

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
              onChange={(e) => setSearch(e.target.value)}
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

        {/* Error */}
        {error && <div style={errorBox}>{error}</div>}

        {/* Cards */}
        <div style={cardsContainer}>
          {filteredPosts.length === 0 ? (
            <p style={emptyText}>Belum ada artikel</p>
          ) : (
            filteredPosts.map((post) => (
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
                      src={`${process.env.NEXT_PUBLIC_API_URL}${post.thumbnail}`}
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
      </main>
    </div>
  )
}

// Styles
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

const btnAdd = {
  background: "#6b7c4e",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
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

const cardActions = {
  display: "flex",
  gap: 8,
  justifyContent: "flex-end" as const,
}

const emptyText = {
  textAlign: "center" as const,
  color: "#999",
  padding: "40px 20px",
}