"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus, type AttendanceRecord } from "@/types/attendance"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClassAttendancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classId = searchParams.get("id") || "class-x-tkj-1"
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    records,
    loading,
    isSubmitted,
    summary,
    setClass,
    setDate,
    updateRecordStatus,
    bulkUpdateStatus,
    markAllPresent,
    resetAttendance,
    submitAttendance,
  } = useAttendance()

  // Initialize data
  useEffect(() => {
    setClass(classId)
    setDate(dateParam)
  }, [classId, dateParam, setClass, setDate])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Handle status change
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    updateRecordStatus(studentId, status)
  }

  // Handle bulk status change
  const handleBulkStatus = (status: AttendanceStatus) => {
    const selectedIds = records.filter((r) => r.status !== status).map((r) => r.student.id)
    bulkUpdateStatus(selectedIds, status)
  }

  // Handle submit
  const handleSubmit = async () => {
    await submitAttendance()
  }

  // Get class name from records
  const className = records[0]?.student.class || "Kelas"

  return (
    <AppShell
      title={`Presensi ${className}`}
      description={`Rekam kehadiran siswa tanggal ${new Date(dateParam).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`}
      breadcrumbs={[
        { label: "Presensi", href: "/presensi" },
        { label: "Rekap", href: "/presensi/rekap" },
        { label: className },
      ]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Summary */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
              <span className="text-sm text-[var(--text-muted)]">Total:</span>
              <Badge variant="primary">{summary.totalStudents}</Badge>
              <span className="text-[var(--success)] font-medium">{summary.present} H</span>
              <span className="text-[var(--warning)] font-medium">{summary.late} T</span>
              <span className="text-[var(--danger)] font-medium">{summary.absent} A</span>
            </div>

            {isSubmitted && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Tersimpan
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("present")}
              className="gap-1"
            >
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              Semua Hadir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("late")}
              className="gap-1"
            >
              <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
              Semua Terlambat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("permission")}
            >
              Izin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("absent")}
              className="gap-1"
            >
              <AlertCircle className="w-4 h-4 text-[var(--danger)]" />
              Alpha
            </Button>
            <div className="w-px h-8 bg-[var(--border-light)]" />
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAttendance}
              className="gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Attendance Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)] w-16">
                    No
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    No. Induk
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Nama Siswa
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    JK
                  </th>
                  {(["present", "late", "permission", "sick", "absent"] as const).map((status) => (
                    <th
                      key={status}
                      className={cn(
                        "text-center px-3 py-4 text-[12px] font-semibold",
                        status === "present" && "text-[var(--success)]",
                        status === "late" && "text-[var(--warning)]",
                        status === "permission" && "text-[var(--info)]",
                        status === "sick" && "text-[var(--warning)]",
                        status === "absent" && "text-[var(--danger)]"
                      )}
                    >
                      {ATTENDANCE_STATUS_CONFIG[status].shortLabel}
                    </th>
                  ))}
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--border-light)]"
                    >
                      <td className="px-6 py-4">
                        <div className="w-6 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-20 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-40 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-6 h-4 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" />
                      </td>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <td key={i} className="px-3 py-4">
                          <div className="w-6 h-6 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" />
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <div className="w-24 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  records.map((record, index) => (
                    <AttendanceRow
                      key={record.id}
                      record={record}
                      index={index}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with submit button */}
          <div className="p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Menampilkan {records.length} siswa
              </div>
              <Button
                onClick={handleSubmit}
                isLoading={loading}
                disabled={isSubmitted}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitted ? "Tersimpan" : "Simpan Presensi"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Attendance Row Component
function AttendanceRow({
  record,
  index,
  onStatusChange,
}: {
  record: AttendanceRecord
  index: number
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
}) {
  const statuses: AttendanceStatus[] = ["present", "late", "permission", "sick", "absent"]

  return (
    <tr className={cn(
      "border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors",
      record.status === "absent" && "bg-[var(--danger-soft)]/30"
    )}>
      <td className="px-6 py-4 text-[14px] text-[var(--text-muted)]">
        {index + 1}
      </td>
      <td className="px-4 py-4 text-[14px] text-[var(--text-primary)] font-mono">
        {record.student.studentNumber}
      </td>
      <td className="px-4 py-4">
        <p className="text-[14px] font-medium text-[var(--text-primary)]">
          {record.student.name}
        </p>
      </td>
      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
        {record.student.gender}
      </td>
      {statuses.map((status) => (
        <td key={status} className="px-3 py-4 text-center">
          <button
            onClick={() => onStatusChange(record.student.id, status)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              record.status === status
                ? status === "present"
                  ? "bg-[var(--success)] text-white shadow-md scale-110"
                  : status === "late"
                  ? "bg-[var(--warning)] text-white shadow-md scale-110"
                  : status === "permission"
                  ? "bg-[var(--info)] text-white shadow-md scale-110"
                  : status === "sick"
                  ? "bg-[var(--warning)] text-white shadow-md scale-110"
                  : "bg-[var(--danger)] text-white shadow-md scale-110"
                : "bg-[var(--surface-secondary)] hover:bg-[var(--surface-active)]"
            )}
          >
            <span className="text-xs font-bold">
              {ATTENDANCE_STATUS_CONFIG[status].shortLabel}
            </span>
          </button>
        </td>
      ))}
      <td className="px-4 py-4">
        <input
          type="text"
          placeholder="-"
          defaultValue={record.notes}
          className="w-full px-3 py-1.5 text-[13px] bg-[var(--surface-secondary)] border border-transparent rounded-[12px] focus:outline-none focus:border-[var(--border-focus)]"
        />
      </td>
    </tr>
  )
}
