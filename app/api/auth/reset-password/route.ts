import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    await resetPassword(token, password)

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)

    if (error instanceof Error && error.message === "Invalid or expired token") {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
