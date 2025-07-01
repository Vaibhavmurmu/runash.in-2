"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Mail, X, Loader2, CheckCircle } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-data"

export function EmailVerificationBanner() {
  const { user } = useUserProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (!user || user.email_verified || dismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email_verification" }),
      })

      if (response.ok) {
        setSent(true)
        setTimeout(() => setSent(false), 5000) // Hide success message after 5 seconds
      }
    } catch (error) {
      console.error("Failed to resend verification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Verification email sent! Please check your inbox.
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    )
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Mail className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-700 pr-20">
        Please verify your email address to access all features.
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto ml-2 text-orange-600 hover:text-orange-700"
          onClick={handleResendVerification}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      </AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-6 w-6 p-0"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}
