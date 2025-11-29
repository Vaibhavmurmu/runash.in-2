import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RunAsh Blog",
  description: "Deep dives on AI, live streaming, APIs, payments, chat systems, and more — by RunAsh AI.",
  metadataBase: new URL("https://runash.in/blog"),
  openGraph: {
    title: "RunAsh Blog",
    description: "Deep dives on AI, live streaming, APIs, payments, chat systems, and more.",
    url: "https://runash.in/blog",
    siteName: "RunAsh Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunAsh Blog",
    description: "Deep dives on AI, live streaming, APIs, payments, chat systems, and more.",
  },
    generator: 'runash.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
