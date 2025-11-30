import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * Sign out user and clear session
 * POST /api/auth/signout
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    cookieStore.delete("better-auth.session-token")

    return NextResponse.json({ success: true, message: "Signed out successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    return NextResponse.json({ error: "Sign out failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests for form submissions
  return POST(request)
}
