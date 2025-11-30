"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@/lib/auth"

interface AuthState {
  isLoading: boolean
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  error: string | null
}

/**
 * Hook for accessing authentication state
 * Usage: const { user, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    user: null,
    session: null,
    isAuthenticated: false,
    error: null,
  })

  useEffect(() => {
    // Fetch session on mount
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.authenticated) {
          setAuthState({
            isLoading: false,
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            error: null,
          })
        } else {
          setAuthState({
            isLoading: false,
            user: null,
            session: null,
            isAuthenticated: false,
            error: null,
          })
        }
      } catch (error) {
        setAuthState({
          isLoading: false,
          user: null,
          session: null,
          isAuthenticated: false,
          error: String(error),
        })
      }
    }

    fetchSession()
  }, [])

  return authState
}

/**
 * Hook for requiring authentication in client components
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login?from=" + encodeURIComponent(window.location.pathname))
    }
  }, [auth.isLoading, auth.isAuthenticated, router])

  return auth
}
