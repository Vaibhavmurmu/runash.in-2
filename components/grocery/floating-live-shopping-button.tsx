"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FloatingLiveShoppingButton() {
  const [isLive, setIsLive] = useState(true)
  const [viewerCount, setViewerCount] = useState(1247)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate real-time viewer count updates
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 5)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    router.push("/grocery/live")
  }

  if (!isVisible || !isLive) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 group"
      >
        {/* Pulsing animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20"></div>

        <div className="relative flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <Play className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Live Shopping</span>
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Users className="h-3 w-3" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>
          </div>

          <Zap className="h-4 w-4 text-yellow-300" />
        </div>

        {/* Special offer badge */}
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs animate-bounce">20% OFF</Badge>
      </Button>
    </div>
  )
}
