"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import type { BackgroundFilter } from "@/types/virtual-backgrounds"
import BackgroundGrid from "./background-grid"
import BackgroundCategories from "./background-categories"
import BackgroundCollections from "./background-collections"
import BackgroundUploader from "./background-uploader"
import AIBackgroundGenerator from "./ai-background-generator"
import BackgroundFilters from "./background-filters"
import { Search, Upload, Sparkles, Star, Clock, Grid3X3, BookmarkPlus } from "lucide-react"
import { mockBackgrounds } from "./mock-data"

export default function BackgroundLibrary() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<BackgroundFilter>({
    sortBy: "newest",
  })
  const [filteredBackgrounds, setFilteredBackgrounds] = useState(mockBackgrounds)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    // Filter backgrounds based on search query and filters
    let filtered = [...mockBackgrounds]

    if (searchQuery) {
      filtered = filtered.filter(
        (bg) =>
          bg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bg.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((bg) => filters.categories?.some((category) => bg.category.includes(category)))
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((bg) => filters.tags?.some((tag) => bg.tags.includes(tag)))
    }

    if (filters.isPremium !== undefined) {
      filtered = filtered.filter((bg) => bg.isPremium === filters.isPremium)
    }

    // Sort backgrounds
    if (filters.sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (filters.sortBy === "popular") {
      filtered.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    } else if (filters.sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredBackgrounds(filtered)
  }, [searchQuery, filters])

  const handleFilterChange = (newFilters: Partial<BackgroundFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleBackgroundSelect = (backgroundId: string) => {
    toast({
      title: "Background Selected",
      description: "Background has been applied to your stream.",
    })
  }

  const handleBackgroundDownload = (backgroundId: string) => {
    toast({
      title: "Background Downloaded",
      description: "Background has been saved to your library.",
    })
  }

  const handleBackgroundSave = (backgroundId: string) => {
    toast({
      title: "Background Saved",
      description: "Background has been added to your collection.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Background Library</h1>
        <p className="text-muted-foreground">Enhance your streams with professional virtual backgrounds</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search backgrounds..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="hidden md:flex"
            >
              {viewMode === "grid" ? <Grid3X3 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 md:w-[400px]">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="ai">AI Generate</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4 mt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4">
                  <BackgroundFilters onFilterChange={handleFilterChange} />
                </div>
                <div className="w-full md:w-3/4">
                  <BackgroundGrid
                    backgrounds={filteredBackgrounds}
                    viewMode={viewMode}
                    onSelect={handleBackgroundSelect}
                    onDownload={handleBackgroundDownload}
                    onSave={handleBackgroundSave}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collections" className="space-y-4 mt-4">
              <BackgroundCollections />
            </TabsContent>

            <TabsContent value="ai" className="space-y-4 mt-4">
              <AIBackgroundGenerator />
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <BackgroundUploader />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-1/4">
          <div className="bg-card rounded-lg border p-4 space-y-4">
            <h3 className="text-lg font-semibold">Featured Categories</h3>
            <Separator />
            <BackgroundCategories
              onCategorySelect={(category) => {
                handleFilterChange({ categories: [category] })
                setActiveTab("browse")
              }}
            />

            <h3 className="text-lg font-semibold mt-6">Quick Actions</h3>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("upload")}>
                <Upload className="mr-2 h-4 w-4 text-orange-500" />
                Upload
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("ai")}>
                <Sparkles className="mr-2 h-4 w-4 text-orange-500" />
                AI Generate
              </Button>
              <Button variant="outline" className="justify-start">
                <Star className="mr-2 h-4 w-4 text-orange-500" />
                Premium
              </Button>
              <Button variant="outline" className="justify-start">
                <BookmarkPlus className="mr-2 h-4 w-4 text-orange-500" />
                New Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
