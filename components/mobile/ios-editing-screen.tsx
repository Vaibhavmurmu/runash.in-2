import { Sliders, Wand2, MessageSquare, Save, Play } from "lucide-react"

interface IosEditingScreenProps {
  onNavigate: (screen: string) => void
}

export default function IosEditingScreen({ onNavigate }: IosEditingScreenProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Video Preview */}
      <div className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent" />
        <div className="text-center text-muted-foreground">
          <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Video Preview</p>
        </div>
      </div>

      {/* Editing Tools */}
      <div className="grid grid-cols-3 gap-2">
        <button className="bg-card rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-card/80 transition-colors">
          <Sliders className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Effects</span>
        </button>
        <button className="bg-card rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-card/80 transition-colors">
          <Wand2 className="w-5 h-5 text-accent" />
          <span className="text-xs font-medium">AI Edit</span>
        </button>
        <button className="bg-card rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-card/80 transition-colors">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Caption</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Timeline</p>
        <div className="w-full h-12 bg-black/50 rounded-lg border border-border/20 flex items-center px-2">
          <div className="w-1 h-full bg-primary rounded mr-2" />
          <div className="flex-1 h-full flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 h-full bg-primary/20 rounded-sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full bg-gradient-to-r from-primary to-accent rounded-lg py-3 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <Save className="w-4 h-4" />
        Save Edit
      </button>
    </div>
  )
}
