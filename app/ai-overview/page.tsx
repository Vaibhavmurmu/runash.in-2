"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Zap,
  Eye,
  Mic,
  MessageSquare,
  BarChart3,
  Shield,
  Database,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AIOverviewPage() {
  const router = useRouter()
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const aiCapabilities = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Computer Vision",
      description: "Advanced image and video analysis for content enhancement",
      features: ["Real-time object detection", "Scene understanding", "Quality enhancement", "Auto-cropping"],
      accuracy: 98.5,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Audio Processing",
      description: "Intelligent audio enhancement and speech recognition",
      features: ["Noise reduction", "Voice enhancement", "Real-time transcription", "Multi-language support"],
      accuracy: 96.8,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Natural Language",
      description: "Advanced NLP for chat moderation and content generation",
      features: ["Sentiment analysis", "Auto-moderation", "Content suggestions", "Multi-language chat"],
      accuracy: 94.2,
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Predictive Analytics",
      description: "AI insights for audience engagement and growth",
      features: ["Audience prediction", "Engagement optimization", "Revenue forecasting", "Trend analysis"],
      accuracy: 92.7,
      color: "from-orange-500 to-red-500",
    },
  ]

  const technicalSpecs = [
    { label: "Processing Speed", value: "< 50ms latency", icon: <Zap className="h-4 w-4" /> },
    { label: "Model Accuracy", value: "95.8% average", icon: <Brain className="h-4 w-4" /> },
    { label: "Supported Languages", value: "40+ languages", icon: <Globe className="h-4 w-4" /> },
    { label: "Concurrent Users", value: "100K+ streams", icon: <Users className="h-4 w-4" /> },
    { label: "Uptime", value: "99.99% SLA", icon: <Shield className="h-4 w-4" /> },
    { label: "Data Processing", value: "10TB+ daily", icon: <Database className="h-4 w-4" /> },
  ]

  const useCases = [
    {
      title: "Live Stream Enhancement",
      description: "Automatically enhance video quality, reduce noise, and optimize streaming parameters in real-time.",
      metrics: { improvement: "40%", metric: "viewer retention" },
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Intelligent Chat Moderation",
      description:
        "AI-powered chat filtering, sentiment analysis, and automated responses to maintain healthy communities.",
      metrics: { improvement: "85%", metric: "moderation accuracy" },
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Content Optimization",
      description: "Analyze audience engagement patterns and suggest optimal content strategies for maximum reach.",
      metrics: { improvement: "60%", metric: "engagement rate" },
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Automated Highlights",
      description: "Automatically detect and create highlight clips from live streams using advanced scene analysis.",
      metrics: { improvement: "75%", metric: "clip creation speed" },
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const integrationSteps = [
    {
      step: 1,
      title: "API Integration",
      description: "Connect your application using our RESTful API or WebSocket connections",
      code: `// Initialize RunAsh AI SDK
import { RunAshAI } from '@runash/ai-sdk'

const ai = new RunAshAI({
  apiKey: 'your-api-key',
  region: 'us-east-1'
})

// Start video enhancement
await ai.video.enhance({
  streamId: 'your-stream-id',
  quality: 'ultra',
  realTime: true
})`,
    },
    {
      step: 2,
      title: "Configure Models",
      description: "Select and configure AI models based on your specific use case requirements",
      code: `// Configure AI models
const config = {
  vision: {
    model: 'runash-vision-v3',
    features: ['enhancement', 'detection', 'analysis']
  },
  audio: {
    model: 'runash-audio-v2',
    features: ['noise-reduction', 'enhancement']
  }
}

await ai.configure(config)`,
    },
    {
      step: 3,
      title: "Real-time Processing",
      description: "Start processing your media streams with AI-powered enhancements",
      code: `// Start real-time processing
ai.stream.onFrame((frame) => {
  // AI processing happens automatically
  console.log('Enhanced frame ready:', frame.id)
})

ai.stream.onAudioChunk((audio) => {
  console.log('Enhanced audio ready:', audio.id)
})`,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              Powered by RunAsh AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-transparent bg-clip-text">
              AI Live Streaming Revolution
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your live streaming experience with cutting-edge artificial intelligence. Enhance video quality,
              moderate chat, analyze audience, and optimize content in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10"
                onClick={() => router.push("/get-started")}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setActiveDemo("overview")}>
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Excellence</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built on state-of-the-art infrastructure with industry-leading performance metrics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                    {spec.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{spec.label}</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{spec.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Capabilities</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive AI suite designed specifically for live streaming and content creation
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiCapabilities.map((capability, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${capability.color} text-white`}>
                      {capability.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{capability.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">{capability.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm font-bold">{capability.accuracy}%</span>
                    </div>
                    <Progress value={capability.accuracy} className="h-2" />
                    <div className="grid grid-cols-2 gap-2">
                      {capability.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Applications</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how our AI technology transforms live streaming across different use cases
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/20 flex items-center justify-center">
                  <img
                    src={useCase.image || "/placeholder.svg"}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{useCase.description}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      <span className="font-bold text-green-600">{useCase.metrics.improvement}</span> improvement in{" "}
                      {useCase.metrics.metric}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Easy Integration</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with RunAsh AI in minutes with our comprehensive SDK and APIs
            </p>
          </div>
          <Tabs defaultValue="step1" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="step1">Step 1: Setup</TabsTrigger>
              <TabsTrigger value="step2">Step 2: Configure</TabsTrigger>
              <TabsTrigger value="step3">Step 3: Process</TabsTrigger>
            </TabsList>
            {integrationSteps.map((step, index) => (
              <TabsContent key={index} value={`step${step.step}`} className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div>
                        <CardTitle>{step.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-orange-700 dark:to-yellow-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Streams?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators who are already using RunAsh AI to enhance their live streaming experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => router.push("/get-started")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
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
          <p className="mt-4 text-sm opacity-75">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}
