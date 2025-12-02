import type { NextApiRequest, NextApiResponse } from "next"
import { readData, writeData } from "./utils"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const { title, category, dateTime } = req.body || {}
  if (!title || !dateTime) return res.status(400).send("Missing title or date/time")

  const data = await readData()
  const id = uuidv4()
  const scheduled = { id, title, category, dateTime, status: "scheduled" }

  data.scheduled = [scheduled, ...(data.scheduled || [])]
  await writeData(data)

  // Return the scheduled item
  res.status(201).json(scheduled)
}
