"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  RepeatIcon as Record,
  StopCircle,
  Pause,
  Play,
  Settings,
  Cloud,
  HardDrive,
  Scissors,
  Download,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import type { RecordingControls as RecordingControlsType } from "@/types/live-shopping"

interface RecordingControlsProps {
  recordingState: RecordingControlsType
  onStartRecording: () => void
  onStopRecording: () => void
  onPauseRecording: () => void
  onResumeRecording: () => void
  onUpdateSettings: (settings: Partial<RecordingControlsType>) => void
  onCreateHighlight: () => void
  onDownloadRecording: () => void
  className?: string
}

export default function RecordingControls({
  recordingState,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onUpdateSettings,
  onCreateHighlight,
  onDownloadRecording,
  className = "",
}: RecordingControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    onStartRecording()
    toast({
      title: "Recording Started",
      description: "Your live stream is now being recorded.",
    })
  }

  const handleStopRecording = () => {
    onStopRecording()
    toast({
      title: "Recording Stopped",
      description: "Your recording has been saved and is being processed.",
    })
  }

  const handleCreateHighlight = () => {
    onCreateHighlight()
    toast({
      title: "Highlight Created",
      description: "A highlight clip has been created from the current moment.",
    })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Recording Controls</span>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recording Settings</DialogTitle>
                <DialogDescription>Configure your recording preferences and quality settings.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Auto-record streams</p>
                      <p className="text-xs text-muted-foreground">Automatically start recording when you go live</p>
                    </div>
                    <Switch
                      checked={recordingState.autoRecord}
                      onCheckedChange={(checked) => onUpdateSettings({ autoRecord: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recording Quality</label>
                    <Select
                      value={recordingState.recordQuality}
                      onValueChange={(value: any) => onUpdateSettings({ recordQuality: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (720p)</SelectItem>
                        <SelectItem value="medium">Medium (1080p)</SelectItem>
                        <SelectItem value="high">High (1440p)</SelectItem>
                        <SelectItem value="source">Source Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Save to cloud</p>
                      <p className="text-xs text-muted-foreground">Store recordings in cloud storage for easy access</p>
                    </div>
                    <Switch
                      checked={recordingState.saveToCloud}
                      onCheckedChange={(checked) => onUpdateSettings({ saveToCloud: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Auto-create highlights</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically generate highlight clips during stream
                      </p>
                    </div>
                    <Switch
                      checked={recordingState.createHighlights}
                      onCheckedChange={(checked) => onUpdateSettings({ createHighlights: checked })}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recordingState.isRecording && (
              <>
                {recordingState.isPaused ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Pause className="h-3 w-3 mr-1" />
                    Paused
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                    Recording
                  </Badge>
                )}
                <span className="text-sm font-mono">{formatDuration(recordingState.recordingDuration)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {recordingState.saveToCloud ? <Cloud className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
            <span>{recordingState.recordQuality}</span>
          </div>
        </div>

        <Separator />

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {!recordingState.isRecording ? (
            <Button onClick={handleStartRecording} className="bg-red-500 hover:bg-red-600 text-white">
              <Record className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={handleStopRecording} variant="destructive">
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          )}

          {recordingState.isRecording && (
            <Button onClick={recordingState.isPaused ? onResumeRecording : onPauseRecording} variant="outline">
              {recordingState.isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          )}
        </div>

        {/* Additional Actions */}
        {recordingState.isRecording && (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleCreateHighlight} variant="outline" size="sm">
              <Scissors className="h-4 w-4 mr-2" />
              Create Highlight
            </Button>
            <Button onClick={onDownloadRecording} variant="outline" size="sm" disabled={recordingState.isRecording}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}

        {/* Recording Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Auto-record:</span>
            <span>{recordingState.autoRecord ? "Enabled" : "Disabled"}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span>{recordingState.saveToCloud ? "Cloud" : "Local"}</span>
          </div>
          <div className="flex justify-between">
            <span>Auto-highlights:</span>
            <span>{recordingState.createHighlights ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
