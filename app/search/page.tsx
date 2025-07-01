"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { useSearch, useSearchAnalytics } from "@/hooks/use-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { User, FileText, Video, Hash, Clock, TrendingUp, Filter, Grid, List } from "lucide-react"

const CONTENT_TYPE_ICONS = {
  user: User,
  file: FileText,
  stream: Video,
  content: Hash,
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { results, loading, error, search } = useSearch()
  const { analytics, getAnalytics } = useSearchAnalytics()

  useEffect(() => {
    if (initialQuery) {
      search({ query: initialQuery })
    }
    getAnalytics()
  }, [initialQuery, search, getAnalytics])

  const handleSearch = (query: string, filters: any) => {
    search({
      query,
      type: filters.searchType,
      filters: {
        content_type: filters.contentTypes,
        tags: filters.tags,
      },
    })
  }

  const formatScore = (score: number) => Math.round(score * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Search</h1>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Search Results */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {results.total} results in {results.response_time_ms}ms
                </p>
                {results.suggestions && results.suggestions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Try:</span>
                    {results.suggestions.slice(0, 2).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(suggestion, { searchType: "hybrid", contentTypes: [], tags: [] })}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Facets Sidebar */}
              {results.facets && (
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.facets.content_types.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Content Type</h4>
                          <div className="space-y-2">
                            {results.facets.content_types.map((facet) => (
                              <div key={facet.value} className="flex items-center justify-between text-sm">
                                <span className="capitalize">{facet.value}</span>
                                <Badge variant="secondary">{facet.count}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.facets.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1">
                            {results.facets.tags.slice(0, 8).map((facet) => (
                              <Badge key={facet.value} variant="outline" className="text-xs">
                                {facet.value} ({facet.count})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Results List */}
              <div className={`${results.facets ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
                {results.results.map((result) => {
                  const Icon =
                    CONTENT_TYPE_ICONS[result.document?.content_type as keyof typeof CONTENT_TYPE_ICONS] || Hash

                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <h3 className="font-semibold text-lg">{result.document?.title}</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {result.document?.content_type}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">Relevance</div>
                                <div className="text-sm font-medium">{formatScore(result.score)}%</div>
                              </div>
                              <Progress value={formatScore(result.score)} className="w-16" />
                            </div>
                          </div>

                          <p className="text-muted-foreground">{result.document?.content}</p>

                          {result.document?.tags && result.document.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.document.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(result.created_at).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {result.relevance_type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {results.results.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Hash className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">No results found</h3>
                          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trending Content */}
        {!results && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.popular_queries?.map((query: string, index: number) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleSearch(query, { searchType: "hybrid", contentTypes: [], tags: [] })}
                    >
                      <Hash className="mr-2 h-4 w-4" />
                      {query}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Trending Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.trending_content?.map((content: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{content.title}</p>
                        <p className="text-xs text-muted-foreground">{content.tags?.slice(0, 3).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
