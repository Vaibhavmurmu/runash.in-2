// Email service for sending verification emails
// In production, you'd use a service like SendGrid, Resend, or AWS SES

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
}

class EmailService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }

  async sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
    try {
      // In production, replace this with your email service
      console.log("📧 Email would be sent to:", to)
      console.log("📧 Subject:", subject)
      console.log("📧 HTML:", html)
      console.log("📧 Text:", text)

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  getEmailVerificationTemplate(name: string, verificationUrl: string): EmailTemplate {
    const subject = "Verify your RunAsh account"

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ea580c); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RunAsh AI</div>
            </div>
            
            <h1>Welcome to RunAsh, ${name}!</h1>
            
            <p>Thank you for signing up for RunAsh AI, the future of live streaming. To get started, please verify your email address by clicking the button below:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <div class="footer">
              <p>If you didn't create an account with RunAsh, you can safely ignore this email.</p>
              <p>© 2024 RunAsh AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Welcome to RunAsh, ${name}!
      
      Thank you for signing up for RunAsh AI. To get started, please verify your email address by visiting:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours for security reasons.
      
      If you didn't create an account with RunAsh, you can safely ignore this email.
      
      © 2024 RunAsh AI. All rights reserved.
    `

    return { subject, html, text }
  }

  getEmailChangeTemplate(name: string, newEmail: string, verificationUrl: string): EmailTemplate {
    const subject = "Confirm your new email address"

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ea580c); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RunAsh AI</div>
            </div>
            
            <h1>Confirm your new email address</h1>
            
            <p>Hi ${name},</p>
            
            <p>You recently requested to change your email address to <strong>${newEmail}</strong>. To complete this change, please click the button below:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Confirm Email Change</a>
            </p>
            
            <div class="warning">
              <strong>Important:</strong> Once confirmed, this will become your new login email address.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <div class="footer">
              <p>If you didn't request this email change, please contact our support team immediately.</p>
              <p>© 2024 RunAsh AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Confirm your new email address
      
      Hi ${name},
      
      You recently requested to change your email address to ${newEmail}. To complete this change, please visit:
      
      ${verificationUrl}
      
      Important: Once confirmed, this will become your new login email address.
      
      This verification link will expire in 24 hours for security reasons.
      
      If you didn't request this email change, please contact our support team immediately.
      
      © 2024 RunAsh AI. All rights reserved.
    `

    return { subject, html, text }
  }

  getPasswordResetTemplate(name: string, resetUrl: string): EmailTemplate {
    const subject = "Reset your RunAsh password"

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ea580c); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
            .warning { background: #fef2f2; border: 1px solid #ef4444; border-radius: 6px; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RunAsh AI</div>
            </div>
            
            <h1>Reset your password</h1>
            
            <p>Hi ${name},</p>
            
            <p>You recently requested to reset your password for your RunAsh account. Click the button below to create a new password:</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
              <p>© 2024 RunAsh AI. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Reset your password
      
      Hi ${name},
      
      You recently requested to reset your password for your RunAsh account. Visit this link to create a new password:
      
      ${resetUrl}
      
      Security Notice: This link will expire in 1 hour for your security.
      
      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
      
      © 2024 RunAsh AI. All rights reserved.
    `

    return { subject, html, text }
  }

  async sendEmailVerification(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${this.baseUrl}/auth/verify-email?token=${token}`
    const template = this.getEmailVerificationTemplate(name, verificationUrl)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendEmailChange(email: string, name: string, newEmail: string, token: string): Promise<boolean> {
    const verificationUrl = `${this.baseUrl}/auth/verify-email-change?token=${token}`
    const template = this.getEmailChangeTemplate(name, newEmail, verificationUrl)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendPasswordReset(email: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${this.baseUrl}/auth/reset-password?token=${token}`
    const template = this.getPasswordResetTemplate(name, resetUrl)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }
}

export const emailService = new EmailService()
