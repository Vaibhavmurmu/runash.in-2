import type { Metadata } from "next"
import { MultiHostDashboard } from "@/components/streaming/multi-host/multi-host-dashboard"

export const metadata: Metadata = {
  title: "Multi-Host Streaming | RunAsh",
  description: "Collaborate with multiple hosts in your live streams",
}

export default function MultiHostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <MultiHostDashboard />
    </div>
  )
}
