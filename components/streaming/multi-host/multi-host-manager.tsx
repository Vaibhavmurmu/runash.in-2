"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, LayoutGrid } from "lucide-react"
import { MultiHostService } from "@/services/multi-host-service"
import type { LayoutConfiguration, MultiHostSession } from "@/types/multi-host"
import { toast } from "@/components/ui/use-toast"
import { WebRTCVideoGrid } from "./webrtc-video-grid"
import { WebRTCConnectionStatus } from "./webrtc-connection-status"
import { HostControls } from "./host-controls"

interface MultiHostManagerProps {
  isStreaming: boolean
  currentUserId: string
}

export function MultiHostManager({ isStreaming, currentUserId }: MultiHostManagerProps) {
  const [session, setSession] = useState<MultiHostSession | null>(null)
  const [activeTab, setActiveTab] = useState<string>("grid")
  const multiHostService = MultiHostService.getInstance()

  useEffect(() => {
    const unsubscribe = multiHostService.onSessionChange((updatedSession) => {
      setSession(updatedSession)
    })

    return () => {
      unsubscribe()
    }
  }, [])

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-orange-500" />
          Multi-Host Streaming
        </CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pb-0">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="grid">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Host View
            </TabsTrigger>
            <TabsTrigger value="controls">
              <UserPlus className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="flex-1 p-0 pt-4">
          <TabsContent value="grid" className="m-0 h-full">
            {session ? (
              <div className="h-full flex flex-col gap-4 p-4">
                <WebRTCVideoGrid
                  hosts={session.hosts}
                  layout={session.layout}
                  currentUserId={currentUserId}
                  onLayoutChange={handleLayoutChange}
                />
                <WebRTCConnectionStatus hosts={session.hosts} currentUserId={currentUserId} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Active Session</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start streaming to create a multi-host session.</p>
                  {!isStreaming && (
                    <Button
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/30"
                      disabled
                    >
                      Start Streaming First
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="controls" className="m-0 h-full">
            <HostControls currentUserId={currentUserId} isStreaming={isStreaming} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
