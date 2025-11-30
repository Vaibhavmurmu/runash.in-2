import { requireAuth } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  // Require authentication
  const user = await requireAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.email}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full">View Profile</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Update your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button className="w-full">Go to Settings</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/security">
                <Button className="w-full">Security Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Quick Info</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email:</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email Verified:</dt>
              <dd className="font-medium">{user.emailVerified ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role:</dt>
              <dd className="font-medium capitalize">{user.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
