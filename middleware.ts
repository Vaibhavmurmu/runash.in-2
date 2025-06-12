import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request })

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
    "/status",
    "/dashboard",
    "/analytic",
    "/admin",
    "/stream",
    "/recording",
  ]

  // API routes that don't require authentication
  const publicApiRoutes = ["/api/auth", "/api/turn-credentials"]

  // Check if the route is public
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next()
  }

  // Check if the API route is public
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Protect dashboard routes
  if (pathname.startsWith("/") && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Protect streaming routes
  if (
    (pathname.startsWith("/") || pathname.startsWith("/") || pathname.startsWith("/")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Protect admin routes
  if (pathname.startsWith("/") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (token && (pathname === "/login" || pathname === "/get-started")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

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
