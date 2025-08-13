import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthAnalytics } from "@/lib/auth-analytics"
import { z } from "zod"

const analyticsSchema = z.object({
  start: z
    .string()
    .optional()
    .default(() => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString().split("T")[0]
    }),
  end: z
    .string()
    .optional()
    .default(() => {
      return new Date().toISOString().split("T")[0]
    }),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin permissions
    // This would typically check if user has admin role/permissions

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const { start, end } = analyticsSchema.parse(params)

    const analyticsData = await AuthAnalytics.getOverviewMetrics({ start, end })

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Error fetching auth analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
