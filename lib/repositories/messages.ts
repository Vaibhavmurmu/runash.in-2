import { db, schema } from "@/lib/drizzle"
import { eq, and, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export class MessageRepository {
  static async findConversationMessages(conversationId: string, limit = 50) {
    return db.query.messages.findMany({
      where: eq(schema.messages.conversationId, conversationId as any),
      with: {
        sender: {
          columns: { id: true, name: true, image: true },
        },
      },
      orderBy: desc(schema.messages.createdAt),
      limit,
    })
  }

  static async create(data: typeof schema.messages.$inferInsert) {
    return db
      .insert(schema.messages)
      .values({
        ...data,
        id: uuidv4() as any,
      })
      .returning()
      .then((r) => r[0])
  }

  static async markAsRead(conversationId: string, userId: string) {
    return db
      .update(schema.messages)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(schema.messages.conversationId, conversationId as any), eq(schema.messages.recipientId, userId)))
  }

  static async getUnreadCount(userId: string) {
    const result = await db
      .selectDistinct({ conversationId: schema.messages.conversationId })
      .from(schema.messages)
      .where(and(eq(schema.messages.recipientId, userId), eq(schema.messages.isRead, false)))

    return result.length
  }
}
