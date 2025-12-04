import { NextResponse } from "next/server"

// Example: Type imported from your types
// Modify/export if needed for your backend models
type CalendarEvent = {
  id: string
  title: string
  start: Date | string
  end: Date | string
  color?: string
  platforms?: string[]
}

// Sample data, replace with DB access
const EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "YouTube Stream",
    start: new Date("2025-12-10T14:00:00Z"),
    end: new Date("2025-12-10T15:30:00Z"),
    color: "#c026d3",
    platforms: ["YouTube"],
  },
  {
    id: "2",
    title: "Twitch QA Session",
    start: new Date("2025-12-12T18:00:00Z"),
    end: new Date("2025-12-12T19:00:00Z"),
    color: "#6441a5",
    platforms: ["Twitch"],
  },
]

// GET handler
export async function GET() {
  // TODO: Fetch from DB instead of EVENTS
  return NextResponse.json(EVENTS)
  }
