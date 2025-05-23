"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap } from "lucide-react"

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by the RunAsh team</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              v2.1.0
            </Badge>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help Center
            </Link>
            <Link href="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
              API Docs
            </Link>
            <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">
              Status
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
