"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
  { value: "", label: "Pilih status saat ini" },
  { value: "KULIAH", label: "Kuliah" },
  { value: "BEKERJA", label: "Bekerja" },
  { value: "WIRAUSAHA", label: "Wirausaha" },
]

// ✅ COMPONENT INPUT TAHUN DENGAN VALIDASI
const TahunInput = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Hanya izinkan angka, max 4 digit
    if (val === '' || (/^\d+$/.test(val) && val.length <= 4)) {
      onChange(val)
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      style={input}
      required
    />
  )
}

export default function TambahAlumniPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [namaLengkap, setNamaLengkap] = useState("")
  const [tahunLulus, setTahunLulus] = useState("")
  const [status, setStatus] = useState("")
  // Kuliah
  const [namaKampus, setNamaKampus] = useState("")
  const [programStudi, setProgramStudi] = useState("")
  const [tahunMasukKuliah, setTahunMasukKuliah] = useState("")
  // Bekerja
  const [namaPerusahaan, setNamaPerusahaan] = useState("")
  const [tahunMasukKerja, setTahunMasukKerja] = useState("")
  // Wirausaha
  const [namaUsaha, setNamaUsaha] = useState("")
  const [tahunAwalUsaha, setTahunAwalUsaha] = useState("")
  // Umum
  const [buktiPendukung, setBuktiPendukung] = useState<File | null>(null)
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
      setBuktiPendukung(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiPendukung(e.target.files[0])
    }
  }

  const validateTahun = (tahun: string): boolean => {
    if (!tahun) return false
    const num = parseInt(tahun)
    const currentYear = new Date().getFullYear()
    return num >= 1900 && num <= currentYear + 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validasi tahun
    if (!validateTahun(tahunLulus)) {
      setError("Tahun lulus tidak valid (format: YYYY)")
      setLoading(false)
      return
    }

    if (status === "KULIAH" && !validateTahun(tahunMasukKuliah)) {
      setError("Tahun masuk kuliah tidak valid (format: YYYY)")
      setLoading(false)
      return
    }

    if (status === "BEKERJA" && !validateTahun(tahunMasukKerja)) {
      setError("Tahun masuk kerja tidak valid (format: YYYY)")
      setLoading(false)
      return
    }

    if (status === "WIRAUSAHA" && !validateTahun(tahunAwalUsaha)) {
      setError("Tahun awal usaha tidak valid (format: YYYY)")
      setLoading(false)
      return
    }

    try {
      let buktiUrl = ""

      if (buktiPendukung) {
        const formData = new FormData()
        formData.append("file", buktiPendukung)

        const uploadRes = await fetch(`${api}/api/upload`, {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) throw new Error("Gagal mengunggah bukti pendukung")

        const uploadData = await uploadRes.json()
        buktiUrl = uploadData.url
      }

      const payload: any = {
        namaLengkap,
        tahunLulus,
        status,
        buktiPendukung: buktiUrl,
      }

      if (status === "KULIAH") {
        payload.namaKampus = namaKampus
        payload.programStudi = programStudi
        payload.tahunMasukKuliah = tahunMasukKuliah
      } else if (status === "BEKERJA") {
        payload.namaPerusahaan = namaPerusahaan
        payload.tahunMasukKerja = tahunMasukKerja
      } else if (status === "WIRAUSAHA") {
        payload.namaUsaha = namaUsaha
        payload.tahunAwalUsaha = tahunAwalUsaha
      }

      const res = await fetch(`${api}/api/alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan data")
      }

      alert("Pengajuan data alumni berhasil dikirim! Menunggu persetujuan admin.")
      router.push("/alumni")

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("Batalkan pengajuan?")) {
      router.back()
    }
  }

  const renderStatusFields = () => {
    if (status === "KULIAH") {
      return (
        <>
          <div style={formRow}>
            <div style={formGroupHalf}>
              <label style={label}>Nama Kampus</label>
              <input
                type="text"
                placeholder="Masukkan nama kampus..."
                value={namaKampus}
                onChange={(e) => setNamaKampus(e.target.value)}
                style={input}
                required
              />
            </div>
            <div style={formGroupHalf}>
              <label style={label}>Program Studi</label>
              <input
                type="text"
                placeholder="Masukkan program studi..."
                value={programStudi}
                onChange={(e) => setProgramStudi(e.target.value)}
                style={input}
                required
              />
            </div>
          </div>
          <div style={formGroup}>
            <label style={label}>Tahun Masuk Kuliah</label>
            <TahunInput
              value={tahunMasukKuliah}
              onChange={setTahunMasukKuliah}
              placeholder="Contoh: 2023"
            />
          </div>
        </>
      )
    }

    if (status === "BEKERJA") {
      return (
        <>
          <div style={formGroup}>
            <label style={label}>Nama Perusahaan</label>
            <input
              type="text"
              placeholder="Masukkan nama perusahaan..."
              value={namaPerusahaan}
              onChange={(e) => setNamaPerusahaan(e.target.value)}
              style={input}
              required
            />
          </div>
          <div style={formGroup}>
            <label style={label}>Tahun Masuk Bekerja</label>
            <TahunInput
              value={tahunMasukKerja}
              onChange={setTahunMasukKerja}
              placeholder="Contoh: 2022"
            />
          </div>
        </>
      )
    }

    if (status === "WIRAUSAHA") {
      return (
        <>
          <div style={formGroup}>
            <label style={label}>Nama Usaha</label>
            <input
              type="text"
              placeholder="Masukkan nama usaha..."
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              style={input}
              required
            />
          </div>
          <div style={formGroup}>
            <label style={label}>Berdiri Sejak (Tahun Awal Usaha)</label>
            <TahunInput
              value={tahunAwalUsaha}
              onChange={setTahunAwalUsaha}
              placeholder="Contoh: 2020"
            />
          </div>
        </>
      )
    }

    return null
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
        {/* Title & Breadcrumb */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Ajukan Data Kuliah</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbItem}>Alumni</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Ajukan Data Kuliah</span>
          </nav>
        </div>

        {/* Error */}
        {error && <div style={errorBox}>{error}</div>}

        {/* Card */}
        <div style={card}>
          <form onSubmit={handleSubmit}>
            
            {/* Nama Lengkap */}
            <div style={formGroup}>
              <label style={label}>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Poster Edukasi Mental Health"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                style={input}
                required
              />
            </div>

            {/* Tahun Lulus - PAKE COMPONENT BARU */}
            <div style={formGroup}>
              <label style={label}>Tahun Lulus Sekolah</label>
              <TahunInput
                value={tahunLulus}
                onChange={setTahunLulus}
                placeholder="Contoh: 2022"
              />
            </div>

            {/* Status Saat Ini */}
            <div style={formGroup}>
              <label style={label}>Status Saat Ini</label>
              <div style={selectWrapper}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={select}
                  required
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <span style={selectArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Dynamic Fields */}
            {renderStatusFields()}

            {/* Bukti Pendukung */}
            <div style={formGroup}>
              <label style={label}>Bukti Pendukung</label>
              <div 
                style={{
                  ...uploadBox,
                  ...(dragActive ? uploadBoxActive : {}),
                  ...(buktiPendukung ? uploadBoxHasFile : {})
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
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
                  {buktiPendukung && (
                    <p style={fileName}>{buktiPendukung.name}</p>
                  )}
                </div>
              </div>
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
                {loading ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

// Styles (sama seperti sebelumnya)
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

const formRow = {
  display: "flex",
  gap: 12,
  marginBottom: 16,
}

const formGroupHalf = {
  flex: 1,
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

const fileName = {
  fontSize: 12,
  color: "#6b7c4e",
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