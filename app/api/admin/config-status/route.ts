import { NextResponse } from "next/server"
import { getConfigStatus } from "@/lib/config"

export async function GET() {
  try {
    const status = getConfigStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Config status API error:", error)
    return NextResponse.json({
      openaiConfigured: false,
      databaseConfigured: !!process.env.DATABASE_URL,
      vectorSearchEnabled: false,
      semanticSearchEnabled: false,
      aiSuggestionsEnabled: false,
      configValid: false,
      errors: ["Failed to check configuration status"],
    })
  }
}
