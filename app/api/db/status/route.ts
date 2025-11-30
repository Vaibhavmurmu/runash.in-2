import { db } from "@/lib/drizzle"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    // Check if tables exist
    const tablesCheck = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    )

    const tables = (tablesCheck as any).rows.map((r: any) => r.table_name)

    const requiredTables = [
      "users",
      "sessions",
      "accounts",
      "verification_tokens",
      "auth_feature_flags",
      "products",
      "orders",
      "order_items",
      "reviews",
      "messages",
      "conversations",
      "notifications",
      "wishlist",
      "events",
    ]

    const missingTables = requiredTables.filter((t) => !tables.includes(t))

    return Response.json({
      status: "ok",
      database: "connected",
      tables: tables.length,
      requiredTables,
      missingTables,
      allTablesPresent: missingTables.length === 0,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  }
}
