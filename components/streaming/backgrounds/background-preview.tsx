"use client"

import { useState, useEffect, useRef } from "react"
import type { BackgroundImage } from "@/types/virtual-backgrounds"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Download, Bookmark, Crown, Tag, Calendar, User } from "lucide-react"

interface BackgroundPreviewProps {
  background: BackgroundImage
  onSelect: () => void
  onDownload: () => void
  onSave: () => void
}

export default function BackgroundPreview({ background, onSelect, onDownload, onSave }: BackgroundPreviewProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [blurAmount, setBlurAmount] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulate loading time for preview generation
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Start webcam preview if available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream
            }
          })
          .catch((err) => {
            console.error("Error accessing webcam:", err)
          })
      }
    }, 1000)

    return () => {
      clearTimeout(timer)

      // Stop webcam when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="adjust">Adjustments</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Background image */}
                <img
                  src={background.url || "/placeholder.svg"}
                  alt={background.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: `blur(${blurAmount}px) brightness(${brightness}%) contrast(${contrast}%)`,
                  }}
                />

                {/* Webcam preview overlay */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-10 mix-blend-screen opacity-50"
                />

                {/* Fallback if webcam not available */}
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <img
                    src="/placeholder.svg?height=720&width=1280"
                    alt="Preview"
                    className="w-full h-full object-cover opacity-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={onSave}>
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
            <Button
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
              onClick={onSelect}
            >
              <Check className="mr-2 h-4 w-4" />
              Use Background
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="blur-slider">Background Blur</Label>
                <span className="text-xs text-muted-foreground">{blurAmount}px</span>
              </div>
              <Slider
                id="blur-slider"
                min={0}
                max={20}
                step={1}
                value={[blurAmount]}
                onValueChange={(value) => setBlurAmount(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="brightness-slider">Brightness</Label>
                <span className="text-xs text-muted-foreground">{brightness}%</span>
              </div>
              <Slider
                id="brightness-slider"
                min={50}
                max={150}
                step={1}
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="contrast-slider">Contrast</Label>
                <span className="text-xs text-muted-foreground">{contrast}%</span>
              </div>
              <Slider
                id="contrast-slider"
                min={50}
                max={150}
                step={1}
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Background Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Categories:</span>
                  <div className="ml-2 flex flex-wrap gap-1">
                    {background.category.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span className="ml-2">{new Date(background.createdAt).toLocaleDateString()}</span>
                </div>

                {background.dimensions && (
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span className="ml-2">
                      {background.dimensions.width} x {background.dimensions.height}
                    </span>
                  </div>
                )}

                {background.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Creator:</span>
                    <span className="ml-2">{background.author.name}</span>
                  </div>
                )}

                {background.isPremium && (
                  <div className="flex items-center mt-2">
                    <Crown className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-orange-500 font-medium">Premium Background</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {background.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
