"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Users, ShoppingCart, Heart, Share2, Calendar, Star, TrendingUp, Gift } from "lucide-react"
import LiveStreamPlayer from "@/components/grocery/live-shopping/live-stream-player"
import LiveStreamChat from "@/components/grocery/live-shopping/live-stream-chat"
import FeaturedProductCarousel from "@/components/grocery/live-shopping/featured-product-carousel"
import LiveStreamInfo from "@/components/grocery/live-shopping/live-stream-info"
import LiveStreamMetricsDisplay from "@/components/grocery/live-shopping/live-stream-metrics-display"
import UpcomingStreams from "@/components/grocery/live-shopping/upcoming-streams"
import type { LiveStream, LiveStreamStats } from "@/types/live-shopping"

export default function LiveShoppingPage() {
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null)
  const [streamStats, setStreamStats] = useState<LiveStreamStats | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockStream: LiveStream = {
    id: "stream-1",
    title: "Fresh Organic Produce Showcase - Farm to Table",
    description:
      "Join us for an exclusive look at this week's freshest organic produce directly from our partner farms. Discover seasonal vegetables, exotic fruits, and get special live-only discounts!",
    hostId: "host-1",
    hostName: "Sarah Chen",
    hostAvatar: "/placeholder.svg?height=100&width=100",
    status: "live",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    viewerCount: 1247,
    maxViewers: 1580,
    category: "Organic Produce",
    tags: ["organic", "fresh", "seasonal", "farm-direct"],
    thumbnailUrl: "/placeholder.svg?height=400&width=600",
    streamUrl: "https://example.com/stream",
    chatEnabled: true,
    productsEnabled: true,
    recordingEnabled: true,
    featuredProducts: ["1", "2", "3", "4", "5"],
    totalSales: 89,
    totalRevenue: 2847.5,
  }

  const mockStats: LiveStreamStats = {
    streamId: "stream-1",
    viewerCount: 1247,
    peakViewers: 1580,
    totalViews: 3420,
    chatMessages: 892,
    productViews: 456,
    purchases: 89,
    revenue: 2847.5,
    averageWatchTime: 18.5,
    engagementRate: 0.72,
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCurrentStream(mockStream)
      setStreamStats(mockStats)
      setLoading(false)
    }, 1000)

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStream) {
        setCurrentStream((prev) =>
          prev
            ? {
                ...prev,
                viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5,
                totalSales: prev.totalSales + Math.floor(Math.random() * 3),
                totalRevenue: prev.totalRevenue + Math.random() * 50,
              }
            : null,
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentStream) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-6 w-24 h-24 mx-auto mb-4">
              <Play className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Live Streams</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no live streams at the moment. Check out our upcoming streams!
            </p>
            <UpcomingStreams />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 p-2">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                    Live Shopping
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{currentStream.viewerCount.toLocaleString()} watching</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className={isFollowing ? "bg-purple-100 text-purple-700" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Live Stream Stats Bar */}
        {streamStats && (
          <div className="mb-6">
            <LiveStreamMetricsDisplay stats={streamStats} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <LiveStreamPlayer stream={currentStream} />

            {/* Stream Info */}
            <LiveStreamInfo stream={currentStream} />

            {/* Featured Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Featured Products</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Live Deals
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FeaturedProductCarousel streamId={currentStream.id} />
              </CardContent>
            </Card>

            {/* Additional Tabs */}
            <Tabs defaultValue="products" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">All Products</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>All Stream Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product grid would go here */}
                      <div className="text-center py-8 text-gray-500">
                        More products will be showcased during the stream
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="highlights">
                <Card>
                  <CardHeader>
                    <CardTitle>Stream Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">Product Spotlight</div>
                          <div className="text-sm text-gray-600">Organic Avocados featured at 15:30</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Sales Milestone</div>
                          <div className="text-sm text-gray-600">50 products sold in first 20 minutes!</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Gift className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium">Special Offer</div>
                          <div className="text-sm text-gray-600">Flash discount on organic quinoa - 20% off!</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Viewer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">@organicfoodie</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          "Amazing quality products! The mangoes I ordered last week were perfectly ripe."
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">@healthyeater</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          "Love these live shopping sessions! Great way to discover new organic products."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            <LiveStreamChat streamId={currentStream.id} />

            {/* Upcoming Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Streams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingStreams limit={3} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Stream Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.floor((Date.now() - currentStream.startTime.getTime()) / (1000 * 60))} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peak Viewers</span>
                  <span className="font-medium">{streamStats?.peakViewers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Products Sold</span>
                  <span className="font-medium text-green-600">{currentStream.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium text-green-600">${currentStream.totalRevenue.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
