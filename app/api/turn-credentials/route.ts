import { NextResponse } from "next/server"
import crypto from "crypto"

// In a real app, these would be environment variables
const TURN_SERVER_SECRET = process.env.TURN_SERVER_SECRET || "your-turn-server-secret"

export async function GET() {
  try {
    // Generate temporary credentials for TURN server
    // This follows the TURN REST API specification
    // https://tools.ietf.org/html/draft-uberti-behave-turn-rest-00

    const username = `${Date.now() / 1000 + 12 * 3600}`
    const hmac = crypto.createHmac("sha1", TURN_SERVER_SECRET)
    hmac.update(username)
    const credential = hmac.digest("base64")

    return NextResponse.json({
      username,
      credential,
      ttl: 12 * 3600, // 12 hours in seconds
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error generating TURN credentials:", error)
    return NextResponse.json({ error: "Failed to generate TURN credentials" }, { status: 500 })
  }
}
