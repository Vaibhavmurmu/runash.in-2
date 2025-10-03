"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Filter, Edit, Trash2, Package, TrendingUp, Star, ShoppingCart, Upload } from "lucide-react"
import useSWR from "swr"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) =>
  fetch(url, { headers: { "x-user-id": "1" } }).then((r) => {
    if (!r.ok) throw new Error("Failed to load products")
    return r.json()
  })

export function ProductManager() {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProductCategory, setNewProductCategory] = useState<string | undefined>()

  const {
    data: productsData,
    mutate,
    isLoading,
  } = useSWR(`/api/products?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`, fetcher)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "out_of_stock":
        return "bg-red-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "out_of_stock":
        return "Out of Stock"
      case "draft":
        return "Draft"
      default:
        return "Unknown"
    }
  }

  const filteredProducts = productsData
    ? productsData.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
        return matchesSearch && matchesCategory
      })
    : []

  async function handleCreate() {
    try {
      const name = (document.getElementById("product-name") as HTMLInputElement)?.value
      const description = (document.getElementById("product-description") as HTMLTextAreaElement)?.value
      const price = Number((document.getElementById("product-price") as HTMLInputElement)?.value || 0)
      const stock = Number((document.getElementById("product-stock") as HTMLInputElement)?.value || 0)

      if (!name?.trim()) {
        toast({ title: "Name required", description: "Please enter a product name.", variant: "destructive" })
        return
      }
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "1" },
        body: JSON.stringify({
          name,
          description,
          price,
          stock,
          category: newProductCategory || (selectedCategory === "all" ? null : selectedCategory),
        }),
      })
      if (!res.ok) throw new Error("Failed to create product")
      await mutate()
      setIsCreateDialogOpen(false)
      setNewProductCategory(undefined)
      toast({ title: "Product created", description: "Your product has been added." })
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Could not create product.", variant: "destructive" })
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE", headers: { "x-user-id": "1" } })
      if (!res.ok) throw new Error("Failed to delete product")
      mutate()
      toast({ title: "Product deleted", description: "The product was removed." })
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Could not delete product.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Manager</h2>
          <p className="text-muted-foreground">Manage your organic product inventory</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new organic product to your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="herbs">Herbs & Spices</SelectItem>
                      <SelectItem value="dairy">Dairy Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" placeholder="Describe your product" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price ($)</Label>
                  <Input id="product-price" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock Quantity</Label>
                  <Input id="product-stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lb">per lb</SelectItem>
                      <SelectItem value="kg">per kg</SelectItem>
                      <SelectItem value="piece">per piece</SelectItem>
                      <SelectItem value="bunch">per bunch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="organic-certified" />
                <Label htmlFor="organic-certified">Organic Certified</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500" onClick={handleCreate}>
                  Add Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="herbs">Herbs & Spices</SelectItem>
            <SelectItem value="dairy">Dairy Products</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{productsData ? productsData.length : 0}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">
                  {productsData ? productsData.filter((p) => p.status === "active").length : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">
                  {productsData ? productsData.filter((p) => p.status === "out_of_stock").length : 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">
                  {productsData ? productsData.reduce((sum, p) => sum + p.sales, 0) : 0}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg bg-white/80 backdrop-blur overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)} text-white`}>
                  {getStatusText(product.status)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">${product.price}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.sales} sold</p>
                      <p className="text-xs text-muted-foreground">this month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first product"}
              </p>
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-500"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
