import { type NextRequest, NextResponse } from "next/server"
import { verificationService } from "@/lib/verification"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await verificationService.verifyEmail(token)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Redirect to success page
    const redirectUrl = new URL("/auth/email-verified", request.url)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await verificationService.verifyEmail(token)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
