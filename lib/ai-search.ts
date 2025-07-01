import type {
  SearchRequest,
  SearchResponse,
  SearchDocument,
  SearchSuggestion,
  SearchOptions,
  SearchFilters,
} from "./search-types"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export class AISearchService {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, filters, searchType = "hybrid", limit = 20 } = options

    switch (searchType) {
      case "semantic":
        return this.semanticSearch(query, filters, limit)
      case "keyword":
        return this.keywordSearch(query, filters, limit)
      case "hybrid":
      default:
        return this.hybridSearch(query, filters, limit)
    }
  }

  private async performSearch(request: SearchRequest) {
    const { query, type = "hybrid", filters = {}, limit = 20, offset = 0 } = request

    // Build search query based on type
    let searchResults = []

    switch (type) {
      case "semantic":
        searchResults = await this.semanticSearch(query, filters, limit, offset)
        break
      case "keyword":
        searchResults = await this.keywordSearch(query, filters, limit, offset)
        break
      case "hybrid":
      default:
        const semanticResults = await this.semanticSearch(query, filters, Math.ceil(limit / 2), offset)
        const keywordResults = await this.keywordSearch(query, filters, Math.ceil(limit / 2), offset)
        searchResults = this.mergeResults(semanticResults, keywordResults, limit)
        break
    }

    return searchResults
  }

  // Semantic search using embeddings
  async semanticSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      // Generate embedding for the query (mock implementation)
      const queryEmbedding = await this.generateEmbedding(query)

      // Build the search query with filters
      let searchQuery = `
        SELECT 
          sd.id,
          sd.title,
          sd.content,
          sd.content_type,
          sd.metadata,
          sd.tags,
          sd.created_at,
          -- Calculate cosine similarity (mock calculation)
          RANDOM() * 0.5 + 0.5 as relevance_score
        FROM search_documents sd
        WHERE 1=1
      `

      const params: any[] = []
      let paramIndex = 1

      if (filters?.contentType?.length) {
        searchQuery += ` AND sd.content_type = ANY($${paramIndex})`
        params.push(filters.contentType)
        paramIndex++
      }

      if (filters?.tags?.length) {
        searchQuery += ` AND sd.tags && $${paramIndex}`
        params.push(filters.tags)
        paramIndex++
      }

      searchQuery += ` ORDER BY relevance_score DESC LIMIT $${paramIndex}`
      params.push(limit)

      const results = await sql(searchQuery, params)

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "semantic", results.length, responseTime)

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "semantic",
        responseTime,
        suggestions: await this.generateSuggestions(query),
      }
    } catch (error) {
      console.error("Semantic search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  // Keyword search using full-text search
  async keywordSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      let searchQuery = `
        SELECT 
          sd.id,
          sd.title,
          sd.content,
          sd.content_type,
          sd.metadata,
          sd.tags,
          sd.created_at,
          -- Simple relevance scoring based on matches
          CASE 
            WHEN LOWER(sd.title) LIKE LOWER($1) THEN 1.0
            WHEN LOWER(sd.content) LIKE LOWER($1) THEN 0.8
            ELSE 0.6
          END as relevance_score
        FROM search_documents sd
        WHERE (
          LOWER(sd.title) LIKE LOWER($1) OR 
          LOWER(sd.content) LIKE LOWER($1) OR
          EXISTS (SELECT 1 FROM unnest(sd.tags) tag WHERE LOWER(tag) LIKE LOWER($1))
        )
      `

      const params: any[] = [`%${query}%`]
      let paramIndex = 2

      if (filters?.contentType?.length) {
        searchQuery += ` AND sd.content_type = ANY($${paramIndex})`
        params.push(filters.contentType)
        paramIndex++
      }

      if (filters?.tags?.length) {
        searchQuery += ` AND sd.tags && $${paramIndex}`
        params.push(filters.tags)
        paramIndex++
      }

      searchQuery += ` ORDER BY relevance_score DESC LIMIT $${paramIndex}`
      params.push(limit)

      const results = await sql(searchQuery, params)

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "keyword", results.length, responseTime)

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "keyword",
        responseTime,
        suggestions: await this.generateSuggestions(query),
      }
    } catch (error) {
      console.error("Keyword search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  // Hybrid search combining semantic and keyword
  async hybridSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      // Get results from both search methods
      const [semanticResults, keywordResults] = await Promise.all([
        this.semanticSearch(query, filters, Math.ceil(limit / 2)),
        this.keywordSearch(query, filters, Math.ceil(limit / 2)),
      ])

      // Combine and deduplicate results
      const combinedResults = new Map()

      // Add semantic results with boosted scores
      semanticResults.results.forEach((result) => {
        combinedResults.set(result.id, {
          ...result,
          relevanceScore: result.relevanceScore * 0.7, // Boost semantic results
        })
      })

      // Add keyword results, merging scores if duplicate
      keywordResults.results.forEach((result) => {
        if (combinedResults.has(result.id)) {
          const existing = combinedResults.get(result.id)
          existing.relevanceScore = Math.max(existing.relevanceScore, result.relevanceScore * 0.3)
        } else {
          combinedResults.set(result.id, {
            ...result,
            relevanceScore: result.relevanceScore * 0.3,
          })
        }
      })

      // Sort by combined relevance score
      const finalResults = Array.from(combinedResults.values())
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "hybrid", finalResults.length, responseTime)

      return {
        results: finalResults,
        total: finalResults.length,
        query,
        searchType: "hybrid",
        responseTime,
        suggestions: await this.generateSuggestions(query),
      }
    } catch (error) {
      console.error("Hybrid search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  private async generateSuggestions(query: string): Promise<string[]> {
    try {
      const suggestions = await sql`
        SELECT DISTINCT title
        FROM search_documents
        WHERE LOWER(title) LIKE LOWER(${`%${query}%`})
        ORDER BY title
        LIMIT 5
      `

      return suggestions.map((row: any) => row.title)
    } catch (error) {
      console.error("Error generating suggestions:", error)
      return []
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding generation - replace with actual AI service
    return Array.from({ length: 1536 }, () => Math.random())
  }

  private async logSearchQuery(
    query: string,
    filters: SearchFilters | undefined,
    searchType: string,
    resultsCount: number,
    responseTime: number,
    userId?: string,
  ): Promise<void> {
    try {
      await sql`
        INSERT INTO search_queries (user_id, query, filters, search_type, results_count, response_time)
        VALUES (${userId || null}, ${query}, ${JSON.stringify(filters || {})}, ${searchType}, ${resultsCount}, ${responseTime})
      `
    } catch (error) {
      console.error("Error logging search query:", error)
    }
  }

  private async fallbackSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    try {
      const results = await sql`
        SELECT 
          id, title, content, content_type, metadata, tags, created_at,
          0.5 as relevance_score
        FROM search_documents
        WHERE LOWER(title) LIKE LOWER(${`%${query}%`})
        ORDER BY created_at DESC
        LIMIT ${limit}
      `

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "fallback",
        responseTime: 0,
        suggestions: [],
      }
    } catch (error) {
      console.error("Fallback search error:", error)
      return {
        results: [],
        total: 0,
        query,
        searchType: "error",
        responseTime: 0,
        suggestions: [],
      }
    }
  }

  async getSearchAnalytics(days = 7): Promise<any> {
    try {
      const analytics = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total_queries,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(response_time) as avg_response_time
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `

      const topQueries = await sql`
        SELECT query, COUNT(*) as count
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY query
        ORDER BY count DESC
        LIMIT 10
      `

      return {
        dailyStats: analytics,
        topQueries: topQueries.map((row: any) => ({
          query: row.query,
          count: row.count,
        })),
      }
    } catch (error) {
      console.error("Error getting search analytics:", error)
      return { dailyStats: [], topQueries: [] }
    }
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    // Simulate getting search suggestions
    const suggestions: SearchSuggestion[] = [
      { text: `${query} tutorial`, type: "query", score: 0.9 },
      { text: `${query} examples`, type: "query", score: 0.8 },
      { text: `${query} guide`, type: "query", score: 0.7 },
    ]

    return suggestions
  }

  async getPopularQueries(): Promise<string[]> {
    return ["react tutorial", "design system", "javascript", "ui design", "node.js"]
  }

  async getTrendingContent(): Promise<SearchDocument[]> {
    return [
      {
        id: "doc-1",
        index_id: "idx-1",
        document_id: "stream-1",
        content_type: "stream",
        title: "React Best Practices 2024",
        content: "Learn the latest React patterns and performance optimization techniques",
        metadata: { category: "programming", duration: 3600, views: 1250 },
        tags: ["react", "javascript", "tutorial", "programming"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

export const aiSearchService = new AISearchService()
