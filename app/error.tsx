"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Error Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Something went wrong!</h1>
          <p className="text-gray-600 mt-2">We encountered an unexpected error. Our team has been notified.</p>
        </div>

        {/* Error Details Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <Bug className="w-5 h-5 mr-2" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {error.message || "An unexpected error occurred"}
              </AlertDescription>
            </Alert>

            {error.digest && (
              <Alert className="border-gray-200 bg-gray-50">
                <AlertDescription className="text-gray-700">
                  <strong>Error ID:</strong> {error.digest}
                  <br />
                  <span className="text-sm text-gray-600">Please include this ID when contacting support.</span>
                </AlertDescription>
              </Alert>
            )}

            {process.env.NODE_ENV === "development" && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  <strong>Stack Trace (Development Only):</strong>
                  <pre className="mt-2 text-xs overflow-auto max-h-32 bg-yellow-100 p-2 rounded">{error.stack}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </a>
          </Button>
        </div>

        {/* Help Section */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">If this problem persists, please contact our support team.</p>
            <Button variant="link" asChild className="text-orange-600 hover:text-orange-700">
              <a href="/support">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
