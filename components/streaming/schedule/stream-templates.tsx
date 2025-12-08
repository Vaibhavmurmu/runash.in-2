"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MoreHorizontal, Edit, Trash2, Calendar, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StreamTemplate } from "@/types/stream-scheduler"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetchTemplates = async (): Promise<StreamTemplate[]> => {
  const res = await fetch("/api/templates")
  if (!res.ok) throw new Error("Templates fetch failed")
  return res.json()
}

interface StreamTemplatesProps {
  // removed templates param, component now fetches itself
  onCreateTemplate: () => void
  onEditTemplate: (template: StreamTemplate) => void
  onDeleteTemplate: (templateId: string) => void
  onUseTemplate: (template: StreamTemplate) => void
}

export default function StreamTemplates({
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onUseTemplate,
}: StreamTemplatesProps) {
  const [templates, setTemplates] = useState<StreamTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("")
  const [sortKey, setSortKey] = useState<"name" | "createdAt">("createdAt")

  // Fetch templates
  useEffect(() => {
    setLoading(true)
    fetchTemplates()
      .then(setTemplates)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (isDeleting === id) {
      // Call API to delete
      try {
        await fetch(`/api/templates/${id}`, { method: "DELETE" })
        setTemplates(t => t.filter(tp => tp.id !== id))
        toast.success("Template deleted!")
      } catch {
        toast.error("Failed to delete.")
      }
      setIsDeleting(null)
    } else {
      setIsDeleting(id)
      setTimeout(() => setIsDeleting(null), 3000)
    }
  }

  const filteredTemplates = templates
    .filter(t => !filter || t.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortKey === "name"
      ? a.name.localeCompare(b.name)
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stream Templates</CardTitle>
        <Button
          onClick={onCreateTemplate}
          className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="flex gap-2 px-4 py-2">
          <Input
           type="text"
           placeholder="Filter by name..."
           value={filter}
           onChange={e => setFilter(e.target.value)}
           className="text-sm"
           aria-label="Filter templates by name"  />
        <Select value={sortKey} onValueChange={(value) => setSortKey(value as "name" | "createdAt")}>
         <SelectTrigger className="w-32 text-sm" aria-label="Sort templates">
          <SelectValue />
           </SelectTrigger>
           <SelectContent>
           <SelectItem value="createdAt">Recent</SelectItem>
          <SelectItem value="name">A-Z</SelectItem>
         </SelectContent>
         </Select>
        </div>
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No templates yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create templates to quickly schedule streams with predefined settings
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-1rem)] px-4">
            <div className="space-y-4 py-2">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.duration} min • {template.platforms.length} platform(s)
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUseTemplate(template)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule with Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditTemplate(template)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={isDeleting === template.id ? "text-red-600 dark:text-red-400" : ""}
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeleting === template.id ? "Confirm Delete" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{template.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
  }
