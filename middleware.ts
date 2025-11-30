import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-helpers"

const protectedRoutes = ["/dashboard", "/profile", "/settings"]
const authRoutes = ["/login", "/signup", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if current route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get session
  const session = await getSession()

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
