"use client"

import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import DemoSection from "@/components/demo-section"

export default function AIEditorPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      
    </main>
  )
}
