/**
 * Database configuration and connection pooling settings
 */

export const DB_CONFIG = {
  // Connection settings
  poolMin: 1,
  poolMax: 20,
  idleTimeout: 30000, // 30 seconds

  // Query timeout
  queryTimeout: 30000, // 30 seconds

  // Retry settings
  maxRetries: 3,
  retryDelay: 1000, // 1 second

  // Tables
  tables: {
    users: "users",
    sessions: "sessions",
    accounts: "accounts",
    verificationTokens: "verification_tokens",
    featureFlags: "auth_feature_flags",
    products: "products",
    orders: "orders",
    orderItems: "order_items",
    reviews: "reviews",
    messages: "messages",
    conversations: "conversations",
    notifications: "notifications",
    wishlist: "wishlist",
    events: "events",
  },

  // Indexes for performance
  indexes: {
    usersByEmail: "idx_users_email",
    ordersByUserId: "idx_orders_user_id",
    productsByCategory: "idx_products_category",
    messagesByConversation: "idx_messages_conversation_id",
    reviewsByProduct: "idx_reviews_product_id",
  },
}

export type DBConfig = typeof DB_CONFIG
