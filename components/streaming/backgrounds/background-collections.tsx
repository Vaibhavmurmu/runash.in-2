"use client"

import { useState } from "react"
import type { BackgroundCollection } from "@/types/virtual-backgrounds"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderPlus, Lock, Globe, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BackgroundCollections() {
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPublic: true,
  })

  // Mock collections
  const collections: BackgroundCollection[] = [
    {
      id: "col-1",
      name: "My Favorites",
      description: "My personal favorite backgrounds",
      backgrounds: ["bg-1", "bg-2", "bg-3", "bg-4"],
      coverImage: "/backgrounds/office-modern.jpg",
      isPublic: false,
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-06-20T14:45:00Z",
    },
    {
      id: "col-2",
      name: "Professional Meetings",
      description: "Clean backgrounds for client meetings",
      backgrounds: ["bg-5", "bg-6", "bg-7"],
      coverImage: "/backgrounds/office-bookshelf.jpg",
      isPublic: true,
      createdAt: "2023-04-10T09:15:00Z",
      updatedAt: "2023-06-18T11:20:00Z",
    },
    {
      id: "col-3",
      name: "Creative Sessions",
      description: "Inspiring backgrounds for brainstorming",
      backgrounds: ["bg-8", "bg-9", "bg-10", "bg-11", "bg-12"],
      coverImage: "/backgrounds/abstract-orange.jpg",
      isPublic: true,
      createdAt: "2023-03-22T16:40:00Z",
      updatedAt: "2023-06-15T13:10:00Z",
    },
    {
      id: "col-4",
      name: "Seasonal Themes",
      description: "Backgrounds for different seasons",
      backgrounds: ["bg-13", "bg-14", "bg-15", "bg-16"],
      coverImage: "/backgrounds/nature-autumn.jpg",
      isPublic: false,
      createdAt: "2023-02-05T12:20:00Z",
      updatedAt: "2023-05-30T10:05:00Z",
    },
  ]

  const handleCreateCollection = () => {
    // In a real app, this would create a new collection in the database
    toast({
      title: "Collection Created",
      description: `"${newCollection.name}" has been created successfully.`,
    })
    setIsCreateDialogOpen(false)
    setNewCollection({
      name: "",
      description: "",
      isPublic: true,
    })
  }

  const handleDeleteCollection = (collectionId: string) => {
    // In a real app, this would delete the collection
    toast({
      title: "Collection Deleted",
      description: "The collection has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Collections</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={collection.coverImage || "/placeholder.svg"}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div>
                  <h3 className="font-semibold text-white">{collection.name}</h3>
                  <div className="flex items-center text-xs text-white/80 mt-1">
                    <span>{collection.backgrounds.length} backgrounds</span>
                    <span className="mx-1">•</span>
                    {collection.isPublic ? (
                      <div className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        <span>Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
              <div className="flex justify-between mt-4">
                <Button size="sm" variant="default">
                  View
                </Button>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteCollection(collection.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create new collection card */}
        <Card className="overflow-hidden border-dashed">
          <div
            className="flex flex-col items-center justify-center h-full p-6 cursor-pointer"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">Create New Collection</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">Organize your backgrounds into collections</p>
          </div>
        </Card>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>Create a new collection to organize your backgrounds</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Collection Name
              </label>
              <Input
                id="name"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                placeholder="My Collection"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                placeholder="Describe your collection"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newCollection.isPublic}
                onChange={(e) => setNewCollection({ ...newCollection, isPublic: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make this collection public
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} disabled={!newCollection.name}>
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
