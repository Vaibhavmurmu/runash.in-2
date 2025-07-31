"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Video,
  BarChart,
  DollarSign,
  Wifi,
  Package,
  Award,
  Target,
  MessageCircle,
  Eye,
  ThumbsUp,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function BecomeSellerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    productCategory: "",
    experience: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    router.push("/dashboard")
  }

  const features = [
    {
      icon: <Video className="h-8 w-8 text-white" />,
      title: "AI-Enhanced Streaming",
      description:
        "Professional-quality streams with automatic video enhancement, lighting optimization, and noise reduction",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Global Audience Reach",
      description: "Connect with health-conscious customers worldwide who value organic and sustainable products",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <BarChart className="h-8 w-8 text-white" />,
      title: "Real-Time Analytics",
      description: "Track viewer engagement, sales performance, and optimize your streaming strategy with AI insights",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Secure Payments",
      description: "Built-in payment processing with multiple options and fraud protection for safe transactions",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-white" />,
      title: "Interactive Chat",
      description: "Engage with customers through real-time chat, Q&A sessions, and live product demonstrations",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: "Sales Optimization",
      description: "AI-powered recommendations to increase conversion rates and maximize your revenue potential",
      gradient: "from-yellow-500 to-orange-500",
    },
  ]

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      title: "Increase Revenue by 300%",
      description: "Sellers see average revenue increases of 300% compared to traditional e-commerce",
    },
    {
      icon: <Eye className="h-6 w-6 text-blue-600" />,
      title: "Higher Engagement",
      description: "Live streaming generates 10x more engagement than static product listings",
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-purple-600" />,
      title: "Build Trust & Credibility",
      description: "Show your products in action and build authentic relationships with customers",
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-600" />,
      title: "Global Market Access",
      description: "Reach customers worldwide and expand your market beyond geographical limitations",
    },
  ]

  const requirements = [
    {
      category: "Technical Requirements",
      icon: <Wifi className="h-6 w-6" />,
      items: [
        "Stable internet connection (minimum 5 Mbps upload)",
        "Smartphone or computer with camera",
        "Good lighting setup (natural light works great)",
        "Quiet environment for clear audio",
      ],
    },
    {
      category: "Product Requirements",
      icon: <Package className="h-6 w-6" />,
      items: [
        "Organic or sustainable products",
        "Valid certifications (if applicable)",
        "High-quality product images",
        "Detailed product descriptions",
      ],
    },
    {
      category: "Business Requirements",
      icon: <Award className="h-6 w-6" />,
      items: [
        "Valid business registration",
        "Tax identification number",
        "Bank account for payments",
        "Product liability insurance (recommended)",
      ],
    },
  ]

  const successStories = [
    {
      name: "Maria's Organic Farm",
      image: "/placeholder.svg?height=100&width=100",
      revenue: "$50K",
      period: "first 6 months",
      quote:
        "RunAsh transformed my small organic farm into a thriving online business. The live streaming feature helped me connect directly with customers and showcase the quality of my produce.",
      metrics: {
        viewers: "2.5K",
        sales: "1,200+",
        rating: 4.9,
      },
    },
    {
      name: "Green Valley Herbs",
      image: "/placeholder.svg?height=100&width=100",
      revenue: "$75K",
      period: "first year",
      quote:
        "The AI-enhanced streaming made my herb demonstrations look professional. Customers love seeing how to use the herbs in cooking and natural remedies.",
      metrics: {
        viewers: "4.1K",
        sales: "2,800+",
        rating: 4.8,
      },
    },
    {
      name: "Sustainable Skincare Co.",
      image: "/placeholder.svg?height=100&width=100",
      revenue: "$120K",
      period: "first year",
      quote:
        "Being able to demonstrate our skincare products live and answer questions in real-time has been a game-changer for building customer trust.",
      metrics: {
        viewers: "8.3K",
        sales: "5,600+",
        rating: 4.9,
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Become a RunAsh Seller</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Transform your organic products business with AI-powered live streaming. Connect with customers worldwide
              and showcase your products like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
                onClick={() => document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">$2M+</div>
              <div className="text-gray-600 dark:text-gray-400">Monthly Sales</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">500K+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-400">Seller Rating</div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Hero Section with Video Background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden"> 
        <VideoBackground />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
            <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
              Introducing 
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
            RunAsh AI Live Streaming Platform 
          </h1>
          <p className=" text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            The next generation of AI live streaming platform for creators, sellers, and businesses 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10"
              onClick={() => router.push("/stream")}
            >
               Get Started  <Play className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
              onClick={() => router.push("/")}
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>     
         {/* Tech badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <TechBadge label="Real-time Streaming" />
            <TechBadge label="Live Streaming Selling" />
            <TechBadge label="Products Demonstration" />
            <TechBadge label="Interactive Live Chat" />
            <TechBadge label="Polls or Q&A sessions" />
            <TechBadge label="Post-Live Stream" />
            <TechBadge label="Analytics" />
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <ChevronRight className="h-8 w-8 transform rotate-90 text-orange-500 dark:text-orange-400" />
        </div>
      </section>
     {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCounter value={150} label="100% Organic Certified Products" suffix="+" />
            <StatCounter value={1000} label="100% Organic Certified Farms" suffix="+" />
            <StatCounter value={99.9} label="Sustainable" suffix="%" />
            <StatCounter value={100} label="100% Organic Certified Recipe" suffix="+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-950 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
              Powerful Features for Sellers
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to showcase your organic products and build a successful online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose RunAsh?</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful sellers who have transformed their businesses with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Real sellers, real results. See how our platform has transformed organic product businesses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{story.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">{story.revenue}</span>
                        <span className="text-sm text-gray-500">in {story.period}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-600">{story.metrics.viewers}</div>
                      <div className="text-xs text-gray-500">Avg Viewers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{story.metrics.sales}</div>
                      <div className="text-xs text-gray-500">Total Sales</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{story.metrics.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 dark:text-gray-400 italic">"{story.quote}"</blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Getting Started Requirements</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Simple requirements to start your journey as a RunAsh seller
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">{req.icon}</div>
                    <CardTitle className="text-xl">{req.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {req.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Start selling in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Apply & Get Approved",
                description: "Submit your application and get approved within 24 hours",
                icon: <Target className="h-8 w-8" />,
              },
              {
                step: "2",
                title: "Set Up Your Store",
                description: "Upload your products, create your profile, and customize your store",
                icon: <Package className="h-8 w-8" />,
              },
              {
                step: "3",
                title: "Go Live",
                description: "Start streaming and showcase your products to a global audience",
                icon: <Video className="h-8 w-8" />,
              },
              {
                step: "4",
                title: "Grow & Earn",
                description: "Build your audience, increase sales, and grow your business",
                icon: <TrendingUp className="h-8 w-8" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full flex items-center justify-center text-white opacity-20 scale-125">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Your Journey</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Fill out the application form below and join thousands of successful sellers
              </p>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Seller Application Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <Input
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Category *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData.productCategory}
                    onChange={(e) => handleInputChange("productCategory", e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="organic-produce">Organic Produce</option>
                    <option value="herbs-spices">Herbs & Spices</option>
                    <option value="skincare">Natural Skincare</option>
                    <option value="supplements">Health Supplements</option>
                    <option value="food-beverages">Organic Food & Beverages</option>
                    <option value="home-garden">Home & Garden</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level *</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  >
                    <option value="">Select your experience</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3-5 years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tell us about your products *</label>
                  <Textarea
                    placeholder="Describe your products, your story, and why customers should choose you..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="rounded" />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <a href="/terms" className="text-orange-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-orange-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white py-3 text-lg"
                  onClick={handleSubmit}
                >
                  Submit Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-sm text-gray-500">
                  We'll review your application and get back to you within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="getting-started" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="selling">Selling</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="space-y-4">
                {[
                  {
                    q: "How long does the approval process take?",
                    a: "Most applications are reviewed and approved within 24 hours. We'll send you an email confirmation once your account is approved.",
                  },
                  {
                    q: "Do I need professional equipment to start?",
                    a: "No! You can start with just a smartphone and good lighting. Our AI enhancement technology will make your streams look professional.",
                  },
                  {
                    q: "Is there a fee to become a seller?",
                    a: "No, it's completely free to join as a seller. We only take a small commission on successful sales.",
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="selling" className="space-y-4">
                {[
                  {
                    q: "How do I schedule live streams?",
                    a: "You can schedule streams in advance through your seller dashboard. Customers will receive notifications when you go live.",
                  },
                  {
                    q: "Can I sell internationally?",
                    a: "Yes! Our platform supports international shipping and multiple currencies, allowing you to reach customers worldwide.",
                  },
                  {
                    q: "What support do you provide for new sellers?",
                    a: "We offer comprehensive onboarding, training materials, and dedicated seller support to help you succeed.",
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                {[
                  {
                    q: "How do I get paid?",
                    a: "Payments are processed automatically and transferred to your bank account weekly. You can track all earnings in your dashboard.",
                  },
                  {
                    q: "What's the commission rate?",
                    a: "We charge a competitive 5% commission on successful sales, which includes payment processing and platform fees.",
                  },
                  {
                    q: "Are there any hidden fees?",
                    a: "No hidden fees! Our transparent pricing means you only pay the 5% commission on sales. No monthly fees or setup costs.",
                  },
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Success Story?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of successful sellers who are building thriving businesses with RunAsh AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
              onClick={() => document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Apply Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Sales Team
            </Button>
          </div>
          <p className="mt-6 text-white/80 text-sm">No setup fees • No monthly charges • 24/7 support</p>
        </div>
      </section>
    </div>
  )
}
