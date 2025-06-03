"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Mic } from "lucide-react"

export function SettingsAudio() {
  const [settings, setSettings] = useState({
    audioQuality: "high",
    enableNoiseSuppression: true,
    enableEchoCancellation: true,
    autoMuteNewHosts: false,
    voiceProcessing: true,
    autoGainControl: true,
    inputVolume: 80,
    outputVolume: 100,
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
          <Mic className="h-5 w-5" />
          <h3 className="text-lg font-medium">Audio Settings</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioQuality">Audio Quality</Label>
          <Select value={settings.audioQuality} onValueChange={(value) => handleSettingChange("audioQuality", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (64 kbps)</SelectItem>
              <SelectItem value="medium">Medium (128 kbps)</SelectItem>
              <SelectItem value="high">High (256 kbps)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="noiseSuppression">Noise suppression</Label>
              <p className="text-sm text-muted-foreground">Reduce background noise</p>
            </div>
            <Switch
              id="noiseSuppression"
              checked={settings.enableNoiseSuppression}
              onCheckedChange={(checked) => handleSettingChange("enableNoiseSuppression", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="echoCancellation">Echo cancellation</Label>
              <p className="text-sm text-muted-foreground">Prevent audio feedback</p>
            </div>
            <Switch
              id="echoCancellation"
              checked={settings.enableEchoCancellation}
              onCheckedChange={(checked) => handleSettingChange("enableEchoCancellation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoMute">Auto-mute new hosts</Label>
              <p className="text-sm text-muted-foreground">Mute hosts when they join</p>
            </div>
            <Switch
              id="autoMute"
              checked={settings.autoMuteNewHosts}
              onCheckedChange={(checked) => handleSettingChange("autoMuteNewHosts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voiceProcessing">Voice processing</Label>
              <p className="text-sm text-muted-foreground">Enhance voice clarity</p>
            </div>
            <Switch
              id="voiceProcessing"
              checked={settings.voiceProcessing}
              onCheckedChange={(checked) => handleSettingChange("voiceProcessing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoGainControl">Auto gain control</Label>
              <p className="text-sm text-muted-foreground">Automatically adjust microphone level</p>
            </div>
            <Switch
              id="autoGainControl"
              checked={settings.autoGainControl}
              onCheckedChange={(checked) => handleSettingChange("autoGainControl", checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="inputVolume">Input Volume</Label>
              <span className="text-sm">{settings.inputVolume}%</span>
            </div>
            <Slider
              id="inputVolume"
              min={0}
              max={100}
              step={1}
              value={[settings.inputVolume]}
              onValueChange={(value) => handleSettingChange("inputVolume", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="outputVolume">Output Volume</Label>
              <span className="text-sm">{settings.outputVolume}%</span>
            </div>
            <Slider
              id="outputVolume"
              min={0}
              max={100}
              step={1}
              value={[settings.outputVolume]}
              onValueChange={(value) => handleSettingChange("outputVolume", value[0])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
