import { promises as fs } from "fs"
import path from "path"

export const DATA_FILE = path.join(process.cwd(), "data", "streams.json")

export async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch (err) {
    // If file doesn't exist or is invalid, return defaults
    return { recent: [], scheduled: [], invites: [] }
  }
}

export async function writeData(data: any) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}
