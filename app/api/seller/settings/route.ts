import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()

    const result = await sql(
      `UPDATE users SET 
        bio = $1,
        updated_at = NOW()
       WHERE id = $2 AND role = 'seller'
       RETURNING *`,
      [JSON.stringify(data), Number.parseInt(userId)],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating seller settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
