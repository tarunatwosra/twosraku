"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { BehaviorType } from "@/types/character"
import { ThumbsUp, ThumbsDown, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecordItem {
  id: string
  studentId: string
  studentName: string
  studentClass?: string
  behaviorTypeId: string
  date: string
  description?: string
}

interface PointSummaryProps {
  records: Omit<RecordItem, "id">[]
  behaviors: BehaviorType[]
  onRemove?: (index: number) => void
  onSaveAll?: () => void
  isSaving?: boolean
  className?: string
}

export function PointSummary({
  records,
  behaviors,
  onRemove,
  onSaveAll,
  isSaving = false,
  className,
}: PointSummaryProps) {
  // Calculate totals
  const { totalPositive, totalNegative, netPoints } = useMemo(() => {
    return records.reduce(
      (acc, record) => {
        const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
        if (behavior?.direction === "positive") {
          acc.totalPositive += behavior.pointValue
        } else {
          acc.totalNegative += Math.abs(behavior?.pointValue || 0)
        }
        return acc
      },
      { totalPositive: 0, totalNegative: 0, netPoints: 0 }
    )
  }, [records, behaviors])

  const netPointsCalc = totalPositive - totalNegative

  if (records.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ThumbsUp className="w-7 h-7 text-[var(--text-muted)]" />
          </div>
          <p className="text-[14px] text-[var(--text-muted)]">
            Pilih perilaku untuk menambahkan catatan
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="p-5 border-b border-[var(--border-light)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Catatan Baru
            </h3>
            <p className="text-[12px] text-[var(--text-muted)]">
              {records.length} perilaku dipilih
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-stat-md font-bold",
                netPointsCalc >= 0
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              )}
            >
              {netPointsCalc >= 0 ? "+" : ""}
              {netPointsCalc}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Net Poin</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border-light)]">
          <div className="flex items-center gap-1.5 text-[13px]">
            <ThumbsUp className="w-4 h-4 text-[var(--success)]" />
            <span className="text-[var(--success)] font-medium">
              +{totalPositive}
            </span>
          </div>
          <span className="text-[var(--text-muted)]">|</span>
          <div className="flex items-center gap-1.5 text-[13px]">
            <ThumbsDown className="w-4 h-4 text-[var(--danger)]" />
            <span className="text-[var(--danger)] font-medium">
              -{totalNegative}
            </span>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-2">
        {records.map((record, index) => {
          const behavior = behaviors.find(
            (b) => b.id === record.behaviorTypeId
          )
          const isPositive = behavior?.direction === "positive"

          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-xl border",
                isPositive
                  ? "border-[var(--success)]/30 bg-[var(--success-soft)]/10"
                  : "border-[var(--danger)]/30 bg-[var(--danger-soft)]/10"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                      {behavior?.name || "Tidak ditemukan"}
                    </p>
                    <Badge
                      variant={isPositive ? "success" : "danger"}
                      className="text-[10px] shrink-0"
                    >
                      {isPositive ? "+" : ""}
                      {behavior?.pointValue}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {record.studentName}
                    {record.studentClass && ` • ${record.studentClass}`}
                  </p>
                  {record.description && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-1">
                      {record.description}
                    </p>
                  )}
                </div>
                {onRemove && (
                  <button
                    onClick={() => onRemove(index)}
                    className="w-6 h-6 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {onSaveAll && (
        <div className="p-4 border-t border-[var(--border-light)]">
          <Button
            onClick={onSaveAll}
            isLoading={isSaving}
            className="w-full gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan {records.length} Catatan
          </Button>
        </div>
      )}
    </Card>
  )
}
