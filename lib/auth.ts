import { betterAuth } from "better-auth"

// The crypto was causing browser bundling errors. In production, BETTER_AUTH_SECRET
// environment variable must be explicitly set. For development, we use a stable string.

const getAuthSecret = (): string => {
  const envSecret = process.env.BETTER_AUTH_SECRET

  // Use environment variable if available
  if (envSecret && envSecret.length > 0 && envSecret !== "default-secret") {
    return envSecret
  }

  // For development/preview, use a stable hardcoded secret
  // In production, BETTER_AUTH_SECRET must be set explicitly
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Auth] BETTER_AUTH_SECRET not configured. Using development secret. " +
        "Set BETTER_AUTH_SECRET environment variable for production.",
    )
    // Using a stable development secret instead of crypto hash
    return "dev-stable-secret-key-change-in-production-12345678"
  }

  throw new Error("BETTER_AUTH_SECRET must be set in production environment")
}

export const auth = betterAuth({
  secret: getAuthSecret(),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",

  // Session configuration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
    cookieAttributes: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  },

  // Email & password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  // OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  // Trust host in development
  trustHost: true,
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
