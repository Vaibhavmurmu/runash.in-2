import { getCurrentUser } from "@/lib/auth-helpers"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Authentication System</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Better Auth integration with Drizzle ORM, feature flags, and gradual migration support
            </p>
          </div>

          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back, <span className="font-semibold">{user.name}</span>!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="outline" type="submit">
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
