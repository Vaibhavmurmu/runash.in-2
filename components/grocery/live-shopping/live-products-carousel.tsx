"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Heart, Leaf, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  isOrganic: boolean
  isLive: boolean
  viewers?: number
  category: string
  discount?: number
}

const liveProducts: Product[] = [
  {
    id: 1,
    name: "Organic Raw Manuka Honey",
    price: 34.99,
    originalPrice: 42.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 234,
    isOrganic: true,
    isLive: true,
    viewers: 1247,
    category: "Pantry",
    discount: 19,
  },
  {
    id: 2,
    name: "Cold-Pressed Coconut Oil",
    price: 18.99,
    originalPrice: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 189,
    isOrganic: true,
    isLive: true,
    viewers: 892,
    category: "Oils",
    discount: 24,
  },
  {
    id: 3,
    name: "Himalayan Pink Salt",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 156,
    isOrganic: true,
    isLive: true,
    viewers: 634,
    category: "Seasonings",
  },
  {
    id: 4,
    name: "Organic Quinoa Blend",
    price: 16.99,
    originalPrice: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 98,
    isOrganic: true,
    isLive: true,
    viewers: 445,
    category: "Grains",
    discount: 15,
  },
  {
    id: 5,
    name: "Raw Almonds Premium",
    price: 22.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 167,
    isOrganic: true,
    isLive: true,
    viewers: 723,
    category: "Nuts",
  },
]

export function LiveProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % liveProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + liveProducts.length) % liveProducts.length)
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  const visibleProducts = [
    liveProducts[currentIndex],
    liveProducts[(currentIndex + 1) % liveProducts.length],
    liveProducts[(currentIndex + 2) % liveProducts.length],
  ]

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Products
            </h2>
            <p className="text-sm text-gray-600">Featured in active streams</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevSlide}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group relative transition-all duration-300 ${
                index === 0 ? "md:scale-105 md:z-10" : "md:scale-95 md:opacity-75"
              }`}
            >
              <Card className="overflow-hidden border-2 border-transparent group-hover:border-orange-200 transition-all duration-300">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Live indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>

                  {/* Discount badge */}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Viewers count */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    <Eye className="w-3 h-3" />
                    {product.viewers?.toLocaleString()}
                  </div>

                  {/* Favorite button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white h-8 w-8"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {product.isOrganic && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">{product.category}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {liveProducts.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-orange-500 w-6" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
