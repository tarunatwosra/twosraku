"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Upload,
  Download,
  FileText,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Database,
  Users,
  ClipboardCheck,
  Award,
  Calendar,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Module icons
const MODULE_ICONS: Record<string, { icon: typeof Users; color: string; name: string }> = {
  students: { icon: Users, color: "#3B82F6", name: "Siswa" },
  attendance: { icon: ClipboardCheck, color: "#10B981", name: "Presensi" },
  assessment: { icon: Award, color: "#F59E0B", name: "Penilaian" },
  character: { icon: Award, color: "#EC4899", name: "Poin Karakter" },
  special_units: { icon: Shield, color: "#8B5CF6", name: "Pasukan Khusus" },
  spiritual: { icon: Calendar, color: "#06B6D4", name: "Spiritual" },
}

// Demo recent operations
const DEMO_RECENT_OPS = [
  { id: "op-1", type: "import" as const, module: "students", file: "data_siswa_2026.xlsx", status: "completed" as const, records: 150, user: "Admin", time: "2026-07-01 10:30" },
  { id: "op-2", type: "export" as const, module: "attendance", file: "rekap_presensi_juni.xlsx", status: "completed" as const, records: 450, user: "Admin", time: "2026-07-01 09:15" },
  { id: "op-3", type: "import" as const, module: "assessment", file: "nilai_semester.xlsx", status: "failed" as const, records: 0, user: "Guru", time: "2026-07-01 08:00" },
  { id: "op-4", type: "export" as const, module: "character", file: "poin_karakter.xlsx", status: "completed" as const, records: 320, user: "Admin", time: "2026-06-30 16:00" },
]

export default function ImportExportPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

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

  // Statistics
  const stats = useMemo(() => ({
    totalImports: 45,
    totalExports: 120,
    successRate: 94,
    failedImports: 3,
  }), [])

  // Get module info
  const getModuleInfo = (module: string) => {
    return MODULE_ICONS[module] || MODULE_ICONS.students
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Berhasil</Badge>
      case "failed":
        return <Badge variant="danger" className="gap-1"><XCircle className="w-3 h-3" /> Gagal</Badge>
      case "processing":
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Diproses</Badge>
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Menunggu</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AppShell
      title="Import & Export"
      description="Engine terpusat untuk impor dan ekspor data"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button className="gap-2" onClick={() => router.push("/import-export/import")}>
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => router.push("/import-export/export")}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/import-export/templates")}>
              <FileText className="w-4 h-4 mr-2" />
              Kelola Template
            </Button>
            <Button variant="outline" onClick={() => router.push("/import-export/history")}>
              <Clock className="w-4 h-4 mr-2" />
              Riwayat
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Import"
            value={stats.totalImports}
            icon={<Upload className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Total Export"
            value={stats.totalExports}
            icon={<Download className="w-5 h-5" />}
            color="info"
          />
          <StatCard
            title="Tingkat Berhasil"
            value={`${stats.successRate}%`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Import Gagal"
            value={stats.failedImports}
            icon={<AlertCircle className="w-5 h-5" />}
            color="danger"
          />
        </div>

        {/* Module Selection */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Pilih Modul
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Pilih modul yang ingin diimport atau diexport datanya
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(MODULE_ICONS).map(([key, module]) => {
              const Icon = module.icon
              return (
                <button
                  key={key}
                  onClick={() => router.push(`/import-export/import?module=${key}`)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md"
                  )}
                  style={{ borderColor: `${module.color}40` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${module.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--text-primary)]">
                    {module.name}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-section-title">
                  Import Data
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Upload file Excel atau CSV untuk import data
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/import?module=students")}
              >
                <span className="font-medium">Import Data Siswa</span>
                <span className="text-xs text-[var(--text-muted)]">Upload data siswa baru atau update data existing</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/import?module=assessment")}
              >
                <span className="font-medium">Import Nilai Penilaian</span>
                <span className="text-xs text-[var(--text-muted)]">Upload hasil penilaian dari spreadsheet</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/import?module=attendance")}
              >
                <span className="font-medium">Import Presensi</span>
                <span className="text-xs text-[var(--text-muted)]">Upload data kehadiran dari file external</span>
              </Button>
            </div>
          </Card>

          {/* Export Section */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center">
                <Download className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <h2 className="text-section-title">
                  Export Data
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Download data dalam format Excel, CSV, atau PDF
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/export?module=students")}
              >
                <span className="font-medium">Export Data Siswa</span>
                <span className="text-xs text-[var(--text-muted)]">Download daftar siswa lengkap</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/export?module=assessment")}
              >
                <span className="font-medium">Export Nilai Penilaian</span>
                <span className="text-xs text-[var(--text-muted)]">Download hasil penilaian per session</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 flex-col gap-2"
                onClick={() => router.push("/import-export/export?module=attendance")}
              >
                <span className="font-medium">Export Laporan Presensi</span>
                <span className="text-xs text-[var(--text-muted)]">Download rekapitulasi kehadiran</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Operations */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between">
              <h2 className="text-section-title">
                Operasi Terbaru
              </h2>
              <Button variant="ghost" size="sm" onClick={() => router.push("/import-export/history")}>
                Lihat Semua →
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Tipe
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Modul
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    File
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Record
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Waktu
                  </th>
                  <th className="text-center px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEMO_RECENT_OPS.map((op) => {
                  const moduleInfo = getModuleInfo(op.module)
                  const Icon = moduleInfo.icon

                  return (
                    <tr
                      key={op.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Badge variant={op.type === "import" ? "primary" : "info"} className="gap-1">
                          {op.type === "import" ? (
                            <Upload className="w-3 h-3" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          {op.type === "import" ? "Import" : "Export"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${moduleInfo.color}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: moduleInfo.color }} />
                          </div>
                          <span className="text-[14px] text-[var(--text-primary)]">
                            {moduleInfo.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                          <span className="text-[14px] text-[var(--text-primary)]">
                            {op.file}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
                        {op.records > 0 ? `${op.records} record` : "-"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(op.status)}
                      </td>
                      <td className="px-4 py-4 text-[14px] text-[var(--text-muted)]">
                        {op.time}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {op.status === "failed" ? (
                          <Button variant="ghost" size="sm">
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
        </div>
      </div>
    </Card>
  )
}
