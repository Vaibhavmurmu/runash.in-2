import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"
import type { SearchRequest } from "@/lib/search-types"

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()

    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const results = await aiSearchService.search(body)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = (searchParams.get("type") as "semantic" | "keyword" | "hybrid") || "hybrid"
    const contentType = searchParams.get("content_type")
    const tags = searchParams.get("tags")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const searchRequest: SearchRequest = {
      query,
      type,
      filters: {
        ...(contentType && { content_type: [contentType] }),
        ...(tags && { tags: tags.split(",") }),
      },
      limit,
      offset,
    }

    const results = await aiSearchService.search(searchRequest)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
