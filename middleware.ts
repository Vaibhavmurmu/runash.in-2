import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Protect admin routes
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname === "/login" || pathname === "/get-started")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/login",
          "/get-started",
          "/forgot-password",
          "/reset-password",
          "/about",
          "/features",
          "/pricing",
          "/contact",
          "/blog",
          "/careers",
          "/press",
          "/support",
          "/tutorials",
          "/integrations",
          "/privacy",
          "/terms",
          "/cookies",
          "/roadmap",
        ]

        // API routes that don't require authentication
        const publicApiRoutes = ["/api/auth", "/api/turn-credentials"]

        // Check if the route is public
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true
        }

        // Check if the API route is public
        if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
          return true
        }

        // For protected routes, require authentication
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
