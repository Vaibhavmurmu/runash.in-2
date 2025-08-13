import type { Metadata } from "next"
import { PerformanceDashboard } from "@/components/admin/performance-dashboard"

export const metadata: Metadata = {
  title: "Performance Dashboard - Admin",
  description: "Monitor system performance and optimize resource usage",
}

export default function PerformancePage() {
  return <PerformanceDashboard />
}
