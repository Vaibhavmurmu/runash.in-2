"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectFrom = searchParams.get("from") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => {
            router.push(redirectFrom)
          },
        },
      )

      if (!result.ok) {
        setError(result.error?.message || "Sign in failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("[v0] Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      await authClient.signIn.social(
        { provider: "google" },
        {
          onSuccess: () => {
            router.push(redirectFrom)
          },
        },
      )
    } catch (err) {
      setError("Google sign-in failed. Please try again.")
      console.error("[v0] Google login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setError("")
    setLoading(true)

    try {
      await authClient.signIn.social(
        { provider: "github" },
        {
          onSuccess: () => {
            router.push(redirectFrom)
          },
        },
      )
    } catch (err) {
      setError("GitHub sign-in failed. Please try again.")
      console.error("[v0] GitHub login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={loading}>
                Google
              </Button>
              <Button type="button" variant="outline" onClick={handleGitHubLogin} disabled={loading}>
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
