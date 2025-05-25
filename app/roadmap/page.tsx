"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Lightbulb, Rocket, Star, Users } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RoadmapItem = ({
  title,
  description,
  status,
  quarter,
  features,
  votes,
}: {
  title: string
  description: string
  status: "completed" | "in-progress" | "planned" | "research"
  quarter: string
  features: string[]
  votes?: number
}) => {
  const statusConfig = {
    completed: { color: "bg-green-500", text: "Completed", icon: CheckCircle },
    "in-progress": { color: "bg-orange-500", text: "In Progress", icon: Clock },
    planned: { color: "bg-blue-500", text: "Planned", icon: Rocket },
    research: { color: "bg-purple-500", text: "Research", icon: Lightbulb },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className="border-orange-200/50 dark:border-orange-900/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
            <Badge variant="outline" className="text-xs">
              {quarter}
            </Badge>
            <Badge variant={status === "completed" ? "default" : "secondary"} className="text-xs">
              <Icon className="h-3 w-3 mr-1" />
              {config.text}
            </Badge>
          </div>
          {votes && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Star className="h-4 w-4" />
              <span>{votes}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoadmapPage() {
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
              <span className="text-orange-600 dark:text-orange-400">Product Roadmap</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              What's Coming Next
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              See what we're building for the future of AI-powered live streaming. Vote on features you'd like to see.
            </p>
            <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
              Suggest a Feature <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="timeline" className="mb-8">
              <TabsList className="bg-orange-100/50 dark:bg-orange-900/20">
                <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                <TabsTrigger value="status">By Status</TabsTrigger>
                <TabsTrigger value="popular">Most Requested</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-8">
                <div className="space-y-12">
                  {/* Q1 2025 */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Q1 2025</h2>
                      <Badge className="bg-orange-500 text-white">Current Quarter</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="Advanced AI Background Generation"
                        description="Create custom backgrounds using AI with text prompts and style controls."
                        status="in-progress"
                        quarter="Q1 2025"
                        features={[
                          "Text-to-image background generation",
                          "Style and mood controls",
                          "Brand color integration",
                          "Real-time preview",
                        ]}
                        votes={342}
                      />
                      <RoadmapItem
                        title="Multi-Host Streaming"
                        description="Enable multiple hosts in a single stream with AI-powered switching and mixing."
                        status="planned"
                        quarter="Q1 2025"
                        features={[
                          "Up to 6 simultaneous hosts",
                          "AI-powered camera switching",
                          "Individual audio controls",
                          "Host invitation system",
                        ]}
                        votes={289}
                      />
                    </div>
                  </div>

                  {/* Q4 2024 - Completed */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Q4 2024</h2>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Completed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="Real-time AI Video Enhancement"
                        description="Automatic video quality improvement with AI-powered noise reduction and lighting optimization."
                        status="completed"
                        quarter="Q4 2024"
                        features={[
                          "Automatic lighting correction",
                          "Background noise reduction",
                          "Dynamic resolution upscaling",
                          "Bandwidth optimization",
                        ]}
                      />
                      <RoadmapItem
                        title="Smart Chat Moderation"
                        description="AI-powered chat moderation with customizable rules and automated responses."
                        status="completed"
                        quarter="Q4 2024"
                        features={[
                          "Toxic content detection",
                          "Spam filtering",
                          "Custom moderation rules",
                          "Automated warnings",
                        ]}
                      />
                    </div>
                  </div>

                  {/* Q2 2025 */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Q2 2025</h2>
                      <Badge variant="secondary">Planned</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="AI-Powered Content Suggestions"
                        description="Get personalized content recommendations based on your audience and trending topics."
                        status="planned"
                        quarter="Q2 2025"
                        features={[
                          "Trending topic analysis",
                          "Audience preference insights",
                          "Content calendar integration",
                          "Performance predictions",
                        ]}
                        votes={198}
                      />
                      <RoadmapItem
                        title="Advanced Analytics Dashboard"
                        description="Comprehensive analytics with AI-driven insights and predictive modeling."
                        status="planned"
                        quarter="Q2 2025"
                        features={[
                          "Advanced audience segmentation",
                          "Revenue optimization insights",
                          "Growth prediction models",
                          "Custom dashboard widgets",
                        ]}
                        votes={156}
                      />
                    </div>
                  </div>

                  {/* Q3 2025 */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Q3 2025</h2>
                      <Badge variant="secondary">Research</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="AI Voice Synthesis & Translation"
                        description="Real-time voice translation and AI voice synthesis for global audiences."
                        status="research"
                        quarter="Q3 2025"
                        features={[
                          "Real-time voice translation",
                          "AI voice cloning",
                          "Accent adaptation",
                          "Multi-language support",
                        ]}
                        votes={234}
                      />
                      <RoadmapItem
                        title="Immersive AR/VR Integration"
                        description="Support for AR/VR streaming with spatial audio and 3D environments."
                        status="research"
                        quarter="Q3 2025"
                        features={[
                          "VR headset support",
                          "3D virtual environments",
                          "Spatial audio processing",
                          "Hand gesture recognition",
                        ]}
                        votes={187}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      In Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="Advanced AI Background Generation"
                        description="Create custom backgrounds using AI with text prompts and style controls."
                        status="in-progress"
                        quarter="Q1 2025"
                        features={[
                          "Text-to-image background generation",
                          "Style and mood controls",
                          "Brand color integration",
                          "Real-time preview",
                        ]}
                        votes={342}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Planned
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="Multi-Host Streaming"
                        description="Enable multiple hosts in a single stream with AI-powered switching and mixing."
                        status="planned"
                        quarter="Q1 2025"
                        features={[
                          "Up to 6 simultaneous hosts",
                          "AI-powered camera switching",
                          "Individual audio controls",
                          "Host invitation system",
                        ]}
                        votes={289}
                      />
                      <RoadmapItem
                        title="AI-Powered Content Suggestions"
                        description="Get personalized content recommendations based on your audience and trending topics."
                        status="planned"
                        quarter="Q2 2025"
                        features={[
                          "Trending topic analysis",
                          "Audience preference insights",
                          "Content calendar integration",
                          "Performance predictions",
                        ]}
                        votes={198}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Completed
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RoadmapItem
                        title="Real-time AI Video Enhancement"
                        description="Automatic video quality improvement with AI-powered noise reduction and lighting optimization."
                        status="completed"
                        quarter="Q4 2024"
                        features={[
                          "Automatic lighting correction",
                          "Background noise reduction",
                          "Dynamic resolution upscaling",
                          "Bandwidth optimization",
                        ]}
                      />
                      <RoadmapItem
                        title="Smart Chat Moderation"
                        description="AI-powered chat moderation with customizable rules and automated responses."
                        status="completed"
                        quarter="Q4 2024"
                        features={[
                          "Toxic content detection",
                          "Spam filtering",
                          "Custom moderation rules",
                          "Automated warnings",
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="popular" className="mt-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Most Requested Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RoadmapItem
                      title="Advanced AI Background Generation"
                      description="Create custom backgrounds using AI with text prompts and style controls."
                      status="in-progress"
                      quarter="Q1 2025"
                      features={[
                        "Text-to-image background generation",
                        "Style and mood controls",
                        "Brand color integration",
                        "Real-time preview",
                      ]}
                      votes={342}
                    />
                    <RoadmapItem
                      title="Multi-Host Streaming"
                      description="Enable multiple hosts in a single stream with AI-powered switching and mixing."
                      status="planned"
                      quarter="Q1 2025"
                      features={[
                        "Up to 6 simultaneous hosts",
                        "AI-powered camera switching",
                        "Individual audio controls",
                        "Host invitation system",
                      ]}
                      votes={289}
                    />
                    <RoadmapItem
                      title="AI Voice Synthesis & Translation"
                      description="Real-time voice translation and AI voice synthesis for global audiences."
                      status="research"
                      quarter="Q3 2025"
                      features={[
                        "Real-time voice translation",
                        "AI voice cloning",
                        "Accent adaptation",
                        "Multi-language support",
                      ]}
                      votes={234}
                    />
                    <RoadmapItem
                      title="AI-Powered Content Suggestions"
                      description="Get personalized content recommendations based on your audience and trending topics."
                      status="planned"
                      quarter="Q2 2025"
                      features={[
                        "Trending topic analysis",
                        "Audience preference insights",
                        "Content calendar integration",
                        "Performance predictions",
                      ]}
                      votes={198}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Community Feedback */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-orange-800 dark:text-orange-300">Shape Our Future</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Your feedback drives our development. Vote on features or suggest new ideas.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                  Suggest a Feature
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50"
                >
                  Join Community Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
