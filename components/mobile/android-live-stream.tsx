"use client"

import { Heart, MessageCircle, Share, X } from "lucide-react"
import { useState } from "react"

interface AndroidLiveStreamProps {
  onNavigate: (screen: string) => void
}

export default function AndroidLiveStream({ onNavigate }: AndroidLiveStreamProps) {
  const [isLive, setIsLive] = useState(true)

  return (
    <div className="w-full h-full flex flex-col">
      {/* Stream Video */}
      <div className="bg-black flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-transparent" />
        {isLive && (
          <>
            <div className="absolute top-4 left-4 bg-red-500 rounded-full px-3 py-1 flex items-center gap-1 z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white">LIVE</span>
            </div>
            <div className="text-white text-center">
              <h2 className="text-xl font-bold">Live Stream</h2>
            </div>
          </>
        )}
      </div>

      {/* Stream Overlay Info */}
      <div className="bg-card p-3 border-t border-border/20 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">👥 1.2K watching</p>
          <p className="text-sm font-bold">RunAsh Live</p>
        </div>
        <button className="text-primary" onClick={() => setIsLive(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 flex items-center justify-around border-t border-border/20">
        <button className="flex flex-col items-center gap-1 flex-1">
          <Heart className="w-6 h-6 text-accent" />
          <span className="text-xs">Like</span>
        </button>
        <button className="flex flex-col items-center gap-1 flex-1">
          <MessageCircle className="w-6 h-6 text-primary" />
          <span className="text-xs">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1 flex-1">
          <Share className="w-6 h-6 text-primary" />
          <span className="text-xs">Share</span>
        </button>
      </div>
    </div>
  )
}
