"use client"

import type React from "react"

import type { BackgroundCategory } from "@/types/virtual-backgrounds"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Mountain,
  PaintBucket,
  Palette,
  Monitor,
  ImageIcon,
  Sparkles,
  Building2,
  Landmark,
  Waves,
} from "lucide-react"

interface BackgroundCategoriesProps {
  onCategorySelect: (categoryId: string) => void
}

export default function BackgroundCategories({ onCategorySelect }: BackgroundCategoriesProps) {
  // Mock categories with icons
  const categories: BackgroundCategory[] = [
    {
      id: "office",
      name: "Office",
      description: "Professional office backgrounds",
      icon: "Briefcase",
      count: 24,
      featured: true,
    },
    {
      id: "nature",
      name: "Nature",
      description: "Scenic natural landscapes",
      icon: "Mountain",
      count: 32,
      featured: true,
    },
    {
      id: "abstract",
      name: "Abstract",
      description: "Creative abstract designs",
      icon: "PaintBucket",
      count: 18,
      featured: true,
    },
    {
      id: "gradients",
      name: "Gradients",
      description: "Smooth color transitions",
      icon: "Palette",
      count: 15,
      featured: true,
    },
    {
      id: "tech",
      name: "Tech",
      description: "Technology themed backgrounds",
      icon: "Monitor",
      count: 20,
      featured: true,
    },
    { id: "minimal", name: "Minimal", description: "Clean, simple backgrounds", icon: "ImageIcon", count: 12 },
    { id: "ai-generated", name: "AI Generated", description: "Created with AI", icon: "Sparkles", count: 28 },
    { id: "cityscape", name: "Cityscape", description: "Urban environments", icon: "Building2", count: 16 },
    { id: "landmarks", name: "Landmarks", description: "Famous locations", icon: "Landmark", count: 14 },
    { id: "ocean", name: "Ocean", description: "Underwater and ocean scenes", icon: "Waves", count: 10 },
  ]

  // Function to get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Briefcase: <Briefcase className="h-4 w-4" />,
      Mountain: <Mountain className="h-4 w-4" />,
      PaintBucket: <PaintBucket className="h-4 w-4" />,
      Palette: <Palette className="h-4 w-4" />,
      Monitor: <Monitor className="h-4 w-4" />,
      ImageIcon: <ImageIcon className="h-4 w-4" />,
      Sparkles: <Sparkles className="h-4 w-4" />,
      Building2: <Building2 className="h-4 w-4" />,
      Landmark: <Landmark className="h-4 w-4" />,
      Waves: <Waves className="h-4 w-4" />,
    }
    return icons[iconName] || <ImageIcon className="h-4 w-4" />
  }

  // Only show featured categories in the sidebar
  const featuredCategories = categories.filter((cat) => cat.featured)

  return (
    <div className="space-y-2">
      {featuredCategories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="mr-2 text-orange-500">{getIconComponent(category.icon)}</div>
          <span className="flex-1 text-left">{category.name}</span>
          <span className="text-xs text-muted-foreground">{category.count}</span>
        </Button>
      ))}
      <Button variant="link" className="w-full justify-start text-orange-500">
        View All Categories
      </Button>
    </div>
  )
}
