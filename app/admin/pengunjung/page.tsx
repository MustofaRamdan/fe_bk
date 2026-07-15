"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import Pagination from "@/components/Pagination"

interface Pengunjung {
  id: number
  tipe: string // "siswa" or "bukan_siswa"
  nama: string
  kelas: string | null
  jurusan: string | null
  tujuan: string | null
  alesan: string | null
  tanggal: string
  createdAt: string
}

export default function AdminPengunjungPage() {
  const api = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  
  const [data, setData] = useState<Pengunjung[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"SEMUA" | "siswa" | "bukan_siswa">("SEMUA")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    fetchPengunjung()
  }, [])

  const fetchPengunjung = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/pengunjung`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        }
      })
      const json = await res.json()
      if (res.ok) {
        setData(json.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kunjungan ini?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${api}/api/pengunjung/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        }
      })
      if (res.ok) {
        alert("Data kunjungan berhasil dihapus")
        fetchPengunjung()
      } else {
        const json = await res.json()
        alert(json.error || "Gagal menghapus data")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan koneksi")
    }
  }

  // Export to CSV Function
  const handleExportCSV = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor")
      return
    }

    // CSV Headers
    const headers = ["ID", "Tipe", "Nama Pengunjung", "Kelas", "Jurusan", "Tujuan Kunjungan", "Alasan/Keterangan", "Tanggal Kunjungan"]
    
    // Format rows
    const rows = data.map(p => [
      p.id,
      p.tipe === "siswa" ? "Siswa" : "Bukan Siswa",
      p.nama,
      p.kelas || "-",
      p.jurusan || "-",
      p.tujuan || "-",
      p.alesan || "-",
      p.tanggal
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `data_pengunjung_bk_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter Data
  const filtered = data.filter((p) => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.kelas && p.kelas.toLowerCase().includes(search.toLowerCase())) ||
      (p.jurusan && p.jurusan.toLowerCase().includes(search.toLowerCase())) ||
      (p.tujuan && p.tujuan.toLowerCase().includes(search.toLowerCase()))
    
    const matchesType = typeFilter === "SEMUA" ? true : p.tipe === typeFilter
    return matchesSearch && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Chart Data Calculations (Last 7 Days of Visits)
  const getChartData = () => {
    const counts: Record<string, number> = {}
    
    // Sort all visitors by date ascending
    const sortedData = [...data].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    
    sortedData.forEach(p => {
      // Clean date key
      let dateKey = p.tanggal
      try {
        const d = new Date(p.tanggal)
        if (!isNaN(d.getTime())) {
          dateKey = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
        }
      } catch (e) {}
      
      counts[dateKey] = (counts[dateKey] || 0) + 1
    })

    // Take last 7 days of entries
    const keys = Object.keys(counts).slice(-7)
    return keys.map(key => ({
      date: key,
      count: counts[key]
    }))
  }

  const chartData = getChartData()
  const maxCount = chartData.length > 0 ? Math.max(...chartData.map(d => d.count)) : 0

  // General Statistics
  const totalVisits = data.length
  const totalSiswa = data.filter(d => d.tipe === "siswa").length
  const totalBukanSiswa = data.filter(d => d.tipe === "bukan_siswa").length

  return (
    <AdminLayout>
      <main style={mainContent}>
        {/* Title */}
        <div style={titleSection}>
          <h2 style={pageTitle}>Buku Tamu Pengunjung</h2>
          <nav style={breadcrumb}>
            <span style={breadcrumbItem} onClick={() => router.push("/admin")}>Dashboard</span>
            <span style={breadcrumbSeparator}>&rsaquo;</span>
            <span style={breadcrumbActive}>Buku Tamu</span>
          </nav>
        </div>

        {/* Statistics Widgets */}
        <div style={statsGrid}>
          <div style={statCard}>
            <p style={statLabel}>Total Kunjungan</p>
            <p style={statValue}>{totalVisits}</p>
          </div>
          <div style={{...statCard, background: "#dcfce7"}}>
            <p style={{...statLabel, color: "#166534"}}>Siswa</p>
            <p style={{...statValue, color: "#166534"}}>{totalSiswa}</p>
          </div>
          <div style={{...statCard, background: "#dbeafe"}}>
            <p style={{...statLabel, color: "#1e40af"}}>Bukan Siswa</p>
            <p style={{...statValue, color: "#1e40af"}}>{totalBukanSiswa}</p>
          </div>
        </div>

        {/* Trend Chart (SVG Premium Graphic) */}
        {chartData.length > 0 && (
          <div style={chartWrapper}>
            <h3 style={chartTitle}>Grafik Tren Kunjungan (7 Data Terakhir)</h3>
            <div style={svgContainer}>
              <svg viewBox="0 0 500 220" width="100%" height="100%">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Y Axis Labels */}
                <text x="30" y="24" fill="#64748b" fontSize="10" textAnchor="end">{maxCount}</text>
                <text x="30" y="99" fill="#64748b" fontSize="10" textAnchor="end">{Math.round(maxCount / 2)}</text>
                <text x="30" y="174" fill="#64748b" fontSize="10" textAnchor="end">0</text>

                {/* Render Bars */}
                {chartData.map((d, index) => {
                  const width = 36
                  const spacing = (440 / chartData.length)
                  const x = 50 + index * spacing + (spacing - width) / 2
                  const height = maxCount > 0 ? (d.count / maxCount) * 140 : 0
                  const y = 170 - height

                  return (
                    <g key={index}>
                      {/* Bar Fill Gradient */}
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#86efac" />
                          <stop offset="100%" stopColor="#687E50" />
                        </linearGradient>
                      </defs>
                      {/* Hoverable Rect */}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={`url(#grad-${index})`}
                        rx="4"
                        ry="4"
                        style={{ cursor: "pointer", transition: "all 0.3s" }}
                      />
                      {/* Count value tooltip */}
                      <text
                        x={x + width / 2}
                        y={y - 8}
                        fill="#334155"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {d.count}
                      </text>
                      {/* X Label */}
                      <text
                        x={x + width / 2}
                        y="190"
                        fill="#64748b"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {d.date}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div style={toolbar}>
          {/* Search Box */}
          <div style={searchWrapper}>
            <input
              type="text"
              placeholder="Cari nama, kelas, jurusan, tujuan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              style={searchInput}
            />
            <span style={searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          {/* Type Filter Buttons */}
          <div style={filterGroup}>
            {(["SEMUA", "siswa", "bukan_siswa"] as const).map((t) => (
              <button
                key={t}
                style={{
                  ...filterBtn,
                  ...(typeFilter === t ? filterBtnActive : {})
                }}
                onClick={() => {
                  setTypeFilter(t)
                  setCurrentPage(1)
                }}
              >
                {t === "SEMUA" ? "Semua" : t === "siswa" ? "Siswa" : "Bukan Siswa"}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button style={btnExport} onClick={handleExportCSV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table list */}
        <div style={tableCard}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#999", margin: 0 }}>Memuat data pengunjung...</p>
            </div>
          ) : paginated.length === 0 ? (
            <p style={emptyText}>Tidak ada data kunjungan</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr style={tableHead}>
                    <th style={th}>ID</th>
                    <th style={th}>Tipe</th>
                    <th style={th}>Nama</th>
                    <th style={th}>Identitas</th>
                    <th style={th}>Tujuan</th>
                    <th style={th}>Keterangan/Alasan</th>
                    <th style={th}>Tanggal</th>
                    <th style={th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => (
                    <tr key={item.id} style={tableRow}>
                      <td style={td}>#{item.id}</td>
                      <td style={td}>
                        <span style={{
                          ...typeBadge,
                          ...(item.tipe === "siswa" ? typeSiswa : typeBukanSiswa)
                        }}>
                          {item.tipe === "siswa" ? "Siswa" : "Tamu"}
                        </span>
                      </td>
                      <td style={{...td, fontWeight: 600}}>{item.nama}</td>
                      <td style={td}>
                        {item.tipe === "siswa" ? (
                          <span>{item.kelas} - {item.jurusan}</span>
                        ) : (
                          <span style={{color: "#888"}}>Bukan Siswa</span>
                        )}
                      </td>
                      <td style={td}>{item.tujuan || "-"}</td>
                      <td style={{...td, fontSize: 13, color: "#666"}}>{item.alesan || "-"}</td>
                      <td style={{...td, whiteSpace: "nowrap"}}>{item.tanggal}</td>
                      <td style={td}>
                        <button style={btnDelete} onClick={() => handleDelete(item.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </AdminLayout>
  )
}

// Styling Objects
const mainContent = {
  padding: "20px",
  maxWidth: 1000,
  margin: "0 auto",
}

const titleSection = { marginBottom: 20 }
const pageTitle = { fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 6px 0" }
const breadcrumb = { fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6 }
const breadcrumbItem = { color: "#666", cursor: "pointer" }
const breadcrumbSeparator = { color: "#999", fontSize: 14 }
const breadcrumbActive = { color: "#333", fontWeight: 600 }

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 20,
}

const statCard = {
  background: "white",
  padding: "20px",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.03)",
}

const statLabel = {
  fontSize: 13,
  fontWeight: 600,
  color: "#666",
  margin: "0 0 6px 0",
}

const statValue = {
  fontSize: 28,
  fontWeight: 700,
  color: "#333",
  margin: 0,
}

const chartWrapper = {
  background: "white",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  marginBottom: 20,
}

const chartTitle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#333",
  margin: "0 0 16px 0",
}

const svgContainer = {
  width: "100%",
  maxHeight: 220,
}

const toolbar = {
  display: "flex",
  gap: 12,
  marginBottom: 16,
  alignItems: "center",
  flexWrap: "wrap" as const,
}

const searchWrapper = {
  position: "relative" as const,
  flex: 1,
  minWidth: 260,
}

const searchInput = {
  width: "100%",
  padding: "10px 12px 10px 38px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  background: "white",
  boxSizing: "border-box" as const,
}

const searchIcon = {
  position: "absolute" as const,
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
}

const filterGroup = {
  display: "flex",
  gap: 6,
}

const filterBtn = {
  background: "#f1f5f9",
  color: "#475569",
  border: "none",
  borderRadius: 6,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
}

const filterBtnActive = {
  background: "#687E50",
  color: "white",
}

const btnExport = {
  background: "white",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: "10px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
}

const tableCard = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  overflow: "hidden",
  marginBottom: 20,
}

const tableWrapper = {
  overflowX: "auto" as const,
}

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  textAlign: "left" as const,
}

const tableHead = {
  background: "#f8fafc",
  borderBottom: "1px solid #edf2f7",
}

const th = {
  padding: "14px 20px",
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
}

const tableRow = {
  borderBottom: "1px solid #edf2f7",
  transition: "background 0.2s",
}

const td = {
  padding: "14px 20px",
  fontSize: 14,
  color: "#334155",
}

const typeBadge = {
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 600,
}

const typeSiswa = {
  background: "#dcfce7",
  color: "#15803d",
}

const typeBukanSiswa = {
  background: "#fef3c7",
  color: "#b45309",
}

const btnDelete = {
  background: "#fecaca",
  color: "#dc2626",
  border: "none",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4,
  transition: "all 0.2s",
}

const emptyText = {
  textAlign: "center" as const,
  padding: "40px 20px",
  color: "#999",
  margin: 0,
}
