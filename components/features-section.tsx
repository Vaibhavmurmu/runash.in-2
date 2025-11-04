"use client"

import type React from "react"

import { Zap, Palette, Share2, Lock, BarChart3, Cpu } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time video generation",
    description: "Generate and stream AI-powered videos in real time from your prompts",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time video clips",
    description: "Generate and edit your real-time video into viral short-form reel from your prompts",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Editing",
    description: "Edit your streams live with instant updates. No lag, no delays. Pure speed.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "AI Effects & Filters",
    description: "Professional effects powered by machine learning. Create studio-quality content.",
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Multi-Platform Streaming",
    description: "Stream simultaneously to TikTok, YouTube, Twitch, and more from one dashboard.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-level encryption. Your streams and data are protected with military-grade security.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Advanced Analytics",
    description: "Track engagement, viewers, and performance metrics in real-time.",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Assistant",
    description: "Smart automation handles tedious tasks. Focus on creativity, not logistics.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Powerful Features for Creators</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Everything you need to create professional live content with AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
