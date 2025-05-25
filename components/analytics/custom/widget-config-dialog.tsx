"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { DashboardWidget } from "@/types/custom-dashboard"

interface WidgetConfigDialogProps {
  widget: DashboardWidget
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (widget: DashboardWidget) => void
}

export function WidgetConfigDialog({ widget, open, onOpenChange, onSave }: WidgetConfigDialogProps) {
  const [config, setConfig] = useState(widget)

  const handleSave = () => {
    onSave(config)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
          <DialogDescription>Customize the appearance and data source for this widget</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="data">Data Source</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Widget Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={config.description || ""}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Add a description for this widget"
              />
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {(config.type === "metric-card" || config.type === "custom-metric") && (
              <div className="space-y-2">
                <Label htmlFor="metric">Metric</Label>
                <Select
                  value={config.config.metric}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      config: { ...config.config, metric: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewers">Total Viewers</SelectItem>
                    <SelectItem value="followers">New Followers</SelectItem>
                    <SelectItem value="engagement">Engagement Rate</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select
                value={config.config.timeRange?.preset || "last30days"}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    config: {
                      ...config.config,
                      timeRange: {
                        preset: value as any,
                        start: "",
                        end: "",
                        label: value,
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="refreshInterval"
                  min={0}
                  max={300}
                  step={30}
                  value={[config.config.refreshInterval || 0]}
                  onValueChange={([value]) =>
                    setConfig({
                      ...config,
                      config: { ...config.config, refreshInterval: value },
                    })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-sm text-muted-foreground">{config.config.refreshInterval || 0}s</span>
              </div>
              <p className="text-xs text-muted-foreground">Set to 0 to disable auto-refresh</p>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            {config.type.includes("chart") && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLegend">Show Legend</Label>
                  <Switch
                    id="showLegend"
                    checked={config.config.showLegend !== false}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        config: { ...config.config, showLegend: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showGrid">Show Grid Lines</Label>
                  <Switch
                    id="showGrid"
                    checked={config.config.showGrid !== false}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        config: { ...config.config, showGrid: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTooltip">Show Tooltip</Label>
                  <Switch
                    id="showTooltip"
                    checked={config.config.showTooltip !== false}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        config: { ...config.config, showTooltip: checked },
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="color">Primary Color</Label>
              <Select
                value={config.config.color || "default"}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    config: { ...config.config, color: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (Orange)</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
