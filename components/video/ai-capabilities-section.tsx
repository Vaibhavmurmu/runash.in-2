'use client'

import { Code, MessageCircle, Workflow, Cpu, MessageSquare, Zap } from 'lucide-react'

const capabilities = [
  {
    icon: MessageCircle,
    title: 'Conversational Interfaces',
    description: 'Natural language processing for intuitive interactions'
  },
  {
    icon: MessageSquare,
    title: 'Advanced Messaging',
    description: 'Structured message handling and routing'
  },
  {
    icon: Code,
    title: 'Code Execution',
    description: 'Safe execution and interpretation of code blocks'
  },
  {
    icon: Workflow,
    title: 'Reasoning Chains',
    description: 'Complex multi-step reasoning with transparency'
  },
  {
    icon: Cpu,
    title: 'Multi-Provider',
    description: 'Support for leading AI models and providers'
  },
  {
    icon: Zap,
    title: 'Real-Time Streaming',
    description: 'Continuous data streaming and response generation'
  },
]

export default function AICapabilitiesSection() {
  return (
    <section id="capabilities" className="relative py-24 bg-background border-t border-border">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            AI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Capabilities</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Leverage cutting-edge AI technologies for advanced video generation and intelligent automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon
            return (
              <div key={idx} className="group bg-card border border-border/50 rounded-lg p-6 hover:border-accent/50 hover:bg-accent/5 transition">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg group-hover:from-primary/30 group-hover:to-accent/30 transition">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{cap.title}</h3>
                    <p className="text-sm text-foreground/60">{cap.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 border-t border-border pt-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tools & Integration</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Function Calling</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>External API Integration</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Custom Tool Definition</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Agent Features</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Autonomous Decision Making</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Context Retention</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Error Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
