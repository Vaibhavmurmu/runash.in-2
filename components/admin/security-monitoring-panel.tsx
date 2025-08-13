"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, BarChart, ResponsiveContainer, Line, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Shield, AlertTriangle, Ban, Activity, Globe, Eye, CheckCircle, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { SecurityThreat, SecurityMetrics } from "@/lib/security-monitor"

export default function SecurityMonitoringPanel() {
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null)
  const [showThreatDetail, setShowThreatDetail] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchThreats()
    fetchMetrics()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchThreats()
        fetchMetrics()
      }, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchThreats = async () => {
    try {
      const response = await fetch("/api/admin/security/threats")
      const data = await response.json()

      if (response.ok) {
        setThreats(data)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch threats",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch threats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/admin/security/metrics")
      const data = await response.json()

      if (response.ok) {
        setMetrics(data)
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "investigating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "false_positive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getThreatTypeIcon = (threatType: string) => {
    switch (threatType) {
      case "brute_force":
        return <Ban className="h-4 w-4" />
      case "suspicious_ip":
        return <Globe className="h-4 w-4" />
      case "credential_stuffing":
        return <AlertTriangle className="h-4 w-4" />
      case "account_takeover":
        return <Shield className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
          <p className="text-muted-foreground">Real-time threat detection and security analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
          </Button>
          <Button onClick={fetchThreats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Auto-blocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.suspiciousActivities}</div>
            <p className="text-xs text-muted-foreground">High-risk events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved Threats</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.resolvedThreats}</div>
            <p className="text-xs text-muted-foreground">Successfully handled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="analytics">Threat Analytics</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Threats</TabsTrigger>
          <TabsTrigger value="trends">Threat Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Threats</CardTitle>
              <CardDescription>Real-time threat detection and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active threats detected</p>
                    <p className="text-sm">Your system is secure</p>
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getThreatTypeIcon(threat.threat_type)}
                          <div>
                            <div className="font-medium">{threat.title}</div>
                            <div className="text-sm text-muted-foreground">{threat.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                              <Badge className={getStatusColor(threat.status)}>{threat.status}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Risk: {threat.risk_score}/10 • IP: {threat.source_ip}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(threat.first_detected).toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedThreat(threat)
                            setShowThreatDetail(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Threats by Type</CardTitle>
                <CardDescription>Distribution of threat categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.threatsByType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" name="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Threats</CardTitle>
                <CardDescription>Most frequent threat types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topThreats.slice(0, 5).map((threat, index) => (
                    <div key={threat.threat_type} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{threat.threat_type.replace("_", " ")}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {threat.count} threats • Risk: {threat.avg_risk.toFixed(1)}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                          style={{ width: `${(threat.count / metrics.topThreats[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Threat Distribution</CardTitle>
              <CardDescription>Threats by country of origin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.geographicThreats.map((country, index) => (
                  <div key={country.country} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {country.threats} threats • Risk: {country.risk_score.toFixed(1)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                        style={{ width: `${(country.threats / metrics.geographicThreats[0].threats) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Trends</CardTitle>
              <CardDescription>Daily threat detection and resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    threats: {
                      label: "Threats Detected",
                      color: "hsl(var(--chart-1))",
                    },
                    resolved: {
                      label: "Threats Resolved",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.threatTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="threats"
                        name="threats"
                        stroke="var(--color-threats)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        name="resolved"
                        stroke="var(--color-resolved)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Threat Detail Dialog */}
      <Dialog open={showThreatDetail} onOpenChange={setShowThreatDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Threat Details</DialogTitle>
            <DialogDescription>Comprehensive information about this security threat</DialogDescription>
          </DialogHeader>
          {selectedThreat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Threat Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {selectedThreat.threat_type}
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span>{" "}
                      <Badge className={getSeverityColor(selectedThreat.severity)}>{selectedThreat.severity}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge className={getStatusColor(selectedThreat.status)}>{selectedThreat.status}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Risk Score:</span> {selectedThreat.risk_score}/10
                    </div>
                    <div>
                      <span className="font-medium">Occurrences:</span> {selectedThreat.occurrences}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">First Detected:</span>{" "}
                      {new Date(selectedThreat.first_detected).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Seen:</span>{" "}
                      {new Date(selectedThreat.last_seen).toLocaleString()}
                    </div>
                    {selectedThreat.resolved_at && (
                      <div>
                        <span className="font-medium">Resolved:</span>{" "}
                        {new Date(selectedThreat.resolved_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{selectedThreat.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Source Information</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">IP Address:</span> {selectedThreat.source_ip}
                  </div>
                  {selectedThreat.target_user_id && (
                    <div>
                      <span className="font-medium">Target User:</span> {selectedThreat.target_user_id}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedThreat.indicators.map((indicator, index) => (
                    <Badge key={index} variant="outline">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Metadata</h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <pre>{JSON.stringify(selectedThreat.metadata, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
