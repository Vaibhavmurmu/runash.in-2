import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email || '').toString().trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Simple stub: append to a local file (note: serverless environments may not persist this)
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

    const subsFile = path.join(dataDir, 'subscriptions.json')
    let subs: string[] = []
    if (fs.existsSync(subsFile)) {
      try {
        subs = JSON.parse(fs.readFileSync(subsFile, 'utf8'))
      } catch (e) {
        subs = []
      }
    }

    if (!subs.includes(email)) {
      subs.push(email)
      fs.writeFileSync(subsFile, JSON.stringify(subs, null, 2))
    }

    return NextResponse.json({ ok: true, email })
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
