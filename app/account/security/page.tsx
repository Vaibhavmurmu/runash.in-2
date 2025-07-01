"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Smartphone, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react"

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro",
      location: "San Francisco, CA",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 15 Pro",
      location: "San Francisco, CA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Windows",
      location: "New York, NY",
      ip: "203.0.113.1",
      lastActive: "3 days ago",
      current: false,
    },
  ]

  const loginHistory = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30",
      location: "San Francisco, CA",
      device: "MacBook Pro",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-01-15 09:15",
      location: "San Francisco, CA",
      device: "iPhone 15 Pro",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2024-01-14 22:45",
      location: "Unknown Location",
      device: "Chrome on Linux",
      status: "failed",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and privacy settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Authenticator App</div>
                  <div className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
              </div>
              {twoFactorEnabled && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Two-factor authentication is active and protecting your account
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  {twoFactorEnabled ? "Reconfigure" : "Setup"}
                </Button>
                {twoFactorEnabled && (
                  <Button variant="outline" size="sm">
                    View Recovery Codes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Preferences
              </CardTitle>
              <CardDescription>Configure your security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Login Notifications</div>
                  <div className="text-sm text-muted-foreground">Get notified when someone logs into your account</div>
                </div>
                <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically log out after 30 minutes of inactivity
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Suspicious Activity Alerts</div>
                  <div className="text-sm text-muted-foreground">Get alerts for unusual account activity</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage devices that are currently logged into your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.location} • {session.ip}
                      </div>
                      <div className="text-xs text-muted-foreground">{session.lastActive}</div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                Revoke All Other Sessions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Recent Login Activity
              </CardTitle>
              <CardDescription>Review recent login attempts to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loginHistory.map((login) => (
                <div key={login.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        login.status === "success"
                          ? "bg-gradient-to-br from-green-100 to-green-200"
                          : "bg-gradient-to-br from-red-100 to-red-200"
                      }`}
                    >
                      {login.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{login.device}</div>
                      <div className="text-sm text-muted-foreground">
                        {login.location} • {login.timestamp}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={login.status === "success" ? "secondary" : "destructive"}
                    className={login.status === "success" ? "bg-green-100 text-green-700" : ""}
                  >
                    {login.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
