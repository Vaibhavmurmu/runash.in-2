import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateEmailVerificationToken } from "@/lib/auth-utils"
import { neon } from "@neondatabase/serverless"
import { registerSchema } from "@/lib/validations/auth"
import { rateLimit } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request, "register", 5, 900) // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json({ message: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { email, password, name, username } = validationResult.data

    const [existingUser] = await sql`
      SELECT id, email, username FROM users 
      WHERE email = ${email} OR username = ${username}
    `

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username"
      return NextResponse.json({ message: `User with this ${conflictField} already exists` }, { status: 409 })
    }

    const user = await createUser({
      email,
      password,
      name,
      username,
      role: "user",
    })

    const verificationToken = await generateEmailVerificationToken(user.id)
    await sendVerificationEmail(email, name, verificationToken)

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          emailVerified: false,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
