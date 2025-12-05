"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CTASection({ title, bullets = [], onAction }: { title: string; bullets?: string[]; onAction?: () => void }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
            {bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center">
          <Button onClick={onAction} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">Get Started</Button>
        </div>
      </div>
    </Card>
  )
}
