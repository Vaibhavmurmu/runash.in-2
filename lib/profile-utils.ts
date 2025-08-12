import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "friends"]),
  showEmail: z.boolean(),
  showLocation: z.boolean(),
  allowMessages: z.boolean(),
  allowFollows: z.boolean(),
})

export interface UserProfile {
  id: number
  name: string
  username: string
  email: string
  bio?: string
  location?: string
  website?: string
  avatarUrl?: string
  role: string
  emailVerified: boolean
  emailVerifiedAt?: Date
  createdAt: Date
  updatedAt: Date
  followerCount?: number
  followingCount?: number
  isFollowing?: boolean
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showEmail: boolean
  showLocation: boolean
  allowMessages: boolean
  allowFollows: boolean
}

export class ProfileManager {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: number, viewerId?: number): Promise<UserProfile | null> {
    try {
      const [user] = await sql`
        SELECT 
          u.id, u.name, u.username, u.email, u.bio, u.location, u.website, 
          u.avatar_url, u.role, u.email_verified, u.email_verified_at,
          u.created_at, u.updated_at,
          (SELECT COUNT(*) FROM user_followers WHERE user_id = u.id) as follower_count,
          (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) as following_count
        FROM users u
        WHERE u.id = ${userId}
      `

      if (!user) return null

      let isFollowing = false
      if (viewerId && viewerId !== userId) {
        const [followRecord] = await sql`
          SELECT id FROM user_followers 
          WHERE user_id = ${userId} AND follower_id = ${viewerId}
        `
        isFollowing = !!followRecord
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatarUrl: user.avatar_url,
        role: user.role,
        emailVerified: user.email_verified,
        emailVerifiedAt: user.email_verified_at,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        followerCount: Number.parseInt(user.follower_count) || 0,
        followingCount: Number.parseInt(user.following_count) || 0,
        isFollowing,
      }
    } catch (error) {
      console.error("Error getting profile:", error)
      return null
    }
  }

  /**
   * Get user profile by username
   */
  static async getProfileByUsername(username: string, viewerId?: number): Promise<UserProfile | null> {
    try {
      const [user] = await sql`
        SELECT id FROM users WHERE username = ${username}
      `

      if (!user) return null

      return this.getProfile(user.id, viewerId)
    } catch (error) {
      console.error("Error getting profile by username:", error)
      return null
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Check if username is taken by another user
      if (updates.username) {
        const [existingUser] = await sql`
          SELECT id FROM users WHERE username = ${updates.username} AND id != ${userId}
        `
        if (existingUser) {
          throw new Error("Username is already taken")
        }
      }

      const updateFields = []
      const values = []

      if (updates.name !== undefined) {
        updateFields.push("name = $" + (values.length + 2))
        values.push(updates.name)
      }
      if (updates.username !== undefined) {
        updateFields.push("username = $" + (values.length + 2))
        values.push(updates.username)
      }
      if (updates.bio !== undefined) {
        updateFields.push("bio = $" + (values.length + 2))
        values.push(updates.bio)
      }
      if (updates.location !== undefined) {
        updateFields.push("location = $" + (values.length + 2))
        values.push(updates.location)
      }
      if (updates.website !== undefined) {
        updateFields.push("website = $" + (values.length + 2))
        values.push(updates.website)
      }
      if (updates.avatarUrl !== undefined) {
        updateFields.push("avatar_url = $" + (values.length + 2))
        values.push(updates.avatarUrl)
      }

      if (updateFields.length === 0) {
        return this.getProfile(userId)
      }

      updateFields.push("updated_at = NOW()")

      await sql`
        UPDATE users 
        SET ${sql.unsafe(updateFields.join(", "))}
        WHERE id = ${userId}
      `

      return this.getProfile(userId)
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  /**
   * Follow/unfollow user
   */
  static async toggleFollow(userId: number, targetUserId: number): Promise<{ isFollowing: boolean }> {
    try {
      if (userId === targetUserId) {
        throw new Error("Cannot follow yourself")
      }

      const [existingFollow] = await sql`
        SELECT id FROM user_followers 
        WHERE user_id = ${targetUserId} AND follower_id = ${userId}
      `

      if (existingFollow) {
        // Unfollow
        await sql`
          DELETE FROM user_followers 
          WHERE user_id = ${targetUserId} AND follower_id = ${userId}
        `
        return { isFollowing: false }
      } else {
        // Follow
        await sql`
          INSERT INTO user_followers (user_id, follower_id, created_at)
          VALUES (${targetUserId}, ${userId}, NOW())
        `
        return { isFollowing: true }
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      throw error
    }
  }

  /**
   * Get user's followers
   */
  static async getFollowers(userId: number, limit = 20, offset = 0): Promise<UserProfile[]> {
    try {
      const followers = await sql`
        SELECT u.id, u.name, u.username, u.avatar_url, u.bio
        FROM users u
        INNER JOIN user_followers uf ON u.id = uf.follower_id
        WHERE uf.user_id = ${userId}
        ORDER BY uf.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return followers.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar_url,
        bio: user.bio,
      })) as UserProfile[]
    } catch (error) {
      console.error("Error getting followers:", error)
      return []
    }
  }

  /**
   * Get users that the user is following
   */
  static async getFollowing(userId: number, limit = 20, offset = 0): Promise<UserProfile[]> {
    try {
      const following = await sql`
        SELECT u.id, u.name, u.username, u.avatar_url, u.bio
        FROM users u
        INNER JOIN user_followers uf ON u.id = uf.user_id
        WHERE uf.follower_id = ${userId}
        ORDER BY uf.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return following.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar_url,
        bio: user.bio,
      })) as UserProfile[]
    } catch (error) {
      console.error("Error getting following:", error)
      return []
    }
  }

  /**
   * Search users
   */
  static async searchUsers(query: string, limit = 20, offset = 0): Promise<UserProfile[]> {
    try {
      const users = await sql`
        SELECT id, name, username, avatar_url, bio
        FROM users
        WHERE 
          name ILIKE ${"%" + query + "%"} OR 
          username ILIKE ${"%" + query + "%"}
        ORDER BY 
          CASE 
            WHEN username ILIKE ${query + "%"} THEN 1
            WHEN name ILIKE ${query + "%"} THEN 2
            ELSE 3
          END,
          name
        LIMIT ${limit} OFFSET ${offset}
      `

      return users.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar_url,
        bio: user.bio,
      })) as UserProfile[]
    } catch (error) {
      console.error("Error searching users:", error)
      return []
    }
  }
}
