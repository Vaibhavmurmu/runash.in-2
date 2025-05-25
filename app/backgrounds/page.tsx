import type { Metadata } from "next"
import BackgroundLibrary from "@/components/streaming/backgrounds/background-library"

export const metadata: Metadata = {
  title: "Virtual Background Library | RunAsh",
  description: "Access professional virtual backgrounds for your streams",
}

export default function BackgroundsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BackgroundLibrary />
    </div>
  )
}
