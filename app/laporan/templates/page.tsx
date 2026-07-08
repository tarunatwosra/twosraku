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
  FileSpreadsheet,
  FileText,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  PiggyBank,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Archive,
  Trash2,
  Calendar,
  Clock,
  Copy,
  BarChart,
  Eye,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Template types
interface ReportTemplate {
  id: string
  name: string
  category: string
  categoryName: string
  module: string
  description: string
  paperSize: "A4" | "Letter" | "Legal"
  orientation: "portrait" | "landscape"
  columns: string[]
  chartType?: "bar" | "line" | "pie" | "donut"
  version: string
  status: "active" | "deprecated" | "archived"
  createdAt: string
  updatedAt: string
  createdBy: string
  usageCount: number
  downloadCount: number
}

// Module icons
const moduleIcons: Record<string, { icon: typeof Users; color: string }> = {
  students: { icon: Users, color: "#4F7FF" },
  attendance: { icon: ClipboardCheck, color: "#22c55e" },
  assessment: { icon: GraduationCap, color: "#F59E0B" },
  character: { icon: Award, color: "#8b5cf6" },
  specialUnits: { icon: Shield, color: "#EF4444" },
  analytics: { icon: BarChart, color: "#06b6d4" },
}

// Demo templates
const DEMO_TEMPLATES: ReportTemplate[] = [
  {
    id: "tpl-1",
    name: "Daftar Siswa Lengkap",
    category: "students",
    categoryName: "Laporan Siswa",
    module: "students",
    description: "Template laporan daftar siswa dengan data lengkap",
    paperSize: "A4",
    orientation: "portrait",
    columns: ["NIS", "Nama", "Kelas", "Jurusan", "Jenis Kelamin", "Alamat", "Status"],
    version: "2.1",
    status: "active",
    createdAt: "2025-06-15",
    updatedAt: "2026-01-10",
    createdBy: "Admin",
    usageCount: 45,
    downloadCount: 156,
  },
  {
    id: "tpl-2",
    name: "Rekap Absensi Bulanan",
    category: "attendance",
    categoryName: "Laporan Absensi",
    module: "attendance",
    description: "Template rekapitulasi absensi bulanan per kelas",
    paperSize: "A4",
    orientation: "landscape",
    columns: ["Tanggal", "NIS", "Nama", "Kelas", "Status Hadir", "Keterangan"],
    chartType: "bar",
    version: "1.5",
    status: "active",
    createdAt: "2025-08-20",
    updatedAt: "2026-02-05",
    createdBy: "Admin",
    usageCount: 32,
    downloadCount: 89,
  },
  {
    id: "tpl-3",
    name: "Ringkasan Nilai Semester",
    category: "assessment",
    categoryName: "Laporan Penilaian",
    module: "assessment",
    description: "Template ringkasan nilai per mata pelajaran",
    paperSize: "A4",
    orientation: "landscape",
    columns: ["NIS", "Nama", "Mapel 1", "Mapel 2", "Mapel 3", "Rata-rata"],
    chartType: "line",
    version: "3.0",
    status: "active",
    createdAt: "2025-09-01",
    updatedAt: "2026-03-15",
    createdBy: "Admin",
    usageCount: 78,
    downloadCount: 234,
  },
  {
    id: "tpl-4",
    name: "Poin Karakter Per Siswa",
    category: "character",
    categoryName: "Laporan Poin Karakter",
    module: "character",
    description: "Template detail poin karakter per siswa",
    paperSize: "A4",
    orientation: "portrait",
    columns: ["NIS", "Nama", "Kategori", "Jenis", "Poin", "Tanggal", "Keterangan"],
    chartType: "pie",
    version: "1.2",
    status: "active",
    createdAt: "2025-10-10",
    updatedAt: "2026-01-25",
    createdBy: "Admin",
    usageCount: 23,
    downloadCount: 67,
  },
  {
    id: "tpl-5",
    name: "Daftar Anggota Paskhas",
    category: "special-units",
    categoryName: "Laporan Pasukan Khusus",
    module: "specialUnits",
    description: "Template daftar anggota pasukan khusus",
    paperSize: "A4",
    orientation: "portrait",
    columns: ["NIS", "Nama", "Jabatan", "Status", "Tanggal Masuk"],
    version: "1.0",
    status: "active",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
    createdBy: "Admin",
    usageCount: 12,
    downloadCount: 45,
  },
  {
    id: "tpl-6",
    name: "Overview Analytics",
    category: "analytics",
    categoryName: "Laporan Analytics",
    module: "analytics",
    description: "Template overview analytics sekolah",
    paperSize: "A4",
    orientation: "landscape",
    columns: ["Module", "Total", "Aktif", "Nonaktif"],
    chartType: "donut",
    version: "1.1",
    status: "active",
    createdAt: "2025-05-20",
    updatedAt: "2025-12-01",
    createdBy: "Admin",
    usageCount: 15,
    downloadCount: 120,
  },
  {
    id: "tpl-7",
    name: "Daftar Siswa Deprecated",
    category: "students",
    categoryName: "Laporan Siswa",
    module: "students",
    description: "Template lama - tidak digunakan lagi",
    paperSize: "Letter",
    orientation: "portrait",
    columns: ["NIS", "Nama", "Alamat"],
    version: "1.0",
    status: "deprecated",
    createdAt: "2025-01-10",
    updatedAt: "2025-06-01",
    createdBy: "Admin",
    usageCount: 5,
    downloadCount: 45,
  },
]

// Status badges
const statusConfig = {
  active: { label: "Aktif", variant: "success" as const },
  deprecated: { label: "Deprecated", variant: "warning" as const },
  archived: { label: "Arsip", variant: "secondary" as const },
}

// Paper size labels
const paperSizeLabels: Record<string, string> = {
  A4: "A4",
  Letter: "Letter",
  Legal: "Legal",
}

export default function ReportTemplatesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter templates
  const filteredTemplates = DEMO_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tpl.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || tpl.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Statistics
  const stats = {
    total: DEMO_TEMPLATES.length,
    active: DEMO_TEMPLATES.filter((t) => t.status === "active").length,
    totalUsage: DEMO_TEMPLATES.reduce((sum, t) => sum + t.usageCount, 0),
    totalDownloads: DEMO_TEMPLATES.reduce((sum, t) => sum + t.downloadCount, 0),
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

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell title="Template Laporan" description="Kelola template laporan">
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
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Template Laporan</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Kelola template laporan yang dapat digunakan ulang
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Template Baru
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total Template</p>
            <p className="text-stat-lg text-[var(--text-primary)]">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Template Aktif</p>
            <p className="text-stat-lg text-[var(--success)]">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total Penggunaan</p>
            <p className="text-stat-lg text-[var(--primary)]">{stats.totalUsage}x</p>
          </Card>
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total Download</p>
            <p className="text-stat-lg text-[var(--info)]">{stats.totalDownloads}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
          >
            <option value="all">Semua Kategori</option>
            <option value="students">Laporan Siswa</option>
            <option value="attendance">Laporan Absensi</option>
            <option value="assessment">Laporan Penilaian</option>
            <option value="character">Laporan Poin Karakter</option>
            <option value="special-units">Laporan Pasukan Khusus</option>
            <option value="analytics">Laporan Analytics</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="deprecated">Deprecated</option>
            <option value="archived">Arsip</option>
          </select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = getModuleIcon(template.module)
            const color = getModuleColor(template.module)
            const statusInfo = statusConfig[template.status]

            return (
              <Card
                key={template.id}
                className="p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusInfo.variant} className="text-[10px]">
                      {statusInfo.label}
                    </Badge>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {openMenuId === template.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            Duplikat
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Pengaturan
                          </button>
                          <div className="border-t border-[var(--border-light)] my-1" />
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Archive className="w-4 h-4" />
                            Arsipkan
                          </button>
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2 text-[var(--danger)]">
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
                  {template.name}
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] mb-3">
                  {template.categoryName}
                </p>

                {/* Version & Specs */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-[var(--surface-secondary)] rounded-[8px]">
                    v{template.version}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 bg-[var(--surface-secondary)] rounded-[8px]">
                    {paperSizeLabels[template.paperSize]}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 bg-[var(--surface-secondary)] rounded-[8px] capitalize">
                    {template.orientation}
                  </span>
                  {template.chartType && (
                    <span className="text-[11px] px-2 py-0.5 bg-[var(--primary-soft)] text-[var(--primary)] rounded-[8px] capitalize">
                      {template.chartType} chart
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[13px] text-[var(--text-secondary)] mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Columns Preview */}
                <div className="mb-4">
                  <p className="text-[11px] text-[var(--text-muted)] mb-2">
                    {template.columns.length} kolom: {template.columns.slice(0, 3).join(", ")}...
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(template.updatedAt)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {template.usageCount}x
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.downloadCount}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={template.status === "active" ? "primary" : "outline"}
                    className="flex-1 gap-2"
                    disabled={template.status !== "active"}
                    onClick={() => router.push(`/laporan/generate?template=${template.id}`)}
                  >
                    <FileText className="w-4 h-4" />
                    Gunakan
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <Card className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Tidak ada template yang ditemukan</p>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
