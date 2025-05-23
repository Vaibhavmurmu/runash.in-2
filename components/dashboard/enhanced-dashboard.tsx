"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  Users,
  Video,
  TrendingUp,
  Eye,
  Share2,
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Award,
  Target,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={`overflow-hidden border-border/40 bg-card/50 backdrop-blur ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <p className="mt-1 text-xs flex items-center gap-1">
            <span className={`inline-flex items-center ${trend.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{description}</span>
          </p>
        )}
        {!trend && description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

function StreamCard({ stream }: { stream: any }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-video bg-gradient-to-br from-orange-500/20 to-amber-400/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur hover:bg-black/40"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
          </Button>
        </div>
        {stream.status === "live" && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
            LIVE
          </Badge>
        )}
        <div className="absolute top-2 right-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur hover:bg-black/40">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Separator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-red-600" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Stream</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this stream? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{stream.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {stream.viewers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {stream.duration}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{stream.date}</span>
            <Badge variant={stream.status === "live" ? "destructive" : "secondary"} className="text-xs">
              {stream.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ activity }: { activity: any }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xs">
              {activity.user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{activity.user.name}</h4>
              <p className="text-sm text-muted-foreground">Active viewer since March 2023</p>
              <div className="flex items-center pt-2">
                <Calendar className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">Joined March 2023</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <span className="font-medium">{activity.user.name}</span>{" "}
          <span className="text-muted-foreground">{activity.action}</span>{" "}
          {activity.target && <span className="font-medium">{activity.target}</span>}
        </p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
      <Badge
        variant="outline"
        className={`text-xs ${activity.type === "comment" && "border-blue-200 text-blue-700"} ${
          activity.type === "follow" && "border-green-200 text-green-700"
        } ${activity.type === "subscription" && "border-purple-200 text-purple-700"} ${
          activity.type === "donation" && "border-amber-200 text-amber-700"
        }`}
      >
        {activity.type}
      </Badge>
    </div>
  )
}

export function EnhancedDashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const stats = [
    {
      title: "Total Views",
      value: "24.5K",
      icon: <Eye />,
      description: "from last month",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Followers",
      value: "2,345",
      icon: <Users />,
      description: "from last month",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Live Streams",
      value: "45",
      icon: <Video />,
      description: "this month",
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Revenue",
      value: "$1,234",
      icon: <DollarSign />,
      description: "this month",
      trend: { value: 15, isPositive: true },
    },
  ]

  const recentStreams = [
    {
      id: "1",
      title: "Getting Started with RunAsh AI - Complete Tutorial",
      date: "Today",
      duration: "2h 15m",
      viewers: 1245,
      status: "live",
    },
    {
      id: "2",
      title: "AI-Powered Content Creation Workshop",
      date: "Yesterday",
      duration: "1h 30m",
      viewers: 876,
      status: "ended",
    },
    {
      id: "3",
      title: "Advanced Streaming Techniques & Best Practices",
      date: "Apr 20, 2023",
      duration: "2h 45m",
      viewers: 1532,
      status: "ended",
    },
  ]

  const activities = [
    {
      id: "1",
      user: { name: "Alex Johnson", avatar: "/placeholder.svg" },
      action: "commented on your stream",
      target: "Getting Started with RunAsh AI",
      time: "5 minutes ago",
      type: "comment",
    },
    {
      id: "2",
      user: { name: "Sarah Miller" },
      action: "followed you",
      target: "",
      time: "15 minutes ago",
      type: "follow",
    },
    {
      id: "3",
      user: { name: "David Chen" },
      action: "subscribed to your channel",
      target: "",
      time: "1 hour ago",
      type: "subscription",
    },
    {
      id: "4",
      user: { name: "Emma Wilson" },
      action: "donated $25 to your stream",
      target: "AI-Powered Content Creation",
      time: "3 hours ago",
      type: "donation",
    },
  ]

  const achievements = [
    { title: "First Stream", description: "Completed your first live stream", icon: <Video />, unlocked: true },
    { title: "100 Followers", description: "Reached 100 followers", icon: <Users />, unlocked: true },
    { title: "Viral Content", description: "Stream reached 10K views", icon: <TrendingUp />, unlocked: true },
    { title: "Super Streamer", description: "Stream for 100 hours total", icon: <Award />, unlocked: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your streams.</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Activity className="mr-2 h-4 w-4" />
                Quick Actions
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
                <SheetDescription>Quickly access common streaming actions and tools.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                  <Video className="mr-2 h-4 w-4" />
                  Start New Stream
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Stream
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Collaborators
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                <Video className="mr-2 h-4 w-4" />
                Go Live
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start Live Stream</DialogTitle>
                <DialogDescription>Configure your stream settings and go live in seconds.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stream Title</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter your stream title..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Gaming</option>
                    <option>Education</option>
                    <option>Technology</option>
                    <option>Entertainment</option>
                  </select>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                  onClick={() => {
                    toast({
                      title: "Stream Started!",
                      description: "Your live stream is now active.",
                    })
                  }}
                >
                  Start Streaming
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
              />
            ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Streams */}
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Recent Streams
                </CardTitle>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>All Streams</DrawerTitle>
                      <DrawerDescription>View and manage all your streams in one place.</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {recentStreams.map((stream) => (
                            <CarouselItem key={stream.id} className="md:basis-1/2 lg:basis-1/3">
                              <StreamCard stream={stream} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recentStreams.slice(0, 4).map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements & Goals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your streaming milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${achievement.unlocked ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-400 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Goals
            </CardTitle>
            <CardDescription>Track your progress towards monthly targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Streaming Hours</span>
                  <span className="text-muted-foreground">45/60 hours</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>New Followers</span>
                  <span className="text-muted-foreground">234/300</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Revenue Goal</span>
                  <span className="text-muted-foreground">$1,234/$2,000</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
