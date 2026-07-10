"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAttendanceRecap } from "@/hooks/useAttendance"
import { type DailyRecap } from "@/types/attendance"
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
  ThermometerSun,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "daily" | "weekly" | "monthly"

interface TrendData {
  date: string
  percentage: number
  dayName: string
}

export default function AttendanceRecapPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getDailyRecap, getWeeklyRecap, getMonthlyRecap, getTrendData, loading } = useAttendanceRecap()

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [recapData, setRecapData] = useState<DailyRecap | null>(null)
  const [weeklyData, setWeeklyData] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("daily")
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [isPrinting, setIsPrinting] = useState(false)

  // Load data based on view mode
  useEffect(() => {
    const loadData = async () => {
      if (viewMode === "daily") {
        const data = await getDailyRecap(selectedDate)
        if (data) setRecapData(data)
      } else if (viewMode === "weekly") {
        const data = await getWeeklyRecap(selectedDate)
        if (data) setWeeklyData(data)
      } else if (viewMode === "monthly") {
        const date = new Date(selectedDate)
        const data = await getMonthlyRecap(date.getFullYear(), date.getMonth() + 1)
        if (data) setMonthlyData(data)
      }

      // Always load trend data
      const trend = await getTrendData(selectedDate)
      setTrendData(trend)
    }
    loadData()
  }, [selectedDate, viewMode, getDailyRecap, getWeeklyRecap, getMonthlyRecap, getTrendData])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Get current summary based on view mode (MUST be before any early returns)
  const currentSummary = useMemo(() => {
    if (viewMode === "daily" && recapData) return recapData.summary
    if (viewMode === "weekly" && weeklyData) return weeklyData.summary
    if (viewMode === "monthly" && monthlyData) return monthlyData.summary
    return null
  }, [viewMode, recapData, weeklyData, monthlyData])

  // Get current data based on view mode (MUST be before any early returns)
  const currentData = useMemo(() => {
    if (viewMode === "daily") return recapData
    if (viewMode === "weekly") return weeklyData
    if (viewMode === "monthly") return monthlyData
    return null
  }, [viewMode, recapData, weeklyData, monthlyData])

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
    if (viewMode === "daily") {
      date.setDate(date.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "weekly") {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewMode === "monthly") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1))
    }
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

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  // Print function
  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 1000)
  }

  // Export to CSV
  const handleExport = () => {
    if (!currentData) return

    let csvContent = ""

    if (viewMode === "daily" && recapData) {
      // Header
      csvContent = `REKAPITULASI PRESENSI HARIAN\n`
      csvContent += `Tanggal: ${formatDate(recapData.date)}\n`
      csvContent += `Generated: ${new Date().toLocaleString("id-ID")}\n\n`

      // Summary
      csvContent += `RINGKASAN\n`
      csvContent += `Total Siswa,${recapData.summary.totalStudents}\n`
      csvContent += `Hadir,${recapData.summary.present}\n`
      csvContent += `Sakit,${recapData.summary.sick}\n`
      csvContent += `Izin,${recapData.summary.permission}\n`
      csvContent += `Alpa,${recapData.summary.absent}\n`
      csvContent += `Persentase,${recapData.summary.percentage.toFixed(1)}%\n\n`

      // Table
      csvContent += `REKAP PER KELAS\n`
      csvContent += `Kelas,Total,Hadir,Sakit,Izin,Alpa,Persentase\n`
      recapData.byClass.forEach((cls) => {
        csvContent += `"${cls.className}",${cls.summary.totalStudents},${cls.summary.present},${cls.summary.sick},${cls.summary.permission},${cls.summary.absent},${cls.summary.percentage.toFixed(1)}%\n`
      })
    } else if (viewMode === "weekly" && weeklyData) {
      csvContent = `REKAPITULASI PRESENSI MINGGUAN\n`
      csvContent += `Minggu ke-${weeklyData.weekNumber}\n`
      csvContent += `Periode: ${formatDate(weeklyData.startDate)} - ${formatDate(weeklyData.endDate)}\n\n`

      csvContent += `HARIAN\n`
      csvContent += `Tanggal,Total,Hadir,Sakit,Izin,Alpa,Persentase\n`
      weeklyData.byDay.forEach((day: any) => {
        csvContent += `${formatShortDate(day.date)},${day.summary.totalStudents},${day.summary.present},${day.summary.sick},${day.summary.permission},${day.summary.absent},${day.summary.percentage.toFixed(1)}%\n`
      })
    } else if (viewMode === "monthly" && monthlyData) {
      csvContent = `REKAPITULASI PRESENSI BULANAN\n`
      csvContent += `Bulan: ${new Date(monthlyData.year, monthlyData.month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}\n\n`

      csvContent += `HARIAN\n`
      csvContent += `Tanggal,Total,Hadir,Sakit,Izin,Alpa,Persentase\n`
      monthlyData.byDay.forEach((day: any) => {
        csvContent += `${formatShortDate(day.date)},${day.summary.totalStudents},${day.summary.present},${day.summary.sick},${day.summary.permission},${day.summary.absent},${day.summary.percentage.toFixed(1)}%\n`
      })
    }

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `presensi_${viewMode}_${selectedDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AppShell title="Rekapitulasi Presensi" description="Lihat rekapitulasi kehadiran siswa">
      {/* Header Bar */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Date Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="w-9 h-9 p-0 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-xl min-w-[200px]">
                <Calendar className="w-4 h-4 text-[var(--primary)]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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

            <span className="text-sm text-[var(--text-muted)]">
              {viewMode === "weekly" && weeklyData && `${formatShortDate(weeklyData.startDate)} - ${formatShortDate(weeklyData.endDate)}`}
              {viewMode === "monthly" && monthlyData && new Date(monthlyData.year, monthlyData.month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Center - View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-full">
            {(["daily", "weekly", "monthly"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  viewMode === mode
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {mode === "daily" ? "Harian" : mode === "weekly" ? "Mingguan" : "Bulanan"}
              </button>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {/* Summary Cards */}
        {currentSummary && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total Siswa"
                value={currentSummary.totalStudents}
                icon={<Users className="w-5 h-5" />}
                color="primary"
              />
              <StatCard
                title="Hadir"
                value={currentSummary.present}
                percentage={currentSummary.percentage}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="success"
              />
              <StatCard
                title="Sakit"
                value={currentSummary.sick}
                icon={<ThermometerSun className="w-5 h-5" />}
                color="warning"
              />
              <StatCard
                title="Izin"
                value={currentSummary.permission}
                icon={<FileText className="w-5 h-5" />}
                color="info"
              />
              <StatCard
                title="Alpa"
                value={currentSummary.absent}
                icon={<AlertCircle className="w-5 h-5" />}
                color="danger"
              />
            </div>

            {/* Class Recap Table - Daily View */}
            {viewMode === "daily" && recapData && (
              <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-[var(--border-light)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Rekap per Kelas
                      </h2>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {formatDate(recapData.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-muted)]">Tingkat Kehadiran</p>
                      <p className="text-3xl font-bold text-[var(--success)]">
                        {recapData.summary.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--surface-secondary)]">
                        <th className="text-left px-6 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Kelas
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Total
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--success)] uppercase tracking-wide">
                          Hadir
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--warning)] uppercase tracking-wide">
                          Sakit
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--info)] uppercase tracking-wide">
                          Izin
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--danger)] uppercase tracking-wide">
                          Alpa
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          %
                        </th>
                        <th className="text-center px-6 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {recapData.byClass.map((cls, index) => (
                        <tr
                          key={cls.classId}
                          className={cn(
                            "hover:bg-[var(--surface-hover)] transition-colors cursor-pointer",
                            index === 0 && "bg-[var(--primary-soft)]/50"
                          )}
                          onClick={() => router.push(`/presensi/kelas/${cls.classId}?date=${selectedDate}`)}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                                <Users className="w-5 h-5 text-[var(--text-muted)]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[var(--text-primary)]">
                                  {cls.className}
                                </p>
                                <p className="text-caption text-[var(--text-muted)]">
                                  {cls.summary.totalStudents} siswa
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-medium text-[var(--text-primary)]">
                            {cls.summary.totalStudents}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--success)]">
                            {cls.summary.present}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--warning)]">
                            {cls.summary.sick}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--info)]">
                            {cls.summary.permission}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--danger)]">
                            {cls.summary.absent}
                          </td>
                          <td className="text-center px-4 py-5">
                            <Badge
                              variant={
                                cls.summary.percentage >= 90
                                  ? "success"
                                  : cls.summary.percentage >= 75
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {cls.summary.percentage.toFixed(0)}%
                            </Badge>
                          </td>
                          <td className="text-center px-6 py-5">
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
            )}

            {/* Weekly View */}
            {viewMode === "weekly" && weeklyData && (
              <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-[var(--border-light)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Rekap Mingguan
                      </h2>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        Minggu ke-{weeklyData.weekNumber} • {formatDate(weeklyData.startDate)} - {formatDate(weeklyData.endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-muted)]">Rata-rata Kehadiran</p>
                      <p className="text-3xl font-bold text-[var(--success)]">
                        {weeklyData.summary.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--surface-secondary)]">
                        <th className="text-left px-6 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Tanggal
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Total
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--success)] uppercase tracking-wide">
                          Hadir
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--warning)] uppercase tracking-wide">
                          Sakit
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--info)] uppercase tracking-wide">
                          Izin
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--danger)] uppercase tracking-wide">
                          Alpa
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {weeklyData.byDay.map((day: any, index: number) => (
                        <tr
                          key={day.date}
                          className="hover:bg-[var(--surface-hover)] transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[var(--text-primary)]">
                                  {formatShortDate(day.date)}
                                </p>
                                <p className="text-caption text-[var(--text-muted)]">
                                  {new Date(day.date).toLocaleDateString("id-ID", { weekday: "long" })}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-medium text-[var(--text-primary)]">
                            {day.summary.totalStudents}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--success)]">
                            {day.summary.present}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--warning)]">
                            {day.summary.sick}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--info)]">
                            {day.summary.permission}
                          </td>
                          <td className="text-center px-4 py-5 text-sm font-semibold text-[var(--danger)]">
                            {day.summary.absent}
                          </td>
                          <td className="text-center px-4 py-5">
                            <Badge
                              variant={
                                day.summary.percentage >= 90
                                  ? "success"
                                  : day.summary.percentage >= 75
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {day.summary.percentage.toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Monthly View */}
            {viewMode === "monthly" && monthlyData && (
              <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-[var(--border-light)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Rekap Bulanan
                      </h2>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {new Date(monthlyData.year, monthlyData.month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })} • {monthlyData.byDay.length} hari efektif
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-muted)]">Rata-rata Kehadiran</p>
                      <p className="text-3xl font-bold text-[var(--success)]">
                        {monthlyData.summary.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[var(--surface-secondary)]">
                        <th className="text-left px-6 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Tanggal
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          Total
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--success)] uppercase tracking-wide">
                          Hadir
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--warning)] uppercase tracking-wide">
                          Sakit
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--info)] uppercase tracking-wide">
                          Izin
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--danger)] uppercase tracking-wide">
                          Alpa
                        </th>
                        <th className="text-center px-4 py-4 text-caption font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {monthlyData.byDay.map((day: any) => (
                        <tr
                          key={day.date}
                          className="hover:bg-[var(--surface-hover)] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-[var(--text-primary)]">
                              {formatShortDate(day.date)}
                            </p>
                            <p className="text-caption text-[var(--text-muted)]">
                              {new Date(day.date).toLocaleDateString("id-ID", { weekday: "short" })}
                            </p>
                          </td>
                          <td className="text-center px-4 py-4 text-sm font-medium text-[var(--text-primary)]">
                            {day.summary.totalStudents}
                          </td>
                          <td className="text-center px-4 py-4 text-sm font-semibold text-[var(--success)]">
                            {day.summary.present}
                          </td>
                          <td className="text-center px-4 py-4 text-sm font-semibold text-[var(--warning)]">
                            {day.summary.sick}
                          </td>
                          <td className="text-center px-4 py-4 text-sm font-semibold text-[var(--info)]">
                            {day.summary.permission}
                          </td>
                          <td className="text-center px-4 py-4 text-sm font-semibold text-[var(--danger)]">
                            {day.summary.absent}
                          </td>
                          <td className="text-center px-4 py-4">
                            <Badge
                              variant={
                                day.summary.percentage >= 90
                                  ? "success"
                                  : day.summary.percentage >= 75
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {day.summary.percentage.toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Attendance Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Tren Kehadiran
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    7 hari terakhir
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
              </div>

              <div className="h-48 flex items-end justify-between gap-2">
                {trendData.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg transition-all hover:bg-[var(--primary)]"
                      style={{
                        height: `${day.percentage}%`,
                        backgroundColor: day.percentage >= 90 ? "var(--success)" : day.percentage >= 75 ? "var(--warning)" : "var(--danger)",
                        opacity: index === trendData.length - 1 ? 1 : 0.6
                      }}
                    />
                    <span className="text-caption text-[var(--text-muted)] font-medium">
                      {day.dayName}
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

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  percentage,
  icon,
  color,
}: {
  title: string
  value: number
  percentage?: number
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

  const valueColors = {
    primary: "text-[var(--text-primary)]",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
    danger: "text-[var(--danger)]",
    info: "text-[var(--info)]",
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-body-sm text-[var(--text-muted)]">{title}</p>
          <p className={cn("text-stat-lg", valueColors[color])}>{value}</p>
          {percentage !== undefined && (
            <p className="text-caption text-[var(--text-muted)]">{percentage.toFixed(0)}%</p>
          )}
        </div>
      </div>
    </Card>
  )
}
