"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"

type ModeKonseling = "anonim" | "terdaftar" | null

interface FormData {
  nama: string
  kelas: string
  jurusan: string
  email: string
  topik: string
  deskripsi: string
  inginJawabanEmail: boolean
}

export default function KonselingPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [mode, setMode] = useState<ModeKonseling>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [form, setForm] = useState<FormData>({
    nama: "",
    kelas: "",
    jurusan: "",
    email: "",
    topik: "",
    deskripsi: "",
    inginJawabanEmail: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleModeSelect = (selectedMode: ModeKonseling) => {
    setMode(selectedMode)
    setStep(2)
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        mode,
        ...form,
        // Kalau anonim, kosongkan data pribadi
        nama: mode === "anonim" ? "Anonim" : form.nama,
        kelas: mode === "anonim" ? "-" : form.kelas,
        jurusan: mode === "anonim" ? "-" : form.jurusan,
      }

      const res = await fetch(`${api}/api/konseling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mengirim")

      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const waGuruBK = "https://wa.me/6281234567890?text=Halo%20Guru%20BK,%20saya%20ingin%20konseling%20langsung"

  // ==================== STEP 1: PILIH MODE ====================
  if (step === 1) {
    return (
      <DesktopLayout>
        <main style={mainContent}>
          <div style={titleSection}>
            <h2 style={pageTitle}>Konseling</h2>
            <nav style={breadcrumb}>
              <span style={breadcrumbItem} onClick={() => router.push("/")}>Beranda</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbActive}>Konseling</span>
            </nav>
          </div>

          <div className="form-card" style={card}>
            <h3 style={cardTitle}>Pilih Mode Konseling</h3>
            <p style={cardSubtitle}>Silakan pilih cara konseling yang Anda inginkan</p>

            <div style={modeGrid}>
              {/* Mode Anonim */}
              <button style={modeCard} onClick={() => handleModeSelect("anonim")}>
                <div style={modeIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <line x1="4" y1="7" x2="4" y2="7" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                </div>
                <h4 style={modeTitle}>Anonim</h4>
                <p style={modeDesc}>
                  Konseling tanpa identitas. Tidak perlu memasukkan nama, kelas, dan jurusan.
                </p>
              </button>

              {/* Mode Terdaftar */}
              <button style={modeCard} onClick={() => handleModeSelect("terdaftar")}>
                <div style={modeIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 style={modeTitle}>Siswa Terdaftar</h4>
                <p style={modeDesc}>
                  Konseling dengan identitas. Masukkan nama, kelas, dan jurusan untuk pencatatan.
                </p>
              </button>
            </div>

            {/* Opsi Langsung WA */}
            <div style={waOption}>
              <p style={waText}>Atau ingin konseling langsung dengan Guru BK?</p>
              <a href={waGuruBK} target="_blank" rel="noopener noreferrer" style={btnWA}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat Langsung via WhatsApp
              </a>
            </div>
          </div>
        </main>
      </DesktopLayout>
    )
  }

  // ==================== STEP 2: FORM KONSELING ====================
  if (step === 2) {
    return (
      <DesktopLayout>
        <main style={mainContent}>
          <div style={titleSection}>
            <h2 style={pageTitle}>Konseling</h2>
            <nav style={breadcrumb}>
              <span style={breadcrumbItem} onClick={() => router.push("/")}>Beranda</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbItem} onClick={() => setStep(1)}>Pilih Mode</span>
              <span style={breadcrumbSeparator}>&rsaquo;</span>
              <span style={breadcrumbActive}>Form Konseling</span>
            </nav>
          </div>

          <div className="form-card" style={card}>
            <div style={modeBadge}>
              Mode: <strong>{mode === "anonim" ? "Anonim" : "Siswa Terdaftar"}</strong>
              <button style={btnUbahMode} onClick={() => setStep(1)}>Ubah</button>
            </div>

            <h3 style={cardTitle}>Formulir Konseling</h3>
            <p style={cardSubtitle}>Ceritakan permasalahan Anda, Guru BK siap membantu</p>

            {error && <div style={errorBox}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Data Pribadi — Hanya untuk mode terdaftar */}
              {mode === "terdaftar" && (
                <div style={sectionForm}>
                  <h4 style={sectionFormTitle}>Data Diri</h4>

                  <div style={formRow}>
                    <div style={formGroup}>
                      <label style={label}>Nama Lengkap <span style={required}>*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={form.nama}
                        onChange={(e) => handleChange("nama", e.target.value)}
                        style={input}
                        required={mode === "terdaftar"}
                      />
                    </div>

                    <div style={formGroup}>
                      <label style={label}>Kelas <span style={required}>*</span></label>
                      <select
                        value={form.kelas}
                        onChange={(e) => handleChange("kelas", e.target.value)}
                        style={select}
                        required={mode === "terdaftar"}
                      >
                        <option value="">Pilih Kelas</option>
                        <option value="X">X</option>
                        <option value="XI">XI</option>
                        <option value="XII">XII</option>
                      </select>
                    </div>
                  </div>

                  <div style={formGroup}>
                    <label style={label}>Jurusan <span style={required}>*</span></label>
                    <select
                      value={form.jurusan}
                      onChange={(e) => handleChange("jurusan", e.target.value)}
                      style={select}
                      required={mode === "terdaftar"}
                    >
                      <option value="">Pilih Jurusan</option>
                      <option value="RPL 1">RPL 1</option>
                      <option value="RPL 2">RPL 2</option>
                      <option value="BR 1">BR 1</option>
                      <option value="BR 2">BR 2</option>
                      <option value="AK 1">AK 1</option>
                      <option value="AK 2">AK 2</option>
                      <option value="MP 1">MP 1</option>
                      <option value="MP 2">MP 2</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Topik Konseling */}
              <div style={sectionForm}>
                <h4 style={sectionFormTitle}>Permasalahan</h4>

                <div style={formGroup}>
                  <label style={label}>Topik Konseling <span style={required}>*</span></label>
                  <select
                    value={form.topik}
                    onChange={(e) => handleChange("topik", e.target.value)}
                    style={select}
                    required
                  >
                    <option value="">Pilih Topik</option>
                    <option value="akademik">Masalah Akademik</option>
                    <option value="keluarga">Masalah Keluarga</option>
                    <option value="pertemanan">Masalah Pertemanan</option>
                    <option value="percintaan">Masalah Percintaan</option>
                    <option value="karir">Karir & Masa Depan</option>
                    <option value="mental">Kesehatan Mental</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label style={label}>Deskripsi Permasalahan <span style={required}>*</span></label>
                  <textarea
                    placeholder="Jelaskan permasalahan Anda secara detail..."
                    value={form.deskripsi}
                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                    style={textarea}
                    rows={5}
                    required
                  />
                </div>
              </div>

              {/* Opsi Email */}
              <div style={sectionForm}>
                <h4 style={sectionFormTitle}>Opsi Jawaban</h4>

                <label style={checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.inginJawabanEmail}
                    onChange={(e) => handleChange("inginJawabanEmail", e.target.checked)}
                    style={checkbox}
                  />
                  <span>Saya ingin menerima jawaban via email (opsional)</span>
                </label>

                {form.inginJawabanEmail && (
                  <div style={formGroup}>
                    <label style={label}>Email <span style={required}>*</span></label>
                    <input
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      style={input}
                      required={form.inginJawabanEmail}
                    />
                    <p style={hint}>Jawaban akan dikirim ke email ini dalam 1-3 hari kerja</p>
                  </div>
                )}

                {!form.inginJawabanEmail && (
                  <p style={infoText}>
                    Tanpa email, Anda dapat datang langsung ke ruang BK atau chat WhatsApp Guru BK untuk mengetahui jawaban.
                  </p>
                )}
              </div>

              {/* Tombol */}
              <div style={buttonGroup}>
                <button type="button" style={btnCancel} onClick={() => setStep(1)}>
                  Kembali
                </button>
                <button
                  type="submit"
                  style={{ ...btnSubmit, ...(loading ? btnSubmitDisabled : {}) }}
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Konseling"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </DesktopLayout>
    )
  }

  // ==================== STEP 3: SUKSES ====================
  return (
    <DesktopLayout>
      <main style={mainContent}>
        <div className="form-card" style={successCard}>
          <div style={successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#687E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 style={successTitle}>Konseling Terkirim!</h3>
          <p style={successText}>
            {form.inginJawabanEmail
              ? "Terima kasih. Jawaban akan dikirim ke email Anda dalam 1-3 hari kerja."
              : "Terima kasih. Silakan datang ke ruang BK untuk mengetahui jawaban."}
          </p>

          <div style={successActions}>
            <button style={btnBackHome} onClick={() => router.push("/")}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </main>
    </DesktopLayout>
  )
}

// ==================== STYLES ====================

const pageWrapper = {
  background: "#e8e8e8",
  minHeight: "100vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  paddingBottom: 40,
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
  maxWidth: 600,
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

const card = {
  background: "white",
  padding: "32px 28px",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
  border: "1px solid rgba(229, 231, 235, 0.6)",
  maxWidth: 600,
  margin: "0 auto",
}

const cardTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
}

const cardSubtitle = {
  fontSize: 13,
  color: "#666",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
}

// Mode Selection
const modeGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 24,
}

const modeCard = {
  background: "#f8f9f5",
  border: "2px solid #e0e5d6",
  borderRadius: 12,
  padding: 20,
  cursor: "pointer",
  textAlign: "center" as const,
  transition: "all 0.2s",
}

const modeIcon = {
  width: 60,
  height: 60,
  background: "#f0f4e8",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 12px",
}

const modeTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 8px 0",
}

const modeDesc = {
  fontSize: 11,
  color: "#666",
  lineHeight: 1.5,
  margin: 0,
}

// WA Option
const waOption = {
  borderTop: "1px solid #eee",
  paddingTop: 20,
  textAlign: "center" as const,
}

const waText = {
  fontSize: 13,
  color: "#666",
  margin: "0 0 12px 0",
}

const btnWA = {
  display: "inline-flex",
  alignItems: "center",
  background: "#25D366",
  color: "white",
  padding: "12px 20px",
  borderRadius: 8,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
}

// Mode Badge
const modeBadge = {
  background: "#f0f4e8",
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 12,
  color: "#687E50",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
}

const btnUbahMode = {
  background: "none",
  border: "none",
  color: "#687E50",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
}

// Form
const sectionForm = {
  marginBottom: 24,
  paddingBottom: 24,
  borderBottom: "1px solid #eee",
}

const sectionFormTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 16px 0",
}

const formRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
}

const formGroup = {
  marginBottom: 12,
}

const label = {
  display: "block",
  fontSize: 13,
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
}

const select = {
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

const textarea = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  color: "#333",
  resize: "vertical" as const,
  fontFamily: "inherit",
}

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#333",
  cursor: "pointer",
  marginBottom: 12,
}

const checkbox = {
  width: 18,
  height: 18,
  accentColor: "#687E50",
}

const hint = {
  fontSize: 11,
  color: "#999",
  margin: "4px 0 0 0",
}

const infoText = {
  fontSize: 12,
  color: "#666",
  background: "#f8f9f5",
  padding: 12,
  borderRadius: 8,
  margin: "8px 0 0 0",
}

// Buttons
const buttonGroup = {
  display: "flex",
  gap: 12,
  justifyContent: "flex-end" as const,
  marginTop: 8,
}

const btnCancel = {
  background: "#c4c4c4",
  color: "#333",
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
}

const btnSubmit = {
  background: "#687E50",
  color: "white",
  padding: "10px 24px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

const btnSubmitDisabled = {
  opacity: 0.7,
  cursor: "not-allowed",
}

const errorBox = {
  background: "#fee2e2",
  border: "1px solid #ef4444",
  color: "#dc2626",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 13,
}

// Success
const successCard = {
  background: "white",
  padding: "40px 24px",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
  border: "1px solid rgba(229, 231, 235, 0.6)",
  textAlign: "center" as const,
  marginTop: 40,
  maxWidth: 600,
  margin: "40px auto 0",
}

const successIcon = {
  width: 80,
  height: 80,
  background: "#f0f4e8",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
}

const successTitle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 12px 0",
}

const successText = {
  fontSize: 14,
  color: "#666",
  lineHeight: 1.6,
  margin: "0 0 24px 0",
}

const successActions = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  alignItems: "center",
}

const btnWAOutline = {
  display: "inline-flex",
  alignItems: "center",
  background: "white",
  color: "#25D366",
  border: "2px solid #25D366",
  padding: "12px 24px",
  borderRadius: 8,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
}

const btnBackHome = {
  background: "#687E50",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}