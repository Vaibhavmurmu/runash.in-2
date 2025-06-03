"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
  Clock,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { DVRState } from "@/types/live-shopping"

interface DVRControlsProps {
  dvrState: DVRState
  isLive: boolean
  onSeek: (position: number) => void
  onPlayPause: () => void
  onGoLive: () => void
  onSpeedChange: (speed: number) => void
  onQualityChange: (quality: string) => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  volume: number
  isMuted: boolean
  isPlaying: boolean
  isFullscreen: boolean
  className?: string
}

export default function DVRControls({
  dvrState,
  isLive,
  onSeek,
  onPlayPause,
  onGoLive,
  onSpeedChange,
  onQualityChange,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  volume,
  isMuted,
  isPlaying,
  isFullscreen,
  className = "",
}: DVRControlsProps) {
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>()

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (!isDragging) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleSeekStart = () => {
    setIsDragging(true)
  }

  const handleSeekEnd = () => {
    setIsDragging(false)
  }

  const skipBackward = () => {
    const newPosition = Math.max(0, dvrState.currentPosition - 10)
    onSeek(newPosition)
  }

  const skipForward = () => {
    const newPosition = Math.min(dvrState.bufferDuration, dvrState.currentPosition + 10)
    onSeek(newPosition)
  }

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0"
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="p-4 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-white text-sm">
            <span>{formatTime(dvrState.currentPosition)}</span>
            <div className="flex items-center gap-2">
              {!isLive && (
                <Badge variant="outline" className="bg-red-500/20 border-red-500 text-red-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor((dvrState.bufferDuration - dvrState.currentPosition) / 60)}m behind
                </Badge>
              )}
              {dvrState.playbackSpeed !== 1 && (
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-400">
                  {dvrState.playbackSpeed}x
                </Badge>
              )}
            </div>
            <span>{formatTime(dvrState.bufferDuration)}</span>
          </div>
          <Slider
            value={[dvrState.currentPosition]}
            max={dvrState.bufferDuration}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            onPointerDown={handleSeekStart}
            onPointerUp={handleSeekEnd}
            className="w-full"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={skipBackward}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skip back 10s</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onPlayPause}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause" : "Play"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={skipForward}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Skip forward 10s</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isLive && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 bg-red-500/20"
                      onClick={onGoLive}
                    >
                      <Zap className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to live</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onToggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => onVolumeChange(value[0])}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4 mr-1" />
                  {dvrState.playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {speedOptions.map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => onSpeedChange(speed)}
                    className={dvrState.playbackSpeed === speed ? "bg-orange-50 dark:bg-orange-950/20" : ""}
                  >
                    {speed}x {speed === 1 && "(Normal)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quality Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  {dvrState.currentQuality}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Video Quality</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dvrState.availableQualities.map((quality) => (
                  <DropdownMenuItem
                    key={quality}
                    onClick={() => onQualityChange(quality)}
                    className={dvrState.currentQuality === quality ? "bg-orange-50 dark:bg-orange-950/20" : ""}
                  >
                    {quality}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onToggleFullscreen}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
