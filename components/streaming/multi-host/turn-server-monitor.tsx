"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Server, AlertTriangle, CheckCircle2 } from "lucide-react"
import { WebRTCService } from "@/services/webrtc-service"

export function TurnServerMonitor() {
  const [turnUsage, setTurnUsage] = useState({
    totalConnections: 0,
    usingTurn: 0,
    lastUpdated: null as Date | null,
    candidateStats: {
      host: 0,
      srflx: 0, // STUN
      relay: 0, // TURN
      prflx: 0, // Peer reflexive
    },
  })

  useEffect(() => {
    // Update stats on mount and every 5 seconds
    updateStats()
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateStats = () => {
    try {
      const webrtcService = WebRTCService.getInstance()
      const usage = webrtcService.getTurnServerUsage()

      // Aggregate candidate stats
      const aggregatedStats = {
        host: 0,
        srflx: 0,
        relay: 0,
        prflx: 0,
      }

      usage.forEach((host) => {
        if (host.candidateStats) {
          aggregatedStats.host += host.candidateStats.host || 0
          aggregatedStats.srflx += host.candidateStats.srflx || 0
          aggregatedStats.relay += host.candidateStats.relay || 0
          aggregatedStats.prflx += host.candidateStats.prflx || 0
        }
      })

      setTurnUsage({
        totalConnections: usage.length,
        usingTurn: usage.filter((u) => u.usingTurn).length,
        lastUpdated: new Date(),
        candidateStats: aggregatedStats,
      })
    } catch (error) {
      console.error("Failed to update TURN stats:", error)
    }
  }

  const getTurnUsagePercentage = () => {
    if (turnUsage.totalConnections === 0) return 0
    return Math.round((turnUsage.usingTurn / turnUsage.totalConnections) * 100)
  }

  const getStatusColor = () => {
    const percentage = getTurnUsagePercentage()
    if (percentage === 0) return "text-green-500"
    if (percentage < 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = () => {
    const percentage = getTurnUsagePercentage()
    if (percentage === 0) return <CheckCircle2 className={`h-5 w-5 ${getStatusColor()}`} />
    if (percentage < 50) return <AlertTriangle className={`h-5 w-5 ${getStatusColor()}`} />
    return <AlertTriangle className={`h-5 w-5 ${getStatusColor()}`} />
  }

  const getStatusMessage = () => {
    const percentage = getTurnUsagePercentage()
    if (percentage === 0) return "Direct connections"
    if (percentage < 50) return "Some TURN relays"
    return "Heavy TURN usage"
  }

  // Calculate total candidates
  const totalCandidates = Object.values(turnUsage.candidateStats).reduce((sum, val) => sum + val, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Server className="h-4 w-4 text-blue-500" />
          TURN Server Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusMessage()}</span>
            </div>
            <span className="text-sm font-medium">
              {turnUsage.usingTurn} of {turnUsage.totalConnections}
            </span>
          </div>

          <Progress value={getTurnUsagePercentage()} className="h-2" />

          {totalCandidates > 0 && (
            <div className="pt-2 space-y-1">
              <div className="text-xs text-muted-foreground">Candidate Types</div>
              <div className="grid grid-cols-4 gap-1">
                <div className="text-center">
                  <div className="text-xs font-medium">
                    {Math.round((turnUsage.candidateStats.host / totalCandidates) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Host</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">
                    {Math.round((turnUsage.candidateStats.srflx / totalCandidates) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">STUN</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">
                    {Math.round((turnUsage.candidateStats.relay / totalCandidates) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">TURN</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">
                    {Math.round((turnUsage.candidateStats.prflx / totalCandidates) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">PrflX</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
