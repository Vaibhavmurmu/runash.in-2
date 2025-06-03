"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Bell, Users, Play, Star } from "lucide-react"
import type { StreamSchedule } from "@/types/live-shopping"

interface UpcomingStreamsProps {
  limit?: number
}

export default function UpcomingStreams({ limit = 5 }: UpcomingStreamsProps) {
  const [upcomingStreams, setUpcomingStreams] = useState<StreamSchedule[]>([])
  const [loading, setLoading] = useState(true)

  // Mock upcoming streams data
  const mockStreams: StreamSchedule[] = [
    {
      id: "upcoming-1",
      title: "Seasonal Vegetable Harvest Special",
      description: "Discover the freshest seasonal vegetables directly from our organic farms",
      hostId: "host-2",
      hostName: "Mike Rodriguez",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      category: "Vegetables",
      featuredProducts: ["5", "6", "7"],
      isRecurring: false,
      notificationsSent: false,
      registeredViewers: [],
    },
    {
      id: "upcoming-2",
      title: "Superfood Sunday - Boost Your Health",
      description: "Weekly showcase of nutrient-dense superfoods and their benefits",
      hostId: "host-3",
      hostName: "Dr. Lisa Chen",
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 45,
      category: "Superfoods",
      featuredProducts: ["8", "9", "10"],
      isRecurring: true,
      recurrencePattern: "weekly",
      notificationsSent: true,
      registeredViewers: ["user1", "user2", "user3"],
    },
    {
      id: "upcoming-3",
      title: "Farm-to-Table Cooking Demo",
      description: "Learn to cook delicious meals with fresh organic ingredients",
      hostId: "host-1",
      hostName: "Sarah Chen",
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 90,
      category: "Cooking",
      featuredProducts: ["11", "12", "13"],
      isRecurring: false,
      notificationsSent: false,
      registeredViewers: [],
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setUpcomingStreams(mockStreams.slice(0, limit))
      setLoading(false)
    }, 500)
  }, [limit])

  const formatTimeUntil = (scheduledTime: Date) => {
    const now = new Date()
    const diff = scheduledTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? "s" : ""}`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const handleSetReminder = (streamId: string) => {
    // In a real app, this would set a notification reminder
    console.log(`Reminder set for stream: ${streamId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (upcomingStreams.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Upcoming Streams</h3>
        <p className="text-gray-600 dark:text-gray-400">Check back later for new scheduled streams</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {upcomingStreams.map((stream) => (
        <Card key={stream.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm leading-tight mb-1">{stream.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{stream.description}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    onClick={() => handleSetReminder(stream.id)}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Remind
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>In {formatTimeUntil(stream.scheduledTime)}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{stream.registeredViewers.length} registered</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Play className="h-3 w-3" />
                    <span>{stream.duration}min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {stream.category}
                    </Badge>
                    {stream.isRecurring && (
                      <Badge variant="outline" className="text-xs">
                        <Star className="h-2 w-2 mr-1" />
                        Weekly
                      </Badge>
                    )}
                  </div>

                  <span className="text-xs text-gray-500">by {stream.hostName}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
