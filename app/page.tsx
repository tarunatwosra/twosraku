"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"
import { useDashboardStats } from "@/hooks"
import { useRouter } from "next/navigation"
import {
  KPICard,
  AttendanceTrendChart,
  QuickActions,
  ActivityTimeline,
  StudentDistributionChart,
  CharacterBalanceWidget,
  SpecialUnitMembersWidget,
  SavingsOverviewWidget,
  NotificationsPanel,
  AssessmentProgressWidget,
  CharacterPointsVisualization,
  CalendarWidget,
  AnnouncementsWidget,
  GlobalSearch,
  AttendanceScheduleWidget,
} from "@/components/dashboard"
import { KPICardSkeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserRound,
  CalendarCheck,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  Wallet,
  Shield,
  TrendingUp,
  LayoutGrid,
  BarChart3,
  PiggyBank,
} from "lucide-react"
import { cn } from "@/lib/utils"

type DashboardTab = "overview" | "akademik" | "keuangan" | "karakter"

const tabItems = [
  { id: "overview" as const, label: "Ringkasan", icon: LayoutGrid },
  { id: "akademik" as const, label: "Akademik", icon: GraduationCap },
  { id: "keuangan" as const, label: "Keuangan", icon: Wallet },
  { id: "karakter" as const, label: "Karakter", icon: TrendingUp },
]

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { settings } = useSettings()
  const { stats, loading, error, refetch } = useDashboardStats()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview")

  const academicYear = settings.academic.academicYears.find(
    (y) => y.id === settings.academic.activeAcademicYear
  )
  const semester = settings.academic.semesters.find(
    (s) => s.id === settings.academic.activeSemester
  )

  // Redirect to login if not authenticated
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

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Format tahun ajaran dan semester
  const academicYearName = academicYear?.name || "2025/2026"
  const semesterName = semester?.name || "Semester Ganjil"

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

  const characterData = [
    { value: 85 },
    { value: 88 },
    { value: 90 },
    { value: 92 },
    { value: 95 },
    { value: 93 },
    { value: 98 },
  ]

  // Render KPI cards based on loading state
  const renderKPICards = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (activeTab === "overview" || activeTab === "akademik") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
          <KPICard
            title="Total Siswa"
            value={(stats?.totalStudents || 0).toLocaleString("id-ID")}
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
            value={(stats?.totalTeachers || 0).toString()}
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
            value={`${(stats?.attendanceToday.percentage || 0).toFixed(1)}%`}
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
            value={`${stats?.assessmentCompletion || 0}%`}
            subtitle="rapor terisi"
            trend="dari target"
            trendValue={stats?.assessmentCompletion && stats.assessmentCompletion < 90 ? "-8%" : "+5%"}
            isPositive={(stats?.assessmentCompletion ?? 0) >= 90}
            icon={<GraduationCap className="w-6 h-6" />}
            color="warning"
            data={assessmentData}
          />
        </div>
      )
    }

    if (activeTab === "keuangan") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[24px]">
          <KPICard
            title="Total Tabungan"
            value={`Rp ${((stats?.savingsStats?.totalSavings || 125000000) / 1000000).toFixed(0)}jt`}
            subtitle={`${stats?.savingsStats?.activeStudents || 800} siswa aktif`}
            trend="dari bulan lalu"
            trendValue="+12.5%"
            isPositive={true}
            icon={<Wallet className="w-6 h-6" />}
            color="success"
          />
          <KPICard
            title="Total Setoran"
            value={`Rp ${((stats?.savingsStats?.totalDeposits || 85000000) / 1000000).toFixed(0)}jt`}
            subtitle="bulan ini"
            trend="dari bulan lalu"
            trendValue="+8.3%"
            isPositive={true}
            icon={<PiggyBank className="w-6 h-6" />}
            color="primary"
          />
          <KPICard
            title="Total Penarikan"
            value={`Rp ${((stats?.savingsStats?.totalWithdrawals || 15000000) / 1000000).toFixed(0)}jt`}
            subtitle="bulan ini"
            trend="dari bulan lalu"
            trendValue="-5.1%"
            isPositive={false}
            icon={<Wallet className="w-6 h-6" />}
            color="warning"
          />
        </div>
      )
    }

    if (activeTab === "karakter") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
          <KPICard
            title="Balance Karakter"
            value={(stats?.characterStats?.balance || 0).toLocaleString("id-ID")}
            subtitle={`+${stats?.characterStats?.positivePoints || 0} / -${stats?.characterStats?.negativePoints || 0}`}
            trend="dari semester lalu"
            trendValue={stats?.characterStats?.balance && stats.characterStats.balance >= 0 ? "+8%" : "-3%"}
            isPositive={(stats?.characterStats?.balance ?? 0) >= 0}
            icon={<TrendingUp className="w-6 h-6" />}
            color={(stats?.characterStats?.balance ?? 0) >= 0 ? "success" : "danger"}
            data={characterData}
          />
          <KPICard
            title="Poin Positif"
            value={`+${stats?.characterStats?.positivePoints || 0}`}
            subtitle="total poin positif"
            trend="dari semester lalu"
            trendValue="+15%"
            isPositive={true}
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
          />
          <KPICard
            title="Poin Negatif"
            value={`-${stats?.characterStats?.negativePoints || 0}`}
            subtitle="total poin negatif"
            trend="dari semester lalu"
            trendValue="-10%"
            isPositive={true}
            icon={<TrendingUp className="w-6 h-6" />}
            color="warning"
          />
          <KPICard
            title="Unit Khusus"
            value={(stats?.specialUnits?.reduce((sum, u) => sum + u.members, 0) || 300).toString()}
            subtitle="anggota aktif"
            trend="dari tahun lalu"
            trendValue="+5.8%"
            isPositive={true}
            icon={<Shield className="w-6 h-6" />}
            color="purple"
          />
        </div>
      )
    }

    return null
  }

  // Render main content based on active tab
  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] mb-[24px]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[28px] p-[28px] shadow-sm animate-pulse">
              <div className="h-6 w-36 bg-[var(--surface-hover)] rounded mb-4" />
              <div className="h-48 bg-[var(--surface-hover)] rounded" />
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === "overview") {
      return (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] mb-[24px]">
            <div className="lg:col-span-2 space-y-[24px]">
              <AttendanceTrendChart />
              <AssessmentProgressWidget />
            </div>
            <div className="space-y-[24px]">
              <CalendarWidget />
              <StudentDistributionChart />
            </div>
          </div>
        </>
      )
    }

    if (activeTab === "akademik") {
      return (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
            <AttendanceTrendChart />
            <AssessmentProgressWidget />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
            <NotificationsPanel />
            <AttendanceScheduleWidget />
          </div>
        </>
      )
    }

    if (activeTab === "keuangan") {
      return (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
            <SavingsOverviewWidget
              totalSavings={stats?.savingsStats?.totalSavings || 125000000}
              totalDeposits={stats?.savingsStats?.totalDeposits || 85000000}
              totalWithdrawals={stats?.savingsStats?.totalWithdrawals || 15000000}
              activeStudents={stats?.savingsStats?.activeStudents || 800}
            />
            <StudentDistributionChart />
          </div>
        </>
      )
    }

    if (activeTab === "karakter") {
      return (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
            <CharacterPointsVisualization />
            <CharacterBalanceWidget
              positivePoints={stats?.characterStats?.positivePoints || 0}
              negativePoints={stats?.characterStats?.negativePoints || 0}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-[24px]">
            <SpecialUnitMembersWidget />
            <NotificationsPanel />
          </div>
        </>
      )
    }

    return null
  }

  return (
    <AppShell showHeader={true}>
      {/* Error State - Improved with actionable feedback */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-[18px] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[var(--danger)]">
              Gagal memuat data dashboard
            </p>
            <p className="text-[13px] text-[var(--danger)] opacity-80 mt-1">
              {error.message || "Terjadi kesalahan saat mengambil data. Pastikan koneksi internet stabil."}
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* School Info Banner */}
      <div className="mb-[24px] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-secondary)]">
            {settings.school.name}
          </span>
          <span>•</span>
          <span>{academicYearName}</span>
          <span>•</span>
          <span>{semesterName}</span>
        </div>
        <div className="flex items-center gap-3">
          <GlobalSearch />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className={cn(
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
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-[24px]">
        <div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-[18px] w-fit">
          {tabItems.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-[14px] text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* KPI Cards - Tab-specific */}
      {renderKPICards()}

      {/* Quick Actions */}
      <QuickActions className="mb-[24px]" />

      {/* Main Content - Tab-specific */}
      {renderMainContent()}

      {/* Activity Timeline - Full Width */}
      {!loading && <ActivityTimeline />}
    </AppShell>
  )
}
