import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let data
    switch (type) {
      case "popular":
        data = await aiSearchService.getPopularQueries()
        break
      case "trending":
        data = await aiSearchService.getTrendingContent()
        break
      default:
        data = {
          popular_queries: await aiSearchService.getPopularQueries(),
          trending_content: await aiSearchService.getTrendingContent(),
        }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Search analytics API error:", error)
    return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 })
  }
}
