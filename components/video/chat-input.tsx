'use client'

import { Send, Paperclip } from 'lucide-react'
import { useState } from 'react'

export default function ChatInput() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      console.log('Message sent:', message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-3 items-end bg-card border border-border rounded-lg p-3 backdrop-blur-sm hover:border-accent/50 transition group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask RunAsh anything about video generation..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
        />
        <button
          type="button"
          className="p-2 hover:bg-primary/10 rounded-lg transition text-foreground/60 hover:text-accent"
          aria-label="Upload file"
        >
          <Paperclip size={18} />
        </button>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  )
}
