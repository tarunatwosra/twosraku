"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Trophy, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { CharacterCategoryRecord } from "@/types/character"

interface StudentLeaderboardProps {
  title: string
  subtitle?: string
  students: {
    id: string
    name: string
    className?: string
    points: number
    avatar?: string
  }[]
  type: "positive" | "negative"
  maxDisplay?: number
  onStudentClick?: (studentId: string) => void
}

const medalColors = {
  0: { bg: "bg-[var(--warning)]", text: "text-white" },
  1: { bg: "bg-[var(--text-muted)]", text: "text-white" },
  2: { bg: "bg-[var(--warning-soft)]", text: "text-[var(--warning)]" },
}

export function StudentLeaderboard({
  title,
  subtitle,
  students,
  type,
  maxDisplay = 5,
  onStudentClick,
}: StudentLeaderboardProps) {
  const displayStudents = students.slice(0, maxDisplay)
  const isPositive = type === "positive"

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {isPositive ? (
            <Trophy className="w-5 h-5 text-[var(--success)]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
          )}
          <div>
            <h3 className="text-h5 font-semibold text-[var(--text-primary)]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[12px] text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        </div>
        <Badge
          variant={isPositive ? "success" : "danger"}
          className="text-[11px]"
        >
          {isPositive ? "Positif" : "Negatif"}
        </Badge>
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {displayStudents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-muted)] text-[14px]">
              Belum ada data siswa
            </p>
          </div>
        ) : (
          displayStudents.map((student, index) => {
            const medalStyle = medalColors[index as keyof typeof medalColors]
            return (
              <button
                key={student.id}
                onClick={() => onStudentClick?.(student.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl",
                  "bg-[var(--surface-secondary)]",
                  "hover:bg-[var(--surface-hover)]",
                  "transition-all duration-200",
                  "text-left"
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    "text-[13px] font-bold",
                    medalStyle
                      ? `${medalStyle.bg} ${medalStyle.text}`
                      : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                  )}
                >
                  {index + 1}
                </div>

                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-[12px] bg-[var(--primary-soft)] flex items-center justify-center text-[13px] font-semibold text-[var(--primary)]">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                    {student.name}
                  </p>
                  {student.className && (
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {student.className}
                    </p>
                  )}
                </div>

                {/* Points */}
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
                  )}
                  <span
                    className={cn(
                      "text-[14px] font-semibold",
                      isPositive
                        ? "text-[var(--success)]"
                        : "text-[var(--danger)]"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {student.points}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </Card>
  )
}
