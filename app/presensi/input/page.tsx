"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus } from "@/types/attendance"
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  ThermometerSun,
  FileText,
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type FilterTab = "all" | "sick" | "permission" | "absent"

export default function AttendanceInputPage() {
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
    bulkUpdateStatus,
    markAllPresent,
    resetAttendance,
    submitAttendance,
  } = useAttendance()

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")

  // Get params from URL if present
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

  if (authLoading || !isAuthenticated) {
    return null
  }

  // Filter records based on active tab
  const filteredRecords = useMemo(() => {
    if (activeFilter === "all") return records
    return records.filter((r) => r.status === activeFilter)
  }, [records, activeFilter])

  // Count per status for filter tabs
  const statusCounts = useMemo(() => ({
    all: records.length,
    sick: records.filter((r) => r.status === "sick").length,
    permission: records.filter((r) => r.status === "permission").length,
    absent: records.filter((r) => r.status === "absent").length,
  }), [records])

  // Navigate date
  const navigateDate = (direction: "prev" | "next") => {
    const d = new Date(date)
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    setDate(d.toISOString().split("T")[0])
  }

  // Handle submit
  const handleSubmit = async () => {
    setIsSaving(true)
    const result = await submitAttendance()
    setIsSaving(false)
    if (result.success) {
      router.push("/presensi")
    }
  }

  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  // Select all filtered students
  const selectAll = () => {
    setSelectedStudents(filteredRecords.map((r) => r.student.id))
  }

  // Deselect all
  const deselectAll = () => {
    setSelectedStudents([])
  }

  // Bulk mark
  const bulkMark = (status: AttendanceStatus) => {
    if (selectedStudents.length > 0) {
      bulkUpdateStatus(selectedStudents, status)
      setSelectedStudents([])
    }
  }

  // Handle class change
  const handleClassChange = (newClassId: string) => {
    setClass(newClassId)
    setSelectedStudents([])
    setActiveFilter("all")
  }

  return (
    <AppShell
      title="Ambil Presensi"
      description="Catat kehadiran siswa"
      showHeader={false}
    >
      <div className="space-y-6">
        {/* Header Bar - Card Wrapper */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link
                href="/presensi"
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </Link>

              {/* Date Navigation */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                  className="w-9 h-9 p-0 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-xl min-w-[180px]">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer flex-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("next")}
                  className="w-9 h-9 p-0 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Class Selector */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-xl min-w-[140px]">
                <Users className="w-4 h-4 text-[var(--text-muted)]" />
                <select
                  value={classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer flex-1"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSaving || isSubmitted}
              isLoading={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitted ? "Tersimpan" : "Simpan Presensi"}
            </Button>
          </div>
        </Card>

        {/* Summary Pills - Card Wrapper */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Total Siswa</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{summary.totalStudents}</p>
                </div>
              </div>

              <div className="h-10 w-px bg-[var(--border-light)]" />

              <div className="flex items-center gap-4">
                <StatPill label="Hadir" value={summary.present} color="success" />
                <StatPill label="Sakit" value={summary.sick} color="warning" />
                <StatPill label="Izin" value={summary.permission} color="info" />
                <StatPill label="Alpa" value={summary.absent} color="danger" />
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-[var(--success)]">
                {summary.percentage.toFixed(0)}%
              </p>
              <p className="text-sm text-[var(--text-muted)]">Kehadiran</p>
            </div>
          </div>
        </Card>

        {/* Filter Tabs & Bulk Actions - Card Wrapper */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-full">
              <FilterTabButton
                label="Semua"
                count={statusCounts.all}
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              />
              <FilterTabButton
                label="Sakit"
                count={statusCounts.sick}
                active={activeFilter === "sick"}
                onClick={() => setActiveFilter("sick")}
                color="warning"
              />
              <FilterTabButton
                label="Izin"
                count={statusCounts.permission}
                active={activeFilter === "permission"}
                onClick={() => setActiveFilter("permission")}
                color="info"
              />
              <FilterTabButton
                label="Alpa"
                count={statusCounts.absent}
                active={activeFilter === "absent"}
                onClick={() => setActiveFilter("absent")}
                color="danger"
              />
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              {selectedStudents.length > 0 && (
                <>
                  <span className="text-sm text-[var(--text-muted)]">
                    {selectedStudents.length} dipilih
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkMark("sick")}
                    className="gap-1 text-[var(--warning)] border-[var(--warning)]/30 hover:bg-[var(--warning-soft)]"
                  >
                    <ThermometerSun className="w-3 h-3" />
                    Sakit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkMark("permission")}
                    className="gap-1 text-[var(--info)] border-[var(--info)]/30 hover:bg-[var(--info-soft)]"
                  >
                    <FileText className="w-3 h-3" />
                    Izin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkMark("absent")}
                    className="gap-1 text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger-soft)]"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Alpa
                  </Button>
                  <div className="w-px h-6 bg-[var(--border-light)] mx-1" />
                </>
              )}
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Pilih Semua
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll}>
                Batal
              </Button>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-secondary)]">
                <tr>
                  <th className="w-12 px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredRecords.length && filteredRecords.length > 0}
                      onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                      className="w-4 h-4 rounded accent-[var(--primary)]"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-caption font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    No
                  </th>
                  <th className="px-4 py-4 text-left text-caption font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    NIS
                  </th>
                  <th className="px-4 py-4 text-left text-caption font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Nama Siswa
                  </th>
                  <th className="px-4 py-4 text-center text-caption font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    JK
                  </th>
                  <th className="px-4 py-4 text-center text-caption font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {filteredRecords.map((record, index) => (
                  <AttendanceRow
                    key={record.id}
                    record={record}
                    index={records.indexOf(record)}
                    isSelected={selectedStudents.includes(record.student.id)}
                    onToggle={() => toggleStudent(record.student.id)}
                    onStatusChange={(status) => updateRecordStatus(record.student.id, status)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-lg font-medium text-[var(--text-primary)]">
                {activeFilter === "all" ? "Belum ada siswa" : `Tidak ada siswa ${activeFilter === "sick" ? "sakit" : activeFilter === "permission" ? "izin" : "alpa"}`}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {activeFilter === "all" ? "Pilih kelas untuk melihat siswa" : "Semua siswa hadir"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

// Stat Pill Component
function StatPill({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: "success" | "warning" | "info" | "danger"
}) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", colors[color])}>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-caption font-medium">{label}</span>
    </div>
  )
}

// Filter Tab Button Component
function FilterTabButton({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  color?: "success" | "warning" | "info" | "danger"
}) {
  const activeColors = {
    success: "bg-[var(--success)] text-white",
    warning: "bg-[var(--warning)] text-white",
    info: "bg-[var(--info)] text-white",
    danger: "bg-[var(--danger)] text-white",
  }

  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"

  if (active && color) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColors[color])}>
        {label}
        <span className="text-caption opacity-75">({count})</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        active
          ? "bg-white text-[var(--text-primary)] shadow-sm"
          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      )}
    >
      {label}
      <span className="text-caption opacity-60">({count})</span>
    </button>
  )
}

// Attendance Row Component
function AttendanceRow({
  record,
  index,
  isSelected,
  onToggle,
  onStatusChange,
}: {
  record: any
  index: number
  isSelected: boolean
  onToggle: () => void
  onStatusChange: (status: AttendanceStatus) => void
}) {
  const statuses: AttendanceStatus[] = ["present", "sick", "permission", "absent"]

  const statusColors = {
    present: "bg-[var(--success)] text-white",
    sick: "bg-[var(--warning)] text-white",
    permission: "bg-[var(--info)] text-white",
    absent: "bg-[var(--danger)] text-white",
  }

  const statusInactiveColors = {
    present: "bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white",
    sick: "bg-[var(--warning-soft)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-white",
    permission: "bg-[var(--info-soft)] text-[var(--info)] hover:bg-[var(--info)] hover:text-white",
    absent: "bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white",
  }

  // Row background based on status
  const rowBg: Record<string, string> = {
    present: "",
    sick: "bg-[var(--warning-soft)]/30",
    permission: "bg-[var(--info-soft)]/30",
    absent: "bg-[var(--danger-soft)]/30",
  }

  return (
    <tr
      className={cn(
        "transition-all hover:bg-[var(--surface-hover)]",
        isSelected && "bg-[var(--primary-soft)]",
        rowBg[record.status] || ""
      )}
    >
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
      </td>
      <td className="px-4 py-4 text-sm text-[var(--text-muted)]">
        {index + 1}
      </td>
      <td className="px-4 py-4 text-sm font-mono text-[var(--text-primary)]">
        {record.student.studentNumber}
      </td>
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {record.student.name}
        </p>
      </td>
      <td className="px-4 py-4 text-center text-sm text-[var(--text-muted)]">
        {record.student.gender}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={cn(
                "w-10 h-9 rounded-lg text-caption font-semibold transition-all",
                record.status === status
                  ? statusColors[status]
                  : statusInactiveColors[status]
              )}
              title={ATTENDANCE_STATUS_CONFIG[status].label}
            >
              {ATTENDANCE_STATUS_CONFIG[status].shortLabel}
            </button>
          ))}
        </div>
      </td>
    </tr>
  )
}
