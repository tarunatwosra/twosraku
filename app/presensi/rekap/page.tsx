"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAttendanceRecap } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus, type DailyRecap } from "@/types/attendance"
import {
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendanceRecapPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getDailyRecap, loading } = useAttendanceRecap()

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [recapData, setRecapData] = useState<DailyRecap | null>(null)
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily")

  // Load recap data
  useEffect(() => {
    const loadRecap = async () => {
      const data = await getDailyRecap(selectedDate)
      if (data) {
        setRecapData(data)
      }
    }
    loadRecap()
  }, [selectedDate, getDailyRecap])

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

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(date.toISOString().split("T")[0])
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <AppShell
      title="Rekap Presensi"
      description="Lihat rekapitulasi kehadiran siswa"
      breadcrumbs={[
        { label: "Presensi", href: "/presensi" },
        { label: "Rekap" },
      ]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-11 px-4 pr-10 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[var(--surface-secondary)] rounded-[18px] p-1">
              {(["daily", "weekly", "monthly"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-4 py-2 rounded-[14px] text-[13px] font-medium transition-all",
                    viewMode === mode
                      ? "bg-white shadow-sm text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {mode === "daily" ? "Harian" : mode === "weekly" ? "Mingguan" : "Bulanan"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {recapData && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <SummaryCard
                title="Total Siswa"
                value={recapData.summary.totalStudents}
                icon={<Users className="w-5 h-5" />}
                color="primary"
              />
              <SummaryCard
                title="Hadir"
                value={recapData.summary.present}
                percentage={recapData.summary.totalStudents > 0
                  ? (recapData.summary.present / recapData.summary.totalStudents * 100).toFixed(1)
                  : "0"}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="success"
              />
              <SummaryCard
                title="Terlambat"
                value={recapData.summary.late}
                icon={<AlertCircle className="w-5 h-5" />}
                color="warning"
              />
              <SummaryCard
                title="Izin"
                value={recapData.summary.permission}
                icon={<AlertCircle className="w-5 h-5" />}
                color="info"
              />
              <SummaryCard
                title="Sakit"
                value={recapData.summary.sick}
                icon={<AlertCircle className="w-5 h-5" />}
                color="warning"
              />
              <SummaryCard
                title="Alpha"
                value={recapData.summary.absent}
                icon={<AlertCircle className="w-5 h-5" />}
                color="danger"
              />
            </div>

            {/* Class Recap Table */}
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Rekap per Kelas
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-muted)]">Persentase Kehadiran</p>
                      <p className="text-2xl font-bold text-[var(--success)]">
                        {recapData.summary.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-light)]">
                      <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                        Kelas
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                        Total
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--success)]">
                        Hadir
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--warning)]">
                        Terlambat
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--info)]">
                        Izin
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--warning)]">
                        Sakit
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--danger)]">
                        Alpha
                      </th>
                      <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                        %
                      </th>
                      <th className="text-center px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapData.byClass.map((cls, index) => (
                      <tr
                        key={cls.classId}
                        className={cn(
                          "border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer",
                          index === 0 && "bg-[var(--primary-soft)] hover:bg-[var(--primary-soft)]"
                        )}
                        onClick={() => router.push(`/presensi/kelas/${cls.classId}?date=${selectedDate}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-[var(--text-primary)]">
                            {cls.className}
                          </p>
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--text-primary)]">
                          {cls.summary.totalStudents}
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--success)]">
                          {cls.summary.present}
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--warning)]">
                          {cls.summary.late}
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--info)]">
                          {cls.summary.permission}
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--warning)]">
                          {cls.summary.sick}
                        </td>
                        <td className="text-center px-4 py-4 text-[14px] text-[var(--danger)]">
                          {cls.summary.absent}
                        </td>
                        <td className="text-center px-4 py-4">
                          <Badge
                            variant={cls.summary.percentage >= 90 ? "success" : cls.summary.percentage >= 75 ? "warning" : "danger"}
                          >
                            {cls.summary.percentage.toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="text-center px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/presensi/input?class=${cls.classId}&date=${selectedDate}`)
                            }}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Attendance Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Tren Kehadiran
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Grafik kehadiran 7 hari terakhir
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
              </div>

              {/* Simple chart placeholder */}
              <div className="h-48 flex items-end justify-between gap-2">
                {[75, 82, 78, 85, 88, 92, 90].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-[var(--primary-soft)] rounded-t-lg transition-all hover:bg-[var(--primary)]"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-xs text-[var(--text-muted)]">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </AppShell>
  )
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  percentage,
  icon,
  color,
}: {
  title: string
  value: number
  percentage?: string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "danger" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
          {percentage && (
            <p className="text-xs text-[var(--text-muted)]">{percentage}%</p>
          )}
        </div>
      </div>
    </Card>
  )
}
