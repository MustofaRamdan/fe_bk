"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Drawer from "@/components/Drawer"

interface DesktopLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  icon: string
  label: string
  path?: string
  children?: { label: string; path: string }[]
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    { icon: "home", label: "Beranda", path: "/" },
    { icon: "konseling", label: "Konseling", path: "/konseling" },
    {
      icon: "layanan",
      label: "Layanan BK",
      children: [
        { label: "Lihat Karya Siswa", path: "/karya" },
        { label: "Tambah Karya Saya", path: "/karya/tambah" },
      ],
    },
    { icon: "artikel", label: "Artikel", path: "/artikel" },
    {
      icon: "alumni",
      label: "Alumni",
      children: [
        { label: "Kuliah", path: "/alumni/kuliah" },
        { label: "Kerja", path: "/alumni/bekerja" },
        { label: "Wirausaha", path: "/alumni/wirausaha" },
        { label: "Ajukan Data Alumni", path: "/alumni/tambah" },
      ],
    },
  ]

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
            <p style={sidebarTitle}>Bimbingan Konseling</p>
            <p style={sidebarSubtitle}>SMK Negeri 12 Jakarta</p>
          </div>
        </div>

        <nav style={sidebarNav}>
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.path ? (
                // Simple menu item (no children)
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
                // Menu item with children
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
          <h1 data-header-title style={headerTitle}>BK SMKN 12 JAKARTA</h1>
          <div style={userInfo}>
            <span style={userName}>Sumbul</span>
            <div style={userIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page content goes here */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={footerStyle}>
          <div style={footerContainer}>
            <div style={footerBrand}>
              <div style={footerLogoStyle}>
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <path d="M8 8L20 32L32 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2"/>
                </svg>
                <div style={footerLogoText}>
                  <h4 style={footerTitleStyle}>Bimbingan Konseling</h4>
                  <p style={footerSubtitleStyle}>SMK Negeri 12 Jakarta</p>
                </div>
              </div>
              <p style={footerDescStyle}>
                Layanan bimbingan dan konseling siap membantu siswa dalam mencapai pengembangan akademis, pribadi, sosial, dan karir yang optimal.
              </p>
            </div>

            <div style={footerCol}>
              <h5 style={footerColTitle}>Layanan Kami</h5>
              <div style={footerLinkList}>
                <span onClick={() => handleNavigate("/konseling")} style={footerLinkStyle}>Konseling Online</span>
                <span onClick={() => handleNavigate("/karya")} style={footerLinkStyle}>Karya Siswa</span>
                <span onClick={() => handleNavigate("/artikel")} style={footerLinkStyle}>Artikel & Edukasi</span>
              </div>
            </div>

            <div style={footerCol}>
              <h5 style={footerColTitle}>Alumni</h5>
              <div style={footerLinkList}>
                <span onClick={() => handleNavigate("/alumni/kuliah")} style={footerLinkStyle}>Data Kuliah</span>
                <span onClick={() => handleNavigate("/alumni/bekerja")} style={footerLinkStyle}>Data Bekerja</span>
                <span onClick={() => handleNavigate("/alumni/wirausaha")} style={footerLinkStyle}>Data Wirausaha</span>
                <span onClick={() => handleNavigate("/alumni/tambah")} style={footerLinkStyle}>Ajukan Data Alumni</span>
              </div>
            </div>

            <div style={footerCol}>
              <h5 style={footerColTitle}>Hubungi Guru BK</h5>
              <div style={socialLinksStyle}>
                <a href="https://wa.me/6281234567890?text=Halo%20Guru%20BK,%20saya%20ingin%20berkonsultasi" target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp BK
                </a>
                <a href="https://instagram.com/bk_smkn12jkt" target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram BK
                </a>
              </div>
            </div>
          </div>

          <div style={footerBottomStyle}>
            <p style={copyrightStyle}>&copy; {new Date().getFullYear()} Bimbingan Konseling SMK Negeri 12 Jakarta. All rights reserved.</p>
            <button onClick={() => router.push("/login")} style={btnLoginAdminStyle}>
              Login Admin
            </button>
          </div>
        </footer>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

// ============================================
// ICON HELPER — same icons as Drawer.tsx
// ============================================
function getIcon(name: string, active: boolean) {
  const color = active ? "#687E50" : "rgba(255,255,255,0.85)"
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
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

const mainContent: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
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

const footerStyle: React.CSSProperties = {
  background: "#1e2518",
  color: "rgba(255,255,255,0.75)",
  padding: "48px 24px 24px",
  marginTop: "auto",
  borderTop: "4px solid #687E50",
  fontFamily: "inherit",
}

const footerContainer: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 32,
  paddingBottom: 32,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
}

const footerBrand: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  gridColumn: "span 2",
}

const footerLogoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
}

const footerLogoText: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
}

const footerTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "white",
  margin: 0,
}

const footerSubtitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.6)",
  margin: 0,
}

const footerDescStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  margin: 0,
  color: "rgba(255,255,255,0.6)",
}

const footerCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
}

const footerColTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "white",
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}

const footerLinkList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
}

const footerLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  fontSize: 13,
  textDecoration: "none",
  transition: "color 0.2s",
  cursor: "pointer",
}

const socialLinksStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
}

const socialBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "white",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  textDecoration: "none",
  fontWeight: 500,
  transition: "all 0.2s",
}

const footerBottomStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  paddingTop: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
}

const copyrightStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.5)",
  margin: 0,
}

const btnLoginAdminStyle: React.CSSProperties = {
  background: "transparent",
  color: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "8px 16px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
}
