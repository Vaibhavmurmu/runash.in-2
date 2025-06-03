"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Clock, Users, Plus, Edit, Trash2, Send, Copy } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface ScheduledSession {
  id: string
  title: string
  description: string
  date: Date
  duration: number
  hosts: string[]
  status: "scheduled" | "confirmed" | "cancelled"
  invitesSent: boolean
}

export function MultiHostScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([
    {
      id: "1",
      title: "Weekly Product Review",
      description: "Review new products with the team",
      date: new Date(2024, 1, 15, 14, 0),
      duration: 60,
      hosts: ["john@example.com", "sarah@example.com"],
      status: "confirmed",
      invitesSent: true,
    },
    {
      id: "2",
      title: "Q&A Session",
      description: "Answer community questions",
      date: new Date(2024, 1, 18, 16, 0),
      duration: 45,
      hosts: ["mike@example.com"],
      status: "scheduled",
      invitesSent: false,
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    hosts: [] as string[],
    hostEmail: "",
  })

  const handleScheduleSession = () => {
    if (!formData.title || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const sessionDate = new Date(`${formData.date}T${formData.time}`)
    const newSession: ScheduledSession = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: sessionDate,
      duration: formData.duration,
      hosts: formData.hosts,
      status: "scheduled",
      invitesSent: false,
    }

    setScheduledSessions([...scheduledSessions, newSession])
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      hosts: [],
      hostEmail: "",
    })
    setIsScheduleDialogOpen(false)

    toast({
      title: "Session Scheduled",
      description: "Your multi-host session has been scheduled successfully.",
    })
  }

  const handleAddHost = () => {
    if (formData.hostEmail && !formData.hosts.includes(formData.hostEmail)) {
      setFormData({
        ...formData,
        hosts: [...formData.hosts, formData.hostEmail],
        hostEmail: "",
      })
    }
  }

  const handleRemoveHost = (email: string) => {
    setFormData({
      ...formData,
      hosts: formData.hosts.filter((h) => h !== email),
    })
  }

  const handleSendInvites = (sessionId: string) => {
    setScheduledSessions((sessions) =>
      sessions.map((session) =>
        session.id === sessionId ? { ...session, invitesSent: true, status: "confirmed" as const } : session,
      ),
    )

    toast({
      title: "Invites Sent",
      description: "Host invitations have been sent successfully.",
    })
  }

  const handleCopySessionLink = (sessionId: string) => {
    const link = `${window.location.origin}/multi-host/join/${sessionId}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link Copied",
      description: "Session link has been copied to your clipboard.",
    })
  }

  const getStatusBadge = (status: ScheduledSession["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="text-amber-700 border-amber-200">
            Scheduled
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-700 border-green-200">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Host Scheduler</h2>
          <p className="text-muted-foreground">Schedule collaborative streaming sessions</p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Multi-Host Session</DialogTitle>
              <DialogDescription>Plan a collaborative streaming session with multiple hosts.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  placeholder="Weekly Product Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this session will cover..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Co-Hosts</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter host email"
                    value={formData.hostEmail}
                    onChange={(e) => setFormData({ ...formData, hostEmail: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && handleAddHost()}
                  />
                  <Button type="button" variant="outline" onClick={handleAddHost}>
                    Add
                  </Button>
                </div>
                {formData.hosts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hosts.map((host) => (
                      <Badge key={host} variant="secondary" className="flex items-center gap-1">
                        {host}
                        <button onClick={() => handleRemoveHost(host)} className="ml-1 hover:text-red-500">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleSession}>Schedule Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Scheduled Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scheduled Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Sessions Scheduled</h3>
                <p className="text-muted-foreground mb-4">Schedule your first multi-host session to get started.</p>
                <Button
                  onClick={() => setIsScheduleDialogOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {format(session.date, "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(session.date, "HH:mm")} ({session.duration}m)
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.hosts.length + 1} hosts
                      </div>
                    </div>

                    {session.hosts.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Co-Hosts:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.hosts.map((host) => (
                            <Badge key={host} variant="outline" className="text-xs">
                              {host}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      {!session.invitesSent && (
                        <Button size="sm" variant="outline" onClick={() => handleSendInvites(session.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          Send Invites
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleCopySessionLink(session.id)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
