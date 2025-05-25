"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
import type { DashboardWidget } from "@/types/custom-dashboard"
import { ArrowUpRight, ArrowDownRight, Users, Eye, MessageSquare, DollarSign, TrendingUp } from "lucide-react"

interface WidgetRendererProps {
  widget: DashboardWidget
  isEditMode?: boolean
}

export function WidgetRenderer({ widget, isEditMode }: WidgetRendererProps) {
  // Mock data - in a real app, this would come from the widget config and API
  const mockLineData = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 180 },
    { name: "Wed", value: 150 },
    { name: "Thu", value: 220 },
    { name: "Fri", value: 280 },
    { name: "Sat", value: 320 },
    { name: "Sun", value: 290 },
  ]

  const mockPieData = [
    { name: "Twitch", value: 45, color: "#9146FF" },
    { name: "YouTube", value: 30, color: "#FF0000" },
    { name: "Facebook", value: 15, color: "#1877F2" },
    { name: "TikTok", value: 10, color: "#000000" },
  ]

  const mockBarData = [
    { name: "Gaming", value: 450 },
    { name: "Just Chatting", value: 380 },
    { name: "Music", value: 220 },
    { name: "Creative", value: 180 },
    { name: "IRL", value: 150 },
  ]

  const renderMetricCard = () => {
    const metrics = {
      viewers: { icon: Eye, value: "5,273", change: 12.5, label: "Total Viewers" },
      followers: { icon: Users, value: "1,856", change: 18.2, label: "New Followers" },
      engagement: { icon: MessageSquare, value: "8.7%", change: 3.2, label: "Engagement Rate" },
      revenue: { icon: DollarSign, value: "$9,624", change: 22.5, label: "Revenue" },
    }

    const metric = metrics[widget.config.metric as keyof typeof metrics] || metrics.viewers

    return (
      <>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
          <metric.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric.value}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {metric.change > 0 ? (
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
            )}
            <span className={metric.change > 0 ? "text-emerald-500" : "text-rose-500"}>{Math.abs(metric.change)}%</span>
            <span className="ml-1">from last period</span>
          </div>
        </CardContent>
      </>
    )
  }

  const renderLineChart = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-full min-h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </>
  )

  const renderBarChart = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-full min-h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </>
  )

  const renderPieChart = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {mockPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </>
  )

  const renderAreaChart = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-full min-h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </>
  )

  const renderActivityFeed = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Viewer spike detected</p>
              <p className="text-xs text-muted-foreground">45% increase in the last hour</p>
            </div>
            <span className="text-xs text-muted-foreground">2h ago</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New subscriber</p>
              <p className="text-xs text-muted-foreground">JohnDoe123 subscribed</p>
            </div>
            <span className="text-xs text-muted-foreground">3h ago</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Follower milestone</p>
              <p className="text-xs text-muted-foreground">Reached 1,000 followers!</p>
            </div>
            <span className="text-xs text-muted-foreground">5h ago</span>
          </div>
        </div>
      </CardContent>
    </>
  )

  const renderDefault = () => (
    <>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
        {widget.description && <CardDescription>{widget.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-full min-h-[100px] text-muted-foreground">
          {isEditMode ? (
            <p className="text-sm">Configure this widget to display data</p>
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
      </CardContent>
    </>
  )

  const renderWidget = () => {
    switch (widget.type) {
      case "metric-card":
      case "custom-metric":
        return renderMetricCard()
      case "line-chart":
        return renderLineChart()
      case "bar-chart":
        return renderBarChart()
      case "pie-chart":
        return renderPieChart()
      case "area-chart":
        return renderAreaChart()
      case "activity-feed":
        return renderActivityFeed()
      default:
        return renderDefault()
    }
  }

  return renderWidget()
}
