import { cn } from "@/lib/utils"
import { Link } from "@nextui-org/react"

interface DashboardFooterProps {
  className?: string
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  return (
    <footer className={cn("w-full border-t", className)}>
      <div className="container flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Acme Corp. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
            Help Center
          </Link>
          <Link href="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">
            Integrations
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
