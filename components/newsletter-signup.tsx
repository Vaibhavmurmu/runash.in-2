"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface NewsletterSignupProps {
  title?: string
  description?: string
  buttonText?: string
  className?: string
  dark?: boolean
}

export function NewsletterSignup({
  title = "Subscribe to our newsletter",
  description = "Get the latest news and updates delivered to your inbox.",
  buttonText = "Subscribe",
  className = "",
  dark = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    })

    setEmail("")
    setLoading(false)
  }

  return (
    <div className={className}>
      {title && (
        <h3 className={`font-bold text-lg mb-2 ${dark ? "text-white" : "text-gray-900 dark:text-white"}`}>{title}</h3>
      )}
      {description && (
        <p className={`mb-4 ${dark ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>{description}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : ""}`}
        />
        <Button type="submit" disabled={loading} className={dark ? "bg-white text-orange-600 hover:bg-white/90" : ""}>
          {loading ? "Subscribing..." : buttonText}
        </Button>
      </form>
    </div>
  )
}
