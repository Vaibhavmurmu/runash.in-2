import type { NextApiRequest, NextApiResponse } from "next"
import { readData } from "./utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await readData()
  res.status(200).json(data.scheduled || [])
}
