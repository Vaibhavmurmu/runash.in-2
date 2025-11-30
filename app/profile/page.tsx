import { requireAuth } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function ProfilePage() {
  const user = await requireAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard" className="text-sm text-primary hover:underline mb-4 inline-block">
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input type="text" defaultValue={user.name || ""} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Status</label>
              <div className="text-sm">
                {user.emailVerified ? (
                  <span className="text-green-600 font-medium">Verified</span>
                ) : (
                  <span className="text-yellow-600 font-medium">Pending verification</span>
                )}
              </div>
            </div>

            <Button disabled className="w-full">
              Update Profile
            </Button>
            <p className="text-xs text-muted-foreground">Profile editing coming soon</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
