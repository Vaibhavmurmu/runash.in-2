export interface GroceryProduct {
  id: string
  name: string
  description: string
  price: number // Base price in USD
  priceINR?: number // Optional INR price
  category: GroceryCategory
  subcategory: string
  brand: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  unit: string // kg, lbs, pieces, etc.
  minOrderQuantity: number
  maxOrderQuantity: number
  isOrganic: boolean
  isFreshProduce: boolean
  expiryDate?: Date
  harvestDate?: Date
  origin: string
  certifications: string[]
  nutritionalInfo?: NutritionalInfo
  sustainabilityScore: number
  carbonFootprint: number
  farmInfo?: FarmInfo
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
  tags: string[]
  isOnSale: boolean
  salePrice?: number
  saleEndDate?: Date
}

export interface FarmInfo {
  farmName: string
  location: string
  farmerName: string
  farmingMethod: string
  certifications: string[]
  distance: number // km from user
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: Date
  verified: boolean
  helpful: number
}

export interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  vitamins?: Record<string, number>
  minerals?: Record<string, number>
}

export type GroceryCategory =
  | "fruits"
  | "vegetables"
  | "grains-cereals"
  | "dairy-alternatives"
  | "meat-alternatives"
  | "pantry-staples"
  | "beverages"
  | "snacks"
  | "spices-herbs"
  | "oils-vinegars"
  | "nuts-seeds"
  | "superfoods"

export interface GroceryFilter {
  categories: GroceryCategory[]
  priceRange: [number, number]
  inStock: boolean
  isOrganic: boolean
  isFreshProduce: boolean
  certifications: string[]
  rating: number
  origin: string[]
  brands: string[]
  tags: string[]
}

export interface GroceryOrder {
  id: string
  userId: string
  items: GroceryOrderItem[]
  status: OrderStatus
  totalAmount: number
  currency: "USD" | "INR"
  deliveryAddress: Address
  deliveryDate: Date
  deliveryTimeSlot: string
  paymentMethod: string
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
  estimatedDelivery: Date
  specialInstructions?: string
}

export interface GroceryOrderItem {
  productId: string
  product: GroceryProduct
  quantity: number
  price: number
  currency: "USD" | "INR"
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  isDefault: boolean
}
