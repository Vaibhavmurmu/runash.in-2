import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { verificationService } from "@/lib/verification"
import { getCurrentUserId, isAuthenticated, isValidUUID } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { newEmail } = body

    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if email is already in use
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${newEmail} AND id != ${userId}::uuid
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Get current user
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}::uuid
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Set pending email
    await sql`
      UPDATE users 
      SET pending_email = ${newEmail}
      WHERE id = ${userId}::uuid
    `

    // Send verification email
    const success = await verificationService.sendEmailChangeVerification(userId, newEmail, user.name)

    if (!success) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Verification email sent to your new email address",
      pendingEmail: newEmail,
    })
  } catch (error) {
    console.error("Email change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
