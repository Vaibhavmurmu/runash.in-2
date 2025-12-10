"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  Award,
  Heart,
  MessageSquare,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  UserPlus,
  Search,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import SlideOver from "@/components/SlideOver"
import ThemeToggle from "@/components/theme-toggle"
import { motion } from "framer-motion"

/**
 * Community page now wired to /api/community and using SlideOver/ThemeToggle components.
 * Includes animated entrance for list items (framer-motion).
 *
 * Note: install framer-motion locally:
 *   npm install framer-motion
 */

type Program = {
  id: string
  title: string
  description: string
  color?: string
  participants?: number
  duration?: string
  nextCohort?: string
  benefits?: string[]
  requirements?: string[]
  tags?: string[]
}

type EventItem = {
  id: string
  title: string
  description: string
  date: string
  time?: string
  type?: string
  attendees?: number
  maxAttendees?: number
  speaker?: { name: string; role?: string; avatar?: string }
  tags?: string[]
  location?: string
}

type Member = {
  name: string
  avatar?: string
  role?: string
  followers?: string
  growth?: string
  achievement?: string
  quote?: string
  platforms?: string[]
  joinedDate?: string
  slug?: string
}

type ResourceCategory = {
  category: string
  icon?: string
  items: { title: string; type: string; duration?: string; url?: string }[]
}

type CommunityPayload = {
  programs: Program[]
  events: EventItem[]
  members: Member[]
  resources: ResourceCategory[]
  stats: { label: string; value: string; change?: string }[]
}

export default function CommunityPage() {
  const router = useRouter()
  const [data, setData] = useState<CommunityPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState<string>("")
  const [programFilter, setProgramFilter] = useState<string>("all")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [openProgram, setOpenProgram] = useState(false)

  const [registrations, setRegistrations] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("runash.registrations")
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const [follows, setFollows] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("runash.follows")
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch("/api/community")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(text || `Failed to fetch community data (${res.status})`)
        }
        return res.json()
      })
      .then((json: CommunityPayload) => {
        setData(json)
      })
      .catch((err: any) => {
        console.error("Failed to load community data", err)
        setError("Could not load community content. Try again later.")
        setData({ programs: [], events: [], members: [], resources: [], stats: [] })
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("runash.registrations", JSON.stringify(registrations))
    } catch {}
  }, [registrations])

  useEffect(() => {
    try {
      localStorage.setItem("runash.follows", JSON.stringify(follows))
    } catch {}
  }, [follows])

  const programs = data?.programs ?? []
  const events = data?.events ?? []
  const members = data?.members ?? []
  const resources = data?.resources ?? []
  const stats = data?.stats ?? []

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase()
    return programs.filter((p) => {
      if (programFilter !== "all" && !(p.tags || []).includes(programFilter)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.benefits || []).some((b) => b.toLowerCase().includes(q))
      )
    })
  }, [programs, search, programFilter])

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((e) => {
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [events, search])

  function openProgramDetails(program: Program) {
    setSelectedProgram(program)
    setOpenProgram(true)
    setTimeout(() => {
      const el = document.getElementById("program-slide-over")
      el?.focus()
    }, 100)
  }

  async function registerForEvent(eventId: string) {
    setRegistrations((s) => ({ ...s, [eventId]: !s[eventId] }))
    try {
      const res = await fetch("/api/community/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      if (!res.ok) {
        setRegistrations((s) => ({ ...s, [eventId]: !s[eventId] }))
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Registration failed")
      }
    } catch (err) {
      console.error("Register failed", err)
    }
  }

  function toggleFollow(memberName: string) {
    setFollows((s) => ({ ...s, [memberName]: !s[memberName] }))
  }

  function addToCalendar(eventItem: EventItem) {
    try {
      const start = new Date(`${eventItem.date}T${(eventItem.time || "12:00").replace(" ", "")}`)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const toICS = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//RunAsh//EN",
        "BEGIN:VEVENT",
        `UID:${eventItem.id}@runash.in`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:${escapeICSText(eventItem.title)}`,
        `DESCRIPTION:${escapeICSText(eventItem.description || "")}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")

      const blob = new Blob([toICS], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch (err) {
      console.error("Failed to create calendar entry", err)
    }
  }

  function formatICSDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(
      d.getUTCMinutes(),
    )}00Z`
  }

  function escapeICSText(s: string) {
    return s.replace(/\n/g, "\\n").replace(/,/g, "\\,")
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return ""
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <header className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow">RA</div>
            <div>
              <div className="text-sm font-semibold">RunAsh</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Creator Community</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-md py-1 px-2">
              <Button size="sm" variant="ghost" onClick={() => router.push("/forum")}>
                <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
                Forum
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-400 to-orange-500 text-white" onClick={() => router.push("/get-started")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Join
              </Button>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium mb-4 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300">
                  <Heart className="h-4 w-4" />
                  Join 1K+ creators
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  Build, collaborate, and grow with the RunAsh community
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Modern tooling, curated programs, and peer-driven events that help creators scale faster.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-3 shadow">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="px-5 py-3" onClick={() => router.push("/forum")}>
                    Visit Forum
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-transparent dark:border-gray-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Active members</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      {stats[0]?.value ?? "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Events this month</div>
                    <div className="text-2xl font-bold">{stats[1]?.value ?? "—"}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="hero-search" className="sr-only">Search community</label>
                  <div className="relative">
                    <input
                      id="hero-search"
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search programs, events, creators..."
                      className="w-full rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 pr-12"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button size="sm" className="bg-white text-orange-600 border border-orange-100" onClick={() => setProgramFilter("all")}>
                    All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setProgramFilter("mentorship")}>
                    Mentorship
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setProgramFilter("content")}>
                    Challenges
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setProgramFilter("innovation")}>
                    Beta Lab
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Programs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Programs</h2>
                <div className="text-sm text-gray-500">{filteredPrograms.length} available</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                        </CardHeader>
                        <CardContent>
                          <div className="h-24 bg-gray-50 dark:bg-gray-900/30 rounded" />
                        </CardContent>
                      </Card>
                    ))
                  : filteredPrograms.length === 0
                  ? <div className="text-gray-500">No programs found that match your search.</div>
                  : filteredPrograms.map((program, idx) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                      >
                        <Card
                          className="hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
                          onClick={() => openProgramDetails(program)}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white`}>
                                <Users className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{program.title}</CardTitle>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{program.description}</div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="text-xs text-gray-500">Next cohort</div>
                                <div className="font-medium">{program.nextCohort ?? "Rolling"}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Duration</div>
                                <div className="font-medium">{program.duration ?? "Varies"}</div>
                              </div>
                              <div>
                                <Button variant="ghost" size="sm" onClick={() => openProgramDetails(program)}>
                                  Learn more
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
              </div>
            </section>

            {/* Events */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <div className="text-sm text-gray-500">{filteredEvents.length} upcoming</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="h-20 bg-gray-50 dark:bg-gray-900/30 rounded" />
                        </CardContent>
                      </Card>
                    ))
                  : filteredEvents.length === 0
                  ? <div className="text-gray-500">No upcoming events at the moment.</div>
                  : filteredEvents.map((event, idx) => {
                      const isRegistered = Boolean(registrations[event.id])
                      const pct = event.maxAttendees ? Math.min(100, Math.round(((event.attendees ?? 0) / event.maxAttendees) * 100)) : 0
                      return (
                        <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.04 }}>
                          <Card className="hover:shadow-lg transition">
                            <CardHeader>
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="bg-orange-50 text-orange-600">{event.type ?? "Event"}</Badge>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{(event.attendees ?? 0)}/{event.maxAttendees ?? "—"}</div>
                              </div>

                              <CardTitle className="text-lg">{event.title}</CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                            </CardHeader>

                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <Calendar className="h-4 w-4" />
                                  <div>{formatDate(event.date)}</div>
                                  <Clock className="h-4 w-4 ml-3" />
                                  <div>{event.time ?? "TBD"}</div>
                                </div>

                                <Progress value={pct} className="h-2" />

                                <div className="flex gap-2">
                                    <Button size="sm" className={isRegistered ? "bg-orange-500 text-white" : ""} onClick={() => registerForEvent(event.id)}>
                                    {isRegistered ? "Registered" : "Register"}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => addToCalendar(event)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Add to calendar
                                  </Button>
                                  <div className="ml-auto text-xs text-gray-500 self-center">{event.tags?.slice(0, 3).join(" • ")}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-orange-500" />
                  Featured Members
                </CardTitle>
                <div className="text-sm text-gray-500">Creators making waves</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : members.length === 0 ? (
                    <div className="text-sm text-gray-500">No featured members yet</div>
                  ) : (
                    members.slice(0, 6).map((m) => (
                      <div key={m.name} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={m.avatar ?? "/placeholder.svg"} alt={m.name} />
                          <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.role}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button size="sm" variant={follows[m.name] ? undefined : "outline"} onClick={() => toggleFollow(m.name)}>
                            {follows[m.name] ? "Following" : "Follow"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/creator/${m.slug ?? encodeURIComponent(m.name)}`)}>
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-orange-500" />
                  Resources
                </CardTitle>
                <div className="text-sm text-gray-500">Guides & workshops</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="h-20 bg-gray-50 dark:bg-gray-900/30 rounded animate-pulse" />
                  ) : resources.length === 0 ? (
                    <div className="text-sm text-gray-500">No resources yet.</div>
                  ) : (
                    resources.slice(0, 4).map((r) => (
                      <div key={r.category}>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-orange-400" />
                          {r.category}
                        </div>
                        <div className="space-y-2">
                          {r.items.slice(0, 3).map((it) => (
                            <div key={it.title} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm">{it.title}</div>
                                <div className="text-xs text-gray-500">{it.type} • {it.duration ?? ""}</div>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => it.url ? window.open(it.url, "_blank") : null}>
                                Open
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Quick Stats
                </CardTitle>
                <div className="text-sm text-gray-500">Community highlights</div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.length === 0 ? (
                    <div className="text-sm text-gray-500 col-span-full">No stats available</div>
                  ) : (
                    stats.slice(0, 4).map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-lg font-bold text-orange-500">{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* SlideOver */}
      <SlideOver isOpen={openProgram} onClose={() => setOpenProgram(false)} title={selectedProgram?.title}>
        {selectedProgram ? (
          <div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Key benefits</h4>
                <ul className="space-y-2">
                  {(selectedProgram.benefits && selectedProgram.benefits.length > 0) ? selectedProgram.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span>{b}</span>
                    </li>
                  )) : <div className="text-sm text-gray-500">No benefits listed for this program.</div>}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Requirements</h4>
                <div className="text-sm text-gray-600">
                  {(selectedProgram.requirements && selectedProgram.requirements.length > 0) ? (
                    <ul className="list-disc list-inside">
                      {selectedProgram.requirements!.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  ) : (
                       <div className="text-sm text-gray-500">No specific requirements.</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => { setOpenProgram(false); router.push(`/programs/${selectedProgram.id}`) }}>
                  View Program
                </Button>
                <Button variant="outline" onClick={() => { setOpenProgram(false); router.push("/get-started") }}>
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Footer CTA */}
      <footer className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-orange-400 to-orange-300 text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Ready to accelerate your growth?</h3>
            <p className="mb-4 text-sm opacity-90">Join the RunAsh community to access programs, events, and deep collaboration.</p>
            <div className="flex justify-center gap-3">
              <Button className="bg-white text-orange-600 px-6" onClick={() => router.push("/get-started")}>
                Join Now
              </Button>
              <Button variant="outline" className="border-white text-white" onClick={() => router.push("/forum")}>
                Visit Forum
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/70 border border-red-100 dark:border-red-700 text-red-800 dark:text-red-200 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  )
}


