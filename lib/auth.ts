import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { neon } from "@neondatabase/serverless"
import { compare } from "bcryptjs"

// Initialize the SQL client
const sql = neon(process.env.DATABASE_URL!)

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/get-started",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const [user] = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          if (!user) {
            return null
          }

          // Check if password matches
          const passwordMatch = await compare(credentials.password, user.password_hash)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar_url,
            role: user.role,
          }
        } catch (error) {
          console.error("Error during authorization:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      // Handle OAuth providers
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists in database
          const [existingUser] = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `

          if (!existingUser) {
            // Create new user
            const [newUser] = await sql`
              INSERT INTO users (email, name, avatar_url, provider, provider_id, role)
              VALUES (${user.email}, ${user.name}, ${user.image}, ${account.provider}, ${account.providerAccountId}, 'user')
              RETURNING *
            `
            token.role = newUser.role
            token.id = newUser.id
          } else {
            token.role = existingUser.role
            token.id = existingUser.id
          }
        } catch (error) {
          console.error("Error handling OAuth user:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
