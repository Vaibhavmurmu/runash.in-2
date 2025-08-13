import { neon } from "@neondatabase/serverless"
import { Redis } from "ioredis"

const sql = neon(process.env.DATABASE_URL!)

// Redis client for caching (optional - falls back to in-memory cache)
let redis: Redis | null = null
try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL)
  }
} catch (error) {
  console.warn("Redis not available, using in-memory cache")
}

// In-memory cache fallback
const memoryCache = new Map<string, { data: any; expires: number }>()

export class PerformanceOptimizer {
  // Cache management
  static async get(key: string): Promise<any> {
    if (redis) {
      const cached = await redis.get(key)
      return cached ? JSON.parse(cached) : null
    }

    const cached = memoryCache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    return null
  }

  static async set(key: string, data: any, ttlSeconds = 300): Promise<void> {
    if (redis) {
      await redis.setex(key, ttlSeconds, JSON.stringify(data))
    } else {
      memoryCache.set(key, {
        data,
        expires: Date.now() + ttlSeconds * 1000,
      })
    }
  }

  static async del(key: string): Promise<void> {
    if (redis) {
      await redis.del(key)
    } else {
      memoryCache.delete(key)
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    if (redis) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } else {
      for (const key of memoryCache.keys()) {
        if (key.includes(pattern.replace("*", ""))) {
          memoryCache.delete(key)
        }
      }
    }
  }

  // Database query optimization
  static async getOptimizedUserList(page = 1, limit = 50, filters: any = {}) {
    const cacheKey = `users:list:${page}:${limit}:${JSON.stringify(filters)}`
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const offset = (page - 1) * limit
    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (filters.search) {
      whereClause += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }

    if (filters.role) {
      whereClause += ` AND role = $${params.length + 1}`
      params.push(filters.role)
    }

    if (filters.status) {
      whereClause += ` AND email_verified = $${params.length + 1}`
      params.push(filters.status === "verified")
    }

    const [users, totalCount] = await Promise.all([
      sql`
        SELECT id, name, email, role, email_verified, created_at, last_login_at
        FROM users 
        ${sql.unsafe(whereClause)}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) as count
        FROM users 
        ${sql.unsafe(whereClause)}
      `,
    ])

    const result = {
      users,
      total: Number.parseInt(totalCount[0].count),
      page,
      limit,
      totalPages: Math.ceil(Number.parseInt(totalCount[0].count) / limit),
    }

    await this.set(cacheKey, result, 60) // Cache for 1 minute
    return result
  }

  // Analytics data optimization
  static async getOptimizedAnalytics(timeRange = "7d") {
    const cacheKey = `analytics:${timeRange}`
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [loginStats, registrationStats, methodStats, deviceStats] = await Promise.all([
      sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as logins,
          COUNT(DISTINCT user_id) as unique_users
        FROM auth_events 
        WHERE event_type = 'login' 
        AND created_at >= ${startDate.toISOString()}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `,
      sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as registrations
        FROM users 
        WHERE created_at >= ${startDate.toISOString()}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `,
      sql`
        SELECT 
          method,
          COUNT(*) as count
        FROM auth_events 
        WHERE event_type = 'login' 
        AND created_at >= ${startDate.toISOString()}
        GROUP BY method
        ORDER BY count DESC
      `,
      sql`
        SELECT 
          device_type,
          COUNT(*) as count
        FROM auth_events 
        WHERE created_at >= ${startDate.toISOString()}
        GROUP BY device_type
        ORDER BY count DESC
      `,
    ])

    const result = {
      loginStats,
      registrationStats,
      methodStats,
      deviceStats,
      generatedAt: new Date().toISOString(),
    }

    const ttl = timeRange === "24h" ? 300 : timeRange === "7d" ? 600 : 1800
    await this.set(cacheKey, result, ttl)
    return result
  }

  // Performance metrics
  static async getPerformanceMetrics() {
    const cacheKey = "performance:metrics"
    const cached = await this.get(cacheKey)
    if (cached) return cached

    const [dbStats, cacheStats, systemStats] = await Promise.all([
      this.getDatabaseMetrics(),
      this.getCacheMetrics(),
      this.getSystemMetrics(),
    ])

    const result = {
      database: dbStats,
      cache: cacheStats,
      system: systemStats,
      timestamp: Date.now(),
    }

    await this.set(cacheKey, result, 30) // Cache for 30 seconds
    return result
  }

  private static async getDatabaseMetrics() {
    const start = Date.now()
    const result = await sql`SELECT 1 as test`
    const responseTime = Date.now() - start

    const [connectionStats] = await sql`
      SELECT 
        count(*) as total_connections,
        count(*) filter (where state = 'active') as active_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
    `

    return {
      responseTime,
      connections: connectionStats,
    }
  }

  private static async getCacheMetrics() {
    if (redis) {
      const info = await redis.info("memory")
      const memory = info.split("\n").find((line) => line.startsWith("used_memory:"))
      return {
        type: "redis",
        memory: memory ? memory.split(":")[1] : "unknown",
        connected: true,
      }
    }

    return {
      type: "memory",
      size: memoryCache.size,
      connected: true,
    }
  }

  private static async getSystemMetrics() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
    }
  }

  // Background job processing
  static async processBackgroundJobs() {
    const jobs = [
      this.cleanupExpiredTokens(),
      this.aggregateAnalytics(),
      this.cleanupOldLogs(),
      this.updateSecurityMetrics(),
    ]

    await Promise.allSettled(jobs)
  }

  private static async cleanupExpiredTokens() {
    await sql`
      DELETE FROM email_verification_tokens 
      WHERE expires_at < NOW()
    `

    await sql`
      DELETE FROM password_reset_tokens 
      WHERE expires_at < NOW()
    `
  }

  private static async aggregateAnalytics() {
    // Aggregate daily analytics
    await sql`
      INSERT INTO daily_analytics (date, total_logins, unique_users, registrations)
      SELECT 
        DATE(created_at) as date,
        COUNT(*) filter (where event_type = 'login') as total_logins,
        COUNT(DISTINCT user_id) filter (where event_type = 'login') as unique_users,
        COUNT(*) filter (where event_type = 'register') as registrations
      FROM auth_events 
      WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
      GROUP BY DATE(created_at)
      ON CONFLICT (date) DO UPDATE SET
        total_logins = EXCLUDED.total_logins,
        unique_users = EXCLUDED.unique_users,
        registrations = EXCLUDED.registrations
    `
  }

  private static async cleanupOldLogs() {
    // Keep logs for 90 days
    await sql`
      DELETE FROM auth_logs 
      WHERE created_at < NOW() - INTERVAL '90 days'
    `
  }

  private static async updateSecurityMetrics() {
    // Update security threat scores
    await sql`
      UPDATE security_threats 
      SET risk_score = risk_score * 0.95 
      WHERE updated_at < NOW() - INTERVAL '1 day'
      AND status = 'active'
    `
  }
}

// Rate limiting
export class RateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>()

  static async checkLimit(
    key: string,
    maxRequests: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const limit = this.limits.get(key)

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs })
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs }
    }

    if (limit.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: limit.resetTime }
    }

    limit.count++
    return {
      allowed: true,
      remaining: maxRequests - limit.count,
      resetTime: limit.resetTime,
    }
  }
}

// Query builder for complex filters
export class QueryBuilder {
  private conditions: string[] = []
  private params: any[] = []

  where(field: string, operator: string, value: any) {
    this.conditions.push(`${field} ${operator} $${this.params.length + 1}`)
    this.params.push(value)
    return this
  }

  whereIn(field: string, values: any[]) {
    if (values.length === 0) return this
    const placeholders = values.map((_, i) => `$${this.params.length + i + 1}`).join(", ")
    this.conditions.push(`${field} IN (${placeholders})`)
    this.params.push(...values)
    return this
  }

  whereBetween(field: string, start: any, end: any) {
    this.conditions.push(`${field} BETWEEN $${this.params.length + 1} AND $${this.params.length + 2}`)
    this.params.push(start, end)
    return this
  }

  build() {
    return {
      where: this.conditions.length > 0 ? `WHERE ${this.conditions.join(" AND ")}` : "",
      params: this.params,
    }
  }
}
