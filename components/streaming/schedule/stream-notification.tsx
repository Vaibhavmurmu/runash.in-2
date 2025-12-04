"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, Calendar, User, X, Share2 } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"

interface ScheduledStream {
  id: string
  scheduledDate: string
  title: string
  host: string
  hostAvatarUrl?: string
  thumbnailUrl?: string
  description?: string
  studioUrl?: string
  link?: string
}

interface StreamNotificationProps {
  onGoToStudio: (stream: ScheduledStream) => void
  // Optionally, pass in the user or auth token if needed
  user?: { id: string; name: string }
}

export default function StreamNotification({ onGoToStudio, user }: StreamNotificationProps) {
  const [stream, setStream] = useState<ScheduledStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [dismissed, setDismissed] = useState(false)
  const [reminded, setReminded] = useState(false)

  useEffect(() => {
    async function fetchStream() {
      try {
        setLoading(true)
        setError(null)
        // Use your real backend API route
        const resp = await fetch("/api/streaming/next", { credentials: "include" })
        if (!resp.ok) throw new Error("Network error")
        // Map backend fields to our ScheduledStream fields
        const data = await resp.json()
        if (!data) throw new Error("No upcoming stream found")
        setStream({
          id: data.id,
          scheduledDate: data.scheduled_date,
          title: data.title,
          host: data.presenter?.name || "Unknown Presenter",
          hostAvatarUrl: data.presenter?.avatar_url,
          thumbnailUrl: data.thumbnail,
          description: data.description,
          studioUrl: data.studio_url,
          link: data.watch_url,
        })
      } catch (err: any) {
        setError(err.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    fetchStream()
  }, [])

  // The rest remains unchanged

  useEffect(() => {
    if (!stream) return
    setDismissed(localStorage.getItem(`dismissed_stream_${stream.id}`) === "1")
    const updateTimeLeft = () => {
      const now = new Date()
      const streamDate = parseISO(stream.scheduledDate)
      const diffMs = streamDate.getTime() - now.getTime()
      setTimeLeft(diffMs <= 0 ? "Starting now" : formatDistanceToNow(streamDate, { addSuffix: false }))
    }
    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000)
    return () => clearInterval(interval)
  }, [stream])

  function handleRemindMe() {
    if (reminded || !stream) return
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          const streamDate = parseISO(stream.scheduledDate)
          const diffMs = streamDate.getTime() - Date.now()
          if (diffMs > 0) {
            setReminded(true)
            setTimeout(() => {
              new Notification("Stream starting now!", {
                body: stream.title,
                icon: stream.thumbnailUrl || undefined,
              })
            }, diffMs)
            alert("Reminder scheduled! You will get a browser notification when the stream starts.")
          }
        }
      })
    }
  }
  function handleDismiss() {
    setDismissed(true)
    if (stream && window) {
      localStorage.setItem(`dismissed_stream_${stream.id}`, "1")
    }
  }

  if (loading) return <Card className="p-4">Loading...</Card>
  if (error || !stream || dismissed) return null

  return (
    <Card className="p-4 border-l-4 border-l-orange-500 shadow-md animate-slideIn">
      <div className="flex items-start">
        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4 shrink-0">
          <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-medium flex items-center">Upcoming Stream</h4>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {stream.thumbnailUrl && (
              <img src={stream.thumbnailUrl} alt="thumbnail"
                className="w-12 h-12 object-cover rounded-md border" />
            )}
            <div>
              <p className="text-sm font-semibold">{stream.title}</p>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stream.hostAvatarUrl && (
                  <img
                    src={stream.hostAvatarUrl}
                    alt={stream.host}
                    className="h-4 w-4 rounded-full"
                  />
                )}
                <User className="h-3 w-3" /> <span>{stream.host}</span>
              </div>
            </div>
          </div>
          {stream.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 my-2">{stream.description}</p>
          )}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Starting in {timeLeft} ({new Date(stream.scheduledDate).toLocaleString()})</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => {
                if (stream.studioUrl) {
                  window.location.href = stream.studioUrl
                } else {
                  onGoToStudio(stream)
                }
              }}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white flex-1"
              size="sm"
            >
              Go to Studio
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={reminded}
              onClick={handleRemindMe}
            >
              {reminded ? "Reminder Set" : "Remind Me"}
            </Button>
            {stream.link && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigator.share ?
                  navigator.share({ title: stream.title, url: stream.link }) :
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(stream.link)}&text=${encodeURIComponent(stream.title)}`, "_blank")
                }
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
  }
