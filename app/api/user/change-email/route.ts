import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { verificationService } from "@/lib/verification"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const body = await request.json()
    const { newEmail } = body

    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if email is already in use
    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${newEmail} AND id != ${userId}
    `

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Get current user
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Set pending email
    await sql`
      UPDATE users 
      SET pending_email = ${newEmail}
      WHERE id = ${userId}
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
