"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Clock, Star, ArrowRight, Calendar, User } from "lucide-react"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { CategoryFilter } from "@/components/blog/category-filter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ThemeToggle from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  category: string
  publishedAt: string
  readingTime: number
  views: number
  likes: number
  comments: number
  featured: boolean
  image: string
}

interface Category {
  id: string
  name: string
  count: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [loading, setLoading] = useState(true)

  // Mock blog posts data
  const mockPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Future of AI-Powered Live Streaming: Transforming Digital Commerce",
      slug: "future-ai-live-streaming-digital-commerce",
      excerpt:
        "Discover how AI is revolutionizing live streaming and creating new opportunities for sellers and creators worldwide.",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "AI Technology",
      publishedAt: "2024-01-15",
      readingTime: 8,
      views: 15420,
      likes: 342,
      comments: 28,
      featured: true,
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "2",
      title: "Building Trust in Organic Product Sales Through Live Demonstrations",
      slug: "building-trust-organic-products-live-demos",
      excerpt:
        "Learn how live streaming can help organic product sellers build credibility and trust with their customers.",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Organic Products",
      publishedAt: "2024-01-12",
      readingTime: 6,
      views: 8930,
      likes: 156,
      comments: 15,
      featured: false,
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "3",
      title: "Maximizing Engagement: Best Practices for Live Stream Sellers",
      slug: "maximizing-engagement-live-stream-sellers",
      excerpt:
        "Discover proven strategies to increase viewer engagement and boost sales during live streaming sessions.",
      author: {
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Best Practices",
      publishedAt: "2024-01-10",
      readingTime: 7,
      views: 12100,
      likes: 289,
      comments: 22,
      featured: false,
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "4",
      title: "From Farm to Screen: Showcasing Organic Products in the Digital Age",
      slug: "farm-to-screen-organic-products-digital",
      excerpt:
        "Explore how organic farmers are using technology to connect directly with consumers and tell their stories.",
      author: {
        name: "David Park",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Organic Products",
      publishedAt: "2024-01-08",
      readingTime: 5,
      views: 6750,
      likes: 98,
      comments: 12,
      featured: false,
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "5",
      title: "The Psychology of Live Shopping: Why Viewers Buy",
      slug: "psychology-live-shopping-viewer-behavior",
      excerpt:
        "Understanding the psychological factors that drive purchasing decisions during live streaming sessions.",
      author: {
        name: "Dr. Lisa Wang",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Psychology",
      publishedAt: "2024-01-05",
      readingTime: 9,
      views: 18200,
      likes: 445,
      comments: 35,
      featured: true,
      image: "/placeholder.svg?height=400&width=800",
    },
    {
      id: "6",
      title: "Setting Up Your First Live Stream: A Complete Guide",
      slug: "setting-up-first-live-stream-guide",
      excerpt:
        "Everything you need to know to start your live streaming journey, from equipment to engagement strategies.",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Getting Started",
      publishedAt: "2024-01-03",
      readingTime: 12,
      views: 22500,
      likes: 567,
      comments: 48,
      featured: false,
      image: "/placeholder.svg?height=400&width=800",
    },
  ]

  const mockCategories: Category[] = [
    { id: "ai-technology", name: "AI Technology", count: 1 },
    { id: "organic-products", name: "Organic Products", count: 2 },
    { id: "best-practices", name: "Best Practices", count: 1 },
    { id: "psychology", name: "Psychology", count: 1 },
    { id: "getting-started", name: "Getting Started", count: 1 },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
      setCategories(mockCategories)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory) {
      const categoryName = categories.find((cat) => cat.id === selectedCategory)?.name
      filtered = filtered.filter((post) => post.category === categoryName)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort posts
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.views - a.views)
        break
      case "liked":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "commented":
        filtered.sort((a, b) => b.comments - a.comments)
        break
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchQuery, sortBy, categories])

  const featuredPosts = posts.filter((post) => post.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    {/* <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
    {/* <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">RunAsh Blog</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Insights, tips, and stories from the world of AI-powered live streaming and organic commerce
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </div> */}

      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-orange-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
              <span className="text-orange-600 dark:text-orange-400">RunAsh Blog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Insights & Updates
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Stay up to date with the latest news, tutorials, and insights from the RunAsh AI team.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70"
              />
            </div>
          </div>
        </div>
        
      </section>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              totalPosts={posts.length}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Latest
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Most Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="liked">Most Liked</SelectItem>
                  <SelectItem value="commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory
                  ? `${categories.find((cat) => cat.id === selectedCategory)?.name} Articles`
                  : "All Articles"}
              </h2>
              <p className="text-gray-600">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
     
    </div>
  )
}
