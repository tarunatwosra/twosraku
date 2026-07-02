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
  Upload,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  PiggyBank,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

// History entry type
interface HistoryEntry {
  id: string
  type: "import" | "export"
  module: string
  moduleName: string
  fileName: string
  fileSize: string
  status: "completed" | "failed" | "processing" | "pending"
  user: string
  startTime: string
  endTime: string
  duration: string
  recordsAffected: number
  recordsSuccess: number
  recordsFailed: number
  errors?: string[]
  details: {
    recordsTotal: number
    recordsInserted: number
    recordsUpdated: number
    recordsSkipped: number
  }
}

// Module icons
const moduleIcons: Record<string, { icon: typeof Users; color: string }> = {
  students: { icon: Users, color: "#4F7CFF" },
  attendance: { icon: ClipboardCheck, color: "#22c55e" },
  assessment: { icon: GraduationCap, color: "#F59E0B" },
  character: { icon: Award, color: "#8b5cf6" },
  specialUnits: { icon: Shield, color: "#EF4444" },
  savings: { icon: PiggyBank, color: "#06b6d4" },
}

// Demo history data
const DEMO_HISTORY: HistoryEntry[] = [
  {
    id: "hist-1",
    type: "import",
    module: "students",
    moduleName: "Buku Induk Siswa",
    fileName: "import_siswa_juli_2026.xlsx",
    fileSize: "2.4 MB",
    status: "completed",
    user: "Admin",
    startTime: "2026-07-01 14:30:00",
    endTime: "2026-07-01 14:32:15",
    duration: "2m 15s",
    recordsAffected: 25,
    recordsSuccess: 23,
    recordsFailed: 2,
    errors: [
      "Baris 15: NIS sudah terdaftar",
      "Baris 22: Format tanggal salah",
    ],
    details: {
      recordsTotal: 25,
      recordsInserted: 20,
      recordsUpdated: 3,
      recordsSkipped: 2,
    },
  },
  {
    id: "hist-2",
    type: "export",
    module: "attendance",
    moduleName: "Absensi",
    fileName: "rekap_absensi_juni_2026.xlsx",
    fileSize: "1.8 MB",
    status: "completed",
    user: "Admin",
    startTime: "2026-07-01 10:15:00",
    endTime: "2026-07-01 10:15:45",
    duration: "45s",
    recordsAffected: 1248,
    recordsSuccess: 1248,
    recordsFailed: 0,
    details: {
      recordsTotal: 1248,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
  },
  {
    id: "hist-3",
    type: "import",
    module: "assessment",
    moduleName: "Penilaian",
    fileName: "nilai_uas_xi_ipa.xlsx",
    fileSize: "856 KB",
    status: "failed",
    user: "Guru Matematika",
    startTime: "2026-06-28 16:00:00",
    endTime: "2026-06-28 16:01:30",
    duration: "1m 30s",
    recordsAffected: 32,
    recordsSuccess: 0,
    recordsFailed: 32,
    errors: [
      "Baris 5: NIS tidak ditemukan",
      "Baris 12: Nilai di luar range",
      "Baris 18: NIS tidak ditemukan",
      "... dan 29 error lainnya",
    ],
    details: {
      recordsTotal: 32,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
  },
  {
    id: "hist-4",
    type: "import",
    module: "character",
    moduleName: "Poin Karakter",
    fileName: "poin_karakter_juni.xlsx",
    fileSize: "445 KB",
    status: "completed",
    user: "Admin",
    startTime: "2026-06-30 09:00:00",
    endTime: "2026-06-30 09:02:10",
    duration: "2m 10s",
    recordsAffected: 156,
    recordsSuccess: 156,
    recordsFailed: 0,
    details: {
      recordsTotal: 156,
      recordsInserted: 156,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
  },
  {
    id: "hist-5",
    type: "export",
    module: "specialUnits",
    moduleName: "Pasukan Khusus",
    fileName: "data_anggota_paskhas.xlsx",
    fileSize: "324 KB",
    status: "completed",
    user: "Komandan Paskhas",
    startTime: "2026-06-25 11:00:00",
    endTime: "2026-06-25 11:00:20",
    duration: "20s",
    recordsAffected: 45,
    recordsSuccess: 45,
    recordsFailed: 0,
    details: {
      recordsTotal: 45,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
  },
  {
    id: "hist-6",
    type: "export",
    module: "savings",
    moduleName: "Tabungan",
    fileName: "laporan_tabungan_juni.pdf",
    fileSize: "2.1 MB",
    status: "completed",
    user: "Bendahara",
    startTime: "2026-06-30 15:30:00",
    endTime: "2026-06-30 15:32:00",
    duration: "2m 0s",
    recordsAffected: 890,
    recordsSuccess: 890,
    recordsFailed: 0,
    details: {
      recordsTotal: 890,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
  },
  {
    id: "hist-7",
    type: "import",
    module: "students",
    moduleName: "Buku Induk Siswa",
    fileName: "update_data_siswa.xlsx",
    fileSize: "1.2 MB",
    status: "processing",
    user: "Admin",
    startTime: "2026-07-02 09:00:00",
    endTime: "",
    duration: "-",
    recordsAffected: 0,
    recordsSuccess: 0,
    recordsFailed: 0,
    details: {
      recordsTotal: 150,
      recordsInserted: 45,
      recordsUpdated: 78,
      recordsSkipped: 27,
    },
  },
  {
    id: "hist-8",
    type: "import",
    module: "attendance",
    moduleName: "Absensi",
    fileName: "absensi_jumat_27.xlsx",
    fileSize: "512 KB",
    status: "pending",
    user: "Guru Piket",
    startTime: "2026-07-02 08:00:00",
    endTime: "",
    duration: "-",
    recordsAffected: 0,
    recordsSuccess: 0,
    recordsFailed: 0,
    details: {
      recordsTotal: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
    },
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
  pending: {
    label: "Menunggu",
    icon: AlertCircle,
    color: "var(--info)",
    variant: "info" as const,
  },
}

export default function HistoryPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "import" | "export">("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "failed" | "processing" | "pending">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter history
  const filteredHistory = DEMO_HISTORY.filter((entry) => {
    const matchesSearch =
      entry.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || entry.type === selectedType
    const matchesStatus = selectedStatus === "all" || entry.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Statistics
  const stats = {
    total: DEMO_HISTORY.length,
    completed: DEMO_HISTORY.filter((h) => h.status === "completed").length,
    failed: DEMO_HISTORY.filter((h) => h.status === "failed").length,
    processing: DEMO_HISTORY.filter((h) => h.status === "processing" || h.status === "pending").length,
  }

  // Get module icon
  const getModuleIcon = (moduleId: string) => {
    const config = moduleIcons[moduleId]
    return config?.icon || FileSpreadsheet
  }

  const getModuleColor = (moduleId: string) => {
    const config = moduleIcons[moduleId]
    return config?.color || "#6B7280"
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
    <AppShell title="Riwayat" description="Riwayat operasi import dan export">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/import-export"
              className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Import/Export</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Riwayat semua operasi import dan export
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
              <p className="text-sm text-[var(--text-muted)]">Selesai</p>
            </div>
            <p className="text-2xl font-bold text-[var(--success)]">{stats.completed}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[var(--danger)]" />
              <p className="text-sm text-[var(--text-muted)]">Gagal</p>
            </div>
            <p className="text-2xl font-bold text-[var(--danger)]">{stats.failed}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
              <p className="text-sm text-[var(--text-muted)]">Diproses</p>
            </div>
            <p className="text-2xl font-bold text-[var(--warning)]">{stats.processing}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari file, modul, atau user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-[14px]">
            {[
              { value: "all", label: "Semua" },
              { value: "import", label: "Import" },
              { value: "export", label: "Export" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedType(option.value as typeof selectedType)}
                className={cn(
                  "px-4 py-2 rounded-[12px] text-[13px] font-medium transition-all",
                  selectedType === option.value
                    ? "bg-white shadow-sm text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

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
            <option value="pending">Menunggu</option>
          </select>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredHistory.map((entry) => {
            const Icon = getModuleIcon(entry.module)
            const color = getModuleColor(entry.module)
            const statusInfo = statusConfig[entry.status]
            const StatusIcon = statusInfo.icon
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
                  {/* Type Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-[12px] flex items-center justify-center",
                      entry.type === "import"
                        ? "bg-[var(--info-soft)]"
                        : "bg-[var(--success-soft)]"
                    )}
                  >
                    {entry.type === "import" ? (
                      <ArrowDownToLine className="w-5 h-5 text-[var(--info)]" />
                    ) : (
                      <ArrowUpFromLine className="w-5 h-5 text-[var(--success)]" />
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                        {entry.fileName}
                      </p>
                      <Badge variant={statusInfo.variant} className="text-[10px]">
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[var(--text-muted)]">
                      <span>{entry.moduleName}</span>
                      <span>•</span>
                      <span>{entry.fileSize}</span>
                      <span>•</span>
                      <span>{entry.user}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-center">
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {entry.recordsAffected > 0 ? entry.recordsAffected.toLocaleString("id-ID") : "-"}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">Record</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--success)]">
                        {entry.recordsSuccess > 0 ? entry.recordsSuccess.toLocaleString("id-ID") : "-"}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">Berhasil</p>
                    </div>
                    <div>
                      <p className={cn(
                        "text-[14px] font-semibold",
                        entry.recordsFailed > 0 ? "text-[var(--danger)]" : "text-[var(--text-muted)]"
                      )}>
                        {entry.recordsFailed > 0 ? entry.recordsFailed : "-"}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">Gagal</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-right">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {entry.startTime.split(" ")[0]}
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
                    {/* Summary Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Total Record</p>
                        <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                          {entry.details.recordsTotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Dimasukkan</p>
                        <p className="text-[16px] font-semibold text-[var(--success)]">
                          {entry.details.recordsInserted.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Diperbarui</p>
                        <p className="text-[16px] font-semibold text-[var(--info)]">
                          {entry.details.recordsUpdated.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px]">
                        <p className="text-[11px] text-[var(--text-muted)] mb-1">Dilewati</p>
                        <p className="text-[16px] font-semibold text-[var(--warning)]">
                          {entry.details.recordsSkipped.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Time Details */}
                    <div className="flex flex-wrap gap-4 text-[13px] text-[var(--text-secondary)] mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Mulai: {entry.startTime}
                      </div>
                      {entry.endTime && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Selesai: {entry.endTime}
                        </div>
                      )}
                      <div>Durasi: {entry.duration}</div>
                    </div>

                    {/* Errors */}
                    {entry.errors && entry.errors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[13px] font-medium text-[var(--danger)] mb-2">
                          Error ({entry.errors.length}):
                        </p>
                        <div className="bg-white rounded-[12px] p-3 max-h-32 overflow-y-auto">
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
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download File
                        </Button>
                      )}
                      {entry.status === "failed" && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Ulangi
                        </Button>
                      )}
                      {entry.type === "export" && entry.status === "completed" && (
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Lihat Detail
                        </Button>
                      )}
                      {entry.errors && entry.errors.length > 0 && (
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download Error Report
                        </Button>
                      )}
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
            <p className="text-[var(--text-muted)]">Tidak ada riwayat yang ditemukan</p>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
