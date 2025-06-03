import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-orange-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 mr-2 text-orange-600" />
              Maybe you're looking for:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link href="/dashboard" className="text-orange-600 hover:text-orange-700 hover:underline">
                Dashboard
              </Link>
              <Link href="/stream" className="text-orange-600 hover:text-orange-700 hover:underline">
                Start Streaming
              </Link>
              <Link href="/analytics" className="text-orange-600 hover:text-orange-700 hover:underline">
                Analytics
              </Link>
              <Link href="/recordings" className="text-orange-600 hover:text-orange-700 hover:underline">
                Recordings
              </Link>
              <Link href="/features" className="text-orange-600 hover:text-orange-700 hover:underline">
                Features
              </Link>
              <Link href="/pricing" className="text-orange-600 hover:text-orange-700 hover:underline">
                Pricing
              </Link>
              <Link href="/support" className="text-orange-600 hover:text-orange-700 hover:underline">
                Support
              </Link>
              <Link href="/contact" className="text-orange-600 hover:text-orange-700 hover:underline">
                Contact
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
