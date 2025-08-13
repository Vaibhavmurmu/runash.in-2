import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface AdminSetting {
  id: string
  category: string
  key: string
  value: any
  type: "string" | "number" | "boolean" | "json"
  description?: string
  updated_by: string
  updated_at: string
}

export class AdminSettings {
  static async get(category: string, key?: string): Promise<AdminSetting[]> {
    if (key) {
      return await sql`
        SELECT * FROM admin_settings 
        WHERE category = ${category} AND key = ${key}
        ORDER BY key
      `
    }

    return await sql`
      SELECT * FROM admin_settings 
      WHERE category = ${category}
      ORDER BY key
    `
  }

  static async set(
    category: string,
    key: string,
    value: any,
    type: AdminSetting["type"],
    updatedBy: string,
    description?: string,
  ): Promise<void> {
    await sql`
      INSERT INTO admin_settings (category, key, value, type, description, updated_by)
      VALUES (${category}, ${key}, ${JSON.stringify(value)}, ${type}, ${description}, ${updatedBy})
      ON CONFLICT (category, key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        type = EXCLUDED.type,
        description = EXCLUDED.description,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
    `
  }

  static async getByCategory(category: string): Promise<Record<string, any>> {
    const settings = await this.get(category)
    const result: Record<string, any> = {}

    for (const setting of settings) {
      try {
        result[setting.key] = JSON.parse(setting.value)
      } catch {
        result[setting.key] = setting.value
      }
    }

    return result
  }

  static async getAllCategories(): Promise<string[]> {
    const result = await sql`
      SELECT DISTINCT category FROM admin_settings ORDER BY category
    `
    return result.map((row) => row.category)
  }
}
