"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react"

export function InventoryManager() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: products,
    error,
    mutate,
  } = useSWR("/api/products?seller=true", (url) =>
    fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to fetch products")))),
  )

  const handleUpdateStock = async (productId: number, newStock: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      })
      if (!response.ok) throw new Error("Failed to update stock")
      toast({ title: "Stock updated", description: "Product stock has been updated." })
      mutate()
    } catch (error) {
      toast({ title: "Error", description: "Failed to update stock.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete product")
      toast({ title: "Product deleted", description: "The product has been removed." })
      mutate()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" })
    }
  }

  const filteredProducts = products?.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Inventory Management
            </CardTitle>
            <CardDescription>Monitor and manage your product inventory</CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.stock > 10 ? (
                      <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    ) : product.stock > 0 ? (
                      <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
