"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Shield, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsAdvanced() {
  const [settings, setSettings] = useState({
    // Security Settings
    requireApproval: true,
    allowAnonymousGuests: false,
    sessionTimeout: 240, // minutes
    invitationExpiry: 24, // hours

    // Advanced WebRTC Settings
    iceTransportPolicy: "all",
    bundlePolicy: "balanced",
    rtcpMuxPolicy: "require",
    enableDtlsSrtp: true,
    enableIpv6: false,

    // Logging and Diagnostics
    enableDetailedLogs: false,
    enablePerformanceMonitoring: true,
    enableCrashReporting: true,

    // Experimental Features
    enableExperimentalFeatures: false,
    enableBetaCodecs: false,
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
          <h3 className="text-lg font-medium">Advanced Settings</h3>
        </div>

        {/* Security Settings */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Settings
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireApproval">Require approval</Label>
                <p className="text-sm text-muted-foreground">Manually approve host invitations</p>
              </div>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleSettingChange("requireApproval", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymousGuests">Allow anonymous guests</Label>
                <p className="text-sm text-muted-foreground">Let users join without registration</p>
              </div>
              <Switch
                id="anonymousGuests"
                checked={settings.allowAnonymousGuests}
                onCheckedChange={(checked) => handleSettingChange("allowAnonymousGuests", checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invitationExpiry">Invitation Expiry (hours)</Label>
              <Input
                id="invitationExpiry"
                type="number"
                value={settings.invitationExpiry}
                onChange={(e) => handleSettingChange("invitationExpiry", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced WebRTC Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">WebRTC Configuration</h4>

          <div className="space-y-2">
            <Label htmlFor="iceTransportPolicy">ICE Transport Policy</Label>
            <Select
              value={settings.iceTransportPolicy}
              onValueChange={(value) => handleSettingChange("iceTransportPolicy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All (Default)</SelectItem>
                <SelectItem value="relay">Relay Only (TURN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundlePolicy">Bundle Policy</Label>
            <Select value={settings.bundlePolicy} onValueChange={(value) => handleSettingChange("bundlePolicy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced (Default)</SelectItem>
                <SelectItem value="max-bundle">Max Bundle</SelectItem>
                <SelectItem value="max-compat">Max Compatibility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableDtlsSrtp">Enable DTLS-SRTP</Label>
              <p className="text-sm text-muted-foreground">Secure media encryption</p>
            </div>
            <Switch
              id="enableDtlsSrtp"
              checked={settings.enableDtlsSrtp}
              onCheckedChange={(checked) => handleSettingChange("enableDtlsSrtp", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableIpv6">Enable IPv6</Label>
              <p className="text-sm text-muted-foreground">Use IPv6 when available</p>
            </div>
            <Switch
              id="enableIpv6"
              checked={settings.enableIpv6}
              onCheckedChange={(checked) => handleSettingChange("enableIpv6", checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Logging and Diagnostics */}
        <div className="space-y-4">
          <h4 className="font-medium">Logging and Diagnostics</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableDetailedLogs">Detailed logs</Label>
              <p className="text-sm text-muted-foreground">Enable verbose logging</p>
            </div>
            <Switch
              id="enableDetailedLogs"
              checked={settings.enableDetailedLogs}
              onCheckedChange={(checked) => handleSettingChange("enableDetailedLogs", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enablePerformanceMonitoring">Performance monitoring</Label>
              <p className="text-sm text-muted-foreground">Track connection quality metrics</p>
            </div>
            <Switch
              id="enablePerformanceMonitoring"
              checked={settings.enablePerformanceMonitoring}
              onCheckedChange={(checked) => handleSettingChange("enablePerformanceMonitoring", checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Experimental Features */}
        <div className="space-y-4">
          <h4 className="font-medium">Experimental Features</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableExperimentalFeatures">Experimental features</Label>
              <p className="text-sm text-muted-foreground">Enable unstable new features</p>
            </div>
            <Switch
              id="enableExperimentalFeatures"
              checked={settings.enableExperimentalFeatures}
              onCheckedChange={(checked) => handleSettingChange("enableExperimentalFeatures", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableBetaCodecs">Beta codecs</Label>
              <p className="text-sm text-muted-foreground">Enable experimental video codecs</p>
            </div>
            <Switch
              id="enableBetaCodecs"
              checked={settings.enableBetaCodecs}
              onCheckedChange={(checked) => handleSettingChange("enableBetaCodecs", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
