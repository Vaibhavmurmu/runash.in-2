import { NextResponse } from "next/server"

/**
 * POST /api/community/register
 * Accepts { eventId } in JSON body.
 * This example endpoint performs lightweight validation and returns success.
 * In production you should validate the user session and persist registration to your DB.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { eventId } = body || {}

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 })
    }

    // NOTE: In-memory or stub behavior - in production persist to DB.
    // We'll echo success for local testing so the client can behave optimistically.
    return NextResponse.json({ ok: true, eventId }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
