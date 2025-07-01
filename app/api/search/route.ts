import { type NextRequest, NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"
import { isOpenAIAvailable } from "@/lib/openai"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || searchParams.get("query")
    const type = searchParams.get("type") || "hybrid"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const contentType = searchParams.get("contentType")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Log the search query
    await aiSearchService.logSearchQuery(query, undefined, { type, contentType })

    let results = []

    // Choose search method based on type and availability
    switch (type) {
      case "semantic":
        if (isOpenAIAvailable) {
          results = await aiSearchService.semanticSearch(query, limit)
        } else {
          // Fallback to keyword search if OpenAI not available
          results = await aiSearchService.keywordSearch(query, limit)
        }
        break
      case "keyword":
        results = await aiSearchService.keywordSearch(query, limit)
        break
      case "hybrid":
      default:
        results = await aiSearchService.hybridSearch(query, limit)
        break
    }

    // Filter by content type if specified
    if (contentType && contentType !== "all") {
      results = results.filter((result) => result.contentType === contentType)
    }

    return NextResponse.json({
      query,
      results,
      total: results.length,
      searchType: type,
      openaiAvailable: isOpenAIAvailable,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, type = "hybrid", limit = 20, contentType, userId } = body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Log the search query
    await aiSearchService.logSearchQuery(query, userId, { type, contentType })

    let results = []

    // Choose search method based on type and availability
    switch (type) {
      case "semantic":
        if (isOpenAIAvailable) {
          results = await aiSearchService.semanticSearch(query, limit)
        } else {
          results = await aiSearchService.keywordSearch(query, limit)
        }
        break
      case "keyword":
        results = await aiSearchService.keywordSearch(query, limit)
        break
      case "hybrid":
      default:
        results = await aiSearchService.hybridSearch(query, limit)
        break
    }

    // Filter by content type if specified
    if (contentType && contentType !== "all") {
      results = results.filter((result) => result.contentType === contentType)
    }

    return NextResponse.json({
      query,
      results,
      total: results.length,
      searchType: type,
      openaiAvailable: isOpenAIAvailable,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
