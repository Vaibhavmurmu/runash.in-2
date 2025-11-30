"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Verification failed")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("[v0] Error verifying email:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResendLoading(true)

    try {
      // TODO: Implement resend email verification token
      console.log("[v0] Resending verification email to", email)
      // await fetch('/api/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>We've sent a verification link to {email || "your email"}</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200 text-green-900">
              <AlertDescription>Email verified successfully! Redirecting to dashboard...</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="token" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="token"
                  placeholder="Enter the code from the email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">Copy the verification code from the email we sent you</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleResend}
                disabled={resendLoading || !email}
              >
                {resendLoading ? "Sending..." : "Resend Verification Code"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
