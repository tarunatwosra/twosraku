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
  Download,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  File,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Printer,
  Share2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Star,
  BarChart,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// History entry type
interface ReportHistory {
  id: string
  name: string
  templateName: string
  templateId?: string
  category: string
  module: string
  format: "pdf" | "xlsx" | "csv"
  fileName: string
  fileSize: string
  status: "completed" | "failed" | "processing"
  generatedBy: string
  generatedAt: string
  duration: string
  recordCount: number
  filters: Record<string, string>
  isFavorite: boolean
  downloadUrl?: string
  errors?: string[]
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

// Demo history data
const DEMO_HISTORY: ReportHistory[] = [
  {
    id: "hist-1",
    name: "Daftar Siswa X IPA 1",
    templateName: "Daftar Siswa Lengkap",
    templateId: "tpl-1",
    category: "students",
    module: "students",
    format: "xlsx",
    fileName: "daftar_siswa_x_ipa_1_2026-07-01.xlsx",
    fileSize: "2.4 MB",
    status: "completed",
    generatedBy: "Admin",
    generatedAt: "2026-07-01 14:30:00",
    duration: "3.2s",
    recordCount: 36,
    filters: { class: "X IPA 1", status: "active" },
    isFavorite: true,
  },
  {
    id: "hist-2",
    name: "Rekap Absensi Juni 2026",
    templateName: "Rekap Absensi Bulanan",
    templateId: "tpl-2",
    category: "attendance",
    module: "attendance",
    format: "pdf",
    fileName: "rekap_absensi_juni_2026.pdf",
    fileSize: "1.8 MB",
    status: "completed",
    generatedBy: "Admin",
    generatedAt: "2026-07-01 10:15:00",
    duration: "5.1s",
    recordCount: 1248,
    filters: { month: "Juni 2026", class: "all" },
    isFavorite: false,
  },
  {
    id: "hist-3",
    name: "Nilai UAS Kelas XI",
    templateName: "Ringkasan Nilai Semester",
    templateId: "tpl-3",
    category: "assessment",
    module: "assessment",
    format: "xlsx",
    fileName: "nilai_uas_xi_ipa_2026.xlsx",
    fileSize: "856 KB",
    status: "failed",
    generatedBy: "Guru Matematika",
    generatedAt: "2026-06-30 16:00:00",
    duration: "1.5s",
    recordCount: 0,
    filters: { class: "XI IPA", semester: "Ganjil" },
    isFavorite: false,
    errors: [
      "Data siswa tidak ditemukan",
      "Format nilai tidak valid",
    ],
  },
  {
    id: "hist-4",
    name: "Poin Karakter Mei 2026",
    templateName: "Poin Karakter Per Siswa",
    templateId: "tpl-4",
    category: "character",
    module: "character",
    format: "pdf",
    fileName: "poin_karakter_mei_2026.pdf",
    fileSize: "445 KB",
    status: "completed",
    generatedBy: "Wali Kelas",
    generatedAt: "2026-06-30 09:00:00",
    duration: "2.1s",
    recordCount: 156,
    filters: { month: "Mei 2026", semester: "Ganjil" },
    isFavorite: true,
  },
  {
    id: "hist-5",
    name: "Daftar Anggota Paskhas",
    templateName: "Daftar Anggota Paskhas",
    templateId: "tpl-5",
    category: "special-units",
    module: "specialUnits",
    format: "xlsx",
    fileName: "anggota_paskhas_2026.xlsx",
    fileSize: "324 KB",
    status: "completed",
    generatedBy: "Komandan Paskhas",
    generatedAt: "2026-06-25 11:00:00",
    duration: "1.2s",
    recordCount: 45,
    filters: { unit: "Paskhas" },
    isFavorite: false,
  },
  {
    id: "hist-6",
    name: "Overview Analytics Juni",
    templateName: "Overview Analytics",
    templateId: "tpl-6",
    category: "analytics",
    module: "analytics",
    format: "pdf",
    fileName: "analytics_overview_juni_2026.pdf",
    fileSize: "2.1 MB",
    status: "completed",
    generatedBy: "Admin",
    generatedAt: "2026-06-30 15:30:00",
    duration: "8.5s",
    recordCount: 890,
    filters: { month: "Juni 2026", year: "2025/2026" },
    isFavorite: false,
  },
  {
    id: "hist-7",
    name: "Daftar Siswa Lengkap",
    templateName: "Daftar Siswa Lengkap",
    templateId: "tpl-1",
    category: "students",
    module: "students",
    format: "xlsx",
    fileName: "daftar_siswa_lengkap_2026.xlsx",
    fileSize: "4.2 MB",
    status: "processing",
    generatedBy: "Admin",
    generatedAt: "2026-07-03 08:00:00",
    duration: "-",
    recordCount: 0,
    filters: { status: "active" },
    isFavorite: false,
  },
]

// Status config
const statusConfig = {
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    color: "var(--success)",
    variant: "success" as const,
  },
  failed: {
    label: "Gagal",
    icon: XCircle,
    color: "var(--danger)",
    variant: "danger" as const,
  },
  processing: {
    label: "Diproses",
    icon: Clock,
    color: "var(--warning)",
    variant: "warning" as const,
  },
}

// Format icons
const formatIcons: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: File, color: "#EF4444" },
  xlsx: { icon: FileSpreadsheet, color: "#22c55e" },
  csv: { icon: FileText, color: "#F59E0B" },
}

export default function ReportHistoryPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "failed" | "processing">("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter history
  const filteredHistory = DEMO_HISTORY.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.generatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = selectedModule === "all" || entry.module === selectedModule
    const matchesStatus = selectedStatus === "all" || entry.status === selectedStatus
    const matchesFavorite = !showFavoritesOnly || entry.isFavorite
    return matchesSearch && matchesModule && matchesStatus && matchesFavorite
  })

  // Statistics
  const stats = {
    total: DEMO_HISTORY.length,
    completed: DEMO_HISTORY.filter((h) => h.status === "completed").length,
    failed: DEMO_HISTORY.filter((h) => h.status === "failed").length,
    processing: DEMO_HISTORY.filter((h) => h.status === "processing").length,
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In real app, this would update the database
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
    <AppShell title="Riwayat Laporan" description="Riwayat semua laporan yang telah dihasilkan">
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
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Laporan</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Riwayat semua laporan yang telah dihasilkan
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total</p>
            <p className="text-stat-lg text-[var(--text-primary)]">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
              <p className="text-body-sm text-[var(--text-muted)]">Selesai</p>
            </div>
            <p className="text-stat-lg text-[var(--success)]">{stats.completed}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[var(--danger)]" />
              <p className="text-body-sm text-[var(--text-muted)]">Gagal</p>
            </div>
            <p className="text-stat-lg text-[var(--danger)]">{stats.failed}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
              <p className="text-body-sm text-[var(--text-muted)]">Diproses</p>
            </div>
            <p className="text-stat-lg text-[var(--warning)]">{stats.processing}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari laporan, template, atau user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
            />
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

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="failed">Gagal</option>
            <option value="processing">Diproses</option>
          </select>

          {/* Favorites Toggle */}
          <Button
            variant={showFavoritesOnly ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="gap-2"
          >
            <Star className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} />
            Favorit
          </Button>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredHistory.map((entry) => {
            const Icon = getModuleIcon(entry.module)
            const color = getModuleColor(entry.module)
            const statusInfo = statusConfig[entry.status]
            const StatusIcon = statusInfo.icon
            const FormatIcon = formatIcons[entry.format]?.icon || FileText
            const FormatColor = formatIcons[entry.format]?.color || "#6B7280"
            const isExpanded = expandedId === entry.id

            return (
              <Card key={entry.id} className="overflow-hidden">
                {/* Main Row */}
                <div
                  className={cn(
                    "flex items-center gap-4 p-4 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors",
                    entry.status === "processing" && "bg-[var(--warning-soft)]"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(entry.id, e)}
                    className={cn(
                      "transition-colors",
                      entry.isFavorite
                        ? "text-[var(--warning)]"
                        : "text-[var(--text-muted)] hover:text-[var(--warning)]"
                    )}
                  >
                    <Star className={cn("w-5 h-5", entry.isFavorite && "fill-current")} />
                  </button>

                  {/* Status Icon */}
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: `${statusInfo.color}20` }}
                  >
                    <StatusIcon className="w-5 h-5" style={{ color: statusInfo.color }} />
                  </div>

                  {/* Module Icon */}
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>

                  {/* Report Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                        {entry.name}
                      </p>
                      <Badge variant={statusInfo.variant} className="text-[10px]">
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                      <span>Template: {entry.templateName}</span>
                      <span>•</span>
                      <span>{entry.generatedBy}</span>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="hidden md:flex items-center gap-4 text-center">
                    <div className="flex items-center gap-2">
                      <FormatIcon className="w-4 h-4" style={{ color: FormatColor }} />
                      <span className="text-[13px] text-[var(--text-secondary)] uppercase">
                        {entry.format}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] text-[var(--text-secondary)]">
                        {entry.fileSize}
                      </p>
                    </div>
                  </div>

                  {/* Record Count */}
                  <div className="hidden lg:block text-center">
                    <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {entry.recordCount > 0 ? entry.recordCount.toLocaleString("id-ID") : "-"}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">Record</p>
                  </div>

                  {/* Time */}
                  <div className="text-right">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {formatDate(entry.generatedAt)}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {entry.duration}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-[var(--text-muted)] transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-light)] p-4 bg-[var(--surface-secondary)]">
                    {/* File Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Nama File</p>
                        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                          {entry.fileName}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Ukuran</p>
                        <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                          {entry.fileSize}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Format</p>
                        <p className="text-[14px] font-semibold text-[var(--text-primary)] uppercase">
                          {entry.format}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Jumlah Record</p>
                        <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                          {entry.recordCount > 0 ? entry.recordCount.toLocaleString("id-ID") : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Filters */}
                    {Object.keys(entry.filters).length > 0 && (
                      <div className="mb-4">
                        <p className="text-[12px] font-medium text-[var(--text-muted)] mb-2">Filter yang digunakan:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(entry.filters).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-3 py-1 bg-white rounded-[8px] text-[13px] text-[var(--text-secondary)]"
                            >
                              {key}: <span className="font-medium">{value}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {entry.errors && entry.errors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[12px] font-medium text-[var(--danger)] mb-2">
                          Error ({entry.errors.length}):
                        </p>
                        <div className="bg-white rounded-[12px] p-3">
                          {entry.errors.map((error, index) => (
                            <p key={index} className="text-[12px] text-[var(--text-secondary)] mb-1">
                              • {error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {entry.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Printer className="w-4 h-4" />
                            Cetak
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Bagikan
                          </Button>
                        </>
                      )}
                      {entry.status === "failed" && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Buat Ulang
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Lihat Detail
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-[var(--danger)]">
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <Card className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Tidak ada riwayat laporan yang ditemukan</p>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
