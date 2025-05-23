"use client"

import { EnhancedSidebar } from "@/components/dashboard/enhanced-sidebar"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/20">
        <EnhancedSidebar />
        <SidebarInset className="flex-1">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <EnhancedDashboard />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
