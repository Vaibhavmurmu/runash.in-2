import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { neon } from "@neondatabase/serverless"
import { compare } from "bcrypt"

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
          const passwordMatch = await compare(credentials.password, user.password_)

          if (!passwordMatch) {
            return null
          }

          return {
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Error during authorization:", error)
          return null
        }
      },
    }),
  ],
}
