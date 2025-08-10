"use client"

import { Button } from "@/components/ui/button"
import { Github, Menu, X, Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react

export default function Banner() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  return (
      {/* Top Banner */}
      showBanner && (
        <div className="bg-gradient-to-r from-orange-600 to-yello-600 text-white py-2 px-4 text-center text-sm relative">
          <div className="flex items-center justify-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>
              🎉 New AI Video Generation Model Released!{" "}
              <Link href="/blog/new-model" className="underline font-semibold hover:text-orange-200">
                Learn more
              </Link>
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    )
}
