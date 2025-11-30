import { sql } from "@vercel/postgres"

// Use direct PostgreSQL connection for simpler setup
export const db = sql

/**
 * Execute raw SQL query
 */
export async function query(text: string, params?: any[]) {
  try {
    const result = await sql.query(text, params)
    return result.rows
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}
