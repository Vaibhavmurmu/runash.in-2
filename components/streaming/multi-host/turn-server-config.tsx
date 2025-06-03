"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Server, Shield, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react"
import { WebRTCService } from "@/services/webrtc-service"
import { toast } from "@/components/ui/use-toast"

interface TurnCredentials {
  username: string
  credential: string
  ttl: number
  timestamp: number
}

interface TurnServerConfig {
  url: string
  username: string
  credential: string
  enabled: boolean
}

export function TurnServerConfig() {
  const [isLoading, setIsLoading] = useState(false)
  const [forceTurn, setForceTurn] = useState(false)
  const [turnStats, setTurnStats] = useState<{
    totalConnections: number
    usingTurn: number
    lastUpdated: Date | null
  }>({
    totalConnections: 0,
    usingTurn: 0,
    lastUpdated: null,
  })

  const [customServers, setCustomServers] = useState<TurnServerConfig[]>([
    {
      url: "turn:global.turn.twilio.com:3478?transport=udp",
      username: "",
      credential: "",
      enabled: true,
    },
    {
      url: "turns:global.turn.twilio.com:443?transport=tcp",
      username: "",
      credential: "",
      enabled: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("managed")

  useEffect(() => {
    // Update TURN stats periodically
    const interval = setInterval(updateTurnStats, 10000)
    updateTurnStats()

    return () => clearInterval(interval)
  }, [])

  const updateTurnStats = () => {
    try {
      const webrtcService = WebRTCService.getInstance()
      const turnUsage = webrtcService.getTurnServerUsage()

      setTurnStats({
        totalConnections: turnUsage.length,
        usingTurn: turnUsage.filter((usage) => usage.usingTurn).length,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Failed to update TURN stats:", error)
    }
  }

  const fetchTurnCredentials = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // which would then generate temporary credentials for your TURN server
      const response = await fetch("/api/turn-credentials")

      if (!response.ok) {
        throw new Error("Failed to fetch TURN credentials")
      }

      const credentials: TurnCredentials = await response.json()

      // Update WebRTC service with new credentials
      const webrtcService = WebRTCService.getInstance()
      await webrtcService.updateTurnCredentials(credentials.username, credentials.credential)

      toast({
        title: "TURN Credentials Updated",
        description: `New credentials will expire in ${Math.floor(credentials.ttl / 60)} minutes`,
      })

      updateTurnStats()
    } catch (error) {
      console.error("Failed to fetch TURN credentials:", error)
      toast({
        title: "Failed to Update TURN Credentials",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleForceTurn = (enabled: boolean) => {
    try {
      setForceTurn(enabled)
      const webrtcService = WebRTCService.getInstance()
      webrtcService.forceTurnServer(enabled)

      toast({
        title: enabled ? "TURN Server Forced" : "TURN Server Auto",
        description: enabled
          ? "All connections will use TURN servers"
          : "Connections will use TURN servers only when needed",
      })
    } catch (error) {
      console.error("Failed to toggle TURN server:", error)
    }
  }

  const updateCustomServer = (index: number, field: keyof TurnServerConfig, value: string | boolean) => {
    const updatedServers = [...customServers]
    updatedServers[index] = {
      ...updatedServers[index],
      [field]: value,
    }
    setCustomServers(updatedServers)
  }

  const addCustomServer = () => {
    setCustomServers([
      ...customServers,
      {
        url: "",
        username: "",
        credential: "",
        enabled: true,
      },
    ])
  }

  const removeCustomServer = (index: number) => {
    const updatedServers = [...customServers]
    updatedServers.splice(index, 1)
    setCustomServers(updatedServers)
  }

  const applyCustomServers = () => {
    try {
      // Filter out disabled or incomplete servers
      const validServers = customServers.filter((server) => server.enabled && server.url.trim() !== "")

      if (validServers.length === 0) {
        toast({
          title: "No Valid TURN Servers",
          description: "Please add at least one valid TURN server",
          variant: "destructive",
        })
        return
      }

      // Format servers for WebRTC
      const iceServers = validServers.map((server) => ({
        urls: server.url,
        username: server.username,
        credential: server.credential,
        credentialType: "password" as RTCIceCredentialType,
      }))

      // Add STUN servers
      iceServers.unshift({ urls: "stun:stun.l.google.com:19302" })
      iceServers.unshift({ urls: "stun:stun1.l.google.com:19302" })

      // Update WebRTC service
      const webrtcService = WebRTCService.getInstance()
      webrtcService.updateIceServers(iceServers)

      toast({
        title: "Custom TURN Servers Applied",
        description: `${validServers.length} TURN server(s) configured successfully`,
      })
    } catch (error) {
      console.error("Failed to apply custom TURN servers:", error)
      toast({
        title: "Failed to Apply TURN Servers",
        description: "Please check your configuration and try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              TURN Server Configuration
            </CardTitle>
            <CardDescription>
              Configure TURN servers for NAT traversal in challenging network environments
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {turnStats.totalConnections > 0 && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
              >
                {turnStats.usingTurn} of {turnStats.totalConnections} using TURN
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="managed">Managed TURN</TabsTrigger>
            <TabsTrigger value="custom">Custom Servers</TabsTrigger>
          </TabsList>

          <TabsContent value="managed" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <Shield className="h-4 w-4 text-blue-500" />
              <AlertTitle>Managed TURN Service</AlertTitle>
              <AlertDescription>
                Our managed TURN service automatically provisions secure, temporary credentials for optimal performance.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Force TURN Server Usage</div>
                <div className="text-sm text-muted-foreground">
                  Always use TURN servers even when direct connection might be possible
                </div>
              </div>
              <Switch checked={forceTurn} onCheckedChange={toggleForceTurn} />
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium">TURN Credentials</h3>
                  <p className="text-sm text-muted-foreground">Temporary credentials for secure TURN server access</p>
                </div>
                <Button
                  onClick={fetchTurnCredentials}
                  disabled={isLoading}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Credentials
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="flex items-center gap-1">
                    {turnStats.lastUpdated ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        Active
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                        Not Configured
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{turnStats.lastUpdated ? turnStats.lastUpdated.toLocaleTimeString() : "Never"}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TURN Usage:</span>
                  <span>
                    {turnStats.totalConnections > 0
                      ? `${Math.round((turnStats.usingTurn / turnStats.totalConnections) * 100)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Advanced Configuration</AlertTitle>
              <AlertDescription>
                Custom TURN servers require proper configuration and maintenance. Use only if you have your own TURN
                infrastructure.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {customServers.map((server, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">TURN Server {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={server.enabled}
                        onCheckedChange={(checked) => updateCustomServer(index, "enabled", checked)}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomServer(index)}
                        className="h-8 w-8 p-0 text-muted-foreground"
                      >
                        &times;
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`server-url-${index}`}>Server URL</Label>
                      <Input
                        id={`server-url-${index}`}
                        value={server.url}
                        onChange={(e) => updateCustomServer(index, "url", e.target.value)}
                        placeholder="turn:your-turn-server.com:3478"
                        disabled={!server.enabled}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`username-${index}`}>Username</Label>
                        <Input
                          id={`username-${index}`}
                          value={server.username}
                          onChange={(e) => updateCustomServer(index, "username", e.target.value)}
                          placeholder="Username"
                          disabled={!server.enabled}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`credential-${index}`}>Credential</Label>
                        <Input
                          id={`credential-${index}`}
                          type="password"
                          value={server.credential}
                          onChange={(e) => updateCustomServer(index, "credential", e.target.value)}
                          placeholder="Password/Key"
                          disabled={!server.enabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={addCustomServer}>
                  Add Server
                </Button>

                <Button onClick={applyCustomServers} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Configuration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
