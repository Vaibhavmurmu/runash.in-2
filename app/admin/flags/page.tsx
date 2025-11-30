"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface FeatureFlag {
  id: number
  flagName: string
  description: string | null
  isEnabled: boolean
  rolloutPercentage: number | null
  createdAt: Date
  updatedAt: Date
}

export default function FlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<FeatureFlag>>({})

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      const response = await fetch("/api/admin/flags")
      if (!response.ok) throw new Error("Failed to fetch flags")
      const data = await response.json()
      setFlags(data.flags)
    } catch (err) {
      setError("Failed to load feature flags")
      console.error("[v0] Error fetching flags:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFlag = async (flagId: number) => {
    try {
      const response = await fetch("/api/admin/flags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagId, ...editValues }),
      })

      if (!response.ok) throw new Error("Failed to update flag")

      const data = await response.json()
      setFlags(flags.map((f) => (f.id === flagId ? data.flag : f)))
      setEditingId(null)
      setEditValues({})
    } catch (err) {
      setError("Failed to update flag")
      console.error("[v0] Error updating flag:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-muted-foreground">Loading feature flags...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feature Flags</h1>
        <p className="text-muted-foreground">Manage authentication migration rollout</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {flags.map((flag) => (
          <Card key={flag.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{flag.flagName}</CardTitle>
                  <CardDescription>{flag.description}</CardDescription>
                </div>
                <Badge variant={flag.isEnabled ? "default" : "outline"}>
                  {flag.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === flag.id ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium flex-1">Rollout Percentage</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={flag.rolloutPercentage || 0}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          rolloutPercentage: Number.parseInt(e.target.value),
                        })
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateFlag(flag.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditValues({})
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">
                      Rollout: <span className="font-semibold">{flag.rolloutPercentage}%</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(flag.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(flag.id)
                      setEditValues(flag)
                    }}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg space-y-2 text-sm">
        <p className="font-semibold">Rollout Strategy</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>0% - All new users use existing auth system</li>
          <li>10% - Only 10% of new users get Better Auth</li>
          <li>50% - 50% Better Auth, 50% existing system</li>
          <li>100% - All users use Better Auth</li>
        </ul>
      </div>
    </div>
  )
}
