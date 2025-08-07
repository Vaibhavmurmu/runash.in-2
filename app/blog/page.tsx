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


const BlogPost = ({
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  image,
  featured = false,
}: {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  featured?: boolean
}) => {
  return (
    <Card
      className={`overflow-hidden ${featured ? "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20" : "border-orange-200/50 dark:border-orange-900/30"}`}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
            {category}
          </span>
          {featured && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            Read More <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
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
      title: "The Future of AI-Powered Live Streaming:",
      slug: "future-ai-live-streaming transforming-digital-commerce",
      excerpt:
        "Discover how AI is revolutionizing live streaming and creating new opportunities for sellers and creators worldwide.",
      author: {
        name: "Ram Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "AI Technology",
      publishedAt: "2023-01-15",
      readingTime: 8,
      views: 0,
      likes: 0,
      comments: 0,
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
        name: "Ram Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Organic Products",
      publishedAt: "2023-01-12",
      readingTime: 6,
      views: 0,
      likes: 0,
      comments: 0,
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
        name: "Ram Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Best Practices",
      publishedAt: "2024-01-10",
      readingTime: 7,
      views: 0,
      likes: 0,
      comments: 0,
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
        name: "Vaibhav Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Organic Products",
      publishedAt: "2024-01-08",
      readingTime: 5,
      views: 0,
      likes: 0,
      comments: 0,
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
        name: " Vaibhav Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Psychology",
      publishedAt: "2024-01-05",
      readingTime: 9,
      views: 0,
      likes: 0,
      comments: 0,
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
        name: "Ram Murmu",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      category: "Getting Started",
      publishedAt: "2024-01-03",
      readingTime: 12,
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      image: "/placeholder.svg?height=400&width=800",
    },
  ]

  const mockCategories: Category[] = [
    { id: "ai-research", name: "AI Research", count: 1 },
    { id: "ai-technology", name: "AI Technology", count: 1 },
    { id: "tutorials", name: "Tutorials", count: 1 },
    { id: "product-updates", name: "Product Updates", count: 1 },
    { id: "organic-products", name: "Organic Products", count: 2 },
    { id: "best-practices", name: "Best Practices", count: 1 },
    { id: "psychology", name: "Psychology", count: 1 },
    { id: "getting-started", name: "Getting Started", count: 1 },
    { id: "community", name: "Community", count: 2 },
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
              Stay up to date with the latest news, tutorials,and insights from the RunAsh AI team.
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
  {/* Blog Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-orange-100/50 dark:bg-orange-900/20">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                <TabsTrigger value="product">Product Updates</TabsTrigger>
                <TabsTrigger value="ai">AI Research</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-8">
                {/* Featured Post */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Article</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="aspect-video overflow-hidden rounded-xl">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Featured article"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full">
                          AI Research
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4">The Future of AI-Powered Live Streaming</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                        Explore how artificial intelligence is revolutionizing the live streaming industry and what it
                        means for content creators worldwide.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Ram Murmu</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Jun 06 2025</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>8 min read</span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                        Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
          </TabsContent>
       </Tabs> 
       <div className="container mx-auto px-4 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold">Latest Articles</h2>
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
       {/* Newsletter Signup */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-orange-800 dark:text-orange-300">Stay Updated</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Subscribe to our newsletter for the latest updates, tutorials, and insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-800/30"
                />
                <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          
        
    
     {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-950 border-t border-orange-200/50 dark:border-orange-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} RunAsh AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
  }
