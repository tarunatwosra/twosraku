"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/layout/mobile-shell"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useAttendance } from "@/hooks/useAttendance"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ThermometerSun,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type StatColor = "success" | "warning" | "info" | "danger"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: StatColor
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("p-3 rounded-2xl flex flex-col", colors[color])}>
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <span className="text-xs font-medium opacity-80 text-center">{label}</span>
    </div>
  )
}

function AbsensiContent() {
  const router = useRouter()
  const {
    classes,
    loadingClasses,
    date,
    setDate,
    summary,
    loading,
    setClass,
    classId,
  } = useAttendance()

  // Local state for controlled inputs
  const [selectedDate, setSelectedDate] = useState<string>(date)
  const [selectedClassId, setSelectedClassId] = useState<string>("")

  // Use the hook's classId as the source of truth
  const activeClassId = classId || selectedClassId || classes[0]?.id || ""

  // Navigate date
  const navigateDate = useCallback((direction: "prev" | "next") => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    const newDate = d.toISOString().split("T")[0]
    setSelectedDate(newDate)
    setDate(newDate)
  }, [selectedDate, setDate])

  // Handle date change from date picker
  const handleDateChange = useCallback((newDate: string) => {
    setSelectedDate(newDate)
    setDate(newDate)
  }, [setDate])

  // Handle class change
  const handleClassChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClassId = e.target.value
    setSelectedClassId(newClassId)
    setClass(newClassId)
  }, [setClass])

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format day name
  const formatDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" })
  }

  // Handle take attendance - redirect to mobile input page
  const handleTakeAttendance = () => {
    if (activeClassId) {
      router.push(`/mobile/presensi/input?class=${activeClassId}&date=${selectedDate}`)
    }
  }

  // Check if weekend
  const isWeekend = new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6

  // Calculate percentage for display
  const percentage = summary.totalStudents > 0
    ? Math.round((summary.present / summary.totalStudents) * 100)
    : 0

  // Get selected class name
  const selectedClassName = classes.find((c) => c.id === activeClassId)?.name || ""

  // Loading state
  if (loadingClasses) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-secondary)]">Memuat kelas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="px-4 py-4 space-y-4">
        {/* Date Navigator Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigateDate("prev")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <button
              onClick={() => {
                const input = document.createElement("input")
                input.type = "date"
                input.value = selectedDate
                input.onchange = (e) => {
                  handleDateChange((e.target as HTMLInputElement).value)
                }
                input.click()
              }}
              className="flex-1 flex flex-col items-center py-2.5 bg-[var(--primary-soft)] rounded-xl hover:bg-[var(--primary)]/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">
                {formatDayName(selectedDate)}
              </span>
            </button>

            <button
              onClick={() => navigateDate("next")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </Card>

        {/* Class Selector Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] font-medium mb-1 block">
                Pilih Kelas
              </label>
              <select
                value={activeClassId}
                onChange={handleClassChange}
                className="w-full h-11 px-3 bg-[var(--surface-secondary)] rounded-lg text-[14px] font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "18px",
                }}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedClassName && (
            <p className="text-xs text-[var(--text-muted)] mt-2 px-1">
              {classes.find((c) => c.id === activeClassId)?.major}
            </p>
          )}
        </Card>

        {/* Stats Section - Loading */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 w-32 bg-[var(--surface-secondary)] rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-[var(--surface-secondary)] rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div>
              <h2 className="text-xs font-medium text-[var(--text-secondary)] mb-2 px-1">
                Statistik Kehadiran
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Hadir" value={summary.present} icon={CheckCircle2} color="success" />
                <StatCard label="Sakit" value={summary.sick} icon={ThermometerSun} color="warning" />
                <StatCard label="Izin" value={summary.permission} icon={FileText} color="info" />
                <StatCard label="Alpa" value={summary.absent} icon={AlertCircle} color="danger" />
              </div>
            </div>

            {/* Percentage Card */}
            <Card className="p-4 bg-gradient-to-r from-[var(--success-soft)] to-[var(--success)]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--success)] font-medium">Kehadiran</p>
                    <p className="text-2xl font-bold text-[var(--success)]">{percentage}%</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Total Students Info */}
            <Card className="p-3 bg-[var(--surface-secondary)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Total Siswa</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {summary.totalStudents} siswa
                </span>
              </div>
            </Card>
          </>
        )}

        {/* Weekend Warning */}
        {isWeekend && (
          <Card className="p-3 bg-[var(--warning-soft)] border border-[var(--warning)]/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
              <p className="text-xs text-[var(--warning)] font-medium">
                Tidak ada sekolah di hari weekend
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Fixed Bottom CTA - Adjusted for bottom nav */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-gradient-to-t from-[var(--background-primary)] via-[var(--background-primary)] to-transparent pt-6 px-4 pb-3">
        <Button
          onClick={handleTakeAttendance}
          disabled={isWeekend || loadingClasses || classes.length === 0}
          className={cn(
            "w-full h-12 text-[14px] font-semibold shadow-lg transition-all active:scale-[0.98]",
            isWeekend || loadingClasses || classes.length === 0
              ? "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          )}
        >
          {isWeekend ? (
            "Weekend - Tidak Ada Sekolah"
          ) : loadingClasses ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Memuat...
            </>
          ) : classes.length === 0 ? (
            "Tidak Ada Kelas"
          ) : (
            <>
              Ambil Absensi
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </>
  )
}

export default function MobileAbsensiPage() {
  return (
    <MobileShell showBottomNav={true}>
      <AbsensiContent />
    </MobileShell>
  )
}
