import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const analytics = await aiSearchService.getSearchAnalytics(days)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Search analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
