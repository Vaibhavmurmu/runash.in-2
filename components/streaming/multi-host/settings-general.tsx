"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings } from "lucide-react"

export function SettingsGeneral() {
  const [settings, setSettings] = useState({
    maxHosts: 4,
    autoAcceptInvitations: false,
    allowGuestControls: true,
    recordIndividualTracks: true,
    enableHostChat: true,
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
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-medium">General Settings</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxHosts">Maximum Hosts per Session</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="maxHosts"
              min={2}
              max={10}
              step={1}
              value={[settings.maxHosts]}
              onValueChange={(value) => handleSettingChange("maxHosts", value[0])}
              className="flex-1"
            />
            <Badge variant="outline">{settings.maxHosts} hosts</Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoAccept">Auto-accept invitations</Label>
              <p className="text-sm text-muted-foreground">Automatically accept host invitations</p>
            </div>
            <Switch
              id="autoAccept"
              checked={settings.autoAcceptInvitations}
              onCheckedChange={(checked) => handleSettingChange("autoAcceptInvitations", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="guestControls">Allow guest controls</Label>
              <p className="text-sm text-muted-foreground">Let guests control their own audio/video</p>
            </div>
            <Switch
              id="guestControls"
              checked={settings.allowGuestControls}
              onCheckedChange={(checked) => handleSettingChange("allowGuestControls", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recordTracks">Record individual tracks</Label>
              <p className="text-sm text-muted-foreground">Save separate audio tracks for each host</p>
            </div>
            <Switch
              id="recordTracks"
              checked={settings.recordIndividualTracks}
              onCheckedChange={(checked) => handleSettingChange("recordIndividualTracks", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hostChat">Enable host chat</Label>
              <p className="text-sm text-muted-foreground">Private chat between hosts during stream</p>
            </div>
            <Switch
              id="hostChat"
              checked={settings.enableHostChat}
              onCheckedChange={(checked) => handleSettingChange("enableHostChat", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
