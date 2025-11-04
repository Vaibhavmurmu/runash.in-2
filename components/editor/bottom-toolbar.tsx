"use client"

import { Button } from "@/components/ui/button"
import { Download, Share2, Trash2, Copy, MoreHorizontal, Settings } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import MCPDashboard from "./mcp-dashboard"

export default function BottomToolbar() {
  const [showMCPDashboard, setShowMCPDashboard] = useState(false)

  return (
    <>
      <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Frame: <span className="font-semibold text-foreground">1 / 30</span> | Duration:{" "}
          <span className="font-semibold text-foreground">2.5s</span>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Processing</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-[600px] p-6">
              <MCPDashboard />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
