/**
 * Database administration utilities
 * Use with caution - for development and testing only
 */

export const DBAdmin = {
  /**
   * Initialize database with all required tables
   * Run via: POST /api/db/migrate with Authorization header
   */
  async initializeDatabase() {
    try {
      const response = await fetch("/api/db/status")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw error
    }
  },

  /**
   * Seed database with sample data
   * Run via: POST /api/db/seed with Authorization header
   */
  async seedDatabase(migrationSecret: string) {
    try {
      const response = await fetch("/api/db/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${migrationSecret}`,
        },
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to seed database:", error)
      throw error
    }
  },

  /**
   * Check database connection and table status
   */
  async checkDatabaseStatus() {
    try {
      const response = await fetch("/api/db/status")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to check database status:", error)
      throw error
    }
  },
}
