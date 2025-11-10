"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Overview", href: "#overview" },
    { label: "Streams", href: "#streams" },
    { label: "Products", href: "#products" },
    { label: "Orders", href: "#orders" },
    { label: "Analytics", href: "#analytics" },
    { label: "Profile", href: "#profile" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="space-y-4 mt-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
