import { NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

// This approach reads migration files and executes them directly

async function runMigrations() {
  try {
    const migrationsDir = path.join(process.cwd(), "db", "migrations")

    if (!fs.existsSync(migrationsDir)) {
      console.log("[v0] No migrations directory found - skipping migrations")
      return { success: true, message: "No migrations to run" }
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort()

    if (migrationFiles.length === 0) {
      console.log("[v0] No migration files found")
      return { success: true, message: "No migration files to run" }
    }

    console.log(`[v0] Found ${migrationFiles.length} migration files`)

    // For production, migrations should be run via drizzle-kit CLI during deployment
    // This endpoint is mainly for local development verification
    console.log("[v0] Note: Run 'npx drizzle-kit migrate' CLI to execute migrations")

    return {
      success: true,
      message: "Run migrations via CLI: npx drizzle-kit migrate",
      migrationFiles: migrationFiles,
    }
  } catch (error) {
    console.error("[v0] Migration check error:", error)
    throw error
  }
}

/**
 * API route to check migration status
 * Admin only - should be called after deployment or during setup
 *
 * Usage: POST /api/db/migrate
 */
export async function POST(request: Request) {
  const authToken = request.headers.get("authorization")
  if (process.env.NODE_ENV === "production" && authToken !== `Bearer ${process.env.MIGRATION_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[v0] Checking database migration status...")

    const result = await runMigrations()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("[v0] Migration check failed:", error)
    return NextResponse.json({ error: "Migration check failed", details: String(error) }, { status: 500 })
  }
}
