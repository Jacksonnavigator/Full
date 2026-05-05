"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Sparkles,
  Moon,
  Sun,
  HelpCircle,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  Settings,
} from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotificationTag, resolveNotificationDestinationWithData } from "@/lib/notifications"
import { DEFAULT_WEB_UI_PREFERENCES, loadWebUiPreferences, subscribeToWebUiPreferences } from "@/lib/user-preferences"

export function TopNavbar() {
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const {
    reports,
    notifications,
    fetchNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDataStore()
  const { theme, setTheme } = useTheme()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [markingAllRead, setMarkingAllRead] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [uiPreferences, setUiPreferences] = useState(DEFAULT_WEB_UI_PREFERENCES)

  const unreadCount = getUnreadNotificationCount()
  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications])
  const isDarkMode = mounted && theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const syncPreferences = () => {
      setUiPreferences(loadWebUiPreferences())
    }

    syncPreferences()
    return subscribeToWebUiPreferences(syncPreferences)
  }, [mounted])

  const scopedReports = useMemo(() => {
    if (!currentUser) return []
    if (currentUser.role === "admin") return reports
    if (currentUser.role === "utility_manager") {
      return reports.filter((report) => report.utilityId === currentUser.utilityId)
    }
    if (currentUser.role === "dma_manager") {
      return reports.filter((report) => report.dmaId === currentUser.dmaId)
    }
    return reports
  }, [currentUser, reports])

  const resolvedCount = useMemo(
    () => scopedReports.filter((report) => report.status === "approved" || report.status === "closed").length,
    [scopedReports]
  )
  const pendingCount = useMemo(
    () => scopedReports.filter((report) => ["new", "assigned", "in_progress", "pending_approval"].includes(report.status)).length,
    [scopedReports]
  )
  const efficiency = scopedReports.length > 0 ? Math.round((resolvedCount / scopedReports.length) * 1000) / 10 : 0

  useEffect(() => {
    if (!currentUser?.id) return

    let active = true
    const loadNotifications = async () => {
      if (!active) return
      setNotificationsLoading(true)
      try {
        await fetchNotifications(currentUser.id)
      } finally {
        if (active) {
          setNotificationsLoading(false)
        }
      }
    }

    void loadNotifications()
    const intervalId = window.setInterval(() => {
      void fetchNotifications(currentUser.id)
    }, uiPreferences.notificationRefreshSeconds * 1000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [currentUser?.id, fetchNotifications, uiPreferences.notificationRefreshSeconds])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleProfile = () => {
    router.push("/dashboard/profile")
  }

  const handleSettings = () => {
    router.push("/dashboard/settings?section=preferences")
  }

  const handleHelp = () => {
    router.push("/dashboard/settings?section=help")
  }

  const handleOpenNotificationsPage = () => {
    setNotificationsOpen(false)
    router.push("/dashboard/notifications")
  }

  const handleOpenNotification = async (
    notificationId: string,
    title: string,
    type: string,
    link: string | null,
    data?: Record<string, unknown> | null
  ) => {
    await markNotificationRead(notificationId)
    setNotificationsOpen(false)

    const resolution = resolveNotificationDestinationWithData({
      id: notificationId,
      title,
      type,
      link,
      data,
    })
    router.push(resolution.destination || "/dashboard/notifications")
  }

  const handleMarkAllRead = async () => {
    setMarkingAllRead(true)
    try {
      await markAllNotificationsRead()
    } finally {
      setMarkingAllRead(false)
    }
  }

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-amber-500 to-orange-600"
      case "utility_manager":
        return "from-cyan-500 to-blue-600"
      case "dma_manager":
        return "from-emerald-500 to-teal-600"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "utility_manager":
        return "Utility Manager"
      case "dma_manager":
        return "DMA Manager"
      default:
        return "User"
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full overflow-hidden">
      {/* Gradient Background with Glass Effect */}
      <div className="relative flex h-16 w-full items-center justify-between gap-4 border-b border-gray-300 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 px-4 backdrop-blur-xl sm:px-6">
        {/* Animated Background Patterns */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Sidebar Trigger with Glow */}
          <div className="relative shrink-0">
            <SidebarTrigger className="-ml-1 text-white/70 transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </div>

          {/* Styled MajiScope Name - Mobile Only */}
          <div className="flex min-w-0 items-center gap-2.5 md:hidden">
            <div className="relative shrink-0">
              <div className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-500/30 blur-md" />
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 ring-1 ring-white/10">
                <Image
                  src="/logo1.png"
                  alt="MajiScope Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="truncate text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                Maji
              </span>
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Scope
              </span>
            </span>
          </div>
        </div>

        {/* Center Content - Quick Stats, Theme, Help, Notifications */}
        <div className="relative z-10 flex flex-1 items-center justify-center gap-1.5 sm:gap-3">
          {/* Quick Stats - Desktop Only */}
          {uiPreferences.showHeaderStats ? (
            <div className="hidden items-center gap-4 rounded-xl bg-white/5 px-4 py-2 ring-1 ring-white/10 xl:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Resolved</span>
                <span className="text-sm font-bold text-white">{resolvedCount.toLocaleString("en-US")}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Pending</span>
                <span className="text-sm font-bold text-white">{pendingCount.toLocaleString("en-US")}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Efficiency</span>
                <span className="text-sm font-bold text-emerald-400">{efficiency.toFixed(1)}%</span>
              </div>
            </div>
            </div>
          ) : null}
          {/* Theme Toggle MORDERN */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="relative h-9 w-9 rounded-xl text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-cyan-400"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHelp}
            className="relative hidden h-9 w-9 rounded-xl text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-cyan-400 sm:flex"
            aria-label="Open help and support"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-cyan-400"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-1 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 rounded-xl border-white/10 bg-slate-900/95 p-0 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold text-white">Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-400">
                    {unreadCount} unread
                  </span>
                  {unreadCount > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleMarkAllRead()}
                      disabled={markingAllRead}
                      className="h-7 rounded-lg px-2 text-xs text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      {markingAllRead ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="max-h-80 overflow-auto p-2">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg px-3 py-8 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading notifications...
                  </div>
                ) : recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void handleOpenNotification(notification.id, notification.title, notification.type, notification.link, notification.data)}
                      className={`flex w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5 ${
                        notification.read ? "" : "bg-cyan-500/5"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          notification.read ? "bg-slate-500/20" : "bg-cyan-500/20"
                        }`}
                      >
                        {notification.read ? (
                          <Clock className="h-4 w-4 text-slate-300" />
                        ) : (
                          <Bell className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">{notification.title}</p>
                          {!notification.read ? (
                            <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{notification.message}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                            {getNotificationTag(notification)}
                          </span>
                          <p className="text-[10px] text-slate-500">{formatNotificationTime(notification.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-lg px-3 py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-slate-500" />
                    <p className="mt-3 text-sm font-medium text-white">No notifications yet</p>
                    <p className="mt-1 text-xs text-slate-400">Assignments, approvals, and alerts will appear here.</p>
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 p-2">
                <Button
                  variant="ghost"
                  onClick={handleOpenNotificationsPage}
                  className="w-full justify-center rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Divider */}
          <div className="hidden h-8 w-px bg-white/10 sm:block" />

          {/* User Profile Dropdown - Always at Right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex h-auto items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/10 sm:px-3"
              >
                {/* Avatar with Glow */}
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50 blur-sm" />
                  
                  <Avatar className="relative h-12 w-12 ring-2 ring-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-lg font-semibold text-white">
                      {currentUser?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Online Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                {/* User Info - Desktop */}
                <div className="hidden flex-col items-start sm:flex">
                  <span className="text-sm font-semibold text-white">
                    {currentUser?.name || "User"}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${getRoleBadgeColor(currentUser?.role || "")} px-1.5 py-0.5 text-[9px] font-medium text-white`}>
                    <Sparkles className="h-2 w-2" />
                    {getRoleLabel(currentUser?.role || "")}
                  </span>
                </div>

                <ChevronDown className="hidden h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="z-[9999] w-72 rounded-xl border-white/10 bg-slate-900/95 p-0 backdrop-blur-xl"
            >
              {/* Profile Header */}
              <div className="relative overflow-hidden border-b border-white/10 p-4">
                {/* Background Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
                
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50 blur" />
                
                    
                    <Avatar className="relative h-8 w-8 ring-2 ring-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-sm font-semibold text-white">
                        {currentUser?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {currentUser?.name || "User"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentUser?.email || "Email unavailable"}
                    </span>
                    <span className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r ${getRoleBadgeColor(currentUser?.role || "")} px-2 py-0.5 text-[10px] font-medium text-white`}>
                      <Shield className="h-2.5 w-2.5" />
                      {getRoleLabel(currentUser?.role || "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                      <User className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">View Profile</span>
                      <span className="text-[10px] text-slate-500">Manage your account details</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleSettings}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Settings className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Settings</span>
                      <span className="text-[10px] text-slate-500">Update preferences and support options</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleOpenNotificationsPage}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                      <Activity className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Notifications</span>
                      <span className="text-[10px] text-slate-500">Review your latest assignments and alerts</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-white/10" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                    <LogOut className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Sign Out</span>
                    <span className="text-[10px] text-red-400/70">End your current session</span>
                  </div>
                </DropdownMenuItem>
              </div>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
