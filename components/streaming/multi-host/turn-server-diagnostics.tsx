"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Server, AlertTriangle, CheckCircle2, Network } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TurnTestResult {
  server: string
  protocol: string
  success: boolean
  latency: number | null
  error?: string
}

export function TurnServerDiagnostics() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TurnTestResult[]>([])

  const testServers = [
    { url: "turn:global.turn.twilio.com:3478", protocol: "UDP" },
    { url: "turn:global.turn.twilio.com:3478?transport=tcp", protocol: "TCP" },
    { url: "turns:global.turn.twilio.com:443?transport=tcp", protocol: "TLS" },
    // Add more servers as needed
  ]

  const runDiagnostics = async () => {
    setIsRunning(true)
    setProgress(0)
    setResults([])

    const newResults: TurnTestResult[] = []

    for (let i = 0; i < testServers.length; i++) {
      const server = testServers[i]
      setProgress(Math.round((i / testServers.length) * 100))

      try {
        const result = await testTurnServer(server.url, server.protocol)
        newResults.push(result)
      } catch (error) {
        console.error(`Error testing TURN server ${server.url}:`, error)
        newResults.push({
          server: server.url,
          protocol: server.protocol,
          success: false,
          latency: null,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setResults(newResults)
    setProgress(100)
    setIsRunning(false)

    const successCount = newResults.filter((r) => r.success).length
    if (successCount === 0) {
      toast({
        title: "TURN Server Test Failed",
        description: "All TURN servers are unreachable. NAT traversal may not work properly.",
        variant: "destructive",
      })
    } else if (successCount < testServers.length) {
      toast({
        title: "Some TURN Servers Available",
        description: `${successCount} of ${testServers.length} TURN servers are working.`,
      })
    } else {
      toast({
        title: "All TURN Servers Available",
        description: "TURN server connectivity is excellent.",
      })
    }
  }

  const testTurnServer = async (serverUrl: string, protocol: string): Promise<TurnTestResult> => {
    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, you would use your TURN credentials API
        // For this demo, we'll use dummy credentials
        const username = "dummy"
        const credential = "dummy"

        const pc = new RTCPeerConnection({
          iceServers: [
            {
              urls: serverUrl,
              username,
              credential,
            },
          ],
          iceTransportPolicy: "relay", // Force TURN usage
        })

        const startTime = performance.now()
        let candidateFound = false
        let timeout: NodeJS.Timeout

        pc.onicecandidate = (event) => {
          if (event.candidate && event.candidate.type === "relay") {
            candidateFound = true
            const latency = performance.now() - startTime

            clearTimeout(timeout)
            pc.close()

            resolve({
              server: serverUrl,
              protocol,
              success: true,
              latency,
            })
          }
        }

        pc.onicecandidateerror = (event: any) => {
          // Only fail if this is for our TURN server
          if (event.url && event.url.includes(serverUrl)) {
            clearTimeout(timeout)
            pc.close()

            resolve({
              server: serverUrl,
              protocol,
              success: false,
              latency: null,
              error: event.errorText || "ICE candidate error",
            })
          }
        }

        // Set a timeout for the test
        timeout = setTimeout(() => {
          pc.close()
          if (!candidateFound) {
            resolve({
              server: serverUrl,
              protocol,
              success: false,
              latency: null,
              error: "Timeout waiting for relay candidate",
            })
          }
        }, 5000)

        // Create a data channel to trigger ICE gathering
        pc.createDataChannel("turnTest")

        // Create an offer to start the ICE gathering process
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .catch((error) => {
            clearTimeout(timeout)
            pc.close()
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5 text-purple-500" />
            TURN Server Diagnostics
          </CardTitle>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Server className="h-4 w-4 mr-2" />
                Test TURN Servers
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isRunning && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Testing TURN servers...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Test Results</h3>

            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}

                    <div>
                      <div className="text-sm font-medium">{new URL(result.server).hostname}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="text-xs h-5 px-1">
                          {result.protocol}
                        </Badge>
                        {result.error && <span className="text-red-500">{result.error}</span>}
                      </div>
                    </div>
                  </div>

                  {result.success && result.latency && (
                    <div className="text-sm font-medium">{Math.round(result.latency)} ms</div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground pt-2">
              {results.filter((r) => r.success).length} of {results.length} TURN servers available
            </div>
          </div>
        )}

        {!isRunning && results.length === 0 && (
          <div className="text-center py-8">
            <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">TURN Server Testing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test connectivity to TURN servers to ensure reliable NAT traversal for WebRTC connections.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
