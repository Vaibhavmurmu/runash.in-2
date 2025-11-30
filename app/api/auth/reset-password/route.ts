import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verificationTokens, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcryptjs"

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Find reset token
    const resetRecord = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, "password_reset"),
          eq(verificationTokens.used, false),
        ),
      )
      .limit(1)

    if (!resetRecord.length) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const record = resetRecord[0]

    // Check expiration
    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password and mark token as used
    await Promise.all([
      db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, record.userId)),
      db.update(verificationTokens).set({ used: true, usedAt: new Date() }).where(eq(verificationTokens.id, record.id)),
    ])

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
