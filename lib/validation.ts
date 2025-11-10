export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateProductData(data: any) {
  if (!data.name || typeof data.name !== "string" || data.name.length < 3) {
    throw new Error("Product name must be at least 3 characters")
  }
  if (!data.price || typeof data.price !== "number" || data.price < 0) {
    throw new Error("Product price must be a positive number")
  }
  if (data.stock === undefined || typeof data.stock !== "number" || data.stock < 0) {
    throw new Error("Product stock must be a non-negative number")
  }
  return true
}

export function validateOrderData(data: any) {
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Order must contain at least one item")
  }
  if (!data.buyerEmail || !validateEmail(data.buyerEmail)) {
    throw new Error("Valid buyer email is required")
  }
  if (!data.shippingAddress || typeof data.shippingAddress !== "string") {
    throw new Error("Shipping address is required")
  }
  return true
}

export function validateStreamData(data: any) {
  if (!data.title || typeof data.title !== "string" || data.title.length < 3) {
    throw new Error("Stream title must be at least 3 characters")
  }
  if (data.scheduledFor && new Date(data.scheduledFor) <= new Date()) {
    throw new Error("Stream must be scheduled for a future time")
  }
  return true
}
