"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, ChevronUp, Sparkles } from "lucide-react"
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

export function AppSidebar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuthStore()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = !isMobile && state === "collapsed"

  if (!currentUser) return null

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(currentUser.role)
  )

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-slate-300/80 bg-sidebar shadow-[8px_0_24px_-26px_rgba(15,23,42,0.38)]"
    >
      {/* Calm enterprise surface */}
      <div className="absolute inset-0 bg-slate-200/45 pointer-events-none" />
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-400/70" />
      
      {/* Subtle depth effects - only show when not collapsed */}
      {!isCollapsed && (
        <>
          <div className="absolute top-24 -left-24 h-44 w-44 rounded-full bg-slate-900/[0.025] blur-3xl pointer-events-none" />
          <div className="absolute bottom-40 -right-24 h-44 w-44 rounded-full bg-slate-900/[0.02] blur-3xl pointer-events-none" />
        </>
      )}

      <SidebarHeader className={cn(
        "border-b border-slate-300/80 relative bg-slate-200/55 backdrop-blur-sm",
        isCollapsed ? "px-2 py-4" : "px-5 py-6"
      )}>
        <Link href="/dashboard" className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-4"
        )}>
          <div className={cn(
            "relative flex items-center justify-center",
            isCollapsed ? "h-10 w-10" : "h-14 w-14"
          )}>
            {/* Animated glow ring */}
            {!isCollapsed && (
              <>
                <div className="absolute inset-0 rounded-2xl bg-slate-800/[0.04]" />
                <div className="absolute inset-1 rounded-xl bg-slate-800/[0.025]" />
              </>
            )}
            
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
                        isCollapsed ? "h-11 w-11 justify-center rounded-xl mx-auto" : "h-12 w-full rounded-xl justify-start px-4",
                        isActive 
                          ? "bg-gradient-to-r from-sky-700 to-blue-700 text-white shadow-md shadow-slate-900/15 hover:from-sky-800 hover:to-blue-800 hover:shadow-lg hover:shadow-slate-900/20" 
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-300/55",
                        "group overflow-hidden"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={() => {
                          if (isMobile) setOpenMobile(false)
                        }}
                        className={cn(
                          "flex items-center h-full w-full",
                          isCollapsed ? "justify-center" : "gap-4"
                        )}
                      >
                        <div className={cn(
                          "relative flex items-center justify-center rounded-lg transition-all duration-300",
                          isActive 
                            ? "bg-white/[0.16] h-8 w-8" 
                            : isCollapsed 
                              ? "h-8 w-8 bg-slate-300/70 group-hover:bg-slate-400/40"
                              : "h-8 w-8 bg-slate-300/70 group-hover:bg-slate-400/40"
                        )}>
                          <item.icon className={cn(
                            "transition-all duration-300",
                            isActive 
                              ? "h-5 w-5 text-white drop-shadow-sm" 
                              : "h-5 w-5 text-slate-700 group-hover:scale-110"
                          )} />
                        </div>
                        
                        {!isCollapsed && (
                          <span className={cn(
                            "font-semibold text-sm tracking-wide",
                            isActive ? "text-white" : ""
                          )}>
                            {item.title}
                          </span>
                        )}
                        
                        {/* Active shimmer effect */}
                        {isActive && !isCollapsed && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        )}
                        
                        {/* Hover glow line */}
                        {!isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-slate-600 rounded-r-full group-hover:h-6 transition-all duration-300" />
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
        {/* Decorative bottom accent */}
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
                    {/* Online indicator with pulse */}
                    <span className={cn(
                      "absolute rounded-full bg-emerald-500 border-2 border-white shadow-sm",
                      isCollapsed ? "-bottom-0.5 -right-0.5 h-3 w-3" : "-bottom-0.5 -right-0.5 h-3.5 w-3.5"
                    )}>
                      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left text-sm leading-tight ml-2">
                      <span className="truncate font-semibold text-slate-800">
                        {currentUser.name}
                      </span>
                      <span className="truncate text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <Sparkles className="h-3 w-3" />
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
