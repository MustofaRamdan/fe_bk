"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DesktopLayout from "@/components/DesktopLayout"

interface Alumni {
  id: number
  namaLengkap: string
  tahunLulus: string
  namaKampus: string | null
  programStudi: string | null
  tahunMasukKuliah: string | null
}

export default function Page() {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  const router = useRouter()
  const [data, setData] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")


  useEffect(() => {
    fetch(
  `${api}/api/alumni?status=KULIAH&statusPengajuan=DITERIMA`
)
      .then((r) => r.json())
      .then((j) => setData(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [api])

  const filtered = data.filter((a) =>
    a.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    (a.namaKampus || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.programStudi || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DesktopLayout>

      {/* HERO */}
      <div style={{
        background: "#687E50",
        padding: "32px 20px 40px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Alumni Kuliah</h2>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>Total {data.length} alumni melanjutkan studi ke perguruan tinggi</p>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex",
        padding: "0 20px",
        marginTop: -16,
        gap: 8,
      }}>
        <button style={{
          flex: 1,
          background: "#687E50",
          color: "white",
          border: "none",
          padding: "14px",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}>
          Kuliah
        </button>
        <button
          onClick={() => router.push("/alumni/bekerja")}
          style={{
            flex: 1,
            background: "white",
            border: "none",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            color: "#666",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Bekerja
        </button>
        <button
          onClick={() => router.push("/alumni/wirausaha")}
          style={{
            flex: 1,
            background: "white",
            border: "none",
            padding: "14px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            color: "#666",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Wirausaha
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "white",
          padding: "12px 16px",
          borderRadius: 10,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Cari nama, kampus, atau jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#333",
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={{ padding: "0 20px 20px" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: 40, color: "#666" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
            color: "#999",
          }}>
            <p>Tidak ada data yang sesuai</p>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}>
                <thead>
                  <tr style={{ background: "#687E50", color: "white" }}>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>No</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>Nama Lengkap</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>Tahun Lulus</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>Kampus</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>Program Studi</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>Tahun Masuk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "16px", color: "#666", fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: "16px", fontWeight: 600, color: "#333", fontSize: 13 }}>{a.namaLengkap}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          background: "#c5d4a8",
                          color: "#333",
                          padding: "4px 12px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          {a.tahunLulus}
                        </span>
                      </td>
                      <td style={{ padding: "16px", color: "#444", fontSize: 13 }}>{a.namaKampus || "-"}</td>
                      <td style={{ padding: "16px", color: "#444", fontSize: 13 }}>{a.programStudi || "-"}</td>
                      <td style={{ padding: "16px", color: "#444", fontSize: 13 }}>{a.tahunMasukKuliah || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DesktopLayout>
  )
}