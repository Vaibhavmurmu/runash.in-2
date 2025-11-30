import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { featureFlags } from "@/db/schema"
import { requireAuth } from "@/lib/auth-helpers"
import { eq } from "drizzle-orm"

/**
 * Get all feature flags (admin only)
 * GET /api/admin/flags
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const flags = await db.select().from(featureFlags)
    return NextResponse.json({ flags }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error fetching flags:", error)
    return NextResponse.json({ error: "Failed to fetch flags" }, { status: 500 })
  }
}

/**
 * Update feature flag (admin only)
 * PUT /api/admin/flags/:flagId
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { flagId, isEnabled, rolloutPercentage, targetUsers } = await request.json()

    if (!flagId) {
      return NextResponse.json({ error: "Flag ID is required" }, { status: 400 })
    }

    const updated = await db
      .update(featureFlags)
      .set({
        isEnabled,
        rolloutPercentage,
        targetUsers,
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, flagId))
      .returning()

    return NextResponse.json({ flag: updated[0] }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error updating flag:", error)
    return NextResponse.json({ error: "Failed to update flag" }, { status: 500 })
  }
}
