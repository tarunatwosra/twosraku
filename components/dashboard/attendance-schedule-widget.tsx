"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getClassesAttendanceStatus, type ClassAttendanceStatus } from "@/lib/attendance-days"

interface AttendanceScheduleWidgetProps {
  className?: string
}

export function AttendanceScheduleWidget({
  className,
}: AttendanceScheduleWidgetProps) {
  const [schedule, setSchedule] = useState<ClassAttendanceStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = async () => {
    setError(null)
    try {
      const { data, error } = await getClassesAttendanceStatus()
      if (error) {
        setError(error)
        return
      }
      // Filter hanya kelas yang ada jadwal presensi hari ini
      const todaySchedule = data.filter((item) => item.isAttendanceDay)
      setSchedule(todaySchedule)
    } catch (err) {
      console.error("Error fetching attendance schedule:", err)
      setError("Gagal memuat jadwal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSchedule()
    setRefreshing(false)
  }

  // Count stats
  const totalScheduled = schedule.length
  const recorded = schedule.filter((s) => s.hasAttendanceRecorded).length
  const notRecorded = totalScheduled - recorded

  // Get today's day name
  const getDayName = () => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    return days[new Date().getDay()]
  }

  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[var(--primary-soft)] flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Jadwal Presensi
            </h3>
            <p className="text-[12px] text-[var(--text-muted)]">
              {getDayName()}, {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        >
          <RefreshCw className={cn("w-4 h-4 text-[var(--text-muted)]", refreshing && "animate-spin")} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-[var(--surface-secondary)] rounded-xl">
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {totalScheduled}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Jadwal</p>
        </div>
        <div className="text-center p-3 bg-[var(--success-soft)] rounded-xl">
          <p className="text-xl font-bold text-[var(--success)]">
            {recorded}
          </p>
          <p className="text-xs text-[var(--success)]">Sudah</p>
        </div>
        <div className="text-center p-3 bg-[var(--warning-soft)] rounded-xl">
          <p className="text-xl font-bold text-[var(--warning)]">
            {notRecorded}
          </p>
          <p className="text-xs text-[var(--warning)]">Belum</p>
        </div>
      </div>

      {/* Schedule List */}
      {schedule.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-muted)]">
            Tidak ada jadwal presensi hari ini
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {schedule.slice(0, 5).map((item) => (
            <div
              key={item.classId}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-colors",
                item.hasAttendanceRecorded
                  ? "bg-[var(--success-soft)]"
                  : "bg-[var(--warning-soft)]"
              )}
            >
              <div className="flex items-center gap-3">
                {item.hasAttendanceRecorded ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
                )}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.hasAttendanceRecorded
                        ? "text-[var(--success)]"
                        : "text-[var(--warning)]"
                    )}
                  >
                    {item.className}
                  </p>
                  {item.majorName && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {item.majorName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.hasAttendanceRecorded && item.attendancePercentage !== undefined ? (
                  <span className="text-xs font-medium text-[var(--success)]">
                    {item.attendancePercentage}%
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[var(--warning)]">
                    Belum diinput
                  </span>
                )}
                {!item.hasAttendanceRecorded && (
                  <Link
                    href={`/presensi/absensi/input?class=${item.classId}&date=${new Date().toISOString().split("T")[0]}`}
                    className="p-1.5 rounded-lg bg-[var(--warning)] text-white hover:bg-[var(--warning-hover)] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      {schedule.length > 5 && (
        <Link
          href="/presensi"
          className="flex items-center justify-center gap-1 mt-4 py-2 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Lihat semua jadwal
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}

      {/* No Schedule Today */}
      {schedule.length === 0 && !loading && (
        <div className="mt-4">
          <Link href="/settings/academic">
            <Button variant="outline" className="w-full text-sm">
              Atur Jadwal Presensi
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
