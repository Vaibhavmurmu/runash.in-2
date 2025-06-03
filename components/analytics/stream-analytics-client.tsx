"use client"

import dynamic from "next/dynamic"

// Dynamically import the component to prevent SSR issues
const StreamAnalyticsDashboard = dynamic(
  () =>
    import("./stream-analytics-dashboard").then((mod) => ({
      default: mod.StreamAnalyticsDashboard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
)

interface StreamAnalyticsClientProps {
  streamId?: string
  isLive?: boolean
}

export function StreamAnalyticsClient({ streamId, isLive = false }: StreamAnalyticsClientProps) {
  return <StreamAnalyticsDashboard streamId={streamId} isLive={isLive} />
}
