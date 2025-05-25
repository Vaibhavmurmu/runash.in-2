"use client"

import type React from "react"
import { EnhancedSidebar } from "@/components/dashboard/enhanced-sidebar"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { Toaster } from "@/components/ui/sonner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { Suspense } from "react"

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider>
        <EnhancedSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AnalyticsHeader />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              <Suspense>{children}</Suspense>
            </div>
          </main>
          <DashboardFooter />
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" />
    </div>
  )
}
