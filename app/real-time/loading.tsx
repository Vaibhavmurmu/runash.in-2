import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-40 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-40 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-md h-screen sticky top-16 overflow-y-auto p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10 rounded-lg" />
          ))}
        </div>

        {/* Content Area Skeleton */}
        <div className="flex-1 p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-96 h-4" />
          </div>

          {/* Search Bar */}
          <Skeleton className="w-full h-12 rounded-lg" />

          {/* Cards Grid */}
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 bg-card/50 border border-border/50">
                <div className="space-y-4">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <div className="flex gap-2 pt-4">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="w-16 h-6 rounded" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
