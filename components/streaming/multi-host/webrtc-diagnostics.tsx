"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Wifi, Camera, Mic, Monitor, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DiagnosticResult {
  test: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

export function WebRTCDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<{
    cameras: MediaDeviceInfo[]
    microphones: MediaDeviceInfo[]
    speakers: MediaDeviceInfo[]
  }>({ cameras: [], microphones: [], speakers: [] })

  useEffect(() => {
    loadDeviceInfo()
  }, [])

  const loadDeviceInfo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      setDeviceInfo({
        cameras: devices.filter((d) => d.kind === "videoinput"),
        microphones: devices.filter((d) => d.kind === "audioinput"),
        speakers: devices.filter((d) => d.kind === "audiooutput"),
      })
    } catch (error) {
      console.error("Failed to enumerate devices:", error)
    }
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    const results: DiagnosticResult[] = []

    try {
      // Test 1: WebRTC Support
      results.push(await testWebRTCSupport())

      // Test 2: Media Device Access
      results.push(await testMediaDeviceAccess())

      // Test 3: Camera Access
      results.push(await testCameraAccess())

      // Test 4: Microphone Access
      results.push(await testMicrophoneAccess())

      // Test 5: Network Connectivity
      results.push(await testNetworkConnectivity())

      // Test 6: STUN Server Connectivity
      results.push(await testSTUNConnectivity())

      // Test 7: Bandwidth Test
      results.push(await testBandwidth())

      setDiagnostics(results)

      const failedTests = results.filter((r) => r.status === "fail").length
      const warningTests = results.filter((r) => r.status === "warning").length

      if (failedTests === 0 && warningTests === 0) {
        toast({
          title: "All Tests Passed",
          description: "Your system is ready for multi-host streaming!",
        })
      } else if (failedTests > 0) {
        toast({
          title: "Some Tests Failed",
          description: `${failedTests} test(s) failed. Check the results for details.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Tests Completed with Warnings",
          description: `${warningTests} test(s) have warnings. Review for optimal performance.`,
        })
      }
    } catch (error) {
      console.error("Diagnostic error:", error)
      toast({
        title: "Diagnostic Error",
        description: "Failed to run diagnostics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const testWebRTCSupport = async (): Promise<DiagnosticResult> => {
    if (typeof RTCPeerConnection === "undefined") {
      return {
        test: "WebRTC Support",
        status: "fail",
        message: "WebRTC is not supported in this browser",
        details: "Please use a modern browser that supports WebRTC",
      }
    }

    return {
      test: "WebRTC Support",
      status: "pass",
      message: "WebRTC is supported",
    }
  }

  const testMediaDeviceAccess = async (): Promise<DiagnosticResult> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        test: "Media Device Access",
        status: "fail",
        message: "Media devices API not available",
        details: "Your browser doesn't support media device access",
      }
    }

    return {
      test: "Media Device Access",
      status: "pass",
      message: "Media devices API is available",
    }
  }

  const testCameraAccess = async (): Promise<DiagnosticResult> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())

      return {
        test: "Camera Access",
        status: "pass",
        message: "Camera access granted",
      }
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        return {
          test: "Camera Access",
          status: "fail",
          message: "Camera access denied",
          details: "Please allow camera access in your browser settings",
        }
      } else if (error.name === "NotFoundError") {
        return {
          test: "Camera Access",
          status: "fail",
          message: "No camera found",
          details: "Please connect a camera to your device",
        }
      } else {
        return {
          test: "Camera Access",
          status: "fail",
          message: "Camera access failed",
          details: error.message,
        }
      }
    }
  }

  const testMicrophoneAccess = async (): Promise<DiagnosticResult> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())

      return {
        test: "Microphone Access",
        status: "pass",
        message: "Microphone access granted",
      }
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        return {
          test: "Microphone Access",
          status: "fail",
          message: "Microphone access denied",
          details: "Please allow microphone access in your browser settings",
        }
      } else if (error.name === "NotFoundError") {
        return {
          test: "Microphone Access",
          status: "fail",
          message: "No microphone found",
          details: "Please connect a microphone to your device",
        }
      } else {
        return {
          test: "Microphone Access",
          status: "fail",
          message: "Microphone access failed",
          details: error.message,
        }
      }
    }
  }

  const testNetworkConnectivity = async (): Promise<DiagnosticResult> => {
    if (!navigator.onLine) {
      return {
        test: "Network Connectivity",
        status: "fail",
        message: "No internet connection",
        details: "Please check your internet connection",
      }
    }

    try {
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
      })

      return {
        test: "Network Connectivity",
        status: "pass",
        message: "Internet connection available",
      }
    } catch (error) {
      return {
        test: "Network Connectivity",
        status: "warning",
        message: "Limited connectivity",
        details: "Some network features may not work properly",
      }
    }
  }

  const testSTUNConnectivity = async (): Promise<DiagnosticResult> => {
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

      let candidateReceived = false
      const timeout = setTimeout(() => {
        pc.close()
        if (!candidateReceived) {
          resolve({
            test: "STUN Server Connectivity",
            status: "fail",
            message: "STUN server unreachable",
            details: "May have issues with NAT traversal",
          })
        }
      }, 5000)

      pc.onicecandidate = (event) => {
        if (event.candidate && event.candidate.type === "srflx") {
          candidateReceived = true
          clearTimeout(timeout)
          pc.close()
          resolve({
            test: "STUN Server Connectivity",
            status: "pass",
            message: "STUN server reachable",
          })
        }
      }

      // Create a dummy data channel to trigger ICE gathering
      pc.createDataChannel("test")
      pc.createOffer().then((offer) => pc.setLocalDescription(offer))
    })
  }

  const testBandwidth = async (): Promise<DiagnosticResult> => {
    // Simple bandwidth estimation using a small image download
    const startTime = performance.now()
    const testSize = 1024 * 100 // 100KB test file

    try {
      const response = await fetch(`https://httpbin.org/bytes/${testSize}`)
      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000 // seconds
      const bandwidth = (testSize * 8) / duration / 1000 // kbps

      if (bandwidth > 2000) {
        return {
          test: "Bandwidth Test",
          status: "pass",
          message: `Good bandwidth: ${Math.round(bandwidth)} kbps`,
        }
      } else if (bandwidth > 500) {
        return {
          test: "Bandwidth Test",
          status: "warning",
          message: `Limited bandwidth: ${Math.round(bandwidth)} kbps`,
          details: "May experience quality issues with multiple hosts",
        }
      } else {
        return {
          test: "Bandwidth Test",
          status: "fail",
          message: `Low bandwidth: ${Math.round(bandwidth)} kbps`,
          details: "Insufficient bandwidth for multi-host streaming",
        }
      }
    } catch (error) {
      return {
        test: "Bandwidth Test",
        status: "warning",
        message: "Could not measure bandwidth",
        details: "Network test failed",
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "fail":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
      case "warning":
        return "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
      case "fail":
        return "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
      default:
        return "border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            WebRTC Diagnostics
          </CardTitle>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="devices">Device Info</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-3">
            {diagnostics.length === 0 ? (
              <div className="text-center py-8">
                <Wifi className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Ready to Test</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Run diagnostics to check your system compatibility for multi-host streaming.
                </p>
                <Button
                  onClick={runDiagnostics}
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/30"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Start Diagnostics
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
                    <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{result.test}</h4>
                        <Badge variant="outline" className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.details && <p className="text-xs text-muted-foreground mt-1 italic">{result.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Cameras ({deviceInfo.cameras.length})
                </h4>
                {deviceInfo.cameras.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No cameras detected</p>
                ) : (
                  <div className="space-y-1">
                    {deviceInfo.cameras.map((device, index) => (
                      <div key={device.deviceId} className="text-sm p-2 rounded border bg-card/30">
                        {device.label || `Camera ${index + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Microphones ({deviceInfo.microphones.length})
                </h4>
                {deviceInfo.microphones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No microphones detected</p>
                ) : (
                  <div className="space-y-1">
                    {deviceInfo.microphones.map((device, index) => (
                      <div key={device.deviceId} className="text-sm p-2 rounded border bg-card/30">
                        {device.label || `Microphone ${index + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Speakers ({deviceInfo.speakers.length})
                </h4>
                {deviceInfo.speakers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No speakers detected</p>
                ) : (
                  <div className="space-y-1">
                    {deviceInfo.speakers.map((device, index) => (
                      <div key={device.deviceId} className="text-sm p-2 rounded border bg-card/30">
                        {device.label || `Speaker ${index + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
