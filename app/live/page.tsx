"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Globe, Mic, Video, ArrowRight, CheckCircle, Wifi, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LivePage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState("streaming")

  const streamingFeatures = [
    {
      id: "streaming",
      icon: <Play className="h-6 w-6" />,
      title: "Ultra-Low Latency Streaming",
      description: "Sub-second latency for real-time interaction with your audience",
      metrics: "< 500ms latency",
      color: "from-orange-600 to-orange-500",
    },
    {
      id: "quality",
      icon: <Video className="h-6 w-6" />,
      title: "4K HDR Streaming",
      description: "Crystal clear video quality up to 4K resolution with HDR support",
      metrics: "Up to 4K@60fps",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "audio",
      icon: <Headphones className="h-6 w-6" />,
      title: "Studio-Quality Audio",
      description: "Professional audio processing with noise cancellation and enhancement",
      metrics: "48kHz/24-bit audio",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "multiplatform",
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Platform Broadcasting",
      description: "Stream simultaneously to multiple platforms with optimized settings",
      metrics: "10+ platforms",
      color: "from-purple-500 to-violet-500",
    },
  ]

  const platformSupport = [
    { name: "Twitch", logo: "🎮", status: "Full Support", features: ["Chat", "Alerts", "Analytics"] },
    { name: "YouTube", logo: "📺", status: "Full Support", features: ["Live Chat", "Super Chat", "Premieres"] },
    { name: "Facebook", logo: "📘", status: "Full Support", features: ["Live Reactions", "Comments", "Sharing"] },
    { name: "Instagram", logo: "📷", status: "Full Support", features: ["Stories", "IGTV", "Reels"] },
    { name: "TikTok", logo: "🎵", status: "Beta", features: ["Live Gifts", "Comments", "Duets"] },
    { name: "LinkedIn", logo: "💼", status: "Full Support", features: ["Professional", "Events", "Articles"] },
    { name: "Discord", logo: "🎯", status: "Full Support", features: ["Voice Channels", "Screen Share", "Go Live"] },
    {
      name: "Custom RTMP",
      logo: "🔧",
      status: "Full Support",
      features: ["Any Platform", "Custom Settings", "Advanced"],
    },
  ]

  const technicalSpecs = [
    {
      category: "Video",
      specs: [
        { label: "Max Resolution", value: "4K (3840x2160)" },
        { label: "Frame Rate", value: "Up to 120 FPS" },
        { label: "Bitrate", value: "Up to 50 Mbps" },
        { label: "Codecs", value: "H.264, H.265, AV1" },
        { label: "HDR Support", value: "HDR10, Dolby Vision" },
      ],
    },
    {
      category: "Audio",
      specs: [
        { label: "Sample Rate", value: "Up to 192 kHz" },
        { label: "Bit Depth", value: "Up to 32-bit" },
        { label: "Channels", value: "Up to 7.1 Surround" },
        { label: "Codecs", value: "AAC, Opus, FLAC" },
        { label: "Latency", value: "< 10ms processing" },
      ],
    },
    {
      category: "Network",
      specs: [
        { label: "Protocols", value: "RTMP, WebRTC, SRT" },
        { label: "Adaptive Bitrate", value: "Yes" },
        { label: "CDN Integration", value: "Global Edge Network" },
        { label: "Bandwidth", value: "Auto-optimization" },
        { label: "Failover", value: "Automatic backup" },
      ],
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      description: "Perfect for new streamers",
      features: [
        "1080p streaming",
        "2 simultaneous platforms",
        "Basic analytics",
        "Community support",
        "5 hours/month recording",
      ],
      limitations: ["720p max on mobile", "Basic chat features"],
      popular: false,
    },
    {
      name: "Creator",
      price: "$49",
      period: "/month",
      description: "For growing content creators",
      features: [
        "4K streaming",
        "5 simultaneous platforms",
        "Advanced analytics",
        "Priority support",
        "Unlimited recording",
        "Custom overlays",
        "AI enhancements",
      ],
      limitations: [],
      popular: true,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "For professional streamers",
      features: [
        "8K streaming",
        "Unlimited platforms",
        "Real-time analytics",
        "24/7 dedicated support",
        "Unlimited everything",
        "White-label options",
        "API access",
        "Custom integrations",
      ],
      limitations: [],
      popular: false,
    },
  ]

  const liveStats = [
    { label: "Active Streams", value: "1.1K", change: "+15%" },
    { label: "Total Viewers", value: "2.4M", change: "+23%" },
    { label: "Peak Concurrent", value: "156K", change: "+8%" },
    { label: "Avg Stream Quality", value: "1440p", change: "Stable" },
    { label: "Global Latency", value: "342ms", change: "-12%" },
    { label: "Uptime", value: "99.98%", change: "+0.02%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-500/10 dark:from-orange-600/5 dark:to-orange-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE NOW
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              RunAsh Live 
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
              Stream to multiple platforms simultaneously with ultra-low latency, 4K quality, and AI
              enhancements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10"
                onClick={() => router.push("/stream")}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Streaming
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/demo")}>
                Watch Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Live Platform Statistics</h2>
            <p className="text-gray-600 dark:text-gray-300">Real-time data from our global streaming network</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {liveStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  <div
                    className={`text-xs mt-1 ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : stat.change.startsWith("-")
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Streaming Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional-grade streaming technology designed for creators who demand the best
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {streamingFeatures.map((feature, index) => (
              <Card
                key={index}
                className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  activeFeature === feature.id ? "ring-2 ring-red-500" : ""
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>{feature.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      {feature.metrics}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      Learn More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Multi-Platform Broadcasting</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stream to all major platforms simultaneously with platform-specific optimizations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformSupport.map((platform, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{platform.logo}</div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <Badge
                    variant={platform.status === "Full Support" ? "default" : "secondary"}
                    className={platform.status === "Full Support" ? "bg-green-100 text-green-700" : ""}
                  >
                    {platform.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Industry-leading technical capabilities for professional streaming
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalSpecs.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {category.category === "Video" && <Video className="h-5 w-5 text-orange-500" />}
                    {category.category === "Audio" && <Mic className="h-5 w-5 text-green-500" />}
                    {category.category === "Network" && <Wifi className="h-5 w-5 text-blue-500" />}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.specs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{spec.label}</span>
                        <span className="text-sm font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Flexible pricing plans designed to grow with your streaming career
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${plan.popular ? "ring-2 ring-orange-500 scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                    Most Popular
                  </div>
                )}
                <CardHeader className={plan.popular ? "pt-12" : ""}>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Limitations:</div>
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                            {limitation}
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Live?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators who trust RunAsh for their live streaming needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => router.push("/stream")}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Streaming Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Sales
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-75">Start free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}
