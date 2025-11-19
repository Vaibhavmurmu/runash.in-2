'use client'

import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-8 right-8 z-40 p-3 rounded-lg bg-card border border-border hover:border-accent/50 transition group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <div className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
          <Sun size={24} className="text-yellow-500" />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}>
          <Moon size={24} className="text-blue-400" />
        </div>
      </div>
    </button>
  )
}
