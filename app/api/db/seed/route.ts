import { db, schema } from "@/lib/drizzle"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    // Check authorization
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create sample user
    const hashedPassword = await hash("password123", 10)

    const user = await db
      .insert(schema.users)
      .values({
        id: "demo-user-1",
        email: "demo@example.com",
        name: "Demo User",
        password: hashedPassword,
        emailVerified: true,
      })
      .returning()
      .then((r) => r[0])
      .catch(() => null) // User might already exist

    if (!user) {
      return Response.json({
        status: "already_seeded",
        message: "Database already contains sample data",
      })
    }

    // Create sample products
    const products = []
    for (let i = 1; i <= 5; i++) {
      const product = await db
        .insert(schema.products)
        .values({
          userId: user.id,
          name: `Sample Product ${i}`,
          description: `This is a sample product for testing purposes.`,
          price: (99.99 + i * 10).toString() as any,
          category: ["Electronics", "Clothing", "Books", "Home", "Sports"][i - 1],
          image: `/placeholder.svg?height=300&width=300&query=product+${i}`,
          inventory: 100 + i * 10,
          sku: `SAMPLE-${i}`,
          isActive: true,
          isFeatured: i <= 2,
          rating: (3 + Math.random() * 2).toString() as any,
          reviewCount: Math.floor(Math.random() * 50),
        })
        .returning()
        .then((r) => r[0])
      products.push(product)
    }

    return Response.json({
      status: "success",
      message: "Database seeded successfully",
      data: {
        user: { id: user.id, email: user.email },
        productsCreated: products.length,
      },
    })
  } catch (error) {
    console.error("[v0] Seeding error:", error)
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Seeding failed",
      },
      { status: 500 },
    )
  }
}
