"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import type { GroceryFilter } from "@/types/grocery-store"

interface ProductFiltersProps {
  filters: Partial<GroceryFilter>
  onFiltersChange: (filters: Partial<GroceryFilter>) => void
}

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { formatPrice } = useCurrency()
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 100])

  const certifications = ["USDA Organic", "India Organic", "Fair Trade", "Non-GMO", "Rainforest Alliance", "Biodynamic"]

  const origins = ["India", "USA", "Peru", "Mexico", "Italy", "Spain"]

  const brands = ["Himalayan Harvest", "Farm Fresh", "Superfood Co", "Organic Valley", "Nature's Best", "Green Earth"]

  const updateFilter = (key: keyof GroceryFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
    setPriceRange([0, 100])
  }

  const activeFiltersCount = Object.keys(filters).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Range</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value as [number, number])
                updateFilter("priceRange", value)
              }}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Filters */}
        <div className="space-y-3">
          <h4 className="font-medium">Quick Filters</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) => updateFilter("inStock", checked)}
              />
              <label htmlFor="inStock" className="text-sm">
                In Stock Only
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOrganic"
                checked={filters.isOrganic || false}
                onCheckedChange={(checked) => updateFilter("isOrganic", checked)}
              />
              <label htmlFor="isOrganic" className="text-sm">
                Organic Only
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFreshProduce"
                checked={filters.isFreshProduce || false}
                onCheckedChange={(checked) => updateFilter("isFreshProduce", checked)}
              />
              <label htmlFor="isFreshProduce" className="text-sm">
                Fresh Produce
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        <div className="space-y-3">
          <h4 className="font-medium">Certifications</h4>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={cert}
                  checked={filters.certifications?.includes(cert) || false}
                  onCheckedChange={(checked) => {
                    const current = filters.certifications || []
                    const updated = checked ? [...current, cert] : current.filter((c) => c !== cert)
                    updateFilter("certifications", updated)
                  }}
                />
                <label htmlFor={cert} className="text-sm">
                  {cert}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Origin */}
        <div className="space-y-3">
          <h4 className="font-medium">Origin</h4>
          <div className="flex flex-wrap gap-2">
            {origins.map((origin) => (
              <Badge
                key={origin}
                variant={filters.origin?.includes(origin) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const current = filters.origin || []
                  const updated = current.includes(origin) ? current.filter((o) => o !== origin) : [...current, origin]
                  updateFilter("origin", updated)
                }}
              >
                {origin}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <h4 className="font-medium">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={filters.brands?.includes(brand) || false}
                  onCheckedChange={(checked) => {
                    const current = filters.brands || []
                    const updated = checked ? [...current, brand] : current.filter((b) => b !== brand)
                    updateFilter("brands", updated)
                  }}
                />
                <label htmlFor={brand} className="text-sm">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
