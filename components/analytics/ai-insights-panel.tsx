"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

interface AIInsightsPanelProps {
  period: string
}

type InsightType = "opportunity" | "optimization" | "warning" | "success" | string

interface Insight {
  id: string
  type: InsightType
  title: string
  description: string
  impact: "high" | "medium" | "low" | string
  confidence: number
  action: string
  icon?: string
  applied?: boolean
}

interface RecommendationCategory {
  category: string
  suggestions: string[]
}

const ICONS: Record<string, any> = {
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Lightbulb,
}

export function AIInsightsPanel({ period }: AIInsightsPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationCategory[]>([])
  const [minConfidence, setMinConfidence] = useState(0)

  const LOCAL_STORAGE_KEY = `ai-insights-applied:${period}`

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadAppliedFromStorage = useCallback(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null
      if (!raw) return new Set<string>()
      return new Set<string>(JSON.parse(raw))
    } catch (e) {
      return new Set<string>()
    }
  }, [LOCAL_STORAGE_KEY])

  const saveAppliedToStorage = useCallback(
    (set: Set<string>) => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(set)))
      } catch (e) {
        // ignore
      }
    },
    [LOCAL_STORAGE_KEY]
  )

  useEffect(() => {
    const controller = new AbortController()

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch real insights from your backend. Endpoint should return structured JSON:
        // { insights: Insight[], recommendations: RecommendationCategory[] }
        const res = await fetch(`/api/analytics/ai-insights?period=${encodeURIComponent(period)}`, {
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

        const data = await res.json()

        // Merge with applied state from localStorage so UI reflects user actions even if backend doesn't
        const appliedSet = loadAppliedFromStorage()

        const serverInsights: Insight[] = (data.insights || []).map((s: any) => ({
          id: String(s.id),
          type: s.type || "opportunity",
          title: s.title || "Untitled insight",
          description: s.description || "",
          impact: s.impact || "medium",
          confidence: Number(s.confidence || 0),
          action: s.action || "",
          icon: s.icon || undefined,
          applied: appliedSet.has(String(s.id)),
        }))

        setInsights(serverInsights)
        setRecommendations(data.recommendations || [])
      } catch (e: any) {
        if (e.name === "AbortError") return
        console.error(e)
        setError(e.message || "Failed to load insights")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [period, loadAppliedFromStorage])

  const refresh = useCallback(() => {
    // simple way to refetch is to toggle loading and re-run effect by changing period (we keep period same)
    // so we call the same fetch endpoint manually here
    setLoading(true)
    setError(null)

    fetch(`/api/analytics/ai-insights?period=${encodeURIComponent(period)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const appliedSet = loadAppliedFromStorage()
        const serverInsights: Insight[] = (data.insights || []).map((s: any) => ({
          id: String(s.id),
          type: s.type || "opportunity",
          title: s.title || "Untitled insight",
          description: s.description || "",
          impact: s.impact || "medium",
          confidence: Number(s.confidence || 0),
          action: s.action || "",
          icon: s.icon || undefined,
          applied: appliedSet.has(String(s.id)),
        }))

        setInsights(serverInsights)
        setRecommendations(data.recommendations || [])
      })
      .catch((e) => {
        console.error(e)
        setError(e.message || "Failed to refresh insights")
      })
      .finally(() => setLoading(false))
  }, [period, loadAppliedFromStorage])

  const applyInsight = useCallback(
    async (insightId: string) => {
      // optimistic update locally and persist in localStorage
      const appliedSet = loadAppliedFromStorage()
      appliedSet.add(insightId)
      saveAppliedToStorage(appliedSet)
      setInsights((prev) => prev.map((p) => (p.id === insightId ? { ...p, applied: true } : p)))

      try {
        // Inform backend about the user's action. This endpoint should exist in your API.
        await fetch(`/api/analytics/insights/${encodeURIComponent(insightId)}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ period }),
        })
      } catch (e) {
        // If backend fails, we keep local optimistic update but log the error
        console.error("Failed to notify backend about applied insight", e)
      }
    },
    [period, loadAppliedFromStorage, saveAppliedToStorage]
  )

  const exportCSV = useCallback(() => {
    // Build a CSV from the insights and recommendations to allow quick export
    const rows: string[] = []
    rows.push("type,title,description,impact,confidence,action,applied")
    insights.forEach((i) => {
      const row = [i.type, escapeCsv(i.title), escapeCsv(i.description), i.impact, String(i.confidence), escapeCsv(i.action), String(Boolean(i.applied))]
      rows.push(row.join(","))
    })

    const csv = rows.join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-insights-${period || "all"}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [insights, period])

  function escapeCsv(value: string) {
    if (typeof value !== "string") return String(value)
    if (value.includes(",") || value.includes("\n") || value.includes('"')) {
      return '"' + value.replace(/"/g, '""') + '"'
    }
    return value
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
      case "optimization":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <CardTitle>AI-Powered Insights</CardTitle>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-muted-foreground">Min Confidence</label>
              <input
                type="range"
                min={0}
                max={100}
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-40"
              />

              <Button size="sm" onClick={refresh} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </Button>

              <Button size="sm" variant="ghost" onClick={exportCSV}>
                Export CSV
              </Button>
            </div>
          </div>
          <CardDescription>
            Intelligent analysis of your stream performance with actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{insights.length}</div>
              <div className="text-sm text-muted-foreground">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {insights.length ? Math.round(insights.reduce((s, i) => s + i.confidence, 0) / insights.length) : "—"}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{recommendations.reduce((s, r) => s + r.suggestions.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && (
          <div className="col-span-2 p-4 text-center text-sm text-muted-foreground">Loading insights...</div>
        )}

        {error && (
          <div className="col-span-2 p-4 text-center text-sm text-red-500">Error: {error}</div>
        )}

        {insights.filter((i) => i.confidence >= minConfidence).map((insight) => {
          const Icon = insight.icon && ICONS[insight.icon] ? ICONS[insight.icon] : ICONS[insight.type] || Sparkles

          return (
            <Card key={insight.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <Badge className={getInsightColor(insight.type)}>{insight.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{insight.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span>Confidence Level</span>
                  <span className="font-medium">{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Impact:</span>
                    <Badge variant="outline" className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant={insight.applied ? "secondary" : "outline"} onClick={() => applyInsight(insight.id)} disabled={Boolean(insight.applied)}>
                      {insight.applied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" /> Applied
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          {insight.action || "Apply"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {insights.filter((i) => i.confidence >= minConfidence).length === 0 && !loading && (
          <div className="col-span-2 p-4 text-center text-sm text-muted-foreground">No insights match the selected filters.</div>
        )}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>Personalized suggestions to improve your stream performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400">{category.category}</h4>
                <ul className="space-y-2">
                  {category.suggestions.map((suggestion, suggestionIndex) => (
                    <li key={suggestionIndex} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {recommendations.length === 0 && !loading && (
              <div className="col-span-3 text-sm text-muted-foreground">No recommendations available for this period.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle>Performance Predictions</CardTitle>
          </div>
          <CardDescription>AI-powered forecasts based on your current trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">+23%</div>
              <div className="text-sm text-muted-foreground">Expected viewer growth</div>
              <div className="text-xs text-green-600 mt-1">Next 30 days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-muted-foreground">Revenue increase</div>
              <div className="text-xs text-green-600 mt-1">Next 30 days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <div className="text-2xl font-bold">+2.3m</div>
              <div className="text-sm text-muted-foreground">Watch time boost</div>
              <div className="text-xs text-green-600 mt-1">With optimizations</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">8.9%</div>
              <div className="text-sm text-muted-foreground">Engagement rate</div>
              <div className="text-xs text-green-600 mt-1">Projected peak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  }
