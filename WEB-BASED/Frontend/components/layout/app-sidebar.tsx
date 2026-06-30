"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { MouseEvent } from "react"
import { LogOut, ChevronUp } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { NAV_ITEMS, ROLE_SHORT_LABELS } from "@/lib/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { BrandWordmark } from "@/components/shared/brand-wordmark"
import { cleanupHydraulicWorkspaceSession } from "@/lib/hydraulic-workspace"

const HYDRAULIC_TESTER_EMAIL = "admin2@hydranet.com"
const HYDRAULIC_NAV_ROUTES = new Set([
  "/dashboard/hydraulic-model",
  "/dashboard/hydraulic-reports",
])

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = !isMobile && state === "collapsed"
  const isHydraulicWorkspace = pathname === "/dashboard/hydraulic-model/workspace"

  if (!currentUser) return null

  const isHydraulicTester = currentUser.email?.trim().toLowerCase() === HYDRAULIC_TESTER_EMAIL
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles.includes(currentUser.role)) return false
    if (HYDRAULIC_NAV_ROUTES.has(item.href)) return isHydraulicTester
    return true
  })

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  async function handleWorkspaceNavigation(event: MouseEvent<HTMLElement>, href: string) {
    if (isMobile) setOpenMobile(false)
    if (!isHydraulicWorkspace || href === pathname) return

    event.preventDefault()
    await cleanupHydraulicWorkspaceSession()
    router.push(href)
  }

  return (
    <Sidebar 
      collapsible="icon" 
      overlayExpandedDesktop={isHydraulicWorkspace}
      className="border-r border-slate-300/80 bg-sidebar shadow-[8px_0_24px_-26px_rgba(15,23,42,0.38)]"
    >
      <div className="absolute inset-0 bg-slate-200/45 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-400/70" />

      <SidebarHeader className={cn(
        "border-b border-slate-300/80 relative bg-slate-200/55 backdrop-blur-sm",
        isCollapsed ? "px-2 py-4" : "px-5 py-6"
      )}>
        <Link href="/dashboard" onClick={(event) => void handleWorkspaceNavigation(event, "/dashboard")} className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-4"
        )}>
          <div className={cn(
            "relative flex items-center justify-center",
            isCollapsed ? "h-10 w-10" : "h-14 w-14"
          )}>
            <div className={cn(
              "relative flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 shadow-sm shadow-slate-900/[0.04] transition-shadow duration-500 hover:shadow-slate-900/[0.08]",
              isCollapsed ? "h-10 w-10" : "h-full w-full rounded-2xl"
            )}>
              <img 
                src="/logo1.png" 
                alt="MajiScope Logo" 
                className={cn(
                  "object-contain rounded-lg",
                  isCollapsed ? "h-6 w-6" : "h-9 w-9"
                )}
              />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col gap-0.5">
              <div className="inline-flex self-start rounded-xl bg-slate-950 px-3 py-2 shadow-lg shadow-slate-950/15">
                <BrandWordmark
                  size="sm"
                  theme="dark"
                  wordClassName="leading-none"
                  underlineClassName="mt-1 h-0.5"
                />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600 mt-2">
                Water Intelligence
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn(
        "flex flex-col h-full relative",
        isCollapsed ? "px-1 py-2" : "px-3 py-4"
      )}>
        <SidebarGroup className="flex-1 flex flex-col h-full">
          <SidebarGroupLabel className={cn(
            "text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold mb-2",
            isCollapsed ? "px-0 text-center hidden" : "px-2"
          )}>
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 flex flex-col">
            <SidebarMenu className={cn(
              "flex flex-col h-full",
              isCollapsed ? "gap-0 items-center justify-between flex-1" : "gap-1.5"
            )}>
              {visibleItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))

                return (
                  <SidebarMenuItem key={item.href} className={isCollapsed ? "w-full flex justify-center flex-1" : ""}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isMobile ? undefined : item.title}
                      className={cn(
                        "relative transition-all duration-300 ease-out",
                        isCollapsed ? "h-11 w-11 justify-center rounded-xl mx-auto" : "min-h-12 h-auto w-full rounded-xl justify-start px-4 py-2.5",
                        isActive 
                          ? "bg-gradient-to-r from-sky-700 to-blue-700 text-white shadow-md shadow-slate-900/15 hover:from-sky-800 hover:to-blue-800 hover:shadow-lg hover:shadow-slate-900/20" 
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-300/55",
                        "group overflow-hidden"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={(event) => void handleWorkspaceNavigation(event, item.href)}
                        className={cn(
                          "flex min-h-full w-full items-center",
                          isCollapsed ? "justify-center" : "gap-4"
                        )}
                      >
                        <div className="relative flex h-6 w-6 items-center justify-center">
                          <item.icon className={cn(
                            "transition-colors duration-200",
                            isActive 
                              ? "h-5 w-5 text-white" 
                              : "h-5 w-5 text-slate-700"
                          )} />
                        </div>
                        
                        {!isCollapsed && (
                          <span className={cn(
                            "max-w-[9.25rem] whitespace-normal break-words text-sm font-semibold leading-snug tracking-wide",
                            isActive ? "text-white" : ""
                          )}>
                            {item.title}
                          </span>
                        )}
                        
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(
        "border-t border-slate-300/80 bg-slate-200/55 relative",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "transition-all duration-300 rounded-xl",
                    isCollapsed ? "p-2 h-11 w-11 justify-center mx-auto data-[state=open]:bg-slate-300/60" : "p-3 data-[state=open]:bg-slate-300/60 hover:bg-slate-300/50"
                  )}
                >
                  <div className="relative">
                    <Avatar className={cn(
                      "border-2 border-slate-300 shadow-md shadow-slate-900/[0.06]",
                      isCollapsed ? "h-9 w-9" : "h-11 w-11"
                    )}>
                      <AvatarFallback className="bg-slate-800 text-white text-sm font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      "absolute rounded-full bg-emerald-500 border-2 border-white shadow-sm",
                      isCollapsed ? "-bottom-0.5 -right-0.5 h-3 w-3" : "-bottom-0.5 -right-0.5 h-3.5 w-3.5"
                    )} />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left text-sm leading-tight ml-2">
                      <span className="truncate font-semibold text-slate-800">
                        {currentUser.name}
                      </span>
                      <span className="truncate text-xs text-slate-600 font-medium">
                        {ROLE_SHORT_LABELS[currentUser.role]}
                      </span>
                    </div>
                  )}
                  {!isCollapsed && <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align={isCollapsed ? "center" : "start"}
                className="w-60 bg-card/95 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl"
              >
                <div className="p-3 bg-slate-100 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-slate-300">
                      <AvatarFallback className="bg-gradient-to-br from-sky-700 to-blue-700 text-white text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    window.location.href = "/login"
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 m-1 rounded-lg cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
