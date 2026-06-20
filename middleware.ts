import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const parts = token.split(".")
    if (parts.length === 3) {
      // Decode JWT payload
      const payload = JSON.parse(atob(parts[1]))
      const exp = payload.exp
      if (exp && Date.now() >= exp * 1000) {
        // Expired
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("token")
        return response
      }
    } else {
      throw new Error("Invalid token format")
    }
  } catch (e) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
