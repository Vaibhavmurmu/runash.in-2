"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageCircle, ShoppingCart, Heart, Gift, Crown, Settings } from "lucide-react"
import type { LiveStreamMessage } from "@/types/live-shopping"

interface LiveStreamChatProps {
  streamId: string
}

export default function LiveStreamChat({ streamId }: LiveStreamChatProps) {
  const [messages, setMessages] = useState<LiveStreamMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(true)
  const [chatSettings, setChatSettings] = useState({
    showPurchases: true,
    showSystemMessages: true,
    slowMode: false,
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock messages for demonstration
  const mockMessages: LiveStreamMessage[] = [
    {
      id: "1",
      streamId,
      userId: "user1",
      username: "OrganicFoodie",
      userAvatar: "/placeholder.svg?height=32&width=32",
      message: "These mangoes look amazing! 🥭",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "message",
    },
    {
      id: "2",
      streamId,
      userId: "user2",
      username: "HealthyEater",
      userAvatar: "/placeholder.svg?height=32&width=32",
      message: "Just ordered the quinoa! Thanks for the demo Sarah! 🌾",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      type: "purchase",
      metadata: {
        productId: "3",
        productName: "Organic Quinoa",
        price: 15.99,
      },
    },
    {
      id: "3",
      streamId,
      userId: "system",
      username: "System",
      message: "🎉 Flash Sale Alert: 20% off all organic fruits for the next 10 minutes!",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: "system",
    },
    {
      id: "4",
      streamId,
      userId: "user3",
      username: "VeggieLover",
      userAvatar: "/placeholder.svg?height=32&width=32",
      message: "How long do the avocados stay fresh?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: "message",
    },
    {
      id: "5",
      streamId,
      userId: "host",
      username: "Sarah Chen",
      userAvatar: "/placeholder.svg?height=32&width=32",
      message: "@VeggieLover They stay fresh for 5-7 days when stored properly! 🥑",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      type: "message",
    },
  ]

  useEffect(() => {
    setMessages(mockMessages)

    // Simulate real-time messages
    const interval = setInterval(() => {
      const randomMessages = [
        "Love this stream! 💚",
        "When will you showcase the berries?",
        "Just placed my order! 🛒",
        "These prices are amazing!",
        "Can you show the nutrition facts?",
        "Is this available for delivery today?",
        "❤️❤️❤️",
      ]

      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)]
      const newMsg: LiveStreamMessage = {
        id: Date.now().toString(),
        streamId,
        userId: `user${Math.floor(Math.random() * 1000)}`,
        username: `Viewer${Math.floor(Math.random() * 1000)}`,
        message: randomMessage,
        timestamp: new Date(),
        type: "message",
      }

      setMessages((prev) => [...prev, newMsg])
    }, 8000)

    return () => clearInterval(interval)
  }, [streamId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: LiveStreamMessage = {
      id: Date.now().toString(),
      streamId,
      userId: "current-user",
      username: "You",
      message: newMessage,
      timestamp: new Date(),
      type: "message",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageIcon = (type: LiveStreamMessage["type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-3 w-3 text-green-500" />
      case "product_highlight":
        return <Gift className="h-3 w-3 text-purple-500" />
      case "system":
        return <Crown className="h-3 w-3 text-yellow-500" />
      default:
        return <MessageCircle className="h-3 w-3 text-blue-500" />
    }
  }

  const formatMessage = (message: LiveStreamMessage) => {
    if (message.type === "purchase" && message.metadata) {
      return (
        <div className="space-y-1">
          <div>{message.message}</div>
          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            Purchased: {message.metadata.productName} - ${message.metadata.price}
          </div>
        </div>
      )
    }
    return message.message
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <MessageCircle className="h-4 w-4" />
            <span>Live Chat</span>
            <Badge variant="secondary" className="text-xs">
              {messages.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-3 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2 text-sm">
                <div className="flex-shrink-0 mt-1">{getMessageIcon(message.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {message.userAvatar && (
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={message.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{message.username[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <span
                      className={`font-medium text-xs ${
                        message.userId === "host"
                          ? "text-purple-600"
                          : message.userId === "system"
                            ? "text-yellow-600"
                            : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {message.username}
                      {message.userId === "host" && <Crown className="inline h-3 w-3 ml-1 text-purple-500" />}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`text-xs ${
                      message.type === "system"
                        ? "text-yellow-700 dark:text-yellow-300 font-medium"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {formatMessage(message)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 text-sm"
              maxLength={200}
            />
            <Button
              size="sm"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{newMessage.length}/200</span>
            <div className="flex items-center space-x-2">
              <Heart className="h-3 w-3" />
              <span>Be kind and respectful</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
