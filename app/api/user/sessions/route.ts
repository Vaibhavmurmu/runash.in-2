import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidUUID } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE user_id = ${userId}::uuid
      ORDER BY last_active DESC
    `

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching user sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (sessionId) {
      // Validate session ID is also a UUID
      if (!isValidUUID(sessionId)) {
        return NextResponse.json({ error: "Invalid session ID format" }, { status: 400 })
      }

      // Delete specific session
      await sql`
        DELETE FROM user_sessions 
        WHERE id = ${sessionId}::uuid AND user_id = ${userId}::uuid AND is_current = false
      `
    } else {
      // Delete all other sessions (keep current)
      await sql`
        DELETE FROM user_sessions 
        WHERE user_id = ${userId}::uuid AND is_current = false
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
