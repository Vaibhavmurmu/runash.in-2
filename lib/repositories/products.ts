import { db, schema } from "@/lib/drizzle"
import { eq, and, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export class ProductRepository {
  static async findById(id: string) {
    return db.query.products.findFirst({
      where: eq(schema.products.id, id as any),
      with: {
        reviews: {
          with: {
            user: {
              columns: { id: true, name: true, image: true },
            },
          },
        },
      },
    })
  }

  static async findBySlug(slug: string) {
    return db.query.products.findFirst({
      where: and(eq(schema.products.slug, slug), eq(schema.products.isActive, true)),
      with: {
        reviews: true,
      },
    })
  }

  static async findByCategory(category: string, limit = 20) {
    return db.query.products.findMany({
      where: and(eq(schema.products.category, category), eq(schema.products.isActive, true)),
      limit,
      orderBy: desc(schema.products.rating),
    })
  }

  static async findAll(limit = 20, offset = 0) {
    return db.query.products.findMany({
      where: eq(schema.products.isActive, true),
      limit,
      offset,
      orderBy: [desc(schema.products.isFeatured), desc(schema.products.createdAt)],
    })
  }

  static async create(data: typeof schema.products.$inferInsert) {
    return db
      .insert(schema.products)
      .values({
        ...data,
        id: uuidv4() as any,
      })
      .returning()
      .then((r) => r[0])
  }

  static async update(id: string, data: Partial<typeof schema.products.$inferInsert>) {
    return db
      .update(schema.products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.products.id, id as any))
      .returning()
      .then((r) => r[0])
  }

  static async delete(id: string) {
    await db.delete(schema.products).where(eq(schema.products.id, id as any))
  }
}
