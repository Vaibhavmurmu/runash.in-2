"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, TrendingUp, Video, ShoppingCart, BarChart3, Clock, Play, Settings } from "lucide-react"
import { SellerAnalytics } from "@/components/seller/seller-analytics"
import { LiveStreamManager } from "@/components/seller/live-stream-manager"
import { ProductManager } from "@/components/seller/product-manager"
import { OrderManager } from "@/components/seller/order-manager"
import { SellerProfile } from "@/components/seller/seller-profile"
import { BusinessSettings } from "@/components/seller/business-settings"
import { InventoryManager } from "@/components/seller/inventory-manager"
import { PayoutManager } from "@/components/seller/payout-manager"

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch permissions to ensure only sellers can access this dashboard
  const {
    data: perms,
    error: permsError,
    isLoading: permsLoading,
  } = useSWR("/api/auth/permissions", (url) =>
    fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load permissions")))),
  )

  if (permsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading seller dashboard...
      </div>
    )
  }

  if (permsError || (perms && perms.role !== "seller")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Not authorized</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            You don{"'"}t have permission to access the Seller Dashboard.
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,345",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Live Viewers",
      value: "2,847",
      change: "+8.2%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Products Sold",
      value: "156",
      change: "+23.1%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Stream Hours",
      value: "48.5h",
      change: "+5.7%",
      icon: Clock,
      trend: "up",
    },
  ]

  const recentStreams = [
    {
      id: 1,
      title: "Organic Vegetables Showcase",
      date: "2024-01-15",
      viewers: 1234,
      revenue: 890,
      status: "completed",
    },
    {
      id: 2,
      title: "Fresh Herbs Collection",
      date: "2024-01-14",
      viewers: 987,
      revenue: 567,
      status: "completed",
    },
    {
      id: 3,
      title: "Seasonal Fruits Special",
      date: "2024-01-13",
      viewers: 1456,
      revenue: 1234,
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your organic products and live streams</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Video className="h-4 w-4 mr-2" />
              Go Live
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 overflow-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Streams */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-orange-500" />
                    Recent Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentStreams.map((stream) => (
                      <div
                        key={stream.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{stream.title}</p>
                            <p className="text-sm text-muted-foreground">{stream.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${stream.revenue}</p>
                          <p className="text-sm text-muted-foreground">{stream.viewers} viewers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stream Engagement</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span>12.5%</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Return Customers</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streams">
            <LiveStreamManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManager />
          </TabsContent>

          <TabsContent value="payouts">
            <PayoutManager />
          </TabsContent>

          <TabsContent value="analytics">
            <SellerAnalytics />
          </TabsContent>

          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="profile">
            <SellerProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
