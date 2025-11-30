"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DBStatus {
  status: string
  database: string
  tables: number
  requiredTables: string[]
  missingTables: string[]
  allTablesPresent: boolean
}

export default function DatabaseAdminPage() {
  const [status, setStatus] = useState<DBStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seedLoading, setSeedLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/db/status")
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check status")
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeedLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/db/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MIGRATION_SECRET || ""}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed database")
      }

      await checkStatus()
      alert("Database seeded successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed database")
    } finally {
      setSeedLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Database Administration</h1>
        <p className="text-muted-foreground">Manage database schema, migrations, and seeding</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Check database connection and table status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{status.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Database</p>
                    <p className="font-semibold">{status.database}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tables Found</p>
                    <p className="font-semibold">{status.tables}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tables Status</p>
                    <p className={`font-semibold ${status.allTablesPresent ? "text-green-600" : "text-red-600"}`}>
                      {status.allTablesPresent ? "All Present" : `${status.missingTables.length} Missing`}
                    </p>
                  </div>
                </div>

                {status.missingTables.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Missing Tables:</p>
                    <ul className="list-disc list-inside text-sm text-red-600">
                      {status.missingTables.map((table) => (
                        <li key={table}>{table}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <Button onClick={checkStatus} disabled={loading} variant="outline">
              {loading ? "Checking..." : "Refresh Status"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seed Sample Data</CardTitle>
            <CardDescription>Create sample users and products for testing (requires MIGRATION_SECRET)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={seedDatabase} disabled={seedLoading || !status?.allTablesPresent}>
              {seedLoading ? "Seeding..." : "Seed Database"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schema Information</CardTitle>
            <CardDescription>Available database tables and their purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Authentication Tables</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>users - User accounts and profiles</li>
                  <li>sessions - Active user sessions</li>
                  <li>accounts - OAuth linked accounts</li>
                  <li>verification_tokens - Email and password reset tokens</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">E-Commerce Tables</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>products - Product catalog</li>
                  <li>orders - Customer orders</li>
                  <li>order_items - Individual items in orders</li>
                  <li>reviews - Product reviews and ratings</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Communication Tables</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>messages - Direct messages between users</li>
                  <li>conversations - Message conversation groups</li>
                  <li>notifications - User notifications</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Additional Tables</p>
                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                  <li>wishlist - User saved items</li>
                  <li>events - Analytics and tracking events</li>
                  <li>auth_feature_flags - Feature flag configuration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
