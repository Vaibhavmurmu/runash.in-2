"use client"

import { useState } from "react"
import IosHeader from "@/components/mobile/ios-header"
import IosHomeScreen from "@/components/mobile/ios-home-screen"
import IosEditingScreen from "@/components/mobile/ios-editing-screen"
import IosLiveStream from "@/components/mobile/ios-live-stream"
import IosAiFeatures from "@/components/mobile/ios-ai-features"

export default function IosApp() {
  const [currentScreen, setCurrentScreen] = useState("home")

  const screens = {
    home: <IosHomeScreen onNavigate={setCurrentScreen} />,
    editing: <IosEditingScreen onNavigate={setCurrentScreen} />,
    stream: <IosLiveStream onNavigate={setCurrentScreen} />,
    ai: <IosAiFeatures onNavigate={setCurrentScreen} />,
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-full max-w-sm">
        <div
          className="relative bg-black rounded-3xl border-8 border-black shadow-2xl"
          style={{ aspectRatio: "9/19.5" }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 bg-black rounded-b-3xl px-8 py-1">
            <div className="w-32 h-7 bg-black rounded-full"></div>
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-background text-foreground overflow-hidden rounded-2xl pt-8 flex flex-col">
            <IosHeader onNavigate={setCurrentScreen} />
            <div className="flex-1 overflow-y-auto">{screens[currentScreen as keyof typeof screens]}</div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
