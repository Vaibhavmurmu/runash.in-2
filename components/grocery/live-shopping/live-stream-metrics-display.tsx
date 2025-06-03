"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, MessageCircle, ShoppingCart, Eye, Clock, DollarSign, Activity } from "lucide-react"
import type { LiveStreamStats } from "@/types/live-shopping"

interface LiveStreamMetricsDisplayProps {
  stats: LiveStreamStats
}

export default function LiveStreamMetricsDisplay({ stats }: LiveStreamMetricsDisplayProps) {
  const metrics = [
    {
      label: "Current Viewers",
      value: stats.viewerCount.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Peak Viewers",
      value: stats.peakViewers.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Chat Messages",
      value: stats.chatMessages.toLocaleString(),
      icon: MessageCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Purchases",
      value: stats.purchases.toString(),
      icon: ShoppingCart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Avg Watch Time",
      value: `${stats.averageWatchTime}m`,
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Engagement",
      value: `${(stats.engagementRate * 100).toFixed(0)}%`,
      icon: Activity,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${metric.bgColor} mb-2`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{metric.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
              </div>
            )
          })}
        </div>

        {/* Performance Indicators */}
        <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t">
          <Badge
            variant="secondary"
            className={`${
              stats.engagementRate > 0.7
                ? "bg-green-100 text-green-700"
                : stats.engagementRate > 0.5
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {stats.engagementRate > 0.7 ? "High" : stats.engagementRate > 0.5 ? "Medium" : "Low"} Engagement
          </Badge>

          <Badge
            variant="secondary"
            className={`${
              stats.viewerCount > stats.peakViewers * 0.8 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {stats.viewerCount > stats.peakViewers * 0.8 ? "Peak Performance" : "Growing Audience"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
