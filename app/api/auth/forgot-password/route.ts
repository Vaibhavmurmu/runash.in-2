import { type NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken } from "@/lib/auth-utils"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const [user] = await sql`
      SELECT id, email, name FROM users WHERE email = ${email}
    `

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    }

    // Create password reset token
    const token = await createPasswordResetToken(user.id)

    // In a real application, you would send an email here
    // For now, we'll just log the token (remove this in production)
    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`)

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === "development" && {
        resetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`,
      }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
