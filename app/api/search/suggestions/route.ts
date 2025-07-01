import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json([])
    }

    const suggestions = await aiSearchService.getSuggestions(query)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Search suggestions API error:", error)
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 })
  }
}
