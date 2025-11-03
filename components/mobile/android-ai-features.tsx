interface AndroidAiFeaturesProps {
  onNavigate: (screen: string) => void
}

export default function AndroidAiFeatures({ onNavigate }: AndroidAiFeaturesProps) {
  const features = [
    { icon: "✨", title: "Auto Captions", desc: "Real-time captioning" },
    { icon: "🎨", title: "Smart Effects", desc: "Intelligent suggestions" },
    { icon: "⚡", title: "Quick Edits", desc: "AI-assisted tools" },
    { icon: "🚀", title: "Boost", desc: "Auto enhancement" },
  ]

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI Features</h1>

      <div className="space-y-2">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 flex items-start gap-3 border border-primary/30"
          >
            <span className="text-2xl">{feature.icon}</span>
            <div>
              <h3 className="font-bold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold">
        Explore AI Suite
      </button>
    </div>
  )
}
