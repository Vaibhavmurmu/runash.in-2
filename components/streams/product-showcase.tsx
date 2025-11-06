"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, ShoppingCart, Eye, EyeOff, Search } from "lucide-react"
import { useProducts } from "@/lib/hooks/use-products"
import { useAuthContext } from "@/components/auth/auth-provider"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
  sales: number
}

// const products: Product[] = [
//   {
//     id: "1",
//     name: "Organic Vitamin C Serum",
//     price: 49.99,
//     image: "/placeholder.svg?height=80&width=80",
//     category: "Skincare",
//     inStock: true,
//     featured: true,
//     sales: 23,
//   },
//   {
//     id: "2",
//     name: "Natural Face Moisturizer",
//     price: 34.99,
//     image: "/placeholder.svg?height=80&width=80",
//     category: "Skincare",
//     inStock: true,
//     featured: false,
//     sales: 15,
//   },
//   {
//     id: "3",
//     name: "Organic Cleanser",
//     price: 24.99,
//     image: "/placeholder.svg?height=80&width=80",
//     category: "Skincare",
//     inStock: false,
//     featured: false,
//     sales: 8,
//   },
//   {
//     id: "4",
//     name: "Anti-Aging Night Cream",
//     price: 59.99,
//     image: "/placeholder.svg?height=80&width=80",
//     category: "Skincare",
//     inStock: true,
//     featured: true,
//     sales: 31,
//   },
// ]

export function ProductShowcase() {
  const { user } = useAuthContext()
  const { products } = useProducts(user?.id)
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([])

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleFeatured = (productId: string) => {
    setFeaturedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Product Showcase</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(product.id)}
                      className="h-6 w-6 p-0"
                    >
                      {featuredProducts.includes(product.id) ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm">${product.price}</span>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    {!product.inStock && (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{product.sales} sales today</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Stream
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-3 pt-3 border-t">
          <Button size="sm" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
