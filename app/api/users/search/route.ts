import { type NextRequest, NextResponse } from "next/server"
import { ProfileManager } from "@/lib/profile-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ message: "Query must be at least 2 characters long" }, { status: 400 })
    }

    const users = await ProfileManager.searchUsers(query.trim(), limit, offset)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
