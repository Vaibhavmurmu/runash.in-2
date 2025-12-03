"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsFilters, AudienceDemographics } from "@/types/analytics"
import { Globe, Smartphone, Laptop } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AudienceInsightsProps {
  filters: AnalyticsFilters
  // pollInterval in ms for polling fallback (default 15000)
  pollInterval?: number
}

function buildQueryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams()
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.channelId) params.set('channelId', String(filters.channelId))
  if (filters.region) params.set('region', filters.region)
  return params.toString() ? `?${params.toString()}` : ''
}

export function AudienceInsights({ filters, pollInterval = 15000 }: AudienceInsightsProps) {
  // State for real data
  const [audienceData, setAudienceData] = useState<AudienceDemographics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollingRef = useRef<number | null>(null)

  const genderColors = ['#3b82f6', '#ec4899', '#8b5cf6']
  const deviceIcons = {
    Mobile: <Smartphone className="h-4 w-4" />,
    Desktop: <Laptop className="h-4 w-4" />,
    Tablet: <Laptop className="h-4 w-4 rotate-90" />,
    'Smart TV': <Laptop className="h-4 w-4" />,
  }

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const qs = buildQueryString(filters)
      const res = await fetch(`/api/analytics/audience${qs}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to fetch audience data: ${res.statusText}`)
      const data = (await res.json()) as AudienceDemographics
      setAudienceData(data)
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const qs = buildQueryString(filters)

    async function start() {
      // Try to open a server-sent events connection for real-time updates first
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        try {
          const url = `/api/analytics/audience/stream${qs}`
          const es = new EventSource(url)
          eventSourceRef.current = es

          es.onmessage = (e) => {
            try {
              const parsed = JSON.parse(e.data) as AudienceDemographics
              if (mounted) {
                setAudienceData(parsed)
                setLoading(false)
              }
            } catch (parseErr) {
              // ignore malformed messages
            }
          }

          es.onerror = () => {
            // If SSE fails, fall back to polling
            es.close()
            eventSourceRef.current = null
            if (mounted) {
              // start polling immediately
              fetchData()
              // @ts-ignore - window.setInterval returns number in browser
              pollingRef.current = window.setInterval(fetchData, pollInterval) as unknown as number
            }
          }

          // Initial fetch in case stream doesn't send initial state quickly
          fetchData()
          return
        } catch (e) {
          // Fall back to polling below
        }
      }

      // If EventSource is not available or fails, use polling fallback
      fetchData()
      // @ts-ignore
      pollingRef.current = window.setInterval(fetchData, pollInterval) as unknown as number
    }

    start()

    return () => {
      mounted = false
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (pollingRef.current) {
        // @ts-ignore
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
    // Re-run when filters change to re-subscribe / re-fetch
  }, [JSON.stringify(filters), pollInterval])

  // Graceful fallback UI when loading or error
  if (loading && !audienceData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
            <CardDescription>Loading real-time data…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Fetching analytics — this may take a few seconds.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !audienceData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
            <CardDescription>Error loading data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-destructive">{error}</div>
            <div className="mt-4">
              <button
                className="inline-flex items-center px-3 py-1 rounded bg-primary text-white text-sm"
                onClick={() => fetchData()}
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If we have partially available or full data use it
  const data = audienceData!

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Viewer age groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  percentage: {
                    label: 'Percentage',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" name="percentage" fill="var(--color-percentage)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Viewer gender breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="gender"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={genderColors[index % genderColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Top countries by viewer count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topCountries.map((country) => (
              <div key={country.country} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{country.country}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {country.viewers.toLocaleString()} viewers ({country.percentage}%)
                  </div>
                </div>
                <Progress value={country.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>How viewers are watching your streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.deviceTypes.map((device) => (
                <div key={device.device} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {deviceIcons[device.device as keyof typeof deviceIcons]}
                      <span className="ml-2">{device.device}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viewer Loyalty</CardTitle>
            <CardDescription>New vs. returning viewers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Returning Viewers', value: data.returningViewers },
                      { name: 'New Viewers', value: data.newViewers },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#f97316" />
                    <Cell fill="#84cc16" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
  
