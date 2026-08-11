"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  fetchClasses,
} from "@/lib/classes"
import {
  fetchAllAttendanceDays,
  setAttendanceDaysForClass,
} from "@/lib/attendance-days"
import type { Class, DayOfWeek, ClassAttendanceDay } from "@/types/database"

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 1, label: "Senin", short: "Sn" },
  { value: 2, label: "Selasa", short: "Sl" },
  { value: 3, label: "Rabu", short: "Rb" },
  { value: 4, label: "Kamis", short: "Km" },
  { value: 5, label: "Jumat", short: "Jm" },
  { value: 6, label: "Sabtu", short: "Sb" },
]

interface AttendanceDaysCache {
  [classId: string]: DayOfWeek[]
}

interface AttendanceScheduleSettingsProps {
  className?: string
}

export function AttendanceScheduleSettings({
  className,
}: AttendanceScheduleSettingsProps) {
  // Data state
  const [classes, setClasses] = useState<Class[]>([])
  const [attendanceDays, setAttendanceDays] = useState<
    (ClassAttendanceDay & { classes?: Class })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Local cache state - menyimpan perubahan sebelum disimpan
  const [localCache, setLocalCache] = useState<AttendanceDaysCache>({})

  // Ref to track if already initialized
  const isInitialized = useRef(false)

  // Memoized check for unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const original: AttendanceDaysCache = {}
    attendanceDays.forEach((item) => {
      if (!original[item.class_id]) {
        original[item.class_id] = []
      }
      original[item.class_id].push(item.day_of_week)
    })

    for (const classId of Object.keys(localCache)) {
      const orig = (original[classId] || []).sort((a, b) => a - b)
      const curr = (localCache[classId] || []).sort((a, b) => a - b)
      if (JSON.stringify(orig) !== JSON.stringify(curr)) {
        return true
      }
    }
    return false
  }, [attendanceDays, localCache])

  // Initialize local cache from attendance days data
  const initializeCache = (
    days: (ClassAttendanceDay & { classes?: Class })[],
    classList: Class[]
  ) => {
    const cache: AttendanceDaysCache = {}

    days.forEach((item) => {
      if (!cache[item.class_id]) {
        cache[item.class_id] = []
      }
      cache[item.class_id].push(item.day_of_week)
    })

    // Jika ada kelas yang belum punya jadwal, set default (Senin-Jumat)
    classList.forEach((cls) => {
      if (!cache[cls.id]) {
        cache[cls.id] = [1, 2, 3, 4, 5] // Senin-Jumat as default
      }
    })

    setLocalCache(cache)
  }

  // Fetch data - only run once on mount
  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch classes
        const { data: classesData } = await fetchClasses()
        if (!mounted) return

        // Fetch attendance days
        const { data: daysData } = await fetchAllAttendanceDays()
        if (!mounted) return

        setClasses(classesData || [])
        setAttendanceDays(daysData || [])

        // Initialize cache only once
        if (classesData && classesData.length > 0 && !isInitialized.current) {
          initializeCache(daysData || [], classesData || [])
          isInitialized.current = true
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        if (mounted) {
          setError("Gagal memuat data")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, []) // Empty dependency array - only run once

  // Toggle day selection
  const toggleDay = (classId: string, day: DayOfWeek) => {
    setLocalCache((prev) => {
      const current = prev[classId] || []
      const newDays = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day].sort((a, b) => a - b)
      return { ...prev, [classId]: newDays }
    })
    setSuccess(false)
  }

  // Set all weekdays (Mon-Fri)
  const setWeekdays = (classId: string) => {
    setLocalCache((prev) => ({
      ...prev,
      [classId]: [1, 2, 3, 4, 5],
    }))
    setSuccess(false)
  }

  // Set all days (Mon-Sat)
  const setAllDays = (classId: string) => {
    setLocalCache((prev) => ({
      ...prev,
      [classId]: [1, 2, 3, 4, 5, 6],
    }))
    setSuccess(false)
  }

  // Clear all days
  const clearDays = (classId: string) => {
    setLocalCache((prev) => ({
      ...prev,
      [classId]: [],
    }))
    setSuccess(false)
  }

  // Save all changes
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let hasError = false
      const classIds = Object.keys(localCache)

      console.log("[AttendanceSchedule] Saving attendance days for", classIds.length, "classes")
      console.log("[AttendanceSchedule] Local cache:", localCache)

      for (const classId of classIds) {
        const days = localCache[classId]
        console.log(`[AttendanceSchedule] Saving class ${classId}:`, days)

        const result = await setAttendanceDaysForClass(classId, days)
        if (!result.success) {
          console.error(`[AttendanceSchedule] Failed to save for class ${classId}:`, result.error)
          hasError = true
          setError(`Gagal menyimpan jadwal: ${result.error}`)
          break
        }
        console.log(`[AttendanceSchedule] Successfully saved for class ${classId}`)
      }

      if (!hasError) {
        setSuccess(true)
        console.log("[AttendanceSchedule] All saves completed successfully")
        // Refresh attendance days
        const { data: daysData } = await fetchAllAttendanceDays()
        setAttendanceDays(daysData || [])
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error("[AttendanceSchedule] Error saving:", err)
      setError("Terjadi kesalahan saat menyimpan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-section-title">Jadwal Presensi per Kelas</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Atur hari-hari spesifik kapan setiap kelas melakukan presensi
          </p>
        </div>
        <div className="flex items-center gap-2">
          {success && (
            <Badge className="bg-[var(--success)] gap-1">
              <Check className="w-3 h-3" />
              Tersimpan
            </Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-[var(--info-soft)] border border-[var(--info)] rounded-lg">
        <p className="text-sm text-[var(--info)]">
          <strong>Tips:</strong> Jika kelas tidak memiliki jadwal presensi di hari
          tertentu, sistem akan menampilkan peringatan di dashboard dan tidak
          mengizinkan input presensi untuk hari tersebut.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Kelas
              </th>
              {DAYS.map((day) => (
                <th
                  key={day.value}
                  className="text-center py-3 px-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
                >
                  {day.label}
                </th>
              ))}
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => {
              const selectedDays = localCache[cls.id] || []
              const hasAnySelected = selectedDays.length > 0
              const isAllWeekdays =
                selectedDays.length === 5 &&
                selectedDays.includes(1) &&
                selectedDays.includes(2) &&
                selectedDays.includes(3) &&
                selectedDays.includes(4) &&
                selectedDays.includes(5)

              return (
                <tr
                  key={cls.id}
                  className="border-b border-[var(--border-light)] hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                        <span className="text-xs font-bold text-[var(--primary)]">
                          {(cls.majors as any)?.code?.charAt(0) || cls.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {cls.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {(cls.majors as any)?.name || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.value)
                    return (
                      <td key={day.value} className="text-center py-3 px-2">
                        <button
                          onClick={() => toggleDay(cls.id, day.value)}
                          className={cn(
                            "w-10 h-10 rounded-lg border-2 transition-all duration-200",
                            "flex items-center justify-center mx-auto",
                            "hover:scale-105 active:scale-95",
                            isSelected
                              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                              : "bg-[var(--surface-primary)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                          )}
                          title={day.label}
                        >
                          <span className="text-sm font-semibold">
                            {day.short}
                          </span>
                        </button>
                      </td>
                    )
                  })}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setWeekdays(cls.id)}
                        disabled={isAllWeekdays}
                        className={cn(
                          "px-2 py-1 text-xs rounded border transition-colors",
                          isAllWeekdays
                            ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] cursor-not-allowed"
                            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        )}
                        title="Senin-Jumat"
                      >
                        5x
                      </button>
                      <button
                        onClick={() => setAllDays(cls.id)}
                        disabled={
                          selectedDays.length === 6 &&
                          selectedDays.includes(6)
                        }
                        className={cn(
                          "px-2 py-1 text-xs rounded border transition-colors",
                          selectedDays.length === 6 && selectedDays.includes(6)
                            ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] cursor-not-allowed"
                            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        )}
                        title="Senin-Sabtu"
                      >
                        6x
                      </button>
                      <button
                        onClick={() => clearDays(cls.id)}
                        disabled={!hasAnySelected}
                        className={cn(
                          "px-2 py-1 text-xs rounded border transition-colors",
                          !hasAnySelected
                            ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] cursor-not-allowed"
                            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                        )}
                        title="Hapus semua"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {classes.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <p className="text-[var(--text-muted)]">
                    Belum ada kelas. Tambahkan kelas terlebih dahulu di tab
                    &quot;Kelas&quot;.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[var(--border-light)]">
        <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary)]" />
            <span>Hari aktif presensi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-[var(--border)]" />
            <span>Hari tidak aktif</span>
          </div>
          <span className="text-[var(--text-light)]">
            |
          </span>
          <button className="hover:text-[var(--primary)] transition-colors">
            5x = Senin-Jumat
          </button>
          <button className="hover:text-[var(--primary)] transition-colors">
            6x = Senin-Sabtu
          </button>
        </div>
      </div>
    </Card>
  )
}
