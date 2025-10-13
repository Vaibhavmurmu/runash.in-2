import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "@/components/providers"
import { Suspense } from "react"
import { CookieConsent } from "@/components/cookie-consent"
import { Banner} from "@/components/banner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "RunAsh AI - Agentic live commerce",
  description: "RunAsh AI is an live stream video generation model, creating realistic video from text, organic products, sustainable living, recipes, and retail automation",
  generator: "RunAsh AI Lab",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
            {/* Cookie consent dialog */}
            <CookieConsent />
            
            <Toaster />
          </Providers>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
