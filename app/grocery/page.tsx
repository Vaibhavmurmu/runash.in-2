"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Leaf, Truck, Clock, MapPin } from "lucide-react"
import { CurrencyProvider, useCurrency } from "@/contexts/currency-context"
import CurrencySelector from "@/components/grocery/currency-selector"
import ProductGrid from "@/components/grocery/product-grid"
import CategorySidebar from "@/components/grocery/category-sidebar"
import ProductFilters from "@/components/grocery/product-filters"
import FeaturedProducts from "@/components/grocery/featured-products"
import CartDrawer from "@/components/cart/cart-drawer"
import type { GroceryProduct, GroceryCategory, GroceryFilter } from "@/types/grocery-store"
import FloatingLiveShoppingButton from "@/components/grocery/floating-live-shopping-button"

function GroceryStoreContent() {
  const { currency, formatPrice, convertPrice } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory | "all">("all")
  const [filters, setFilters] = useState<Partial<GroceryFilter>>({})
  const [products, setProducts] = useState<GroceryProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Mock products data
  const mockProducts: GroceryProduct[] = [
    {
      id: "1",
      name: "Organic Basmati Rice",
      description: "Premium aged organic basmati rice from the foothills of Himalayas",
      price: 8.99,
      priceINR: 749,
      category: "grains-cereals",
      subcategory: "rice",
      brand: "Himalayan Harvest",
      images: ["/placeholder.svg?height=300&width=300"],
      inStock: true,
      stockQuantity: 50,
      unit: "kg",
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      isOrganic: true,
      isFreshProduce: false,
      origin: "India",
      certifications: ["USDA Organic", "India Organic", "Fair Trade"],
      sustainabilityScore: 9.2,
      carbonFootprint: 1.8,
      farmInfo: {
        farmName: "Green Valley Farms",
        location: "Punjab, India",
        farmerName: "Rajesh Kumar",
        farmingMethod: "Organic",
        certifications: ["Organic", "Sustainable"],
        distance: 1200,
      },
      reviews: [],
      averageRating: 4.8,
      totalReviews: 156,
      tags: ["gluten-free", "vegan", "premium"],
      isOnSale: true,
      salePrice: 7.99,
      saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Fresh Organic Mangoes",
      description: "Sweet and juicy Alphonso mangoes, hand-picked at perfect ripeness",
      price: 12.99,
      priceINR: 1080,
      category: "fruits",
      subcategory: "tropical",
      brand: "Farm Fresh",
      images: ["/placeholder.svg?height=300&width=300"],
      inStock: true,
      stockQuantity: 25,
      unit: "kg",
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      isOrganic: true,
      isFreshProduce: true,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      origin: "India",
      certifications: ["USDA Organic", "India Organic"],
      sustainabilityScore: 8.9,
      carbonFootprint: 0.8,
      farmInfo: {
        farmName: "Sunshine Orchards",
        location: "Maharashtra, India",
        farmerName: "Priya Sharma",
        farmingMethod: "Organic",
        certifications: ["Organic"],
        distance: 800,
      },
      reviews: [],
      averageRating: 4.9,
      totalReviews: 89,
      tags: ["seasonal", "premium", "vitamin-c"],
      isOnSale: false,
    },
    {
      id: "3",
      name: "Organic Quinoa",
      description: "Protein-rich superfood quinoa, perfect for healthy meals",
      price: 15.99,
      priceINR: 1330,
      category: "grains-cereals",
      subcategory: "quinoa",
      brand: "Superfood Co",
      images: ["/placeholder.svg?height=300&width=300"],
      inStock: true,
      stockQuantity: 30,
      unit: "kg",
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      isOrganic: true,
      isFreshProduce: false,
      origin: "Peru",
      certifications: ["USDA Organic", "Fair Trade"],
      sustainabilityScore: 9.5,
      carbonFootprint: 2.1,
      reviews: [],
      averageRating: 4.7,
      totalReviews: 234,
      tags: ["superfood", "protein", "gluten-free", "vegan"],
      isOnSale: false,
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">
                    RunAsh Organic Store
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fresh • Organic • Sustainable</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CurrencySelector />
              <CartDrawer />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for organic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-medium">Free Delivery</div>
              <div className="text-xs text-muted-foreground">Orders over {formatPrice(50)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm font-medium">Same Day</div>
              <div className="text-xs text-muted-foreground">Delivery available</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-medium">100% Organic</div>
              <div className="text-xs text-muted-foreground">Certified products</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-sm font-medium">Local Farms</div>
              <div className="text-xs text-muted-foreground">Direct sourcing</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            <CategorySidebar selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

            {showFilters && <ProductFilters filters={filters} onFiltersChange={setFilters} />}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="products">All Products</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
              </TabsList>

              <TabsContent value="featured">
                <FeaturedProducts products={filteredProducts.slice(0, 6)} />
              </TabsContent>

              <TabsContent value="products">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {selectedCategory === "all" ? "All Products" : `${selectedCategory} Products`}
                    </h2>
                    <div className="text-sm text-muted-foreground">{filteredProducts.length} products found</div>
                  </div>

                  <ProductGrid products={filteredProducts} loading={loading} />
                </div>
              </TabsContent>

              <TabsContent value="deals">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Special Deals</h2>
                  <ProductGrid products={filteredProducts.filter((p) => p.isOnSale)} loading={loading} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Floating Live Shopping Button */}
      <FloatingLiveShoppingButton />
    </div>
  )
}

export default function GroceryStorePage() {
  return (
    <CurrencyProvider>
      <GroceryStoreContent />
    </CurrencyProvider>
  )
}
