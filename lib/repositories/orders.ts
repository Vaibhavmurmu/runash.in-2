import { db, schema } from "@/lib/drizzle"
import { eq, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export class OrderRepository {
  static async findById(id: string) {
    return db.query.orders.findFirst({
      where: eq(schema.orders.id, id as any),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        user: {
          columns: { id: true, name: true, email: true },
        },
      },
    })
  }

  static async findByUserId(userId: string, limit = 20) {
    return db.query.orders.findMany({
      where: eq(schema.orders.userId, userId),
      with: {
        items: {
          with: {
            product: {
              columns: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
      orderBy: desc(schema.orders.createdAt),
      limit,
    })
  }

  static async findByOrderNumber(orderNumber: string) {
    return db.query.orders.findFirst({
      where: eq(schema.orders.orderNumber, orderNumber),
      with: {
        items: true,
      },
    })
  }

  static async create(
    data: typeof schema.orders.$inferInsert & {
      items?: Array<Omit<typeof schema.orderItems.$inferInsert, "orderId" | "id">>
    },
  ) {
    const { items, ...orderData } = data
    const orderId = uuidv4() as any

    const order = await db
      .insert(schema.orders)
      .values({
        ...orderData,
        id: orderId,
      })
      .returning()
      .then((r) => r[0])

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

  static async updateStatus(id: string, status: string, paymentStatus?: string) {
    return db
      .update(schema.orders)
      .set({
        status,
        paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, id as any))
      .returning()
      .then((r) => r[0])
  }
}
