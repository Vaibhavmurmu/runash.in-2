"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Play, Download, Share2, MoreVertical, Eye, Scissors, FileVideo, Calendar } from "lucide-react"
import Image from "next/image"
import type { StreamRecording } from "@/types/live-shopping"

interface RecordedStreamsLibraryProps {
  recordings: StreamRecording[]
  onPlay: (recording: StreamRecording) => void
  onDownload: (recording: StreamRecording) => void
  onShare: (recording: StreamRecording) => void
  onCreateClip: (recording: StreamRecording) => void
  className?: string
}

export default function RecordedStreamsLibrary({
  recordings,
  onPlay,
  onDownload,
  onShare,
  onCreateClip,
  className = "",
}: RecordedStreamsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecording, setSelectedRecording] = useState<StreamRecording | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredRecordings = recordings.filter(
    (recording) =>
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recording.description && recording.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handlePlayRecording = (recording: StreamRecording) => {
    setSelectedRecording(recording)
    setIsPlayerOpen(true)
    onPlay(recording)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recorded Streams</h2>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search recordings..."
            className="pl-9 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRecordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileVideo className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1">No recordings found</h3>
          <p className="text-sm text-gray-500 max-w-md">
            {searchQuery
              ? "No recordings match your search criteria. Try different keywords."
              : "Start streaming with recording enabled to see your recordings here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                {recording.thumbnailUrl ? (
                  <Image
                    src={recording.thumbnailUrl || "/placeholder.svg"}
                    alt={recording.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileVideo className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {recording.isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm">Processing...</p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(recording.duration)}
                </div>

                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {recording.quality}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{recording.title}</CardTitle>
                {recording.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{recording.description}</p>
                )}
              </CardHeader>

              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(recording.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{recording.viewCount} views</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size: {formatFileSize(recording.fileSize)}</span>
                    <span>{recording.highlights.length} highlights</span>
                  </div>

                  {recording.chapters.length > 0 && (
                    <div className="text-xs text-muted-foreground">{recording.chapters.length} chapters</div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex justify-between">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                  onClick={() => handlePlayRecording(recording)}
                  disabled={recording.isProcessing}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDownload(recording)} disabled={recording.isProcessing}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare(recording)} disabled={recording.isProcessing}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateClip(recording)} disabled={recording.isProcessing}>
                      <Scissors className="h-4 w-4 mr-2" />
                      Create clip
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{selectedRecording?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative bg-black aspect-video">
            {selectedRecording && (
              <video
                src={selectedRecording.recordingUrl}
                controls
                className="w-full h-full"
                poster={selectedRecording.thumbnailUrl}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
