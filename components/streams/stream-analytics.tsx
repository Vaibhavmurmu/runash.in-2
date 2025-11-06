"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts"
import { Badge } from "@/components/ui/badge"

const viewerData = [
  { time: "14:00", viewers: 150, engagement: 65 },
  { time: "14:15", viewers: 280, engagement: 72 },
  { time: "14:30", viewers: 450, engagement: 78 },
  { time: "14:45", viewers: 680, engagement: 85 },
  { time: "15:00", viewers: 920, engagement: 88 },
  { time: "15:15", viewers: 1200, engagement: 92 },
  { time: "15:30", viewers: 1450, engagement: 89 },
  { time: "15:45", viewers: 1680, engagement: 94 },
  { time: "16:00", viewers: 1850, engagement: 91 },
]

const revenueData = [
  { hour: "14:00", revenue: 120 },
  { hour: "15:00", revenue: 340 },
  { hour: "16:00", revenue: 580 },
  { hour: "17:00", revenue: 720 },
  { hour: "18:00", revenue: 890 },
  { hour: "19:00", revenue: 1100 },
]

const chartConfig = {
  viewers: {
    label: "Viewers",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement %",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
}

export function StreamAnalytics() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Viewer Trends</CardTitle>
            <CardDescription>Real-time viewer count and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewerData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-viewers)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-viewers)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="viewers"
                    stroke="var(--color-viewers)"
                    fill="url(#colorViewers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Hour</CardTitle>
            <CardDescription>Hourly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stream Performance Summary</CardTitle>
          <CardDescription>Key metrics from your recent streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-sm text-muted-foreground">Peak Viewers</div>
              <Badge variant="secondary" className="text-xs">
                +15% vs last stream
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">1h 23m</div>
              <div className="text-sm text-muted-foreground">Stream Duration</div>
              <Badge variant="secondary" className="text-xs">
                Optimal length
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">$1,234</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <Badge variant="default" className="text-xs">
                +22% vs last stream
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
              <Badge variant="default" className="text-xs">
                Excellent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
