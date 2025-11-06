"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Heart, Gift, Star } from "lucide-react"
import { useChat } from "@/lib/hooks/use-chat"
import { useAuthContext } from "@/components/auth/auth-provider"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  type: "message" | "follow" | "purchase" | "tip"
  amount?: number
}

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    user: "SkincareLover23",
    message: "This serum looks amazing! 😍",
    timestamp: new Date(Date.now() - 30000),
    type: "message",
  },
  {
    id: "2",
    user: "HealthyGlow",
    message: "Just followed! Love your content",
    timestamp: new Date(Date.now() - 25000),
    type: "follow",
  },
  {
    id: "3",
    user: "OrganicFan",
    message: "Purchased the vitamin C serum!",
    timestamp: new Date(Date.now() - 20000),
    type: "purchase",
  },
  {
    id: "4",
    user: "WellnessWarrior",
    message: "What's the ingredient list?",
    timestamp: new Date(Date.now() - 15000),
    type: "message",
  },
]

interface StreamChatProps {
  isStreaming: boolean
  streamId?: string
}

export function StreamChat({ isStreaming, streamId = "default-stream" }: StreamChatProps) {
  const { user } = useAuthContext()
  const { messages, sendMessage: sendChatMessage } = useChat(streamId)
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulate new messages during streaming
  // useEffect(() => {
  //   if (!isStreaming) return

  //   const interval = setInterval(
  //     () => {
  //       const randomMessages = [
  //         "Love this product! 💕",
  //         "How much is the shipping?",
  //         "Do you ship internationally?",
  //         "This is so helpful, thank you!",
  //         "Just ordered! Can't wait to try it",
  //         "What's your skincare routine?",
  //         "Amazing quality! 🌟",
  //         "Is this suitable for sensitive skin?",
  //       ]

  //       const randomUsers = [
  //         "BeautyGuru",
  //         "SkinCareAddict",
  //         "NaturalBeauty",
  //         "GlowUp2024",
  //         "OrganicLife",
  //         "HealthyVibes",
  //         "WellnessJourney",
  //         "CleanBeauty",
  //       ]

  //       const messageTypes: ChatMessage["type"][] = ["message", "message", "message", "follow", "purchase"]

  //       const newMsg: ChatMessage = {
  //         id: Date.now().toString(),
  //         user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
  //         message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
  //         timestamp: new Date(),
  //         type: messageTypes[Math.floor(Math.random() * messageTypes.length)],
  //       }

  //       setMessages((prev) => [...prev, newMsg].slice(-50)) // Keep last 50 messages
  //     },
  //     Math.random() * 5000 + 2000,
  //   ) // Random interval between 2-7 seconds

  //   return () => clearInterval(interval)
  // }, [isStreaming])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    await sendChatMessage({
      user_id: user.id,
      username: user.email?.split("@")[0] || "Anonymous",
      message: newMessage,
      message_type: "message",
    })

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const getMessageIcon = (type: ChatMessage["type"]) => {
    switch (type) {
      case "follow":
        return <Heart className="h-3 w-3 text-red-500" />
      case "purchase":
        return <Gift className="h-3 w-3 text-green-500" />
      case "tip":
        return <Star className="h-3 w-3 text-yellow-500" />
      default:
        return null
    }
  }

  const getMessageBadge = (type: ChatMessage["type"]) => {
    switch (type) {
      case "follow":
        return (
          <Badge variant="secondary" className="text-xs">
            New Follower
          </Badge>
        )
      case "purchase":
        return (
          <Badge variant="default" className="text-xs">
            Purchase
          </Badge>
        )
      case "tip":
        return (
          <Badge variant="outline" className="text-xs">
            Tip
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Live Chat
          {isStreaming && (
            <Badge variant="secondary" className="text-xs">
              {messages.length} messages
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  {getMessageIcon(msg.type)}
                  <span className="text-xs font-medium text-primary">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {getMessageBadge(msg.type)}
                </div>
                <p className="text-sm pl-5">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-3">
          <Input
            placeholder={isStreaming ? "Type a message..." : "Start streaming to enable chat"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isStreaming}
            className="text-sm"
          />
          <Button size="sm" onClick={sendMessage} disabled={!isStreaming || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
