"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Bot, Settings, MessageSquare, ShoppingCart, BarChart3, Loader2 } from "lucide-react"
import { useAIAgents, type AIAgent } from "@/lib/hooks/use-ai-agents"

interface AIAgentPanelProps {
  isStreaming: boolean
  userId?: string
}

export function AIAgentPanel({ isStreaming, userId = "user-123" }: AIAgentPanelProps) {
  const { agents, loading, toggleAgentStatus } = useAIAgents(userId)
  const [localAgents, setLocalAgents] = useState<AIAgent[]>([])

  useEffect(() => {
    if (agents.length > 0) {
      setLocalAgents(agents)
    }
  }, [agents])

  const toggleAgent = async (agentId: string) => {
    const agent = localAgents.find((a) => a.id === agentId)
    if (!agent) return

    // Optimistically update UI
    setLocalAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              enabled: !a.enabled,
              status: !a.enabled ? "active" : "disabled",
            }
          : a,
      ),
    )

    // Update in database
    await toggleAgentStatus(agentId, !agent.enabled)
  }

  const getAgentIcon = (type: AIAgent["type"]) => {
    switch (type) {
      case "sales":
        return <ShoppingCart className="h-4 w-4" />
      case "engagement":
        return <MessageSquare className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      case "moderation":
        return <Bot className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: AIAgent["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "disabled":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI Agents
          <Badge variant="secondary" className="text-xs">
            {loading ? "..." : localAgents.filter((a) => a.enabled).length} active
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : localAgents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Bot className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-sm font-medium">No AI agents available</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Create AI agents to help manage your streams</p>
              <Button size="sm" variant="outline" asChild>
                <a href="/ai-agents">Create Agents</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localAgents.map((agent) => (
                <div key={agent.id} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAgentIcon(agent.type)}
                      <span className="font-medium text-sm">{agent.name}</span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    </div>
                    <Switch
                      checked={agent.enabled}
                      onCheckedChange={() => toggleAgent(agent.id)}
                      disabled={!isStreaming && agent.type === "engagement"}
                    />
                  </div>

                  {agent.enabled && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Performance</span>
                          <span>{agent.performance_score}%</span>
                        </div>
                        <Progress value={agent.performance_score} className="h-1" />
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tasks completed</span>
                          <span className="font-medium">{agent.tasks_completed}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Current: {agent.current_task || "Monitoring stream"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-3 pt-3 border-t space-y-2">
          <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent" asChild>
            <a href="/ai-agents">
              <Settings className="h-4 w-4" />
              Configure Agents
            </a>
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            {isStreaming ? "Agents are monitoring your stream" : "Start streaming to activate agents"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
