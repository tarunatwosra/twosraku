"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Archive,
  CheckSquare,
  Square,
  ArrowRightLeft,
  Loader2,
  CheckCircle,
  BookOpen,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import {
  Button,
  Card,
  Badge,
  Avatar,
  Pagination,
  Input,
  Select,
} from "@/components/ui"
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

  // Debounced search
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
        <div className="mb-6 p-4 bg-[var(--success-soft)] border border-[var(--success)] rounded-[18px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            <p className="text-[14px] font-medium text-[var(--success)]">
              {actionSuccess}
            </p>
          </div>
          <button onClick={() => setActionSuccess(null)}>
            <X className="w-4 h-4 text-[var(--success)]" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-[18px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[var(--danger)]">
              {error}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[var(--danger)] text-white text-[13px] font-medium rounded-[14px] hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/buku-induk/archived")}
        >
          <Archive className="w-4 h-4" />
          Diarsipkan
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push("/buku-induk/new")}
        >
          <UserPlus className="w-4 h-4" />
          Tambah Siswa
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="mb-[24px] p-0 overflow-hidden">
        {/* Filter Header */}
        <div className="p-[20px] border-b border-[var(--border-light)]">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama, NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[44px] pl-11 pr-4 text-[14px] bg-[var(--surface-secondary)] border border-transparent rounded-[18px] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Toggle Filters */}
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-[var(--primary)] text-white text-[11px] rounded-full flex items-center justify-center">
                  {(gender ? 1 : 0) + (status ? 1 : 0) + (majorId ? 1 : 0) + (classId ? 1 : 0)}
                </span>
              )}
            </Button>

            {/* Export */}
            <ExportButton
              students={students}
              academicYearId={academicYear?.id}
              academicYearName={academicYear?.name}
            />

            {/* Column Configuration */}
            <ColumnConfigButton
              columns={columnConfig}
              onChange={setColumnConfig}
            />

            {/* Bulk Actions */}
            {isSelectionMode ? (
              <>
                <Button
                  variant="secondary"
                  onClick={handleBulkArchive}
                  disabled={isActionLoading || selectedIds.size === 0}
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
                >
                  Batal
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsSelectionMode(true)}
              >
                <CheckSquare className="w-4 h-4" />
                Pilih Massal
              </Button>
            )}

            {/* Refresh */}
            <Button
              variant="ghost"
              onClick={() => {
                fetchData()
                fetchStats()
              }}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--border-light)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
                  Jenis Kelamin
                </label>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={GENDERS}
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
                  Status
                </label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={ACTIVE_OPTIONS}
                />
              </div>

              {/* Major Filter */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
                  Jurusan
                </label>
                <Select
                  value={majorId}
                  onChange={(e) => {
                    setMajorId(e.target.value)
                    setClassId("")
                  }}
                  options={[
                    { value: "", label: "Semua Jurusan" },
                    ...majors.map((m) => ({ value: m.id, label: m.name })),
                  ]}
                />
              </div>

              {/* Class Filter */}
              {majorId && (
                <div>
                  <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-2">
                    Kelas
                  </label>
                  <Select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    options={[
                      { value: "", label: "Semua Kelas" },
                      ...classes.map((c) => ({
                        value: c.id,
                        label: `${c.majors?.name || ""} ${c.name || ""}`.trim(),
                      })),
                    ]}
                  />
                </div>
              )}
            </div>
          )}

          {/* Active Filters Pills */}
          {hasActiveFilters && !showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
              {gender && (
                <Badge
                  variant="primary"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setGender("")}
                >
                  {GENDERS.find((g) => g.value === gender)?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {status && (
                <Badge
                  variant="primary"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setStatus("")}
                >
                  {ACTIVE_OPTIONS.find((s) => s.value === status)?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {majorId && (
                <Badge
                  variant="primary"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => {
                    setMajorId("")
                    setClassId("")
                  }}
                >
                  {majors.find((m) => m.id === majorId)?.name}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {classId && (
                <Badge
                  variant="primary"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setClassId("")}
                >
                  {(() => {
                    const c = classes.find((cls) => cls.id === classId)
                    return c ? `${c.majors?.name || ""} ${c.name || ""}`.trim() : classId
                  })()}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <button
                onClick={resetFilters}
                className="text-[13px] text-[var(--primary)] hover:underline"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-light)]">
                {isSelectionMode && (
                  <th className="text-left px-[20px] py-[16px] w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === students.length && students.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-[var(--border-default)] cursor-pointer"
                    />
                  </th>
                )}
                <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  Siswa
                </th>
                <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  NIS
                </th>
                <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  Kelas
                </th>
                <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  Jenis Kelamin
                </th>
                <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="text-right px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--border-light)]"
                  >
                    {isSelectionMode && (
                      <td className="px-[20px] py-[16px]">
                        <div className="w-5 h-5 bg-[var(--surface-hover)] rounded animate-pulse" />
                      </td>
                    )}
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[18px] bg-[var(--surface-hover)] animate-pulse" />
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                          <div className="w-48 h-3 bg-[var(--surface-hover)] rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="w-24 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="w-16 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="w-20 h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="w-16 h-6 bg-[var(--surface-hover)] rounded-full animate-pulse" />
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-lg animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={isSelectionMode ? 7 : 6} className="px-[20px] py-[48px] text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                        <Search className="w-8 h-8 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-[var(--text-primary)]">
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
                        <Button variant="outline" onClick={resetFilters}>
                          Reset Filter
                        </Button>
                      ) : (
                        <Button onClick={() => router.push("/buku-induk/new")}>
                          <UserPlus className="w-4 h-4" />
                          Tambah Siswa
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Data rows
                students.map((student) => (
                  <tr
                    key={student.id}
                    className={cn(
                      "border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors",
                      selectedIds.has(student.id) && "bg-[var(--primary-soft)]"
                    )}
                  >
                    {isSelectionMode && (
                      <td className="px-[20px] py-[16px]">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(student.id)}
                          onChange={() => toggleSelect(student.id)}
                          className="w-5 h-5 rounded border-[var(--border-default)] cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Student Info */}
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={student.full_name}
                          src={student.photo_url}
                          size="md"
                          className="bg-[var(--primary-soft)] text-[var(--primary)]"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-[var(--text-primary)]">
                            {student.full_name}
                          </p>
                          <p className="text-[12px] text-[var(--text-muted)]">
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
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-[var(--text-primary)] font-medium">
                        {student.student_number}
                      </span>
                    </td>

                    {/* Class */}
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-[var(--text-primary)]">
                        {getStudentClass(student)}
                      </span>
                    </td>

                    {/* Gender */}
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-[var(--text-primary)]">
                        {getGenderLabel(student.gender)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-[20px] py-[16px]">
                      <Badge variant={getStatusBadgeVariant(student.is_active)}>
                        {getStatusLabel(student.is_active)}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setQuickViewStudentId(student.id)}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                          title="Quick view"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/buku-induk/${student.id}`}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                          title="Lihat detail"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/buku-induk/${student.id}/edit`}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <div className="px-[20px] border-t border-[var(--border-light)]">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={perPage}
              totalItems={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
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
