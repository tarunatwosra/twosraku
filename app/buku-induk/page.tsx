"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Eye,
  Pencil,
  X,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Archive,
  CheckSquare,
  Square,
  MoreHorizontal,
  Loader2,
  CheckCircle,
  BookOpen,
  ChevronDown,
  User,
  FileUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button, Card, Badge, Avatar, Input } from "@/components/ui"
import { QuickViewModal } from "@/components/buku-induk/QuickViewModal"
import { ExportButton } from "@/components/buku-induk/ExportButton"
import { ColumnConfigButton, DEFAULT_COLUMNS, type ColumnConfig } from "@/components/buku-induk/ColumnConfig"
import { useStudents, useStudentStats, useAcademicYear, useMajors, useClasses } from "@/hooks"
import { fetchStudents, fetchStudentStats, bulkArchiveStudents } from "./lib/supabase"
import type { StudentWithClass, StudentFilters } from "@/types/database"
import { cn } from "@/lib/utils"

// Gender options
const GENDERS = [
  { value: "", label: "Semua" },
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
]

// Active status options
const ACTIVE_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "true", label: "Aktif" },
  { value: "false", label: "Tidak Aktif" },
]

// Status badge variant helper
const getStatusBadgeVariant = (isActive: boolean) => {
  return isActive ? "success" : "neutral"
}

// Status label helper
const getStatusLabel = (isActive: boolean) => {
  return isActive ? "Aktif" : "Tidak Aktif"
}

// Gender label helper
const getGenderLabel = (gender: string) => {
  return gender === "male" ? "Laki-laki" : "Perempuan"
}

// ============================================
// ACTION MENU COMPONENT
// ============================================
function ActionMenu({
  student,
  onQuickView,
  onEdit,
  onArchive,
}: {
  student: StudentWithClass
  onQuickView: () => void
  onEdit: () => void
  onArchive: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all duration-200"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-[var(--border-light)] py-2 min-w-[180px] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            <button
              onClick={() => {
                onQuickView()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <Eye className="w-4 h-4 text-[var(--primary)]" />
              Quick View
            </button>
            <Link
              href={`/buku-induk/${student.id}/`}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[var(--info)]" />
              Lihat Detail
            </Link>
            <Link
              href={`/buku-induk/${student.id}/edit`}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <Pencil className="w-4 h-4 text-[var(--warning)]" />
              Edit
            </Link>
            <div className="h-px bg-[var(--border-light)] my-2" />
            <button
              onClick={() => {
                onArchive()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
            >
              <Archive className="w-4 h-4" />
              Arsipkan
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function BukuIndukPage() {
  const router = useRouter()
  const { academicYear } = useAcademicYear()

  // Pagination state
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  // Filters state
  const [search, setSearch] = useState("")
  const [gender, setGender] = useState("")
  const [status, setStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // Sorting state
  const [sortField, setSortField] = useState<"full_name" | "student_number" | "created_at" | "enrollment_year">("full_name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Action states
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Data state
  const [students, setStudents] = useState<StudentWithClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
  })
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Quick View Modal state
  const [quickViewStudentId, setQuickViewStudentId] = useState<string | null>(null)

  // Additional filter state
  const [majorId, setMajorId] = useState("")
  const [classId, setClassId] = useState("")

  // Column configuration state
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)

  // Filter hooks
  const { majors } = useMajors()
  const { classes } = useClasses({
    academicYearId: academicYear?.id,
    majorId: majorId || undefined,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 when search changes
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Build filters
  const filters: StudentFilters = {
    search: debouncedSearch || undefined,
    gender: (gender as StudentFilters["gender"]) || undefined,
    is_active: status === "" ? undefined : status === "true",
    class_id: (classId as StudentFilters["class_id"]) || undefined,
    major_id: (majorId as StudentFilters["major_id"]) || undefined,
    academic_year_id: academicYear?.id,
  }

  // Fetch students
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Debug: log academicYear
      console.log("[DEBUG] Fetching students with academicYear:", academicYear)

      const result = await fetchStudents({
        page,
        perPage,
        filters,
        academicYearId: academicYear?.id,
        sortField,
        sortDirection,
      })

      console.log("[DEBUG] Fetch result:", {
        total: result.pagination.total,
        returned: result.data.length,
        academicYearId: academicYear?.id,
      })

      setStudents(result.data)
      setTotalCount(result.pagination.total)
      setTotalPages(result.pagination.totalPages)
    } catch (err) {
      console.error("[ERROR] Error fetching students:", err)
      setError("Gagal memuat data siswa")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, debouncedSearch, gender, status, majorId, classId, academicYear?.id, sortField, sortDirection])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const data = await fetchStudentStats()
      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, gender, status, majorId, classId])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPerPage(newSize)
    setPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    setSearch("")
    setGender("")
    setStatus("")
    setMajorId("")
    setClassId("")
    setPage(1)
  }

  const hasActiveFilters = gender || status || majorId || classId || debouncedSearch

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(students.map((s) => s.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }

  // Bulk archive single student
  const handleBulkArchiveSingle = async (studentId: string) => {
    setIsActionLoading(true)
    try {
      const result = await bulkArchiveStudents([studentId])
      if (result.success) {
        setActionSuccess(`${result.archived} siswa berhasil diarsipkan`)
        fetchData()
      } else {
        alert(result.error || "Gagal mengarsipkan siswa")
      }
    } catch (err) {
      console.error("Error archiving student:", err)
      alert("Terjadi kesalahan saat mengarsipkan siswa")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Bulk archive
  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengarsipkan ${selectedIds.size} siswa?`)) return

    setIsActionLoading(true)
    setActionSuccess(null)

    try {
      const result = await bulkArchiveStudents(Array.from(selectedIds))
      if (result.success) {
        setActionSuccess(`${result.archived} siswa berhasil diarsipkan`)
        setSelectedIds(new Set())
        setIsSelectionMode(false)
        fetchData()
        fetchStats()
      } else {
        alert(result.error || "Gagal mengarsipkan siswa")
      }
    } catch (err) {
      console.error("Error bulk archiving:", err)
      alert("Terjadi kesalahan saat mengarsipkan siswa")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Get student class name
  const getStudentClass = (student: StudentWithClass) => {
    const activeClass = student.student_classes?.find(
      (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
    )
    if (activeClass?.classes) {
      const { majors } = activeClass.classes
      return `${majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    }
    return "-"
  }

  return (
    <AppShell showHeader={true} title="Buku Induk" description="Kelola data lengkap siswa dalam buku induk sekolah">
      {/* Success Banner */}
      {actionSuccess && (
        <div className="mb-6 p-4 bg-[var(--success-soft)] border border-[var(--success)]/20 rounded-[20px] flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
            </div>
            <p className="text-[14px] font-medium text-[var(--success)]">
              {actionSuccess}
            </p>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="w-7 h-7 rounded-full hover:bg-[var(--success)]/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[var(--success)]" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)]/20 rounded-[20px] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--danger)]/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-[var(--danger)]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[var(--danger)]">
                {error}
              </p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-[var(--danger)] text-white text-[13px] font-medium rounded-[14px] hover:bg-[var(--danger)]/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/buku-induk/archived")}
          >
            <Archive className="w-4 h-4" />
            Diarsipkan
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/buku-induk/import")}
          >
            <FileUp className="w-4 h-4" />
            Import Siswa
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/buku-induk/new")}
        >
          <UserPlus className="w-4 h-4" />
          Tambah Siswa
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="mb-[24px] p-0 overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        {/* Filter Header */}
        <div className="p-[24px] pb-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama, NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[44px] pl-11 pr-10 text-[14px] bg-[var(--surface-secondary)] border border-transparent rounded-[18px] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(79,124,255,0.08)] transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
              >
                <Filter className="w-4 h-4" />
                Filter
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {(gender ? 1 : 0) + (status ? 1 : 0) + (majorId ? 1 : 0) + (classId ? 1 : 0)}
                  </span>
                )}
              </Button>

              <ExportButton
                students={students}
                academicYearId={academicYear?.id}
                academicYearName={academicYear?.name}
              />

              <ColumnConfigButton
                columns={columnConfig}
                onChange={setColumnConfig}
              />

              {/* Bulk Actions */}
              {isSelectionMode ? (
                <>
                  <div className="h-6 w-px bg-[var(--border-light)] mx-1" />
                  <Button
                    variant="primary"
                    onClick={handleBulkArchive}
                    disabled={isActionLoading || selectedIds.size === 0}
                    size="sm"
                  >
                    {isActionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                    Arsipkan ({selectedIds.size})
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearSelection}
                    size="sm"
                  >
                    Batal
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsSelectionMode(true)}
                  size="sm"
                >
                  <CheckSquare className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => {
                  fetchData()
                }}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-[40px] px-3 text-[13px] bg-[var(--surface-secondary)] border border-transparent rounded-[14px] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer transition-all"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-[40px] px-3 text-[13px] bg-[var(--surface-secondary)] border border-transparent rounded-[14px] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer transition-all"
                >
                  {ACTIVE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Major Filter */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Jurusan
                </label>
                <select
                  value={majorId}
                  onChange={(e) => {
                    setMajorId(e.target.value)
                    setClassId("")
                  }}
                  className="w-full h-[40px] px-3 text-[13px] bg-[var(--surface-secondary)] border border-transparent rounded-[14px] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer transition-all"
                >
                  <option value="">Semua Jurusan</option>
                  {majors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Class Filter */}
              {majorId && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Kelas
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full h-[40px] px-3 text-[13px] bg-[var(--surface-secondary)] border border-transparent rounded-[14px] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer transition-all"
                  >
                    <option value="">Semua Kelas</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.majors?.name || ""} {c.name || ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Pills */}
          {hasActiveFilters && !showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-[var(--text-muted)]">Filter aktif:</span>
              {gender && (
                <button
                  onClick={() => setGender("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors"
                >
                  {GENDERS.find((g) => g.value === gender)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {status && (
                <button
                  onClick={() => setStatus("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors"
                >
                  {ACTIVE_OPTIONS.find((s) => s.value === status)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {majorId && (
                <button
                  onClick={() => {
                    setMajorId("")
                    setClassId("")
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors"
                >
                  {majors.find((m) => m.id === majorId)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              {classId && (
                <button
                  onClick={() => setClassId("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors"
                >
                  {classes.find((c) => c.id === classId)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={resetFilters}
                className="text-[12px] text-[var(--primary)] hover:underline font-medium"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="mt-[20px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--surface-secondary)]">
                  {isSelectionMode && (
                    <th className="text-left px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                        className="w-[18px] h-[18px] rounded-[6px] border-2 border-[var(--border-default)] cursor-pointer accent-[var(--primary)]"
                      />
                    </th>
                  )}
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Siswa
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    NIS
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    JK
                  </th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]/50">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-[var(--surface-secondary)]/50 transition-colors">
                      {isSelectionMode && (
                        <td className="px-6 py-5">
                          <div className="w-[18px] h-[18px] bg-[var(--surface-hover)] rounded-[6px] animate-pulse" />
                        </td>
                      )}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[16px] bg-[var(--surface-hover)] animate-pulse" />
                          <div className="space-y-2">
                            <div className="w-36 h-4 bg-[var(--surface-hover)] rounded-[8px] animate-pulse" />
                            <div className="w-48 h-3 bg-[var(--surface-hover)] rounded-[6px] animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-20 h-4 bg-[var(--surface-hover)] rounded-[8px] animate-pulse" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-24 h-4 bg-[var(--surface-hover)] rounded-[8px] animate-pulse" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-16 h-4 bg-[var(--surface-hover)] rounded-[8px] animate-pulse" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-14 h-7 bg-[var(--surface-hover)] rounded-full animate-pulse" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-[12px] animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={isSelectionMode ? 7 : 6} className="px-6 py-[80px] text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                          <User className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                            {hasActiveFilters
                              ? "Tidak ada siswa yang cocok"
                              : "Belum ada data siswa"}
                          </p>
                          <p className="text-[13px] text-[var(--text-muted)] mt-1">
                            {hasActiveFilters
                              ? "Coba ubah filter pencarian"
                              : "Tambahkan siswa baru untuk memulai"}
                          </p>
                        </div>
                        {hasActiveFilters ? (
                          <Button variant="secondary" onClick={resetFilters} size="sm">
                            Reset Filter
                          </Button>
                        ) : (
                          <Button onClick={() => router.push("/buku-induk/new")} size="sm">
                            <UserPlus className="w-4 h-4" />
                            Tambah Siswa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      className={cn(
                        "group hover:bg-[var(--surface-secondary)]/70 transition-all duration-200",
                        selectedIds.has(student.id) && "bg-[var(--primary-soft)]/50",
                        index === 0 && "first:rounded-t-[20px]",
                        index === students.length - 1 && "last:rounded-b-[20px]"
                      )}
                    >
                      {isSelectionMode && (
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(student.id)}
                            onChange={() => toggleSelect(student.id)}
                            className="w-[18px] h-[18px] rounded-[6px] border-2 border-[var(--border-default)] cursor-pointer accent-[var(--primary)]"
                          />
                        </td>
                      )}

                      {/* Student Info */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar
                            fallback={student.full_name}
                            src={student.photo_url}
                            size="md"
                            className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/20 text-[var(--primary)] ring-2 ring-white shadow-sm"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                              {student.full_name}
                            </p>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                              {student.birth_place || "-"},{" "}
                              {student.birth_date
                                ? new Date(student.birth_date).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NIS */}
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-mono font-medium text-[var(--text-primary)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-[10px]">
                          {student.student_number}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="px-6 py-5">
                        <span className="text-[14px] text-[var(--text-primary)]">
                          {getStudentClass(student)}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-6 h-6 rounded-[8px] flex items-center justify-center",
                            student.gender === "male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                          )}>
                            {student.gender === "male" ? (
                              <span className="text-[10px] font-bold">L</span>
                            ) : (
                              <span className="text-[10px] font-bold">P</span>
                            )}
                          </div>
                          <span className="text-[13px] text-[var(--text-secondary)]">
                            {getGenderLabel(student.gender)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <Badge
                          variant={getStatusBadgeVariant(student.is_active)}
                          className={cn(
                            "px-3 py-1.5 text-[12px] font-medium",
                            student.is_active
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {getStatusLabel(student.is_active)}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <ActionMenu
                          student={student}
                          onQuickView={() => setQuickViewStudentId(student.id)}
                          onEdit={() => router.push(`/buku-induk/${student.id}/edit`)}
                          onArchive={() => {
                            if (confirm(`Apakah Anda yakin ingin mengarsipkan ${student.full_name}?`)) {
                              handleBulkArchiveSingle(student.id)
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && students.length > 0 && (
            <div className="px-6 py-4 border-t border-[var(--border-light)]/50">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[var(--text-muted)]">
                  Menampilkan <span className="font-semibold text-[var(--text-primary)]">{students.length}</span> dari{" "}
                  <span className="font-semibold text-[var(--text-primary)]">{totalCount}</span> siswa
                </p>
                <div className="flex items-center gap-3">
                  <select
                    value={perPage}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="h-8 px-2 text-[12px] bg-[var(--surface-secondary)] border border-transparent rounded-[10px] cursor-pointer focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "w-8 h-8 rounded-[10px] text-[13px] font-medium transition-all",
                            page === pageNum
                              ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(79,124,255,0.3)]"
                              : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                          )}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewStudentId}
        onClose={() => setQuickViewStudentId(null)}
        studentId={quickViewStudentId || ""}
        academicYearId={academicYear?.id}
      />
    </AppShell>
  )
}
