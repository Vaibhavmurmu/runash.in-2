"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchSuggestions } from "@/hooks/use-search"

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  placeholder?: string
  className?: string
}

interface SearchFilters {
  contentTypes: string[]
  tags: string[]
  searchType: "semantic" | "keyword" | "hybrid"
}

const CONTENT_TYPES = [
  { value: "user", label: "Users" },
  { value: "stream", label: "Streams" },
  { value: "file", label: "Files" },
  { value: "content", label: "Content" },
]

const SEARCH_TYPES = [
  { value: "hybrid", label: "Smart Search" },
  { value: "semantic", label: "AI Search" },
  { value: "keyword", label: "Exact Match" },
]

export function SearchBar({ onSearch, placeholder = "Search...", className }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: [],
    tags: [],
    searchType: "hybrid",
  })

  const debouncedQuery = useDebounce(query, 300)
  const { suggestions, getSuggestions, clearSuggestions } = useSearchSuggestions()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (debouncedQuery) {
      getSuggestions(debouncedQuery)
    } else {
      clearSuggestions()
    }
  }, [debouncedQuery, getSuggestions, clearSuggestions])

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters)
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const clearFilters = () => {
    setFilters({
      contentTypes: [],
      tags: [],
      searchType: "hybrid",
    })
  }

  const hasActiveFilters = filters.contentTypes.length > 0 || filters.tags.length > 0 || filters.searchType !== "hybrid"

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Search Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Search Type</DropdownMenuLabel>
              {SEARCH_TYPES.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={filters.searchType === type.value}
                  onCheckedChange={() => setFilters((prev) => ({ ...prev, searchType: type.value as any }))}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Content Types</DropdownMenuLabel>
              {CONTENT_TYPES.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={filters.contentTypes.includes(type.value)}
                  onCheckedChange={(checked) => {
                    setFilters((prev) => ({
                      ...prev,
                      contentTypes: checked
                        ? [...prev.contentTypes, type.value]
                        : prev.contentTypes.filter((t) => t !== type.value),
                    }))
                  }}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleSearch} size="sm" className="h-7">
            Search
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {filters.searchType !== "hybrid" && (
            <Badge variant="secondary" className="text-xs">
              {SEARCH_TYPES.find((t) => t.value === filters.searchType)?.label}
            </Badge>
          )}
          {filters.contentTypes.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {CONTENT_TYPES.find((t) => t.value === type)?.label}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    contentTypes: prev.contentTypes.filter((t) => t !== type),
                  }))
                }
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (query || suggestions.length > 0) && (
        <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
          <PopoverTrigger asChild>
            <div className="absolute inset-x-0 top-full z-50" />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                {suggestions.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSuggestionClick(suggestion.text)}
                        className="cursor-pointer"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {suggestion.text}
                        {suggestion.type === "query" && (
                          <TrendingUp className="ml-auto h-3 w-3 text-muted-foreground" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {query && (
                  <CommandGroup heading="Search for">
                    <CommandItem onSelect={handleSearch} className="cursor-pointer font-medium">
                      <Search className="mr-2 h-4 w-4" />"{query}"
                    </CommandItem>
                  </CommandGroup>
                )}

                {!suggestions.length && !query && <CommandEmpty>Start typing to see suggestions...</CommandEmpty>}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
