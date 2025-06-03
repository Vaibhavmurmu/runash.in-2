"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MoreVertical,
  Crown,
  Shield,
  User,
  Volume2,
  VolumeX,
  Maximize,
  Signal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WebRTCService, type PeerConnectionData } from "@/services/webrtc-service"
import type { Host, HostRole, LayoutConfiguration } from "@/types/multi-host"
import { toast } from "@/components/ui/use-toast"

interface WebRTCVideoGridProps {
  hosts: Host[]
  layout: LayoutConfiguration
  currentUserId: string
  onLayoutChange?: (layout: Partial<LayoutConfiguration>) => void
}

interface VideoStreamData {
  hostId: string
  stream: MediaStream | null
  isLocal: boolean
  connectionState?: RTCPeerConnectionState
  iceConnectionState?: RTCIceConnectionState
}

export function WebRTCVideoGrid({ hosts, layout, currentUserId, onLayoutChange }: WebRTCVideoGridProps) {
  const [videoStreams, setVideoStreams] = useState<VideoStreamData[]>([])
  const [connections, setConnections] = useState<PeerConnectionData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [mutedHosts, setMutedHosts] = useState<Set<string>>(new Set())
  const webrtcService = WebRTCService.getInstance()
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    initializeWebRTC()

    // Set up event listeners
    const unsubscribeConnections = webrtcService.onConnectionChange((updatedConnections) => {
      setConnections(updatedConnections)
    })

    const unsubscribeStreams = webrtcService.onStreamChange((hostId, stream) => {
      setVideoStreams((prev) => {
        const existing = prev.find((vs) => vs.hostId === hostId)
        if (existing) {
          return prev.map((vs) => (vs.hostId === hostId ? { ...vs, stream } : vs))
        } else {
          return [...prev, { hostId, stream, isLocal: hostId === "local" }]
        }
      })
    })

    const unsubscribeDataChannel = webrtcService.onDataChannelMessage((hostId, data) => {
      handleDataChannelMessage(hostId, data)
    })

    return () => {
      unsubscribeConnections()
      unsubscribeStreams()
      unsubscribeDataChannel()
    }
  }, [])

  useEffect(() => {
    // Update video elements when streams change
    videoStreams.forEach((streamData) => {
      const videoElement = videoRefs.current.get(streamData.hostId)
      if (videoElement && streamData.stream) {
        videoElement.srcObject = streamData.stream
      }
    })
  }, [videoStreams])

  useEffect(() => {
    // Create peer connections for new hosts
    hosts.forEach((host) => {
      if (host.id !== currentUserId && !connections.find((c) => c.hostId === host.id)) {
        createPeerConnection(host.id)
      }
    })
  }, [hosts, connections, currentUserId])

  const initializeWebRTC = async () => {
    try {
      // Initialize local stream
      const localStream = await webrtcService.initializeLocalStream(true, true)

      setVideoStreams([
        {
          hostId: "local",
          stream: localStream,
          isLocal: true,
        },
      ])

      setIsInitialized(true)

      toast({
        title: "WebRTC Initialized",
        description: "Camera and microphone are ready for multi-host streaming.",
      })
    } catch (error) {
      console.error("Failed to initialize WebRTC:", error)
      toast({
        title: "WebRTC Initialization Failed",
        description: "Please check your camera and microphone permissions.",
        variant: "destructive",
      })
    }
  }

  const createPeerConnection = async (hostId: string) => {
    try {
      const isInitiator = currentUserId < hostId // Simple way to determine initiator
      const peerData = await webrtcService.createPeerConnection(hostId, isInitiator)

      if (isInitiator) {
        // Create and send offer
        await webrtcService.createOffer(hostId)
      }

      toast({
        title: "Connecting to Host",
        description: `Establishing connection with ${hosts.find((h) => h.id === hostId)?.name || hostId}...`,
      })
    } catch (error) {
      console.error("Failed to create peer connection:", error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${hosts.find((h) => h.id === hostId)?.name || hostId}.`,
        variant: "destructive",
      })
    }
  }

  const handleDataChannelMessage = (hostId: string, data: any) => {
    switch (data.type) {
      case "video-toggle":
        // Handle remote host video toggle
        break
      case "audio-toggle":
        // Handle remote host audio toggle
        break
      case "chat-message":
        // Handle private host chat message
        break
    }
  }

  const toggleLocalVideo = () => {
    const currentHost = hosts.find((h) => h.id === currentUserId)
    if (!currentHost) return

    const newState = !currentHost.settings.isCameraEnabled
    webrtcService.toggleVideo(newState)

    // Update host settings would be handled by parent component
    toast({
      title: newState ? "Camera Enabled" : "Camera Disabled",
      description: `Your camera has been ${newState ? "enabled" : "disabled"}.`,
    })
  }

  const toggleLocalAudio = () => {
    const currentHost = hosts.find((h) => h.id === currentUserId)
    if (!currentHost) return

    const newState = !currentHost.settings.isMicrophoneEnabled
    webrtcService.toggleAudio(newState)

    toast({
      title: newState ? "Microphone Enabled" : "Microphone Disabled",
      description: `Your microphone has been ${newState ? "enabled" : "disabled"}.`,
    })
  }

  const toggleRemoteAudio = (hostId: string) => {
    const isMuted = mutedHosts.has(hostId)
    const videoElement = videoRefs.current.get(hostId)

    if (videoElement) {
      videoElement.muted = !isMuted

      if (isMuted) {
        setMutedHosts((prev) => {
          const newSet = new Set(prev)
          newSet.delete(hostId)
          return newSet
        })
      } else {
        setMutedHosts((prev) => new Set(prev).add(hostId))
      }
    }
  }

  const startScreenShare = async () => {
    try {
      await webrtcService.startScreenShare()
      toast({
        title: "Screen Sharing Started",
        description: "You are now sharing your screen with other hosts.",
      })
    } catch (error) {
      console.error("Failed to start screen share:", error)
      toast({
        title: "Screen Share Failed",
        description: "Failed to start screen sharing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopScreenShare = async () => {
    try {
      await webrtcService.stopScreenShare()
      toast({
        title: "Screen Sharing Stopped",
        description: "You have stopped sharing your screen.",
      })
    } catch (error) {
      console.error("Failed to stop screen share:", error)
    }
  }

  const getConnectionQuality = (hostId: string): "excellent" | "good" | "poor" | "disconnected" => {
    const connection = connections.find((c) => c.hostId === hostId)
    if (!connection) return "disconnected"

    switch (connection.iceConnectionState) {
      case "connected":
      case "completed":
        return "excellent"
      case "checking":
        return "good"
      case "disconnected":
      case "failed":
        return "poor"
      default:
        return "disconnected"
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getRoleIcon = (role: HostRole) => {
    switch (role) {
      case "primary":
        return <Crown className="h-3 w-3 text-amber-500" />
      case "moderator":
        return <Shield className="h-3 w-3 text-blue-500" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getGridClassName = () => {
    const count = hosts.length
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    if (count === 3) return "grid-cols-3"
    if (count === 4) return "grid-cols-2 grid-rows-2"
    if (count > 4) return "grid-cols-3 grid-rows-2"
    return "grid-cols-2"
  }

  const getHostCardClassName = (host: Host) => {
    if (layout.type === "spotlight" && layout.primaryHostId === host.id) {
      return "col-span-2 row-span-2"
    }
    return ""
  }

  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Initializing WebRTC...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid gap-2 h-full ${getGridClassName()}`}>
      {hosts.map((host) => {
        const streamData = videoStreams.find(
          (vs) => vs.hostId === host.id || (host.id === currentUserId && vs.hostId === "local"),
        )
        const quality = getConnectionQuality(host.id)
        const isLocalHost = host.id === currentUserId
        const displayHostId = isLocalHost ? "local" : host.id

        return (
          <Card key={host.id} className={`relative overflow-hidden bg-black ${getHostCardClassName(host)}`}>
            {/* Video Element */}
            <video
              ref={(el) => {
                if (el) {
                  videoRefs.current.set(displayHostId, el)
                }
              }}
              autoPlay
              playsInline
              muted={isLocalHost || mutedHosts.has(host.id)}
              className="w-full h-full object-cover"
              style={{ transform: isLocalHost ? "scaleX(-1)" : "none" }} // Mirror local video
            />

            {/* Fallback when no video */}
            {(!streamData?.stream || !host.settings.isCameraEnabled) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                {host.settings.isCameraEnabled ? (
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm opacity-70">Connecting...</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <CameraOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-70">Camera Off</p>
                  </div>
                )}
              </div>
            )}

            {/* Host Info Overlay */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="bg-black/50 backdrop-blur-sm text-white border-white/20 flex items-center gap-1"
                >
                  {getRoleIcon(host.role)}
                  <span className="capitalize">{host.role}</span>
                  {isLocalHost && <span>(You)</span>}
                </Badge>

                {!host.settings.isMicrophoneEnabled && (
                  <Badge variant="outline" className="bg-red-500/80 text-white border-red-400">
                    <MicOff className="h-3 w-3 mr-1" />
                    Muted
                  </Badge>
                )}

                {!isLocalHost && (
                  <Badge
                    variant="outline"
                    className={`bg-black/50 backdrop-blur-sm text-white border-white/20 ${getQualityColor(quality)}`}
                  >
                    <Signal className="h-3 w-3 mr-1" />
                    {quality}
                  </Badge>
                )}
              </div>

              {/* Host Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm">
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{isLocalHost ? "Your Controls" : `${host.name} Controls`}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {isLocalHost ? (
                    <>
                      <DropdownMenuItem onClick={toggleLocalAudio}>
                        {host.settings.isMicrophoneEnabled ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Mute Microphone
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Unmute Microphone
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleLocalVideo}>
                        {host.settings.isCameraEnabled ? (
                          <>
                            <CameraOff className="h-4 w-4 mr-2" />
                            Turn Off Camera
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4 mr-2" />
                            Turn On Camera
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={startScreenShare}>
                        <Maximize className="h-4 w-4 mr-2" />
                        Share Screen
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => toggleRemoteAudio(host.id)}>
                        {mutedHosts.has(host.id) ? (
                          <>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Unmute Audio
                          </>
                        ) : (
                          <>
                            <VolumeX className="h-4 w-4 mr-2" />
                            Mute Audio
                          </>
                        )}
                      </DropdownMenuItem>
                      {layout.type === "spotlight" && (
                        <DropdownMenuItem onClick={() => onLayoutChange?.({ primaryHostId: host.id })}>
                          <Crown className="h-4 w-4 mr-2" />
                          Make Spotlight
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Host Name Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-white text-sm flex items-center gap-1">
                {host.name}
                {host.settings.isMicrophoneEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
