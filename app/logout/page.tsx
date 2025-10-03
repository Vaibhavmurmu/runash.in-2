"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" })
  }, [])
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <p className="text-sm text-muted-foreground">Signing you out…</p>
    </div>
  )
}
