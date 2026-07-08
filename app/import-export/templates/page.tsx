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
} from "lucide-react"
import { cn } from "@/lib/utils"

// Template types
interface Template {
  id: string
  name: string
  module: string
  moduleName: string
  version: string
  description: string
  columns: string[]
  recordCount: number
  status: "active" | "deprecated" | "archived"
  createdAt: string
  updatedAt: string
  createdBy: string
  downloadCount: number
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

// Demo templates
const DEMO_TEMPLATES: Template[] = [
  {
    id: "tpl-1",
    name: "Template Siswa",
    module: "students",
    moduleName: "Buku Induk Siswa",
    version: "2.1",
    description: "Template import data siswa baru",
    columns: ["nis", "nama", "jenis_kelamin", "kelas", "jurusan", "tanggal_lahir", "alamat"],
    recordCount: 7,
    status: "active",
    createdAt: "2025-06-15",
    updatedAt: "2026-01-10",
    createdBy: "Admin",
    downloadCount: 156,
  },
  {
    id: "tpl-2",
    name: "Template Absensi",
    module: "attendance",
    moduleName: "Absensi",
    version: "1.5",
    description: "Template import data absensi harian",
    columns: ["tanggal", "nis", "status", "keterangan"],
    recordCount: 4,
    status: "active",
    createdAt: "2025-08-20",
    updatedAt: "2026-02-05",
    createdBy: "Admin",
    downloadCount: 89,
  },
  {
    id: "tpl-3",
    name: "Template Penilaian",
    module: "assessment",
    moduleName: "Penilaian",
    version: "3.0",
    description: "Template import nilai semester",
    columns: ["nis", "mapel", "nilai", "semester"],
    recordCount: 4,
    status: "active",
    createdAt: "2025-09-01",
    updatedAt: "2026-03-15",
    createdBy: "Admin",
    downloadCount: 234,
  },
  {
    id: "tpl-4",
    name: "Template Poin Karakter",
    module: "character",
    moduleName: "Poin Karakter",
    version: "1.2",
    description: "Template import poin karakter",
    columns: ["nis", "tanggal", "jenis", "poin", "keterangan"],
    recordCount: 5,
    status: "active",
    createdAt: "2025-10-10",
    updatedAt: "2026-01-25",
    createdBy: "Admin",
    downloadCount: 67,
  },
  {
    id: "tpl-5",
    name: "Template Pasukan Khusus",
    module: "specialUnits",
    moduleName: "Pasukan Khusus",
    version: "1.0",
    description: "Template import anggota pasukan khusus",
    columns: ["nis", "jabatan", "status", "tanggal_masuk"],
    recordCount: 4,
    status: "active",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
    createdBy: "Admin",
    downloadCount: 45,
  },
  {
    id: "tpl-6",
    name: "Template Tabungan",
    module: "savings",
    moduleName: "Tabungan",
    version: "1.1",
    description: "Template import transaksi tabungan",
    columns: ["nis", "tanggal", "jenis", "jumlah"],
    recordCount: 4,
    status: "deprecated",
    createdAt: "2025-05-20",
    updatedAt: "2025-12-01",
    createdBy: "Admin",
    downloadCount: 120,
  },
]

// Status badges
const statusConfig = {
  active: { label: "Aktif", variant: "success" as const },
  deprecated: { label: "Deprecated", variant: "warning" as const },
  archived: { label: "Arsip", variant: "secondary" as const },
}

export default function TemplatesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter templates
  const filteredTemplates = DEMO_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = selectedModule === "all" || tpl.module === selectedModule
    const matchesStatus = selectedStatus === "all" || tpl.status === selectedStatus
    return matchesSearch && matchesModule && matchesStatus
  })

  // Statistics
  const stats = {
    total: DEMO_TEMPLATES.length,
    active: DEMO_TEMPLATES.filter((t) => t.status === "active").length,
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
    <AppShell title="Template" description="Kelola template import">
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
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Template Import</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Download template untuk import data
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Template Baru
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total Template</p>
            <p className="text-stat-lg text-[var(--text-primary)]">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Template Aktif</p>
            <p className="text-stat-lg text-[var(--success)]">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-body-sm text-[var(--text-muted)]">Total Download</p>
            <p className="text-stat-lg text-[var(--primary)]">{stats.totalDownloads}</p>
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

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
          >
            <option value="all">Semua Modul</option>
            <option value="students">Buku Induk</option>
            <option value="attendance">Absensi</option>
            <option value="assessment">Penilaian</option>
            <option value="character">Poin Karakter</option>
            <option value="specialUnits">Pasukan Khusus</option>
            <option value="savings">Tabungan</option>
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
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                          <button className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
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
                  {template.moduleName}
                </p>

                {/* Version */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-[var(--surface-secondary)] rounded-[8px]">
                    v{template.version}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {template.recordCount} kolom
                  </span>
                </div>

                {/* Description */}
                <p className="text-[13px] text-[var(--text-secondary)] mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(template.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloadCount}x
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  variant={template.status === "active" ? "primary" : "outline"}
                  className="w-full gap-2"
                  disabled={template.status !== "active"}
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
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
