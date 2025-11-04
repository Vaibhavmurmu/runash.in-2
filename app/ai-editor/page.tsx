"use client"

import { useState, useEffect } from "react"
{/* import Header from "@/components/header" */}
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import DemoSection from "@/components/demo-section"
import Footer from "@/components/footer"

export default function AIEditorPage() {
  {/* const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  } */}

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      {/* <HeroSection /> */}
      <FeaturesSection />
      <DemoSection />
      <Footer />
    </main>
  )
 }
