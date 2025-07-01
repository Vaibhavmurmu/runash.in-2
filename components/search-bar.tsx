"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDebounce } from "@/hooks/use-debounce"
import type { SearchFilters } from "@/lib/search-types"

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  placeholder?: string
  className?: string
}

const contentTypes = [
  { value: "user", label: "Users" },
  { value: "stream", label: "Streams" },
  { value: "file", label: "Files" },
  { value: "content", label: "Content" },
]

const searchMethods = [
  { value: "hybrid", label: "Smart Search" },
  { value: "semantic", label: "AI Search" },
  { value: "keyword", label: "Exact Match" },
]

export function SearchBar({ onSearch, placeholder = "Search...", className }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedQuery])

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filters)
      setShowSuggestions(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion, filters)
    setShowSuggestions(false)
  }

  const updateContentTypeFilter = (contentType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      contentType: checked
        ? [...(prev.contentType || []), contentType]
        : (prev.contentType || []).filter((type) => type !== contentType),
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const activeFiltersCount = filters.contentType?.length || 0

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-10 pr-4"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Content Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {contentTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={filters.contentType?.includes(type.value) || false}
                onCheckedChange={(checked) => updateContentTypeFilter(type.value, checked)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
            {activeFiltersCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full justify-start gap-2">
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSearch} size="sm">
          Search
        </Button>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {filters.contentType?.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {contentTypes.find((ct) => ct.value === type)?.label}
              <button
                onClick={() => updateContentTypeFilter(type, false)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
