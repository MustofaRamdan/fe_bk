"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Editor from "@/components/Editor"

interface Post {
  id: number
  title: string
  content: string
  thumbnail: string | null
  publishedAt: string | null
  published: boolean
  createdAt: string
}

export default function EditPost() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [content, setContent] = useState("")
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")

  // Fetch data artikel saat load
  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const res = await fetch(`${api}/api/posts/${postId}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Gagal mengambil data")

      const post: Post = data.data

      setTitle(post.title)
      setContent(post.content)
      setExistingThumbnail(post.thumbnail)

      // Format date untuk input type="date" (YYYY-MM-DD)
      if (post.publishedAt) {
        const d = new Date(post.publishedAt)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, "0")
        const dd = String(d.getDate()).padStart(2, "0")
        setDate(`${yyyy}-${mm}-${dd}`)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setFetching(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewThumbnail(e.dataTransfer.files[0])
      setExistingThumbnail(null) // Hapus thumbnail lama dari tampilan
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewThumbnail(e.target.files[0])
      setExistingThumbnail(null)
    }
  }

  const handleRemoveThumbnail = () => {
    setNewThumbnail(null)
    setExistingThumbnail(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo("")

    try {
      let thumbnailUrl = existingThumbnail || ""

      // Upload thumbnail baru jika ada
      if (newThumbnail) {
        console.log("📤 Uploading thumbnail...")
        const formData = new FormData()
        formData.append("file", newThumbnail)

        const uploadRes = await fetch( `${api}/api/upload`, {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) {
            const uploadErr = await uploadRes.text()
            throw new Error("Gagal mengunggah thumbnail: " + uploadErr)
          }

          const uploadData = await uploadRes.json()
          thumbnailUrl = uploadData.url
        }

        // Kalau thumbnail dihapus (null), kirim null
        if (!existingThumbnail && !newThumbnail) {
          thumbnailUrl = ""
        }

        const payload = {
          title,
          content,
          thumbnail: thumbnailUrl,
          publishedAt: date || undefined,
        }

        // Update artikel     
      const res = await fetch(`${api}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      })

      const responseText = await res.text()
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = { raw: responseText }
      }

      if (!res.ok) {
        throw new Error(data.error || data.detail || `HTTP ${res.status}`)
      }

      console.log("✅ UPDATE SUKSES:", data)
      alert("Artikel berhasil diperbarui!")
      router.push("/admin/artikel")

    } catch (err: any) {
      console.error("💥 ERROR:", err)
      setError(err.message || "Terjadi kesalahan")
      setDebugInfo(`Detail: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("Batalkan perubahan?")) {
      router.push("/admin/artikel")
    }
  }

  if (fetching) {
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
          <p style={{padding: 20}}>Loading...</p>
        </main>
      </div>
    )
  }

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
        <div style={titleSection}>
          <h2 style={pageTitle}>Edit Artikel</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin/dashboard")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbItem} onClick={() => router.push("/admin/artikel")}>Artikel</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Edit Artikel</span>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div style={errorBox}>
            <strong>Error:</strong> {error}
            {debugInfo && <div style={{marginTop: 8, fontSize: 12, opacity: 0.8}}>{debugInfo}</div>}
          </div>
        )}

        {/* Card */}
        <div style={card}>
          <form onSubmit={handleSubmit}>
            
            <div style={formGroup}>
              <label style={label}>Judul Artikel</label>
              <input
                type="text"
                placeholder="Masukkan judul Artikel..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={input}
                required
              />
            </div>

            <div style={formGroup}>
              <label style={label}>Tanggal Publikasi</label>
              <div style={dateInputWrapper}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={dateInput}
                />
                <span style={calendarIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>

            <div style={formGroup}>
              <label style={label}>Konten Artikel</label>
              <Editor onChange={setContent} initialValue={content} />
            </div>

            <div style={formGroup}>
              <label style={label}>Thumbnail Artikel</label>
              
              {/* Tampilkan thumbnail yang sudah ada */}
              {existingThumbnail && !newThumbnail && (
                <div style={existingThumbnailBox}>
                    <img 
                      src={`${api}${existingThumbnail}`}
                      alt="Thumbnail saat ini"
                      style={existingThumbnailImg}
                    />
                  <button 
                    type="button"
                    style={btnRemoveThumbnail}
                    onClick={handleRemoveThumbnail}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Hapus Thumbnail
                  </button>
                </div>
              )}

              {/* Upload area */}
              <div 
                style={{
                  ...uploadBox,
                  ...(dragActive ? uploadBoxActive : {}),
                  ...(newThumbnail ? uploadBoxHasFile : {}),
                  ...(existingThumbnail && !newThumbnail ? {marginTop: 12} : {})
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={fileInput}
                />
                <div style={uploadContent}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={uploadIcon}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p style={uploadText}>
                    {newThumbnail ? newThumbnail.name : "Klik untuk mengganti thumbnail"}
                  </p>
                  <p style={uploadSubtext}>Seret dan lepas berkas disini</p>
                </div>
              </div>
            </div>

            <div style={buttonGroup}>
              <button 
                type="button" 
                style={btnCancel} 
                onClick={handleCancel}
                disabled={loading}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{
                  ...btnSave,
                  ...(loading ? btnSaveDisabled : {})
                }}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
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

const errorBox = {
  background: "#fee2e2",
  border: "1px solid #ef4444",
  color: "#dc2626",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 14,
}

const card = {
  background: "white",
  padding: "24px",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
}

const formGroup = {
  marginBottom: 16,
}

const label = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  color: "#333",
  marginBottom: 6,
}

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  color: "#333",
}

const dateInputWrapper = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
}

const dateInput = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  color: "#333",
  paddingRight: 36,
}

const calendarIcon = {
  position: "absolute" as const,
  right: 12,
  pointerEvents: "none" as const,
  display: "flex",
  alignItems: "center",
}

const existingThumbnailBox = {
  marginBottom: 12,
}

const existingThumbnailImg = {
  width: "100%",
  maxHeight: 200,
  objectFit: "cover" as const,
  borderRadius: 8,
  marginBottom: 8,
}

const btnRemoveThumbnail = {
  background: "#fee2e2",
  color: "#dc2626",
  padding: "6px 12px",
  border: "1px solid #fecaca",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
}

const uploadBox = {
  border: "2px dashed #ddd",
  borderRadius: 10,
  padding: "32px 20px",
  textAlign: "center" as const,
  cursor: "pointer",
  position: "relative" as const,
  transition: "all 0.2s ease",
  background: "#fafafa",
}

const uploadBoxActive = {
  borderColor: "#6b7c4e",
  background: "#f5f7f2",
}

const uploadBoxHasFile = {
  borderColor: "#6b7c4e",
  background: "#f5f7f2",
}

const fileInput = {
  position: "absolute" as const,
  inset: 0,
  opacity: 0,
  cursor: "pointer",
  width: "100%",
  height: "100%",
}

const uploadContent = {
  pointerEvents: "none" as const,
}

const uploadIcon = {
  margin: "0 auto 8px",
  display: "block",
}

const uploadText = {
  fontSize: 14,
  fontWeight: 500,
  color: "#333",
  margin: "0 0 4px 0",
}

const uploadSubtext = {
  fontSize: 12,
  color: "#999",
  margin: 0,
}

const buttonGroup = {
  display: "flex",
  justifyContent: "flex-end" as const,
  gap: 10,
  marginTop: 8,
}

const btnCancel = {
  background: "#c4c4c4",
  color: "#333",
  padding: "8px 20px",
  border: "none",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s",
}

const btnSave = {
  background: "#6b7c4e",
  color: "white",
  padding: "8px 20px",
  border: "none",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s",
}

const btnSaveDisabled = {
  opacity: 0.7,
  cursor: "not-allowed",
}