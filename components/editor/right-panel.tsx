"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import StreamManager from "./stream-manager"
import ModelSelector from "./model-selector"

interface RightPanelProps {
  selectedModel: string
  onModelChange: (model: string) => void
  activeTab?: string
}

export default function RightPanel({ selectedModel, onModelChange, activeTab }: RightPanelProps) {
  const showStreamManager = activeTab === "stream"
  const showModelSelector = activeTab === "generate"

  if (showStreamManager) {
    return <StreamManager />
  }

  const models = [
    { id: "wan-2.1", name: "WAN 2.1", desc: "Latest model", tier: "Pro" },
    { id: "gpt-4", name: "GPT-4", desc: "General purpose", tier: "Pro" },
    { id: "claude", name: "Claude", desc: "Fast & efficient", tier: "Pro" },
  ]

  return (
    <div className="w-96 bg-card border-l border-border overflow-y-auto">
      {showModelSelector ? (
        <div className="p-4">
          <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
        </div>
      ) : (
        <Tabs defaultValue="models" className="w-full h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b bg-transparent">
            <TabsTrigger value="models" className="flex-1">
              Models
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold px-2">Available Models</h3>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedModel === model.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.desc}</div>
                    </div>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">{model.tier}</span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Generation Settings</h3>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Duration</label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-muted-foreground">5 - 60 seconds</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Quality</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                  <option>1080p (High)</option>
                  <option>720p (Medium)</option>
                  <option>480p (Low)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Style</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                  <option>Cinematic</option>
                  <option>Documentary</option>
                  <option>Animated</option>
                </select>
              </div>
            </div>

            <Button className="w-full gap-2">
              <Zap className="w-4 h-4" />
              Generate
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
