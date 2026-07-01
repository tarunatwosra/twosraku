"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import {
  KPICard,
  AttendanceTrendChart,
  QuickActions,
  ActivityTimeline,
  StudentDistributionChart,
} from "@/components/dashboard"
import { useDashboardStats, useAcademicYear } from "@/hooks"
import {
  Users,
  UserRound,
  CalendarCheck,
  GraduationCap,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { academicYear, semester } = useAcademicYear()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Format tahun ajaran dan semester
  const academicYearName = academicYear?.name || "2024/2025"
  const semesterName = semester?.name || "Semester Genap"

  // Sample trend data (karena belum ada data historical)
  const studentTrendData = [
    { value: 1200 },
    { value: 1220 },
    { value: 1215 },
    { value: 1230 },
    { value: 1240 },
    { value: 1245 },
    { value: stats?.activeStudents || 1248 },
  ]

  const teacherData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 86 },
    { value: 87 },
    { value: stats?.totalTeachers || 87 },
  ]

  const attendanceData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 84 },
    { value: 86 },
    { value: stats?.attendanceToday.percentage || 88.5 },
  ]

  const assessmentData = [
    { value: 65 },
    { value: 70 },
    { value: 72 },
    { value: 68 },
    { value: 75 },
    { value: 78 },
    { value: 82 },
  ]

  return (
    <AppShell showHeader={true}>
      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-[18px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[var(--danger)]">
              Gagal memuat data
            </p>
            <p className="text-[13px] text-[var(--danger)] opacity-80">
              {error.message}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[var(--danger)] text-white text-[13px] font-medium rounded-[14px] hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* School Info Banner */}
      <div className="mb-[24px] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-secondary)]">
            SMKN 2 Sragen
          </span>
          <span>•</span>
          <span>{academicYearName}</span>
          <span>•</span>
          <span>{semesterName}</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--text-secondary)]",
            "hover:bg-[var(--surface-hover)] rounded-[14px] transition-colors",
            (loading || isRefreshing) && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw
            className={cn(
              "w-4 h-4",
              (loading || isRefreshing) && "animate-spin"
            )}
          />
          Refresh
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
        <KPICard
          title="Total Siswa"
          value={loading ? "..." : (stats?.totalStudents || 0).toLocaleString("id-ID")}
          subtitle="siswa terdaftar"
          trend="dari bulan lalu"
          trendValue="+2.4%"
          isPositive={true}
          icon={<Users className="w-6 h-6" />}
          color="primary"
          data={studentTrendData}
        />
        <KPICard
          title="Guru & Staff"
          value={loading ? "..." : (stats?.totalTeachers || 0).toString()}
          subtitle={`${Math.round((stats?.totalTeachers || 0) * 0.6)} guru, ${Math.round((stats?.totalTeachers || 0) * 0.4)} staff`}
          trend="dari tahun lalu"
          trendValue="+3.2%"
          isPositive={true}
          icon={<UserRound className="w-6 h-6" />}
          color="success"
          data={teacherData}
        />
        <KPICard
          title="Presensi Hari Ini"
          value={loading ? "..." : `${(stats?.attendanceToday.percentage || 0).toFixed(1)}%`}
          subtitle={`${stats?.attendanceToday.present || 0} dari ${stats?.attendanceToday.total || 0} siswa`}
          trend="dari kemarin"
          trendValue="+3.2%"
          isPositive={true}
          icon={<CalendarCheck className="w-6 h-6" />}
          color="info"
          data={attendanceData}
        />
        <KPICard
          title="Penilaian"
          value={loading ? "..." : `${stats?.assessmentCompletion || 0}%`}
          subtitle="rapor terisi"
          trend="dari target"
          trendValue={stats?.assessmentCompletion && stats.assessmentCompletion < 90 ? "-8%" : "+5%"}
          isPositive={(stats?.assessmentCompletion ?? 0) >= 90}
          icon={<GraduationCap className="w-6 h-6" />}
          color="warning"
          data={assessmentData}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions className="mb-[24px]" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] mb-[24px]">
        {/* Attendance Trend Chart - 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>

        {/* Student Distribution Chart - 1 column */}
        <div>
          <StudentDistributionChart />
        </div>
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline />
    </AppShell>
  )
}
