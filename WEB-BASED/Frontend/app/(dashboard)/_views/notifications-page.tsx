"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, ChevronRight, Loader2, RefreshCw } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getNotificationTag, resolveNotificationDestination } from "@/lib/notifications"
import { toast } from "sonner"

export default function NotificationsPage() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const {
    notifications,
    fetchNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const unreadCount = getUnreadNotificationCount()

  useEffect(() => {
    const loadNotifications = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      await fetchNotifications(currentUser.id)
      setLoading(false)
    }

    void loadNotifications()
  }, [currentUser?.id, fetchNotifications])

  const visibleNotifications = useMemo(() => {
    return showUnreadOnly ? notifications.filter((notification) => !notification.read) : notifications
  }, [notifications, showUnreadOnly])

  const handleOpenNotification = async (notificationId: string, link: string | null) => {
    await markNotificationRead(notificationId)

    const destination = resolveNotificationDestination(link)
    if (destination) {
      router.push(destination)
      return
    }

    toast.info("This notification was cleared, but it does not have a destination page yet.")
  }

  const handleRefresh = async () => {
    if (!currentUser?.id) return
    setLoading(true)
    await fetchNotifications(currentUser.id)
    setLoading(false)
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 p-6 shadow-xl shadow-slate-200/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                <Bell className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">Alerts Center</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-800">Notifications</h1>
                <p className="mt-2 text-slate-500">
                  Open assignment, review, approval, and follow-up alerts from one place.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-cyan-200 bg-cyan-50 px-3 py-1.5 text-cyan-700">{notifications.length} total</Badge>
            <Badge className="border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700">{unreadCount} unread</Badge>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={showUnreadOnly ? "outline" : "default"}
            onClick={() => setShowUnreadOnly(false)}
            className={cn("rounded-xl", !showUnreadOnly && "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700")}
          >
            All Notifications
          </Button>
          <Button
            type="button"
            variant={showUnreadOnly ? "default" : "outline"}
            onClick={() => setShowUnreadOnly(true)}
            className={cn("rounded-xl", showUnreadOnly && "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700")}
          >
            Unread Only
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleRefresh()} className="rounded-xl">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {unreadCount > 0 ? (
            <Button type="button" variant="outline" onClick={() => void handleMarkAllRead()} className="rounded-xl">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading notifications...
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-800">No notifications to show</p>
              <p className="mt-2 text-sm text-slate-500">
                {showUnreadOnly ? "You have already cleared every unread alert." : "New assignments and review updates will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleOpenNotification(notification.id, notification.link)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                    notification.read
                      ? "border-slate-200 bg-white hover:border-cyan-200"
                      : "border-cyan-200 bg-gradient-to-r from-cyan-50/70 to-white shadow-cyan-100/50"
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className={cn("mt-1 h-3 w-3 rounded-full", notification.read ? "bg-slate-300" : "bg-cyan-500 shadow-lg shadow-cyan-500/30")} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-800">{notification.title}</p>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {getNotificationTag(notification)}
                          </span>
                          {!notification.read ? (
                            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
