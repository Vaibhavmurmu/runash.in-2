import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidUUID } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    // Validate UUID format
    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    // First, let's check what columns actually exist
    const users = await sql`
      SELECT 
        id,
        email,
        name,
        COALESCE(username, '') as username,
        COALESCE(avatar_url, '') as avatar_url,
        COALESCE(bio, '') as bio,
        COALESCE(website, '') as website,
        COALESCE(location, '') as location,
        COALESCE(email_verified, false) as email_verified,
        email_verified_at,
        pending_email,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${userId}::uuid
    `

    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)

    // If it's a column error, try a simpler query
    if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
      try {
        const userId = getCurrentUserId()
        const users = await sql`
          SELECT 
            id,
            email,
            name,
            created_at,
            updated_at
          FROM users 
          WHERE id = ${userId}::uuid
        `

        const user = users[0]
        if (user) {
          // Return user with default values for missing columns
          return NextResponse.json({
            ...user,
            username: "",
            avatar_url: "",
            bio: "",
            website: "",
            location: "",
            email_verified: false,
            email_verified_at: null,
            pending_email: null,
          })
        }
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError)
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    // Validate UUID format
    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { name, username, bio, website, location, avatar_url } = body

    // Try to update with all columns, but handle missing columns gracefully
    try {
      const updatedUsers = await sql`
        UPDATE users 
        SET 
          name = ${name || null},
          username = ${username || null},
          bio = ${bio || null},
          website = ${website || null},
          location = ${location || null},
          avatar_url = ${avatar_url || null},
          updated_at = NOW()
        WHERE id = ${userId}::uuid
        RETURNING 
          id,
          email,
          name,
          COALESCE(username, '') as username,
          COALESCE(avatar_url, '') as avatar_url,
          COALESCE(bio, '') as bio,
          COALESCE(website, '') as website,
          COALESCE(location, '') as location,
          COALESCE(email_verified, false) as email_verified,
          email_verified_at,
          pending_email,
          created_at,
          updated_at
      `

      const updatedUser = updatedUsers[0]

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(updatedUser)
    } catch (updateError) {
      // If update fails due to missing columns, try basic update
      if (
        updateError.message &&
        updateError.message.includes("column") &&
        updateError.message.includes("does not exist")
      ) {
        const updatedUsers = await sql`
          UPDATE users 
          SET 
            name = ${name || null},
            updated_at = NOW()
          WHERE id = ${userId}::uuid
          RETURNING 
            id,
            email,
            name,
            created_at,
            updated_at
        `

        const updatedUser = updatedUsers[0]
        if (updatedUser) {
          return NextResponse.json({
            ...updatedUser,
            username: username || "",
            avatar_url: avatar_url || "",
            bio: bio || "",
            website: website || "",
            location: location || "",
            email_verified: false,
            email_verified_at: null,
            pending_email: null,
          })
        }
      }
      throw updateError
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
