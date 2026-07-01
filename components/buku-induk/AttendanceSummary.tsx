"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Card, Badge } from "@/components/ui"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface AttendanceStats {
  total: number
  present: number
  late: number
  permission: number
  sick: number
  absent: number
  percentage: number
}

interface AttendanceRecord {
  id: string
  date: string
  status: "present" | "late" | "permission" | "sick" | "absent"
  notes: string | null
}

interface AttendanceSummaryProps {
  studentId: string
  academicYearId?: string
}

// ============================================
// HELPERS
// ============================================

const STATUS_CONFIG = {
  present: {
    label: "Hadir",
    icon: CheckCircle,
    color: "success",
    bgColor: "bg-[var(--success-soft)]",
    textColor: "text-[var(--success)]",
  },
  late: {
    label: "Terlambat",
    icon: Clock,
    color: "warning",
    bgColor: "bg-[var(--warning-soft)]",
    textColor: "text-[var(--warning)]",
  },
  permission: {
    label: "Izin",
    icon: Calendar,
    color: "info",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  sick: {
    label: "Sakit",
    icon: AlertCircle,
    color: "warning",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  absent: {
    label: "Alpha",
    icon: XCircle,
    color: "danger",
    bgColor: "bg-[var(--danger-soft)]",
    textColor: "text-[var(--danger)]",
  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string
  value: number
  showPercentage?: boolean
  icon: React.ElementType
  color: string
  bgColor: string
}

function StatCard({ label, value, showPercentage, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className={cn("rounded-[20px] p-5", bgColor)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-[var(--text-muted)] mb-1">{label}</p>
          <p className={cn("text-[24px] font-bold", color)}>{value}</p>
          {showPercentage && (
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              %
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-[14px] flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// TREND INDICATOR
// ============================================

interface TrendIndicatorProps {
  value: number
  previousValue: number
  label: string
}

function TrendIndicator({ value, previousValue, label }: TrendIndicatorProps) {
  const diff = value - previousValue
  const isPositive = diff > 0
  const isNegative = diff < 0
  const isNeutral = diff === 0

  return (
    <div className="flex items-center gap-2 p-3 bg-[var(--surface-secondary)] rounded-[14px]">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isPositive && "bg-[var(--success-soft)]",
          isNegative && "bg-[var(--danger-soft)]",
          isNeutral && "bg-[var(--surface-hover)]"
        )}
      >
        {isPositive && <TrendingUp className="w-4 h-4 text-[var(--success)]" />}
        {isNegative && <TrendingDown className="w-4 h-4 text-[var(--danger)]" />}
        {isNeutral && <Minus className="w-4 h-4 text-[var(--text-muted)]" />}
      </div>
      <div>
        <p className="text-[13px] font-medium text-[var(--text-primary)]">
          {Math.abs(diff)} {label}
        </p>
        <p className="text-[11px] text-[var(--text-muted)]">
          vs periode sebelumnya
        </p>
      </div>
    </div>
  )
}

// ============================================
// RECENT RECORDS
// ============================================

interface RecentRecordsProps {
  records: AttendanceRecord[]
}

function RecentRecords({ records }: RecentRecordsProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-6">
        <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-[13px] text-[var(--text-muted)]">
          Belum ada data absensi
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {records.slice(0, 5).map((record) => {
        const config = STATUS_CONFIG[record.status]
        const Icon = config.icon

        return (
          <div
            key={record.id}
            className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", config.bgColor)}>
                <Icon className={cn("w-4 h-4", config.textColor)} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {config.label}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {formatDate(record.date)}
                </p>
              </div>
            </div>
            {record.notes && (
              <p className="text-[11px] text-[var(--text-muted)] max-w-[120px] truncate">
                {record.notes}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AttendanceSummary({ studentId, academicYearId }: AttendanceSummaryProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query
        let query = supabase
          .from("attendance")
          .select("*")
          .eq("student_id", studentId)
          .order("date", { ascending: false })

        if (academicYearId) {
          query = query.eq("academic_year_id", academicYearId)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        // Calculate stats
        const records = data || []
        const total = records.length
        const present = records.filter((r) => r.status === "present").length
        const late = records.filter((r) => r.status === "late").length
        const permission = records.filter((r) => r.status === "permission").length
        const sick = records.filter((r) => r.status === "sick").length
        const absent = records.filter((r) => r.status === "absent").length
        const percentage = getPercentage(present + late, total)

        setStats({
          total,
          present,
          late,
          permission,
          sick,
          absent,
          percentage,
        })

        setRecentRecords(records)
      } catch (err) {
        console.error("Error fetching attendance:", err)
        setError("Gagal memuat data absensi")
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [studentId, academicYearId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--surface-hover)] rounded-[20px] animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-[var(--surface-hover)] rounded-[20px] animate-pulse" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card padding="lg" className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-[var(--danger)] mx-auto mb-4" />
        <p className="text-[14px] text-[var(--danger)]">{error || "Data tidak tersedia"}</p>
      </Card>
    )
  }

  if (stats.total === 0) {
    return (
      <Card padding="lg" className="text-center py-8">
        <Calendar className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">
          Belum Ada Data Absensi
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-6">
          Data absensi akan muncul setelah siswa memiliki记录 di modul absensi
        </p>
        <Link
          href="/absensi"
          className="inline-flex items-center gap-2 text-[var(--primary)] text-[13px] font-medium hover:underline"
        >
          Buka Modul Absensi
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Pertemuan"
          value={stats.total}
          icon={Calendar}
          color="text-[var(--text-primary)]"
          bgColor="bg-[var(--surface-secondary)]"
        />
        <StatCard
          label="Persentase Hadir"
          value={stats.percentage}
          showPercentage
          icon={CheckCircle}
          color="text-[var(--success)]"
          bgColor="bg-[var(--success-soft)]"
        />
        <StatCard
          label="Total Ketidakhadiran"
          value={stats.permission + stats.sick + stats.absent}
          icon={AlertCircle}
          color="text-[var(--warning)]"
          bgColor="bg-[var(--warning-soft)]"
        />
        <StatCard
          label="Total Terlambat"
          value={stats.late}
          icon={Clock}
          color="text-orange-500"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Detailed Breakdown */}
      <Card padding="lg">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Rincian Absensi
        </h3>
        <div className="space-y-3">
          {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map((status) => {
            const config = STATUS_CONFIG[status]
            const count = stats[status]
            const percentage = getPercentage(count, stats.total)
            const Icon = config.icon

            return (
              <div key={status} className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.textColor)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[var(--text-primary)]">
                      {config.label}
                    </span>
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor:
                          status === "present"
                            ? "var(--success)"
                            : status === "absent"
                            ? "var(--danger)"
                            : status === "late"
                            ? "orange"
                            : "var(--warning)",
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Aktivitas Terakhir
          </h3>
          <Link
            href={`/absensi/siswa/${studentId}`}
            className="text-[12px] text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <RecentRecords records={recentRecords} />
      </Card>
    </div>
  )
}
