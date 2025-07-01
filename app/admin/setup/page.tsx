"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentIndexingPanel } from "@/components/content-indexing-panel"
import { CheckCircle, XCircle, AlertCircle, Database, Zap, Search, Brain } from "lucide-react"

interface ConfigStatus {
  openaiConfigured: boolean
  databaseConfigured: boolean
  vectorSearchEnabled: boolean
  semanticSearchEnabled: boolean
  aiSuggestionsEnabled: boolean
  configValid: boolean
  errors: string[]
}

export default function AdminSetupPage() {
  const [status, setStatus] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    fetchConfigStatus()
  }, [])

  const fetchConfigStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/config-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error fetching config status:", error)
    } finally {
      setLoading(false)
    }
  }

  const testSearchFeatures = async () => {
    setTesting(true)
    try {
      // Test basic search
      const searchResponse = await fetch("/api/search?q=test&type=keyword")
      const searchData = await searchResponse.json()

      // Test AI search if available
      let aiSearchData = null
      if (status?.semanticSearchEnabled) {
        const aiResponse = await fetch("/api/search?q=test&type=semantic")
        aiSearchData = await aiResponse.json()
      }

      // Test suggestions
      const suggestionsResponse = await fetch("/api/search/suggestions?q=test")
      const suggestionsData = await suggestionsResponse.json()

      // Test analytics
      const analyticsResponse = await fetch("/api/search/analytics")
      const analyticsData = await analyticsResponse.json()

      setTestResults({
        basicSearch: {
          success: searchResponse.ok,
          results: searchData.results?.length || 0,
          responseTime: searchData.responseTime || 0,
        },
        aiSearch: aiSearchData
          ? {
              success: true,
              results: aiSearchData.results?.length || 0,
              responseTime: aiSearchData.responseTime || 0,
            }
          : null,
        suggestions: {
          success: suggestionsResponse.ok,
          count: suggestionsData.suggestions?.length || 0,
        },
        analytics: {
          success: analyticsResponse.ok,
          data: analyticsData.success ? analyticsData.data : null,
        },
      })
    } catch (error) {
      console.error("Error testing search features:", error)
      setTestResults({ error: "Failed to test search features" })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading configuration...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Search Setup</h1>
            <p className="text-muted-foreground">Configure and test AI-powered search features</p>
          </div>
          <Button onClick={fetchConfigStatus} variant="outline">
            Refresh Status
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="indexing">Content Indexing</TabsTrigger>
            <TabsTrigger value="openai">OpenAI Setup</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  System Status
                  {status?.configValid ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Setup Required
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Current status of AI search system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Database</p>
                      <div className="flex items-center gap-1">
                        {status?.databaseConfigured ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {status?.databaseConfigured ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Brain className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-medium">OpenAI</p>
                      <div className="flex items-center gap-1">
                        {status?.openaiConfigured ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {status?.openaiConfigured ? "Configured" : "Not Configured"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Search className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">Semantic Search</p>
                      <div className="flex items-center gap-1">
                        {status?.semanticSearchEnabled ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {status?.semanticSearchEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">AI Suggestions</p>
                      <div className="flex items-center gap-1">
                        {status?.aiSuggestionsEnabled ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {status?.aiSuggestionsEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Errors */}
            {status?.errors && status.errors.length > 0 && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Configuration Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {status.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common setup and maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                    variant="outline"
                    className="justify-start"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Get OpenAI API Key
                  </Button>

                  <Button
                    onClick={testSearchFeatures}
                    variant="outline"
                    className="justify-start bg-transparent"
                    disabled={testing}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {testing ? "Testing..." : "Test Search Features"}
                  </Button>

                  <Button onClick={() => window.open("/search", "_blank")} variant="outline" className="justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Open Search Page
                  </Button>

                  <Button onClick={fetchConfigStatus} variant="outline" className="justify-start bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indexing">
            <ContentIndexingPanel />
          </TabsContent>

          <TabsContent value="openai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>OpenAI Configuration</CardTitle>
                <CardDescription>Set up OpenAI API for AI-powered search features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need an OpenAI API key to enable semantic search and AI suggestions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Get OpenAI API Key</h4>
                    <p className="text-sm text-muted-foreground mb-2">Visit OpenAI Platform to create an API key</p>
                    <Button
                      onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                      variant="outline"
                    >
                      Open OpenAI Platform
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Add Environment Variable</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">OPENAI_API_KEY=sk-your-api-key-here</div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Restart Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Restart your application to load the new environment variable
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>Set up vector search and full-text search capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Run these SQL commands in your database to enable all search features.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Enable Extensions</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      CREATE EXTENSION IF NOT EXISTS vector;
                      <br />
                      CREATE EXTENSION IF NOT EXISTS pg_trgm;
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Run Vector Support Script</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      -- Execute scripts/add-vector-support.sql
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Create Search Tables</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      -- Execute scripts/create-search-tables.sql
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Testing</CardTitle>
                <CardDescription>Test search functionality and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testSearchFeatures} disabled={testing} className="w-full">
                  {testing ? "Running Tests..." : "Run Search Tests"}
                </Button>

                {testResults && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Test Results</h4>

                    {testResults.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{testResults.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              Basic Search
                              {testResults.basicSearch?.success ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p>Results: {testResults.basicSearch?.results || 0}</p>
                            <p>Response Time: {testResults.basicSearch?.responseTime || 0}ms</p>
                          </CardContent>
                        </Card>

                        {testResults.aiSearch && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                AI Search
                                {testResults.aiSearch?.success ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p>Results: {testResults.aiSearch?.results || 0}</p>
                              <p>Response Time: {testResults.aiSearch?.responseTime || 0}ms</p>
                            </CardContent>
                          </Card>
                        )}

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              Suggestions
                              {testResults.suggestions?.success ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p>Suggestions: {testResults.suggestions?.count || 0}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              Analytics
                              {testResults.analytics?.success ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p>Queries: {testResults.analytics?.data?.totalQueries || 0}</p>
                            <p>Users: {testResults.analytics?.data?.uniqueUsers || 0}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
