"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useCharacter } from "@/hooks/useCharacter"
import { type CharacterRecord, type RecordStatus, CATEGORY_COLORS } from "@/types/character"
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CharacterHistoryPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { records, categories, behaviors, loading } = useCharacter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<RecordStatus | "">("")
  const [selectedDirection, setSelectedDirection] = useState<"positive" | "negative" | "">("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(25)

  // Demo records for display
  const demoRecords = useMemo(() => {
    const result: Array<CharacterRecord & { behaviorName: string; categoryName: string; pointValue: number; direction: "positive" | "negative" }> = []

    // Generate some demo records
    for (let i = 1; i <= 50; i++) {
      const behavior = behaviors[i % behaviors.length]
      const category = categories.find((c) => c.id === behavior?.categoryId)

      result.push({
        id: `record-${i}`,
        studentId: `student-${(i % 32) + 1}`,
        behaviorTypeId: behavior?.id || "beh-1",
        behaviorName: behavior?.name || "Perilaku Demo",
        categoryName: category?.name || "Kategori",
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split("T")[0],
        reporterId: "admin",
        status: ["submitted", "approved", "reviewed"][i % 3] as RecordStatus,
        description: behavior?.description || "",
        pointValue: behavior?.pointValue || 0,
        direction: behavior?.direction || "positive",
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      })
    }

    return result
  }, [behaviors, categories])

  // Filter records
  const filteredRecords = useMemo(() => {
    return demoRecords.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.behaviorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || record.behaviorTypeId.includes(selectedCategory)
      const matchesStatus = !selectedStatus || record.status === selectedStatus
      const matchesDirection = !selectedDirection || record.direction === selectedDirection
      return matchesSearch && matchesCategory && matchesStatus && matchesDirection
    })
  }, [demoRecords, searchQuery, selectedCategory, selectedStatus, selectedDirection])

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize)
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Statistics
  const stats = useMemo(() => {
    const positive = filteredRecords.filter((r) => r.direction === "positive")
    const negative = filteredRecords.filter((r) => r.direction === "negative")

    return {
      total: filteredRecords.length,
      positive: positive.length,
      negative: negative.length,
      totalPositivePoints: positive.reduce((sum, r) => sum + r.pointValue, 0),
      totalNegativePoints: negative.reduce((sum, r) => sum + Math.abs(r.pointValue), 0),
    }
  }, [filteredRecords])

  // Get status badge
  const getStatusBadge = (status: RecordStatus) => {
    const config: Record<RecordStatus, { label: string; variant: "success" | "warning" | "info" | "secondary"; icon: React.ReactNode }> = {
      draft: { label: "Draft", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      submitted: { label: "Submitted", variant: "info", icon: <Clock className="w-3 h-3" /> },
      reviewed: { label: "Ditinjau", variant: "warning", icon: <CheckCircle2 className="w-3 h-3" /> },
      approved: { label: "Disetujui", variant: "success", icon: <CheckCircle2 className="w-3 h-3" /> },
      archived: { label: "Arsip", variant: "secondary", icon: <FileText className="w-3 h-3" /> },
    }
    const { label, variant, icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        {icon}
        {label}
      </Badge>
    )
  }

  // Redirect if not authenticated
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell
      title="Riwayat Poin Karakter"
      description="Lihat semua catatan poin karakter siswa"
      breadcrumbs={[
        { label: "Poin Karakter", href: "/poin-karakter" },
        { label: "Riwayat" },
      ]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari perilaku, siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Catatan"
            value={stats.total}
            icon={<FileText className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Positif"
            value={stats.positive}
            subValue={`+${stats.totalPositivePoints} poin`}
            icon={<ThumbsUp className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Negatif"
            value={stats.negative}
            subValue={`-${stats.totalNegativePoints} poin`}
            icon={<ThumbsDown className="w-5 h-5" />}
            color="danger"
          />
          <StatCard
            title="Poin Bersih"
            value={stats.totalPositivePoints - stats.totalNegativePoints}
            icon={stats.totalPositivePoints - stats.totalNegativePoints >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            color={stats.totalPositivePoints - stats.totalNegativePoints >= 0 ? "success" : "danger"}
          />
          <StatCard
            title="Disetujui"
            value={filteredRecords.filter((r) => r.status === "approved").length}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="info"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as RecordStatus | "")}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="reviewed">Ditinjau</option>
                  <option value="approved">Disetujui</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Tipe
                </label>
                <select
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value as "positive" | "negative" | "")}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua</option>
                  <option value="positive">Positif</option>
                  <option value="negative">Negatif</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("")
                    setSelectedStatus("")
                    setSelectedDirection("")
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {(selectedCategory || selectedStatus || selectedDirection) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
            {selectedCategory && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedCategory("")}>
                {categories.find((c) => c.id === selectedCategory)?.name}
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedStatus("")}>
                {selectedStatus}
              </Badge>
            )}
            {selectedDirection && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedDirection("")}>
                {selectedDirection === "positive" ? "Positif" : "Negatif"}
              </Badge>
            )}
          </div>
        )}

        {/* Records Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Tanggal
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Siswa
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Perilaku
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Poin
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--border-light)]">
                      <td className="px-6 py-4"><div className="w-24 h-4 bg-[var(--surface-hover)] rounded animate-pulse" /></td>
                      <td className="px-4 py-4"><div className="w-40 h-4 bg-[var(--surface-hover)] rounded animate-pulse" /></td>
                      <td className="px-4 py-4"><div className="w-48 h-4 bg-[var(--surface-hover)] rounded animate-pulse" /></td>
                      <td className="px-4 py-4"><div className="w-16 h-6 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                      <td className="px-4 py-4"><div className="w-20 h-6 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                      <td className="px-6 py-4"><div className="w-16 h-8 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                    </tr>
                  ))
                ) : paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-[15px] font-medium text-[var(--text-primary)]">
                          {searchQuery || selectedCategory || selectedStatus || selectedDirection
                            ? "Catatan tidak ditemukan"
                            : "Belum ada catatan poin karakter"}
                        </p>
                        <p className="text-[13px] text-[var(--text-muted)]">
                          {searchQuery || selectedCategory || selectedStatus || selectedDirection
                            ? "Coba ubah filter pencarian"
                            : "Mulai dengan menambahkan catatan poin karakter"}
                        </p>
                        {!searchQuery && !selectedCategory && !selectedStatus && !selectedDirection && (
                          <Button onClick={() => router.push("/poin-karakter/input")}>
                            Tambah Catatan
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                          <span className="text-[14px] text-[var(--text-primary)]">
                            {new Date(record.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                            <User className="w-4 h-4 text-[var(--primary)]" />
                          </div>
                          <span className="text-[14px] font-medium text-[var(--text-primary)]">
                            {record.studentId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-[14px] font-medium text-[var(--text-primary)]">
                            {record.behaviorName}
                          </p>
                          <p className="text-[12px] text-[var(--text-muted)]">
                            {record.categoryName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant={record.direction === "positive" ? "success" : "danger"}
                          className="font-bold"
                        >
                          {record.pointValue > 0 ? "+" : ""}{record.pointValue}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--border-light)]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[var(--text-muted)]">
                  Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRecords.length)} dari {filteredRecords.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-[var(--text-muted)]">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  subValue,
  icon,
  color,
}: {
  title: string
  value: number
  subValue?: string
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

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
          {subValue && (
            <p className="text-xs text-[var(--text-muted)]">{subValue}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
