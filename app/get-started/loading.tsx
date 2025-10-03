export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md animate-pulse space-y-4">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-40 w-full bg-muted rounded" />
      </div>
    </div>
  )
}
