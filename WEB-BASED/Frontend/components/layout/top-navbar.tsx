"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, ChevronRight, Sparkles, Settings, Zap, Command } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { ROLE_SHORT_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

function getBreadcrumb(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean)
  return segments.map((s) => {
    // Check if segment looks like a UUID (8-4-4-4-12 format or long alphanumeric)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) ||
                   /^[a-z0-9]{20,}$/i.test(s)
    // If it's a UUID, show "Details" instead
    if (isUUID) return "Details"
    return s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  })
}

export function TopNavbar() {
  const pathname = usePathname()
  const { currentUser } = useAuthStore()
  const { notifications, getUnreadNotificationCount } =
    useDataStore()
  const breadcrumb = getBreadcrumb(pathname)
  const unreadCount = getUnreadNotificationCount()

  return (
    <header className="sticky top-0 z-50 flex h-24 items-center gap-5 border-b border-slate-200/60 bg-white/95 backdrop-blur-2xl px-8 relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/60 via-white to-blue-50/40 pointer-events-none" />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Bottom subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      <SidebarTrigger className="-ml-1 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-300 rounded-xl p-2.5 relative z-10 border border-transparent hover:border-cyan-200" />
      <Separator orientation="vertical" className="h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

      {/* Modern Breadcrumb */}
      <nav className="flex items-center gap-2.5 text-sm relative z-10" aria-label="Breadcrumb">
        {breadcrumb.map((segment, i) => (
          <span key={i} className="flex items-center gap-2.5">
            {i > 0 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/50">
                <ChevronRight className="h-3.5 w-3.5 text-cyan-500" />
              </div>
            )}
            <span
              className={cn(
                "transition-all duration-300 rounded-lg px-3 py-1.5",
                i === breadcrumb.length - 1
                  ? "font-semibold text-slate-800 bg-gradient-to-r from-cyan-100/70 to-blue-100/70 border border-cyan-200/60 shadow-sm shadow-cyan-500/5"
                  : "text-slate-500 hover:text-cyan-600 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 rounded-lg"
              )}
            >
              {segment}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-5 relative z-10">
        {/* Modern Search */}
        <div className="relative hidden lg:block group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
          <div className="relative flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
              <Search className="h-4.5 w-4.5" />
            </div>
            <Input
              placeholder="Search anything..."
              className="h-12 w-80 bg-slate-50/80 border-slate-200/80 pl-12 pr-16 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 font-mono text-[10px] font-medium text-slate-500 opacity-100 flex">
                <Command className="h-3 w-3" />
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-slate-50/80 border border-slate-200/50 hover:bg-white hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
          >
            <Zap className="h-4.5 w-4.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-slate-50/80 border border-slate-200/50 hover:bg-white hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
          >
            <Settings className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Modern Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-12 w-12 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:from-white hover:to-cyan-50 hover:border-cyan-200 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-cyan-500/10"
            >
              <Bell className="h-5 w-5 text-slate-500" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            align="end" 
            className="w-88 p-0 bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Bell className="h-4.5 w-4.5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Notifications
                </h4>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-200 font-medium px-3 py-1">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <Bell className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No notifications</p>
                  <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={cn(
                        "flex w-full flex-col gap-2 px-5 py-4 text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-transparent",
                        !notif.read && "bg-gradient-to-r from-cyan-50/30 to-transparent border-l-2 border-cyan-500"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {!notif.read && (
                          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
                        )}
                        <span className="text-sm font-semibold text-slate-800">
                          {notif.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 pl-5">
                        {notif.message}
                      </p>
                      <time className="text-[10px] text-slate-400 pl-5 font-medium">
                        {new Date(notif.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* User badge */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-3 pl-5 border-l border-slate-200">
            <Badge className="bg-gradient-to-r from-cyan-100 via-blue-100 to-cyan-100 text-cyan-700 border border-cyan-200/50 font-semibold text-xs px-4 py-2 shadow-sm hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {ROLE_SHORT_LABELS[currentUser.role]}
            </Badge>
          </div>
        )}
      </div>
    </header>
  )
}