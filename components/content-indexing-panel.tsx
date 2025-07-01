"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  Video,
  MessageSquare,
  Database,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
} from "lucide-react"

interface IndexingStats {
  totalDocuments: number
  documentsWithEmbeddings: number
  contentTypes: Record<string, number>
  recentlyIndexed: number
}

interface IndexingResult {
  users: number
  files: number
  streams: number
  posts: number
  total: number
}

export function ContentIndexingPanel() {
  const [stats, setStats] = useState<IndexingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [indexing, setIndexing] = useState(false)
  const [indexingProgress, setIndexingProgress] = useState(0)
  const [indexingStatus, setIndexingStatus] = useState("")
  const [lastResult, setLastResult] = useState<IndexingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openaiAvailable, setOpenaiAvailable] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/index-content")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setOpenaiAvailable(data.openaiAvailable)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch stats")
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError("Failed to fetch indexing statistics")
    } finally {
      setLoading(false)
    }
  }

  const indexContent = async (action: string, contentType?: string) => {
    try {
      setIndexing(true)
      setIndexingProgress(0)
      setIndexingStatus(`Starting ${action}...`)
      setError(null)

      const response = await fetch("/api/admin/index-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, contentType }),
      })

      const data = await response.json()

      if (data.success) {
        setIndexingStatus("Indexing completed successfully!")
        if (data.results) {
          setLastResult(data.results)
        }
        setIndexingProgress(100)
        // Refresh stats after successful indexing
        setTimeout(() => {
          fetchStats()
        }, 1000)
      } else {
        setError(data.error || "Indexing failed")
        setIndexingStatus("Indexing failed")
      }
    } catch (error) {
      console.error("Error indexing content:", error)
      setError("Failed to index content")
      setIndexingStatus("Indexing failed")
    } finally {
      setTimeout(() => {
        setIndexing(false)
        setIndexingProgress(0)
        setIndexingStatus("")
      }, 2000)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "stream":
        return <Video className="h-4 w-4" />
      case "post":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading indexing statistics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Content Indexing
          </CardTitle>
          <CardDescription>Index existing content to make it searchable with AI features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {indexing && (
                <Alert>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>{indexingStatus}</p>
                      <Progress value={indexingProgress} className="w-full" />
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {lastResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Last indexing completed successfully!</p>
                      <p className="text-sm">
                        Indexed {lastResult.total} items: {lastResult.users} users, {lastResult.files} files,{" "}
                        {lastResult.streams} streams, {lastResult.posts} posts
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{stats?.totalDocuments || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{stats?.documentsWithEmbeddings || 0}</p>
                  <p className="text-sm text-muted-foreground">With AI Embeddings</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{stats?.recentlyIndexed || 0}</p>
                  <p className="text-sm text-muted-foreground">Recently Indexed</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{Object.keys(stats?.contentTypes || {}).length}</p>
                  <p className="text-sm text-muted-foreground">Content Types</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Content Types</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(stats?.contentTypes || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2 p-2 border rounded">
                      {getContentTypeIcon(type)}
                      <span className="text-sm capitalize">{type}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Index All Content</CardTitle>
                    <CardDescription className="text-sm">Index all existing content types at once</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => indexContent("index-all")} disabled={indexing} className="w-full" size="sm">
                      {indexing ? (
                        <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <Database className="h-3 w-3 mr-2" />
                      )}
                      Index All Content
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Index Users
                    </CardTitle>
                    <CardDescription className="text-sm">Index user profiles and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => indexContent("index-users")}
                      disabled={indexing}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Index Users
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Index Files
                    </CardTitle>
                    <CardDescription className="text-sm">Index uploaded files and documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => indexContent("index-files")}
                      disabled={indexing}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Index Files
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Index Streams
                    </CardTitle>
                    <CardDescription className="text-sm">Index streams and video content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => indexContent("index-streams")}
                      disabled={indexing}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Index Streams
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Index Posts
                    </CardTitle>
                    <CardDescription className="text-sm">Index posts and articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => indexContent("index-posts")}
                      disabled={indexing}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Index Posts
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      AI Embeddings
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Generate AI embeddings for semantic search
                      {!openaiAvailable && " (OpenAI required)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => indexContent("reindex-embeddings")}
                      disabled={indexing || !openaiAvailable}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {openaiAvailable ? "Generate Embeddings" : "OpenAI Required"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Indexing Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Documents</span>
                        <Badge>{stats?.totalDocuments || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">With AI Embeddings</span>
                        <Badge variant={openaiAvailable ? "default" : "secondary"}>
                          {stats?.documentsWithEmbeddings || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Coverage</span>
                        <Badge variant="outline">
                          {stats?.totalDocuments
                            ? Math.round(((stats?.documentsWithEmbeddings || 0) / stats.totalDocuments) * 100)
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">AI Features Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">OpenAI Integration</span>
                        <Badge variant={openaiAvailable ? "default" : "destructive"}>
                          {openaiAvailable ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Semantic Search</span>
                        <Badge variant={openaiAvailable ? "default" : "secondary"}>
                          {openaiAvailable ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">AI Suggestions</span>
                        <Badge variant={openaiAvailable ? "default" : "secondary"}>
                          {openaiAvailable ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {stats?.recentlyIndexed || 0} documents indexed in the last 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh Stats
            </Button>
            <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
