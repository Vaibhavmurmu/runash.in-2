"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  Shield,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { AuthLogEntry, LogAnalytics } from "@/lib/auth-logger"

export default function AuthLogsViewer() {
  const [logs, setLogs] = useState<AuthLogEntry[]>([])
  const [analytics, setAnalytics] = useState<LogAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedLog, setSelectedLog] = useState<AuthLogEntry | null>(null)
  const [showLogDetail, setShowLogDetail] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    event_type: "all",
    event_category: "all",
    success: "all",
    risk_score_min: "",
    risk_score_max: "",
    date_from: "",
    date_to: "",
  })

  useEffect(() => {
    fetchLogs()
    fetchAnalytics()
  }, [currentPage, filters])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== "" && value !== "all")),
      })

      const response = await fetch(`/api/admin/logs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setTotalPages(data.totalPages)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch logs",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams({
        start: filters.date_from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end: filters.date_to || new Date().toISOString().split("T")[0],
      })

      const response = await fetch(`/api/admin/logs/analytics?${params}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    try {
      const params = new URLSearchParams({
        format,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== "" && value !== "all")),
      })

      const response = await fetch(`/api/admin/logs/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `auth-logs-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: `Logs exported as ${format.toUpperCase()}`,
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export logs",
        variant: "destructive",
      })
    }
  }

  const getEventTypeColor = (eventType: string, success: boolean) => {
    if (!success) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"

    switch (eventType) {
      case "login":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "register":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "password_reset":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "two_factor_setup":
      case "two_factor_verify":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score === 0) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score <= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (score <= 7) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getRiskScoreLabel = (score: number) => {
    if (score === 0) return "Low"
    if (score <= 3) return "Medium"
    if (score <= 7) return "High"
    return "Critical"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Authentication Logs</h1>
          <p className="text-muted-foreground">Detailed authentication activity logs and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => handleExport("csv")} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExport("json")} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLogs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Authentication events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.successRate}%</div>
              <p className="text-xs text-muted-foreground">Successful authentications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Event</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.topEventTypes[0]?.event_type.replace("_", " ") || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">{analytics.topEventTypes[0]?.count || 0} occurrences</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.riskDistribution.find((r) => r.risk_level === "High")?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select value={filters.event_type} onValueChange={(value) => setFilters({ ...filters, event_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="register">Register</SelectItem>
                <SelectItem value="password_reset">Password Reset</SelectItem>
                <SelectItem value="two_factor_setup">2FA Setup</SelectItem>
                <SelectItem value="two_factor_verify">2FA Verify</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.success} onValueChange={(value) => setFilters({ ...filters, success: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Success</SelectItem>
                <SelectItem value="false">Failed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.date_from}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              />
              <Input
                type="date"
                placeholder="To"
                value={filters.date_to}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Logs</CardTitle>
          <CardDescription>Detailed view of all authentication events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Risk</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Device</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        Loading logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">
                          <Badge className={getEventTypeColor(log.event_type, log.success)}>
                            {log.event_type.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{(log as any).email || `User ${log.user_id}`}</div>
                            <div className="text-sm text-gray-500">{log.ip_address}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {log.success ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Failed
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getRiskScoreColor(log.risk_score)}>
                            {getRiskScoreLabel(log.risk_score)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {log.location?.city}, {log.location?.country}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {log.device_info?.device_type === "mobile" ? (
                              <Smartphone className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Monitor className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">{log.device_info?.browser}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log)
                              setShowLogDetail(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={showLogDetail} onOpenChange={setShowLogDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>Detailed information about this authentication event</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Event Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Event Type:</span> {selectedLog.event_type}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedLog.event_category}
                    </div>
                    <div>
                      <span className="font-medium">Success:</span> {selectedLog.success ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Risk Score:</span> {selectedLog.risk_score} (
                      {getRiskScoreLabel(selectedLog.risk_score)})
                    </div>
                    <div>
                      <span className="font-medium">Timestamp:</span>{" "}
                      {new Date(selectedLog.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User & Session</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">User ID:</span> {selectedLog.user_id || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {(selectedLog as any).email || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Session ID:</span> {selectedLog.session_id || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">IP Address:</span> {selectedLog.ip_address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Country:</span> {selectedLog.location?.country || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">City:</span> {selectedLog.location?.city || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Region:</span> {selectedLog.location?.region || "Unknown"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Device Type:</span>{" "}
                      {selectedLog.device_info?.device_type || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Browser:</span> {selectedLog.device_info?.browser || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">OS:</span> {selectedLog.device_info?.os || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">User Agent</h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg break-all">
                  {selectedLog.user_agent}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Additional Details</h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
