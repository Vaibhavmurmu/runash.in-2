"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Calendar,
  Tag,
  Plus,
  Zap,
  Bug,
  Shield,
  ArrowRight,
  Bell,
  Download,
  Star,
  GitBranch,
  Info,
  GitCommit
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ChangelogPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const changelogEntries = [
    {
      version: "2.4.0",
      date: "2024-01-15",
      type: "major",
      title: "AI-Powered Stream Enhancement",
      description: "Major update introducing advanced AI capabilities for real-time stream enhancement",
      categories: ["new", "ai", "streaming"],
      changes: [
        {
          type: "new",
          title: "Real-time AI Video Enhancement",
          description:
            "Automatically enhance video quality, reduce noise, and optimize streaming parameters using advanced AI algorithms",
          impact: "high",
        },
        {
          type: "new",
          title: "Smart Chat Moderation",
          description: "AI-powered chat filtering with sentiment analysis and automated responses",
          impact: "medium",
        },
        {
          type: "improvement",
          title: "Reduced Latency",
          description: "Optimized streaming pipeline reducing end-to-end latency by 40%",
          impact: "high",
        },
        {
          type: "fix",
          title: "Audio Sync Issues",
          description: "Fixed audio synchronization problems in multi-platform streaming",
          impact: "medium",
        },
      ],
      downloads: 15420,
      feedback: { positive: 89, negative: 11 },
    },
    {
      version: "2.3.2",
      date: "2024-01-08",
      type: "patch",
      title: "Performance Improvements & Bug Fixes",
      description: "Critical bug fixes and performance optimizations",
      categories: ["fix", "performance"],
      changes: [
        {
          type: "fix",
          title: "Memory Leak in Recording Module",
          description: "Fixed memory leak that occurred during long recording sessions",
          impact: "high",
        },
        {
          type: "fix",
          title: "Platform Connection Stability",
          description: "Improved connection stability for Twitch and YouTube streaming",
          impact: "medium",
        },
        {
          type: "improvement",
          title: "CPU Usage Optimization",
          description: "Reduced CPU usage by 25% during active streaming",
          impact: "medium",
        },
        {
          type: "security",
          title: "Authentication Security Update",
          description: "Enhanced security measures for user authentication and API access",
          impact: "high",
        },
      ],
      downloads: 12850,
      feedback: { positive: 92, negative: 8 },
    },
    {
      version: "2.3.1",
      date: "2024-01-03",
      type: "patch",
      title: "Holiday Hotfix",
      description: "Quick fixes for issues discovered during holiday streaming events",
      categories: ["fix", "hotfix"],
      changes: [
        {
          type: "fix",
          title: "Stream Disconnection Issues",
          description: "Fixed random disconnections during peak traffic periods",
          impact: "high",
        },
        {
          type: "fix",
          title: "Mobile App Crashes",
          description: "Resolved crashes on iOS devices when switching between apps",
          impact: "medium",
        },
      ],
      downloads: 8920,
      feedback: { positive: 85, negative: 15 },
    },
    {
      version: "2.3.0",
      date: "2023-12-20",
      type: "minor",
      title: "Multi-Host Streaming & Analytics",
      description: "New collaborative streaming features and enhanced analytics dashboard",
      categories: ["new", "analytics", "collaboration"],
      changes: [
        {
          type: "new",
          title: "Multi-Host Streaming",
          description: "Support for collaborative streaming with up to 4 co-hosts",
          impact: "high",
        },
        {
          type: "new",
          title: "Advanced Analytics Dashboard",
          description: "Comprehensive analytics with audience insights and engagement metrics",
          impact: "medium",
        },
        {
          type: "new",
          title: "Custom Overlays",
          description: "Create and customize stream overlays with drag-and-drop editor",
          impact: "medium",
        },
        {
          type: "improvement",
          title: "Mobile App Performance",
          description: "Improved mobile app performance and battery optimization",
          impact: "medium",
        },
      ],
      downloads: 18750,
      feedback: { positive: 94, negative: 6 },
    },
    {
      version: "2.2.1",
      date: "2023-12-10",
      type: "patch",
      title: "Security & Stability Updates",
      description: "Important security updates and stability improvements",
      categories: ["security", "fix"],
      changes: [
        {
          type: "security",
          title: "OAuth 2.0 Implementation",
          description: "Enhanced security with OAuth 2.0 for third-party integrations",
          impact: "high",
        },
        {
          type: "security",
          title: "Data Encryption Upgrade",
          description: "Upgraded to AES-256 encryption for all user data",
          impact: "high",
        },
        {
          type: "fix",
          title: "Recording Quality Issues",
          description: "Fixed quality degradation in recorded streams",
          impact: "medium",
        },
      ],
      downloads: 11200,
      feedback: { positive: 88, negative: 12 },
    },
  ]

  const categories = [
    { id: "all", name: "All Changes", count: changelogEntries.length },
    { id: "new", name: "New Features", count: 8 },
    { id: "improvement", name: "Improvements", count: 6 },
    { id: "fix", name: "Bug Fixes", count: 12 },
    { id: "security", name: "Security", count: 4 },
    { id: "ai", name: "AI Features", count: 3 },
  ]

  const filteredEntries = changelogEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.changes.some(
        (change) =>
          change.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          change.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    const matchesCategory =
      selectedCategory === "all" ||
      entry.categories.includes(selectedCategory) ||
      entry.changes.some((change) => change.type === selectedCategory)
    return matchesSearch && matchesCategory
  })

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Plus className="h-4 w-4 text-green-600" />
      case "improvement":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "fix":
        return <Bug className="h-4 w-4 text-orange-600" />
      case "security":
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "improvement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "fix":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "minor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "patch":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const ChangelogEntry = ({ entry }: { entry: (typeof changelogEntries)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getVersionBadgeColor(entry.type)}>v{entry.version}</Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <CardTitle className="text-xl mb-2">{entry.title}</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">{entry.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="text-right text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Download className="h-4 w-4" />
                {entry.downloads.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <Star className="h-4 w-4" />
                {entry.feedback.positive}%
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entry.changes.map((change, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="mt-0.5">{getChangeIcon(change.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${getChangeColor(change.type)}`}>{change.type}</Badge>
                  {change.impact === "high" && (
                    <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                      High Impact
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium mb-1">{change.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{change.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex gap-2">
            {entry.categories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm">
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-orange-600/5 dark:to-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-600 text-transparent bg-clip-text">
              Changelog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Stay up to date with the latest features, improvements, and fixes in RunAsh
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Release Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Releases</span>
                  <span className="text-sm font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bug Fixes</span>
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Features</span>
                  <span className="text-sm font-medium">18</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscribe to Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Get notified about new releases and important updates
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Email Notifications
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <GitBranch className="h-4 w-4 mr-2" />
                    RSS Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" ? "All Updates" : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-sm text-gray-600">{filteredEntries.length} updates found</div>
            </div>

            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <ChangelogEntry key={entry.version} entry={entry} />
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No updates found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search query or category filter</p>
              </div>
            )}

            {/* Load More */}
            {filteredEntries.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  Load More Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      
      
      {/* Subscribe CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Never miss an update. Subscribe to our changelog to stay informed and be the first to know about new features and
              improvements.
            </p>
           <div className="flex flex-col mb-2 sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white/10 border-white/20 text-white placeholder:text-white/70 hover:bg-white/10 ">Subscribe</Button>
         </div>
           
           
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                Follow on Hugging Face 
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Follow on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
