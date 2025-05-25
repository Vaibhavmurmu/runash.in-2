"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Clock, DollarSign, Share, Bookmark } from "lucide-react"
import type { SustainabilityTip } from "@/types/runash-chat"

interface SustainabilityTipProps {
  tip: SustainabilityTip
}

export default function SustainabilityTipComponent({ tip }: SustainabilityTipProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy":
        return "⚡"
      case "waste":
        return "♻️"
      case "water":
        return "💧"
      case "food":
        return "🥬"
      case "transport":
        return "🚲"
      case "shopping":
        return "🛒"
      default:
        return "🌱"
    }
  }

  const handleSaveTip = () => {
    console.log("Save tip:", tip.title)
  }

  const handleShareTip = () => {
    console.log("Share tip:", tip.title)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{getCategoryIcon(tip.category)}</div>
            <div>
              <h4 className="font-medium">{tip.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getImpactColor(tip.impact)}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {tip.impact} impact
                </Badge>
                <Badge className={getDifficultyColor(tip.difficulty)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {tip.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <Lightbulb className="h-5 w-5 text-yellow-500" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tip.description}</p>

        {tip.estimatedSavings && (
          <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-3">
            <DollarSign className="h-4 w-4 mr-1" />
            Potential savings: ${tip.estimatedSavings}/month
          </div>
        )}

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleSaveTip} className="flex-1">
            <Bookmark className="h-3 w-3 mr-1" />
            Save Tip
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareTip}>
            <Share className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
