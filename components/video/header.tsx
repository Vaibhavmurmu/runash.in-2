'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
              RA
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RunAsh
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-accent transition">Features</a>
            <a href="#capabilities" className="text-sm hover:text-accent transition">Capabilities</a>
            <a href="#chat" className="text-sm hover:text-accent transition">Chat</a>
            <a href="#about" className="text-sm hover:text-accent transition">About</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2 text-sm border border-primary hover:bg-primary/10 rounded-full transition">
              Sign In
            </button>
            <button className="px-6 py-2 text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full hover:opacity-90 transition">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <a href="#features" className="block text-sm hover:text-accent transition">Features</a>
            <a href="#capabilities" className="block text-sm hover:text-accent transition">Capabilities</a>
            <a href="#chat" className="block text-sm hover:text-accent transition">Chat</a>
            <a href="#about" className="block text-sm hover:text-accent transition">About</a>
            <div className="flex gap-3 pt-4">
              <button className="flex-1 px-4 py-2 text-sm border border-primary rounded-full transition">
                Sign In
              </button>
              <button className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full">
                Get Started
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
