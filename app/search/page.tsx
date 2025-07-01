"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Grid, List, Clock, TrendingUp, Users, File, Video, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SearchBar } from "@/components/search-bar"
import { useSearch, useSearchAnalytics } from "@/hooks/use-search"
import type { SearchFilters } from "@/lib/search-types"

const contentTypeIcons = {
  user: Users,
  stream: Video,
  file: File,
  content: FileText,
}

const contentTypeLabels = {
  user: "Users",
  stream: "Streams",
  file: "Files",
  content: "Content",
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})

  const { search, isLoading, results, error } = useSearch()
  const { analytics, fetchAnalytics } = useSearchAnalytics()

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, selectedFilters)
    }
    fetchAnalytics()
  }, [])

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setSelectedFilters(filters)
    await search({
      query,
      filters,
      searchType: "hybrid",
      limit: 20,
    })
  }

  const getContentTypeIcon = (type: string) => {
    const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons] || FileText
    return <Icon className="h-4 w-4" />
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Search</h1>
            <p className="text-muted-foreground">Discover content with intelligent search powered by AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users, streams, files, and content..."
          className="max-w-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Stats */}
          {results && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Search Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Results</span>
                  <span className="font-medium">{results.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span className="font-medium">{results.responseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Search Type</span>
                  <Badge variant="secondary" className="text-xs">
                    {results.searchType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Type Filter */}
          {results && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter by Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(
                  results.results.reduce(
                    (acc, result) => {
                      acc[result.contentType] = (acc[result.contentType] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(type)}
                      <span className="text-sm">
                        {contentTypeLabels[type as keyof typeof contentTypeLabels] || type}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Trending Searches */}
          {analytics?.topQueries && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analytics.topQueries.slice(0, 5).map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item.query, {})}
                    className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate">{item.query}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Suggestions */}
          {results?.suggestions && results.suggestions.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Related searches:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(suggestion, selectedFilters)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Error: {error}</p>
                  <Button
                    variant="outline"
                    onClick={() => handleSearch(results?.query || "", selectedFilters)}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {results && !isLoading && (
            <div className="space-y-4">
              {results.results.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                  {results.results.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(result.contentType)}
                            <Badge variant="outline" className="text-xs">
                              {contentTypeLabels[result.contentType as keyof typeof contentTypeLabels] ||
                                result.contentType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={result.relevanceScore * 100} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(result.relevanceScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{highlightText(result.title, results.query)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-3">
                          {highlightText(
                            result.content.length > 150 ? result.content.substring(0, 150) + "..." : result.content,
                            results.query,
                          )}
                        </CardDescription>

                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {result.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{result.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(result.createdAt)}
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Load More */}
          {results && results.results.length > 0 && results.total > results.results.length && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  // Implement load more functionality
                }}
              >
                Load More Results
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
