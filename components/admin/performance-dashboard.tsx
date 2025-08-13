"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Database,
  Server,
  Zap,
  RefreshCw,
  Trash2,
  TrendingUp,
  Clock,
  MemoryStick,
  HardDrive,
} from "lucide-react"

interface PerformanceMetrics {
  database: {
    responseTime: number
    connections: {
      total_connections: number
      active_connections: number
    }
  }
  cache: {
    type: string
    memory?: string
    size?: number
    connected: boolean
  }
  system: {
    uptime: number
    memory: {
      rss: number
      heapTotal: number
      heapUsed: number
      external: number
    }
    nodeVersion: string
  }
  timestamp: number
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/admin/performance")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch performance metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (action: string) => {
    setActionLoading(action)
    try {
      const response = await fetch("/api/admin/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        await fetchMetrics()
      }
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getHealthStatus = (responseTime: number) => {
    if (responseTime < 100) return { status: "Excellent", color: "bg-green-500" }
    if (responseTime < 300) return { status: "Good", color: "bg-yellow-500" }
    if (responseTime < 1000) return { status: "Fair", color: "bg-orange-500" }
    return { status: "Poor", color: "bg-red-500" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Monitor system performance and optimize resource usage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "border-orange-500 text-orange-600" : ""}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh {autoRefresh ? "On" : "Off"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {metrics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Response</CardTitle>
                <Database className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.database.responseTime}ms</div>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${getHealthStatus(metrics.database.responseTime).color} text-white`}
                >
                  {getHealthStatus(metrics.database.responseTime).status}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DB Connections</CardTitle>
                <Server className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.database.connections.active_connections}/{metrics.database.connections.total_connections}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Active / Total</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
                <Zap className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{metrics.cache.type}</div>
                <Badge variant={metrics.cache.connected ? "default" : "destructive"} className="mt-2">
                  {metrics.cache.connected ? "Connected" : "Disconnected"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatUptime(metrics.system.uptime)}</div>
                <p className="text-xs text-muted-foreground mt-2">Node {metrics.system.nodeVersion}</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Tabs defaultValue="system" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system">System Resources</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MemoryStick className="h-5 w-5 text-orange-500" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Heap Used</span>
                        <span>{formatBytes(metrics.system.memory.heapUsed)}</span>
                      </div>
                      <Progress
                        value={(metrics.system.memory.heapUsed / metrics.system.memory.heapTotal) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>RSS</span>
                        <span>{formatBytes(metrics.system.memory.rss)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>External</span>
                        <span>{formatBytes(metrics.system.memory.external)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-blue-500" />
                      Cache Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {metrics.cache.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={metrics.cache.connected ? "default" : "destructive"}>
                        {metrics.cache.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    {metrics.cache.memory && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memory:</span>
                        <span className="text-sm">{metrics.cache.memory}</span>
                      </div>
                    )}
                    {metrics.cache.size && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Entries:</span>
                        <span className="text-sm">{metrics.cache.size}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Pool</CardTitle>
                    <CardDescription>Database connection statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Active Connections</span>
                          <span>{metrics.database.connections.active_connections}</span>
                        </div>
                        <Progress
                          value={
                            (metrics.database.connections.active_connections /
                              metrics.database.connections.total_connections) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Connections:</span>
                        <span>{metrics.database.connections.total_connections}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Database query performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">{metrics.database.responseTime}ms</div>
                      <Badge
                        variant="secondary"
                        className={`${getHealthStatus(metrics.database.responseTime).color} text-white`}
                      >
                        {getHealthStatus(metrics.database.responseTime).status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cache Management</CardTitle>
                    <CardDescription>Clear cached data to free memory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => executeAction("clear_cache")}
                      disabled={actionLoading === "clear_cache"}
                      className="w-full"
                      variant="outline"
                    >
                      {actionLoading === "clear_cache" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Clear All Cache
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Cleanup</CardTitle>
                    <CardDescription>Run background maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => executeAction("run_cleanup")}
                      disabled={actionLoading === "run_cleanup"}
                      className="w-full"
                      variant="outline"
                    >
                      {actionLoading === "run_cleanup" ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TrendingUp className="h-4 w-4 mr-2" />
                      )}
                      Run Cleanup
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
