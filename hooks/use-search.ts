"use client"

import { useState, useCallback } from "react"
import type { SearchOptions, SearchResponse } from "@/lib/search-types"

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (options: SearchOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return {
    search,
    clearResults,
    isLoading,
    results,
    error,
  }
}

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    isLoading,
    fetchSuggestions,
    clearSuggestions,
  }
}

export function useSearchAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (days = 7) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search/analytics?days=${days}`)
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      setAnalytics(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
  }
}
