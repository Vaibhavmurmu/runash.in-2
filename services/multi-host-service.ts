import type { Host, HostInvitation, HostPermissions, HostRole, MultiHostSession } from "@/types/multi-host"

// This would be a real service in a production app
// For this demo, we'll simulate the multi-host service
export class MultiHostService {
  private static instance: MultiHostService
  private currentSession: MultiHostSession | null = null
  private sessionListeners: ((session: MultiHostSession | null) => void)[] = []
  private hostListeners: ((hosts: Host[]) => void)[] = []
  private invitationListeners: ((invitations: HostInvitation[]) => void)[] = []

  private constructor() {}

  public static getInstance(): MultiHostService {
    if (!MultiHostService.instance) {
      MultiHostService.instance = new MultiHostService()
    }
    return MultiHostService.instance
  }

  // Get the current multi-host session
  public getCurrentSession(): MultiHostSession | null {
    return this.currentSession
  }

  // Create a new multi-host session
  public createSession(primaryHostId: string): Promise<MultiHostSession> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const primaryHost: Host = {
          id: primaryHostId,
          name: "You (Primary Host)",
          role: "primary",
          status: "online",
          permissions: this.getDefaultPermissions("primary"),
          settings: {
            isMicrophoneEnabled: true,
            isCameraEnabled: true,
            isScreenShareEnabled: false,
            audioInputDevice: null,
            videoInputDevice: null,
            audioOutputDevice: null,
          },
          joinedAt: new Date(),
          lastActiveAt: new Date(),
        }

        const newSession: MultiHostSession = {
          id: `session-${Date.now()}`,
          streamId: `stream-${Date.now()}`,
          hosts: [primaryHost],
          layout: {
            type: "spotlight",
            primaryHostId: primaryHostId,
            visibleHostIds: [primaryHostId],
          },
          primaryHostId: primaryHostId,
          activeHostId: primaryHostId,
          connections: [],
          startedAt: new Date(),
          settings: {
            maxHosts: 4,
            autoAcceptInvitations: false,
            defaultHostPermissions: this.getDefaultPermissions("co-host"),
            defaultHostRole: "co-host",
            allowGuestControls: true,
            recordIndividualTracks: true,
          },
        }

        this.currentSession = newSession
        this.notifySessionListeners()
        this.notifyHostListeners()
        resolve(newSession)
      }, 500)
    })
  }

  // End the current multi-host session
  public endSession(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        if (this.currentSession) {
          this.currentSession.endedAt = new Date()
          this.notifySessionListeners()
          this.currentSession = null
          this.notifySessionListeners()
          this.notifyHostListeners()
        }
        resolve(true)
      }, 300)
    })
  }

  // Invite a host to join the session
  public inviteHost(email: string, name: string, role: HostRole): Promise<HostInvitation> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        const invitation: HostInvitation = {
          id: `invitation-${Date.now()}`,
          hostId: this.currentSession!.primaryHostId,
          inviteeEmail: email,
          inviteeName: name,
          role: role,
          permissions: this.getDefaultPermissions(role),
          status: "pending",
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        }

        this.notifyInvitationListeners([invitation])
        resolve(invitation)
      }, 500)
    })
  }

  // Simulate accepting an invitation (in a real app, this would be done by the invitee)
  public simulateAcceptInvitation(invitationId: string): Promise<Host> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        // Create a new host
        const newHost: Host = {
          id: `host-${Date.now()}`,
          name: `Co-host ${this.currentSession!.hosts.length}`,
          role: "co-host",
          status: "online",
          permissions: this.getDefaultPermissions("co-host"),
          settings: {
            isMicrophoneEnabled: true,
            isCameraEnabled: true,
            isScreenShareEnabled: false,
            audioInputDevice: null,
            videoInputDevice: null,
            audioOutputDevice: null,
          },
          joinedAt: new Date(),
          lastActiveAt: new Date(),
        }

        // Add the host to the session
        this.currentSession!.hosts.push(newHost)
        this.currentSession!.layout.visibleHostIds.push(newHost.id)

        // Update the session
        this.notifySessionListeners()
        this.notifyHostListeners()

        resolve(newHost)
      }, 500)
    })
  }

  // Remove a host from the session
  public removeHost(hostId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        // Remove the host from the session
        this.currentSession!.hosts = this.currentSession!.hosts.filter((host) => host.id !== hostId)
        this.currentSession!.layout.visibleHostIds = this.currentSession!.layout.visibleHostIds.filter(
          (id) => id !== hostId,
        )

        // Update the session
        this.notifySessionListeners()
        this.notifyHostListeners()

        resolve(true)
      }, 300)
    })
  }

  // Update host settings
  public updateHostSettings(hostId: string, settings: Partial<Host>): Promise<Host> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        // Find the host
        const hostIndex = this.currentSession!.hosts.findIndex((host) => host.id === hostId)
        if (hostIndex === -1) {
          reject(new Error("Host not found"))
          return
        }

        // Update the host
        this.currentSession!.hosts[hostIndex] = {
          ...this.currentSession!.hosts[hostIndex],
          ...settings,
          lastActiveAt: new Date(),
        }

        // Update the session
        this.notifySessionListeners()
        this.notifyHostListeners()

        resolve(this.currentSession!.hosts[hostIndex])
      }, 300)
    })
  }

  // Update session layout
  public updateLayout(layout: Partial<MultiHostSession["layout"]>): Promise<MultiHostSession["layout"]> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        // Update the layout
        this.currentSession!.layout = {
          ...this.currentSession!.layout,
          ...layout,
        }

        // Update the session
        this.notifySessionListeners()

        resolve(this.currentSession!.layout)
      }, 300)
    })
  }

  // Set the active host (who is currently speaking or in focus)
  public setActiveHost(hostId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.currentSession) {
        reject(new Error("No active session"))
        return
      }

      // Simulate API call delay
      setTimeout(() => {
        // Update the active host
        this.currentSession!.activeHostId = hostId

        // Update the session
        this.notifySessionListeners()

        resolve(true)
      }, 100)
    })
  }

  // Listen for session changes
  public onSessionChange(callback: (session: MultiHostSession | null) => void): () => void {
    this.sessionListeners.push(callback)
    return () => {
      this.sessionListeners = this.sessionListeners.filter((cb) => cb !== callback)
    }
  }

  // Listen for host changes
  public onHostsChange(callback: (hosts: Host[]) => void): () => void {
    this.hostListeners.push(callback)
    return () => {
      this.hostListeners = this.hostListeners.filter((cb) => cb !== callback)
    }
  }

  // Listen for invitation changes
  public onInvitationsChange(callback: (invitations: HostInvitation[]) => void): () => void {
    this.invitationListeners.push(callback)
    return () => {
      this.invitationListeners = this.invitationListeners.filter((cb) => cb !== callback)
    }
  }

  // Notify session listeners
  private notifySessionListeners() {
    this.sessionListeners.forEach((listener) => listener(this.currentSession))
  }

  // Notify host listeners
  private notifyHostListeners() {
    if (this.currentSession) {
      this.hostListeners.forEach((listener) => listener(this.currentSession!.hosts))
    } else {
      this.hostListeners.forEach((listener) => listener([]))
    }
  }

  // Notify invitation listeners
  private notifyInvitationListeners(invitations: HostInvitation[]) {
    this.invitationListeners.forEach((listener) => listener(invitations))
  }

  // Get default permissions for a role
  private getDefaultPermissions(role: HostRole): HostPermissions {
    switch (role) {
      case "primary":
        return {
          canControlStream: true,
          canShareScreen: true,
          canManageChat: true,
          canInviteOthers: true,
          canUseAnnotations: true,
          canTriggerAlerts: true,
          canControlLayout: true,
          canMuteOthers: true,
        }
      case "co-host":
        return {
          canControlStream: false,
          canShareScreen: true,
          canManageChat: true,
          canInviteOthers: false,
          canUseAnnotations: true,
          canTriggerAlerts: true,
          canControlLayout: false,
          canMuteOthers: false,
        }
      case "guest":
        return {
          canControlStream: false,
          canShareScreen: true,
          canManageChat: false,
          canInviteOthers: false,
          canUseAnnotations: false,
          canTriggerAlerts: false,
          canControlLayout: false,
          canMuteOthers: false,
        }
      case "moderator":
        return {
          canControlStream: false,
          canShareScreen: false,
          canManageChat: true,
          canInviteOthers: false,
          canUseAnnotations: false,
          canTriggerAlerts: false,
          canControlLayout: false,
          canMuteOthers: true,
        }
      default:
        return {
          canControlStream: false,
          canShareScreen: false,
          canManageChat: false,
          canInviteOthers: false,
          canUseAnnotations: false,
          canTriggerAlerts: false,
          canControlLayout: false,
          canMuteOthers: false,
        }
    }
  }
}
