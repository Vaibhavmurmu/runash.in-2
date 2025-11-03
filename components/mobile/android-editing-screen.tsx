import { Sliders, Wand2 } from "lucide-react"

interface AndroidEditingScreenProps {
  onNavigate: (screen: string) => void
}

export default function AndroidEditingScreen({ onNavigate }: AndroidEditingScreenProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Video Canvas */}
      <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent" />
        <p className="text-muted-foreground text-xs">Video Preview</p>
      </div>

      {/* Effects Gallery */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Effects</h2>
        <div className="grid grid-cols-4 gap-2">
          {["Classic", "Neon", "Film", "Retro"].map((effect) => (
            <button key={effect} className="bg-card rounded-lg p-3 text-center hover:bg-primary/20 transition-colors">
              <div className="text-2xl mb-1">✨</div>
              <span className="text-xs font-medium">{effect}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Tools */}
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Auto Edit</span>
        </button>
        <button className="bg-card rounded-lg p-4 flex items-center gap-2 hover:bg-card/80 transition-colors">
          <Sliders className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Adjust</span>
        </button>
      </div>

      {/* Export */}
      <button className="w-full bg-gradient-to-r from-primary to-accent rounded-lg py-3 text-white font-semibold">
        Export
      </button>
    </div>
  )
}
