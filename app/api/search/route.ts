import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"
import type { SearchFilters } from "@/lib/search-types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const searchType = (searchParams.get("type") || "hybrid") as "semantic" | "keyword" | "hybrid"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Parse filters from query params
    const filters: SearchFilters = {}
    const contentType = searchParams.get("contentType")
    if (contentType) {
      filters.contentType = contentType.split(",")
    }

    const tags = searchParams.get("tags")
    if (tags) {
      filters.tags = tags.split(",")
    }

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: "",
        searchType,
        responseTime: 0,
        suggestions: [],
      })
    }

    const results = await aiSearchService.search({
      query,
      filters,
      searchType,
      limit,
      offset,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, searchType = "hybrid", limit = 20, offset = 0 } = body

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: "",
        searchType,
        responseTime: 0,
        suggestions: [],
      })
    }

    const results = await aiSearchService.search({
      query,
      filters,
      searchType,
      limit,
      offset,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
