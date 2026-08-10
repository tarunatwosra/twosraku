"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus } from "@/types/attendance"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Save,
  Loader2,
  Users,
} from "lucide-react"
import { cn, formatLocalDate } from "@/lib/utils"

type FilterTab = "all" | "sick" | "permission" | "absent"

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-secondary)]">Memuat...</p>
      </div>
    </div>
  )
}

// Status Colors Configuration
const STATUS_COLORS = {
  present: {
    active: "bg-[var(--success)] text-white shadow-sm",
    inactive: "bg-[var(--success-soft)] text-[var(--success)]",
    bg: "bg-[var(--success-soft)]/30",
    border: "border-[var(--success)]/20",
  },
  sick: {
    active: "bg-[var(--warning)] text-white shadow-sm",
    inactive: "bg-[var(--warning-soft)] text-[var(--warning)]",
    bg: "bg-[var(--warning-soft)]/30",
    border: "border-[var(--warning)]/20",
  },
  permission: {
    active: "bg-[var(--info)] text-white shadow-sm",
    inactive: "bg-[var(--info-soft)] text-[var(--info)]",
    bg: "bg-[var(--info-soft)]/30",
    border: "border-[var(--info)]/20",
  },
  absent: {
    active: "bg-[var(--danger)] text-white shadow-sm",
    inactive: "bg-[var(--danger-soft)] text-[var(--danger)]",
    bg: "bg-[var(--danger-soft)]/30",
    border: "border-[var(--danger)]/20",
  },
}

// Summary Bar Component
function SummaryBar({
  summary,
  className: cls
}: {
  summary: { present: number; sick: number; permission: number; absent: number; percentage: number }
  className?: string
}) {
  return (
    <div className={cn("bg-white border-b border-[var(--border-light)] px-4 py-3", cls)}>
      <div className="flex items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <StatusMiniPill label="H" value={summary.present} color="present" />
          <StatusMiniPill label="S" value={summary.sick} color="sick" />
          <StatusMiniPill label="I" value={summary.permission} color="permission" />
          <StatusMiniPill label="A" value={summary.absent} color="absent" />
        </div>

        {/* Percentage */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
          <span className="text-lg font-bold text-[var(--success)]">
            {summary.percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// Status Mini Pill Component
function StatusMiniPill({ label, value, color }: { label: string; value: number; color: AttendanceStatus }) {
  const colors = STATUS_COLORS[color]

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
      colors.inactive
    )}>
      <span className="font-bold">{label}</span>
      <span className="opacity-70">{value}</span>
    </div>
  )
}

// Avatar Fallback Component
function StudentAvatar({ name, gender }: { name: string; gender: "L" | "P" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const bgColor = gender === "L"
    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
    : "bg-pink-100 text-pink-600"

  return (
    <div className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold",
      bgColor
    )}>
      {initials}
    </div>
  )
}

// Student List Item Component - Elegant Card Design
function StudentListItem({
  student,
  status,
  onStatusChange,
  index,
}: {
  student: { id: string; name: string; studentNumber: string; gender: "L" | "P" }
  status: AttendanceStatus
  onStatusChange: (status: AttendanceStatus) => void
  index: number
}) {
  const statuses: AttendanceStatus[] = ["present", "sick", "permission", "absent"]
  const currentColors = STATUS_COLORS[status]

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 transition-all border",
        currentColors.bg,
        currentColors.border
      )}
    >
      {/* Student Info Row */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <StudentAvatar name={student.name} gender={student.gender} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
            {student.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {student.studentNumber}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
            <span className="text-xs text-[var(--text-muted)]">
              {student.gender === "L" ? "Laki-laki" : "Perempuan"}
            </span>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className={cn(
          "px-3 py-1.5 rounded-xl text-xs font-bold",
          currentColors.active
        )}>
          {ATTENDANCE_STATUS_CONFIG[status].shortLabel}
        </div>
      </div>

      {/* Status Toggle Buttons */}
      <div className="flex items-center gap-2">
        {statuses.map((s) => {
          const isActive = status === s
          const sColors = STATUS_COLORS[s]

          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={cn(
                "flex-1 h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5",
                isActive
                  ? sColors.active + " shadow-md scale-[1.02]"
                  : sColors.inactive + " hover:scale-[1.02] hover:shadow-sm"
              )}
            >
              <span>{ATTENDANCE_STATUS_CONFIG[s].shortLabel}</span>
              <span className="text-[10px] opacity-80 font-medium">
                {ATTENDANCE_STATUS_CONFIG[s].label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Filter Tabs Component
function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: FilterTab
  onFilterChange: (filter: FilterTab) => void
  counts: { all: number; sick: number; permission: number; absent: number }
}) {
  const tabs: { key: FilterTab; label: string; color?: AttendanceStatus }[] = [
    { key: "all", label: "Semua" },
    { key: "sick", label: "Sakit", color: "sick" },
    { key: "permission", label: "Izin", color: "permission" },
    { key: "absent", label: "Alpa", color: "absent" },
  ]

  return (
    <div className="bg-white border-b border-[var(--border-light)] px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key
          const isColored = isActive && tab.color

          return (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                isColored && tab.color === "sick" && "bg-[var(--warning)] text-white shadow-md",
                isColored && tab.color === "permission" && "bg-[var(--info)] text-white shadow-md",
                isColored && tab.color === "absent" && "bg-[var(--danger)] text-white shadow-md",
                !isColored && isActive && "bg-[var(--primary)] text-white shadow-md",
                !isColored && !isActive && "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-md",
                isActive ? "bg-white/20" : "bg-[var(--border-light)]"
              )}>
                {counts[tab.key]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Header Component
function PageHeader({
  className: cls,
  date,
  onPrev,
  onNext,
  onDateChange,
}: {
  className?: string
  date: string
  onPrev: () => void
  onNext: () => void
  onDateChange: (date: string) => void
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" })
  }

  return (
    <header className={cn("bg-white border-b border-[var(--border-light)]", cls)}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors -ml-2"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>

        {/* Date Display */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-[var(--text-muted)]">
            {formatDayName(date)}
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {formatDate(date)}
          </span>
        </div>

        {/* Placeholder for balance */}
        <div className="w-10" />
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 px-4 py-2 border-t border-[var(--border-light)]">
        <button
          onClick={onPrev}
          className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>

        <button
          onClick={() => {
            const input = document.createElement("input")
            input.type = "date"
            input.value = date
            input.onchange = (e) => onDateChange((e.target as HTMLInputElement).value)
            input.click()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-soft)] rounded-xl hover:bg-[var(--primary)]/10 transition-colors"
        >
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--primary)]">Pilih Tanggal</span>
        </button>

        <button
          onClick={onNext}
          className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>
    </header>
  )
}

// Inner component that uses useSearchParams
function AbsensiInputContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    records,
    classId,
    date,
    className,
    summary,
    isSubmitted,
    classes,
    loading,
    setClass,
    setDate,
    updateRecordStatus,
    submitAttendance,
  } = useAttendance()

  const [isSaving, setIsSaving] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  // Get params from URL
  useEffect(() => {
    const classParam = searchParams.get("class")
    const dateParam = searchParams.get("date")
    if (classParam) setClass(classParam)
    if (dateParam) setDate(dateParam)
  }, [searchParams, setClass, setDate])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Filter records based on active tab
  const filteredRecords = records.filter((r) => {
    if (activeFilter === "all") return true
    return r.status === activeFilter
  })

  // Count per status
  const statusCounts = {
    all: records.length,
    sick: records.filter((r) => r.status === "sick").length,
    permission: records.filter((r) => r.status === "permission").length,
    absent: records.filter((r) => r.status === "absent").length,
  }

  // Navigate date
  const navigateDate = useCallback((direction: "prev" | "next") => {
    const d = new Date(date + "T00:00:00")
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    setDate(formatLocalDate(d))
  }, [date, setDate])

  // Handle submit
  const handleSubmit = async () => {
    setIsSaving(true)
    const result = await submitAttendance()
    setIsSaving(false)
    if (result.success) {
      router.push("/presensi/absensi")
    }
  }

  // Handle class change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClass(e.target.value)
    setActiveFilter("all")
  }

  // Show loading
  if (authLoading || !isAuthenticated) {
    return <LoadingFallback />
  }

  return (
    <div className="min-h-screen bg-[var(--background-primary)] pb-28">
      {/* Header */}
      <PageHeader
        date={date}
        onPrev={() => navigateDate("prev")}
        onNext={() => navigateDate("next")}
        onDateChange={setDate}
      />

      {/* Class Selector Bar */}
      <div className="bg-white border-b border-[var(--border-light)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <select
            value={classId}
            onChange={handleClassChange}
            className="flex-1 h-11 px-4 bg-[var(--surface-secondary)] rounded-xl text-[15px] font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "20px",
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

      {/* Summary Bar */}
      <SummaryBar summary={summary} />

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={statusCounts}
      />

      {/* Student List */}
      <main className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-[var(--text-secondary)]">Memuat daftar siswa...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {activeFilter === "all" ? "Belum ada data siswa" : `Tidak ada siswa ${activeFilter === "sick" ? "sakit" : activeFilter === "permission" ? "izin" : "alpa"}`}
            </p>
            <p className="text-sm text-[var(--text-muted)] text-center">
              {activeFilter === "all" ? "Pilih kelas untuk melihat siswa" : "Semua siswa hadir ✨"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-sm text-[var(--text-muted)]">
                {filteredRecords.length} siswa
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                Tap status untuk mengubah
              </span>
            </div>
            {filteredRecords.map((record, index) => (
              <StudentListItem
                key={record.id}
                student={record.student}
                status={record.status}
                onStatusChange={(status) => updateRecordStatus(record.student.id, status)}
                index={records.indexOf(record)}
              />
            ))}
          </>
        )}
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 px-4 pb-4">
        <Button
          onClick={handleSubmit}
          disabled={isSaving || isSubmitted}
          isLoading={isSaving}
          className="w-full h-14 text-[15px] font-semibold shadow-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {isSubmitted ? "✓ Tersimpan" : "Simpan Absensi"}
        </Button>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function AbsensiInputMobilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AbsensiInputContent />
    </Suspense>
  )
}
