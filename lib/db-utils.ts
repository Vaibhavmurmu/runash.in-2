import { db, schema } from "@/lib/drizzle"
import { eq, and, or, like, desc, count } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

/**
 * Database utility functions for common operations
 * Provides type-safe query builders and helpers
 */

// ==================== USER UTILITIES ====================

export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  })
  return user
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  })
  return user
}

export async function createUser(data: {
  id: string
  email: string
  name?: string
  image?: string
  role?: string
}) {
  const user = await db
    .insert(schema.users)
    .values(data)
    .returning()
    .then((result) => result[0])
  return user
}

export async function updateUser(id: string, data: Partial<typeof schema.users.$inferInsert>) {
  const user = await db
    .update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning()
    .then((result) => result[0])
  return user
}

// ==================== PRODUCT UTILITIES ====================

export async function getProductById(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id as any),
    with: {
      reviews: {
        limit: 5,
        orderBy: desc(schema.reviews.createdAt),
      },
    },
  })
  return product
}

export async function getProductsByUserId(userId: string) {
  const products = await db.query.products.findMany({
    where: eq(schema.products.userId, userId),
    orderBy: desc(schema.products.createdAt),
  })
  return products
}

export async function searchProducts(query: string, limit = 20) {
  const products = await db.query.products.findMany({
    where: and(
      eq(schema.products.isActive, true),
      or(
        like(schema.products.name, `%${query}%`),
        like(schema.products.description, `%${query}%`),
        like(schema.products.category, `%${query}%`),
      ),
    ),
    limit,
    orderBy: [desc(schema.products.isFeatured), desc(schema.products.rating)],
  })
  return products
}

export async function getFeaturedProducts(limit = 10) {
  const products = await db.query.products.findMany({
    where: and(eq(schema.products.isActive, true), eq(schema.products.isFeatured, true)),
    limit,
    orderBy: desc(schema.products.rating),
  })
  return products
}

export async function createProduct(data: typeof schema.products.$inferInsert) {
  const product = await db
    .insert(schema.products)
    .values({
      ...data,
      id: uuidv4() as any,
    })
    .returning()
    .then((result) => result[0])
  return product
}

export async function updateProduct(id: string, data: Partial<typeof schema.products.$inferInsert>) {
  const product = await db
    .update(schema.products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.products.id, id as any))
    .returning()
    .then((result) => result[0])
  return product
}

// ==================== ORDER UTILITIES ====================

export async function getOrderById(id: string) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, id as any),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      user: true,
    },
  })
  return order
}

export async function getOrdersByUserId(userId: string) {
  const orders = await db.query.orders.findMany({
    where: eq(schema.orders.userId, userId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
    orderBy: desc(schema.orders.createdAt),
  })
  return orders
}

export async function createOrder(
  data: typeof schema.orders.$inferInsert & {
    items: Array<Omit<typeof schema.orderItems.$inferInsert, "orderId" | "id">>
  },
) {
  const { items, ...orderData } = data
  const orderId = uuidv4() as any

  // Insert order
  const order = await db
    .insert(schema.orders)
    .values({
      ...orderData,
      id: orderId,
    })
    .returning()
    .then((result) => result[0])

  // Insert order items
  if (items && items.length > 0) {
    await db.insert(schema.orderItems).values(
      items.map((item) => ({
        ...item,
        orderId,
        id: uuidv4() as any,
      })),
    )
  }

  return order
}

export async function updateOrderStatus(id: string, status: string, paymentStatus?: string) {
  const order = await db
    .update(schema.orders)
    .set({
      status,
      paymentStatus,
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, id as any))
    .returning()
    .then((result) => result[0])
  return order
}

// ==================== REVIEW UTILITIES ====================

export async function getReviewsByProductId(productId: string, limit = 10) {
  const reviews = await db.query.reviews.findMany({
    where: eq(schema.reviews.productId, productId as any),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: desc(schema.reviews.createdAt),
    limit,
  })
  return reviews
}

export async function createReview(data: typeof schema.reviews.$inferInsert) {
  const review = await db
    .insert(schema.reviews)
    .values({
      ...data,
      id: uuidv4() as any,
    })
    .returning()
    .then((result) => result[0])

  // Update product rating
  const reviews = await db
    .select({
      count: count(),
      avgRating: schema.reviews.rating,
    })
    .from(schema.reviews)
    .where(eq(schema.reviews.productId, data.productId!))

  return review
}

// ==================== MESSAGE UTILITIES ====================

export async function getConversationMessages(conversationId: string, limit = 50) {
  const messages = await db.query.messages.findMany({
    where: eq(schema.messages.conversationId, conversationId as any),
    with: {
      sender: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: desc(schema.messages.createdAt),
    limit,
  })
  return messages.reverse() // Return in chronological order
}

export async function sendMessage(data: {
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  type?: string
}) {
  const message = await db
    .insert(schema.messages)
    .values({
      ...data,
      id: uuidv4() as any,
      conversationId: data.conversationId as any,
    })
    .returning()
    .then((result) => result[0])
  return message
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  await db
    .update(schema.messages)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(and(eq(schema.messages.conversationId, conversationId as any), eq(schema.messages.recipientId, userId)))
}

// ==================== NOTIFICATION UTILITIES ====================

export async function getUserNotifications(userId: string, limit = 20) {
  const notifications = await db.query.notifications.findMany({
    where: eq(schema.notifications.userId, userId),
    orderBy: desc(schema.notifications.createdAt),
    limit,
  })
  return notifications
}

export async function createNotification(data: Omit<typeof schema.notifications.$inferInsert, "id">) {
  const notification = await db
    .insert(schema.notifications)
    .values({
      ...data,
      id: uuidv4() as any,
    })
    .returning()
    .then((result) => result[0])
  return notification
}

export async function markNotificationAsRead(notificationId: string) {
  await db
    .update(schema.notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(eq(schema.notifications.id, notificationId as any))
}

// ==================== WISHLIST UTILITIES ====================

export async function getUserWishlist(userId: string) {
  const wishlistItems = await db.query.wishlist.findMany({
    where: eq(schema.wishlist.userId, userId),
    with: {
      product: true,
    },
  })
  return wishlistItems
}

export async function addToWishlist(userId: string, productId: string) {
  const item = await db
    .insert(schema.wishlist)
    .values({
      id: uuidv4() as any,
      userId,
      productId: productId as any,
    })
    .returning()
    .then((result) => result[0])
  return item
}

export async function removeFromWishlist(userId: string, productId: string) {
  await db
    .delete(schema.wishlist)
    .where(and(eq(schema.wishlist.userId, userId), eq(schema.wishlist.productId, productId as any)))
}

// ==================== EVENT/ANALYTICS UTILITIES ====================

export async function logEvent(data: Omit<typeof schema.events.$inferInsert, "id">) {
  const event = await db
    .insert(schema.events)
    .values({
      ...data,
      id: uuidv4() as any,
    })
    .returning()
    .then((result) => result[0])
  return event
}
