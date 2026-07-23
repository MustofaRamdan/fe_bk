"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import Pagination from "@/components/Pagination"
import { getImageUrl } from "@/lib/image"


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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        { 
          method: "DELETE",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          }
        }
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

  const truncateContent = (content: string, maxLength: number = 250) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <AdminLayout>
        <main style={mainContent}>
          {/* Title & Breadcrumb */}
          <div style={titleSection}>
            <h2 style={pageTitle}>Artikel</h2>
            <nav style={breadcrumb}>
              <span style={breadcrumbItem}>Dashboard</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbActive}>Artikel</span>
            </nav>
          </div>

          {/* Search & Add Button */}
          <div style={toolbar}>
            <div style={searchWrapper}>
              <input type="text" placeholder="Cari..." style={searchInput} disabled />
            </div>
            <button style={{...btnAdd, opacity: 0.6}} disabled>Tambah Data</button>
          </div>

          {/* Cards Skeleton */}
          <div style={cardsContainer}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={card} className="animate-pulse">
                <div style={{width: "40%", height: 20, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
                <div style={{width: "20%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 16}}></div>
                <div style={{width: "100%", height: 180, background: "#f3f4f1", borderRadius: 8, marginBottom: 12}}></div>
                <div style={{width: "100%", height: 12, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
                <div style={{width: "80%", height: 12, background: "#f3f4f1", borderRadius: 4, marginBottom: 16}}></div>
                <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
                  <div style={{width: 80, height: 28, background: "#f3f4f1", borderRadius: 6}}></div>
                  <div style={{width: 60, height: 28, background: "#f3f4f1", borderRadius: 6}}></div>
                  <div style={{width: 60, height: 28, background: "#f3f4f1", borderRadius: 6}}></div>
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
      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Artikel</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Artikel</span>
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
          <button 
            style={btnAdd}
            onClick={() => router.push("/admin/artikel/tambah")}
          >
            Tambah Data
          </button>
        </div>

        {/* Error */}
        {error && <div style={errorBox}>{error}</div>}

        {/* Cards */}
        <div style={cardsContainer}>
          {paginatedPosts.length === 0 ? (
            <p style={emptyText}>Belum ada artikel</p>
          ) : (
            paginatedPosts.map((post) => (
              <div key={post.id} style={card}>
                <h3 style={cardTitle}>{post.title}</h3>
                <p style={cardDate}>{formatDate(post.publishedAt)}</p>
                
                {post.thumbnail && (
                  <div style={imageWrapper}>
                    <img
                      src={getImageUrl(post.thumbnail)}
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
                <div style={cardActions}>
                    <button 
                      style={{...btnEdit, background: "#2563eb"}} // biru
                      onClick={() => router.push(`/admin/artikel/${post.id}`)}
                    >
                      Lihat Detail
                    </button>
                  <button 
                    style={btnEdit}
                    onClick={() => router.push(`/admin/artikel/edit/${post.id}`)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    style={btnDelete}
                    onClick={() => handleDelete(post.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}>
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Hapus
                  </button>
                </div>
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
    </AdminLayout>
  )
}

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
  background: "#687E50",
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

const btnEdit = {
  background: "#166534",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}

const btnDelete = {
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}

const emptyText = {
  textAlign: "center" as const,
  color: "#999",
  padding: "40px 20px",
}