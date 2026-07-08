"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  FileText,
  BarChart3,
  Clock,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  FileBarChart,
  Users,
  ClipboardCheck,
  Award,
  Shield,
  GraduationCap,
  PiggyBank,
  Star,
  Bookmark,
  Settings,
  ChevronRight,
  Play,
  Plus,
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Report categories with icons
const REPORT_CATEGORIES = [
  {
    id: "students",
    name: "Laporan Siswa",
    icon: Users,
    color: "#4F7CFF",
    reports: [
      { id: "student-list", name: "Daftar Siswa", description: "Daftar lengkap semua siswa" },
      { id: "student-detail", name: "Detail Siswa", description: "Data detail per siswa" },
      { id: "student-birthday", name: "Daftar Ulang Tahun", description: "Daftar siswa berdasarkan tanggal lahir" },
    ],
  },
  {
    id: "attendance",
    name: "Laporan Absensi",
    icon: ClipboardCheck,
    color: "#22c55e",
    reports: [
      { id: "attendance-daily", name: "Absensi Harian", description: "Rekap absensi harian" },
      { id: "attendance-weekly", name: "Absensi Mingguan", description: "Rekap absensi mingguan" },
      { id: "attendance-monthly", name: "Absensi Bulanan", description: "Rekap absensi bulanan" },
    ],
  },
  {
    id: "assessment",
    name: "Laporan Penilaian",
    icon: GraduationCap,
    color: "#F59E0B",
    reports: [
      { id: "score-summary", name: "Ringkasan Nilai", description: "Ringkasan nilai per siswa/kelas" },
      { id: "score-detail", name: "Detail Nilai", description: "Detail nilai lengkap" },
      { id: "score-rank", name: "Peringkat Siswa", description: "Peringkat berdasarkan nilai" },
    ],
  },
  {
    id: "character",
    name: "Laporan Poin Karakter",
    icon: Award,
    color: "#8b5cf6",
    reports: [
      { id: "character-summary", name: "Ringkasan Poin", description: "Ringkasan poin karakter" },
      { id: "character-detail", name: "Detail Poin", description: "Detail poin karakter per siswa" },
      { id: "character-rank", name: "Peringkat Karakter", description: "Peringkat karakter terbaik" },
    ],
  },
  {
    id: "special-units",
    name: "Laporan Pasukan Khusus",
    icon: Shield,
    color: "#EF4444",
    reports: [
      { id: "unit-members", name: "Daftar Anggota", description: "Daftar anggota pasukan khusus" },
      { id: "unit-assignment", name: "Penugasan", description: "Daftar penugasan" },
    ],
  },
  {
    id: "analytics",
    name: "Laporan Analytics",
    icon: BarChart,
    color: "#06b6d4",
    reports: [
      { id: "analytics-overview", name: "Overview", description: "Ringkasan analytics" },
      { id: "analytics-trend", name: "Tren", description: "Analisis tren" },
      { id: "analytics-comparison", name: "Perbandingan", description: "Perbandingan antar periode" },
    ],
  },
]

// Demo recent reports
const DEMO_RECENT_REPORTS = [
  { id: "r-1", name: "Daftar Siswa X IPA 1", category: "students", generatedAt: "2026-07-01 10:30", generatedBy: "Admin", format: "xlsx" },
  { id: "r-2", name: "Rekap Absensi Juni 2026", category: "attendance", generatedAt: "2026-07-01 09:15", generatedBy: "Admin", format: "pdf" },
  { id: "r-3", name: "Nilai Semester Ganjil", category: "assessment", generatedAt: "2026-06-30 16:00", generatedBy: "Guru Matematika", format: "xlsx" },
  { id: "r-4", name: "Poin Karakter Mei 2026", category: "character", generatedAt: "2026-06-30 14:30", generatedBy: "Wali Kelas", format: "pdf" },
]

// Demo favorite reports
const DEMO_FAVORITE_REPORTS = [
  { id: "f-1", name: "Daftar Siswa Aktif", icon: Users },
  { id: "f-2", name: "Rekap Absensi Bulanan", icon: ClipboardCheck },
  { id: "f-3", name: "Ringkasan Nilai", icon: GraduationCap },
]

// Demo scheduled reports
const DEMO_SCHEDULED_REPORTS = [
  { id: "s-1", name: "Absensi Mingguan", schedule: "Setiap Senin 08:00", nextRun: "2026-07-06", status: "active" },
  { id: "s-2", name: "Nilai Bulanan", schedule: "Setiap tanggal 25", nextRun: "2026-07-25", status: "active" },
]

export default function ReportsDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Statistics
  const stats = useMemo(() => ({
    totalReports: 156,
    thisMonth: 23,
    scheduledReports: 5,
    avgGenerationTime: "3.2s",
  }), [])

  // Category icon and color helper
  const getCategoryInfo = (categoryId: string) => {
    const category = REPORT_CATEGORIES.find((c) => c.id === categoryId)
    return category ? { icon: category.icon, color: category.color, name: category.name } : null
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

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

  return (
    <AppShell
      title="Laporan"
      description="Pusat توليد dan kelola semua laporan sekolah"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button className="gap-2" onClick={() => router.push("/laporan/generate")}>
              <Plus className="w-4 h-4" />
              Buat Laporan
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => router.push("/laporan/templates")}>
              <FileText className="w-4 h-4" />
              Template
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/laporan/scheduled")}>
              <Calendar className="w-4 h-4 mr-2" />
              Terjadwal
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/laporan/history")}>
              <Clock className="w-4 h-4 mr-2" />
              Riwayat
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/laporan/analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Laporan"
            value={stats.totalReports}
            icon={<FileBarChart className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Bulan Ini"
            value={stats.thisMonth}
            icon={<Calendar className="w-5 h-5" />}
            color="info"
          />
          <StatCard
            title="Terjadwal"
            value={stats.scheduledReports}
            icon={<Clock className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            title="Avg. Waktu"
            value={stats.avgGenerationTime}
            icon={<TrendingUp className="w-5 h-5" />}
            color="success"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Favorites */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[var(--warning)]" />
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Laporan Favorit
              </h3>
            </div>
            <div className="space-y-2">
              {DEMO_FAVORITE_REPORTS.map((report) => {
                const Icon = report.icon
                return (
                  <button
                    key={report.id}
                    className="w-full flex items-center gap-3 p-3 rounded-[14px] hover:bg-[var(--surface-hover)] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-[var(--warning-soft)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--warning)]" />
                    </div>
                    <span className="text-[14px] text-[var(--text-primary)]">{report.name}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Scheduled Reports */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[var(--info)]" />
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Laporan Terjadwal
              </h3>
            </div>
            <div className="space-y-3">
              {DEMO_SCHEDULED_REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--surface-secondary)]"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">{report.name}</p>
                    <p className="text-[12px] text-[var(--text-muted)]">{report.schedule}</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Active
                  </Badge>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push("/laporan/scheduled")}
              >
                Kelola Terjadwal →
              </Button>
            </div>
          </Card>

          {/* Quick Generate */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-[var(--success)]" />
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                توليد Cepat
              </h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push("/laporan/generate?type=students")}
              >
                <Users className="w-4 h-4" />
                Daftar Siswa
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push("/laporan/generate?type=attendance")}
              >
                <ClipboardCheck className="w-4 h-4" />
                Rekap Absensi
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push("/laporan/generate?type=assessment")}
              >
                <GraduationCap className="w-4 h-4" />
                Nilai Semester
              </Button>
            </div>
          </Card>
        </div>

        {/* Report Categories */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Kategori Laporan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {REPORT_CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md",
                    selectedCategory === category.id
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-transparent bg-[var(--surface-secondary)]"
                  )}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--text-primary)] text-center">
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Selected Category Reports */}
          {selectedCategory && (
            <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
              <h3 className="text-h5 text-[var(--text-primary)] mb-4">
                Laporan {REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.reports.map((report) => (
                  <button
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-[14px] bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] transition-colors text-left"
                    onClick={() => router.push(`/laporan/generate?type=${report.id}`)}
                  >
                    <div>
                      <p className="text-[14px] font-medium text-[var(--text-primary)]">{report.name}</p>
                      <p className="text-[12px] text-[var(--text-muted)]">{report.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Recent Reports */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between">
              <h2 className="text-section-title">
                Laporan Terbaru
              </h2>
              <Button variant="ghost" size="sm" onClick={() => router.push("/laporan/history")}>
                Lihat Semua →
              </Button>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-light)]">
            {DEMO_RECENT_REPORTS.map((report) => {
              const categoryInfo = getCategoryInfo(report.category)
              const CategoryIcon = categoryInfo?.icon || FileText

              return (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/laporan/history/${report.id}`)}
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: `${categoryInfo?.color}20` }}
                  >
                    <CategoryIcon className="w-5 h-5" style={{ color: categoryInfo?.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                      <span>{categoryInfo?.name}</span>
                      <span>•</span>
                      <span>{report.generatedBy}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {formatDate(report.generatedAt)}
                    </p>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {report.format}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation() }}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation() }}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "secondary" | "info" | "danger"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-stat-lg text-[var(--text-primary)]">{value}</p>
          <p className="text-caption text-[var(--text-muted)]">{title}</p>
        </div>
      </div>
    </Card>
  )
}
