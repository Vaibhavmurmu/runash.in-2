"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Apple,
  Carrot,
  Wheat,
  Milk,
  Beef,
  Package,
  Coffee,
  Cookie,
  BellIcon as Pepper,
  Droplets,
  Nut,
  Sparkles,
} from "lucide-react"
import type { GroceryCategory } from "@/types/grocery-store"

interface CategorySidebarProps {
  selectedCategory: GroceryCategory | "all"
  onCategorySelect: (category: GroceryCategory | "all") => void
}

export default function CategorySidebar({ selectedCategory, onCategorySelect }: CategorySidebarProps) {
  const categories = [
    { id: "all" as const, name: "All Products", icon: Package, count: 150 },
    { id: "fruits" as const, name: "Fruits", icon: Apple, count: 25 },
    { id: "vegetables" as const, name: "Vegetables", icon: Carrot, count: 35 },
    { id: "grains-cereals" as const, name: "Grains & Cereals", icon: Wheat, count: 20 },
    { id: "dairy-alternatives" as const, name: "Dairy Alternatives", icon: Milk, count: 15 },
    { id: "meat-alternatives" as const, name: "Meat Alternatives", icon: Beef, count: 12 },
    { id: "pantry-staples" as const, name: "Pantry Staples", icon: Package, count: 18 },
    { id: "beverages" as const, name: "Beverages", icon: Coffee, count: 22 },
    { id: "snacks" as const, name: "Snacks", icon: Cookie, count: 16 },
    { id: "spices-herbs" as const, name: "Spices & Herbs", icon: Pepper, count: 30 },
    { id: "oils-vinegars" as const, name: "Oils & Vinegars", icon: Droplets, count: 14 },
    { id: "nuts-seeds" as const, name: "Nuts & Seeds", icon: Nut, count: 18 },
    { id: "superfoods" as const, name: "Superfoods", icon: Sparkles, count: 10 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isSelected ? "secondary" : "ghost"}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full justify-between p-3 h-auto ${
                  isSelected ? "bg-green-50 text-green-700 border-green-200" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{category.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
