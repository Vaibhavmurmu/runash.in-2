export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "join-session" | "leave-session" | "host-update"
  sessionId: string
  fromHostId: string
  toHostId?: string
  data: any
  timestamp: number
}

export class SignalingService {
  private static instance: SignalingService
  private socket: WebSocket | null = null
  private messageListeners: ((message: SignalingMessage) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  private constructor() {}

  public static getInstance(): SignalingService {
    if (!SignalingService.instance) {
      SignalingService.instance = new SignalingService()
    }
    return SignalingService.instance
  }

  // Connect to signaling server
  public connect(signalingServerUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(signalingServerUrl)

        this.socket.onopen = () => {
          console.log("Connected to signaling server")
          this.isConnected = true
          this.reconnectAttempts = 0
          this.notifyConnectionListeners(true)
          resolve()
        }

        this.socket.onmessage = (event) => {
          try {
            const message: SignalingMessage = JSON.parse(event.data)
            this.notifyMessageListeners(message)
          } catch (error) {
            console.error("Failed to parse signaling message:", error)
          }
        }

        this.socket.onclose = () => {
          console.log("Disconnected from signaling server")
          this.isConnected = false
          this.notifyConnectionListeners(false)
          this.attemptReconnect(signalingServerUrl)
        }

        this.socket.onerror = (error) => {
          console.error("Signaling server error:", error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // Disconnect from signaling server
  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.isConnected = false
    this.notifyConnectionListeners(false)
  }

  // Send message to signaling server
  public sendMessage(message: Omit<SignalingMessage, "timestamp">): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Signaling server not connected")
      return
    }

    const fullMessage: SignalingMessage = {
      ...message,
      timestamp: Date.now(),
    }

    try {
      this.socket.send(JSON.stringify(fullMessage))
    } catch (error) {
      console.error("Failed to send signaling message:", error)
    }
  }

  // Join a session
  public joinSession(sessionId: string, hostId: string, hostInfo: any): void {
    this.sendMessage({
      type: "join-session",
      sessionId,
      fromHostId: hostId,
      data: hostInfo,
    })
  }

  // Leave a session
  public leaveSession(sessionId: string, hostId: string): void {
    this.sendMessage({
      type: "leave-session",
      sessionId,
      fromHostId: hostId,
      data: {},
    })
  }

  // Send WebRTC offer
  public sendOffer(sessionId: string, fromHostId: string, toHostId: string, offer: RTCSessionDescriptionInit): void {
    this.sendMessage({
      type: "offer",
      sessionId,
      fromHostId,
      toHostId,
      data: { offer },
    })
  }

  // Send WebRTC answer
  public sendAnswer(sessionId: string, fromHostId: string, toHostId: string, answer: RTCSessionDescriptionInit): void {
    this.sendMessage({
      type: "answer",
      sessionId,
      fromHostId,
      toHostId,
      data: { answer },
    })
  }

  // Send ICE candidate
  public sendIceCandidate(
    sessionId: string,
    fromHostId: string,
    toHostId: string,
    candidate: RTCIceCandidateInit,
  ): void {
    this.sendMessage({
      type: "ice-candidate",
      sessionId,
      fromHostId,
      toHostId,
      data: { candidate },
    })
  }

  // Send host update (audio/video state changes)
  public sendHostUpdate(sessionId: string, hostId: string, updateData: any): void {
    this.sendMessage({
      type: "host-update",
      sessionId,
      fromHostId: hostId,
      data: updateData,
    })
  }

  // Attempt to reconnect
  private attemptReconnect(signalingServerUrl: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      this.connect(signalingServerUrl).catch((error) => {
        console.error("Reconnection failed:", error)
      })
    }, delay)
  }

  // Event listeners
  public onMessage(callback: (message: SignalingMessage) => void): () => void {
    this.messageListeners.push(callback)
    return () => {
      this.messageListeners = this.messageListeners.filter((cb) => cb !== callback)
    }
  }

  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback)
    return () => {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback)
    }
  }

  // Notify listeners
  private notifyMessageListeners(message: SignalingMessage): void {
    this.messageListeners.forEach((listener) => listener(message))
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected))
  }

  // Get connection status
  public isConnectedToServer(): boolean {
    return this.isConnected
  }
}
