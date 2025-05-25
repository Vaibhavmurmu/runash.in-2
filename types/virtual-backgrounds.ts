export interface BackgroundImage {
  id: string
  name: string
  url: string
  thumbnailUrl: string
  category: string[]
  tags: string[]
  isPremium: boolean
  isNew?: boolean
  isFeatured?: boolean
  createdAt: string
  dimensions?: {
    width: number
    height: number
  }
  author?: {
    name: string
    avatar?: string
  }
  downloadCount?: number
}

export interface BackgroundCategory {
  id: string
  name: string
  description: string
  icon: string
  count: number
  featured?: boolean
}

export interface BackgroundCollection {
  id: string
  name: string
  description: string
  backgrounds: string[] // Array of background IDs
  coverImage: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface BackgroundFilter {
  categories?: string[]
  tags?: string[]
  searchQuery?: string
  isPremium?: boolean
  sortBy?: "newest" | "popular" | "name"
}

export interface AIGenerationPrompt {
  id: string
  prompt: string
  style?: string
  mood?: string
  colors?: string[]
}
