"use client"

import { useState, useEffect, useCallback } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

type FilterTab = "all" | "sick" | "permission" | "absent"

// Summary Bar Component
function SummaryBar({ summary }: { summary: { present: number; sick: number; permission: number; absent: number; percentage: number } }) {
  return (
    <div className="bg-white border-b border-[var(--border-light)] px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <StatusPill label="H" value={summary.present} color="success" />
          <StatusPill label="S" value={summary.sick} color="warning" />
          <StatusPill label="I" value={summary.permission} color="info" />
          <StatusPill label="A" value={summary.absent} color="danger" />
        </div>

        {/* Percentage */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
          <span className="text-base font-bold text-[var(--success)]">
            {summary.percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// Status Pill Component
function StatusPill({ label, value, color }: { label: string; value: number; color: "success" | "warning" | "info" | "danger" }) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold", colors[color])}>
      <span>{label}</span>
      <span className="opacity-70">{value}</span>
    </div>
  )
}

// Student Card Component
function StudentCard({
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

  const statusColors = {
    present: {
      active: "bg-[var(--success)] text-white shadow-sm",
      inactive: "bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white",
    },
    sick: {
      active: "bg-[var(--warning)] text-white shadow-sm",
      inactive: "bg-[var(--warning-soft)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-white",
    },
    permission: {
      active: "bg-[var(--info)] text-white shadow-sm",
      inactive: "bg-[var(--info-soft)] text-[var(--info)] hover:bg-[var(--info)] hover:text-white",
    },
    absent: {
      active: "bg-[var(--danger)] text-white shadow-sm",
      inactive: "bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white",
    },
  }

  return (
    <Card className={cn(
      "p-4 transition-all",
      status === "sick" && "bg-[var(--warning-soft)]/20 border-[var(--warning)]/30",
      status === "permission" && "bg-[var(--info-soft)]/20 border-[var(--info)]/30",
      status === "absent" && "bg-[var(--danger-soft)]/20 border-[var(--danger)]/30",
    )}>
      <div className="flex items-start justify-between gap-3">
        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">{index + 1}.</span>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] truncate">
              {student.name}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {student.studentNumber}
            </span>
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              student.gender === "L" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-pink-100 text-pink-600"
            )}>
              {student.gender === "L" ? "L" : "P"}
            </span>
          </div>
        </div>

        {/* Status Buttons */}
        <div className="flex items-center gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={cn(
                "w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                status === s ? statusColors[s].active : statusColors[s].inactive
              )}
              title={ATTENDANCE_STATUS_CONFIG[s].label}
            >
              {ATTENDANCE_STATUS_CONFIG[s].shortLabel}
            </button>
          ))}
        </div>
      </div>
    </Card>
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
  const tabs: { key: FilterTab; label: string; color?: "warning" | "info" | "danger" }[] = [
    { key: "all", label: "Semua" },
    { key: "sick", label: "Sakit", color: "warning" },
    { key: "permission", label: "Izin", color: "info" },
    { key: "absent", label: "Alpa", color: "danger" },
  ]

  const getCount = (key: FilterTab) => {
    return counts[key]
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.key
        const isColored = isActive && tab.color

        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              isColored && tab.color === "warning" && "bg-[var(--warning)] text-white",
              isColored && tab.color === "info" && "bg-[var(--info)] text-white",
              isColored && tab.color === "danger" && "bg-[var(--danger)] text-white",
              !isColored && isActive && "bg-[var(--primary)] text-white",
              !isColored && !isActive && "bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {tab.label}
            <span className="opacity-70">({getCount(tab.key)})</span>
          </button>
        )
      })}
    </div>
  )
}

export default function AbsensiInputMobilePage() {
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
    const d = new Date(date)
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    setDate(d.toISOString().split("T")[0])
  }, [date, setDate])

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background-primary)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border-light)]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/presensi/absensi")}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors -ml-2"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-[var(--text-primary)]">{className}</h1>
              <div className="flex items-center gap-1 -mt-0.5">
                <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">{formatDate(date)}</span>
              </div>
            </div>
          </div>

          {/* Class Selector */}
          <select
            value={classId}
            onChange={handleClassChange}
            className="h-9 px-3 pr-8 bg-[var(--surface-secondary)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px",
            }}
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 border-t border-[var(--border-light)]">
          <button
            onClick={() => navigateDate("prev")}
            className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="hidden"
          />
          <button
            onClick={() => navigateDate("next")}
            className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      </header>

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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-base font-medium text-[var(--text-primary)]">
              {activeFilter === "all" ? "Belum ada siswa" : `Tidak ada siswa ${activeFilter === "sick" ? "sakit" : activeFilter === "permission" ? "izin" : "alpa"}`}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {activeFilter === "all" ? "Pilih kelas untuk melihat siswa" : "Semua siswa hadir"}
            </p>
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <StudentCard
              key={record.id}
              student={record.student}
              status={record.status}
              onStatusChange={(status) => updateRecordStatus(record.student.id, status)}
              index={records.indexOf(record)}
            />
          ))
        )}
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--border-light)]">
        <Button
          onClick={handleSubmit}
          disabled={isSaving || isSubmitted}
          isLoading={isSaving}
          className="w-full h-14 text-base font-semibold shadow-lg"
        >
          <Save className="w-5 h-5" />
          {isSubmitted ? "Tersimpan" : "Simpan Absensi"}
        </Button>
      </div>
    </div>
  )
}
