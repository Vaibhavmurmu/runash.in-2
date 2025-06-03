"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserPlus,
  LayoutGrid,
  Settings,
  Crown,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  StopCircle,
  Activity,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import type { Host, LayoutConfiguration, MultiHostSession } from "@/types/multi-host"
import { MultiHostService } from "@/services/multi-host-service"
import { HostInvitationDialog } from "./host-invitation-dialog"
import { WebRTCDiagnostics } from "./webrtc-diagnostics"

interface HostControlsProps {
  currentUserId: string
  isStreaming: boolean
}

export function HostControls({ currentUserId, isStreaming }: HostControlsProps) {
  const [session, setSession] = useState<MultiHostSession | null>(null)
  const [hosts, setHosts] = useState<Host[]>([])
  const [currentHost, setCurrentHost] = useState<Host | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const multiHostService = MultiHostService.getInstance()

  useEffect(() => {
    // Initialize session if streaming
    if (isStreaming && !session) {
      multiHostService.createSession(currentUserId).catch((error) => {
        toast({
          title: "Failed to create multi-host session",
          description: "There was an error creating the multi-host session.",
          variant: "destructive",
        })
      })
    }

    // Subscribe to session changes
    const unsubscribeSession = multiHostService.onSessionChange((updatedSession) => {
      setSession(updatedSession)
    })

    // Subscribe to host changes
    const unsubscribeHosts = multiHostService.onHostsChange((updatedHosts) => {
      setHosts(updatedHosts)
      const host = updatedHosts.find((h) => h.id === currentUserId)
      if (host) {
        setCurrentHost(host)
      }
    })

    return () => {
      unsubscribeSession()
      unsubscribeHosts()
    }
  }, [currentUserId, isStreaming, session])

  const handleToggleMicrophone = () => {
    if (!currentHost) return

    multiHostService
      .updateHostSettings(currentUserId, {
        settings: {
          isMicrophoneEnabled: !currentHost.settings.isMicrophoneEnabled,
        } as any,
      })
      .then(() => {
        toast({
          title: currentHost.settings.isMicrophoneEnabled ? "Microphone Muted" : "Microphone Unmuted",
          description: `Your microphone has been ${currentHost.settings.isMicrophoneEnabled ? "muted" : "unmuted"}.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update microphone",
          description: "There was an error updating your microphone settings.",
          variant: "destructive",
        })
      })
  }

  const handleToggleCamera = () => {
    if (!currentHost) return

    multiHostService
      .updateHostSettings(currentUserId, {
        settings: {
          isCameraEnabled: !currentHost.settings.isCameraEnabled,
        } as any,
      })
      .then(() => {
        toast({
          title: currentHost.settings.isCameraEnabled ? "Camera Turned Off" : "Camera Turned On",
          description: `Your camera has been ${currentHost.settings.isCameraEnabled ? "turned off" : "turned on"}.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update camera",
          description: "There was an error updating your camera settings.",
          variant: "destructive",
        })
      })
  }

  const handleToggleScreenShare = () => {
    if (!currentHost) return

    multiHostService
      .updateHostSettings(currentUserId, {
        settings: {
          isScreenShareEnabled: !currentHost.settings.isScreenShareEnabled,
        } as any,
      })
      .then(() => {
        toast({
          title: currentHost.settings.isScreenShareEnabled ? "Screen Sharing Stopped" : "Screen Sharing Started",
          description: `Your screen sharing has been ${currentHost.settings.isScreenShareEnabled ? "stopped" : "started"}.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update screen sharing",
          description: "There was an error updating your screen sharing settings.",
          variant: "destructive",
        })
      })
  }

  const handleLayoutChange = (layout: Partial<LayoutConfiguration>) => {
    if (!session) return

    multiHostService
      .updateLayout(layout)
      .then(() => {
        toast({
          title: "Layout Updated",
          description: "The stream layout has been updated.",
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to update layout",
          description: "There was an error updating the stream layout.",
          variant: "destructive",
        })
      })
  }

  const handleSimulateAcceptInvitation = () => {
    multiHostService
      .simulateAcceptInvitation("invitation-id")
      .then(() => {
        toast({
          title: "New Host Joined",
          description: "A new host has joined the stream.",
        })
      })
      .catch((error) => {
        toast({
          title: "Failed to add host",
          description: "There was an error adding the host to the stream.",
          variant: "destructive",
        })
      })
  }

  if (!isStreaming || !session) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Start streaming to enable multi-host controls</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Multi-Host Controls</h3>
          <p className="text-sm text-muted-foreground">Manage hosts and stream layout</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800"
          >
            {hosts.length} {hosts.length === 1 ? "Host" : "Hosts"}
          </Badge>
          <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="hosts" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="hosts">
            <Users className="h-4 w-4 mr-2" />
            Hosts
          </TabsTrigger>
          <TabsTrigger value="layout">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="diagnostics">
            <Activity className="h-4 w-4 mr-2" />
            Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hosts" className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Your Controls</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={
                  currentHost?.settings.isMicrophoneEnabled
                    ? ""
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
                }
                onClick={handleToggleMicrophone}
              >
                {currentHost?.settings.isMicrophoneEnabled ? (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Mute
                  </>
                ) : (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Unmute
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  currentHost?.settings.isCameraEnabled
                    ? ""
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
                }
                onClick={handleToggleCamera}
              >
                {currentHost?.settings.isCameraEnabled ? (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </>
                ) : (
                  <>
                    <CameraOff className="h-4 w-4 mr-2" />
                    Camera
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  currentHost?.settings.isScreenShareEnabled
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
                    : ""
                }
                onClick={handleToggleScreenShare}
              >
                {currentHost?.settings.isScreenShareEnabled ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Share
                  </>
                ) : (
                  <>
                    <ScreenShare className="h-4 w-4 mr-2" />
                    Share Screen
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Connected Hosts</h4>
              {currentHost?.role === "primary" && (
                <Button variant="outline" size="sm" onClick={handleSimulateAcceptInvitation}>
                  Simulate Add Host
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {hosts.map((host) => (
                <div key={host.id} className="flex items-center justify-between p-2 rounded-md border bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white font-medium">
                        {host.name.charAt(0)}
                      </div>
                      {host.role === "primary" && <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{host.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{host.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {host.settings.isMicrophoneEnabled ? (
                      <Mic className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MicOff className="h-4 w-4 text-red-500" />
                    )}
                    {host.settings.isCameraEnabled ? (
                      <Camera className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CameraOff className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Layout Type</h4>
            <RadioGroup
              defaultValue={session.layout.type}
              onValueChange={(value) => handleLayoutChange({ type: value as any })}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="grid" id="layout-grid" />
                <Label htmlFor="layout-grid" className="flex flex-col gap-1">
                  <span>Grid</span>
                  <span className="text-xs text-muted-foreground">Equal size for all hosts</span>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="spotlight" id="layout-spotlight" />
                <Label htmlFor="layout-spotlight" className="flex flex-col gap-1">
                  <span>Spotlight</span>
                  <span className="text-xs text-muted-foreground">One host featured larger</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {session.layout.type === "spotlight" && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Spotlight Host</h4>
              <RadioGroup
                defaultValue={session.layout.primaryHostId}
                onValueChange={(value) => handleLayoutChange({ primaryHostId: value })}
                className="space-y-2"
              >
                {hosts.map((host) => (
                  <div key={host.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={host.id} id={`spotlight-${host.id}`} />
                    <Label htmlFor={`spotlight-${host.id}`}>{host.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Host Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="setting-auto-accept">Auto-accept invitations</Label>
                <Switch
                  id="setting-auto-accept"
                  checked={session.settings.autoAcceptInvitations}
                  onCheckedChange={(checked) => {
                    // This would update the session settings in a real app
                    toast({
                      title: "Setting Updated",
                      description: `Auto-accept invitations ${checked ? "enabled" : "disabled"}.`,
                    })
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="setting-record-tracks">Record individual host tracks</Label>
                <Switch
                  id="setting-record-tracks"
                  checked={session.settings.recordIndividualTracks}
                  onCheckedChange={(checked) => {
                    // This would update the session settings in a real app
                    toast({
                      title: "Setting Updated",
                      description: `Record individual host tracks ${checked ? "enabled" : "disabled"}.`,
                    })
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="setting-guest-controls">Allow guest controls</Label>
                <Switch
                  id="setting-guest-controls"
                  checked={session.settings.allowGuestControls}
                  onCheckedChange={(checked) => {
                    // This would update the session settings in a real app
                    toast({
                      title: "Setting Updated",
                      description: `Guest controls ${checked ? "enabled" : "disabled"}.`,
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="diagnostics" className="space-y-4">
          <WebRTCDiagnostics />
        </TabsContent>
      </Tabs>

      <HostInvitationDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
    </div>
  )
}
