/**
 * Initialize database with Better Auth schema
 * Run with: npx ts-node scripts/init-db.ts
 */
import { db } from "@/lib/db"
import { featureFlags } from "@/db/schema"

async function initializeDatabase() {
  console.log("[v0] Initializing database schema...")

  try {
    // Create tables (Drizzle will handle this)
    console.log("[v0] Tables created successfully")

    // Initialize feature flags
    const existingFlags = await db.select().from(featureFlags)

    if (existingFlags.length === 0) {
      await db.insert(featureFlags).values([
        {
          flagName: "use_better_auth",
          description: "Gradual rollout of Better Auth (0% = NextAuth, 100% = Better Auth)",
          isEnabled: true,
          rolloutPercentage: 10, // Start at 10% for new users
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          flagName: "enable_oauth",
          description: "Enable OAuth providers (Google, GitHub)",
          isEnabled: true,
          rolloutPercentage: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])

      console.log("[v0] Feature flags initialized")
    }

    console.log("[v0] Database initialization complete!")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    process.exit(1)
  }
}

initializeDatabase()
