"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminDrawer from "@/components/AdminDrawer"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  icon: string
  label: string
  path?: string
  children?: { label: string; path: string }[]
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
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
      ],
    },
    { icon: "konseling", label: "Konseling", path: "/admin/konseling" },
  ]

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isActive = (item: MenuItem) => {
    if (item.path) return pathname === item.path
    if (item.children) return item.children.some(c => pathname.startsWith(c.path))
    return false
  }

  const isChildActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(prev => prev === label ? null : label)
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div style={desktopWrapper}>
      {/* ============================================
          SIDEBAR — Desktop Only
      ============================================ */}
      <aside data-sidebar style={sidebar}>
        <div style={sidebarHeader}>
          <div style={sidebarLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M8 8L20 32L32 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <p style={sidebarTitle}>Panel Admin BK</p>
            <p style={sidebarSubtitle}>SMK Negeri 12 Jakarta</p>
          </div>
        </div>

        <nav style={sidebarNav}>
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.path ? (
                <button
                  style={{
                    ...sidebarNavItem,
                    ...(isActive(item) ? sidebarNavItemActiveStyle : {}),
                  }}
                  onClick={() => handleNavigate(item.path!)}
                >
                  <span style={sidebarIconWrap}>{getIcon(item.icon, isActive(item))}</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <div>
                  <button
                    style={{
                      ...sidebarNavItem,
                      ...(isActive(item) ? sidebarNavParentActive : {}),
                    }}
                    onClick={() => toggleSubmenu(item.label)}
                  >
                    <span style={sidebarIconWrap}>{getIcon(item.icon, isActive(item))}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <svg
                      width="14" height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        transition: "transform 0.2s",
                        transform: openSubmenu === item.label ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {(openSubmenu === item.label || isActive(item)) && item.children?.map((child, cidx) => (
                    <button
                      key={cidx}
                      style={{
                        ...sidebarSubItem,
                        ...(isChildActive(child.path) ? sidebarSubItemActive : {}),
                      }}
                      onClick={() => handleNavigate(child.path)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Logout Button */}
          <button style={sidebarLogoutBtn} onClick={handleLogout}>
            <span style={sidebarIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Keluar (Logout)</span>
          </button>
        </nav>
      </aside>

      {/* ============================================
          MAIN CONTENT AREA
      ============================================ */}
      <div data-main-content style={mainContent}>
        {/* Desktop header — transparent, shows user info */}
        <header data-header style={header}>
          <button
            data-menu-btn
            style={menuButton}
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 data-header-title style={headerTitle}>ADMIN BK SMKN 12</h1>
          <div style={userInfo}>
            <span style={userName}>Administrator</span>
            <div style={userIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page content goes here */}
        {children}
      </div>

      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

function getIcon(name: string, active: boolean) {
  const color = active ? "#687E50" : "rgba(255,255,255,0.85)"
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    konseling: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    layanan: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.67 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.67a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    artikel: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    alumni: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    guru: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  }
  return icons[name] || null
}

// ============================================
// STYLES
// ============================================

const desktopWrapper: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#e8e8e8",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const sidebar: React.CSSProperties = {
  display: "none",
  width: 260,
  background: "#687E50",
  minHeight: "100vh",
  padding: "24px 0",
  flexShrink: 0,
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 50,
  overflowY: "auto",
}

const sidebarHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "0 20px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  marginBottom: 16,
}

const sidebarLogo: React.CSSProperties = {
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}

const sidebarTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "white",
  margin: "0 0 2px 0",
  lineHeight: 1.2,
}

const sidebarSubtitle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.7)",
  margin: 0,
}

const sidebarNav: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "0 12px",
  minHeight: "calc(100vh - 110px)",
}

const sidebarNavItem: React.CSSProperties = {
  width: "100%",
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.85)",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: 10,
}

const sidebarNavItemActiveStyle: React.CSSProperties = {
  background: "white",
  color: "#687E50",
  fontWeight: 600,
}

const sidebarNavParentActive: React.CSSProperties = {
  color: "white",
  fontWeight: 600,
}

const sidebarIconWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
}

const sidebarSubItem: React.CSSProperties = {
  width: "100%",
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.7)",
  padding: "8px 14px 8px 42px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 400,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.2s",
}

const sidebarSubItemActive: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  color: "white",
  fontWeight: 600,
}

const sidebarLogoutBtn: React.CSSProperties = {
  width: "100%",
  background: "none",
  border: "none",
  color: "#fca5a5",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: "auto",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  paddingTop: 16,
}

const mainContent: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
}

const header: React.CSSProperties = {
  background: "#687E50",
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
}

const menuButton: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
}

const headerTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
  letterSpacing: "0.5px",
}

const userInfo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
}

const userName: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "white",
}

const userIcon: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "2px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}
