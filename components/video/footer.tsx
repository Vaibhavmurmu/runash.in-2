'use client'

import { Github, MessageCircle, Book, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-primary/10 border-t border-border">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                RA
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RunAsh
              </span>
            </div>
            <p className="text-sm text-foreground/60">
              Real-time AI video generation platform for the future
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition">Features</a></li>
              <li><a href="#" className="hover:text-accent transition">Pricing</a></li>
              <li><a href="#" className="hover:text-accent transition">Docs</a></li>
              <li><a href="#" className="hover:text-accent transition">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-accent transition">Community</a></li>
              <li><a href="#" className="hover:text-accent transition">Support</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition group">
                <Github size={18} className="group-hover:translate-x-1 transition" />
                GitHub
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition group">
                <Book size={18} className="group-hover:translate-x-1 transition" />
                Hugging Face
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition group">
                <MessageCircle size={18} className="group-hover:translate-x-1 transition" />
                Kaggle
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition group">
                <Heart size={18} className="group-hover:translate-x-1 transition" />
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
          <p>
            © 2025 RunAsh. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition">Terms of Service</a>
            <a href="#" className="hover:text-accent transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
