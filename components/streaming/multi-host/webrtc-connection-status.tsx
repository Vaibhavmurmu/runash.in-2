"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Signal, Activity, Clock, Download, Upload, RefreshCw } from "lucide-react"
import { WebRTCService, type PeerConnectionData } from "@/services/webrtc-service"
import type { Host } from "@/types/multi-host"

interface WebRTCConnectionStatusProps {
  hosts: Host[]
  currentUserId: string
}

interface ConnectionStats {
  hostId: string
  hostName: string
  bitrate: number
  packetLoss: number
  latency: number
  bandwidth: number
  quality: "excellent" | "good" | "poor" | "disconnected"
}

export function WebRTCConnectionStatus({ hosts, currentUserId }: WebRTCConnectionStatusProps) {
  const [connections, setConnections] = useState<PeerConnectionData[]>([])
  const [connectionStats, setConnectionStats] = useState<ConnectionStats[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const webrtcService = WebRTCService.getInstance()

  useEffect(() => {
    const unsubscribe = webrtcService.onConnectionChange((updatedConnections) => {
      setConnections(updatedConnections)
      updateConnectionStats(updatedConnections)
    })

    // Initial load
    const currentConnections = webrtcService.getConnections()
    setConnections(currentConnections)
    updateConnectionStats(currentConnections)

    // Set up periodic stats update
    const statsInterval = setInterval(() => {
      updateConnectionStats(webrtcService.getConnections())
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(statsInterval)
    }
  }, [hosts])

  const updateConnectionStats = async (connections: PeerConnectionData[]) => {
    const stats: ConnectionStats[] = []

    for (const connection of connections) {
      const host = hosts.find((h) => h.id === connection.hostId)
      if (!host) continue

      try {
        const rtcStats = await webrtcService.getConnectionStats(connection.hostId)
        if (rtcStats) {
          const parsedStats = parseRTCStats(rtcStats)
          stats.push({
            hostId: connection.hostId,
            hostName: host.name,
            bitrate: parsedStats.bitrate,
            packetLoss: parsedStats.packetLoss,
            latency: parsedStats.latency,
            bandwidth: parsedStats.bandwidth,
            quality: getConnectionQuality(connection, parsedStats),
          })
        }
      } catch (error) {
        console.error(`Failed to get stats for ${connection.hostId}:`, error)
        stats.push({
          hostId: connection.hostId,
          hostName: host.name,
          bitrate: 0,
          packetLoss: 0,
          latency: 0,
          bandwidth: 0,
          quality: "disconnected",
        })
      }
    }

    setConnectionStats(stats)
  }

  const parseRTCStats = (stats: RTCStatsReport) => {
    let bitrate = 0
    let packetLoss = 0
    let latency = 0
    let bandwidth = 0

    stats.forEach((report) => {
      if (report.type === "inbound-rtp" && report.mediaType === "video") {
        bitrate = report.bytesReceived ? (report.bytesReceived * 8) / 1000 : 0 // kbps
        packetLoss = report.packetsLost || 0
      }

      if (report.type === "candidate-pair" && report.state === "succeeded") {
        latency = report.currentRoundTripTime ? report.currentRoundTripTime * 1000 : 0 // ms
        bandwidth = report.availableOutgoingBitrate || 0
      }
    })

    return {
      bitrate: Math.round(bitrate),
      packetLoss: Math.round((packetLoss / 100) * 100) / 100, // percentage
      latency: Math.round(latency),
      bandwidth: Math.round(bandwidth / 1000), // kbps
    }
  }

  const getConnectionQuality = (
    connection: PeerConnectionData,
    stats: { bitrate: number; packetLoss: number; latency: number },
  ): "excellent" | "good" | "poor" | "disconnected" => {
    if (connection.connectionState !== "connected") {
      return "disconnected"
    }

    if (stats.latency < 100 && stats.packetLoss < 1 && stats.bitrate > 1000) {
      return "excellent"
    } else if (stats.latency < 200 && stats.packetLoss < 3 && stats.bitrate > 500) {
      return "good"
    } else {
      return "poor"
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
      case "good":
        return "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
      case "poor":
        return "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
      default:
        return "border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-400"
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "excellent":
        return <Wifi className="h-4 w-4" />
      case "good":
        return <Signal className="h-4 w-4" />
      case "poor":
        return <Activity className="h-4 w-4" />
      default:
        return <WifiOff className="h-4 w-4" />
    }
  }

  const refreshStats = async () => {
    setIsRefreshing(true)
    await updateConnectionStats(connections)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getOverallQuality = () => {
    if (connectionStats.length === 0) return "disconnected"

    const qualities = connectionStats.map((stat) => stat.quality)
    if (qualities.every((q) => q === "excellent")) return "excellent"
    if (qualities.every((q) => q === "excellent" || q === "good")) return "good"
    if (qualities.some((q) => q === "disconnected")) return "poor"
    return "good"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            Connection Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getQualityColor(getOverallQuality())}>
              {getQualityIcon(getOverallQuality())}
              <span className="ml-1 capitalize">{getOverallQuality()}</span>
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshStats} disabled={isRefreshing}>
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectionStats.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No active connections</p>
          </div>
        ) : (
          connectionStats.map((stat) => (
            <div key={stat.hostId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400"></div>
                  <span className="text-sm font-medium">{stat.hostName}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getQualityColor(stat.quality)}`}>
                  {getQualityIcon(stat.quality)}
                  <span className="ml-1 capitalize">{stat.quality}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Bitrate
                    </span>
                    <span className="font-medium">{stat.bitrate} kbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Latency
                    </span>
                    <span className="font-medium">{stat.latency} ms</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      Bandwidth
                    </span>
                    <span className="font-medium">{stat.bandwidth} kbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Loss</span>
                    <span className="font-medium">{stat.packetLoss}%</span>
                  </div>
                </div>
              </div>

              {/* Quality indicator bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-medium">
                    {stat.quality === "excellent"
                      ? "95%"
                      : stat.quality === "good"
                        ? "75%"
                        : stat.quality === "poor"
                          ? "45%"
                          : "0%"}
                  </span>
                </div>
                <Progress
                  value={
                    stat.quality === "excellent" ? 95 : stat.quality === "good" ? 75 : stat.quality === "poor" ? 45 : 0
                  }
                  className="h-1.5"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
