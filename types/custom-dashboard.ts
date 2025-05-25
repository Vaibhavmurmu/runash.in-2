import type React from "react"
export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  description?: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  config: WidgetConfig
}

export type WidgetType =
  | "metric-card"
  | "line-chart"
  | "bar-chart"
  | "pie-chart"
  | "area-chart"
  | "table"
  | "heatmap"
  | "gauge"
  | "timeline"
  | "map"
  | "activity-feed"
  | "top-content"
  | "platform-comparison"
  | "audience-demographics"
  | "revenue-breakdown"
  | "engagement-metrics"
  | "stream-health"
  | "chat-activity"
  | "follower-growth"
  | "custom-metric"

export interface WidgetConfig {
  metric?: string
  metrics?: string[]
  timeRange?: TimeRange
  platform?: string[]
  chartType?: string
  displayType?: string
  filters?: Record<string, any>
  customQuery?: string
  refreshInterval?: number
  color?: string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
}

export interface TimeRange {
  start: string
  end: string
  label: string
  preset?: "today" | "yesterday" | "last7days" | "last30days" | "last90days" | "custom"
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  layout: DashboardLayout
  createdAt: string
  updatedAt: string
  isDefault?: boolean
  isShared?: boolean
  sharedWith?: string[]
  tags?: string[]
}

export interface DashboardLayout {
  cols: number
  rowHeight: number
  maxRows?: number
  compactType?: "vertical" | "horizontal" | null
  preventCollision?: boolean
}

export interface WidgetLibraryItem {
  type: WidgetType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  maxSize?: { w: number; h: number }
  category: WidgetCategory
  configurable: boolean
  premium?: boolean
}

export type WidgetCategory = "metrics" | "charts" | "tables" | "specialized" | "custom"

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  thumbnail?: string
  widgets: Partial<DashboardWidget>[]
  category: "streaming" | "gaming" | "content" | "revenue" | "growth" | "custom"
  isPremium?: boolean
}
