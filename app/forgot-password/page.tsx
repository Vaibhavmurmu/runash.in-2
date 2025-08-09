"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to send reset email")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-amber-950/20 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">R</div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 dark:from-orange-400 dark:via-orange-300 dark:to-amber-300 text-transparent bg-clip-text">
            RunAsh
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> 
          {/* Left Side - Information */}
           <div className="space-y-8">
             {/*   <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Reset your{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                  password
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Don't worry, it happens to the best of us. Enter your email address and we'll send you a link to reset
                your password.
              </p>
            </div> */}

            {/* Security Features */}
            {/*  <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-900/30">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <span className="text-white font-bold">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure Reset</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your reset link expires in 1 hour for security
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-900/30">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <span className="text-white font-bold">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email Verification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll only send reset links to verified accounts
                  </p>
                </div>
              </div>
            </div> */}
          </div> 

          {/* Right Side - Reset Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {isSubmitted ? "Check your email for reset instructions" : "Enter your email address to get started"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!isSubmitted ? (
                  <div className="space-y-6">
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 pl-10 border-orange-200 focus:border-orange-400 dark:border-orange-800"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending reset link...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </form>

                    <div className="text-center">
                      <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Check your email</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        We've sent a password reset link to{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                      </p>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                      <Mail className="h-4 w-4" />
                      <AlertDescription className="text-left">
                        <strong>Didn't receive the email?</strong>
                        <br />
                        Check your spam folder or try again with a different email address.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                          setError("")
                        }}
                        variant="outline"
                        className="w-full border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                      >
                        Try different email
                      </Button>

                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center w-full text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} RunAsh AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link
                href="/support"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
