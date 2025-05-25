"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Video, Calendar, Clock, Users, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export function StreamQuickAccess() {
  const router = useRouter()
  const [streamTitle, setStreamTitle] = useState("")
  const [streamCategory, setStreamCategory] = useState("gaming")

  const handleStartStream = () => {
    toast({
      title: "Stream Started",
      description: `Your stream "${streamTitle}" is now live.`,
    })
    router.push("/stream")
  }

  const recentStreams = [
    {
      title: "Getting Started with RunAsh AI",
      date: "Today",
      viewers: 1245,
      duration: "2h 15m",
    },
    {
      title: "AI-Powered Content Creation",
      date: "Yesterday",
      viewers: 876,
      duration: "1h 30m",
    },
  ]

  const scheduledStreams = [
    {
      title: "Q&A Session: RunAsh Features",
      date: "Tomorrow, 3:00 PM",
      status: "scheduled",
    },
  ]

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Streaming
        </CardTitle>
        <CardDescription>Start a new stream or manage your recent broadcasts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
              <Video className="mr-2 h-4 w-4" />
              Go Live
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Live Stream</DialogTitle>
              <DialogDescription>Configure your stream settings and go live in seconds.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="stream-title">Stream Title</Label>
                <Input
                  id="stream-title"
                  placeholder="Enter your stream title..."
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup value={streamCategory} onValueChange={setStreamCategory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gaming" id="gaming" />
                    <Label htmlFor="gaming">Gaming</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="education" id="education" />
                    <Label htmlFor="education">Education</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technology" id="technology" />
                    <Label htmlFor="technology">Technology</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entertainment" id="entertainment" />
                    <Label htmlFor="entertainment">Entertainment</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                onClick={handleStartStream}
              >
                Start Streaming
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Recent Streams</h3>
          <div className="space-y-2">
            {recentStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium truncate">{stream.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{stream.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stream.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {stream.viewers}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Upcoming Streams</h3>
          <div className="space-y-2">
            {scheduledStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium truncate">{stream.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{stream.date}</span>
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                    >
                      Scheduled
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => router.push("/schedule")}>
          View All Streams
        </Button>
      </CardFooter>
    </Card>
  )
}
