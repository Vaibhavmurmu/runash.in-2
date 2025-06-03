"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, Clock, Zap } from "lucide-react"
import { useCartSafe } from "@/hooks/use-cart-safe"
import { useCurrency } from "@/contexts/currency-context"
import type { LiveStreamProduct } from "@/types/live-shopping"

interface FeaturedProductCarouselProps {
  streamId: string
}

export default function FeaturedProductCarousel({ streamId }: FeaturedProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [products, setProducts] = useState<LiveStreamProduct[]>([])
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const { addItem } = useCartSafe()
  const { formatPrice, convertPrice } = useCurrency()

  // Mock products for the live stream
  const mockProducts: LiveStreamProduct[] = [
    {
      id: "live-1",
      streamId,
      productId: "1",
      name: "Organic Alphonso Mangoes",
      description: "Premium hand-picked mangoes, perfectly ripe and sweet",
      price: 12.99,
      originalPrice: 15.99,
      discount: 19,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 25,
      isHighlighted: true,
      highlightedAt: new Date(),
      salesCount: 23,
      category: "fruits",
      tags: ["live-exclusive", "limited-time", "premium"],
    },
    {
      id: "live-2",
      streamId,
      productId: "2",
      name: "Organic Quinoa Superfood",
      description: "Protein-rich ancient grain, perfect for healthy meals",
      price: 13.99,
      originalPrice: 17.99,
      discount: 22,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 15,
      isHighlighted: false,
      salesCount: 18,
      category: "grains",
      tags: ["superfood", "protein", "gluten-free"],
    },
    {
      id: "live-3",
      streamId,
      productId: "3",
      name: "Fresh Organic Avocados",
      description: "Creamy and nutritious, perfect for your daily dose of healthy fats",
      price: 8.99,
      originalPrice: 11.99,
      discount: 25,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 40,
      isHighlighted: false,
      salesCount: 31,
      category: "fruits",
      tags: ["healthy-fats", "versatile", "fresh"],
    },
    {
      id: "live-4",
      streamId,
      productId: "4",
      name: "Organic Basmati Rice",
      description: "Aged premium basmati rice with authentic aroma and taste",
      price: 7.99,
      originalPrice: 9.99,
      discount: 20,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 50,
      isHighlighted: false,
      salesCount: 12,
      category: "grains",
      tags: ["aromatic", "premium", "aged"],
    },
  ]

  useEffect(() => {
    setProducts(mockProducts)

    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockProducts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [streamId])

  useEffect(() => {
    // Countdown timer for flash sale
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleAddToCart = (product: LiveStreamProduct) => {
    addItem({
      id: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  const currentProduct = products[currentIndex]

  return (
    <div className="space-y-4">
      {/* Flash Sale Timer */}
      <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-lg">
        <Zap className="h-5 w-5" />
        <span className="font-medium">Flash Sale Ends In:</span>
        <div className="bg-white/20 px-2 py-1 rounded font-mono font-bold">{formatTime(timeLeft)}</div>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <img
                  src={currentProduct.image || "/placeholder.svg"}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {currentProduct.isHighlighted && (
                    <Badge className="bg-purple-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {currentProduct.discount && (
                    <Badge className="bg-red-600 text-white">{currentProduct.discount}% OFF</Badge>
                  )}
                  {currentProduct.tags.includes("live-exclusive") && (
                    <Badge className="bg-blue-600 text-white">Live Exclusive</Badge>
                  )}
                </div>

                {/* Sales Count */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {currentProduct.salesCount} sold
                  </Badge>
                </div>

                {/* Stock Warning */}
                {currentProduct.stockQuantity <= 10 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="destructive" className="animate-pulse">
                      <Clock className="h-3 w-3 mr-1" />
                      Only {currentProduct.stockQuantity} left!
                    </Badge>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
                onClick={prevProduct}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
                onClick={nextProduct}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{currentProduct.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentProduct.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(convertPrice(currentProduct.price))}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(convertPrice(currentProduct.originalPrice))}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {currentProduct.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAddToCart(currentProduct)}
                  disabled={!currentProduct.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {currentProduct.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button variant="outline" size="sm" className="px-3">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-purple-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-600">{products.reduce((sum, p) => sum + p.salesCount, 0)}</div>
          <div className="text-xs text-gray-600">Total Sales</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{products.filter((p) => p.inStock).length}</div>
          <div className="text-xs text-gray-600">In Stock</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(products.reduce((sum, p) => sum + (p.discount || 0), 0) / products.length)}%
          </div>
          <div className="text-xs text-gray-600">Avg Discount</div>
        </div>
      </div>
    </div>
  )
}
