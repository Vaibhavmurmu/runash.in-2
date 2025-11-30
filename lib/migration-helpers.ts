import { db } from "./db"
import crypto from "crypto"

interface NextAuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: Date | null
  password?: string | null
  providers?: Array<{
    provider: string
    providerAccountId: string
    accessToken?: string
    refreshToken?: string
  }>
}

/**
 * Migrate user from NextAuth to Better Auth
 * Preserves user data and linked OAuth accounts
 */
export async function migrateUserFromNextAuth(nextAuthUser: NextAuthUser) {
  try {
    const userId = crypto.randomUUID()

    // Create Better Auth user
    await db.query(
      `INSERT INTO users (id, email, name, image, email_verified, password, migrated_from_nextauth, nextauth_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        userId,
        nextAuthUser.email,
        nextAuthUser.name,
        nextAuthUser.image,
        !!nextAuthUser.emailVerified,
        nextAuthUser.password || null,
        true,
        nextAuthUser.id,
      ],
    )

    // Migrate OAuth accounts if any
    if (nextAuthUser.providers && nextAuthUser.providers.length > 0) {
      for (const provider of nextAuthUser.providers) {
        await db.query(
          `INSERT INTO accounts (id, user_id, provider, provider_account_id, access_token, refresh_token, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            crypto.randomUUID(),
            userId,
            provider.provider,
            provider.providerAccountId,
            provider.accessToken || null,
            provider.refreshToken || null,
          ],
        )
      }
    }

    console.log(`[v0] Successfully migrated user ${nextAuthUser.email} from NextAuth`)
    return { success: true, userId }
  } catch (error) {
    console.error("[v0] Migration error:", error)
    throw error
  }
}

/**
 * Batch migrate users from NextAuth
 * Should be run during deployment
 */
export async function batchMigrateUsers(
  nextAuthUsers: NextAuthUser[],
  onProgress?: (current: number, total: number) => void,
) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  }

  for (const user of nextAuthUsers) {
    try {
      await migrateUserFromNextAuth(user)
      results.successful++
    } catch (error) {
      results.failed++
      results.errors.push({
        email: user.email,
        error: String(error),
      })
    }

    const current = results.successful + results.failed
    onProgress?.(current, nextAuthUsers.length)
  }

  console.log(`[v0] Batch migration complete: ${results.successful} successful, ${results.failed} failed`)
  return results
}
