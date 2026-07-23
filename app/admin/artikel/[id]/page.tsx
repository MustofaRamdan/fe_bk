  "use client"

  import { useState, useEffect } from "react"
  import { useRouter, useParams } from "next/navigation"
  import Link from "next/link"
  import AdminLayout from "@/components/AdminLayout"
  import { getImageUrl } from "@/lib/image"


  interface Post {
    id: number
    title: string
    content: string
    thumbnail: string | null
    publishedAt: Date | null
    published: boolean
    createdAt: Date
    updatedAt: Date
  }

  export default function ArtikelDetailPage() {
    const api = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const params = useParams()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
      fetchPost()
    }, [params.id])

    const fetchPost = async () => {
      try {
        const res = await fetch(`${api}/api/posts/${params.id}`)
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data")
        
        setPost(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const handleDelete = async () => {
      if (!confirm("Yakin ingin menghapus artikel ini?")) return

      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${api}/api/posts/${params.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          }
        })
        if (!res.ok) throw new Error("Gagal menghapus")
        
        alert("Artikel dihapus!")
        router.push("/admin/artikel")
      } catch (err: any) {
        alert(err.message)
      }
    }

    const formatDate = (date: Date | null) => {
      if (!date) return "-"
      const d = new Date(date)
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    }

    if (loading) {
      return (
        <AdminLayout>
          <main style={mainContent}>
            {/* Breadcrumb */}
            <nav style={breadcrumb}>
              <span style={breadcrumbItem}>Dashboard</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbItem}>Artikel</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbActive}>Detail</span>
            </nav>

            {/* Tombol Kembali */}
            <button style={{...btnBack, opacity: 0.6}} disabled>
              ← Kembali ke Daftar Artikel
            </button>

            {/* Card Detail Skeleton */}
            <div style={detailCard} className="animate-pulse">
              <div style={{...noImage, background: "#f3f4f1"}}></div>
              <div style={{width: "60%", height: 26, background: "#f3f4f1", borderRadius: 4, marginBottom: 12}}></div>
              <div style={{width: "40%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 20}}></div>
              <div style={{...divider, background: "#f0f0f0"}}></div>
              <div style={{width: "100%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
              <div style={{width: "100%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
              <div style={{width: "80%", height: 14, background: "#f3f4f1", borderRadius: 4, marginBottom: 8}}></div>
            </div>
          </main>
        </AdminLayout>
      )
    }
    
    if (error) return (
      <AdminLayout>
        <div style={mainContent}>
          <div style={errorBox}>{error}</div>
          <button style={btnBack} onClick={() => router.push("/admin/artikel")}>
            ← Kembali ke Daftar Artikel
          </button>
        </div>
      </AdminLayout>
    )

    if (!post) return (
      <AdminLayout>
        <div style={mainContent}>
          <div style={errorBox}>Artikel tidak ditemukan</div>
          <button style={btnBack} onClick={() => router.push("/admin/artikel")}>
            ← Kembali ke Daftar Artikel
          </button>
        </div>
      </AdminLayout>
    )

    return (
      <AdminLayout>
        {/* Main Content */}

        {/* Main Content */}
        <main style={mainContent}>
          {/* Breadcrumb */}
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbItem} onClick={() => router.push("/admin/artikel")}>Artikel</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Detail</span>
          </nav>

          {/* Tombol Kembali */}
          <button style={btnBack} onClick={() => router.push("/admin/artikel")}>
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
                    src={getImageUrl(post.thumbnail, api)}
                    alt={post.title}
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

          {/* Tombol Aksi */}
          <div style={detailActions}>
            <button 
              style={btnEdit}
              onClick={() => router.push(`/admin/artikel/edit/${post.id}`)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Artikel
            </button>
            <button 
              style={btnDelete}
              onClick={handleDelete}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Hapus Artikel
            </button>
          </div>
        </main>
      </AdminLayout>
    )
  }

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

  const detailActions = {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end" as const,
    marginTop: 20,
  }

  const btnEdit = {
    background: "#166534",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  }

  const btnDelete = {
    background: "#dc2626",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
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