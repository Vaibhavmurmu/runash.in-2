import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthAnalytics } from "@/lib/auth-analytics"
import { z } from "zod"

const eventsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : 50)),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const { limit } = eventsSchema.parse(params)

    const events = await AuthAnalytics.getRecentAuthEvents(limit)

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching auth events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
