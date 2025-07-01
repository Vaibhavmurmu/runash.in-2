"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Palette, Globe, Clock, Monitor, Moon, Sun, Languages, Accessibility, Zap, Eye, Volume2 } from "lucide-react"

export default function PreferencesPage() {
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("America/Los_Angeles")
  const [autoSave, setAutoSave] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  const languages = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "ja", label: "日本語", flag: "🇯🇵" },
    { value: "ko", label: "한국어", flag: "🇰🇷" },
  ]

  const timezones = [
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Preferences</h1>
          <p className="text-muted-foreground">Customize your RunAsh experience</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                        theme === themeOption.value
                          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <themeOption.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{themeOption.label}</span>
                      {theme === themeOption.value && (
                        <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs">
                          Active
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Compact Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Reduce spacing and padding for a more compact interface
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Show Sidebar Labels</div>
                  <div className="text-sm text-muted-foreground">Always show labels in the sidebar navigation</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Set your language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          {lang.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">24-hour Time Format</div>
                  <div className="text-sm text-muted-foreground">Display time in 24-hour format instead of 12-hour</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
              <CardDescription>Configure accessibility and usability options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">Minimize animations and transitions</div>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">High Contrast</div>
                  <div className="text-sm text-muted-foreground">Increase contrast for better visibility</div>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Large Text</div>
                  <div className="text-sm text-muted-foreground">Increase font size throughout the interface</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Screen Reader Support</div>
                  <div className="text-sm text-muted-foreground">Enhanced support for screen readers</div>
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
                <Zap className="h-5 w-5" />
                Performance
              </CardTitle>
              <CardDescription>Optimize performance and data usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-save Changes</div>
                  <div className="text-sm text-muted-foreground">Automatically save changes as you make them</div>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Preload Content</div>
                  <div className="text-sm text-muted-foreground">Preload content for faster navigation</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Background Sync</div>
                  <div className="text-sm text-muted-foreground">Sync data in the background when possible</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Data Usage</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Reduce data usage</SelectItem>
                    <SelectItem value="balanced">Balanced - Default settings</SelectItem>
                    <SelectItem value="high">High - Best quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Analytics Tracking</div>
                  <div className="text-sm text-muted-foreground">Help improve RunAsh by sharing usage analytics</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Crash Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically send crash reports to help fix issues
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Personalized Recommendations</div>
                  <div className="text-sm text-muted-foreground">
                    Use your activity to provide personalized suggestions
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio & Video
              </CardTitle>
              <CardDescription>Configure default audio and video settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Video Quality</Label>
                <Select defaultValue="1080p">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="1440p">1440p 2K</SelectItem>
                    <SelectItem value="2160p">2160p 4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audio Quality</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - 64 kbps</SelectItem>
                    <SelectItem value="medium">Medium - 128 kbps</SelectItem>
                    <SelectItem value="high">High - 320 kbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-adjust Quality</div>
                  <div className="text-sm text-muted-foreground">Automatically adjust quality based on connection</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Hardware Acceleration</div>
                  <div className="text-sm text-muted-foreground">Use hardware acceleration when available</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Monitor className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Languages className="mr-2 h-4 w-4" />
                Import Settings
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Zap className="mr-2 h-4 w-4" />
                Export Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
