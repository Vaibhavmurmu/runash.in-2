"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DashboardWidget, WidgetLibraryItem, WidgetCategory } from "@/types/custom-dashboard"
import {
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Zap,
  Globe,
  Heart,
  Calendar,
  Map,
  Table,
  Gauge,
  Crown,
  Search,
} from "lucide-react"

interface WidgetLibraryProps {
  onAddWidget: (widget: Partial<DashboardWidget>) => void
}

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | "all">("all")

  const widgetLibrary: WidgetLibraryItem[] = [
    // Metrics
    {
      type: "metric-card",
      title: "Metric Card",
      description: "Display a single metric with trend",
      icon: TrendingUp,
      defaultSize: { w: 3, h: 2 },
      minSize: { w: 2, h: 2 },
      category: "metrics",
      configurable: true,
    },
    {
      type: "custom-metric",
      title: "Custom Metric",
      description: "Create your own metric display",
      icon: Zap,
      defaultSize: { w: 3, h: 2 },
      minSize: { w: 2, h: 2 },
      category: "metrics",
      configurable: true,
    },
    // Charts
    {
      type: "line-chart",
      title: "Line Chart",
      description: "Visualize trends over time",
      icon: LineChart,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "charts",
      configurable: true,
    },
    {
      type: "bar-chart",
      title: "Bar Chart",
      description: "Compare values across categories",
      icon: BarChart3,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "charts",
      configurable: true,
    },
    {
      type: "pie-chart",
      title: "Pie Chart",
      description: "Show distribution of values",
      icon: PieChart,
      defaultSize: { w: 4, h: 4 },
      minSize: { w: 3, h: 3 },
      category: "charts",
      configurable: true,
    },
    {
      type: "area-chart",
      title: "Area Chart",
      description: "Visualize cumulative trends",
      icon: Activity,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "charts",
      configurable: true,
    },
    {
      type: "gauge",
      title: "Gauge Chart",
      description: "Show progress towards a goal",
      icon: Gauge,
      defaultSize: { w: 3, h: 3 },
      minSize: { w: 3, h: 3 },
      category: "charts",
      configurable: true,
      premium: true,
    },
    {
      type: "heatmap",
      title: "Heatmap",
      description: "Visualize data density",
      icon: Map,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "charts",
      configurable: true,
      premium: true,
    },
    // Tables
    {
      type: "table",
      title: "Data Table",
      description: "Display tabular data",
      icon: Table,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "tables",
      configurable: true,
    },
    {
      type: "activity-feed",
      title: "Activity Feed",
      description: "Recent events and activities",
      icon: Activity,
      defaultSize: { w: 4, h: 5 },
      minSize: { w: 3, h: 3 },
      category: "tables",
      configurable: true,
    },
    // Specialized
    {
      type: "platform-comparison",
      title: "Platform Comparison",
      description: "Compare metrics across platforms",
      icon: Globe,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "audience-demographics",
      title: "Audience Demographics",
      description: "Viewer age, gender, and location",
      icon: Users,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "revenue-breakdown",
      title: "Revenue Breakdown",
      description: "Income sources and trends",
      icon: DollarSign,
      defaultSize: { w: 4, h: 4 },
      minSize: { w: 3, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "engagement-metrics",
      title: "Engagement Metrics",
      description: "Chat activity and interactions",
      icon: MessageSquare,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "stream-health",
      title: "Stream Health",
      description: "Technical performance metrics",
      icon: Activity,
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "chat-activity",
      title: "Chat Activity",
      description: "Real-time chat metrics",
      icon: MessageSquare,
      defaultSize: { w: 4, h: 4 },
      minSize: { w: 3, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "follower-growth",
      title: "Follower Growth",
      description: "Track follower trends",
      icon: Heart,
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 3, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "top-content",
      title: "Top Content",
      description: "Best performing streams",
      icon: TrendingUp,
      defaultSize: { w: 4, h: 4 },
      minSize: { w: 3, h: 3 },
      category: "specialized",
      configurable: true,
    },
    {
      type: "timeline",
      title: "Event Timeline",
      description: "Chronological event display",
      icon: Calendar,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
      category: "specialized",
      configurable: true,
      premium: true,
    },
    {
      type: "map",
      title: "Geographic Map",
      description: "Viewer locations on a map",
      icon: Map,
      defaultSize: { w: 6, h: 5 },
      minSize: { w: 4, h: 4 },
      category: "specialized",
      configurable: true,
      premium: true,
    },
  ]

  const filteredWidgets = widgetLibrary.filter((widget) => {
    const matchesSearch =
      widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories: { value: WidgetCategory | "all"; label: string }[] = [
    { value: "all", label: "All Widgets" },
    { value: "metrics", label: "Metrics" },
    { value: "charts", label: "Charts" },
    { value: "tables", label: "Tables" },
    { value: "specialized", label: "Specialized" },
  ]

  return (
    <div className="space-y-4 mt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as WidgetCategory | "all")}>
        <TabsList className="grid grid-cols-5 w-full">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4">
              {filteredWidgets.map((widget) => (
                <div
                  key={widget.type}
                  className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="rounded-lg bg-muted p-3">
                    <widget.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{widget.title}</h4>
                      {widget.premium && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown className="h-3 w-3" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{widget.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Size: {widget.defaultSize.w}x{widget.defaultSize.h}
                      </span>
                      {widget.configurable && (
                        <>
                          <span>•</span>
                          <span>Configurable</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      onAddWidget({
                        type: widget.type,
                        title: widget.title,
                        w: widget.defaultSize.w,
                        h: widget.defaultSize.h,
                        minW: widget.minSize.w,
                        minH: widget.minSize.h,
                        config: {},
                      })
                    }
                    disabled={widget.premium}
                  >
                    {widget.premium ? "Upgrade" : "Add"}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
