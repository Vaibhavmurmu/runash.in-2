import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verificationTokens, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * Verify email with token
 * POST /api/auth/verify-email
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Find and verify token
    const verificationRecord = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, "email_verification"),
          eq(verificationTokens.used, false),
        ),
      )
      .limit(1)

    if (!verificationRecord.length) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    const record = verificationRecord[0]

    // Check if token has expired
    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 })
    }

    // Mark token as used and verify email
    await Promise.all([
      db.update(verificationTokens).set({ used: true, usedAt: new Date() }).where(eq(verificationTokens.id, record.id)),
      db.update(users).set({ emailVerified: true, updatedAt: new Date() }).where(eq(users.id, record.userId)),
    ])

    return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Email verification error:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}
