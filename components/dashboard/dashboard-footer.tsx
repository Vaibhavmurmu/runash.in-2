import { cn } from "@/lib/utils"
import { Link } from "@nextui-org/react"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardFooterProps {
  className?: string
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  return (
    <footer className="w-full mt-4 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-1 text-xs">
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
        <a href="#terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
        <Separator orientation="vertical" />
        <a href="#privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
        <Separator orientation="vertical" />
        <a href="#security" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a>
        <Separator orientation="vertical" />
        <a href="#status" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Status</a>
        <Separator orientation="vertical" />
        <a href="#community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a>
        <Separator orientation="vertical" />
        <a href="#docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
        <Separator orientation="vertical" />
        <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
        <Separator orientation="vertical" />
        <a href="#cookies" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">cookies</a>
        </div>
      </nav>
      
      {/* <div className="text-xs mb-1">RunAsh Research Lab</div>
      <div className="flex items-center gap-2 text-xs">
        <Mail size={16} className="text-[#b1bac4]" aria-label="Mail" />
        <span>hi@runash.in.</span>
      </div> */}
      <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} RunAsh.AI. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for creators worldwide</span>
          </div>
        </div>
    </footer>
  )
}



