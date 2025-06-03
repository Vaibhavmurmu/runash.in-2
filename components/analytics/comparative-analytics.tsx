"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Clock } from "lucide-react"

export function ComparativeAnalytics() {
  const [comparisonType, setComparisonType] = useState("periods")
  const [selectedMetric, setSelectedMetric] = useState("viewers")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for different comparison types
  const periodComparison = [
    { name: "Week 1", current: 1200, previous: 980, industry: 1100 },
    { name: "Week 2", current: 1350, previous: 1100, industry: 1150 },
    { name: "Week 3", current: 1180, previous: 1250, industry: 1200 },
    { name: "Week 4", current: 1420, previous: 1180, industry: 1250 },
  ]

  const streamComparison = [
    { name: "Stream A", viewers: 1200, revenue: 2400, engagement: 7.2 },
    { name: "Stream B", viewers: 980, revenue: 1800, engagement: 8.1 },
    { name: "Stream C", viewers: 1350, revenue: 2800, engagement: 6.9 },
    { name: "Stream D", viewers: 1180, revenue: 2200, engagement: 7.8 },
  ]

  const competitorData = [
    { name: "Your Stream", viewers: 1200, engagement: 7.2, revenue: 2400 },
    { name: "Competitor A", viewers: 1450, engagement: 6.8, revenue: 2200 },
    { name: "Competitor B", viewers: 980, engagement: 8.1, revenue: 1900 },
    { name: "Industry Avg", viewers: 1150, engagement: 7.0, revenue: 2100 },
  ]

  const getPerformanceIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: change.toFixed(1),
      trend: change >= 0 ? "up" : "down",
      color: change >= 0 ? "text-green-600" : "text-red-600",
      icon: change >= 0 ? TrendingUp : TrendingDown,
    }
  }

  const metrics = [
    { id: "viewers", label: "Viewers", icon: Users },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "engagement", label: "Engagement", icon: TrendingUp },
    { id: "watchTime", label: "Watch Time", icon: Clock },
  ]

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comparison Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Comparative Analysis</CardTitle>
          <CardDescription>Compare your performance across different dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Compare by:</label>
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periods">Time Periods</SelectItem>
                  <SelectItem value="streams">Individual Streams</SelectItem>
                  <SelectItem value="competitors">Competitors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Metric:</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={comparisonType} onValueChange={setComparisonType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="periods">Time Periods</TabsTrigger>
          <TabsTrigger value="streams">Individual Streams</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="periods" className="space-y-6">
          {/* Period Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Period-over-Period Comparison</CardTitle>
              <CardDescription>
                Compare current performance with previous periods and industry benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={periodComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="#f97316" strokeWidth={3} name="Current Period" />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke="#6b7280"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previous Period"
                    />
                    <Line type="monotone" dataKey="industry" stroke="#3b82f6" strokeWidth={2} name="Industry Average" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "Viewers", current: 1200, previous: 1080 },
              { title: "Revenue", current: 2400, previous: 2100 },
              { title: "Engagement", current: 7.2, previous: 6.8 },
              { title: "Watch Time", current: 8.5, previous: 7.9 },
            ].map((metric, index) => {
              const indicator = getPerformanceIndicator(metric.current, metric.previous)
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.current}</p>
                        <div className={`flex items-center text-sm ${indicator.color}`}>
                          <indicator.icon className="h-4 w-4 mr-1" />
                          {indicator.value}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          {/* Stream Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Performance Comparison</CardTitle>
              <CardDescription>Compare performance across your recent streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streamComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="viewers" fill="#f97316" name="Viewers" />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                    <Bar dataKey="engagement" fill="#10b981" name="Engagement (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Best Performing Stream */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Stream</CardTitle>
              <CardDescription>Your best stream from the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Stream C - Holiday Special</h4>
                  <p className="text-sm text-muted-foreground">December 15, 2024</p>
                </div>
                <div className="flex space-x-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-500">1,350</div>
                    <div className="text-xs text-muted-foreground">Viewers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">$2,800</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">6.9%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Competitor Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>See how you stack up against competitors and industry averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="viewers" fill="#f97316" name="Viewers" />
                    <Bar dataKey="engagement" fill="#3b82f6" name="Engagement (%)" />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Strengths</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Higher engagement than Competitor A</li>
                  <li>• Above industry average revenue</li>
                  <li>• Consistent viewer growth</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Areas for Improvement</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Lower viewer count than Competitor A</li>
                  <li>• Engagement below Competitor B</li>
                  <li>• Room for revenue optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Market Position</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Market Rank</span>
                    <Badge variant="secondary">#2</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Growth Rate</span>
                    <Badge variant="outline" className="text-green-600">
                      +23%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
