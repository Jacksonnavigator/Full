export interface NotificationLike {
  id: string
  title: string
  type: string
  link: string | null
  data?: Record<string, unknown> | null
}

export function getNotificationTag(notification: Pick<NotificationLike, "type" | "title" | "data">) {
  const kind = typeof notification.data?.notificationKind === "string" ? notification.data.notificationKind : ""
  const normalizedTitle = notification.title.toLowerCase()

  if (kind === "team_leader_action" || normalizedTitle.includes("review")) return "Review"
  if (normalizedTitle.includes("assigned")) return "Assignment"
  if (normalizedTitle.includes("approved")) return "Approval"
  if (normalizedTitle.includes("rework") || normalizedTitle.includes("follow-up")) return "Rework"
  if (kind === "dma_action" || normalizedTitle.includes("dma")) return "DMA"
  return notification.type.charAt(0).toUpperCase() + notification.type.slice(1)
}

export function resolveNotificationDestination(link: string | null | undefined) {
  if (!link) return null
  if (link.startsWith("/")) return link

  try {
    const parsed = new URL(link)
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return null
  }
}
