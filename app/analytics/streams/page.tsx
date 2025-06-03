import type { Metadata } from "next"
import { StreamAnalyticsClient } from "@/components/analytics/stream-analytics-client"

export const metadata: Metadata = {
  title: "Stream Analytics | RunAsh",
  description: "Comprehensive analytics for your live shopping streams",
}

export default function StreamAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <StreamAnalyticsClient isLive={false} />
      </div>
    </div>
  )
}
