import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-helpers"

/**
 * Get current session
 * Used by client to check authentication status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: session.user,
        session,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error getting session:", error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}
