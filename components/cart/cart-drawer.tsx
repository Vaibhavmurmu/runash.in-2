"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import CartItem from "./cart-item"
import CartSummary from "./cart-summary"
import SustainabilityMetrics from "./sustainability-metrics"
import CouponInput from "./coupon-input"
import ShippingOptions from "./shipping-options"

export default function CartDrawer() {
  const { state, toggleCart, getItemCount, clearCart } = useCart()
  const { cart, isOpen, totals } = state

  const itemCount = getItemCount()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-orange-600 to-yellow-500 text-white text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Your Cart ({itemCount} items)</span>
            </SheetTitle>
            {cart.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Start adding some organic products to get started!
              </p>
            </div>
            <Button onClick={toggleCart} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Sustainability Metrics */}
            <SustainabilityMetrics metrics={cart.sustainabilityMetrics} />

            <Separator />

            {/* Cart Items */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Coupon Input */}
            <CouponInput />

            {/* Shipping Options */}
            <ShippingOptions />

            <Separator />

            {/* Cart Summary */}
            <CartSummary totals={totals} />

            {/* Checkout Button */}
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white"
                onClick={checkout}>
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={toggleCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
