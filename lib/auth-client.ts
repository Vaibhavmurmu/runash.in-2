import { createAuthClient } from "better-auth/react"

/**
 * Client-side Better Auth instance
 * Used in 'use client' components for authentication
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export type Session = typeof authClient.$Infer.Session
