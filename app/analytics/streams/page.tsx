import type { Metadata } from "next"
import dynamic from "next/dynamic"

// Dynamically import the component to prevent SSR issues
const StreamAnalyticsDashboard = dynamic(
  () =>
    import("@/components/analytics/stream-analytics-dashboard").then((mod) => ({
      default: mod.StreamAnalyticsDashboard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
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
        </div>
      </div>
    ),
  },
)

export const metadata: Metadata = {
  title: "Stream Analytics | RunAsh",
  description: "Comprehensive analytics for your live shopping streams",
}

export default function StreamAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <StreamAnalyticsDashboard isLive={false} />
      </div>
    </div>
  )
}
