"use client"

import React from "react"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  subtitle?: string
  primaryAction?: () => void
  secondaryAction?: () => void
}

export default function Hero({ title, subtitle, primaryAction, secondaryAction }: Props) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-white to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold mb-3">{title}</h2>
          {subtitle && <p className="text-gray-600 dark:text-gray-300 mb-4">{subtitle}</p>}

          <div className="flex gap-3">
            <Button onClick={primaryAction} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
              Start Live Agent
            </Button>
            <Button variant="outline" onClick={secondaryAction}>
              Product Demo
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/3 text-sm text-gray-600">
          <div className="bg-white/50 rounded-md p-3 border border-dashed">
            <div className="font-semibold">Live agent highlights</div>
            <ul className="mt-2 space-y-1">
              <li>Context-aware recommendations</li>
              <li>Instant product discovery & bundles</li>
              <li>Voice & chat enabled commerce flows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
