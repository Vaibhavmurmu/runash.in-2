"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  TrendingUp,
  DollarSign,
  Shield,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: {
      streamStart: true,
      newFollower: true,
      donations: true,
      weeklyReport: true,
      security: true,
      marketing: false,
    },
    push: {
      streamStart: true,
      newFollower: false,
      donations: true,
      chatMentions: true,
      security: true,
    },
    inApp: {
      streamStart: true,
      newFollower: true,
      donations: true,
      chatMentions: true,
      moderatorActions: true,
    },
  })

  const updateNotification = (type: keyof typeof notifications, key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }))
  }

  const notificationCategories = [
    {
      title: "Streaming",
      icon: Bell,
      description: "Notifications about your live streams and content",
      settings: [
        {
          key: "streamStart",
          label: "Stream Started",
          description: "When your scheduled stream goes live",
          email: notifications.email.streamStart,
          push: notifications.push.streamStart,
          inApp: notifications.inApp.streamStart,
        },
      ],
    },
    {
      title: "Community",
      icon: Users,
      description: "Updates about your followers and community",
      settings: [
        {
          key: "newFollower",
          label: "New Followers",
          description: "When someone follows your channel",
          email: notifications.email.newFollower,
          push: notifications.push.newFollower,
          inApp: notifications.inApp.newFollower,
        },
        {
          key: "chatMentions",
          label: "Chat Mentions",
          description: "When someone mentions you in chat",
          email: false,
          push: notifications.push.chatMentions,
          inApp: notifications.inApp.chatMentions,
        },
      ],
    },
    {
      title: "Revenue",
      icon: DollarSign,
      description: "Notifications about donations and earnings",
      settings: [
        {
          key: "donations",
          label: "Donations & Tips",
          description: "When you receive donations or tips",
          email: notifications.email.donations,
          push: notifications.push.donations,
          inApp: notifications.inApp.donations,
        },
      ],
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      description: "Reports and insights about your performance",
      settings: [
        {
          key: "weeklyReport",
          label: "Weekly Reports",
          description: "Weekly performance and analytics summary",
          email: notifications.email.weeklyReport,
          push: false,
          inApp: false,
        },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      description: "Important security and account alerts",
      settings: [
        {
          key: "security",
          label: "Security Alerts",
          description: "Login attempts and security notifications",
          email: notifications.email.security,
          push: notifications.push.security,
          inApp: true,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Manage how and when you receive notifications</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications for different types of activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                  <div>Category</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Push
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    In-App
                  </div>
                </div>
                <Separator />

                {notificationCategories.map((category) => (
                  <div key={category.title} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                        <category.icon className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {category.settings.map((setting) => (
                      <div key={setting.key} className="grid grid-cols-4 gap-4 items-center py-2">
                        <div>
                          <div className="font-medium">{setting.label}</div>
                          <div className="text-sm text-muted-foreground">{setting.description}</div>
                        </div>
                        <div className="flex justify-center">
                          {setting.email !== false && (
                            <Switch
                              checked={setting.email}
                              onCheckedChange={(checked) => updateNotification("email", setting.key, checked)}
                            />
                          )}
                        </div>
                        <div className="flex justify-center">
                          {setting.push !== false && (
                            <Switch
                              checked={setting.push}
                              onCheckedChange={(checked) => updateNotification("push", setting.key, checked)}
                            />
                          )}
                        </div>
                        <div className="flex justify-center">
                          {setting.inApp !== false && (
                            <Switch
                              checked={setting.inApp}
                              onCheckedChange={(checked) => updateNotification("inApp", setting.key, checked)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Communications</CardTitle>
              <CardDescription>Control marketing emails and promotional content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Product Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about new features and platform updates
                  </div>
                </div>
                <Switch
                  checked={notifications.email.marketing}
                  onCheckedChange={(checked) => updateNotification("email", "marketing", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Tips & Best Practices</div>
                  <div className="text-sm text-muted-foreground">
                    Receive tips to improve your streaming and grow your audience
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Community Events</div>
                  <div className="text-sm text-muted-foreground">
                    Get invited to community events and creator meetups
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Sound Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Notification Sounds</div>
                  <div className="text-sm text-muted-foreground">Play sounds for notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Chat Sounds</div>
                  <div className="text-sm text-muted-foreground">Play sounds for chat messages</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Bell className="mr-2 h-4 w-4" />
                Test Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <VolumeX className="mr-2 h-4 w-4" />
                Mute All (1 hour)
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-1 rounded bg-green-100">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">New follower</div>
                  <div className="text-muted-foreground text-xs">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-1 rounded bg-blue-100">
                  <DollarSign className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">$5 donation</div>
                  <div className="text-muted-foreground text-xs">1 hour ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-1 rounded bg-orange-100">
                  <Bell className="h-3 w-3 text-orange-600" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">Stream started</div>
                  <div className="text-muted-foreground text-xs">3 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
