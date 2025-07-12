"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Search,
  Book,
  Play,
  Code,
  Zap,
  Users,
  Settings,
  BarChart,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle,
  Video,
  Smartphone,
  Headphones,
  Star,
  Clock,
  Lightbulb,
  MessageCircle,
  Camera,
  Mic,
  Monitor,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: <Play className="h-4 w-4" /> },
    { id: "live-streaming", name: "Live Streaming", icon: <Video className="h-4 w-4" /> },
    { id: "ai-features", name: "AI Features", icon: <Zap className="h-4 w-4" /> },
    { id: "seller-tools", name: "Seller Tools", icon: <Settings className="h-4 w-4" /> },
    { id: "analytics", name: "Analytics", icon: <BarChart className="h-4 w-4" /> },
    { id: "api", name: "API Reference", icon: <Code className="h-4 w-4" /> },
  ]

  const quickStart = [
    {
      title: "Create Your Account",
      description: "Sign up and complete your seller profile",
      time: "5 min",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Set Up Your Products",
      description: "Add your organic products with descriptions and images",
      time: "15 min",
      icon: <Settings className="h-6 w-6" />,
    },
    {
      title: "Configure Streaming",
      description: "Set up your camera, lighting, and streaming preferences",
      time: "10 min",
      icon: <Video className="h-6 w-6" />,
    },
    {
      title: "Go Live",
      description: "Start your first live streaming session",
      time: "2 min",
      icon: <Play className="h-6 w-6" />,
    },
  ]

  const popularGuides = [
    {
      title: "Complete Live Streaming Setup Guide",
      description: "Everything you need to know to start streaming professionally",
      category: "Live Streaming",
      readTime: "12 min",
      difficulty: "Beginner",
      rating: 0,
      views: "0K",
    },
    {
      title: "AI Enhancement Features Explained",
      description: "Learn how to use AI to improve your stream quality automatically",
      category: "AI Features",
      readTime: "8 min",
      difficulty: "Intermediate",
      rating: 4.8,
      views: "12.8K",
    },
    {
      title: "Maximizing Sales with Analytics",
      description: "Use data insights to optimize your streaming strategy",
      category: "Analytics",
      readTime: "10 min",
      difficulty: "Advanced",
      rating: 4.7,
      views: "9.5K",
    },
    {
      title: "Mobile Streaming Best Practices",
      description: "Professional streaming tips using just your smartphone",
      category: "Live Streaming",
      readTime: "6 min",
      difficulty: "Beginner",
      rating: 4.9,
      views: "18.3K",
    },
  ]

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/streams/create",
      description: "Create a new live stream session",
      params: ["title", "description", "category", "scheduled_time"],
    },
    {
      method: "GET",
      endpoint: "/api/streams/{id}",
      description: "Get stream details and statistics",
      params: ["stream_id"],
    },
    {
      method: "PUT",
      endpoint: "/api/products/{id}",
      description: "Update product information",
      params: ["product_id", "title", "price", "description"],
    },
    {
      method: "GET",
      endpoint: "/api/analytics/dashboard",
      description: "Retrieve analytics dashboard data",
      params: ["date_range", "metrics"],
    },
  ]

  const troubleshooting = [
    {
      issue: "Stream quality is poor",
      solution: "Check your internet connection (minimum 5 Mbps upload) and ensure good lighting",
      category: "Streaming",
    },
    {
      issue: "Audio not working",
      solution: "Check microphone permissions in browser settings and test audio levels",
      category: "Technical",
    },
    {
      issue: "Viewers can't see products",
      solution: "Ensure products are properly tagged and visible in the stream overlay",
      category: "Products",
    },
    {
      issue: "Payment not received",
      solution: "Payments are processed weekly. Check your payment settings and bank details",
      category: "Payments",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Documentation</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Everything you need to know about RunAsh AI Live Streaming Platform
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Start Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
              Quick Start Guide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Get up and running in under 30 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <Badge variant="secondary">{step.time}</Badge>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
                <div className="absolute top-4 left-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 border-2 border-orange-600">
                  {index + 1}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Documentation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id ? "bg-gradient-to-r from-orange-600 to-yellow-500" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsContent value="getting-started" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Getting Started</h2>

                  {/* System Requirements */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5" />
                        <span>System Requirements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Mobile Requirements
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              iOS 12+ or Android 8+
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Camera with 1080p support
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Microphone access
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />5 Mbps upload speed
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Monitor className="h-4 w-4 mr-2" />
                            Desktop Requirements
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Chrome 90+, Firefox 88+, Safari 14+
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Webcam with 720p+ resolution
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              External microphone (recommended)
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              10 Mbps upload speed
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Setup */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Account Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 1: Create Your Account</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Visit the seller registration page and fill out your basic information.
                        </p>
                        <Button size="sm" onClick={() => router.push("/become-seller")}>
                          Start Registration
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 2: Verify Your Identity</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Upload required documents for identity verification and business registration.
                        </p>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold mb-2">Step 3: Complete Your Profile</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Add your bio, profile picture, and business information to build trust with customers.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="live-streaming" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Live Streaming Guide</h2>

                  {/* Streaming Setup */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Camera className="h-5 w-5" />
                        <span>Streaming Setup</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Camera className="h-8 w-8 text-blue-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Camera Setup</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Position camera at eye level, ensure stable mounting, and test different angles
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="h-8 w-8 text-green-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Lighting</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Use natural light when possible, avoid backlighting, consider ring lights for consistency
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Mic className="h-8 w-8 text-purple-600" />
                          </div>
                          <h4 className="font-semibold mb-2">Audio</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Test microphone levels, minimize background noise, use external mic if possible
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Practices */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Streaming Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            title: "Plan Your Content",
                            description: "Prepare talking points, product demonstrations, and have backup topics ready",
                          },
                          {
                            title: "Engage with Viewers",
                            description: "Respond to comments, ask questions, and create interactive moments",
                          },
                          {
                            title: "Show Products Clearly",
                            description: "Use close-ups, different angles, and demonstrate product benefits",
                          },
                          {
                            title: "Maintain Energy",
                            description: "Stay enthusiastic, speak clearly, and keep the pace engaging",
                          },
                          {
                            title: "Call to Action",
                            description: "Guide viewers on how to purchase and create urgency when appropriate",
                          },
                        ].map((practice, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                          >
                            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{practice.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{practice.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ai-features" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">AI Features</h2>

                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>AI Enhancement Features</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            title: "Auto Video Enhancement",
                            description:
                              "Automatically adjusts brightness, contrast, and color balance for optimal video quality",
                            status: "Active",
                          },
                          {
                            title: "Noise Reduction",
                            description:
                              "AI-powered audio filtering removes background noise and enhances voice clarity",
                            status: "Active",
                          },
                          {
                            title: "Product Recognition",
                            description: "Automatically identifies and tags products in your stream for easy shopping",
                            status: "Beta",
                          },
                          {
                            title: "Smart Cropping",
                            description: "Intelligently frames your video to keep you and your products in focus",
                            status: "Coming Soon",
                          },
                        ].map((feature, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{feature.title}</h4>
                              <Badge
                                variant={
                                  feature.status === "Active"
                                    ? "default"
                                    : feature.status === "Beta"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={feature.status === "Active" ? "bg-green-600" : ""}
                              >
                                {feature.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">API Reference</h2>

                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>API Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {apiEndpoints.map((endpoint, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge
                                variant={endpoint.method === "GET" ? "secondary" : "default"}
                                className={
                                  endpoint.method === "GET"
                                    ? "bg-blue-600 text-white"
                                    : endpoint.method === "POST"
                                      ? "bg-green-600 text-white"
                                      : "bg-orange-600 text-white"
                                }
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                {endpoint.endpoint}
                              </code>
                              <Button size="sm" variant="ghost">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{endpoint.description}</p>
                            <div>
                              <h5 className="text-sm font-semibold mb-2">Parameters:</h5>
                              <div className="flex flex-wrap gap-2">
                                {endpoint.params.map((param, paramIndex) => (
                                  <code
                                    key={paramIndex}
                                    className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded text-xs"
                                  >
                                    {param}
                                  </code>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Popular Guides */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
            Popular Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularGuides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{guide.category}</Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{guide.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{guide.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{guide.views}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{guide.difficulty}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Troubleshooting</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="h-5 w-5" />
                <span>Common Issues & Solutions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {troubleshooting.map((item, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{item.issue}</h4>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{item.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Our support team is here to help you succeed. Get in touch for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => router.push("/support")}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/community")}>
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
