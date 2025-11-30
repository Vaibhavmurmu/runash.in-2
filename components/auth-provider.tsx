"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { User, Session } from "@/lib/auth"

interface AuthContextType {
  isLoading: boolean
  user: User | null
  session: Session | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider for auth state across app
 * Wrap your app or route layout with this component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
