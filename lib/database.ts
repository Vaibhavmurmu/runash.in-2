import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Helper function to ensure proper UUID formatting
export function formatUUID(uuid: string): string {
  // Remove any extra quotes or formatting
  return uuid.replace(/['"]/g, "")
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  username?: string
  avatar_url?: string
  bio?: string
  website?: string
  location?: string
  email_verified?: boolean
  email_verified_at?: string
  pending_email?: string
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  compact_mode: boolean
  show_sidebar_labels: boolean
  hour_format_24: boolean
  reduced_motion: boolean
  high_contrast: boolean
  large_text: boolean
  screen_reader_support: boolean
  auto_save: boolean
  preload_content: boolean
  background_sync: boolean
  data_usage: "low" | "balanced" | "high"
  analytics_tracking: boolean
  crash_reports: boolean
  personalized_recommendations: boolean
  default_video_quality: string
  audio_quality: string
  auto_adjust_quality: boolean
  hardware_acceleration: boolean
  created_at: string
  updated_at: string
}

export interface UserNotifications {
  id: string
  user_id: string
  email_stream_start: boolean
  email_new_follower: boolean
  email_donations: boolean
  email_weekly_report: boolean
  email_security: boolean
  email_marketing: boolean
  push_stream_start: boolean
  push_new_follower: boolean
  push_donations: boolean
  push_chat_mentions: boolean
  push_security: boolean
  inapp_stream_start: boolean
  inapp_new_follower: boolean
  inapp_donations: boolean
  inapp_chat_mentions: boolean
  inapp_moderator_actions: boolean
  notification_sounds: boolean
  chat_sounds: boolean
  created_at: string
  updated_at: string
}

export interface UserSecurity {
  id: string
  user_id: string
  two_factor_enabled: boolean
  two_factor_secret?: string
  login_notifications: boolean
  session_timeout: boolean
  suspicious_activity_alerts: boolean
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  device_name?: string
  device_type?: string
  ip_address?: string
  location?: string
  user_agent?: string
  is_current: boolean
  last_active: string
  created_at: string
}
