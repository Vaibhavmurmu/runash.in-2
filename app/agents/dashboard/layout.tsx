import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/auth/auth-provider"
import { NextAuthSessionProvider } from "@/components/auth/session-provider"
import { BrandProvider } from "@/components/branding/brand-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RunAsh AI Agents - Live Streaming & Product Automation",
  description: "Modern AI-powered dashboard for live streaming retailing and organic product automation workflows",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* Single source of truth for providers */}
          <NextAuthSessionProvider>
            <AuthProvider>
              <BrandProvider>
                {/* Keep shadcn/ui Sidebar context at root for stable usage across pages */}
                <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
              </BrandProvider>
            </AuthProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
