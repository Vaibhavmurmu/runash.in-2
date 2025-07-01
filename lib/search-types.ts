export interface SearchRequest {
  query: string
  type?: "semantic" | "keyword" | "hybrid"
  filters?: SearchFilters
  limit?: number
  offset?: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  searchType: string
  responseTime: number
  suggestions: string[]
}

export interface SearchResult {
  id: string
  title: string
  content: string
  contentType: string
  relevanceScore: number
  metadata: Record<string, any>
  tags: string[]
  url?: string
  createdAt: Date
  updatedAt?: Date
  searchType?: "semantic" | "keyword" | "hybrid"
}

export interface SearchDocument {
  id: string
  index_id: string
  document_id: string
  content_type: string
  title: string
  content: string
  metadata: Record<string, any>
  tags: string[]
  url?: string
  embedding?: number[]
  created_at: string
  updated_at: string
}

export interface SearchSuggestion {
  text: string
  type: "query" | "content" | "tag"
  score: number
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  searchType?: "semantic" | "keyword" | "hybrid"
  limit?: number
  offset?: number
}

export interface SearchFilters {
  contentType?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  userId?: string
}

export interface SearchAnalytics {
  totalQueries: number
  uniqueUsers: number
  avgResponseTime: number
  topQueries: Array<{
    query: string
    count: number
  }>
  period: number
}

export interface IndexableContent {
  id: string
  title: string
  content: string
  contentType: "user" | "stream" | "file" | "post" | "comment"
  tags?: string[]
  url?: string
  metadata?: Record<string, any>
  userId?: string
}
