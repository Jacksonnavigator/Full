"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  suffix?: string
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  gradient?: "blue" | "emerald" | "amber" | "red" | "cyan"
  className?: string
}

const GRADIENT_MAP = {
  blue: "from-blue-600 to-blue-700",
  emerald: "from-emerald-600 to-emerald-700",
  amber: "from-amber-500 to-amber-600",
  red: "from-red-500 to-red-600",
  cyan: "from-cyan-600 to-cyan-700",
}

export function StatCard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  gradient = "blue",
  className,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setDisplayValue(current)
      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br p-5 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        GRADIENT_MAP[gradient],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight animate-count-up">
            {displayValue.toLocaleString()}
            {suffix}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-white/80">
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white/15 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {/* Decorative circle */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5" />
    </div>
  )
}
