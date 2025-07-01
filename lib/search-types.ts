export interface SearchIndex {
  id: string
  name: string
  description: string
  content_type: string
  settings: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface SearchDocument {
  id: string
  index_id: string
  content_id: string
  content_type: string
  title: string
  content: string
  metadata: Record<string, any>
  tags: string[]
  embedding?: number[]
  created_at: Date
  updated_at: Date
}

export interface SearchQuery {
  id: string
  user_id?: string
  query: string
  filters: Record<string, any>
  search_type: "semantic" | "keyword" | "hybrid"
  results_count: number
  response_time: number
  created_at: Date
}

export interface SearchResult {
  id: string
  query_id: string
  document_id: string
  relevance_score: number
  rank: number
  clicked: boolean
  created_at: Date
}

export interface SearchFeedback {
  id: string
  query_id: string
  result_id: string
  user_id?: string
  feedback_type: "helpful" | "not_helpful" | "irrelevant"
  comment?: string
  created_at: Date
}

export interface SearchAnalytics {
  id: string
  date: Date
  total_queries: number
  unique_users: number
  avg_response_time: number
  top_queries: string[]
  popular_content: string[]
  created_at: Date
}

export interface SearchFilters {
  contentType?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  relevanceThreshold?: number
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  searchType?: "semantic" | "keyword" | "hybrid"
  limit?: number
  offset?: number
}

export interface SearchResponse {
  results: Array<{
    id: string
    title: string
    content: string
    contentType: string
    relevanceScore: number
    metadata: Record<string, any>
    tags: string[]
    createdAt: Date
  }>
  total: number
  query: string
  searchType: string
  responseTime: number
  suggestions?: string[]
}
