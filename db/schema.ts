import { pgTable, serial, text, timestamp, boolean, integer, jsonb, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Better Auth users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  password: text("password"), // hashed
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Migration tracking
  migratedFromNextAuth: boolean("migrated_from_nextauth").default(false),
  nextAuthId: text("nextauth_id"), // Keep reference during migration
})

// Better Auth sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
})

// OAuth linked accounts
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider").notNull(), // 'google', 'github', 'credentials'
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  tokenType: varchar("token_type"),
  scope: text("scope"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Email verification tokens
export const verificationTokens = pgTable("verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  type: varchar("type").notNull(), // 'email_verification', 'password_reset'
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Feature flags for gradual rollout
export const featureFlags = pgTable("auth_feature_flags", {
  id: serial("id").primaryKey(),
  flagName: varchar("flag_name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").default(false),
  rolloutPercentage: integer("rollout_percentage").default(0), // 0-100
  targetUsers: jsonb("target_users"), // specific user IDs
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  verificationTokens: many(verificationTokens),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [verificationTokens.userId],
    references: [users.id],
  }),
}))
