"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ReactNode } from "react"

interface CharacterStatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: ReactNode
  color?: "primary" | "success" | "warning" | "danger" | "info"
  trend?: number // percentage change
  className?: string
}

const colorClasses = {
  primary: {
    bg: "bg-[var(--primary-soft)]",
    text: "text-[var(--primary)]",
    iconBg: "bg-[var(--primary)]",
  },
  success: {
    bg: "bg-[var(--success-soft)]",
    text: "text-[var(--success)]",
    iconBg: "bg-[var(--success)]",
  },
  warning: {
    bg: "bg-[var(--warning-soft)]",
    text: "text-[var(--warning)]",
    iconBg: "bg-[var(--warning)]",
  },
  danger: {
    bg: "bg-[var(--danger-soft)]",
    text: "text-[var(--danger)]",
    iconBg: "bg-[var(--danger)]",
  },
  info: {
    bg: "bg-[var(--info-soft)]",
    text: "text-[var(--info)]",
    iconBg: "bg-[var(--info)]",
  },
}

export function CharacterStatCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend,
  className,
}: CharacterStatCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center",
                colors.bg,
                colors.text
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <p className="text-stat-lg text-[var(--text-primary)]">
              {typeof value === "number"
                ? value > 0
                  ? `+${value.toLocaleString("id-ID")}`
                  : value.toLocaleString("id-ID")
                : value}
            </p>
            <p className="text-[13px] text-[var(--text-muted)]">{title}</p>
          </div>
        </div>

        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full",
              trend >= 0
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]"
            )}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[12px] text-[var(--text-muted)] mt-2">{subtitle}</p>
      )}
    </Card>
  )
}
