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
    const { type = "email_verification" } = body

    // Get user information
    const users = await sql`
      SELECT * FROM users WHERE id = ${userId}::uuid
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]
    let success = false
    let message = ""

    switch (type) {
      case "email_verification":
        if (user.email_verified) {
          return NextResponse.json({ error: "Email already verified" }, { status: 400 })
        }
        success = await verificationService.sendEmailVerification(userId, user.email, user.name)
        message = success ? "Verification email sent" : "Failed to send verification email"
        break

      case "email_change":
        if (!user.pending_email) {
          return NextResponse.json({ error: "No pending email change" }, { status: 400 })
        }
        success = await verificationService.sendEmailChangeVerification(userId, user.pending_email, user.name)
        message = success ? "Email change verification sent" : "Failed to send email change verification"
        break

      case "password_reset":
        success = await verificationService.sendPasswordReset(userId, user.email, user.name)
        message = success ? "Password reset email sent" : "Failed to send password reset email"
        break

      default:
        return NextResponse.json({ error: "Invalid verification type" }, { status: 400 })
    }

    if (!success) {
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Send verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
