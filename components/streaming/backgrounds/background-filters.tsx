"use client"

import { useState } from "react"
import type { BackgroundFilter } from "@/types/virtual-backgrounds"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"

interface BackgroundFiltersProps {
  onFilterChange: (filters: Partial<BackgroundFilter>) => void
}

export default function BackgroundFilters({ onFilterChange }: BackgroundFiltersProps) {
  const [filters, setFilters] = useState<BackgroundFilter>({
    categories: [],
    tags: [],
    isPremium: undefined,
    sortBy: "newest",
  })

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    premium: true,
    sort: true,
  })

  // Category options
  const categoryOptions = [
    { id: "office", label: "Office" },
    { id: "nature", label: "Nature" },
    { id: "abstract", label: "Abstract" },
    { id: "gradients", label: "Gradients" },
    { id: "tech", label: "Tech" },
    { id: "minimal", label: "Minimal" },
    { id: "ai-generated", label: "AI Generated" },
    { id: "cityscape", label: "Cityscape" },
    { id: "landmarks", label: "Landmarks" },
    { id: "ocean", label: "Ocean" },
  ]

  // Tag options
  const tagOptions = [
    { id: "professional", label: "Professional" },
    { id: "creative", label: "Creative" },
    { id: "modern", label: "Modern" },
    { id: "clean", label: "Clean" },
    { id: "colorful", label: "Colorful" },
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "minimalist", label: "Minimalist" },
    { id: "vibrant", label: "Vibrant" },
    { id: "calm", label: "Calm" },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters((prev) => {
      const newCategories = checked
        ? [...(prev.categories || []), categoryId]
        : (prev.categories || []).filter((id) => id !== categoryId)

      const newFilters = { ...prev, categories: newCategories }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    setFilters((prev) => {
      const newTags = checked ? [...(prev.tags || []), tagId] : (prev.tags || []).filter((id) => id !== tagId)

      const newFilters = { ...prev, tags: newTags }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handlePremiumChange = (value: boolean | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, isPremium: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleSortChange = (value: "newest" | "popular" | "name") => {
    setFilters((prev) => {
      const newFilters = { ...prev, sortBy: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const resetFilters = () => {
    const resetFiltersValue = {
      categories: [],
      tags: [],
      isPremium: undefined,
      sortBy: "newest",
    }
    setFilters(resetFiltersValue)
    onFilterChange(resetFiltersValue)
  }

  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    filters.isPremium !== undefined

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection("categories")}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium">Categories</h4>
              {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {categoryOptions.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories?.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                  {category.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={expandedSections.tags} onOpenChange={() => toggleSection("tags")}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium">Tags</h4>
              {expandedSections.tags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {tagOptions.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={filters.tags?.includes(tag.id)}
                  onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                />
                <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
                  {tag.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={expandedSections.premium} onOpenChange={() => toggleSection("premium")}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium">Premium</h4>
              {expandedSections.premium ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium-yes"
                checked={filters.isPremium === true}
                onCheckedChange={(checked) => handlePremiumChange(checked ? true : undefined)}
              />
              <Label htmlFor="premium-yes" className="text-sm cursor-pointer">
                Premium Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium-no"
                checked={filters.isPremium === false}
                onCheckedChange={(checked) => handlePremiumChange(checked ? false : undefined)}
              />
              <Label htmlFor="premium-no" className="text-sm cursor-pointer">
                Free Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={expandedSections.sort} onOpenChange={() => toggleSection("sort")}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium">Sort By</h4>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-newest"
                checked={filters.sortBy === "newest"}
                onCheckedChange={(checked) => checked && handleSortChange("newest")}
              />
              <Label htmlFor="sort-newest" className="text-sm cursor-pointer">
                Newest First
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-popular"
                checked={filters.sortBy === "popular"}
                onCheckedChange={(checked) => checked && handleSortChange("popular")}
              />
              <Label htmlFor="sort-popular" className="text-sm cursor-pointer">
                Most Popular
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-name"
                checked={filters.sortBy === "name"}
                onCheckedChange={(checked) => checked && handleSortChange("name")}
              />
              <Label htmlFor="sort-name" className="text-sm cursor-pointer">
                Alphabetical
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
