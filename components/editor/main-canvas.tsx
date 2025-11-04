"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Download, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import MediaControls from "./media-controls"

interface MainCanvasProps {
  selectedModel: string
  isRecording: boolean
}

interface TimelineSegment {
  id: string
  start: number
  duration: number
  label: string
}

export default function MainCanvas({ selectedModel, isRecording }: MainCanvasProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [segments, setSegments] = useState<TimelineSegment[]>([
    { id: "1", start: 0, duration: 3, label: "Intro" },
    { id: "2", start: 3, duration: 4, label: "Content" },
    { id: "3", start: 7, duration: 3, label: "Outro" },
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const handleGenerateVideo = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 300)
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickRatio = clickX / rect.width
    setCurrentTime(clickRatio * duration)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex-1 flex flex-col bg-background p-4 overflow-hidden gap-3">
      {/* Main preview area */}
      <div className="flex-1 bg-gradient-to-b from-card to-background rounded-lg border border-border overflow-hidden relative group shadow-lg">
        <div className="w-full h-full flex items-center justify-center bg-black/50">
          <canvas ref={canvasRef} className="w-full h-full max-w-4xl max-h-full object-contain" />
          <video ref={videoRef} className="hidden w-full h-full" crossOrigin="anonymous" />

          {/* Generation in progress overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-white font-semibold">Generating video...</p>
                <p className="text-white/70 text-sm mt-1">{Math.round(generationProgress)}%</p>
              </div>
              <Progress value={generationProgress} className="w-48 h-2" />
            </div>
          )}
        </div>

        {/* Playback controls - compact version */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <MediaControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            volume={volume}
            onVolumeChange={setVolume}
            currentTime={currentTime}
            duration={duration}
            onSeek={setCurrentTime}
            compact
          />
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 hover:bg-red-600/90 px-3 py-2 rounded-full text-white text-sm transition-colors">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Recording
          </div>
        )}
      </div>

      {/* Advanced controls section */}
      {showAdvancedControls && (
        <div className="bg-card border border-border rounded-lg p-4">
          <MediaControls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            volume={volume}
            onVolumeChange={setVolume}
            currentTime={currentTime}
            duration={duration}
            onSeek={setCurrentTime}
            onSettings={() => setShowAdvancedControls(false)}
          />
        </div>
      )}

      {/* Timeline with segments */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
          <span className="text-xs text-muted-foreground">
            Model: <span className="font-medium text-foreground">{selectedModel.toUpperCase()}</span>
          </span>
        </div>

        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="w-full h-12 bg-background border border-border rounded cursor-pointer hover:border-primary/50 transition-colors relative"
        >
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="absolute h-full bg-gradient-to-r from-primary/70 to-accent/70 hover:from-primary hover:to-accent rounded transition-colors group cursor-grab active:cursor-grabbing"
              style={{
                left: `${(segment.start / duration) * 100}%`,
                width: `${(segment.duration / duration) * 100}%`,
              }}
              title={segment.label}
            >
              <span className="text-xs font-semibold text-primary-foreground px-2 py-1 truncate block opacity-0 group-hover:opacity-100">
                {segment.label}
              </span>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 h-full w-0.5 bg-white pointer-events-none"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Generate Video</>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="gap-2 bg-transparent"
            title="Advanced Controls"
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
