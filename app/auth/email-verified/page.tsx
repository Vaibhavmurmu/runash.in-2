"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-green-100 to-green-200">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Email Verified Successfully!</CardTitle>
          <CardDescription>
            Your email address has been verified and your account is now fully activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">What's next?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Complete your profile setup</li>
              <li>• Explore AI-powered streaming tools</li>
              <li>• Start your first live stream</li>
              <li>• Connect with your audience</li>
            </ul>
          </div>

          <Button
            asChild
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
          >
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="text-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/account/profile">Complete Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
