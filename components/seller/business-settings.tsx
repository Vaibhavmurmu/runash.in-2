"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export function BusinessSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "Green Valley Farms",
    businessType: "organic-farm",
    description: "Family-owned organic farm...",
    businessHours: "Mon-Sat: 8 AM - 6 PM",
    deliveryRadius: "50",
    minimumOrder: "25",
    returnPolicy: "14 days money-back guarantee",
    paymentMethods: ["credit_card", "paypal"],
    shippingOptions: ["local_delivery", "pickup"],
    certifications: ["usda_organic", "non_gmo"],
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/seller/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to save settings")
      toast({ title: "Settings saved", description: "Your business settings have been updated." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Business Configuration</CardTitle>
          <CardDescription>Update your business operations and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Type & Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(v) => setFormData({ ...formData, businessType: v })}
              >
                <SelectTrigger id="business-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organic-farm">Organic Farm</SelectItem>
                  <SelectItem value="grocery-store">Grocery Store</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-hours">Business Hours</Label>
              <Input
                id="business-hours"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
              />
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-radius">Delivery Radius (miles)</Label>
              <Input
                id="delivery-radius"
                type="number"
                value={formData.deliveryRadius}
                onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum-order">Minimum Order ($)</Label>
              <Input
                id="minimum-order"
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Payment Methods</Label>
              {[
                { id: "credit_card", label: "Credit/Debit Cards" },
                { id: "paypal", label: "PayPal" },
                { id: "bank_transfer", label: "Bank Transfer" },
                { id: "cash_on_delivery", label: "Cash on Delivery" },
              ].map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Switch
                    checked={formData.paymentMethods.includes(method.id)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        paymentMethods: checked
                          ? [...formData.paymentMethods, method.id]
                          : formData.paymentMethods.filter((m) => m !== method.id),
                      })
                    }}
                  />
                  <Label>{method.label}</Label>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Shipping Options</Label>
              {[
                { id: "local_delivery", label: "Local Delivery" },
                { id: "pickup", label: "Farm Pickup" },
                { id: "national_shipping", label: "National Shipping" },
              ].map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Switch
                    checked={formData.shippingOptions.includes(option.id)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        shippingOptions: checked
                          ? [...formData.shippingOptions, option.id]
                          : formData.shippingOptions.filter((o) => o !== option.id),
                      })
                    }}
                  />
                  <Label>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Return Policy */}
          <div className="space-y-2">
            <Label htmlFor="return-policy">Return & Refund Policy</Label>
            <Textarea
              id="return-policy"
              rows={4}
              value={formData.returnPolicy}
              onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
