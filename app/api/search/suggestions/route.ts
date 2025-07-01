import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"
import { isOpenAIAvailable } from "@/lib/openai"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || searchParams.get("query")
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await aiSearchService.getSearchSuggestions(query, limit)

    return NextResponse.json({
      query,
      suggestions,
      openaiAvailable: isOpenAIAvailable,
    })
  } catch (error) {
    console.error("Search suggestions API error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
