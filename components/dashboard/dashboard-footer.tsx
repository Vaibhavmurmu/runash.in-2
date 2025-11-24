import React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardFooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

const currentYear = new Date().getFullYear()

function FooterLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}) {
  if (external) {
    return (
      <a
        href={href}
        className={cn("text-sm text-muted-foreground hover:underline", className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} className={cn("text-sm text-muted-foreground hover:underline", className)}>
      {children}
    </NextLink>
  )
}

export function DashboardFooter({ className, ...props }: DashboardFooterProps) {
  return (
    <footer
      role="contentinfo"
      className={cn(
        "w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding / Short summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                aria-hidden
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              >
                {/* Replace with real logo when available */}
                <span className="text-white font-semibold">RA</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-none">RunAsh.AI</h3>
                <p className="text-sm text-muted-foreground">Real-time live analytics for creators.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <FooterLink href="/status">Status</FooterLink>
              <Separator orientation="vertical" />
              <FooterLink href="/docs">Docs</FooterLink>
              <Separator orientation="vertical" />
              <FooterLink href="/help">Help</FooterLink>
            </div>
          </div>

          {/* Product links */}
          <nav aria-label="Footer navigation" className="space-y-2">
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/features">Features</FooterLink>
              </li>
              <li>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink href="/integrations">Integrations</FooterLink>
              </li>
              <li>
                <FooterLink href="/roadmap">Roadmap</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/blog">Blog</FooterLink>
              </li>
              <li>
                <FooterLink href="/guides">Guides</FooterLink>
              </li>
              <li>
                <FooterLink href="/support">Support</FooterLink>
              </li>
              <li>
                <FooterLink href="/learn">Learn</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact</h4>
            <div className="flex items-center space-x-3">
              <a
                href="mailto:hello@runash.ai"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
                aria-label="Email RunAsh.AI"
              >
                <Mail className="h-4 w-4" aria-hidden />
                hello@runash.ai
              </a>
            </div>

            <div>
              <h4 className="text-sm font-medium">Follow</h4>
              <div className="flex items-center space-x-3 mt-2">
                <a
                  href="https://github.com/your-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on GitHub"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/your-handle"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on Twitter"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/your-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on LinkedIn"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} RunAsh.AI. All rights reserved.</p>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" aria-hidden />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter
