import crypto from "crypto"
import { headers } from "next/headers"

export class SecurityUtils {
  /**
   * Generate a cryptographically secure random token
   */
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  /**
   * Generate a CSRF token
   */
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("base64url")
  }

  /**
   * Verify CSRF token
   */
  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken))
  }

  /**
   * Hash sensitive data
   */
  static hashData(data: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, "sha512").toString("hex")
    return { hash, salt: actualSalt }
  }

  /**
   * Verify hashed data
   */
  static verifyHash(data: string, hash: string, salt: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, "sha512").toString("hex")
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))
  }

  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove < and >
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Check if request is from a suspicious source
   */
  static async checkSuspiciousActivity(ip: string, userAgent: string): Promise<boolean> {
    // Check for common bot patterns
    const suspiciousUserAgents = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i]

    if (suspiciousUserAgents.some((pattern) => pattern.test(userAgent))) {
      return true
    }

    // Check for suspicious IP patterns (you could integrate with threat intelligence APIs)
    const suspiciousIPs = [
      "127.0.0.1", // localhost (for testing)
    ]

    return suspiciousIPs.includes(ip)
  }

  /**
   * Get client IP address
   */
  static getClientIP(): string {
    const headersList = headers()

    // Check various headers for the real IP
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIP = headersList.get("x-real-ip")
    const cfConnectingIP = headersList.get("cf-connecting-ip")

    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwardedFor) return forwardedFor.split(",")[0].trim()

    return "unknown"
  }

  /**
   * Log security events
   */
  static logSecurityEvent(event: {
    type: "login_attempt" | "failed_login" | "password_reset" | "account_locked" | "suspicious_activity"
    userId?: number
    email?: string
    ip: string
    userAgent: string
    details?: any
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    }

    // In production, send to your logging service (e.g., DataDog, LogRocket, etc.)
    console.log("SECURITY_EVENT:", JSON.stringify(logEntry))

    // You could also store in database for audit trail
    // await sql`INSERT INTO security_logs (type, user_id, email, ip, user_agent, details, created_at)
    //           VALUES (${event.type}, ${event.userId}, ${event.email}, ${event.ip}, ${event.userAgent}, ${JSON.stringify(event.details)}, NOW())`
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(text: string, key?: string): string {
    const secretKey = key || process.env.ENCRYPTION_KEY || "default-key-change-in-production"
    const algorithm = "aes-256-gcm"
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipher(algorithm, secretKey)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string, key?: string): string {
    const secretKey = key || process.env.ENCRYPTION_KEY || "default-key-change-in-production"
    const algorithm = "aes-256-gcm"

    const [ivHex, encrypted] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex")

    const decipher = crypto.createDecipher(algorithm, secretKey)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }
}
