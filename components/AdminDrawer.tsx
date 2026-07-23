"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

interface AdminDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  icon: string
  label: string
  path?: string
  children?: { label: string; path: string }[]
}

export default function AdminDrawer({ isOpen, onClose }: AdminDrawerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    { icon: "dashboard", label: "Dashboard", path: "/admin" },
    { icon: "artikel", label: "Artikel", path: "/admin/artikel" },
    { icon: "guru", label: "Guru BK", path: "/admin/guru" },
    {
      icon: "layanan",
      label: "Karya Siswa",
      children: [
        { label: "Persetujuan Karya", path: "/admin/karya/persetujuan" },
        { label: "Daftar Karya", path: "/admin/karya" },
      ],
    },
    {
      icon: "alumni",
      label: "Alumni",
      children: [
        { label: "Persetujuan Alumni", path: "/admin/alumni/persetujuan" },
        { label: "Daftar Alumni", path: "/admin/alumni" },
      ],
    },
    { icon: "konseling", label: "Konseling", path: "/admin/konseling" },
    { icon: "pengunjung", label: "Buku Tamu", path: "/admin/pengunjung" },
  ]

  useEffect(() => {
    const activeItem = menuItems.find(isActive)
    if (activeItem && !activeItem.path) {
      setOpenSubmenu(activeItem.label)
    }
  }, [pathname])

  const handleNavigate = (path: string) => {
    router.push(path)
    onClose()
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
    onClose()
  }

  const isActive = (item: MenuItem) => {
    if (item.path) return pathname === item.path
    if (item.children) return item.children.some(c => pathname.startsWith(c.path))
    return false
  }

  const isChildActive = (path: string) => {
    if (pathname === path) return true
    if (pathname.startsWith(path + "/")) {
      const sibling = menuItems
        .flatMap(item => item.children || [])
        .find(child => child.path !== path && pathname.startsWith(child.path))
      if (sibling) {
        return false
      }
      return true
    }
    return false
  }

  if (!isOpen) return null

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHeader}>
          <div style={logoArea}>
            <div style={logoBox}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <path d="M8 8L20 32L32 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h3 style={logoTitle}>PANEL ADMIN</h3>
              <p style={logoSubtitle}>SMK NEGERI 12 JAKARTA</p>
            </div>
          </div>
          <button style={closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={menuList}>
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.path ? (
                <button
                  style={{
                    ...menuItem,
                    background: isActive(item) ? "rgba(104,126,80,0.12)" : "transparent",
                    color: isActive(item) ? "#687E50" : "#333",
                  }}
                  onClick={() => handleNavigate(item.path!)}
                  onMouseEnter={() => router.prefetch(item.path!)}
                >
                  <span style={menuIcon}>{getIcon(item.icon, isActive(item))}</span>
                  <span style={menuLabel}>{item.label}</span>
                </button>
              ) : (
                <div>
                  <button
                    style={{
                      ...menuItem,
                      color: (openSubmenu === item.label) ? "#687E50" : "#333",
                      background: "none",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => setOpenSubmenu(prev => prev === item.label ? null : item.label)}
                  >
                    <span style={menuIcon}>{getIcon(item.icon, item.path ? isActive(item) : false)}</span>
                    <span style={menuLabel}>{item.label}</span>
                  </button>
                  {openSubmenu === item.label && item.children?.map((child, cidx) => (
                    <button
                      key={cidx}
                      style={{
                        ...subMenuItem,
                        background: isChildActive(child.path) ? "rgba(104,126,80,0.08)" : "transparent",
                        color: isChildActive(child.path) ? "#687E50" : "#555",
                        fontWeight: isChildActive(child.path) ? 600 : 400,
                      }}
                      onClick={() => handleNavigate(child.path)}
                      onMouseEnter={() => router.prefetch(child.path)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Logout Button */}
          <button style={logoutItem} onClick={handleLogout}>
            <span style={menuIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span style={menuLabel}>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function getIcon(name: string, active: boolean) {
  const color = active ? "#687E50" : "#555"
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    konseling: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    layanan: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.67 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.67a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    artikel: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    alumni: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    guru: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    pengunjung: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  }
  return icons[name] || null
}

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
}

const drawer = {
  width: 280,
  maxWidth: "80vw",
  height: "100vh",
  background: "#e8e8e8",
  overflowY: "auto" as const,
  display: "flex",
  flexDirection: "column" as const,
}

const drawerHeader = {
  background: "#687E50",
  padding: "20px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  color: "white",
}

const logoArea = {
  display: "flex",
  alignItems: "center",
  gap: 12,
}

const logoBox = {
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const logoTitle = {
  color: "white",
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 2px 0",
  lineHeight: 1.2,
}

const logoSubtitle = {
  color: "rgba(255,255,255,0.8)",
  fontSize: 11,
  margin: 0,
}

const closeBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  marginTop: -4,
  display: "flex",
  alignItems: "center",
}

const menuList = {
  padding: "8px 0",
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
}

const menuItem = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 20px",
  background: "none",
  border: "none",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  cursor: "pointer",
  fontSize: 14,
  color: "#333",
  textAlign: "left" as const,
  transition: "background 0.2s",
}

const menuIcon = {
  display: "flex",
  alignItems: "center",
  color: "inherit",
}

const menuLabel = {
  fontWeight: 500,
}

const subMenuItem = {
  width: "100%",
  padding: "12px 20px 12px 52px",
  background: "none",
  border: "none",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
  cursor: "pointer",
  fontSize: 13,
  color: "#555",
  textAlign: "left" as const,
  transition: "all 0.2s",
}

const logoutItem = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 20px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  color: "#dc2626",
  textAlign: "left" as const,
  marginTop: "auto",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  transition: "background 0.2s",
}
