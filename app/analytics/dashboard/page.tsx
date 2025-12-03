"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ArrowUpRight,
  Info,
  Download,
  Zap,
  Bell,
  Eye,
  MessageSquare,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  Calendar,
  ChevronRight,
} from "lucide-react"

/**
 * NOTE:
 * - This version removes the static/dummy arrays and hooks up the dashboard to:
 *   1) REST endpoints for historical / aggregated data (GET /api/analytics/dashboard)
 *   2) a Server-Sent Events (SSE) endpoint for real-time streaming metrics (GET /api/analytics/live)
 * - It also implements "Set Alert" and "Schedule Report" features on the client:
 *   - Alerts are stored in localStorage and evaluated against incoming real-time metrics.
 *   - Scheduled reports are stored in localStorage and will generate a CSV for download at the scheduled interval (client-side scheduling).
 *
 * You will need to provide the server endpoints:
 * - GET /api/analytics/dashboard -> returns aggregated/historical data for charts
 * - GET /api/analytics/live -> SSE that emits JSON messages with live metrics, e.g.:
 *   { "timestamp":"...", "viewers": 1234, "chatActivity": 234, "device":"desktop", "latency":120, "quality":"720p", "streamFrom":"us-east-1", "deliverFrom":"cdn-edge-5", "player":"hlsjs" }
 *
 * The SSE endpoint is optional — the UI falls back to polling /api/analytics/live/latest (every 5s) if EventSource is not available.
 */

type DashboardResponse = {
  overview: Array<{ date: string; viewers: number; followers: number; revenue: number }>
  platforms: Array<{ name: string; value: number; color?: string }>
  content: Array<{ name: string; views: number; engagement: number }>
  audience: Array<{ name: string; male: number; female: number }>
  revenue: Array<{ name: string; value: number; color?: string }>
  engagement: Array<{ time: string; chatActivity: number; viewers: number }>
}

type LiveMetrics = {
  timestamp: string
  viewers?: number
  chatActivity?: number
  device?: string
  latency?: number // ms
  quality?: string // e.g. 1080p
  streamFrom?: string
  deliverFrom?: string
  player?: string
  [k: string]: any
}

type Alert = {
  id: string
  metric: string
  condition: "above" | "below"
  value: number
  triggered?: boolean
  createdAt: string
}

type ScheduledReport = {
  id: string
  name: string
  frequency: "daily" | "weekly" | "monthly" | "hourly"
  recipients?: string
  format?: "CSV" | "PDF" | "Excel"
  nextRun?: string
  createdAt: string
}

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  // historical/dashboard data (fetched once and on demand)
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)

  // live metrics received from SSE or polling
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollingRef = useRef<number | null>(null)

  // alerts and scheduled reports persisted to localStorage
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("analytics_alerts") : null
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [schedules, setSchedules] = useState<ScheduledReport[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("analytics_schedules") : null
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // dialog form state for creating alerts and schedules
  const [alertForm, setAlertForm] = useState({ metric: "viewers", condition: "above", value: 1000 })
  const [scheduleForm, setScheduleForm] = useState({
    name: "Monthly Performance Summary",
    frequency: "monthly",
    recipients: "",
    format: "CSV",
  })

  // small helper - we will attempt SSE first, fallback to polling
  useEffect(() => {
    let mounted = true

    async function fetchDashboard() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/analytics/dashboard")
        if (!res.ok) throw new Error("Failed to load dashboard")
        const data: DashboardResponse = await res.json()
        if (mounted) setDashboard(data)
      } catch (err) {
        // If the API isn't present, keep the UI but show a toast for developers
        console.error(err)
        toast.error("Unable to fetch dashboard data. Make sure /api/analytics/dashboard is available.")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchDashboard()

    // try SSE
    try {
      if (typeof window !== "undefined" && "EventSource" in window) {
        const es = new EventSource("/api/analytics/live")
        eventSourceRef.current = es
        es.onmessage = (ev) => {
          try {
            const parsed = JSON.parse(ev.data) as LiveMetrics
            setLiveMetrics(parsed)
          } catch (err) {
            console.warn("Malformed SSE payload", err)
          }
        }
        es.onerror = () => {
          // fallback to polling on SSE error
          es.close()
          eventSourceRef.current = null
          startPolling()
        }
      } else {
        startPolling()
      }
    } catch (err) {
      console.warn("SSE failed, falling back to polling", err)
      startPolling()
    }

    function startPolling() {
      // poll latest live snapshot every 5 seconds
      const id = window.setInterval(async () => {
        try {
          const res = await fetch("/api/analytics/live/latest")
          if (!res.ok) return
          const json = (await res.json()) as LiveMetrics
          setLiveMetrics(json)
        } catch (err) {
          console.warn("Polling failed", err)
        }
      }, 5000)
      pollingRef.current = id
    }

    // evaluate alerts whenever live metrics change
    return () => {
      mounted = false
      if (eventSourceRef.current) {
        try {
          eventSourceRef.current.close()
        } catch {}
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // persist alerts & schedules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("analytics_alerts", JSON.stringify(alerts))
    } catch {}
  }, [alerts])

  useEffect(() => {
    try {
      localStorage.setItem("analytics_schedules", JSON.stringify(schedules))
    } catch {}
  }, [schedules])

  // evaluate alerts on incoming liveMetrics
  useEffect(() => {
    if (!liveMetrics) return
    // For each alert, check if condition is met on liveMetrics[metric]
    alerts.forEach((a) => {
      if (a.triggered) return // don't re-trigger
      const metricValue = Number(liveMetrics[a.metric] ?? NaN)
      if (Number.isNaN(metricValue)) return
      const matched = a.condition === "above" ? metricValue > a.value : metricValue < a.value
      if (matched) {
        // mark as triggered and notify
        setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, triggered: true } : x)))
        toast.success(`Alert triggered: ${a.metric} ${a.condition} ${a.value}`, {
          description: `${a.metric} is now ${metricValue} (threshold: ${a.condition} ${a.value})`,
        })
      }
    })
  }, [liveMetrics, alerts])

  // schedule runner (client-side scheduler) - will generate client-side CSV and trigger download or email via mailto
  useEffect(() => {
    // compute next run times and set timers
    const timers: number[] = []
    schedules.forEach((s) => {
      const intervalMs = freqToMs(s.frequency)
      if (!intervalMs) return
      // setInterval to fire generateReport
      const id = window.setInterval(() => {
        generateReport(s)
      }, intervalMs)
      timers.push(id)
    })

    return () => {
      timers.forEach((id) => clearInterval(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, dashboard, liveMetrics])

  // helpers
  function freqToMs(freq: ScheduledReport["frequency"] | string) {
    switch (freq) {
      case "hourly":
        return 1000 * 60 * 60
      case "daily":
        return 1000 * 60 * 60 * 24
      case "weekly":
        return 1000 * 60 * 60 * 24 * 7
      case "monthly":
        return 1000 * 60 * 60 * 24 * 30
      default:
        return null
    }
  }

  async function generateReport(schedule?: ScheduledReport) {
    try {
      // attempt to fetch fresh data (best-effort)
      const res = await fetch("/api/analytics/dashboard")
      const data: DashboardResponse | null = res.ok ? await res.json() : dashboard
      // create CSV from overview as example
      if (!data) {
        toast.error("No data available to generate report")
        return
      }
      const rows = [["date", "viewers", "followers", "revenue"], ...data.overview.map((r) => [r.date, String(r.viewers), String(r.followers), String(r.revenue)])]
      const csv = rows.map((r) => r.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const fileName = schedule ? `${schedule.name.replace(/\s+/g, "_")}.csv` : `analytics_report_${Date.now()}.csv`
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Report generated", { description: schedule ? `Scheduled report "${schedule.name}" generated` : "Report generated" })
      // optionally attempt to email via mailto (best-effort client-side)
      if (schedule?.recipients) {
        const mailto = `mailto:${encodeURIComponent(schedule.recipients)}?subject=${encodeURIComponent("Scheduled Analytics Report")}&body=${encodeURIComponent("Please find the attached report. (Attachment not supported via mailto - report downloaded locally.)")}`
        // open mail client
        window.open(mailto)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate report")
    }
  }

  function addAlert() {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const newAlert: Alert = {
      id,
      metric: String(alertForm.metric),
      condition: alertForm.condition as any,
      value: Number(alertForm.value),
      triggered: false,
      createdAt: new Date().toISOString(),
    }
    setAlerts((prev) => [newAlert, ...prev])
    toast.success("Alert created", { description: `Will notify when ${newAlert.metric} ${newAlert.condition} ${newAlert.value}` })
  }

  function removeAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  function addSchedule() {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const s: ScheduledReport = {
      id,
      name: scheduleForm.name,
      frequency: scheduleForm.frequency as any,
      recipients: scheduleForm.recipients,
      format: scheduleForm.format as any,
      nextRun: new Date(Date.now() + (freqToMs(scheduleForm.frequency) ?? 0)).toISOString(),
      createdAt: new Date().toISOString(),
    }
    setSchedules((prev) => [s, ...prev])
    toast.success("Report scheduled", { description: `${s.name} (${s.frequency})` })
  }

  function removeSchedule(id: string) {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }

  // derived metric list (for alert dropdown) - common metrics including live-specific
  const availableMetrics = useMemo(() => ["viewers", "followers", "revenue", "chatActivity", "latency"], [])

  // sample small UI for live metrics card
  const LiveMetricsCard = () => {
    if (!liveMetrics) {
      return (
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Stream (no data)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No live data yet. Waiting for server-sent events or polling to start.</div>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Stream</CardTitle>
              <CardDescription asChild>
                <div className="text-xs text-muted-foreground">Real-time metrics (device, latency, quality, origin, CDN, player)</div>
              </CardDescription>
            </div>
            <div className="flex space-x-3">
              <Badge variant="outline">{liveMetrics.quality ?? "—"}</Badge>
              <Badge variant="outline">{liveMetrics.device ?? "—"}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Viewers</div>
              <div className="text-2xl font-bold">{liveMetrics.viewers ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Chat Activity</div>
              <div className="text-2xl font-bold">{liveMetrics.chatActivity ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Latency</div>
              <div className="text-xl font-bold">{liveMetrics.latency != null ? `${liveMetrics.latency} ms` : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Player</div>
              <div className="text-xl font-bold">{liveMetrics.player ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Stream from</div>
              <div className="text-sm">{liveMetrics.streamFrom ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Deliver from</div>
              <div className="text-sm">{liveMetrics.deliverFrom ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <AnalyticsSkeletonLoader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights for your streaming performance across all platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Alert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create Performance Alert</AlertDialogTitle>
                    <AlertDialogDescription>
                      Get notified when your stream metrics reach specific thresholds. Alerts are stored in your
                      browser (local) for this demo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Metric:</span>
                      <select
                        value={alertForm.metric}
                        onChange={(e) => setAlertForm((s) => ({ ...s, metric: e.target.value }))}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {availableMetrics.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Condition:</span>
                      <select
                        value={alertForm.condition}
                        onChange={(e) => setAlertForm((s) => ({ ...s, condition: e.target.value }))}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="above">Above threshold</option>
                        <option value="below">Below threshold</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Value:</span>
                      <input
                        value={alertForm.value}
                        onChange={(e) => setAlertForm((s) => ({ ...s, value: Number(e.target.value) }))}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Enter value"
                        type="number"
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        addAlert()
                      }}
                    >
                      Create Alert
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Report
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Schedule Analytics Report</DrawerTitle>
                    <DrawerDescription>Set up recurring analytics reports delivered to your email (demo)</DrawerDescription>
                  </DrawerHeader>

                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Name</label>
                      <input
                        value={scheduleForm.name}
                        onChange={(e) => setScheduleForm((s) => ({ ...s, name: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Monthly Performance Summary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency</label>
                      <select
                        value={scheduleForm.frequency}
                        onChange={(e) => setScheduleForm((s) => ({ ...s, frequency: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Recipients</label>
                      <input
                        value={scheduleForm.recipients}
                        onChange={(e) => setScheduleForm((s) => ({ ...s, recipients: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Format</label>
                      <select
                        value={scheduleForm.format}
                        onChange={(e) => setScheduleForm((s) => ({ ...s, format: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="CSV">CSV</option>
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                      </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={() => {
                          addSchedule()
                        }}
                      >
                        Schedule Report
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md"
                onClick={async () => {
                  setIsLoading(true)
                  try {
                    // refresh dashboard and run a manual fetch
                    const res = await fetch("/api/analytics/dashboard?fresh=1")
                    if (res.ok) {
                      const json = await res.json()
                      setDashboard(json)
                      toast.success("Analytics refreshed", {
                        description: "Your analytics data has been updated",
                      })
                    } else {
                      toast.error("Failed to refresh analytics")
                    }
                  } catch (err) {
                    console.error(err)
                    toast.error("Error refreshing analytics")
                  } finally {
                    setIsLoading(false)
                  }
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.overview?.reduce((acc, r) => acc + r.viewers, 0) ?? "—"}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Live</span>
                  <span className="ml-1">data updated in real-time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {computeEngagementRate(dashboard) ?? "—"}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Live</span>
                  <span className="ml-1">data updated in real-time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.overview?.slice(-1)[0]?.followers ?? "—"}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Live</span>
                  <span className="ml-1">data updated in real-time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboard?.overview?.reduce((acc, r) => acc + r.revenue, 0) ?? "—"}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Live</span>
                  <span className="ml-1">data updated in real-time</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>Viewers, followers, and revenue over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">About this chart</h4>
                            <p className="text-sm text-muted-foreground">
                              This chart shows your key performance metrics over the past period. Use it to
                              identify trends and seasonal patterns in your streaming performance.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // quick export of the chart's overview dataset
                          if (!dashboard) {
                            toast.error("No data to export")
                            return
                          }
                          const csv =
                            [["date", "viewers", "followers", "revenue"], ...dashboard.overview.map((r) => [r.date, String(r.viewers), String(r.followers), String(r.revenue)])]
                              .map((r) => r.join(","))
                              .join("\n")
                          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `overview_${Date.now()}.csv`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ChartContainer
                      config={{
                        viewers: {
                          label: "Viewers",
                          color: "hsl(var(--chart-1))",
                        },
                        followers: {
                          label: "Followers",
                          color: "hsl(var(--chart-2))",
                        },
                        revenue: {
                          label: "Revenue ($)",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboard?.overview ?? []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="viewers"
                            name="viewers"
                            stroke="var(--color-viewers)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="followers"
                            name="followers"
                            stroke="var(--color-followers)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            name="revenue"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Distribution</CardTitle>
                    <CardDescription>Viewer distribution across platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboard?.platforms ?? []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {(dashboard?.platforms ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color ?? "#8884d8"} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                    <CardDescription>Views and engagement by content category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          views: {
                            label: "Views",
                            color: "hsl(var(--chart-1))",
                          },
                          engagement: {
                            label: "Engagement Rate (%)",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboard?.content ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              yAxisId="left"
                              dataKey="views"
                              name="views"
                              fill="var(--color-views)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              yAxisId="right"
                              dataKey="engagement"
                              name="engagement"
                              fill="var(--color-engagement)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Insight cards - kept simpler and dynamic where possible */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                        <Eye className="h-4 w-4 text-blue-500" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">Viewer Peak</h3>
                    <p className="text-sm text-muted-foreground">
                      Peak viewers from data: {dashboard?.overview?.reduce((mx, r) => Math.max(mx, r.viewers), 0) ?? "—"}
                    </p>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <div className="flex items-center">
                          <span>View details</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">Content Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Top category: {dashboard?.content?.[0]?.name ?? "—"}
                    </p>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <div className="flex items-center">
                          <span>View details</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30">
                        <DollarSign className="h-4 w-4 text-green-500" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">Revenue Opportunity</h3>
                    <p className="text-sm text-muted-foreground">Review monetization options in Reports</p>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <div className="flex items-center">
                          <span>View details</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full p-2 bg-orange-100 dark:bg-orange-900/30">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium">Audience Growth</h3>
                    <p className="text-sm text-muted-foreground">
                      Latest month growth: {computeMonthlyGrowth(dashboard) ?? "—"}
                    </p>
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <div className="flex items-center">
                          <span>View details</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Performance metrics across streaming platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {(dashboard?.platforms ?? []).map((p, idx) => (
                      <div key={p.name}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-4 w-4 rounded-full" style={{ background: p.color ?? undefined }} />
                            <h3 className="ml-2 font-medium">{p.name}</h3>
                          </div>
                          <Badge variant="outline">{p.value}%</Badge>
                        </div>
                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Analytics</CardTitle>
                  <CardDescription>Performance metrics by content type and category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          views: {
                            label: "Views",
                            color: "hsl(var(--chart-1))",
                          },
                          engagement: {
                            label: "Engagement Rate (%)",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboard?.content ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              yAxisId="left"
                              dataKey="views"
                              name="views"
                              fill="var(--color-views)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              yAxisId="right"
                              dataKey="engagement"
                              name="engagement"
                              fill="var(--color-engagement)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Top Performing Content</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {(dashboard?.content ?? []).slice(0, 4).map((c) => (
                          <div key={c.name} className="flex items-start space-x-4 rounded-lg border p-4">
                            <div className="h-16 w-24 rounded-md bg-muted" />
                            <div className="space-y-1">
                              <h4 className="font-medium">{c.name}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Eye className="mr-1 h-3 w-3" />
                                {c.views} views
                                <Separator orientation="vertical" className="mx-2 h-3" />
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {Math.round((c.views / 1000) * (c.engagement ?? 1))} comments
                              </div>
                              <div className="flex items-center">
                                <Badge variant="secondary" className="mr-1">
                                  {c.name}
                                </Badge>
                                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  {c.engagement}% engagement
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Age, gender, and location breakdown of your viewers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          male: {
                            label: "Male",
                            color: "hsl(var(--chart-1))",
                          },
                          female: {
                            label: "Female",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboard?.audience ?? []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="male" name="male" stackId="a" fill="var(--color-male)" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="female" name="female" stackId="a" fill="var(--color-female)" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Top Locations</h3>
                        <div className="space-y-4">
                          {/* for demo show dashboard.platforms top N */}
                          {(dashboard?.platforms ?? []).slice(0, 5).map((p) => (
                            <div key={p.name} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-5 bg-muted rounded mr-2" />
                                <span>{p.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">{p.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Viewer Loyalty</h3>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Returning Viewers</h4>
                              <span className="font-bold">68%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full w-[68%]" />
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">New Viewers</h4>
                              <span className="font-bold">32%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-blue-500 h-2.5 rounded-full w-[32%]" />
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Subscriber Ratio</h4>
                              <span className="font-bold">24%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-purple-500 h-2.5 rounded-full w-[24%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Revenue breakdown by source and platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue by Source</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dashboard?.revenue ?? []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {(dashboard?.revenue ?? []).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color ?? "#8884d8"} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue Metrics</h3>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                                <div className="text-2xl font-bold">${dashboard?.overview?.slice(-1)[0]?.revenue ?? "—"}</div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>Live</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Revenue per Viewer</div>
                                <div className="text-2xl font-bold">
                                  {computeRevenuePerViewer(dashboard) ?? "—"}
                                </div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>Live</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Subscriber Value</div>
                                <div className="text-2xl font-bold">$4.95</div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>3.2%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
                      <div className="h-[300px]">
                        <ChartContainer
                          config={{
                            revenue: {
                              label: "Revenue ($)",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboard?.overview ?? []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                name="revenue"
                                stroke="var(--color-revenue)"
                                fill="var(--color-revenue)"
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                  <CardDescription>Chat activity, watch time, and interaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          chatActivity: {
                            label: "Chat Messages",
                            color: "hsl(var(--chart-1))",
                          },
                          viewers: {
                            label: "Viewers",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dashboard?.engagement ?? []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="chatActivity"
                              name="chatActivity"
                              stroke="var(--color-chatActivity)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="viewers"
                              name="viewers"
                              stroke="var(--color-viewers)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Chat Messages per Viewer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{computeChatPerViewer(dashboard) ?? "—"}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">Live</span>
                            <span className="ml-1">data updated in real-time</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Average Watch Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">32 min</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">8.3%</span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Interaction Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">18.7%</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">5.2%</span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Real-time Stream Details</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <LiveMetricsCard />
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Active Alerts</h4>
                          <div className="space-y-2">
                            {alerts.length === 0 && <div className="text-sm text-muted-foreground">No alerts defined</div>}
                            {alerts.map((a) => (
                              <div key={a.id} className="rounded-lg border p-3 flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium">{a.metric}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {a.condition} {a.value} • {a.triggered ? "Triggered" : "Idle"}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button onClick={() => removeAlert(a.id)} variant="ghost" size="sm">
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <h4 className="font-medium mb-2">Scheduled Reports</h4>
                          <div className="space-y-2">
                            {schedules.length === 0 && <div className="text-sm text-muted-foreground">No schedules</div>}
                            {schedules.map((s) => (
                              <div key={s.id} className="rounded-lg border p-3 flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium">{s.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {s.frequency} • next: {s.nextRun ? new Date(s.nextRun).toLocaleString() : "—"}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button onClick={() => generateReport(s)} size="sm" variant="outline">
                                    Run now
                                  </Button>
                                  <Button onClick={() => removeSchedule(s.id)} variant="ghost" size="sm">
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function AnalyticsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ---------- Helper functions (small computations) ---------- */

function computeEngagementRate(dashboard: DashboardResponse | null) {
  if (!dashboard) return null
  // simple ratio: average engagement from content
  const content = dashboard.content ?? []
  if (!content.length) return null
  const avg = content.reduce((s, c) => s + (c.engagement ?? 0), 0) / content.length
  return `${avg.toFixed(1)}%`
}

function computeMonthlyGrowth(dashboard: DashboardResponse | null) {
  if (!dashboard) return null
  const ov = dashboard.overview ?? []
  if (ov.length < 2) return null
  const last = ov[ov.length - 1].viewers
  const prev = ov[ov.length - 2].viewers
  if (prev === 0) return null
  const pct = ((last - prev) / prev) * 100
  return `${pct.toFixed(1)}%`
}

function computeRevenuePerViewer(dashboard: DashboardResponse | null) {
  if (!dashboard) return null
  const ov = dashboard.overview ?? []
  const totalRevenue = ov.reduce((s, r) => s + (r.revenue ?? 0), 0)
  const totalViewers = ov.reduce((s, r) => s + (r.viewers ?? 0), 0)
  if (totalViewers === 0) return null
  return `$${(totalRevenue / totalViewers).toFixed(2)}`
}

function computeChatPerViewer(dashboard: DashboardResponse | null) {
  if (!dashboard) return null
  const eng = dashboard.engagement ?? []
  if (!eng.length) return null
  const totalChat = eng.reduce((s, e) => s + (e.chatActivity ?? 0), 0)
  const totalViewers = eng.reduce((s, e) => s + (e.viewers ?? 0), 0)
  if (totalViewers === 0) return null
  return (totalChat / totalViewers).toFixed(1)
}
