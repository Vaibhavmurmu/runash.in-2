import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema"

// Ensure we have the database URL
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set")
}

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL!

// Create Neon HTTP client
const sql = neon(databaseUrl)

// Create Drizzle ORM instance with schema
export const db = drizzle(sql, { schema })

export type DB = typeof db

// Export schema for use in components and utilities
export { schema }
