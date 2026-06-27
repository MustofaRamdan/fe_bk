"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"
import AdminLayout from "@/components/AdminLayout"

const KELAS_OPTIONS = ["X", "XI", "XII"]
const JURUSAN_OPTIONS = ["RPL 1", "RPL 2", "BR 1", "BR 2", "AKL 1", "AKL 2", "MP 1", "MP 2"]

function TambahKaryaForm() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromAdmin = searchParams.get("from") === "admin"

  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")

  const [link, setLink] = useState("")
  const [namaPembuat, setNamaPembuat] = useState("")
  const [kelas, setKelas] = useState("")
  const [jurusan, setJurusan] = useState("")
  const [email, setEmail] = useState("")              // ← BARU
  const [inginNotifEmail, setInginNotifEmail] = useState(false) // ← BARU
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    try {
      // Validasi email kalau dicentang
      if (inginNotifEmail && !email.trim()) {
        throw new Error("Email wajib diisi jika ingin menerima notifikasi")
      }

      let thumbnailUrl = ""

      // Upload thumbnail karya
      if (thumbnail) {
        const formData = new FormData()
        formData.append("file", thumbnail)

        const uploadRes = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah thumbnail karya")
        }

        const uploadData = await uploadRes.json()
        thumbnailUrl = uploadData.url
      }

      // Simpan data karya
      const res = await fetch(`${api}/api/karya`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul,
          deskripsi,
          link,
          namaPembuat,
          kelas,
          jurusan,
          email: inginNotifEmail ? email : null,  // ← BARU
          inginNotifEmail,                          // ← BARU
          thumbnail: thumbnailUrl,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan karya")
      }

      alert("Karya siswa berhasil disimpan! Status: PENDING (menunggu persetujuan admin)")
      router.push(fromAdmin ? "/admin/karya" : "/karya")

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("Batalkan perubahan?")) {
      if (fromAdmin) {
        router.push("/admin/karya")
      } else {
        router.back()
      }
    }
  }

  const Layout = fromAdmin ? AdminLayout : DesktopLayout

  return (
    <Layout>

      {/* Main Content */}
      <main style={mainContent}>
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Tambah Karya Siswa</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push(fromAdmin ? "/admin" : "/")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbItem} onClick={() => router.push(fromAdmin ? "/admin/karya" : "/karya")}>Karya Siswa</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Tambah Karya Siswa</span>
          </nav>
        </div>

        {/* Error */}
        {error && <div style={errorBox}>{error}</div>}

        {/* Card */}
        <div style={card}>
          <form onSubmit={handleSubmit}>
            
            {/* Judul Karya */}
            <div style={formGroup}>
              <label style={label}>Judul karya</label>
              <input
                type="text"
                placeholder="Masukkan judul karya..."
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                style={input}
                required
              />
            </div>

            {/* Deskripsi Singkat */}
            <div style={formGroup}>
              <label style={label}>Deskripsi singkat</label>
              <input
                type="text"
                placeholder="Masukkan deskripsi singkat..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                style={input}
                required
              />
            </div>

            {/* Link Karya */}
            <div style={formGroup}>
              <label style={label}>Link karya</label>
              <input
                type="url"
                placeholder="Masukkan link karya..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={input}
              />
            </div>

            {/* Nama Pembuat */}
            <div style={formGroup}>
              <label style={label}>Nama pembuat karya</label>
              <input
                type="text"
                placeholder="Masukkan nama pembuat karya..."
                value={namaPembuat}
                onChange={(e) => setNamaPembuat(e.target.value)}
                style={input}
                required
              />
            </div>

            {/* Kelas */}
            <div style={formGroup}>
              <label style={label}>Masukkan kelas pembuat karya</label>
              <div style={selectWrapper}>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  style={select}
                  required
                >
                  <option value="" disabled>Pilih kelas pembuat karya</option>
                  {KELAS_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <span style={selectArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Jurusan */}
            <div style={formGroup}>
              <label style={label}>Masukkan jurusan pembuat karya</label>
              <div style={selectWrapper}>
                <select
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  style={select}
                  required
                >
                  <option value="" disabled>Pilih jurusan pembuat karya</option>
                  {JURUSAN_OPTIONS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <span style={selectArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* ============================================
                EMAIL NOTIFIKASI — BARU
            ============================================ */}
            <div style={{...formGroup, borderTop: "1px solid #eee", paddingTop: 16}}>
              <label style={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={inginNotifEmail}
                  onChange={(e) => setInginNotifEmail(e.target.checked)}
                  style={checkbox}
                />
                <span>Saya ingin menerima notifikasi via email saat karya disetujui (opsional)</span>
              </label>

              {inginNotifEmail && (
                <div style={{marginTop: 12}}>
                  <label style={label}>Email <span style={required}>*</span></label>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={input}
                    required={inginNotifEmail}
                  />
                  <p style={hint}>Notifikasi akan dikirim ke email ini saat karya disetujui admin</p>
                </div>
              )}
            </div>

            {/* Upload Thumbnail Karya */}
            <div style={formGroup}>
              <label style={label}>Upload karya siswa</label>
              <p style={uploadKeterangan}>
                📎 Upload berupa gambar/thumbnail/foto karya (JPG, PNG, WEBP)
              </p>
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

            {/* Info Status */}
            <div style={infoBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                <strong>Status:</strong> PENDING (menunggu persetujuan admin). 
                Setelah disetujui akan <strong>DITAMPILKAN</strong>.
                {inginNotifEmail && email && ` Notifikasi akan dikirim ke ${email}.`}
              </span>
            </div>

            {/* Buttons */}
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
    </Layout>
  )
}

export default function TambahKaryaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <TambahKaryaForm />
    </Suspense>
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

const required = {
  color: "#dc2626",
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
  background: "white",
}

const selectWrapper = {
  position: "relative" as const,
}

const select = {
  width: "100%",
  padding: "10px 36px 10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  color: "#333",
  background: "white",
  appearance: "none" as const,
  cursor: "pointer",
}

const selectArrow = {
  position: "absolute" as const,
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
}

// Email styles — BARU
const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 14,
  color: "#333",
  cursor: "pointer",
  padding: "8px 0",
}

const checkbox = {
  width: 18,
  height: 18,
  accentColor: "#687E50",
  cursor: "pointer",
}

const hint = {
  fontSize: 11,
  color: "#999",
  margin: "4px 0 0 0",
  fontStyle: "italic",
}

const uploadKeterangan = {
  fontSize: 12,
  color: "#666",
  margin: "0 0 8px 0",
  fontStyle: "italic",
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

const infoBox = {
  background: "#f0f4ec",
  border: "1px solid #687E50",
  color: "#4a5a3a",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 13,
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
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