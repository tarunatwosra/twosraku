"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { BehaviorType } from "@/types/character"
import { ThumbsUp, ThumbsDown, Info } from "lucide-react"

interface BehaviorCardProps {
  behavior: BehaviorType
  categoryColor?: string
  onClick?: () => void
  isSelected?: boolean
  compact?: boolean
}

export function BehaviorCard({
  behavior,
  categoryColor = "#6B7280",
  onClick,
  isSelected = false,
  compact = false,
}: BehaviorCardProps) {
  const isPositive = behavior.direction === "positive"

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border transition-all duration-200 text-left",
        compact ? "p-3" : "p-4",
        isSelected
          ? isPositive
            ? "border-[var(--success)] bg-[var(--success-soft)]/30"
            : "border-[var(--danger)] bg-[var(--danger-soft)]/30"
          : isPositive
          ? "border-[var(--success)]/20 hover:border-[var(--success)] hover:bg-[var(--success-soft)]/20"
          : "border-[var(--danger)]/20 hover:border-[var(--danger)] hover:bg-[var(--danger-soft)]/20",
        "hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${categoryColor}15` }}
        >
          {isPositive ? (
            <ThumbsUp className="w-5 h-5 text-[var(--success)]" />
          ) : (
            <ThumbsDown className="w-5 h-5 text-[var(--danger)]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
              {behavior.name}
            </p>
            <Badge
              variant={isPositive ? "success" : "danger"}
              className="text-[10px] shrink-0"
            >
              {isPositive ? "+" : ""}
              {behavior.pointValue}
            </Badge>
          </div>
          {behavior.description && (
            <p className="text-[12px] text-[var(--text-muted)] line-clamp-2">
              {behavior.description}
            </p>
          )}
          {behavior.severity && !compact && (
            <p className="text-[11px] text-[var(--text-muted)] mt-1 capitalize flex items-center gap-1">
              <Info className="w-3 h-3" />
              Severity: {behavior.severity}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

interface BehaviorListProps {
  behaviors: BehaviorType[]
  selectedBehaviors: string[]
  categoryColors: Record<string, string>
  onBehaviorToggle: (behaviorId: string) => void
  className?: string
}

export function BehaviorList({
  behaviors,
  selectedBehaviors,
  categoryColors,
  onBehaviorToggle,
  className,
}: BehaviorListProps) {
  if (behaviors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--text-muted)] text-[14px]">
          Tidak ada perilaku yang sesuai filter
        </p>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {behaviors.map((behavior) => (
        <BehaviorCard
          key={behavior.id}
          behavior={behavior}
          categoryColor={categoryColors[behavior.categoryId]}
          isSelected={selectedBehaviors.includes(behavior.id)}
          onClick={() => onBehaviorToggle(behavior.id)}
        />
      ))}
    </div>
  )
}
