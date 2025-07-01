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

    // Use proper UUID casting in the query
    const users = await sql`
      SELECT 
        id,
        email,
        name,
        username,
        avatar_url,
        bio,
        website,
        location,
        email_verified,
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
        username,
        avatar_url,
        bio,
        website,
        location,
        email_verified,
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
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
