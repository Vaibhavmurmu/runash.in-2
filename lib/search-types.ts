export interface SearchIndex {
  id: string
  name: string
  description: string
  content_type: string
  fields: Record<string, any>
  settings: Record<string, any>
  status: "active" | "inactive" | "building"
  created_at: string
  updated_at: string
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
  embedding?: number[]
  created_at: string
  updated_at: string
}

export interface SearchQuery {
  id: string
  user_id?: string
  query_text: string
  query_type: "semantic" | "keyword" | "hybrid"
  filters: Record<string, any>
  results_count: number
  response_time_ms: number
  clicked_results: string[]
  created_at: string
}

export interface SearchResult {
  id: string
  query_id: string
  document_id: string
  rank: number
  score: number
  relevance_type: string
  clicked: boolean
  clicked_at?: string
  created_at: string
  document?: SearchDocument
}

export interface SearchFeedback {
  id: string
  query_id: string
  result_id: string
  user_id?: string
  feedback_type: "helpful" | "not_helpful" | "irrelevant"
  comment?: string
  created_at: string
}

export interface SearchAnalytics {
  id: string
  date: string
  total_queries: number
  unique_users: number
  avg_response_time_ms: number
  top_queries: Array<{ query: string; count: number }>
  popular_content: Array<{ title: string; clicks: number }>
  created_at: string
}

export interface SearchRequest {
  query: string
  type?: "semantic" | "keyword" | "hybrid"
  filters?: {
    content_type?: string[]
    tags?: string[]
    date_range?: {
      start: string
      end: string
    }
  }
  limit?: number
  offset?: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query_id: string
  response_time_ms: number
  suggestions?: string[]
  facets?: {
    content_types: Array<{ value: string; count: number }>
    tags: Array<{ value: string; count: number }>
  }
}

export interface SearchSuggestion {
  text: string
  type: "query" | "content" | "tag"
  score: number
  metadata?: Record<string, any>
}
