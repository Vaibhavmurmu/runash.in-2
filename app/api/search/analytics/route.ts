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
    const days = 7 // Declaring the variable before using it
    return NextResponse.json({
      totalQueries: 0,
      uniqueUsers: 0,
      avgResponseTime: 0,
      topQueries: [],
      period: days,
    })
  }
}
