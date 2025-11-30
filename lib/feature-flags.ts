import { db } from "./db"

interface FeatureFlagContext {
  userId?: string
  userPercentage?: number
}

/**
 * Check if a feature flag is enabled for a user
 * Useful for gradual rollout of Better Auth migration
 */
export async function isFeatureFlagEnabled(flagName: string, context?: FeatureFlagContext): Promise<boolean> {
  try {
    const result = await db.query(`SELECT * FROM auth_feature_flags WHERE flag_name = $1 LIMIT 1`, [flagName])

    if (!result || result.length === 0 || !result[0].is_enabled) {
      return false
    }

    const flagData = result[0]

    // Check if user is in target list
    if (flagData.target_users && context?.userId) {
      const targets = flagData.target_users as string[]
      if (targets.includes(context.userId)) {
        return true
      }
    }

    // Check rollout percentage
    if (flagData.rollout_percentage && flagData.rollout_percentage < 100) {
      // Use user ID or random for percentage calculation
      const seed = context?.userId || Math.random().toString()
      const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const percentage = (hash % 100) + 1
      return percentage <= flagData.rollout_percentage
    }

    return true
  } catch (error) {
    console.error("[v0] Error checking feature flag:", error)
    return false
  }
}

/**
 * Get all enabled flags for analytics/debugging
 */
export async function getAllFeatureFlags() {
  try {
    const result = await db.query(`SELECT * FROM auth_feature_flags`)
    return result || []
  } catch (error) {
    console.error("[v0] Error fetching feature flags:", error)
    return []
  }
}

/**
 * Update feature flag (admin only in production)
 */
export async function updateFeatureFlag(
  flagName: string,
  updates: {
    isEnabled?: boolean
    rolloutPercentage?: number
    targetUsers?: string[]
  },
) {
  try {
    const setClauses: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (updates.isEnabled !== undefined) {
      setClauses.push(`is_enabled = $${paramIndex}`)
      params.push(updates.isEnabled)
      paramIndex++
    }

    if (updates.rolloutPercentage !== undefined) {
      setClauses.push(`rollout_percentage = $${paramIndex}`)
      params.push(updates.rolloutPercentage)
      paramIndex++
    }

    if (updates.targetUsers !== undefined) {
      setClauses.push(`target_users = $${paramIndex}`)
      params.push(JSON.stringify(updates.targetUsers))
      paramIndex++
    }

    setClauses.push(`updated_at = NOW()`)
    params.push(flagName)

    const query = `
      UPDATE auth_feature_flags 
      SET ${setClauses.join(", ")} 
      WHERE flag_name = $${paramIndex}
      RETURNING *
    `

    const result = await db.query(query, params)
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error updating feature flag:", error)
    throw error
  }
}
