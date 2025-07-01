import { type NextRequest, NextResponse } from "next/server"
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

    const security = await sql`
      SELECT * FROM user_security WHERE user_id = ${userId}::uuid
    `

    if (security.length === 0) {
      // Create default security settings if they don't exist
      const newSecurity = await sql`
        INSERT INTO user_security (user_id) 
        VALUES (${userId}::uuid) 
        RETURNING *
      `
      return NextResponse.json(newSecurity[0])
    }

    return NextResponse.json(security[0])
  } catch (error) {
    console.error("Error fetching user security:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()

    const updatedSecurity = await sql`
      UPDATE user_security 
      SET 
        two_factor_enabled = ${body.two_factor_enabled || false},
        login_notifications = ${body.login_notifications !== undefined ? body.login_notifications : true},
        session_timeout = ${body.session_timeout !== undefined ? body.session_timeout : true},
        suspicious_activity_alerts = ${body.suspicious_activity_alerts !== undefined ? body.suspicious_activity_alerts : true},
        updated_at = NOW()
      WHERE user_id = ${userId}::uuid
      RETURNING *
    `

    if (updatedSecurity.length === 0) {
      return NextResponse.json({ error: "User security settings not found" }, { status: 404 })
    }

    return NextResponse.json(updatedSecurity[0])
  } catch (error) {
    console.error("Error updating user security:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
