"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/admin")
  }, [router])

  return <div style={{ padding: 20 }}>Redirecting to dashboard...</div>
}