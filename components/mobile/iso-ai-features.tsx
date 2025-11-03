import { Sparkles, Zap, Brain, Wand2 } from "lucide-react"

interface IosAiFeaturesProps {
  onNavigate: (screen: string) => void
}

export default function IosAiFeatures({ onNavigate }: IosAiFeaturesProps) {
  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Auto Captions",
      description: "AI-powered real-time captions",
      gradient: "from-primary to-accent",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Effects",
      description: "Intelligent effect suggestions",
      gradient: "from-accent to-primary",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Edits",
      description: "AI-assisted editing tools",
      gradient: "from-primary via-accent to-primary",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Enhance",
      description: "Automatic video enhancement",
      gradient: "from-accent to-orange-600",
    },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Features</h2>
        <p className="text-sm text-muted-foreground">Powered by advanced machine learning</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${feature.gradient} rounded-xl p-4 text-white overflow-hidden relative`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-xs opacity-90">{feature.description}</p>
                </div>
              </div>
              <button className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors mt-2 w-fit">
                Try Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Stats */}
      <div className="bg-card rounded-xl p-4 space-y-3 mt-4">
        <p className="text-xs font-semibold text-muted-foreground">AI Performance</p>
        <div className="space-y-2">
          {[
            { label: "Accuracy", value: "98.5%" },
            { label: "Processing Speed", value: "Real-time" },
            { label: "Models", value: "12 Active" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="text-sm font-semibold text-primary">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
