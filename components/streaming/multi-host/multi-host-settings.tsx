import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsGeneral } from "./settings-general"
import { SettingsVideo } from "./settings-video"
import { SettingsAudio } from "./settings-audio"
import { SettingsAdvanced } from "./settings-advanced"

// Import the new components
import { TurnServerConfig } from "./turn-server-config"
import { TurnServerDiagnostics } from "./turn-server-diagnostics"
import { WebRTCDiagnostics } from "./webrtc-diagnostics"

export function MultiHostSettings() {
  return (
    <Tabs defaultValue="general" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <SettingsGeneral />
      </TabsContent>
      <TabsContent value="video">
        <SettingsVideo />
      </TabsContent>
      <TabsContent value="audio">
        <SettingsAudio />
      </TabsContent>
      {/* Add the TURN server components to the settings tabs */}
      {/* Find the TabsContent with value="advanced" and add our components there */}
      <TabsContent value="advanced" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <TurnServerConfig />
          <TurnServerDiagnostics />
        </div>
        <WebRTCDiagnostics />
        <SettingsAdvanced />
        {/* Keep existing content */}
      </TabsContent>
    </Tabs>
  )
}
