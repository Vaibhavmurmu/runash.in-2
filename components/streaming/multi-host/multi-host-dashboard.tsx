"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Calendar, Settings, Activity, Crown, Shield, User, Clock, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { MultiHostManager } from "./multi-host-manager"
import { HostInvitationManager } from "./host-invitation-manager"
import { MultiHostAnalytics } from "./multi-host-analytics"
import { MultiHostSettings } from "./multi-host-settings"
import { MultiHostScheduler } from "./multi-host-scheduler"
import { TurnServerMonitor } from "./turn-server-monitor"
import type { MultiHostSession, Host } from "@/types/multi-host"
import { MultiHostService } from "@/services/multi-host-service"
import { toast } from "@/hooks/use-toast"

export function MultiHostDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [session, setSession] = useState<MultiHostSession | null>(null)
  const [hosts, setHosts] = useState<Host[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const router = useRouter()
  const multiHostService = MultiHostService.getInstance()

  useEffect(() => {
    // Subscribe to session changes
    const unsubscribeSession = multiHostService.onSessionChange((updatedSession) => {
      setSession(updatedSession)
      setIsStreaming(!!updatedSession)
    })

    // Subscribe to host changes
    const unsubscribeHosts = multiHostService.onHostsChange((updatedHosts) => {
      setHosts(updatedHosts)
    })

    return () => {
      unsubscribeSession()
      unsubscribeHosts()
    }
  }, [])

  const handleStartSession = async () => {
    try {
      await multiHostService.createSession("current-user-id")
      toast({
        title: "Multi-Host Session Started",
        description: "You can now invite co-hosts to join your stream.",
      })
    } catch (error) {
      toast({
        title: "Failed to start session",
        description: "There was an error starting the multi-host session.",
        variant: "destructive",
      })
    }
  }

  const handleEndSession = async () => {
    try {
      await multiHostService.endSession()
      toast({
        title: "Multi-Host Session Ended",
        description: "The multi-host session has been ended.",
      })
    } catch (error) {
      toast({
        title: "Failed to end session",
        description: "There was an error ending the multi-host session.",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "primary":
        return <Crown className="h-4 w-4 text-amber-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Multi-Host Streaming
            </h1>
            <p className="text-sm text-muted-foreground">Collaborate with multiple hosts in your live streams</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
              >
                <Activity className="h-3 w-3 mr-1" />
                Active Session
              </Badge>
              <Button variant="destructive" onClick={handleEndSession}>
                End Session
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartSession}
              className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Start Multi-Host Session
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b bg-card/50 backdrop-blur">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="hosts"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Host Management
              </TabsTrigger>
              <TabsTrigger
                value="invitations"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invitations
              </TabsTrigger>
              <TabsTrigger
                value="scheduler"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Scheduler
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <Activity className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-950/20 h-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="m-0 p-6 space-y-6">
              {/* Session Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Session Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {session ? (
                        <>
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </div>
                          <span className="text-sm font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          <span className="text-sm font-medium">Inactive</span>
                        </>
                      )}
                    </div>
                    {session && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Started {session.startedAt?.toLocaleTimeString()}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Connected Hosts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hosts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {hosts.filter((h) => h.status === "online").length} online
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Stream Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {session ? <Clock className="h-6 w-6 inline mr-2" /> : "00:00:00"}
                    </div>
                    <p className="text-xs text-muted-foreground">{session ? "Live streaming" : "Not streaming"}</p>
                  </CardContent>
                </Card>
              </div>

              {/* TURN Server Monitor */}
              <Card>
                <CardHeader>
                  <CardTitle>Server Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <TurnServerMonitor />
                </CardContent>
              </Card>

              {/* Active Hosts */}
              {hosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Hosts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hosts.map((host) => (
                        <div
                          key={host.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white font-medium">
                                {host.name.charAt(0)}
                              </div>
                              {host.role === "primary" && (
                                <Crown className="h-4 w-4 text-amber-500 absolute -top-1 -right-1" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{host.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {getRoleIcon(host.role)}
                                <span className="capitalize">{host.role}</span>
                                <span>•</span>
                                <span className={host.status === "online" ? "text-green-600" : "text-gray-500"}>
                                  {host.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {host.settings.isMicrophoneEnabled ? "Mic On" : "Mic Off"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {host.settings.isCameraEnabled ? "Cam On" : "Cam Off"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setActiveTab("invitations")}
                    >
                      <UserPlus className="h-6 w-6" />
                      <span className="text-sm">Invite Host</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setActiveTab("scheduler")}
                    >
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Schedule Stream</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <Activity className="h-6 w-6" />
                      <span className="text-sm">View Analytics</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hosts" className="m-0 p-6">
              <MultiHostManager isStreaming={isStreaming} currentUserId="current-user-id" />
            </TabsContent>

            <TabsContent value="invitations" className="m-0 p-6">
              <HostInvitationManager />
            </TabsContent>

            <TabsContent value="scheduler" className="m-0 p-6">
              <MultiHostScheduler />
            </TabsContent>

            <TabsContent value="analytics" className="m-0 p-6">
              <MultiHostAnalytics />
            </TabsContent>

            <TabsContent value="settings" className="m-0 p-6">
              <MultiHostSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
