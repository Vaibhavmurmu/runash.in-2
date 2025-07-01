"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarTrigger() {
  return (
    <Button variant="ghost" size="sm" className="md:hidden">
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}
