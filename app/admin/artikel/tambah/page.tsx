"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Editor from "@/components/Editor"
import AdminLayout from "@/components/AdminLayout"

export default function NewPost() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [content, setContent] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("") // Untuk debug

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
      setThumbnail(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo("")

    try {
      let thumbnailUrl = ""
      const token = localStorage.getItem("token")

      // Upload thumbnail jika ada
      if (thumbnail) {
        console.log("ðŸ“¤ Uploading thumbnail...")
        const formData = new FormData()
        formData.append("file", thumbnail)

        const uploadRes = await fetch(`${api}/api/upload`, {
          method: "POST",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          },
          body: formData
        })

        console.log("ðŸ“¤ Upload status:", uploadRes.status)

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.text()
          console.error("â Œ Upload gagal:", uploadErr)
          throw new Error("Gagal mengunggah thumbnail: " + uploadErr)
        }

        const uploadData = await uploadRes.json()
        thumbnailUrl = uploadData.url
        console.log("âœ… Upload sukses:", thumbnailUrl)
      }

      // Data yang akan dikirim
      const payload = {
        title,
        content,
        thumbnail: thumbnailUrl,
        publishedAt: date || undefined,
      }
      console.log("ðŸ“¦ PAYLOAD:", payload)

      // Simpan artikel ke database
      const res = await fetch(`${api}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload)
      })

      console.log("ðŸ“¥ Response status:", res.status)
      
      const responseText = await res.text()
      console.log("ðŸ“¥ Response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = { raw: responseText }
      }

      if (!res.ok) {
        throw new Error(data.error || data.detail || `HTTP ${res.status}: ${responseText}`)
      }

      console.log("✅ SUKSES:", data)
      alert("Artikel berhasil disimpan!")
      router.push("/admin/artikel")

    } catch (err: any) {
      console.error("💥 FRONTEND ERROR:", err)
      setError(err.message || "Terjadi kesalahan")
      setDebugInfo(`Detail: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("Batalkan perubahan?")) {
      router.back()
    }
  }

  return (
    <AdminLayout>
      {/* Main Content */}
      <main style={mainContent}>
        <div style={titleSection}>
          <h2 style={pageTitle}>Tambah Artikel</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbItem} onClick={() => router.push("/admin/artikel")}>Artikel</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Tambah Artikel</span>
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
              <Editor onChange={setContent} />
            </div>

            <div style={formGroup}>
              <label style={label}>Upload Thumbnail Artikel</label>
              <div 
                style={{
                  ...uploadBox,
                  ...(dragActive ? uploadBoxActive : {}),
                  ...(thumbnail ? uploadBoxHasFile : {})
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
                  <p style={uploadText}>Klik untuk mengunggah</p>
                  <p style={uploadSubtext}>Seret dan lepas berkas disini</p>
                  {thumbnail && (
                    <p style={fileName}>{thumbnail.name}</p>
                  )}
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
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </AdminLayout>
  )
}

// Styles (sama seperti sebelumnya)
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
  borderColor: "#687E50",
  background: "#f5f7f2",
}

const uploadBoxHasFile = {
  borderColor: "#687E50",
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

const fileName = {
  fontSize: 12,
  color: "#687E50",
  margin: "8px 0 0 0",
  fontWeight: 500,
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
  background: "#687E50",
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