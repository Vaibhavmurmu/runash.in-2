import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-helpers"

/**
 * Refresh user session
 * Used by client to keep session alive
 * POST /api/auth/refresh-session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No active session" }, { status: 401 })
    }

    // Session is automatically refreshed by Better Auth
    return NextResponse.json({ success: true, session }, { status: 200 })
  } catch (error) {
    console.error("[v0] Session refresh error:", error)
    return NextResponse.json({ error: "Session refresh failed" }, { status: 500 })
  }
}
