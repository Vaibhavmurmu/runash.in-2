"use client"

import { useState, useCallback } from "react"
import type { SearchRequest, SearchResponse, SearchSuggestion } from "@/lib/search-types"

export function useSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (request: SearchRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data: SearchResponse = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  }
}

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    } catch (error) {
      console.error("Failed to get suggestions:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    loading,
    getSuggestions,
    clearSuggestions,
  }
}

export function useSearchAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const getAnalytics = useCallback(async (type?: string) => {
    setLoading(true)

    try {
      const url = type ? `/api/search/analytics?type=${type}` : "/api/search/analytics"
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to get analytics:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    analytics,
    loading,
    getAnalytics,
  }
}
