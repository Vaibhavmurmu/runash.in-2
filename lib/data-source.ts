import { writeFileSync, readFileSync, existsSync } from "fs"
import path from "path"
import { streamEmitter } from "./stream-emitter"

/**
 * Small server-side data source that exposes:
 * - getDashboardData(): returns the DashboardResponse expected by the frontend
 * - getLatestLive(): returns latest live metrics
 *
 * Replace the internals of getDashboardData() with real aggregation logic from
 * your analytics DB or streaming provider to provide "real data".
 */

export async function getDashboardData() {
  // Example: combine historical sample data with recent snapshot
  // In production, replace with DB queries / aggregation calls
  const today = new Date()
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const overview = Array.from({ length: 12 }).map((_, i) => {
    const viewers = 1000 + i * 400 + Math.round(Math.random() * 600)
    return {
      date: months[i],
      viewers,
      followers: Math.round(viewers * 0.35),
      revenue: Math.round(viewers * 1.5),
    }
  })

  const platforms = [
    { name: "Twitch", value: 45, color: "#9146FF" },
    { name: "YouTube", value: 30, color: "#FF0000" },
    { name: "Facebook", value: 15, color: "#1877F2" },
    { name: "TikTok", value: 10, color: "#000000" },
  ]

  const content = [
    { name: "Gaming", views: 4500, engagement: 8.2 },
    { name: "Just Chatting", views: 3800, engagement: 7.5 },
    { name: "Music", views: 2200, engagement: 6.8 },
    { name: "Creative", views: 1800, engagement: 5.9 },
    { name: "IRL", views: 1500, engagement: 6.2 },
  ]

  const audience = [
    { name: "18-24", male: 28, female: 22 },
    { name: "25-34", male: 32, female: 27 },
    { name: "35-44", male: 15, female: 18 },
    { name: "45-54", male: 6, female: 10 },
    { name: "55+", male: 4, female: 8 },
  ]

  const revenue = [
    { name: "Subscriptions", value: 45, color: "#3b82f6" },
    { name: "Donations", value: 25, color: "#f97316" },
    { name: "Ads", value: 20, color: "#84cc16" },
    { name: "Sponsorships", value: 10, color: "#8b5cf6" },
  ]

  const engagement = Array.from({ length: 12 }).map((_, i) => ({
    time: `${9 + i} AM`,
    chatActivity: 100 + i * 30,
    viewers: 400 + i * 50,
  }))

  // Optionally augment with the latest live metrics
  const latest = streamEmitter.getLatest()
  if (latest && overview.length) {
    const last = overview[overview.length - 1]
    // merge live viewers into last month for a more "real" feel
    last.viewers = Math.round(((last.viewers || 0) + (latest.viewers || 0)) / 2)
  }

  return { overview, platforms, content, audience, revenue, engagement }
}

const SCHEDULE_FILE = path.resolve(process.cwd(), "data", "schedules.json")

export function readSchedulesFromDisk() {
  try {
    if (!existsSync(SCHEDULE_FILE)) {
      writeFileSync(SCHEDULE_FILE, JSON.stringify([]))
      return []
    }
    const raw = readFileSync(SCHEDULE_FILE, "utf-8")
    return JSON.parse(raw)
  } catch (err) {
    console.error("readSchedulesFromDisk", err)
    return []
  }
}

export function writeSchedulesToDisk(schedules: any[]) {
  try {
    writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2), "utf-8")
  } catch (err) {
    console.error("writeSchedulesToDisk", err)
  }
}

export function getLatestLive() {
  return streamEmitter.getLatest()
}
