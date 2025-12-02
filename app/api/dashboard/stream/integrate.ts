import type { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple demo returning an RTMP key placeholder
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const rtmpKey = `demo-${uuidv4()}`
  // In production: generate per-user/per-stream keys and store them securely
  res.status(200).json({ rtmpKey })
}
