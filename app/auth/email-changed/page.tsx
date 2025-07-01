"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function EmailChangedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-blue-700">Email Address Updated!</CardTitle>
          <CardDescription>Your email address has been successfully changed and verified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Email Updated</span>
            </div>
            <p className="text-sm text-blue-700">
              Your new email address is now your primary login method. Make sure to use it for future logins.
            </p>
          </div>

          <Button
            asChild
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
          >
            <Link href="/account/profile">Back to Profile</Link>
          </Button>

          <div className="text-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
