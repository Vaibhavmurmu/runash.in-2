export type HostRole = "primary" | "co-host" | "guest" | "moderator"

export type HostStatus = "online" | "offline" | "pending" | "ready" | "streaming" | "disconnected"

export type HostPermissions = {
  canControlStream: boolean
  canShareScreen: boolean
  canManageChat: boolean
  canInviteOthers: boolean
  canUseAnnotations: boolean
  canTriggerAlerts: boolean
  canControlLayout: boolean
  canMuteOthers: boolean
}

export type HostAudioVideoSettings = {
  isMicrophoneEnabled: boolean
  isCameraEnabled: boolean
  isScreenShareEnabled: boolean
  audioInputDevice: string | null
  videoInputDevice: string | null
  audioOutputDevice: string | null
}

export interface Host {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  role: HostRole
  status: HostStatus
  permissions: HostPermissions
  settings: HostAudioVideoSettings
  joinedAt?: Date
  lastActiveAt?: Date
}

export interface HostInvitation {
  id: string
  hostId: string
  inviteeEmail: string
  inviteeName?: string
  role: HostRole
  permissions: HostPermissions
  status: "pending" | "accepted" | "declined" | "expired"
  createdAt: Date
  expiresAt: Date
  message?: string
}

export type LayoutConfiguration = {
  type: "grid" | "spotlight" | "sidebar" | "picture-in-picture" | "custom"
  primaryHostId?: string
  visibleHostIds: string[]
  positions?: Record<string, { x: number; y: number; width: number; height: number }>
}

export interface HostConnection {
  id: string
  hostId: string
  connectionId: string
  peerId: string
  streamId: string
  quality: "high" | "medium" | "low" | "auto"
  bandwidth: number
  latency: number
  status: "connecting" | "connected" | "disconnected" | "failed"
  error?: string
}

export interface MultiHostSession {
  id: string
  streamId: string
  hosts: Host[]
  layout: LayoutConfiguration
  activeHostId?: string
  primaryHostId: string
  connections: HostConnection[]
  startedAt?: Date
  endedAt?: Date
  settings: {
    maxHosts: number
    autoAcceptInvitations: boolean
    defaultHostPermissions: Partial<HostPermissions>
    defaultHostRole: HostRole
    allowGuestControls: boolean
    recordIndividualTracks: boolean
  }
}
