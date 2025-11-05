"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function StreamScheduler() {
  const [date, setDate] = useState<Date>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Stream</CardTitle>
        <CardDescription>Plan your upcoming live streams</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Stream Title</Label>
            <Input placeholder="Enter stream title" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skincare">Skincare</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Describe your stream" rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Input type="time" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>AI Agent</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select AI agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salesbot">SalesBot Pro</SelectItem>
              <SelectItem value="engagebot">EngageBot</SelectItem>
              <SelectItem value="launchbot">LaunchBot</SelectItem>
              <SelectItem value="fitnessbot">FitnessBot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">Schedule Stream</Button>
          <Button variant="outline">Save as Draft</Button>
        </div>
      </CardContent>
    </Card>
  )
}
