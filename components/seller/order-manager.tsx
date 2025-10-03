"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) =>
  fetch(url, { headers: { "x-user-id": "1" } }).then((r) => {
    if (!r.ok) throw new Error("Failed to load orders")
    return r.json()
  })

export function OrderManager() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const {
    data: orders = [],
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/orders?status=${selectedStatus}&q=${encodeURIComponent(searchTerm)}`, fetcher)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "content-type": "application/json", "x-user-id": "1" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update order")
      await mutate()
      toast({ title: "Order updated", description: `Order ${orderId} marked as ${getStatusText(newStatus)}.` })
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Could not update order.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-sm text-muted-foreground">Loading orders…</div>}
      {error && <div className="text-sm text-red-600">Failed to load orders. Please try again.</div>}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Manager</h2>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={order.customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {order.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">Order {order.id}</h3>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-1">{order.customer.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(order.orderDate), "MMM dd, yyyy HH:mm")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {order.items.length} items
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                            <DialogDescription>Complete order information and management options</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Customer Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedOrder.customer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedOrder.customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedOrder.customer.phone}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Shipping Address</h4>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                    <span>{selectedOrder.shippingAddress}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold mb-3">Order Items</h4>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                      </div>
                                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-t-2 border-orange-200">
                                    <p className="font-semibold">Total</p>
                                    <p className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Order Status Update */}
                              <div>
                                <h4 className="font-semibold mb-3">Update Order Status</h4>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                  >
                                    <SelectTrigger className="w-48">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
                                    Update Status
                                  </Button>
                                </div>
                              </div>

                              {/* Tracking Info */}
                              {selectedOrder.trackingNumber && (
                                <div>
                                  <h4 className="font-semibold mb-3">Tracking Information</h4>
                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                                    <p className="font-mono font-semibold">{selectedOrder.trackingNumber}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Status-specific tabs */}
        {["pending", "processing", "shipped", "delivered"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="space-y-4">
              {orders
                .filter((order) => order.status === status)
                .map((order) => (
                  <Card
                    key={order.id}
                    className={`border-0 shadow-lg bg-white/80 backdrop-blur border-l-4 ${
                      status === "pending"
                        ? "border-l-yellow-500"
                        : status === "processing"
                          ? "border-l-blue-500"
                          : status === "shipped"
                            ? "border-l-purple-500"
                            : "border-l-green-500"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={order.customer.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {order.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">Order {order.id}</h3>
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-1">{order.customer.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(order.orderDate), "MMM dd, yyyy HH:mm")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {order.items.length} items
                              </div>
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="h-4 w-4" />${order.total.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {status === "pending" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-cyan-500"
                              onClick={() => updateOrderStatus(order.id, "processing")}
                            >
                              Start Processing
                            </Button>
                          )}
                          {status === "processing" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-pink-500"
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                            >
                              Mark as Shipped
                            </Button>
                          )}
                          {status === "shipped" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                            >
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredOrders.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Orders will appear here when customers make purchases"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
