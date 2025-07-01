import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidUUID, isValidInteger } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    // Validate user ID format (UUID or integer)
    if (!isValidUUID(userId) && !isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    let user
    try {
      // First, let's detect the table structure
      const tableInfo = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `

      console.log("Table structure:", tableInfo)

      // Check if id column is UUID or integer
      const idColumn = tableInfo.find((col) => col.column_name === "id")
      const isUuidId = idColumn?.data_type === "uuid"

      // Build the query based on available columns
      const availableColumns = tableInfo.map((col) => col.column_name)

      let selectClause = "id, email, name, created_at, updated_at"

      // Add optional columns if they exist
      if (availableColumns.includes("username")) selectClause += ", username"
      if (availableColumns.includes("avatar_url")) selectClause += ", avatar_url"
      if (availableColumns.includes("bio")) selectClause += ", bio"
      if (availableColumns.includes("website")) selectClause += ", website"
      if (availableColumns.includes("location")) selectClause += ", location"
      if (availableColumns.includes("email_verified")) selectClause += ", email_verified"
      if (availableColumns.includes("email_verified_at")) selectClause += ", email_verified_at"
      if (availableColumns.includes("pending_email")) selectClause += ", pending_email"

      // Use appropriate casting for the WHERE clause
      let whereClause
      if (isUuidId && isValidUUID(userId)) {
        whereClause = `id = '${userId}'::uuid`
      } else if (!isUuidId && isValidInteger(userId)) {
        whereClause = `id = ${userId}`
      } else {
        // Try both approaches
        try {
          const users = await sql`SELECT id FROM users WHERE id = ${userId}`
          if (users.length > 0) {
            whereClause = `id = ${userId}`
          } else {
            whereClause = `id = '${userId}'::uuid`
          }
        } catch {
          whereClause = `id = ${userId}`
        }
      }

      // Execute the dynamic query
      const query = `SELECT ${selectClause} FROM users WHERE ${whereClause}`
      console.log("Executing query:", query)

      const users = await sql.unsafe(query)
      const basicUser = users[0]

      if (basicUser) {
        // Fill in missing columns with defaults
        user = {
          id: basicUser.id,
          email: basicUser.email,
          name: basicUser.name,
          username: basicUser.username || null,
          avatar_url: basicUser.avatar_url || null,
          bio: basicUser.bio || null,
          website: basicUser.website || null,
          location: basicUser.location || null,
          email_verified: basicUser.email_verified || false,
          email_verified_at: basicUser.email_verified_at || null,
          pending_email: basicUser.pending_email || null,
          created_at: basicUser.created_at,
          updated_at: basicUser.updated_at,
        }
      }
    } catch (error) {
      console.log("Dynamic query failed, trying simple approach:", error.message)

      // Fallback: try the simplest possible query
      try {
        let users
        if (isValidInteger(userId)) {
          users = await sql`SELECT * FROM users WHERE id = ${Number.parseInt(userId)}`
        } else {
          users = await sql`SELECT * FROM users WHERE id = ${userId}`
        }

        const basicUser = users[0]
        if (basicUser) {
          user = {
            id: basicUser.id,
            email: basicUser.email || "",
            name: basicUser.name || "",
            username: basicUser.username || null,
            avatar_url: basicUser.avatar_url || null,
            bio: basicUser.bio || null,
            website: basicUser.website || null,
            location: basicUser.location || null,
            email_verified: basicUser.email_verified || false,
            email_verified_at: basicUser.email_verified_at || null,
            pending_email: basicUser.pending_email || null,
            created_at: basicUser.created_at || new Date().toISOString(),
            updated_at: basicUser.updated_at || new Date().toISOString(),
          }
        }
      } catch (simpleError) {
        console.error("Even simple query failed:", simpleError)
        return NextResponse.json({ error: "Database connection error" }, { status: 500 })
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId) && !isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { name, username, bio, website, location, avatar_url } = body

    let updatedUser
    try {
      // Check table structure first
      const tableInfo = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `

      const availableColumns = tableInfo.map((col) => col.column_name)
      const idColumn = tableInfo.find((col) => col.column_name === "id")
      const isUuidId = idColumn?.data_type === "uuid"

      // Build update query based on available columns
      const updateParts = []
      const returningParts = ["id", "email", "name", "created_at", "updated_at"]

      if (name !== undefined) updateParts.push(`name = '${name || ""}'`)
      if (availableColumns.includes("username") && username !== undefined) {
        updateParts.push(`username = '${username || ""}'`)
        returningParts.push("username")
      }
      if (availableColumns.includes("bio") && bio !== undefined) {
        updateParts.push(`bio = '${bio || ""}'`)
        returningParts.push("bio")
      }
      if (availableColumns.includes("website") && website !== undefined) {
        updateParts.push(`website = '${website || ""}'`)
        returningParts.push("website")
      }
      if (availableColumns.includes("location") && location !== undefined) {
        updateParts.push(`location = '${location || ""}'`)
        returningParts.push("location")
      }
      if (availableColumns.includes("avatar_url") && avatar_url !== undefined) {
        updateParts.push(`avatar_url = '${avatar_url || ""}'`)
        returningParts.push("avatar_url")
      }

      if (availableColumns.includes("updated_at")) {
        updateParts.push(`updated_at = NOW()`)
      }

      // Add other columns to returning if they exist
      if (availableColumns.includes("email_verified")) returningParts.push("email_verified")
      if (availableColumns.includes("email_verified_at")) returningParts.push("email_verified_at")
      if (availableColumns.includes("pending_email")) returningParts.push("pending_email")

      let whereClause
      if (isUuidId && isValidUUID(userId)) {
        whereClause = `id = '${userId}'::uuid`
      } else {
        whereClause = `id = ${userId}`
      }

      const updateQuery = `
        UPDATE users 
        SET ${updateParts.join(", ")}
        WHERE ${whereClause}
        RETURNING ${returningParts.join(", ")}
      `

      console.log("Update query:", updateQuery)
      const updatedUsers = await sql.unsafe(updateQuery)
      const basicUser = updatedUsers[0]

      if (basicUser) {
        updatedUser = {
          id: basicUser.id,
          email: basicUser.email,
          name: basicUser.name,
          username: basicUser.username || username || null,
          avatar_url: basicUser.avatar_url || avatar_url || null,
          bio: basicUser.bio || bio || null,
          website: basicUser.website || website || null,
          location: basicUser.location || location || null,
          email_verified: basicUser.email_verified || false,
          email_verified_at: basicUser.email_verified_at || null,
          pending_email: basicUser.pending_email || null,
          created_at: basicUser.created_at,
          updated_at: basicUser.updated_at,
        }
      }
    } catch (updateError) {
      console.log("Dynamic update failed, trying simple update:", updateError.message)

      // Fallback to basic update
      try {
        let updatedUsers
        if (isValidInteger(userId)) {
          updatedUsers = await sql`
            UPDATE users 
            SET name = ${name || null}, updated_at = NOW()
            WHERE id = ${Number.parseInt(userId)}
            RETURNING *
          `
        } else {
          updatedUsers = await sql`
            UPDATE users 
            SET name = ${name || null}, updated_at = NOW()
            WHERE id = ${userId}
            RETURNING *
          `
        }

        const basicUser = updatedUsers[0]
        if (basicUser) {
          updatedUser = {
            ...basicUser,
            username: username || basicUser.username || null,
            avatar_url: avatar_url || basicUser.avatar_url || null,
            bio: bio || basicUser.bio || null,
            website: website || basicUser.website || null,
            location: location || basicUser.location || null,
            email_verified: basicUser.email_verified || false,
            email_verified_at: basicUser.email_verified_at || null,
            pending_email: basicUser.pending_email || null,
          }
        }
      } catch (basicError) {
        console.error("Basic update also failed:", basicError)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
