import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

/**
 * Request password reset token
 * POST /api/auth/request-password-reset
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

    // For security, don't reveal if user exists
    if (!user.length) {
      return NextResponse.json({ success: true, message: "If email exists, reset link will be sent" }, { status: 200 })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await db.insert(verificationTokens).values({
      id: crypto.randomUUID(),
      userId: user[0].id,
      token,
      type: "password_reset",
      expiresAt,
      used: false,
    })

    // TODO: Send reset email with token link (Phase 3 - Workflows)
    console.log(`[v0] Password reset token generated for ${email}: ${token}`)

    return NextResponse.json({ success: true, message: "If email exists, reset link will be sent" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Password reset request error:", error)
    return NextResponse.json({ error: "Password reset request failed" }, { status: 500 })
  }
}
