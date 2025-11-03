import { Signal, Wifi, Battery } from "lucide-react"

export default function AndroidStatusBar() {
  return (
    <div className="h-6 bg-black px-4 flex items-center justify-between text-foreground text-xs">
      <div className="flex items-center gap-1">
        <Signal className="w-3 h-3" />
        <span className="font-medium">RunAsh</span>
      </div>
      <div className="flex items-center gap-1">
        <Wifi className="w-3 h-3" />
        <Battery className="w-3 h-3" />
      </div>
    </div>
  )
}
