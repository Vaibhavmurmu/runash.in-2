"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useConversationMessages(conversationId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    conversationId ? `/api/messages/conversations/${conversationId}` : null,
    fetcher,
    {
      refreshInterval: 3000, // Poll every 3 seconds for new messages
    },
  )

  return {
    messages: data?.messages || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export const useSendMessage = () => {
  const send = useCallback(async (conversationId: string, content: string, recipientId: string) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        content,
        recipientId,
      }),
    })

    if (!response.ok) throw new Error("Failed to send message")
    return response.json()
  }, [])

  return { send }
}
