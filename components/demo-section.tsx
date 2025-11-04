"use client"
import { Play } from "lucide-react"

export default function DemoSection() {
  return (
    <section
      id="demo"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">See RunAsh AI in Action</h2>
          <p className="text-lg text-foreground/70 text-balance">
            Watch how creators transform their content with our powerful live editing platform.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-background rounded-3xl border border-primary/20 overflow-hidden shadow-2xl">
          <div className="aspect-video bg-black/20 flex items-center justify-center relative group cursor-pointer">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <p className="text-foreground/70 font-medium">Click to play demo video</p>
            </div>

            <svg
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              viewBox="0 0 1200 600"
            >
              <rect
                x="50"
                y="50"
                width="1100"
                height="500"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="2"
                rx="30"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Processing Time", value: "< 100ms", icon: "⚡" },
            { label: "Stream Quality", value: "4K @ 60fps", icon: "🎬" },
            { label: "AI Accuracy", value: "99.8%", icon: "🎯" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-card border border-border/50">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-foreground/70 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
