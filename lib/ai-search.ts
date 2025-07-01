import type { SearchResponse, SearchOptions, SearchResult, SearchAnalytics } from "./search-types"
import { neon } from "@neondatabase/serverless"
import { generateEmbedding, generateSearchSuggestions, enhanceSearchQuery, isOpenAIAvailable } from "./openai"

const sql = neon(process.env.DATABASE_URL!)

export class AISearchService {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, filters, searchType = "hybrid", limit = 20 } = options

    // Enhance the query using OpenAI if available
    const enhancedQuery = process.env.OPENAI_API_KEY ? await enhanceSearchQuery(query) : query

    switch (searchType) {
      case "semantic":
        return {
          results: await this.semanticSearch(enhancedQuery, limit),
          total: limit,
          query,
          searchType: "semantic",
          responseTime: 0,
          suggestions: [],
        }
      case "keyword":
        return {
          results: await this.keywordSearch(enhancedQuery, limit),
          total: limit,
          query,
          searchType: "keyword",
          responseTime: 0,
          suggestions: [],
        }
      case "hybrid":
      default:
        return {
          results: await this.hybridSearch(enhancedQuery, limit),
          total: limit,
          query,
          searchType: "hybrid",
          responseTime: 0,
          suggestions: [],
        }
    }
  }

  // Perform semantic search using embeddings
  async semanticSearch(query: string, limit = 20): Promise<SearchResult[]> {
    if (!isOpenAIAvailable) {
      console.warn("OpenAI not available, falling back to keyword search")
      return this.keywordSearch(query, limit)
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query)

      // Search for similar documents using vector similarity
      const results = await sql`
        SELECT 
          id,
          title,
          content,
          content_type,
          tags,
          url,
          metadata,
          created_at,
          updated_at,
          (1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector)) as similarity
        FROM search_documents
        WHERE embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT ${limit}
      `

      return results.map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        contentType: row.content_type,
        tags: row.tags || [],
        url: row.url,
        metadata: row.metadata || {},
        relevanceScore: Math.max(0, Math.min(1, row.similarity || 0)),
        searchType: "semantic" as const,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    } catch (error) {
      console.error("Semantic search error:", error)
      // Fallback to keyword search
      return this.keywordSearch(query, limit)
    }
  }

  // Perform keyword-based search
  async keywordSearch(query: string, limit = 20): Promise<SearchResult[]> {
    try {
      const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0)
      const searchPattern = searchTerms.join(" | ")

      const results = await sql`
        SELECT 
          id,
          title,
          content,
          content_type,
          tags,
          url,
          metadata,
          created_at,
          updated_at,
          ts_rank(search_vector, plainto_tsquery(${searchPattern})) as rank
        FROM search_documents
        WHERE search_vector @@ plainto_tsquery(${searchPattern})
        ORDER BY rank DESC
        LIMIT ${limit}
      `

      return results.map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        contentType: row.content_type,
        tags: row.tags || [],
        url: row.url,
        metadata: row.metadata || {},
        relevanceScore: Math.max(0, Math.min(1, (row.rank || 0) * 0.1)),
        searchType: "keyword" as const,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    } catch (error) {
      console.error("Keyword search error:", error)
      return []
    }
  }

  // Perform hybrid search (combines semantic and keyword)
  async hybridSearch(query: string, limit = 20): Promise<SearchResult[]> {
    try {
      const [semanticResults, keywordResults] = await Promise.all([
        this.semanticSearch(query, Math.ceil(limit * 0.7)),
        this.keywordSearch(query, Math.ceil(limit * 0.5)),
      ])

      // Combine and deduplicate results
      const combinedResults = new Map<string, SearchResult>()

      // Add semantic results with higher weight
      semanticResults.forEach((result) => {
        combinedResults.set(result.id, {
          ...result,
          relevanceScore: result.relevanceScore * 0.7,
          searchType: "hybrid" as const,
        })
      })

      // Add keyword results, boosting score if already exists
      keywordResults.forEach((result) => {
        const existing = combinedResults.get(result.id)
        if (existing) {
          // Boost score for documents found in both searches
          existing.relevanceScore = Math.min(1, existing.relevanceScore + result.relevanceScore * 0.3)
        } else {
          combinedResults.set(result.id, {
            ...result,
            relevanceScore: result.relevanceScore * 0.3,
            searchType: "hybrid" as const,
          })
        }
      })

      // Sort by relevance and return top results
      return Array.from(combinedResults.values())
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)
    } catch (error) {
      console.error("Hybrid search error:", error)
      // Fallback to keyword search only
      return this.keywordSearch(query, limit)
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string, limit = 5): Promise<string[]> {
    try {
      // Get AI-powered suggestions if available
      if (isOpenAIAvailable) {
        const aiSuggestions = await generateSearchSuggestions(query)
        if (aiSuggestions.length > 0) {
          return aiSuggestions.slice(0, limit)
        }
      }

      // Fallback to database-based suggestions
      const suggestions = await sql`
        SELECT DISTINCT query
        FROM search_queries
        WHERE query ILIKE ${`%${query}%`}
        AND query != ${query}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `

      return suggestions.map((row: any) => row.query)
    } catch (error) {
      console.error("Error getting search suggestions:", error)
      return []
    }
  }

  // Log search query
  async logSearchQuery(query: string, userId?: string, filters?: any): Promise<void> {
    try {
      await sql`
        INSERT INTO search_queries (query, user_id, filters, created_at)
        VALUES (${query}, ${userId || null}, ${JSON.stringify(filters || {})}, NOW())
      `
    } catch (error) {
      console.error("Error logging search query:", error)
    }
  }

  // Get search analytics
  async getSearchAnalytics(days = 7): Promise<SearchAnalytics> {
    try {
      const analytics = await sql`
        SELECT 
          COUNT(*) as total_queries,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(EXTRACT(EPOCH FROM (NOW() - created_at))) as avg_response_time
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
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
        totalQueries: analytics[0]?.total_queries || 0,
        uniqueUsers: analytics[0]?.unique_users || 0,
        avgResponseTime: analytics[0]?.avg_response_time || 0,
        topQueries: topQueries.map((row: any) => ({
          query: row.query,
          count: row.count,
        })),
        period: days,
      }
    } catch (error) {
      console.error("Error getting search analytics:", error)
      return {
        totalQueries: 0,
        uniqueUsers: 0,
        avgResponseTime: 0,
        topQueries: [],
        period: days,
      }
    }
  }

  // Index a document for search
  async indexDocument(document: {
    id: string
    title: string
    content: string
    contentType: string
    tags?: string[]
    url?: string
    metadata?: any
  }): Promise<void> {
    try {
      // Generate embedding if OpenAI is available
      let embedding = null
      if (isOpenAIAvailable) {
        const embeddingVector = await generateEmbedding(`${document.title} ${document.content}`)
        embedding = JSON.stringify(embeddingVector)
      }

      await sql`
        INSERT INTO search_documents (
          id, title, content, content_type, tags, url, metadata, embedding, created_at, updated_at
        ) VALUES (
          ${document.id},
          ${document.title},
          ${document.content},
          ${document.contentType},
          ${JSON.stringify(document.tags || [])},
          ${document.url || null},
          ${JSON.stringify(document.metadata || {})},
          ${embedding ? `${embedding}::vector` : null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          content_type = EXCLUDED.content_type,
          tags = EXCLUDED.tags,
          url = EXCLUDED.url,
          metadata = EXCLUDED.metadata,
          embedding = EXCLUDED.embedding,
          updated_at = NOW()
      `
    } catch (error) {
      console.error("Error indexing document:", error)
      throw error
    }
  }

  // Get popular queries
  async getPopularQueries(limit = 10): Promise<string[]> {
    try {
      const queries = await sql`
        SELECT query, COUNT(*) as count
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY query
        ORDER BY count DESC
        LIMIT ${limit}
      `

      return queries.map((row: any) => row.query)
    } catch (error) {
      console.error("Error getting popular queries:", error)
      return []
    }
  }

  // Get trending content
  async getTrendingContent(limit = 10): Promise<any[]> {
    try {
      const trending = await sql`
        SELECT 
          sd.title,
          sd.content_type,
          sd.tags,
          COUNT(sq.id) as search_count
        FROM search_documents sd
        JOIN search_queries sq ON LOWER(sq.query) LIKE '%' || LOWER(sd.title) || '%'
        WHERE sq.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY sd.id, sd.title, sd.content_type, sd.tags
        ORDER BY search_count DESC
        LIMIT ${limit}
      `

      return trending.map((row: any) => ({
        title: row.title,
        contentType: row.content_type,
        tags: row.tags,
        searchCount: row.search_count,
      }))
    } catch (error) {
      console.error("Error getting trending content:", error)
      return []
    }
  }
}

// Export singleton instance
export const aiSearchService = new AISearchService()
