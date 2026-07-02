"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus } from "@/types/attendance"
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendanceInputPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    records,
    classId,
    date,
    summary,
    isSubmitted,
    classes,
    loading,
    setClass,
    setDate,
    updateRecordStatus,
    markAllPresent,
    resetAttendance,
    submitAttendance,
  } = useAttendance()

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || !isAuthenticated) {
    return null
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    const result = await submitAttendance()
    setIsSaving(false)
    if (result.success) {
      router.push("/presensi")
    }
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const selectAll = () => {
    setSelectedStudents(records.map((r) => r.student.id))
  }

  const deselectAll = () => {
    setSelectedStudents([])
  }

  return (
    <AppShell
      title="Ambil Presensi"
      description="Catat kehadiran siswa hari ini"
      showHeader={true}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/presensi"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Presensi
        </Link>

        {/* Filter Controls */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Kelas:
              </label>
              <select
                value={classId}
                onChange={(e) => setClass(e.target.value)}
                className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Tanggal:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                <Check className="w-4 h-4 mr-1" />
                Semua Hadir
              </Button>
              <Button variant="outline" size="sm" onClick={resetAttendance}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <SummaryItem
                label="Total"
                value={summary.totalStudents}
                color="text-[var(--text-primary)]"
              />
              <SummaryItem
                label="Hadir"
                value={summary.present}
                color="text-[var(--success)]"
              />
              <SummaryItem
                label="Terlambat"
                value={summary.late}
                color="text-[var(--warning)]"
              />
              <SummaryItem
                label="Izin"
                value={summary.permission}
                color="text-[var(--info)]"
              />
              <SummaryItem
                label="Sakit"
                value={summary.sick}
                color="text-[var(--warning)]"
              />
              <SummaryItem
                label="Alpha"
                value={summary.absent}
                color="text-[var(--danger)]"
              />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--success)]">
                {summary.percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-[var(--text-muted)]">Tingkat Kehadiran</p>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">
                {selectedStudents.length} siswa dipilih
              </span>
              {selectedStudents.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      selectedStudents.forEach((id) => updateRecordStatus(id, "present"))
                      setSelectedStudents([])
                    }}
                    className="px-2 py-1 text-xs bg-[var(--success-soft)] text-[var(--success)] rounded hover:bg-[var(--success)] hover:text-white transition-colors"
                  >
                    Tandai Hadir
                  </button>
                  <button
                    onClick={() => {
                      selectedStudents.forEach((id) => updateRecordStatus(id, "permission"))
                      setSelectedStudents([])
                    }}
                    className="px-2 py-1 text-xs bg-[var(--info-soft)] text-[var(--info)] rounded hover:bg-[var(--info)] hover:text-white transition-colors"
                  >
                    Tandai Izin
                  </button>
                  <button
                    onClick={() => {
                      selectedStudents.forEach((id) => updateRecordStatus(id, "absent"))
                      setSelectedStudents([])
                    }}
                    className="px-2 py-1 text-xs bg-[var(--danger-soft)] text-[var(--danger)] rounded hover:bg-[var(--danger)] hover:text-white transition-colors"
                  >
                    Tandai Alpha
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Pilih Semua
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll}>
                Batal Pilih
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-secondary)]">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === records.length && records.length > 0}
                      onChange={(e) =>
                        e.target.checked ? selectAll() : deselectAll()
                      }
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                    NIS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                    Nama Siswa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                    JK
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[var(--text-muted)] uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {records.map((record, index) => (
                  <tr
                    key={record.student.id}
                    className={cn(
                      "hover:bg-[var(--surface-hover)] transition-colors",
                      selectedStudents.includes(record.student.id) && "bg-[var(--primary-soft)]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(record.student.id)}
                        onChange={() => toggleStudent(record.student.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                      {record.student.studentNumber}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                      {record.student.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {record.student.gender}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {(["present", "late", "permission", "sick", "absent"] as AttendanceStatus[]).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() =>
                                updateRecordStatus(record.student.id, status)
                              }
                              className={cn(
                                "w-10 h-8 rounded-lg text-xs font-medium transition-colors",
                                record.status === status
                                  ? status === "present"
                                    ? "bg-[var(--success)] text-white"
                                    : status === "late"
                                    ? "bg-[var(--warning)] text-white"
                                    : status === "permission"
                                    ? "bg-[var(--info)] text-white"
                                    : status === "sick"
                                    ? "bg-[var(--warning)] text-white"
                                    : "bg-[var(--danger)] text-white"
                                  : "bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                              )}
                              title={ATTENDANCE_STATUS_CONFIG[status].label}
                            >
                              {ATTENDANCE_STATUS_CONFIG[status].shortLabel}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/presensi")}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || isSubmitted}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Menyimpan..." : isSubmitted ? "Tersimpan" : "Simpan Presensi"}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

// Summary Item Component
function SummaryItem({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="text-center">
      <p className={cn("text-xl font-bold", color)}>{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  )
}
