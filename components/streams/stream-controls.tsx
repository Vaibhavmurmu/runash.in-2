"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export function StreamControls() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stream Quality</CardTitle>
          <CardDescription>Configure video and audio settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Video Quality</Label>
            <Select defaultValue="1080p">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4k">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bitrate: 2500 kbps</Label>
            <Slider defaultValue={[2500]} max={5000} min={500} step={100} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Auto-adjust quality</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stream Settings</CardTitle>
          <CardDescription>General streaming preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stream Key</Label>
            <Input type="password" defaultValue="sk_live_123456789" />
          </div>

          <div className="space-y-2">
            <Label>RTMP URL</Label>
            <Input defaultValue="rtmp://live.runash.ai/live" readOnly />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable chat</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Record stream</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
