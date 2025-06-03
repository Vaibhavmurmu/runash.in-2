"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Home, AlertTriangle, MessageCircle } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

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
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We encountered an unexpected error. Our team has been notified and is working to fix this issue.
            </p>
            {error.digest && (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg inline-block">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Try Again</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sometimes a simple refresh can fix the issue
                </p>
                <Button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Go Home</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Return to our homepage and start fresh</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Homepage
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get help from our support team</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                >
                  <Link href="/support">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && (
            <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-900/30">
              <CardContent className="p-6 text-left">
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Development Error Details</h3>
                <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </CardContent>
            </Card>
          )}
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
                href="/status"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Status
              </Link>
              <Link
                href="/support"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
