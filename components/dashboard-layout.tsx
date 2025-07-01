import type React from "react"
import { SidebarTrigger } from "@/components/sidebar-trigger"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, File, BarChart, Settings } from "lucide-react"
import { Search } from "lucide-react"
import { Bell } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen">
      <Sidebar />
      <div className="ml-[260px] h-full">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-primary rounded" />
                <span className="font-semibold">RunAsh</span>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <SearchBar
                onSearch={(query, filters) => {
                  // Navigate to search page with query
                  window.location.href = `/search?q=${encodeURIComponent(query)}`
                }}
                placeholder="Search users, streams, files..."
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User Name</p>
                      <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="container pt-6">{children}</main>
      </div>
    </div>
  )
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Streams",
    href: "/dashboard/streams",
    icon: File,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
]

function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
      <div className="flex items-center gap-2 px-6 pb-4">
        <div className="h-6 w-6 bg-primary rounded" />
        <span className="font-semibold">RunAsh</span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 space-y-2 px-6 py-4">
        {navigationItems.map((item) => (
          <Button variant="ghost" className="flex w-full items-center gap-2 justify-start" key={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}
