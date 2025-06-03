import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { createPasswordResetToken } from "@/lib/auth-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Find user
    const [user] = await sql`
      SELECT id, email FROM users WHERE email = ${email}
    `

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If an account exists, you will receive a reset email" }, { status: 200 })
    }

    // Create reset token
    const token = await createPasswordResetToken(user.id)

    // In a real app, you would send an email here
    // For now, we'll just log the token (remove in production)
    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`)

    return NextResponse.json({ message: "If an account exists, you will receive a reset email" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
