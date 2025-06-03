"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Camera } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SettingsVideo() {
  const [settings, setSettings] = useState({
    videoQuality: "1080p",
    defaultLayout: "grid",
    showHostNames: true,
    showHostRoles: true,
    allowLayoutChanges: true,
    enableVirtualBackground: true,
    enableBeautyFilters: false,
    enableLowLightEnhancement: true,
    autoFraming: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5" />
          <h3 className="text-lg font-medium">Video Settings</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoQuality">Video Quality</Label>
          <Select value={settings.videoQuality} onValueChange={(value) => handleSettingChange("videoQuality", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Default Layout</Label>
          <RadioGroup
            value={settings.defaultLayout}
            onValueChange={(value) => handleSettingChange("defaultLayout", value)}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grid" id="grid" />
              <Label htmlFor="grid">Grid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spotlight" id="spotlight" />
              <Label htmlFor="spotlight">Spotlight</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sidebar" id="sidebar" />
              <Label htmlFor="sidebar">Sidebar</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showHostNames">Show host names</Label>
              <p className="text-sm text-muted-foreground">Display names on video feeds</p>
            </div>
            <Switch
              id="showHostNames"
              checked={settings.showHostNames}
              onCheckedChange={(checked) => handleSettingChange("showHostNames", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showHostRoles">Show host roles</Label>
              <p className="text-sm text-muted-foreground">Display roles alongside names</p>
            </div>
            <Switch
              id="showHostRoles"
              checked={settings.showHostRoles}
              onCheckedChange={(checked) => handleSettingChange("showHostRoles", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowLayoutChanges">Allow layout changes</Label>
              <p className="text-sm text-muted-foreground">Let hosts change the layout during stream</p>
            </div>
            <Switch
              id="allowLayoutChanges"
              checked={settings.allowLayoutChanges}
              onCheckedChange={(checked) => handleSettingChange("allowLayoutChanges", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableVirtualBackground">Virtual backgrounds</Label>
              <p className="text-sm text-muted-foreground">Enable virtual background support</p>
            </div>
            <Switch
              id="enableVirtualBackground"
              checked={settings.enableVirtualBackground}
              onCheckedChange={(checked) => handleSettingChange("enableVirtualBackground", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableBeautyFilters">Beauty filters</Label>
              <p className="text-sm text-muted-foreground">Enable beauty enhancement filters</p>
            </div>
            <Switch
              id="enableBeautyFilters"
              checked={settings.enableBeautyFilters}
              onCheckedChange={(checked) => handleSettingChange("enableBeautyFilters", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
