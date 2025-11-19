'use client'

import { Video, Zap, Users, Lock, Infinity, BarChart } from 'lucide-react'

const features = [
  {
    icon: Video,
    title: 'Real-Time Streaming',
    description: 'Generate and stream videos instantly with minimal latency'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Powered by optimized AI models for rapid processing'
  },
  {
    icon: Users,
    title: 'Multi-Agent',
    description: 'Collaborate with multiple AI agents simultaneously'
  },
  {
    icon: Lock,
    title: 'Secure',
    description: 'Enterprise-grade security and privacy protection'
  },
  {
    icon: Infinity,
    title: 'Scalable',
    description: 'Scale from prototypes to production seamlessly'
  },
  {
    icon: BarChart,
    title: 'Analytics',
    description: 'Track performance and optimize your workflows'
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Powerful <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to create, stream, and collaborate with AI-powered video generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition backdrop-blur-sm"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 rounded-lg transition duration-300" />
                
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
