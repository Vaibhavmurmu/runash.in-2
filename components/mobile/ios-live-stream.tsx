"use client"

import { Heart, Users, Share2, Volume2 } from "lucide-react"
import { useState } from "react"

interface IosLiveStreamProps {
  onNavigate: (screen: string) => void
}

export default function IosLiveStream({ onNavigate }: IosLiveStreamProps) {
  const [isLive, setIsLive] = useState(true)

  return (
    <div className="p-4 space-y-4">
      {/* Live Stream Container */}
      <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-transparent" />
        {isLive && (
          <div className="absolute top-3 left-3 bg-red-500 rounded-full px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-white">LIVE</span>
          </div>
        )}
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold">Live Stream</h2>
        </div>
      </div>

      {/* Stream Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-lg p-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Viewers</p>
            <p className="text-lg font-bold">1,234</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Likes</p>
            <p className="text-lg font-bold">456</p>
          </div>
        </div>
      </div>

      {/* Chat Preview */}
      <div className="bg-card rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Live Chat</p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">User {i}</p>
                <p className="text-xs text-muted-foreground truncate">Amazing stream!</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stream Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button className="bg-card rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-card/80 transition-colors">
          <Heart className="w-4 h-4 text-accent" />
          <span className="text-xs">Like</span>
        </button>
        <button className="bg-card rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-card/80 transition-colors">
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="text-xs">Sound</span>
        </button>
        <button className="bg-card rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-card/80 transition-colors">
          <Share2 className="w-4 h-4 text-primary" />
          <span className="text-xs">Share</span>
        </button>
      </div>

      {/* End Stream Button */}
      <button
        onClick={() => setIsLive(false)}
        className="w-full bg-red-500/80 hover:bg-red-600 text-white rounded-lg py-3 font-semibold transition-colors"
      >
        End Stream
      </button>
    </div>
  )
}
