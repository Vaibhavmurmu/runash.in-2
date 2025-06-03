"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Download } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function MultiHostAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  // Mock data for analytics
  const sessionData = [
    { date: "2024-01-01", sessions: 5, totalHosts: 12, avgDuration: 45 },
    { date: "2024-01-02", sessions: 8, totalHosts: 18, avgDuration: 52 },
    { date: "2024-01-03", sessions: 6, totalHosts: 15, avgDuration: 38 },
    { date: "2024-01-04", sessions: 12, totalHosts: 25, avgDuration: 67 },
    { date: "2024-01-05", sessions: 9, totalHosts: 20, avgDuration: 55 },
    { date: "2024-01-06", sessions: 15, totalHosts: 32, avgDuration: 72 },
    { date: "2024-01-07", sessions: 11, totalHosts: 24, avgDuration: 48 },
  ]

  const engagementData = [
    { time: "00:00", viewers: 120, messages: 45, likes: 23 },
    { time: "05:00", viewers: 180, messages: 67, likes: 34 },
    { time: "10:00", viewers: 250, messages: 89, likes: 56 },
    { time: "15:00", viewers: 320, messages: 124, likes: 78 },
    { time: "20:00", viewers: 280, messages: 98, likes: 65 },
    { time: "25:00", viewers: 380, messages: 156, likes: 92 },
    { time: "30:00", viewers: 420, messages: 189, likes: 112 },
  ]

  const hostPerformanceData = [
    { name: "Primary Host", sessions: 15, avgViewers: 320, engagement: 85 },
    { name: "Co-Host A", sessions: 8, avgViewers: 180, engagement: 72 },
    { name: "Co-Host B", sessions: 6, avgViewers: 150, engagement: 68 },
    { name: "Guest Host", sessions: 3, avgViewers: 90, engagement: 45 },
  ]

  const roleDistribution = [
    { name: "Primary", value: 25, color: "#f59e0b" },
    { name: "Co-Host", value: 45, color: "#3b82f6" },
    { name: "Guest", value: 20, color: "#10b981" },
    { name: "Moderator", value: 10, color: "#8b5cf6" },
  ]

  const collaborationMetrics = [
    { metric: "Total Sessions", value: "156", change: "+12%", trend: "up" },
    { metric: "Unique Hosts", value: "48", change: "+8%", trend: "up" },
    { metric: "Avg Session Duration", value: "52m", change: "+15%", trend: "up" },
    { metric: "Host Retention Rate", value: "78%", change: "+5%", trend: "up" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Host Analytics</h2>
          <p className="text-muted-foreground">Track collaboration performance and engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {collaborationMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  <TrendingUp className="h-4 w-4" />
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Session Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="hosts">Host Performance</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Host Sessions Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sessions" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="totalHosts" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="avgDuration" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Engagement During Multi-Host Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="viewers" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Host Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hostPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgViewers" fill="#f59e0b" />
                    <Bar dataKey="engagement" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Host Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Host Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Host Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostPerformanceData.map((host, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white font-medium">
                        {host.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{host.name}</p>
                        <p className="text-sm text-muted-foreground">{host.sessions} sessions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Viewers</p>
                        <p className="font-medium">{host.avgViewers}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <Badge
                          variant="outline"
                          className={
                            host.engagement > 70 ? "text-green-700 border-green-200" : "text-amber-700 border-amber-200"
                          }
                        >
                          {host.engagement}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Active Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sarah Wilson</span>
                    <Badge variant="outline">12 sessions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">John Doe</span>
                    <Badge variant="outline">8 sessions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mike Chen</span>
                    <Badge variant="outline">6 sessions</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Best Performing Pairs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">You + Sarah</span>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      95% engagement
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">You + John</span>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      87% engagement
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sarah + Mike</span>
                    <Badge variant="outline" className="text-amber-700 border-amber-200">
                      72% engagement
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Collaboration Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Multi-host sessions get 2.3x more engagement</p>
                  <p>• Best time for collaboration: 2-4 PM</p>
                  <p>• Optimal session length: 45-60 minutes</p>
                  <p>• 3-host sessions perform best</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
