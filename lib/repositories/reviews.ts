import { db, schema } from "@/lib/drizzle"
import { eq, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export class ReviewRepository {
  static async findByProductId(productId: string, limit = 10) {
    return db.query.reviews.findMany({
      where: eq(schema.reviews.productId, productId as any),
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
      },
      orderBy: desc(schema.reviews.createdAt),
      limit,
    })
  }

  static async findByUserId(userId: string) {
    return db.query.reviews.findMany({
      where: eq(schema.reviews.userId, userId),
      orderBy: desc(schema.reviews.createdAt),
    })
  }

  static async create(data: typeof schema.reviews.$inferInsert) {
    return db
      .insert(schema.reviews)
      .values({
        ...data,
        id: uuidv4() as any,
      })
      .returning()
      .then((r) => r[0])
  }

  static async update(id: string, data: Partial<typeof schema.reviews.$inferInsert>) {
    return db
      .update(schema.reviews)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.reviews.id, id as any))
      .returning()
      .then((r) => r[0])
  }
}
