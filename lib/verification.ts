import { sql } from "@/lib/database"
import { emailService } from "@/lib/email"
import crypto from "crypto"

export interface VerificationToken {
  id: string
  user_id: string
  email: string
  token: string
  token_type: "email_verification" | "email_change" | "password_reset"
  expires_at: string
  used_at?: string
  created_at: string
}

export class VerificationService {
  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  private getExpirationTime(type: "email_verification" | "email_change" | "password_reset"): Date {
    const now = new Date()
    switch (type) {
      case "password_reset":
        return new Date(now.getTime() + 60 * 60 * 1000) // 1 hour
      case "email_verification":
      case "email_change":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  }

  async createVerificationToken(
    userId: string,
    email: string,
    type: "email_verification" | "email_change" | "password_reset",
  ): Promise<string> {
    const token = this.generateToken()
    const expiresAt = this.getExpirationTime(type)

    // Invalidate any existing tokens of the same type for this user
    await sql`
      UPDATE email_verification_tokens 
      SET used_at = NOW() 
      WHERE user_id = ${userId} AND token_type = ${type} AND used_at IS NULL
    `

    // Create new token
    await sql`
      INSERT INTO email_verification_tokens (user_id, email, token, token_type, expires_at)
      VALUES (${userId}, ${email}, ${token}, ${type}, ${expiresAt})
    `

    return token
  }

  async verifyToken(token: string): Promise<VerificationToken | null> {
    const [verificationToken] = await sql`
      SELECT * FROM email_verification_tokens 
      WHERE token = ${token} AND used_at IS NULL AND expires_at > NOW()
    `

    return verificationToken || null
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await sql`
      UPDATE email_verification_tokens 
      SET used_at = NOW() 
      WHERE token = ${token}
    `
  }

  async sendEmailVerification(userId: string, email: string, name: string): Promise<boolean> {
    try {
      const token = await this.createVerificationToken(userId, email, "email_verification")
      return await emailService.sendEmailVerification(email, name, token)
    } catch (error) {
      console.error("Failed to send email verification:", error)
      return false
    }
  }

  async sendEmailChangeVerification(userId: string, newEmail: string, name: string): Promise<boolean> {
    try {
      const token = await this.createVerificationToken(userId, newEmail, "email_change")
      return await emailService.sendEmailChange(newEmail, name, newEmail, token)
    } catch (error) {
      console.error("Failed to send email change verification:", error)
      return false
    }
  }

  async sendPasswordReset(userId: string, email: string, name: string): Promise<boolean> {
    try {
      const token = await this.createVerificationToken(userId, email, "password_reset")
      return await emailService.sendPasswordReset(email, name, token)
    } catch (error) {
      console.error("Failed to send password reset:", error)
      return false
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const verificationToken = await this.verifyToken(token)

      if (!verificationToken) {
        return { success: false, message: "Invalid or expired verification token" }
      }

      if (verificationToken.token_type !== "email_verification") {
        return { success: false, message: "Invalid token type" }
      }

      // Mark user as verified
      await sql`
        UPDATE users 
        SET email_verified = true, email_verified_at = NOW() 
        WHERE id = ${verificationToken.user_id}
      `

      // Mark token as used
      await this.markTokenAsUsed(token)

      return { success: true, message: "Email verified successfully" }
    } catch (error) {
      console.error("Email verification error:", error)
      return { success: false, message: "Verification failed" }
    }
  }

  async verifyEmailChange(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const verificationToken = await this.verifyToken(token)

      if (!verificationToken) {
        return { success: false, message: "Invalid or expired verification token" }
      }

      if (verificationToken.token_type !== "email_change") {
        return { success: false, message: "Invalid token type" }
      }

      // Update user's email
      await sql`
        UPDATE users 
        SET 
          email = ${verificationToken.email},
          pending_email = NULL,
          email_verified = true,
          email_verified_at = NOW()
        WHERE id = ${verificationToken.user_id}
      `

      // Mark token as used
      await this.markTokenAsUsed(token)

      return { success: true, message: "Email changed successfully" }
    } catch (error) {
      console.error("Email change verification error:", error)
      return { success: false, message: "Email change failed" }
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    await sql`
      DELETE FROM email_verification_tokens 
      WHERE expires_at < NOW() AND used_at IS NULL
    `
  }
}

export const verificationService = new VerificationService()
