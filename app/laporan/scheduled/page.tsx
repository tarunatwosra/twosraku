"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowLeft,
  Plus,
  Clock,
  Calendar,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  BarChart,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Pause,
  Play,
  Copy,
  FileText,
  Download,
  Printer,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Schedule frequency options
const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Harian", icon: Clock },
  { id: "weekly", label: "Mingguan", icon: Calendar },
  { id: "monthly", label: "Bulanan", icon: Calendar },
  { id: "semester", label: "Per Semester", icon: Calendar },
  { id: "yearly", label: "Tahunan", icon: Calendar },
  { id: "custom", label: "Kustom", icon: Settings },
]

// Scheduled report type
interface ScheduledReport {
  id: string
  name: string
  templateId: string
  templateName: string
  category: string
  module: string
  frequency: "daily" | "weekly" | "monthly" | "semester" | "yearly" | "custom"
  frequencyLabel: string
  customSchedule?: string
  time: string
  nextRun: string
  lastRun?: string
  lastRunStatus?: "success" | "failed" | "skipped"
  status: "active" | "paused" | "disabled"
  format: "pdf" | "xlsx" | "csv"
  recipients?: string[]
  actions: ("generate" | "export" | "print" | "email")[]
  filters: Record<string, string>
  createdAt: string
  createdBy: string
}

// Module icons
const moduleIcons: Record<string, { icon: typeof Users; color: string }> = {
  students: { icon: Users, color: "#4F7CFF" },
  attendance: { icon: ClipboardCheck, color: "#22c55e" },
  assessment: { icon: GraduationCap, color: "#F59E0B" },
  character: { icon: Award, color: "#8b5cf6" },
  specialUnits: { icon: Shield, color: "#EF4444" },
  analytics: { icon: BarChart, color: "#06b6d4" },
}

// Demo scheduled reports
const DEMO_SCHEDULED_REPORTS: ScheduledReport[] = [
  {
    id: "sched-1",
    name: "Absensi Mingguan",
    templateId: "tpl-att-weekly",
    templateName: "Rekap Absensi Mingguan",
    category: "attendance",
    module: "attendance",
    frequency: "weekly",
    frequencyLabel: "Setiap Senin",
    time: "08:00",
    nextRun: "2026-07-06",
    lastRun: "2026-06-29",
    lastRunStatus: "success",
    status: "active",
    format: "pdf",
    recipients: ["admin@school.sch.id", "wakakur@school.sch.id"],
    actions: ["generate", "export", "email"],
    filters: { class: "all", semester: "Ganjil 2025/2026" },
    createdAt: "2026-01-15",
    createdBy: "Admin",
  },
  {
    id: "sched-2",
    name: "Nilai Bulanan",
    templateId: "tpl-ass-monthly",
    templateName: "Ringkasan Nilai Bulanan",
    category: "assessment",
    module: "assessment",
    frequency: "monthly",
    frequencyLabel: "Tanggal 25",
    time: "09:00",
    nextRun: "2026-07-25",
    lastRun: "2026-06-25",
    lastRunStatus: "success",
    status: "active",
    format: "xlsx",
    recipients: ["kepsek@school.sch.id"],
    actions: ["generate", "export", "email"],
    filters: { class: "all", semester: "Ganjil 2025/2026" },
    createdAt: "2025-09-01",
    createdBy: "Admin",
  },
  {
    id: "sched-3",
    name: "Daftar Siswa Harian",
    templateId: "tpl-std-daily",
    templateName: "Daftar Siswa Lengkap",
    category: "students",
    module: "students",
    frequency: "daily",
    frequencyLabel: "Setiap Pagi",
    time: "06:00",
    nextRun: "2026-07-04",
    lastRun: "2026-07-03",
    lastRunStatus: "failed",
    status: "active",
    format: "pdf",
    recipients: ["admin@school.sch.id"],
    actions: ["generate", "export", "print"],
    filters: { status: "active" },
    createdAt: "2025-06-20",
    createdBy: "Admin",
  },
  {
    id: "sched-4",
    name: "Poin Karakter Mingguan",
    templateId: "tpl-chr-weekly",
    templateName: "Ringkasan Poin Karakter",
    category: "character",
    module: "character",
    frequency: "weekly",
    frequencyLabel: "Setiap Jumat",
    time: "15:00",
    nextRun: "2026-07-10",
    status: "paused",
    format: "pdf",
    actions: ["generate", "export"],
    filters: { semester: "Ganjil 2025/2026" },
    createdAt: "2025-11-10",
    createdBy: "Admin",
  },
  {
    id: "sched-5",
    name: "Laporan Analytics Bulanan",
    templateId: "tpl-analytics-monthly",
    templateName: "Overview Analytics",
    category: "analytics",
    module: "analytics",
    frequency: "monthly",
    frequencyLabel: "Tanggal 1",
    time: "07:00",
    nextRun: "2026-08-01",
    lastRun: "2026-07-01",
    lastRunStatus: "success",
    status: "active",
    format: "pdf",
    recipients: ["kepsek@school.sch.id", "admin@school.sch.id"],
    actions: ["generate", "export", "email"],
    filters: { year: "2025/2026" },
    createdAt: "2026-01-05",
    createdBy: "Admin",
  },
  {
    id: "sched-6",
    name: "Daftar Anggota Paskhas",
    templateId: "tpl-paskhas-monthly",
    templateName: "Daftar Anggota Paskhas",
    category: "special-units",
    module: "specialUnits",
    frequency: "monthly",
    frequencyLabel: "Tanggal 15",
    time: "10:00",
    nextRun: "2026-07-15",
    lastRun: "2026-06-15",
    lastRunStatus: "success",
    status: "active",
    format: "xlsx",
    recipients: ["komandan@paskhas.sch.id"],
    actions: ["generate", "export", "email"],
    filters: { unit: "Paskhas" },
    createdAt: "2026-02-01",
    createdBy: "Admin",
  },
]

// Status config
const statusConfig = {
  active: { label: "Aktif", variant: "success" as const, icon: Play },
  paused: { label: "Dijeda", variant: "warning" as const, icon: Pause },
  disabled: { label: "Dinonaktifkan", variant: "secondary" as const, icon: AlertCircle },
}

// Last run status config
const lastRunConfig = {
  success: { label: "Berhasil", color: "var(--success)" },
  failed: { label: "Gagal", color: "var(--danger)" },
  skipped: { label: "Dilewati", color: "var(--warning)" },
}

export default function ScheduledReportsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "paused" | "disabled">("all")
  const [selectedModule, setSelectedModule] = useState("all")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter scheduled reports
  const filteredReports = DEMO_SCHEDULED_REPORTS.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.templateName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesModule = selectedModule === "all" || report.module === selectedModule
    return matchesSearch && matchesStatus && matchesModule
  })

  // Statistics
  const stats = {
    total: DEMO_SCHEDULED_REPORTS.length,
    active: DEMO_SCHEDULED_REPORTS.filter((r) => r.status === "active").length,
    paused: DEMO_SCHEDULED_REPORTS.filter((r) => r.status === "paused").length,
    nextRunToday: DEMO_SCHEDULED_REPORTS.filter((r) => r.nextRun === "2026-07-03").length,
  }

  // Get module icon
  const getModuleIcon = (moduleId: string) => {
    const config = moduleIcons[moduleId]
    return config?.icon || FileText
  }

  const getModuleColor = (moduleId: string) => {
    const config = moduleIcons[moduleId]
    return config?.color || "#6B7280"
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Get action icons
  const getActionIcon = (action: string) => {
    switch (action) {
      case "generate": return <FileText className="w-3 h-3" />
      case "export": return <Download className="w-3 h-3" />
      case "print": return <Printer className="w-3 h-3" />
      case "email": return <Download className="w-3 h-3" />
      default: return null
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell title="Laporan Terjadwal" description="Kelola laporan yang dihasilkan secara otomatis">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/laporan"
              className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Laporan Terjadwal</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Kelola laporan yang dihasilkan secara otomatis
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Jadwal Baru
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
                <p className="text-sm text-[var(--text-muted)]">Total Terjadwal</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--success-soft)] flex items-center justify-center">
                <Play className="w-5 h-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--success)]">{stats.active}</p>
                <p className="text-sm text-[var(--text-muted)]">Aktif</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--warning-soft)] flex items-center justify-center">
                <Pause className="w-5 h-5 text-[var(--warning)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--warning)]">{stats.paused}</p>
                <p className="text-sm text-[var(--text-muted)]">Dijeda</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--info)]">{stats.nextRunToday}</p>
                <p className="text-sm text-[var(--text-muted)]">Jadwal Hari Ini</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari laporan terjadwal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-[14px]">
            {[
              { value: "all", label: "Semua" },
              { value: "active", label: "Aktif" },
              { value: "paused", label: "Dijeda" },
              { value: "disabled", label: "Nonaktif" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value as typeof selectedStatus)}
                className={cn(
                  "px-4 py-2 rounded-[12px] text-[13px] font-medium transition-all",
                  selectedStatus === option.value
                    ? "bg-white shadow-sm text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
          >
            <option value="all">Semua Modul</option>
            <option value="students">Siswa</option>
            <option value="attendance">Absensi</option>
            <option value="assessment">Penilaian</option>
            <option value="character">Poin Karakter</option>
            <option value="specialUnits">Pasukan Khusus</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>

        {/* Scheduled Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const Icon = getModuleIcon(report.module)
            const color = getModuleColor(report.module)
            const statusInfo = statusConfig[report.status]

            return (
              <Card key={report.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Module Icon */}
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>

                  {/* Report Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                        {report.name}
                      </p>
                      <Badge variant={statusInfo.variant} className="text-[10px]">
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-[var(--text-muted)] mb-2">
                      Template: {report.templateName}
                    </p>

                    {/* Schedule Info */}
                    <div className="flex items-center gap-4 text-[12px] text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.frequencyLabel} • {report.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: {formatDate(report.nextRun)}
                      </div>
                      {report.lastRun && (
                        <div
                          className="flex items-center gap-1"
                          style={{ color: report.lastRunStatus ? lastRunConfig[report.lastRunStatus].color : undefined }}
                        >
                          <span>Last: {report.lastRunStatus && lastRunConfig[report.lastRunStatus].label}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Format Badge */}
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {report.format}
                    </Badge>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-[var(--surface-secondary)] rounded-[10px]">
                      {report.actions.map((action) => (
                        <div
                          key={action}
                          className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)]"
                          title={action}
                        >
                          {getActionIcon(action)}
                        </div>
                      ))}
                    </div>

                    {/* Recipients Count */}
                    {report.recipients && (
                      <div className="text-[12px] text-[var(--text-muted)]">
                        <Download className="w-3 h-3 inline mr-1" />
                        {report.recipients.length}
                      </div>
                    )}

                    {/* Menu Button */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuId(openMenuId === report.id ? null : report.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {openMenuId === report.id && (
                        <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            {report.status === "active" ? "Jeda" : "Aktifkan"}
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            Duplikat
                          </button>
                          <div className="border-t border-[var(--border-light)] my-1" />
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2 text-[var(--danger)]">
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filters Preview */}
                {Object.keys(report.filters).length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                      <span>Filter:</span>
                      {Object.entries(report.filters).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 bg-[var(--surface-secondary)] rounded-[6px]"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Tidak ada laporan terjadwal yang ditemukan</p>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
