"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Monitor, Layout, X, Maximize2, Minimize2, Settings, Volume2, Pause, Play, Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ScreenShareProps {
  isActive: boolean
  onStart: (stream: MediaStream) => void
  onStop: () => void
  streamParticipants?: string[] // avatar urls or names
}

export default function ScreenShare({ isActive, onStart, onStop, streamParticipants }: ScreenShareProps) {
  const [isSharing, setIsSharing] = useState(isActive)
  const [selectedScreen, setSelectedScreen] = useState<string>("entire-screen")
  const [frameRate, setFrameRate] = useState<number>(30)
  const [showCursor, setShowCursor] = useState<boolean>(true)
  const [audioCapture, setAudioCapture] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [stats, setStats] = useState<{ framerate?: number; bitrate?: number }>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  // Update isSharing when isActive prop changes
  useEffect(() => {
    setIsSharing(isActive)
  }, [isActive])

  // Start screen sharing with selected constraints
  const startScreenShare = async () => {
    setErrorMsg(null)
    try {
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: showCursor ? "always" : "never",
          frameRate: { ideal: frameRate, max: 60 },
        },
        audio: audioCapture,
      }

      // For browser security, getDisplayMedia only allows the user to select – you cannot programmatically force a window/tab.
      // However, you can hint to the dialog with 'preferCurrentTab'.

      // (bonus: programmatically select what to share is not supported, but it's UI-driven below!)
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

      // Track stats, framerate, etc. Live statistics API is only available in WebRTC.
      if (stream.getVideoTracks().length > 0) {
        const track = stream.getVideoTracks()[0]
        const updateStats = () => {
          setStats({
            framerate: track.getSettings().frameRate,
            // No bitrate available without WebRTC, so omit or fake here
          })
        }
        updateStats()
        track.addEventListener("ended", () => {
          stopScreenShare()
        })
        track.addEventListener("overconstrained", () => {
          setErrorMsg("Requested sharing options aren't supported on your device.")
        })
      }

      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsSharing(true)
      onStart(stream)
    } catch (error: any) {
      setErrorMsg(error?.message || "Error starting screen share")
      setIsSharing(false)
    }
  }

  const stopScreenShare = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsSharing(false)
    setIsRecording(false)
    setIsPaused(false)
    onStop()
  }

  const toggleScreenShare = () => {
    if (isSharing) {
      stopScreenShare()
    } else {
      startScreenShare()
    }
  }

  // Fullscreen toggling
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        setErrorMsg(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Recording
  const handleStartRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    if (!stream) return
    recordedChunksRef.current = []
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data)
    }
    recorder.onstop = () => {
      // Save or preview the recorded file
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    }
    recorder.start()
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-medium">Screen Sharing</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Screen Sharing Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="screen-select">Share</Label>
                  <Select value={selectedScreen} onValueChange={setSelectedScreen}>
                    <SelectTrigger id="screen-select">
                      <SelectValue placeholder="Select what to share" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entire-screen">Entire Screen</SelectItem>
                      <SelectItem value="application-window">Application Window</SelectItem>
                      <SelectItem value="browser-tab">Browser Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frame-rate">Frame Rate: {frameRate} fps</Label>
                  <Slider
                    id="frame-rate"
                    min={15}
                    max={60}
                    step={5}
                    value={[frameRate]}
                    onValueChange={(value) => setFrameRate(value[0])}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-cursor">Show Cursor</Label>
                  <Switch id="show-cursor" checked={showCursor} onCheckedChange={setShowCursor} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="audio-capture">Capture System Audio</Label>
                  <Switch id="audio-capture" checked={audioCapture} onCheckedChange={setAudioCapture} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant={isSharing ? "destructive" : "default"}
            onClick={toggleScreenShare}
            className={isSharing ? "" : "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"}
          >
            {isSharing ? "Stop Sharing" : "Start Sharing"}
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
        {isSharing ? (
          <div className="aspect-video relative">
            <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button variant="secondary" size="icon" className="bg-black/50 hover:bg-black/70 text-white" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="secondary" size="icon" className="bg-black/50 hover:bg-black/70 text-white" onClick={stopScreenShare}>
                <X className="h-4 w-4" />
              </Button>
              {!isRecording ? (
                <Button variant="secondary" size="icon" onClick={handleStartRecording} className="bg-black/50 text-white">
                  <Video className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button variant="secondary" size="icon" onClick={handleStopRecording} className="bg-black/50 text-red-500">
                    <Video className="h-4 w-4" />
                  </Button>
                  {!isPaused ? (
                    <Button variant="secondary" size="icon" onClick={handlePauseRecording} className="bg-black/50 text-white">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="secondary" size="icon" onClick={handleResumeRecording} className="bg-black/50 text-white">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              {audioCapture && (
                <Button variant="secondary" size="icon" className="bg-black/50 text-white" disabled>
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Live stats display */}
            <div className="absolute top-2 left-2 px-3 py-1 bg-black bg-opacity-60 rounded text-sm text-white">
              <div>FPS: {stats.framerate || "?"}</div>
              {/* Bitrate only if you pipe into WebRTC */}
            </div>
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layout className="h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium mb-2">No screen being shared</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Share your screen for tutorials and demonstrations
              </p>
              <Button onClick={startScreenShare} className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
                Start Screen Sharing
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      {isSharing && (
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-300 flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p>You are currently sharing your screen. Everyone in your stream can see what you're sharing.</p>
          </div>
          {streamParticipants && (
            <div className="ml-6 flex items-center">
              <span className="mr-2 font-semibold">Viewers:</span>
              <div className="flex -space-x-2">
                {streamParticipants.map((p, i) => (
                  <img src={p} key={i} className="w-8 h-8 rounded-full border-2 border-white shadow" alt={`Participant ${i + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 text-sm text-red-800 dark:text-red-300 mt-2">
          {errorMsg}
        </div>
      )}
    </div>
  )
  }
