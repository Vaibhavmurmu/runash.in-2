"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Heart, Star, Leaf, Clock, MapPin, Zap, Eye, Plus, Minus } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useCart } from "@/contexts/cart-context"
import type { GroceryProduct } from "@/types/grocery-store"

interface ProductGridProps {
  products: GroceryProduct[]
  loading?: boolean
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const { currency, formatPrice, convertPrice } = useCurrency()
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getQuantity = (productId: string) => quantities[productId] || 1

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const currentQty = getQuantity(productId)
    const newQty = Math.max(product.minOrderQuantity, Math.min(product.maxOrderQuantity, currentQty + delta))

    setQuantities((prev) => ({ ...prev, [productId]: newQty }))
  }

  const handleAddToCart = (product: GroceryProduct) => {
    const quantity = getQuantity(product.id)

    // Convert product to cart format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: currency === "INR" && product.priceINR ? product.priceINR : convertPrice(product.price),
      category: product.category,
      isOrganic: product.isOrganic,
      sustainabilityScore: product.sustainabilityScore,
      image: product.images[0],
      inStock: product.inStock,
      certifications: product.certifications,
      carbonFootprint: product.carbonFootprint,
      isLocal: product.farmInfo ? product.farmInfo.distance < 100 : false,
    }

    addToCart(cartProduct, quantity)
  }

  const getDisplayPrice = (product: GroceryProduct) => {
    if (currency === "INR" && product.priceINR) {
      return formatPrice(product.priceINR)
    }
    return formatPrice(convertPrice(product.price))
  }

  const getSalePrice = (product: GroceryProduct) => {
    if (!product.isOnSale || !product.salePrice) return null

    if (currency === "INR" && product.priceINR) {
      const saleRatio = product.salePrice / product.price
      const inrSalePrice = product.priceINR * saleRatio
      return formatPrice(inrSalePrice)
    }
    return formatPrice(convertPrice(product.salePrice))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
        >
          <div className="relative">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isOrganic && (
                <Badge className="bg-green-600 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
              {product.isOnSale && (
                <Badge className="bg-red-600 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Sale
                </Badge>
              )}
              {product.isFreshProduce && (
                <Badge className="bg-blue-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  Fresh
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Product Info */}
              <div>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium ml-1">{product.averageRating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.totalReviews} reviews)</span>
              </div>

              {/* Farm Info */}
              {product.farmInfo && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{product.farmInfo.location}</span>
                  <span className="ml-2">({product.farmInfo.distance}km)</span>
                </div>
              )}

              {/* Certifications */}
              <div className="flex flex-wrap gap-1">
                {product.certifications.slice(0, 2).map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {product.certifications.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.certifications.length - 2}
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {product.isOnSale && product.salePrice ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">{getSalePrice(product)}</span>
                      <span className="text-sm text-muted-foreground line-through">{getDisplayPrice(product)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-green-600">{getDisplayPrice(product)}</span>
                  )}
                  <div className="text-xs text-muted-foreground">per {product.unit}</div>
                </div>

                {/* Sustainability Score */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Eco Score</div>
                  <div className="text-sm font-bold text-green-600">{product.sustainabilityScore}/10</div>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              {product.inStock && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={getQuantity(product.id) <= product.minOrderQuantity}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{getQuantity(product.id)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={getQuantity(product.id) >= product.maxOrderQuantity}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
