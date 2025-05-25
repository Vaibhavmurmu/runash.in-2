"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Search, Bell, Download, Share2, Calendar, Filter, ChevronDown, HelpCircle, Settings, Plus } from "lucide-react"

export function AnalyticsHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  const handleExport = (format: string) => {
    setIsExportDialogOpen(false)
    toast.success(`Analytics exported as ${format.toUpperCase()}`, {
      description: "Your file is ready to download",
      action: {
        label: "Download",
        onClick: () => console.log("Download clicked"),
      },
    })
  }

  const getPageTitle = () => {
    if (pathname.includes("/analytics/audience")) return "Audience Analytics"
    if (pathname.includes("/analytics/content")) return "Content Analytics"
    if (pathname.includes("/analytics/revenue")) return "Revenue Analytics"
    if (pathname.includes("/analytics/platforms")) return "Platform Analytics"
    if (pathname.includes("/analytics/engagement")) return "Engagement Analytics"
    return "Analytics Dashboard"
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
              <Badge
                variant="outline"
                className="ml-2 hidden md:flex bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
              >
                Pro
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] lg:w-[300px] bg-muted/50 border-border/40"
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                      3
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>Stay updated with your analytics alerts</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                        <TrendingUpIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Viewer spike detected</h4>
                        <p className="text-sm text-muted-foreground">
                          Your stream saw a 45% increase in viewers in the last hour
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                        <DollarSignIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Revenue goal reached</h4>
                        <p className="text-sm text-muted-foreground">
                          You've reached your monthly revenue goal of $1,000
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                        <UsersIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">New subscriber milestone</h4>
                        <p className="text-sm text-muted-foreground">You've reached 1,000 subscribers!</p>
                        <p className="mt-1 text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Analytics</DialogTitle>
                    <DialogDescription>Choose a format to export your analytics data</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-6"
                      onClick={() => handleExport("csv")}
                    >
                      <FileSpreadsheetIcon className="h-8 w-8 text-green-600" />
                      <span className="font-medium">CSV</span>
                      <span className="text-xs text-muted-foreground">Spreadsheet format</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-6"
                      onClick={() => handleExport("pdf")}
                    >
                      <FileTextIcon className="h-8 w-8 text-red-600" />
                      <span className="font-medium">PDF</span>
                      <span className="text-xs text-muted-foreground">Document format</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-6"
                      onClick={() => handleExport("json")}
                    >
                      <FileCodeIcon className="h-8 w-8 text-blue-600" />
                      <span className="font-medium">JSON</span>
                      <span className="text-xs text-muted-foreground">Data format</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 h-auto p-6"
                      onClick={() => handleExport("image")}
                    >
                      <ImageIcon className="h-8 w-8 text-purple-600" />
                      <span className="font-medium">Image</span>
                      <span className="text-xs text-muted-foreground">PNG format</span>
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="icon" className="md:hidden">
                <Search className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" className="md:hidden">
                <Download className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Analytics Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Configure Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Analytics Help
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className="hidden md:flex bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md"
                onClick={() => {
                  toast.success("Custom report created", {
                    description: "Your new report has been added to the dashboard",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs defaultValue="overview" className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Icons
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  )
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

function FileSpreadsheetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M14 13h2" />
      <path d="M14 17h2" />
    </svg>
  )
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function FileCodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  )
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
