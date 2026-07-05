"use client"

import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show page 1
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div style={containerStyle}>
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnStyle,
          ...(currentPage === 1 ? disabledStyle : activeBtnStyle),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Sebelumnya</span>
      </button>

      {/* Pages */}
      <div style={pagesWrapperStyle}>
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`dots-${idx}`} style={dotsStyle}>
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              style={{
                ...btnPageStyle,
                ...(isCurrent ? currentBtnStyle : activeBtnStyle),
              }}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnStyle,
          ...(currentPage === totalPages ? disabledStyle : activeBtnStyle),
        }}
      >
        <span>Selanjutnya</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginTop: "28px",
  marginBottom: "16px",
  width: "100%",
  flexWrap: "wrap",
}

const pagesWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
}

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  color: "#374151",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
}

const btnPageStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  color: "#374151",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
}

const activeBtnStyle: React.CSSProperties = {
  // Can add basic hover state dynamically or just rely on CSS
}

const currentBtnStyle: React.CSSProperties = {
  backgroundColor: "#687E50",
  color: "#ffffff",
  borderColor: "#687E50",
  boxShadow: "0 2px 6px rgba(104, 126, 80, 0.25)",
}

const disabledStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  backgroundColor: "#f9fafb",
  color: "#9ca3af",
}

const dotsStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  fontSize: "13px",
  color: "#9ca3af",
  fontWeight: 600,
}
