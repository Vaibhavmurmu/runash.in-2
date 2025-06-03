"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Tag, MapPin, Verified, Bell, Share2 } from "lucide-react"
import type { LiveStream } from "@/types/live-shopping"

interface LiveStreamInfoProps {
  stream: LiveStream
}

export default function LiveStreamInfo({ stream }: LiveStreamInfoProps) {
  const streamDuration = Math.floor((Date.now() - stream.startTime.getTime()) / (1000 * 60))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={stream.hostAvatar || "/placeholder.svg"} />
              <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold">{stream.title}</h2>
                <Verified className="h-5 w-5 text-blue-500" />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">{stream.hostName}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{stream.viewerCount.toLocaleString()} watching</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{streamDuration} min</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{stream.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stream Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Started {stream.startTime.toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Tag className="h-4 w-4 text-gray-500" />
            <span>{stream.category}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Peak: {stream.maxViewers.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>Live from Studio</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {stream.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Stream Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stream.totalSales}</div>
            <div className="text-xs text-gray-600">Products Sold</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${stream.totalRevenue.toFixed(0)}</div>
            <div className="text-xs text-gray-600">Revenue</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stream.featuredProducts.length}</div>
            <div className="text-xs text-gray-600">Featured Items</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
