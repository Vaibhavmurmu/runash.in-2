"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Volume2 } from "lucide-react"
import type { TextToSpeechService } from "@/services/text-to-speech-service"

interface VoiceSettings {
  rate: number
  pitch: number
  volume: number
  autoSpeak: boolean
  voice: SpeechSynthesisVoice | null
}

interface VoiceSettingsDialogProps {
  settings: VoiceSettings
  onSave: (settings: VoiceSettings) => void
  onClose: () => void
  ttsService: TextToSpeechService | null
}

export default function VoiceSettingsDialog({ settings, onSave, onClose, ttsService }: VoiceSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(settings)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (ttsService) {
      const availableVoices = ttsService.getVoices()
      setVoices(availableVoices)

      // If no voice is selected, use the first English voice
      if (!localSettings.voice && availableVoices.length > 0) {
        const englishVoice = availableVoices.find((voice) => voice.lang.startsWith("en")) || availableVoices[0]
        setLocalSettings((prev) => ({ ...prev, voice: englishVoice }))
      }
    }
  }, [ttsService, localSettings.voice])

  const handleTestVoice = () => {
    if (ttsService) {
      ttsService.speak("This is a test of your voice settings for RunAsh Chat AI assistant.", localSettings)
    }
  }

  const handleSave = () => {
    onSave(localSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label>Voice</Label>
            <Select
              value={localSettings.voice?.name || ""}
              onValueChange={(value) => {
                const selectedVoice = voices.find((voice) => voice.name === value)
                setLocalSettings((prev) => ({ ...prev, voice: selectedVoice || null }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speech Rate */}
          <div className="space-y-2">
            <Label>Speech Rate: {localSettings.rate.toFixed(1)}x</Label>
            <Slider
              value={[localSettings.rate]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, rate: value }))}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <Label>Pitch: {localSettings.pitch.toFixed(1)}</Label>
            <Slider
              value={[localSettings.pitch]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, pitch: value }))}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label>Volume: {Math.round(localSettings.volume * 100)}%</Label>
            <Slider
              value={[localSettings.volume]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, volume: value }))}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Auto Speak */}
          <div className="flex items-center justify-between">
            <Label>Auto-speak AI responses</Label>
            <Switch
              checked={localSettings.autoSpeak}
              onCheckedChange={(checked) => setLocalSettings((prev) => ({ ...prev, autoSpeak: checked }))}
            />
          </div>

          {/* Test Voice */}
          <Button variant="outline" onClick={handleTestVoice} className="w-full" disabled={!ttsService?.isSupported()}>
            <Volume2 className="h-4 w-4 mr-2" />
            Test Voice
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}
