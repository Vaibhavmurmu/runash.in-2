export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  iceTransportPolicy?: RTCIceTransportPolicy
  iceCandidatePoolSize?: number
  turnServerRotation?: boolean
  maxBitrate?: number
  videoConstraints?: MediaTrackConstraints
  audioConstraints?: MediaTrackConstraints
}

export interface PeerConnectionData {
  id: string
  hostId: string
  connection: RTCPeerConnection
  localStream?: MediaStream
  remoteStream?: MediaStream
  dataChannel?: RTCDataChannel
  isInitiator: boolean
  connectionState: RTCPeerConnectionState
  iceConnectionState: RTCIceConnectionState
  candidateStats?: {
    host: number
    srflx: number
    relay: number
    prflx: number
  }
  selectedCandidatePair?: {
    local: {
      type: string
      protocol: string
      address: string
      port: number
    }
    remote: {
      type: string
      protocol: string
      address: string
      port: number
    }
    stats: {
      bytesSent: number
      bytesReceived: number
      totalRoundTripTime: number
      currentRoundTripTime: number
    }
  }
}

export class WebRTCService {
  private static instance: WebRTCService
  private peerConnections: Map<string, PeerConnectionData> = new Map()
  private localStream: MediaStream | null = null
  private config: WebRTCConfig
  private connectionListeners: ((connections: PeerConnectionData[]) => void)[] = []
  private streamListeners: ((hostId: string, stream: MediaStream | null) => void)[] = []
  private dataChannelListeners: ((hostId: string, data: any) => void)[] = []

  private constructor() {
    this.config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
          urls: [
            "turn:global.turn.twilio.com:3478?transport=udp",
            "turn:global.turn.twilio.com:3478?transport=tcp",
            "turn:global.turn.twilio.com:443?transport=tcp",
          ],
          username: "example_username", // Will be replaced with dynamic credentials
          credential: "example_password", // Will be replaced with dynamic credentials
          credentialType: "password",
        },
        {
          urls: ["turns:global.turn.twilio.com:443?transport=tcp"],
          username: "example_username", // Will be replaced with dynamic credentials
          credential: "example_password", // Will be replaced with dynamic credentials
          credentialType: "password",
        },
      ],
      iceTransportPolicy: "all", // Can be set to "relay" to force TURN usage
      iceCandidatePoolSize: 10,
      turnServerRotation: true,
      maxBitrate: 2500000, // 2.5 Mbps
      videoConstraints: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
      },
      audioConstraints: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
      },
    }
  }

  public static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService()
    }
    return WebRTCService.instance
  }

  // Initialize local media stream
  public async initializeLocalStream(videoEnabled = true, audioEnabled = true): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: videoEnabled ? this.config.videoConstraints : false,
        audio: audioEnabled ? this.config.audioConstraints : false,
      }

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)

      // Notify listeners about local stream
      this.notifyStreamListeners("local", this.localStream)

      return this.localStream
    } catch (error) {
      console.error("Failed to initialize local stream:", error)
      throw new Error(`Failed to access camera/microphone: ${error}`)
    }
  }

  // Create peer connection for a host
  public async createPeerConnection(hostId: string, isInitiator = false): Promise<PeerConnectionData> {
    const connectionId = `${hostId}-${Date.now()}`

    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
      iceTransportPolicy: this.config.iceTransportPolicy || "all",
      iceCandidatePoolSize: this.config.iceCandidatePoolSize || 10,
    })

    const peerData: PeerConnectionData = {
      id: connectionId,
      hostId,
      connection: peerConnection,
      localStream: this.localStream || undefined,
      isInitiator,
      connectionState: peerConnection.connectionState,
      iceConnectionState: peerConnection.iceConnectionState,
    }

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Set up event handlers
    this.setupPeerConnectionHandlers(peerData)

    // Create data channel for the initiator
    if (isInitiator) {
      peerData.dataChannel = peerConnection.createDataChannel("hostData", {
        ordered: true,
      })
      this.setupDataChannelHandlers(peerData.dataChannel, hostId)
    }

    this.peerConnections.set(connectionId, peerData)
    this.notifyConnectionListeners()

    return peerData
  }

  // Set up peer connection event handlers
  private setupPeerConnectionHandlers(peerData: PeerConnectionData) {
    const { connection, hostId } = peerData

    // Handle remote stream
    connection.ontrack = (event) => {
      console.log("Received remote track from", hostId)
      peerData.remoteStream = event.streams[0]
      this.notifyStreamListeners(hostId, event.streams[0])
    }

    // Handle ICE candidates with monitoring
    this.monitorIceCandidates(peerData)

    // Handle connection state changes
    connection.onconnectionstatechange = () => {
      peerData.connectionState = connection.connectionState
      console.log(`Connection state changed for ${hostId}:`, connection.connectionState)

      if (connection.connectionState === "connected") {
        // Update selected candidate pair when connected
        this.updateSelectedCandidatePair(hostId)
      }

      if (connection.connectionState === "failed" || connection.connectionState === "disconnected") {
        this.handleConnectionFailure(peerData.id)
      }

      this.notifyConnectionListeners()
    }

    // Handle ICE connection state changes
    connection.oniceconnectionstatechange = () => {
      peerData.iceConnectionState = connection.iceConnectionState
      console.log(`ICE connection state changed for ${hostId}:`, connection.iceConnectionState)
      this.notifyConnectionListeners()
    }

    // Handle data channel for non-initiators
    connection.ondatachannel = (event) => {
      const dataChannel = event.channel
      peerData.dataChannel = dataChannel
      this.setupDataChannelHandlers(dataChannel, hostId)
    }
  }

  // Set up data channel handlers
  private setupDataChannelHandlers(dataChannel: RTCDataChannel, hostId: string) {
    dataChannel.onopen = () => {
      console.log(`Data channel opened with ${hostId}`)
    }

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.notifyDataChannelListeners(hostId, data)
      } catch (error) {
        console.error("Failed to parse data channel message:", error)
      }
    }

    dataChannel.onerror = (error) => {
      console.error(`Data channel error with ${hostId}:`, error)
    }

    dataChannel.onclose = () => {
      console.log(`Data channel closed with ${hostId}`)
    }
  }

  // Create and send offer
  public async createOffer(hostId: string): Promise<RTCSessionDescriptionInit> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) {
      throw new Error(`No peer connection found for host ${hostId}`)
    }

    try {
      const offer = await peerData.connection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      await peerData.connection.setLocalDescription(offer)

      // In a real app, send this offer to the remote peer via signaling server
      this.sendSignalingMessage(hostId, {
        type: "offer",
        sdp: offer,
      })

      return offer
    } catch (error) {
      console.error("Failed to create offer:", error)
      throw error
    }
  }

  // Create and send answer
  public async createAnswer(hostId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) {
      throw new Error(`No peer connection found for host ${hostId}`)
    }

    try {
      await peerData.connection.setRemoteDescription(offer)

      const answer = await peerData.connection.createAnswer()
      await peerData.connection.setLocalDescription(answer)

      // In a real app, send this answer to the remote peer via signaling server
      this.sendSignalingMessage(hostId, {
        type: "answer",
        sdp: answer,
      })

      return answer
    } catch (error) {
      console.error("Failed to create answer:", error)
      throw error
    }
  }

  // Handle received answer
  public async handleAnswer(hostId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) {
      throw new Error(`No peer connection found for host ${hostId}`)
    }

    try {
      await peerData.connection.setRemoteDescription(answer)
    } catch (error) {
      console.error("Failed to handle answer:", error)
      throw error
    }
  }

  // Handle received ICE candidate
  public async handleIceCandidate(hostId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) {
      console.warn(`No peer connection found for host ${hostId}`)
      return
    }

    try {
      await peerData.connection.addIceCandidate(candidate)
    } catch (error) {
      console.error("Failed to add ICE candidate:", error)
    }
  }

  // Send data via data channel
  public sendData(hostId: string, data: any): void {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData?.dataChannel || peerData.dataChannel.readyState !== "open") {
      console.warn(`Data channel not available for host ${hostId}`)
      return
    }

    try {
      peerData.dataChannel.send(JSON.stringify(data))
    } catch (error) {
      console.error("Failed to send data:", error)
    }
  }

  // Toggle local video
  public toggleVideo(enabled: boolean): void {
    if (!this.localStream) return

    const videoTracks = this.localStream.getVideoTracks()
    videoTracks.forEach((track) => {
      track.enabled = enabled
    })

    // Notify all peer connections about the change
    this.peerConnections.forEach((peerData) => {
      this.sendData(peerData.hostId, {
        type: "video-toggle",
        enabled,
      })
    })
  }

  // Toggle local audio
  public toggleAudio(enabled: boolean): void {
    if (!this.localStream) return

    const audioTracks = this.localStream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = enabled
    })

    // Notify all peer connections about the change
    this.peerConnections.forEach((peerData) => {
      this.sendData(peerData.hostId, {
        type: "audio-toggle",
        enabled,
      })
    })
  }

  // Replace video track (for screen sharing)
  public async replaceVideoTrack(newTrack: MediaStreamTrack): Promise<void> {
    if (!this.localStream) return

    const oldVideoTrack = this.localStream.getVideoTracks()[0]
    if (oldVideoTrack) {
      this.localStream.removeTrack(oldVideoTrack)
      oldVideoTrack.stop()
    }

    this.localStream.addTrack(newTrack)

    // Update all peer connections
    for (const peerData of this.peerConnections.values()) {
      const sender = peerData.connection.getSenders().find((s) => s.track?.kind === "video")

      if (sender) {
        await sender.replaceTrack(newTrack)
      }
    }
  }

  // Start screen sharing
  public async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: true,
      })

      const videoTrack = screenStream.getVideoTracks()[0]
      if (videoTrack) {
        await this.replaceVideoTrack(videoTrack)

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare()
        }
      }

      return screenStream
    } catch (error) {
      console.error("Failed to start screen share:", error)
      throw error
    }
  }

  // Stop screen sharing
  public async stopScreenShare(): Promise<void> {
    try {
      // Get camera stream again
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: this.config.videoConstraints,
        audio: false, // Don't replace audio
      })

      const videoTrack = cameraStream.getVideoTracks()[0]
      if (videoTrack) {
        await this.replaceVideoTrack(videoTrack)
      }
    } catch (error) {
      console.error("Failed to stop screen share:", error)
    }
  }

  // Get connection statistics
  public async getConnectionStats(hostId: string): Promise<RTCStatsReport | null> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) return null

    try {
      return await peerData.connection.getStats()
    } catch (error) {
      console.error("Failed to get connection stats:", error)
      return null
    }
  }

  // Close peer connection
  public closePeerConnection(hostId: string): void {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) return

    // Close data channel
    if (peerData.dataChannel) {
      peerData.dataChannel.close()
    }

    // Close peer connection
    peerData.connection.close()

    // Remove from map
    this.peerConnections.delete(peerData.id)
    this.notifyConnectionListeners()
  }

  // Close all connections
  public closeAllConnections(): void {
    this.peerConnections.forEach((peerData) => {
      this.closePeerConnection(peerData.hostId)
    })

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  // Get peer connection by host ID
  private getPeerConnectionByHostId(hostId: string): PeerConnectionData | undefined {
    return Array.from(this.peerConnections.values()).find((peerData) => peerData.hostId === hostId)
  }

  // Handle connection failure
  private handleConnectionFailure(connectionId: string): void {
    const peerData = this.peerConnections.get(connectionId)
    if (!peerData) return

    console.log(`Connection failed for host ${peerData.hostId}, attempting reconnection...`)

    // In a real app, you might implement automatic reconnection logic here
    setTimeout(() => {
      this.createPeerConnection(peerData.hostId, peerData.isInitiator)
    }, 3000)
  }

  // Simulate signaling server (in a real app, this would be WebSocket/Socket.IO)
  private sendSignalingMessage(hostId: string, message: any): void {
    console.log(`Sending signaling message to ${hostId}:`, message)

    // In a real implementation, you would send this via WebSocket to a signaling server
    // The signaling server would then relay it to the target host

    // For demo purposes, we'll simulate this with a timeout
    setTimeout(() => {
      this.handleSignalingMessage(hostId, message)
    }, 100)
  }

  // Handle incoming signaling message (simulated)
  private handleSignalingMessage(fromHostId: string, message: any): void {
    console.log(`Received signaling message from ${fromHostId}:`, message)

    switch (message.type) {
      case "offer":
        this.createAnswer(fromHostId, message.sdp)
        break
      case "answer":
        this.handleAnswer(fromHostId, message.sdp)
        break
      case "ice-candidate":
        this.handleIceCandidate(fromHostId, message.candidate)
        break
    }
  }

  // Event listeners
  public onConnectionChange(callback: (connections: PeerConnectionData[]) => void): () => void {
    this.connectionListeners.push(callback)
    return () => {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback)
    }
  }

  public onStreamChange(callback: (hostId: string, stream: MediaStream | null) => void): () => void {
    this.streamListeners.push(callback)
    return () => {
      this.streamListeners = this.streamListeners.filter((cb) => cb !== callback)
    }
  }

  public onDataChannelMessage(callback: (hostId: string, data: any) => void): () => void {
    this.dataChannelListeners.push(callback)
    return () => {
      this.dataChannelListeners = this.dataChannelListeners.filter((cb) => cb !== callback)
    }
  }

  // Notify listeners
  private notifyConnectionListeners(): void {
    const connections = Array.from(this.peerConnections.values())
    this.connectionListeners.forEach((listener) => listener(connections))
  }

  private notifyStreamListeners(hostId: string, stream: MediaStream | null): void {
    this.streamListeners.forEach((listener) => listener(hostId, stream))
  }

  private notifyDataChannelListeners(hostId: string, data: any): void {
    this.dataChannelListeners.forEach((listener) => listener(hostId, data))
  }

  // Get current connections
  public getConnections(): PeerConnectionData[] {
    return Array.from(this.peerConnections.values())
  }

  // Get local stream
  public getLocalStream(): MediaStream | null {
    return this.localStream
  }

  // Get remote stream for a host
  public getRemoteStream(hostId: string): MediaStream | null {
    const peerData = this.getPeerConnectionByHostId(hostId)
    return peerData?.remoteStream || null
  }

  // Add a method to update ICE servers
  public updateIceServers(iceServers: RTCIceServer[]): void {
    // Ensure we keep at least one STUN server
    const hasStun = iceServers.some((server) => {
      const urls = Array.isArray(server.urls) ? server.urls : [server.urls]
      return urls.some((url) => url.startsWith("stun:"))
    })

    if (!hasStun) {
      iceServers.unshift({ urls: "stun:stun.l.google.com:19302" })
    }

    this.config.iceServers = iceServers
    console.log("ICE servers updated:", this.config.iceServers)

    // Close and recreate any active connections to use new servers
    if (this.peerConnections.size > 0) {
      console.log("Updating ICE servers for active connections")
      // Store current connections to recreate them
      const activeConnections = Array.from(this.peerConnections.values()).map((conn) => ({
        hostId: conn.hostId,
        isInitiator: conn.isInitiator,
      }))

      // Close all connections
      this.closeAllConnections()

      // Recreate connections with new servers
      for (const conn of activeConnections) {
        this.createPeerConnection(conn.hostId, conn.isInitiator)
      }
    }
  }

  // Add a method to update ICE servers with fresh credentials
  public async updateTurnCredentials(username: string, credential: string): Promise<void> {
    // Update all TURN server entries with the new credentials
    this.config.iceServers = this.config.iceServers.map((server) => {
      if (
        server.urls &&
        ((typeof server.urls === "string" && server.urls.startsWith("turn")) ||
          (Array.isArray(server.urls) && server.urls.some((url) => url.startsWith("turn"))))
      ) {
        return {
          ...server,
          username,
          credential,
          credentialType: "password",
        }
      }
      return server
    })

    // Close and recreate any active connections to use new credentials
    if (this.peerConnections.size > 0) {
      console.log("Updating TURN credentials for active connections")
      // Store current connections to recreate them
      const activeConnections = Array.from(this.peerConnections.values()).map((conn) => ({
        hostId: conn.hostId,
        isInitiator: conn.isInitiator,
      }))

      // Close all connections
      this.closeAllConnections()

      // Recreate connections with new credentials
      for (const conn of activeConnections) {
        await this.createPeerConnection(conn.hostId, conn.isInitiator)
      }
    }
  }

  // Add a method to force TURN usage
  public forceTurnServer(force: boolean): void {
    this.config.iceTransportPolicy = force ? "relay" : "all"
    console.log(`TURN server usage ${force ? "forced" : "automatic"}`)
  }

  // Add a method to monitor ICE candidate types
  private monitorIceCandidates(peerData: PeerConnectionData): void {
    const { connection, hostId } = peerData

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        // Log candidate type for monitoring
        const candidateType = event.candidate.type // 'host', 'srflx' (STUN), or 'relay' (TURN)
        console.log(`ICE candidate for ${hostId}: ${candidateType}`, event.candidate)

        // Track candidate types for analytics
        if (!peerData.candidateStats) {
          peerData.candidateStats = { host: 0, srflx: 0, relay: 0, prflx: 0 }
        }

        if (candidateType) {
          peerData.candidateStats[candidateType]++
        }

        // In a real app, send this candidate to the remote peer via signaling server
        this.sendSignalingMessage(hostId, {
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }
  }

  // Add a method to get TURN server usage statistics
  public getTurnServerUsage(): { hostId: string; usingTurn: boolean; candidateStats: any }[] {
    return Array.from(this.peerConnections.values()).map((peerData) => {
      const usingTurn =
        peerData.selectedCandidatePair?.remote?.type === "relay" ||
        peerData.selectedCandidatePair?.local?.type === "relay"

      return {
        hostId: peerData.hostId,
        usingTurn,
        candidateStats: peerData.candidateStats || { host: 0, srflx: 0, relay: 0, prflx: 0 },
      }
    })
  }

  // Add a method to get the selected candidate pair
  public async updateSelectedCandidatePair(hostId: string): Promise<void> {
    const peerData = this.getPeerConnectionByHostId(hostId)
    if (!peerData) return

    try {
      const stats = await peerData.connection.getStats()
      stats.forEach((report) => {
        if (report.type === "candidate-pair" && report.selected) {
          // Find local candidate
          stats.forEach((localReport) => {
            if (localReport.id === report.localCandidateId) {
              // Find remote candidate
              stats.forEach((remoteReport) => {
                if (remoteReport.id === report.remoteCandidateId) {
                  peerData.selectedCandidatePair = {
                    local: {
                      type: localReport.candidateType,
                      protocol: localReport.protocol,
                      address: localReport.address,
                      port: remoteReport.port,
                    },
                    remote: {
                      type: remoteReport.candidateType,
                      protocol: remoteReport.protocol,
                      address: remoteReport.address,
                      port: remoteReport.port,
                    },
                    stats: {
                      bytesSent: report.bytesSent,
                      bytesReceived: report.bytesReceived,
                      totalRoundTripTime: report.totalRoundTripTime,
                      currentRoundTripTime: report.currentRoundTripTime,
                    },
                  }
                }
              })
            }
          })
        }
      })
    } catch (error) {
      console.error("Failed to get selected candidate pair:", error)
    }
  }
}
