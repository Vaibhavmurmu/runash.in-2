"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, TrendingUp, Clock, Wrench, ArrowRight, Bookmark } from "lucide-react"
import type { AutomationSuggestion } from "@/types/runash-chat"

interface AutomationSuggestionProps {
  suggestion: AutomationSuggestion
}

export default function AutomationSuggestion({ suggestion }: AutomationSuggestionProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "inventory":
        return "📦"
      case "pricing":
        return "💰"
      case "marketing":
        return "📢"
      case "customer-service":
        return "🎧"
      case "analytics":
        return "📊"
      default:
        return "⚙️"
    }
  }

  const handleLearnMore = () => {
    console.log("Learn more about:", suggestion.title)
  }

  const handleSaveSuggestion = () => {
    console.log("Save suggestion:", suggestion.title)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{getCategoryIcon(suggestion.category)}</div>
            <div>
              <h4 className="font-medium">{suggestion.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getComplexityColor(suggestion.complexity)}>
                  <Wrench className="h-3 w-3 mr-1" />
                  {suggestion.complexity}
                </Badge>
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {suggestion.estimatedROI}% ROI
                </Badge>
              </div>
            </div>
          </div>
          <Zap className="h-5 w-5 text-orange-500" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{suggestion.description}</p>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          Implementation time: {suggestion.implementationTime}
        </div>

        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Required Tools:</h5>
          <div className="flex flex-wrap gap-1">
            {suggestion.tools.slice(0, 3).map((tool) => (
              <Badge key={tool} variant="outline" className="text-xs">
                {tool}
              </Badge>
            ))}
            {suggestion.tools.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{suggestion.tools.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleLearnMore}
            className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white"
          >
            Learn More
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveSuggestion}>
            <Bookmark className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
