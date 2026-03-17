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

export function AppSidebar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuthStore()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

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
      className="border-r-0 bg-white shadow-xl shadow-slate-200/50"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 pointer-events-none" />
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" />
      
      {/* Ambient glow effects - only show when not collapsed */}
      {!isCollapsed && (
        <>
          <div className="absolute top-20 -left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <SidebarHeader className={cn(
        "border-b border-slate-100 relative",
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 animate-pulse" />
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </>
            )}
            
            <div className={cn(
              "relative flex items-center justify-center rounded-xl border border-cyan-100 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow duration-500 bg-gradient-to-br from-white via-cyan-50 to-white",
              isCollapsed ? "h-10 w-10" : "h-full w-full rounded-2xl"
            )}>
              <img 
                src="/logo1.png" 
                alt="HydraNet Logo" 
                className={cn(
                  "object-contain",
                  isCollapsed ? "h-6 w-6" : "h-9 w-9"
                )}
              />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                HydraNet
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-600/60">
                Water Intelligence
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-wider">System Online</span>
              </div>
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
            "text-slate-400 text-[10px] uppercase tracking-[0.15em] font-semibold mb-2",
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
                      tooltip={item.title}
                      className={cn(
                        "relative transition-all duration-300 ease-out",
                        isCollapsed ? "h-11 w-11 justify-center rounded-xl mx-auto" : "h-12 w-full rounded-xl justify-start px-4",
                        isActive 
                          ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:shadow-xl" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-cyan-50",
                        "group overflow-hidden"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link 
                        href={item.href} 
                        className={cn(
                          "flex items-center h-full w-full",
                          isCollapsed ? "justify-center" : "gap-4"
                        )}
                      >
                        <div className={cn(
                          "relative flex items-center justify-center rounded-lg transition-all duration-300",
                          isActive 
                            ? "bg-white/20 h-8 w-8" 
                            : isCollapsed 
                              ? "h-8 w-8 bg-slate-100 group-hover:bg-cyan-100"
                              : "h-8 w-8 bg-slate-100 group-hover:bg-cyan-100"
                        )}>
                          <item.icon className={cn(
                            "transition-all duration-300",
                            isActive 
                              ? "h-5 w-5 text-white drop-shadow-sm" 
                              : "h-5 w-5 text-cyan-600 group-hover:scale-110"
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
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        )}
                        
                        {/* Hover glow line */}
                        {!isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full group-hover:h-6 transition-all duration-300" />
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
        "border-t border-slate-100 bg-gradient-to-b from-slate-50/50 to-white relative",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "transition-all duration-300 rounded-xl",
                    isCollapsed ? "p-2 h-11 w-11 justify-center mx-auto data-[state=open]:bg-cyan-50" : "p-3 data-[state=open]:bg-cyan-50 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50"
                  )}
                >
                  <div className="relative">
                    <Avatar className={cn(
                      "border-2 border-cyan-200 shadow-md shadow-cyan-500/10",
                      isCollapsed ? "h-9 w-9" : "h-11 w-11"
                    )}>
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 text-white text-sm font-bold">
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
                      <span className="truncate text-xs text-cyan-600 flex items-center gap-1.5 font-medium">
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
                className="w-60 bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl"
              >
                <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-cyan-200">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold">
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
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 m-1 rounded-lg"
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