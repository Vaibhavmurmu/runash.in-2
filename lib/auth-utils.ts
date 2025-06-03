import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"

const sql = neon(process.env.DATABASE_URL!)

export async function createUser(email: string, password: string, name: string) {
  try {
    const passwordHash = await hash(password, 12)

    const [user] = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${passwordHash}, ${name}, 'user')
      RETURNING id, email, name, role, created_at
    `

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function createPasswordResetToken(userId: number) {
  try {
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt})
    `

    return token
  } catch (error) {
    console.error("Error creating password reset token:", error)
    throw new Error("Failed to create password reset token")
  }
}

export async function verifyPasswordResetToken(token: string) {
  try {
    const [resetToken] = await sql`
      SELECT * FROM password_reset_tokens 
      WHERE token = ${token} AND expires_at > NOW() AND used = false
    `

    return resetToken
  } catch (error) {
    console.error("Error verifying password reset token:", error)
    return null
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const resetToken = await verifyPasswordResetToken(token)
    if (!resetToken) {
      throw new Error("Invalid or expired token")
    }

    const passwordHash = await hash(newPassword, 12)

    // Update password
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${resetToken.user_id}
    `

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens 
      SET used = true 
      WHERE token = ${token}
    `

    return true
  } catch (error) {
    console.error("Error resetting password:", error)
    throw new Error("Failed to reset password")
  }
}
