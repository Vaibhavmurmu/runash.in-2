import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim() || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await aiSearchService.generateSuggestions(query)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Search suggestions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
