"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ArrowUpRight,
  Info,
  Download,
  Zap,
  Bell,
  Eye,
  MessageSquare,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  Calendar,
  ChevronRight,
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for charts
  const overviewData = [
    { date: "Jan", viewers: 1200, followers: 450, revenue: 2500 },
    { date: "Feb", viewers: 1800, followers: 590, revenue: 3200 },
    { date: "Mar", viewers: 2200, followers: 750, revenue: 4100 },
    { date: "Apr", viewers: 2600, followers: 890, revenue: 4800 },
    { date: "May", viewers: 3100, followers: 1020, revenue: 5500 },
    { date: "Jun", viewers: 2800, followers: 980, revenue: 5200 },
    { date: "Jul", viewers: 3300, followers: 1150, revenue: 6100 },
    { date: "Aug", viewers: 3800, followers: 1280, revenue: 6800 },
    { date: "Sep", viewers: 4200, followers: 1400, revenue: 7500 },
    { date: "Oct", viewers: 4600, followers: 1550, revenue: 8200 },
    { date: "Nov", viewers: 5000, followers: 1700, revenue: 8900 },
    { date: "Dec", viewers: 5500, followers: 1850, revenue: 9600 },
  ]

  const platformData = [
    { name: "Twitch", value: 45, color: "#9146FF" },
    { name: "YouTube", value: 30, color: "#FF0000" },
    { name: "Facebook", value: 15, color: "#1877F2" },
    { name: "TikTok", value: 10, color: "#000000" },
  ]

  const contentData = [
    { name: "Gaming", views: 4500, engagement: 8.2 },
    { name: "Just Chatting", views: 3800, engagement: 7.5 },
    { name: "Music", views: 2200, engagement: 6.8 },
    { name: "Creative", views: 1800, engagement: 5.9 },
    { name: "IRL", views: 1500, engagement: 6.2 },
  ]

  const audienceData = [
    { name: "18-24", male: 28, female: 22 },
    { name: "25-34", male: 32, female: 27 },
    { name: "35-44", male: 15, female: 18 },
    { name: "45-54", male: 6, female: 10 },
    { name: "55+", male: 4, female: 8 },
  ]

  const revenueData = [
    { name: "Subscriptions", value: 45, color: "#3b82f6" },
    { name: "Donations", value: 25, color: "#f97316" },
    { name: "Ads", value: 20, color: "#84cc16" },
    { name: "Sponsorships", value: 10, color: "#8b5cf6" },
  ]

  const engagementData = [
    { time: "9 AM", chatActivity: 120, viewers: 450 },
    { time: "10 AM", chatActivity: 180, viewers: 520 },
    { time: "11 AM", chatActivity: 240, viewers: 580 },
    { time: "12 PM", chatActivity: 280, viewers: 620 },
    { time: "1 PM", chatActivity: 310, viewers: 680 },
    { time: "2 PM", chatActivity: 350, viewers: 720 },
    { time: "3 PM", chatActivity: 410, viewers: 780 },
    { time: "4 PM", chatActivity: 460, viewers: 850 },
    { time: "5 PM", chatActivity: 520, viewers: 920 },
    { time: "6 PM", chatActivity: 580, viewers: 980 },
    { time: "7 PM", chatActivity: 620, viewers: 1050 },
    { time: "8 PM", chatActivity: 650, viewers: 1100 },
    { time: "9 PM", chatActivity: 620, viewers: 1050 },
    { time: "10 PM", chatActivity: 580, viewers: 980 },
    { time: "11 PM", chatActivity: 520, viewers: 900 },
  ]

  const insightCards = [
    {
      title: "Viewer Peak",
      description: "Your highest viewer count was at 8 PM with 1,100 viewers",
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Content Performance",
      description: "Gaming content has 22% higher engagement than other categories",
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Revenue Opportunity",
      description: "Adding channel memberships could increase revenue by 15%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Audience Growth",
      description: "Your audience grew 18% faster this month compared to last month",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      {isLoading ? (
        <AnalyticsSkeletonLoader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights for your streaming performance across all platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Alert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create Performance Alert</AlertDialogTitle>
                    <AlertDialogDescription>
                      Get notified when your stream metrics reach specific thresholds or show unusual patterns.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Metric:</span>
                      <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Viewers</option>
                        <option>Engagement</option>
                        <option>Revenue</option>
                        <option>Followers</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Condition:</span>
                      <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Above threshold</option>
                        <option>Below threshold</option>
                        <option>Percentage increase</option>
                        <option>Percentage decrease</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="col-span-1 text-sm">Value:</span>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Enter value"
                        type="number"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        toast.success("Alert created successfully", {
                          description: "You'll be notified when the conditions are met",
                        })
                      }}
                    >
                      Create Alert
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Report
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Schedule Analytics Report</DrawerTitle>
                    <DrawerDescription>Set up recurring analytics reports delivered to your email</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Name</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Monthly Performance Summary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Frequency</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option selected>Monthly</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Recipients</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Format</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>PDF</option>
                        <option>CSV</option>
                        <option>Excel</option>
                      </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={() => {
                          toast.success("Report scheduled", {
                            description: "Your monthly report has been scheduled",
                          })
                        }}
                      >
                        Schedule Report
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                    toast.success("Analytics refreshed", {
                      description: "Your analytics data has been updated",
                    })
                  }, 1500)
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,273</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">12.5%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">3.2%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,856</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">18.2%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$9,624</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">22.5%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>Viewers, followers, and revenue over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">About this chart</h4>
                            <p className="text-sm text-muted-foreground">
                              This chart shows your key performance metrics over the past year. Use it to identify
                              trends and seasonal patterns in your streaming performance.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ChartContainer
                      config={{
                        viewers: {
                          label: "Viewers",
                          color: "hsl(var(--chart-1))",
                        },
                        followers: {
                          label: "Followers",
                          color: "hsl(var(--chart-2))",
                        },
                        revenue: {
                          label: "Revenue ($)",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={overviewData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="viewers"
                            name="viewers"
                            stroke="var(--color-viewers)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="followers"
                            name="followers"
                            stroke="var(--color-followers)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            name="revenue"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Distribution</CardTitle>
                    <CardDescription>Viewer distribution across platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                    <CardDescription>Views and engagement by content category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          views: {
                            label: "Views",
                            color: "hsl(var(--chart-1))",
                          },
                          engagement: {
                            label: "Engagement Rate (%)",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={contentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              yAxisId="left"
                              dataKey="views"
                              name="views"
                              fill="var(--color-views)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              yAxisId="right"
                              dataKey="engagement"
                              name="engagement"
                              fill="var(--color-engagement)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {insightCards.map((card, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-full p-2 ${card.bgColor}`}>
                          <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                      <div className="mt-2">
                        <Button variant="link" className="h-auto p-0 text-sm" asChild>
                          <div className="flex items-center">
                            <span>View details</span>
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Performance metrics across streaming platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-[#9146FF] mr-2"></div>
                          <h3 className="font-medium">Twitch</h3>
                        </div>
                        <Badge variant="outline">Primary</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Viewers</div>
                          <div className="text-xl font-bold">2,375</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            15.3%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Followers</div>
                          <div className="text-xl font-bold">835</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            22.7%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold">$4,320</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            18.5%
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-[#FF0000] mr-2"></div>
                          <h3 className="font-medium">YouTube</h3>
                        </div>
                        <Badge variant="outline">Secondary</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Viewers</div>
                          <div className="text-xl font-bold">1,582</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            12.8%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Followers</div>
                          <div className="text-xl font-bold">557</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            16.2%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold">$2,880</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            14.3%
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-[#1877F2] mr-2"></div>
                          <h3 className="font-medium">Facebook</h3>
                        </div>
                        <Badge variant="outline">Tertiary</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Viewers</div>
                          <div className="text-xl font-bold">790</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            8.5%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Followers</div>
                          <div className="text-xl font-bold">278</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            11.2%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold">$1,440</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            9.7%
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-black mr-2"></div>
                          <h3 className="font-medium">TikTok</h3>
                        </div>
                        <Badge variant="outline">New</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Viewers</div>
                          <div className="text-xl font-bold">526</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            32.5%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Followers</div>
                          <div className="text-xl font-bold">186</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            28.7%
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold">$960</div>
                          <div className="flex items-center text-xs text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            35.2%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Analytics</CardTitle>
                  <CardDescription>Performance metrics by content type and category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          views: {
                            label: "Views",
                            color: "hsl(var(--chart-1))",
                          },
                          engagement: {
                            label: "Engagement Rate (%)",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={contentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              yAxisId="left"
                              dataKey="views"
                              name="views"
                              fill="var(--color-views)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              yAxisId="right"
                              dataKey="engagement"
                              name="engagement"
                              fill="var(--color-engagement)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Top Performing Content</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="h-16 w-24 rounded-md bg-muted"></div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Epic Boss Fight in Elden Ring</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="mr-1 h-3 w-3" />
                              8,245 views
                              <Separator orientation="vertical" className="mx-2 h-3" />
                              <MessageSquare className="mr-1 h-3 w-3" />
                              432 comments
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-1">
                                Gaming
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                9.2% engagement
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="h-16 w-24 rounded-md bg-muted"></div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Q&A: My Streaming Setup Revealed</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="mr-1 h-3 w-3" />
                              7,128 views
                              <Separator orientation="vertical" className="mx-2 h-3" />
                              <MessageSquare className="mr-1 h-3 w-3" />
                              385 comments
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-1">
                                Just Chatting
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                8.7% engagement
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="h-16 w-24 rounded-md bg-muted"></div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Live Piano Requests & Chill</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="mr-1 h-3 w-3" />
                              6,542 views
                              <Separator orientation="vertical" className="mx-2 h-3" />
                              <MessageSquare className="mr-1 h-3 w-3" />
                              328 comments
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-1">
                                Music
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                8.1% engagement
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="h-16 w-24 rounded-md bg-muted"></div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Digital Art: Character Design</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="mr-1 h-3 w-3" />
                              5,876 views
                              <Separator orientation="vertical" className="mx-2 h-3" />
                              <MessageSquare className="mr-1 h-3 w-3" />
                              295 comments
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-1">
                                Creative
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                7.8% engagement
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Age, gender, and location breakdown of your viewers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          male: {
                            label: "Male",
                            color: "hsl(var(--chart-1))",
                          },
                          female: {
                            label: "Female",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={audienceData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar
                              dataKey="male"
                              name="male"
                              stackId="a"
                              fill="var(--color-male)"
                              radius={[0, 4, 4, 0]}
                            />
                            <Bar
                              dataKey="female"
                              name="female"
                              stackId="a"
                              fill="var(--color-female)"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Top Locations</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-muted rounded mr-2"></div>
                              <span>United States</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">42%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-muted rounded mr-2"></div>
                              <span>United Kingdom</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">18%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-muted rounded mr-2"></div>
                              <span>Canada</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">12%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-muted rounded mr-2"></div>
                              <span>Australia</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">8%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-muted rounded mr-2"></div>
                              <span>Germany</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">6%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Viewer Loyalty</h3>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Returning Viewers</h4>
                              <span className="font-bold">68%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full w-[68%]"></div>
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">New Viewers</h4>
                              <span className="font-bold">32%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-blue-500 h-2.5 rounded-full w-[32%]"></div>
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Subscriber Ratio</h4>
                              <span className="font-bold">24%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-purple-500 h-2.5 rounded-full w-[24%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Revenue breakdown by source and platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue by Source</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={revenueData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {revenueData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue Metrics</h3>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                                <div className="text-2xl font-bold">$9,624</div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>22.5%</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Revenue per Viewer</div>
                                <div className="text-2xl font-bold">$1.82</div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>8.3%</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Subscriber Value</div>
                                <div className="text-2xl font-bold">$4.95</div>
                              </div>
                              <div className="flex items-center text-emerald-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>3.2%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
                      <div className="h-[300px]">
                        <ChartContainer
                          config={{
                            revenue: {
                              label: "Revenue ($)",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={overviewData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                name="revenue"
                                stroke="var(--color-revenue)"
                                fill="var(--color-revenue)"
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                  <CardDescription>Chat activity, watch time, and interaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="h-[350px]">
                      <ChartContainer
                        config={{
                          chatActivity: {
                            label: "Chat Messages",
                            color: "hsl(var(--chart-1))",
                          },
                          viewers: {
                            label: "Viewers",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="chatActivity"
                              name="chatActivity"
                              stroke="var(--color-chatActivity)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="viewers"
                              name="viewers"
                              stroke="var(--color-viewers)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Chat Messages per Viewer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">4.8</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">12.5%</span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Average Watch Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">32 min</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">8.3%</span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Interaction Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">18.7%</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500">5.2%</span>
                            <span className="ml-1">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Top Engagement Times</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <div className="font-medium">8:00 PM - 10:00 PM</div>
                            <div className="text-sm text-muted-foreground">Friday</div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          >
                            12.4% engagement
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <div className="font-medium">9:00 PM - 11:00 PM</div>
                            <div className="text-sm text-muted-foreground">Saturday</div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          >
                            11.8% engagement
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <div className="font-medium">7:00 PM - 9:00 PM</div>
                            <div className="text-sm text-muted-foreground">Wednesday</div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          >
                            9.5% engagement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function AnalyticsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
