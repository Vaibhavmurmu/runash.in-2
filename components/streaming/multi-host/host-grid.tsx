"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Camera, CameraOff, MoreVertical, Crown, Shield, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Host, HostRole, LayoutConfiguration } from "@/types/multi-host"
import { MultiHostService } from "@/services/multi-host-service"
import { toast } from "@/components/ui/use-toast"

interface HostGridProps {
  layout: LayoutConfiguration
  currentUserId: string
  onLayoutChange?: (layout: Partial<LayoutConfiguration>) => void
}

export function HostGrid({ layout, currentUserId, onLayoutChange }: HostGridProps) {
  const [hosts, setHosts] = useState<Host[]>([])
  const multiHostService = MultiHostService.getInstance()

  useEffect(() => {
    const session = multiHostService.getCurrentSession()
    if (session) {
      setHosts(session.hosts)
    }

    const unsubscribe = multiHostService.onHostsChange((updatedHosts) => {
      setHosts(updatedHosts)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleToggleMicrophone = (hostId: string, isMuted: boolean) => {
    multiHostService
      .updateHostSettings(hostId, {
        settings: {
          isMicrophoneEnabled: !isMuted,
        } as any,
      })
      .then(() => {
        toast({
          title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
          description: `${hosts.find((h) => h.id === hostId)?.name}'s microphone has been ${isMuted ? "unmuted" : "muted"}.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update microphone",
          description: "There was an error updating the microphone settings.",
          variant: "destructive",
        })
      })
  }

  const handleToggleCamera = (hostId: string, isCameraOn: boolean) => {
    multiHostService
      .updateHostSettings(hostId, {
        settings: {
          isCameraEnabled: !isCameraOn,
        } as any,
      })
      .then(() => {
        toast({
          title: isCameraOn ? "Camera Turned Off" : "Camera Turned On",
          description: `${hosts.find((h) => h.id === hostId)?.name}'s camera has been ${isCameraOn ? "turned off" : "turned on"}.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update camera",
          description: "There was an error updating the camera settings.",
          variant: "destructive",
        })
      })
  }

  const handleRemoveHost = (hostId: string) => {
    multiHostService
      .removeHost(hostId)
      .then(() => {
        toast({
          title: "Host Removed",
          description: `${hosts.find((h) => h.id === hostId)?.name} has been removed from the stream.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to remove host",
          description: "There was an error removing the host from the stream.",
          variant: "destructive",
        })
      })
  }

  const handleMakeActive = (hostId: string) => {
    multiHostService
      .setActiveHost(hostId)
      .then(() => {
        if (layout.type === "spotlight") {
          onLayoutChange?.({ primaryHostId: hostId })
        }
      })
      .catch((error) => {
        toast({
          title: "Failed to set active host",
          description: "There was an error setting the active host.",
          variant: "destructive",
        })
      })
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

  return (
    <div className={`grid gap-2 h-full ${getGridClassName()}`}>
      {hosts.map((host) => (
        <Card
          key={host.id}
          className={`relative overflow-hidden bg-black ${getHostCardClassName(host)}`}
          onClick={() => handleMakeActive(host.id)}
        >
          {/* Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {host.settings.isCameraEnabled ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {/* This would be a real video in production */}
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 w-20 h-20 flex items-center justify-center text-white text-xl font-bold">
                  {host.name.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <CameraOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-70">Camera Off</p>
                </div>
              </div>
            )}
          </div>

          {/* Host Info Overlay */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="bg-black/50 backdrop-blur-sm text-white border-white/20 flex items-center gap-1"
              >
                {getRoleIcon(host.role)}
                <span className="capitalize">{host.role}</span>
              </Badge>
              {host.settings.isMicrophoneEnabled ? null : (
                <Badge variant="outline" className="bg-red-500/80 text-white border-red-400">
                  <MicOff className="h-3 w-3 mr-1" />
                  Muted
                </Badge>
              )}
            </div>

            {/* Host Controls */}
            {(currentUserId === host.id || hosts.find((h) => h.id === currentUserId)?.role === "primary") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm">
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Host Controls</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleMicrophone(host.id, host.settings.isMicrophoneEnabled)
                    }}
                  >
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
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleCamera(host.id, host.settings.isCameraEnabled)
                    }}
                  >
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
                  {layout.type === "spotlight" && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onLayoutChange?.({ primaryHostId: host.id })
                      }}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Make Spotlight
                    </DropdownMenuItem>
                  )}
                  {host.id !== currentUserId && hosts.find((h) => h.id === currentUserId)?.role === "primary" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveHost(host.id)
                        }}
                      >
                        Remove from Stream
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Host Name Overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-white text-sm">
              {host.name}
              {host.settings.isMicrophoneEnabled ? (
                <Mic className="h-3 w-3 ml-1 inline-block" />
              ) : (
                <MicOff className="h-3 w-3 ml-1 inline-block" />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
