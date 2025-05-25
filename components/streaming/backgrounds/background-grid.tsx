"use client"

import { useState } from "react"
import type { BackgroundImage } from "@/types/virtual-backgrounds"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Download, Bookmark, Check, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import BackgroundPreview from "./background-preview"

interface BackgroundGridProps {
  backgrounds: BackgroundImage[]
  viewMode: "grid" | "list"
  onSelect: (backgroundId: string) => void
  onDownload: (backgroundId: string) => void
  onSave: (backgroundId: string) => void
}

export default function BackgroundGrid({ backgrounds, viewMode, onSelect, onDownload, onSave }: BackgroundGridProps) {
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImage | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePreview = (background: BackgroundImage) => {
    setSelectedBackground(background)
    setPreviewOpen(true)
  }

  const handleSelect = () => {
    if (selectedBackground) {
      onSelect(selectedBackground.id)
      setPreviewOpen(false)
    }
  }

  if (backgrounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg p-6">
        <p className="text-muted-foreground text-center">No backgrounds found matching your criteria</p>
        <Button variant="link" onClick={() => window.location.reload()}>
          Reset filters
        </Button>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
        )}
      >
        {backgrounds.map((background) => (
          <Card
            key={background.id}
            className={cn(
              "overflow-hidden transition-all hover:shadow-md",
              viewMode === "list" && "flex flex-row h-24",
            )}
          >
            <div
              className={cn("relative cursor-pointer", viewMode === "grid" ? "aspect-video" : "w-36")}
              onClick={() => handlePreview(background)}
            >
              <img
                src={viewMode === "grid" ? background.url : background.thumbnailUrl}
                alt={background.name}
                className="w-full h-full object-cover"
              />
              {background.isPremium && (
                <Badge variant="secondary" className="absolute top-2 right-2 bg-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {background.isNew && (
                <Badge variant="secondary" className="absolute top-2 left-2 bg-green-500 text-white">
                  New
                </Badge>
              )}
            </div>
            <CardContent
              className={cn("p-3", viewMode === "list" && "flex flex-row items-center justify-between flex-1")}
            >
              <div>
                <h3 className="font-medium truncate">{background.name}</h3>
                {viewMode === "grid" && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{background.category[0]}</span>
                    <span className="mx-1">•</span>
                    <span>{background.downloadCount || 0} downloads</span>
                  </div>
                )}
              </div>
              <div className={cn("flex items-center gap-1 mt-2", viewMode === "list" && "mt-0")}>
                <Button size="sm" variant="secondary" onClick={() => onSelect(background.id)}>
                  <Check className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDownload(background.id)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onSave(background.id)}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedBackground?.name}</DialogTitle>
            <DialogDescription>
              {selectedBackground?.category.join(", ")} • {selectedBackground?.downloadCount || 0} downloads
            </DialogDescription>
          </DialogHeader>

          {selectedBackground && (
            <BackgroundPreview
              background={selectedBackground}
              onSelect={handleSelect}
              onDownload={() => onDownload(selectedBackground.id)}
              onSave={() => onSave(selectedBackground.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
