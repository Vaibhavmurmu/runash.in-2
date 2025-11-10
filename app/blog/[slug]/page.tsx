"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Bookmark, Eye, MessageCircle, Clock, User, Calendar } from "lucide-react"
import { ShareButton } from "@/components/blog/share-button"
import { CommentSection } from "@/components/blog/comment-section"
import { BlogPostCard } from "@/components/blog/blog-post-card"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
    followers: number
  }
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  views: number
  likes: number
  comments: number
  featured: boolean
  image: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock blog post data
  const mockPost: BlogPost = {
    id: "1",
    title: "The Future of AI-Powered Live Streaming: Transforming Digital Commerce",
    slug: "future-ai-live-streaming-digital-commerce",
    excerpt:
      "Discover how AI is revolutionizing live streaming and creating new opportunities for sellers and creators worldwide.",
    content: `
      <h2>Introduction</h2>
      <p>The digital commerce landscape is undergoing a revolutionary transformation, driven by the convergence of artificial intelligence and live streaming technology. As we stand at the precipice of this new era, platforms like RunAsh AI are pioneering innovative solutions that empower sellers to showcase their products in ways previously unimaginable.</p>
      
      <h2>The Rise of Live Commerce</h2>
      <p>Live streaming commerce has emerged as one of the fastest-growing segments in e-commerce, with global sales reaching unprecedented heights. This interactive shopping experience allows customers to see products in action, ask questions in real-time, and make informed purchasing decisions.</p>
      
      <blockquote>
        "Live streaming isn't just about broadcasting; it's about creating authentic connections between sellers and buyers in a digital space."
      </blockquote>
      
      <h2>AI-Enhanced Features</h2>
      <p>Modern AI-powered streaming platforms offer several game-changing features:</p>
      <ul>
        <li><strong>Real-time Video Enhancement:</strong> AI algorithms automatically optimize video quality, lighting, and audio</li>
        <li><strong>Smart Product Recognition:</strong> Automatic tagging and information overlay for showcased products</li>
        <li><strong>Audience Analytics:</strong> Deep insights into viewer behavior and preferences</li>
        <li><strong>Automated Moderation:</strong> AI-powered chat filtering and content monitoring</li>
      </ul>
      
      <h2>Benefits for Organic Product Sellers</h2>
      <p>For sellers of organic products, live streaming offers unique advantages:</p>
      <ol>
        <li><strong>Transparency:</strong> Show the actual farming process and product quality</li>
        <li><strong>Education:</strong> Explain the benefits and uses of organic products</li>
        <li><strong>Trust Building:</strong> Create personal connections with health-conscious consumers</li>
        <li><strong>Real-time Feedback:</strong> Address customer concerns immediately</li>
      </ol>
      
      <h2>The Technology Behind the Magic</h2>
      <p>RunAsh AI leverages cutting-edge technology to deliver seamless streaming experiences. Our platform combines machine learning algorithms with advanced video processing to ensure every stream looks professional, regardless of the seller's technical expertise.</p>
      
      <h2>Looking Ahead</h2>
      <p>As we look to the future, the integration of AI and live streaming will only deepen. We can expect to see more sophisticated features like virtual try-ons, augmented reality product demonstrations, and predictive analytics that help sellers optimize their streaming strategies.</p>
      
      <h2>Conclusion</h2>
      <p>The future of digital commerce lies in authentic, interactive experiences that bridge the gap between online and offline shopping. AI-powered live streaming platforms are not just tools; they're catalysts for a more connected, transparent, and engaging marketplace.</p>
    `,
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Tech journalist and AI enthusiast with over 8 years of experience covering emerging technologies and their impact on business.",
      followers: 12500,
    },
    category: "AI Technology",
    tags: ["AI", "Live Streaming", "E-commerce", "Digital Commerce", "Technology"],
    publishedAt: "2024-01-15",
    readingTime: 8,
    views: 15420,
    likes: 342,
    comments: 28,
    featured: true,
    image: "/placeholder.svg?height=400&width=800",
  }

  const mockRelatedPosts: BlogPost[] = [
    {
      id: "2",
      title: "Building Trust in Organic Product Sales Through Live Demonstrations",
      slug: "building-trust-organic-products-live-demos",
      excerpt:
        "Learn how live streaming can help organic product sellers build credibility and trust with their customers.",
      content: "",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Organic farming expert and digital marketing consultant.",
        followers: 8200,
      },
      category: "Organic Products",
      tags: ["Organic", "Trust", "Live Streaming"],
      publishedAt: "2024-01-12",
      readingTime: 6,
      views: 8930,
      likes: 156,
      comments: 15,
      featured: false,
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "3",
      title: "Maximizing Engagement: Best Practices for Live Stream Sellers",
      slug: "maximizing-engagement-live-stream-sellers",
      excerpt:
        "Discover proven strategies to increase viewer engagement and boost sales during live streaming sessions.",
      content: "",
      author: {
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Live streaming consultant and former e-commerce executive.",
        followers: 15600,
      },
      category: "Best Practices",
      tags: ["Engagement", "Sales", "Strategy"],
      publishedAt: "2024-01-10",
      readingTime: 7,
      views: 12100,
      likes: 289,
      comments: 22,
      featured: false,
      image: "/placeholder.svg?height=300&width=600",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPost(mockPost)
      setRelatedPosts(mockRelatedPosts)
      setLoading(false)
    }, 1000)
  }, [params.slug])

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (post) {
      setPost({
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? "text-orange-500" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <ShareButton url={`https://runash.ai/blog/${post.slug}`} title={post.title} description={post.excerpt} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{post.author.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
                <p className="text-xs text-gray-500">{post.author.followers.toLocaleString()} followers</p>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="hover:bg-orange-50">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comments Section */}
          <CommentSection postId={post.id} />

          <Separator className="my-12" />

          {/* Related Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
