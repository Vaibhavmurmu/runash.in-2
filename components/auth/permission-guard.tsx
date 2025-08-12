"use client"

import { usePermissions } from "@/hooks/use-permissions"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermissions?: string[]
  requiredRole?: string
  requireAnyPermission?: boolean
  fallback?: ReactNode
  loading?: ReactNode
}

export function PermissionGuard({
  children,
  requiredPermissions = [],
  requiredRole,
  requireAnyPermission = false,
  fallback = <div className="text-center text-muted-foreground">Access denied</div>,
  loading = <div className="text-center text-muted-foreground">Loading...</div>,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, loading: isLoading } = usePermissions()

  if (isLoading) {
    return <>{loading}</>
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAnyPermission
      ? hasAnyPermission(requiredPermissions)
      : hasAllPermissions(requiredPermissions)

    if (!hasRequiredPermissions) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
