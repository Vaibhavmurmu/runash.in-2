"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

interface AIInsightsPanelProps {
  period: string
}

export function AIInsightsPanel({ period }: AIInsightsPanelProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const insights = [
    {
      type: "opportunity",
      title: "Peak Engagement Window",
      description:
        "Your audience is most active between 7-9 PM EST. Consider scheduling more streams during this time.",
      impact: "high",
      confidence: 92,
      action: "Schedule streams during peak hours",
      icon: Clock,
    },
    {
      type: "optimization",
      title: "Product Showcase Timing",
      description: "Viewers are 34% more likely to purchase when products are shown in the first 10 minutes.",
      impact: "medium",
      confidence: 87,
      action: "Move product highlights earlier",
      icon: Target,
    },
    {
      type: "warning",
      title: "Viewer Drop-off Pattern",
      description: "15% of viewers leave after 12 minutes. Consider adding interactive elements around this time.",
      impact: "medium",
      confidence: 78,
      action: "Add polls or Q&A at 10-minute mark",
      icon: AlertTriangle,
    },
    {
      type: "success",
      title: "Chat Engagement Success",
      description: "Your response rate to chat messages has improved by 45%, leading to higher retention.",
      impact: "high",
      confidence: 95,
      action: "Continue current chat strategy",
      icon: CheckCircle,
    },
  ]

  const recommendations = [
    {
      category: "Content Strategy",
      suggestions: [
        "Add product demos in the first 5 minutes",
        "Use countdown timers for limited offers",
        "Include viewer polls every 15 minutes",
      ],
    },
    {
      category: "Audience Growth",
      suggestions: [
        "Cross-promote on social media 2 hours before streaming",
        "Create teaser content for upcoming products",
        "Collaborate with other streamers in your niche",
      ],
    },
    {
      category: "Revenue Optimization",
      suggestions: [
        "Bundle complementary products together",
        "Offer exclusive stream-only discounts",
        "Implement urgency-driven pricing",
      ],
    },
  ]

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
      case "optimization":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>
            Intelligent analysis of your stream performance with actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">4</div>
              <div className="text-sm text-muted-foreground">New Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">87%</div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-muted-foreground">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <insight.icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </div>
                <Badge className={getInsightColor(insight.type)}>{insight.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{insight.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span>Confidence Level</span>
                <span className="font-medium">{insight.confidence}%</span>
              </div>
              <Progress value={insight.confidence} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Impact:</span>
                  <Badge variant="outline" className={getImpactColor(insight.impact)}>
                    {insight.impact}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {insight.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>Personalized suggestions to improve your stream performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400">{category.category}</h4>
                <ul className="space-y-2">
                  {category.suggestions.map((suggestion, suggestionIndex) => (
                    <li key={suggestionIndex} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle>Performance Predictions</CardTitle>
          </div>
          <CardDescription>AI-powered forecasts based on your current trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">+23%</div>
              <div className="text-sm text-muted-foreground">Expected viewer growth</div>
              <div className="text-xs text-green-600 mt-1">Next 30 days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-muted-foreground">Revenue increase</div>
              <div className="text-xs text-green-600 mt-1">Next 30 days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <div className="text-2xl font-bold">+2.3m</div>
              <div className="text-sm text-muted-foreground">Watch time boost</div>
              <div className="text-xs text-green-600 mt-1">With optimizations</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">8.9%</div>
              <div className="text-sm text-muted-foreground">Engagement rate</div>
              <div className="text-xs text-green-600 mt-1">Projected peak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
