"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Wand2, Lightbulb, Palette, Save } from "lucide-react"
import type { AIGenerationPrompt } from "@/types/virtual-backgrounds"

export default function AIBackgroundGenerator() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("prompt")
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [mood, setMood] = useState("")
  const [colors, setColors] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<Array<{ id: string; url: string }>>([])
  const [savedPrompts, setSavedPrompts] = useState<AIGenerationPrompt[]>([
    { id: "prompt-1", prompt: "A modern office with a city view", style: "Photorealistic", mood: "Professional" },
    { id: "prompt-2", prompt: "Abstract geometric shapes with orange and blue", style: "Abstract", mood: "Creative" },
    { id: "prompt-3", prompt: "Minimalist workspace with plants", style: "Minimal", mood: "Calm" },
  ])

  // Example style options
  const styleOptions = [
    "Photorealistic",
    "Abstract",
    "Minimal",
    "Cinematic",
    "Anime",
    "Watercolor",
    "Oil Painting",
    "Digital Art",
    "Sketch",
    "3D Render",
  ]

  // Example mood options
  const moodOptions = [
    "Professional",
    "Creative",
    "Calm",
    "Energetic",
    "Mysterious",
    "Futuristic",
    "Nostalgic",
    "Elegant",
    "Playful",
    "Serious",
  ]

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your background.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      // In a real app, this would call an AI image generation API
      const newBackgrounds = Array(4)
        .fill(0)
        .map((_, index) => ({
          id: `ai-${Date.now()}-${index}`,
          url: "/backgrounds/ai-generated.jpg", // This would be a real AI-generated image in production
        }))

      setGeneratedBackgrounds(newBackgrounds)
      setIsGenerating(false)

      toast({
        title: "Backgrounds Generated",
        description: "Your AI backgrounds are ready to use.",
      })
    }, 3000)
  }

  const handleSavePrompt = () => {
    if (!prompt.trim()) return

    const newPrompt: AIGenerationPrompt = {
      id: `prompt-${Date.now()}`,
      prompt,
      style,
      mood,
      colors: colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    }

    setSavedPrompts((prev) => [newPrompt, ...prev])

    toast({
      title: "Prompt Saved",
      description: "Your prompt has been saved for future use.",
    })
  }

  const loadSavedPrompt = (savedPrompt: AIGenerationPrompt) => {
    setPrompt(savedPrompt.prompt)
    setStyle(savedPrompt.style || "")
    setMood(savedPrompt.mood || "")
    setColors(savedPrompt.colors?.join(", ") || "")
    setActiveTab("prompt")
  }

  const handleBackgroundSelect = (backgroundId: string) => {
    toast({
      title: "Background Selected",
      description: "AI-generated background has been applied to your stream.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AI Background Generator</h2>
        <p className="text-muted-foreground">Create custom backgrounds using AI by describing what you want</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="prompt">Create</TabsTrigger>
                  <TabsTrigger value="saved">Saved Prompts</TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Describe your background</Label>
                    <Textarea
                      id="prompt"
                      placeholder="E.g., A modern office with a city view, soft lighting, professional setting"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <select
                        id="style"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="">Select a style</option>
                        {styleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood">Mood</Label>
                      <select
                        id="mood"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="">Select a mood</option>
                        {moodOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colors">Color Palette (comma separated)</Label>
                    <Input
                      id="colors"
                      placeholder="E.g., orange, blue, white"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleSavePrompt} disabled={!prompt.trim()}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Prompt
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="saved" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Your Saved Prompts</h3>

                    {savedPrompts.length > 0 ? (
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {savedPrompts.map((savedPrompt) => (
                          <div
                            key={savedPrompt.id}
                            className="p-3 border rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                            onClick={() => loadSavedPrompt(savedPrompt)}
                          >
                            <div className="flex items-start">
                              <Lightbulb className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">{savedPrompt.prompt}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {savedPrompt.style && (
                                    <div className="flex items-center text-xs bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">
                                      <Wand2 className="h-3 w-3 mr-1" />
                                      {savedPrompt.style}
                                    </div>
                                  )}
                                  {savedPrompt.mood && (
                                    <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                                      <Palette className="h-3 w-3 mr-1" />
                                      {savedPrompt.mood}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>You haven't saved any prompts yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Generated Backgrounds</h3>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-4" />
                  <p className="text-muted-foreground">Generating your backgrounds...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              ) : generatedBackgrounds.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {generatedBackgrounds.map((bg) => (
                    <div
                      key={bg.id}
                      className="relative aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleBackgroundSelect(bg.id)}
                    >
                      <img
                        src={bg.url || "/placeholder.svg"}
                        alt="AI-generated background"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                        <Button size="sm" variant="secondary" className="w-full">
                          Use Background
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
                  <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter a prompt and generate backgrounds</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
