"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { DashboardTemplate } from "@/types/custom-dashboard"

interface DashboardTemplatesProps {
  onLoadTemplate: (template: DashboardTemplate) => void
}

export function DashboardTemplates({ onLoadTemplate }: DashboardTemplatesProps) {
  const templates: DashboardTemplate[] = [
    {
      id: "streaming-overview",
      name: "Streaming Overview",
      description: "Essential metrics for streamers",
      category: "streaming",
      widgets: [
        {
          type: "metric-card",
          title: "Total Viewers",
          x: 0,
          y: 0,
          w: 3,
          h: 2,
          config: { metric: "viewers" },
        },
        {
          type: "metric-card",
          title: "Engagement Rate",
          x: 3,
          y: 0,
          w: 3,
          h: 2,
          config: { metric: "engagement" },
        },
        {
          type: "metric-card",
          title: "New Followers",
          x: 6,
          y: 0,
          w: 3,
          h: 2,
          config: { metric: "followers" },
        },
        {
          type: "metric-card",
          title: "Revenue",
          x: 9,
          y: 0,
          w: 3,
          h: 2,
          config: { metric: "revenue" },
        },
        {
          type: "line-chart",
          title: "Viewer Trends",
          x: 0,
          y: 2,
          w: 6,
          h: 4,
          config: {},
        },
        {
          type: "pie-chart",
          title: "Platform Distribution",
          x: 6,
          y: 2,
          w: 6,
          h: 4,
          config: {},
        },
      ],
    },
    {
      id: "content-creator",
      name: "Content Creator",
      description: "Focus on content performance",
      category: "content",
      widgets: [
        {
          type: "bar-chart",
          title: "Content Performance",
          x: 0,
          y: 0,
          w: 8,
          h: 4,
          config: {},
        },
        {
          type: "activity-feed",
          title: "Recent Activity",
          x: 8,
          y: 0,
          w: 4,
          h: 4,
          config: {},
        },
        {
          type: "top-content",
          title: "Top Performing Content",
          x: 0,
          y: 4,
          w: 6,
          h: 4,
          config: {},
        },
        {
          type: "engagement-metrics",
          title: "Engagement Analysis",
          x: 6,
          y: 4,
          w: 6,
          h: 4,
          config: {},
        },
      ],
    },
    {
      id: "revenue-focused",
      name: "Revenue Dashboard",
      description: "Track income and monetization",
      category: "revenue",
      widgets: [
        {
          type: "metric-card",
          title: "Total Revenue",
          x: 0,
          y: 0,
          w: 4,
          h: 2,
          config: { metric: "revenue" },
        },
        {
          type: "revenue-breakdown",
          title: "Revenue Sources",
          x: 4,
          y: 0,
          w: 4,
          h: 4,
          config: {},
        },
        {
          type: "area-chart",
          title: "Revenue Trends",
          x: 8,
          y: 0,
          w: 4,
          h: 4,
          config: {},
        },
        {
          type: "bar-chart",
          title: "Platform Revenue",
          x: 0,
          y: 2,
          w: 4,
          h: 4,
          config: {},
        },
      ],
    },
    {
      id: "growth-analytics",
      name: "Growth Analytics",
      description: "Monitor audience growth",
      category: "growth",
      widgets: [
        {
          type: "follower-growth",
          title: "Follower Growth",
          x: 0,
          y: 0,
          w: 6,
          h: 4,
          config: {},
        },
        {
          type: "audience-demographics",
          title: "Audience Demographics",
          x: 6,
          y: 0,
          w: 6,
          h: 4,
          config: {},
        },
        {
          type: "platform-comparison",
          title: "Platform Growth",
          x: 0,
          y: 4,
          w: 12,
          h: 4,
          config: {},
        },
      ],
    },
  ]

  return (
    <>
      {templates.map((template) => (
        <DropdownMenuItem key={template.id} onClick={() => onLoadTemplate(template)}>
          <div>
            <div className="font-medium">{template.name}</div>
            <div className="text-xs text-muted-foreground">{template.description}</div>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  )
}
