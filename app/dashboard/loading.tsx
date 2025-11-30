import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
