"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Video,
  Users,
  BarChart3,
  Zap,
  Play,
  MessageSquare,
  Shield,
  HelpCircle,
  LogOut,
  User,
  CreditCard,
  Bell,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Home,
  Tv,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  AlertTriangle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"

const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@runash.ai",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "RunAsh Creator Studio",
      logo: GalleryVerticalEnd,
      plan: "Creator",
    },
    {
      name: "TechStream Business",
      logo: AudioWaveform,
      plan: "Business",
    },
    {
      name: "Gaming Hub Pro",
      logo: Command,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Live Streaming",
      url: "#",
      icon: Video,
      badge: "3 Live",
      items: [
        {
          title: "Go Live",
          url: "#",
          icon: Play,
        },
        {
          title: "Stream Manager",
          url: "#",
          icon: Tv,
        },
        {
          title: "Stream History",
          url: "#",
          icon: Clock,
        },
        {
          title: "Stream Settings",
          url: "#",
          icon: Settings2,
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Performance",
          url: "#",
          icon: TrendingUp,
        },
        {
          title: "Audience",
          url: "#",
          icon: Users,
        },
        {
          title: "Revenue",
          url: "#",
          icon: DollarSign,
        },
        {
          title: "Engagement",
          url: "#",
          icon: Eye,
        },
      ],
    },
    {
      title: "AI Tools",
      url: "#",
      icon: Bot,
      badge: "New",
      items: [
        {
          title: "Content Generator",
          url: "#",
          icon: Zap,
        },
        {
          title: "Auto Highlights",
          url: "#",
          icon: Frame,
        },
        {
          title: "Chat Moderation",
          url: "#",
          icon: Shield,
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Chat Management",
          url: "#",
          icon: MessageSquare,
        },
        {
          title: "Subscribers",
          url: "#",
          icon: Users,
        },
        {
          title: "Moderators",
          url: "#",
          icon: Shield,
        },
      ],
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
      badge: "AI",
    },
    {
      title: "Storage",
      url: "/storage",
      icon: Frame,
    },
    {
      title: "Account",
      url: "#",
      icon: User,
      items: [
        {
          title: "Profile",
          url: "/account/profile",
          icon: User,
        },
        {
          title: "Billing",
          url: "/account/billing",
          icon: CreditCard,
        },
        {
          title: "Security",
          url: "/account/security",
          icon: Shield,
        },
        {
          title: "Notifications",
          url: "/account/notifications",
          icon: Bell,
        },
        {
          title: "Preferences",
          url: "/account/preferences",
          icon: Settings2,
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Shield,
      badge: "Admin",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: BarChart3,
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Feature Flags",
          url: "/admin/features",
          icon: Zap,
        },
        {
          title: "System Alerts",
          url: "/admin/alerts",
          icon: AlertTriangle,
        },
        {
          title: "Activity Logs",
          url: "/admin/logs",
          icon: Clock,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Tech Talk Series",
      url: "#",
      icon: Frame,
      status: "live",
    },
    {
      name: "Gaming Marathon",
      url: "#",
      icon: PieChart,
      status: "scheduled",
    },
    {
      name: "Tutorial Streams",
      url: "#",
      icon: Map,
      status: "draft",
    },
  ],
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{activeTeam.name}</span>
                      <span className="truncate text-xs">{activeTeam.plan}</span>
                    </div>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                  {data.teams.map((team, index) => (
                    <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-sm border bg-gradient-to-br from-orange-400 to-orange-600">
                        <team.logo className="size-4 shrink-0 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-xs text-muted-foreground">{team.plan}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Add workspace</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "New" || item.badge === "AI" ? "default" : "secondary"}
                            className="ml-auto h-5 px-1.5 text-xs bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-lg" side="bottom" align="end">
                      <DropdownMenuItem>
                        <Play className="text-muted-foreground" />
                        <span>Start Stream</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings2 className="text-muted-foreground" />
                        <span>Edit Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="text-muted-foreground" />
                        <span>View Analytics</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <Plus className="text-sidebar-foreground/70" />
                  <span>New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                    <ChevronRight className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                          AJ
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{data.user.name}</span>
                        <span className="truncate text-xs">{data.user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">RunAsh AI Platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4 max-w-md">
            <SearchBar
              onSearch={(query, filters) => {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
              }}
              placeholder="Search users, streams, files..."
              className="w-full"
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
