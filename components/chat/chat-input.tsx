"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Mic, Send, Search, FileText } from "lucide-react"
import debounce from "lodash.debounce"

type Props = {
  initial?: string
  onSend: (text: string) => void
  onUpload?: (fileMeta: { id: number; filename: string }) => void
  model?: string
  onModelChange?: (model: string) => void
}

export default function ChatInput({ initial = "", onSend, onUpload, model = "gpt-4o-mini", onModelChange }: Props) {
  const [value, setValue] = useState(initial)
  const [isRecording, setIsRecording] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedModel, setSelectedModel] = useState(model)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setValue(initial)
  }, [initial])

  useEffect(() => {
    if (onModelChange) onModelChange(selectedModel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel])

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=5`)
      if (!res.ok) return
      const data = await res.json()
      setSuggestions((data || []).map((p: any) => p.name || p.title).filter(Boolean))
      setShowSuggestions(true)
    } catch (err) {
      console.warn("suggestions error", err)
    }
  }, 300)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    fetchSuggestions(e.target.value)
  }

  async function handleSend() {
    if (!value.trim()) return
    onSend(value.trim())
    setValue("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function triggerFile() {
    fileInputRef.current?.click()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const buffer = await f.arrayBuffer()
      const b64 = Buffer.from(buffer).toString("base64")
      // call upload endpoint
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: f.name, mimeType: f.type, base64: b64 }),
      })
      if (!res.ok) throw new Error("upload failed")
      const data = await res.json()
      if (onUpload && data?.upload) onUpload({ id: data.upload.id, filename: data.upload.filename })
      // optionally insert file link text into prompt
      setValue((v) => v + ` [uploaded:${data.upload.id}] `)
    } catch (err) {
      console.error("file upload error", err)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Voice using Web Speech API (simple)
  function toggleRecording() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("SpeechRecognition not supported in this browser")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setValue((v) => (v ? v + " " + text : text))
      // auto-send if desired
      // onSend(text)
    }
    recognition.onend = () => setIsRecording(false)
    if (!isRecording) {
      setIsRecording(true)
      recognition.start()
    } else {
      recognition.stop()
      setIsRecording(false)
    }
  }

  async function enhancePrompt() {
    if (!value.trim()) return
    try {
      const res = await fetch("/api/prompts/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value, length: "medium" }),
      })
      if (!res.ok) throw new Error("enhance failed")
      const data = await res.json()
      if (data?.enhanced) setValue(data.enhanced)
    } catch (err) {
      console.error("enhance error", err)
    }
  }

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            title="Model"
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          </select>
        </div>

        <div className="flex-1">
          <Input
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, recipes, or start a live demo..."
            className="flex-1"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-white border mt-1 rounded shadow-sm z-50">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 text-sm hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setValue(s)
                    setShowSuggestions(false)
                  }}
                >
                  <Search className="inline-block mr-2" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
          <Button variant="ghost" onClick={triggerFile} title="Upload file">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={toggleRecording} title="Voice (browser)">
            <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" onClick={enhancePrompt} title="Enhance prompt">
            <FileText className="h-4 w-4" />
          </Button>
          <Button onClick={handleSend} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
