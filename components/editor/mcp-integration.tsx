"use client"

import { useState } from "react"
import { Network, Activity, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface MCPConnection {
  id: string
  name: string
  status: "connected" | "connecting" | "disconnected" | "error"
  latency: number
  uptime: number
  messageCount: number
  lastUpdate: Date
}

interface MCPIntegrationProps {
  compact?: boolean
}

export default function MCPIntegration({ compact = false }: MCPIntegrationProps) {
  const [connections, setConnections] = useState<MCPConnection[]>([
    {
      id: "1",
      name: "Primary MCP Server",
      status: "connected",
      latency: 45,
      uptime: 99.95,
      messageCount: 1250,
      lastUpdate: new Date(),
    },
    {
      id: "2",
      name: "Backup MCP Server",
      status: "connected",
      latency: 120,
      uptime: 99.5,
      messageCount: 340,
      lastUpdate: new Date(Date.now() - 5000),
    },
  ])

  const [autoReconnect, setAutoReconnect] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const getStatusIcon = (status: MCPConnection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "connecting":
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case "disconnected":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const handleReconnect = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, status: "connecting" as const } : conn)),
    )
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId
            ? { ...conn, status: "connected" as const, latency: Math.floor(Math.random() * 100) + 40 }
            : conn,
        ),
      )
    }, 1500)
  }

  if (compact) {
    const primaryConn = connections[0]
    return (
      <div className="flex items-center gap-2 text-xs">
        {getStatusIcon(primaryConn.status)}
        <span className="text-muted-foreground">{primaryConn.name}</span>
        <span className="font-medium text-foreground">{primaryConn.latency}ms</span>
      </div>
    )
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">MCP Connections</CardTitle>
              <CardDescription>Real-time server integration status</CardDescription>
            </div>
          </div>
          <Badge variant={connections.every((c) => c.status === "connected") ? "default" : "secondary"}>
            {connections.filter((c) => c.status === "connected").length}/{connections.length} Connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {connections.map((conn) => (
          <div key={conn.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(conn.status)}
                <div>
                  <p className="font-medium text-foreground">{conn.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {conn.status === "connected"
                      ? `Connected • ${conn.latency}ms latency`
                      : `${conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}`}
                  </p>
                </div>
              </div>

              {conn.status !== "connected" && (
                <Button size="sm" variant="outline" onClick={() => handleReconnect(conn.id)} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </Button>
              )}
            </div>

            {conn.status === "connected" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium text-foreground">{conn.uptime.toFixed(2)}%</span>
                </div>
                <Progress value={conn.uptime} className="h-2" />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-sm font-medium text-foreground">{conn.latency}ms</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">Messages</p>
                    <p className="text-sm font-medium text-foreground">{conn.messageCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-foreground">Auto-reconnect on failure</span>
            <input
              type="checkbox"
              checked={autoReconnect}
              onChange={(e) => setAutoReconnect(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
