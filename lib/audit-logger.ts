import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface AuditLogEntry {
  userId?: number
  action: string
  resource: string
  resourceId?: string
  details?: any
  ip?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
}

export class AuditLogger {
  /**
   * Log an audit event
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      await sql`
        INSERT INTO admin_activity_logs (
          admin_id, action, target_type, target_id, details, 
          ip_address, user_agent, created_at
        ) VALUES (
          ${entry.userId || null},
          ${entry.action},
          ${entry.resource},
          ${entry.resourceId ? Number.parseInt(entry.resourceId) : null},
          ${JSON.stringify({
            success: entry.success,
            errorMessage: entry.errorMessage,
            ...entry.details,
          })},
          ${entry.ip ? entry.ip : null}::inet,
          ${entry.userAgent || null},
          NOW()
        )
      `
    } catch (error) {
      console.error("Failed to log audit event:", error)
    }
  }

  /**
   * Log authentication events
   */
  static async logAuth(
    action: "login" | "logout" | "register" | "password_reset" | "email_verify",
    userId?: number,
    email?: string,
    success = true,
    errorMessage?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: `auth_${action}`,
      resource: "authentication",
      details: { email },
      success,
      errorMessage,
      ip,
      userAgent,
    })
  }

  /**
   * Log permission changes
   */
  static async logPermissionChange(
    adminId: number,
    targetUserId: number,
    action: "grant" | "revoke",
    permission: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId: adminId,
      action: `permission_${action}`,
      resource: "user_permissions",
      resourceId: targetUserId.toString(),
      details: { permission },
      success: true,
      ip,
      userAgent,
    })
  }

  /**
   * Log role changes
   */
  static async logRoleChange(
    adminId: number,
    targetUserId: number,
    oldRole: string,
    newRole: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId: adminId,
      action: "role_change",
      resource: "user_role",
      resourceId: targetUserId.toString(),
      details: { oldRole, newRole },
      success: true,
      ip,
      userAgent,
    })
  }

  /**
   * Log data access
   */
  static async logDataAccess(
    userId: number,
    resource: string,
    resourceId?: string,
    action: "read" | "write" | "delete" = "read",
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: `data_${action}`,
      resource,
      resourceId,
      success: true,
      ip,
      userAgent,
    })
  }

  /**
   * Get audit logs for a user
   */
  static async getUserLogs(userId: number, limit = 50, offset = 0): Promise<any[]> {
    try {
      const logs = await sql`
        SELECT 
          action, target_type as resource, target_id as resource_id,
          details, ip_address, user_agent, created_at
        FROM admin_activity_logs
        WHERE admin_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      return logs
    } catch (error) {
      console.error("Failed to get user logs:", error)
      return []
    }
  }

  /**
   * Get recent security events
   */
  static async getSecurityEvents(limit = 100, offset = 0): Promise<any[]> {
    try {
      const events = await sql`
        SELECT 
          admin_id as user_id, action, target_type as resource, 
          target_id as resource_id, details, ip_address, 
          user_agent, created_at
        FROM admin_activity_logs
        WHERE action LIKE 'auth_%' OR action LIKE 'permission_%' OR action = 'role_change'
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      return events
    } catch (error) {
      console.error("Failed to get security events:", error)
      return []
    }
  }
}
