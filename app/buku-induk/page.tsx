"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  X,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Archive,
  MoreHorizontal,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileUp,
  Eye,
  Pencil,
  LayoutGrid,
  List as ListIcon,
  Table as TableIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Button, Avatar, Badge, Skeleton } from "@/components/ui"
import {
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui"
import { NoDataState, NoResultsState } from "@/components/ui/empty-state"
import { QuickViewModal } from "@/components/buku-induk/QuickViewModal"
import { ExportButton } from "@/components/buku-induk/ExportButton"
import { useAcademicYear, useMajors, useClasses } from "@/hooks"
import { fetchStudents, bulkArchiveStudents } from "./lib/supabase"
import type { StudentWithClass, StudentFilters } from "@/types/database"
import { cn } from "@/lib/utils"

const GENDERS = [
  { value: "", label: "Semua" },
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
]

const STATUS_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "true", label: "Aktif" },
  { value: "false", label: "Nonaktif" },
]

// View mode: list, grid, or table
type ViewMode = "list" | "grid" | "table"

// Table column definitions
const ALL_COLUMNS = [
  { key: "name", label: "Nama" },
  { key: "nis", label: "NIS" },
  { key: "nisn", label: "NISN" },
  { key: "class", label: "Kelas" },
  { key: "major", label: "Jurusan" },
  { key: "gender", label: "L/P" },
  { key: "birth", label: "Tempat/Tgl Lahir" },
  { key: "parent", label: "Nama Wali" },
  { key: "status", label: "Status" },
]
const DEFAULT_COLUMNS = ALL_COLUMNS.map((c) => c.key)

// ============================================
// ROW ACTION DROPDOWN - Using DropdownMenu
// ============================================
function RowActionDropdown({
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          aria-label="Menu aksi"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="right">
        <DropdownMenuItem
          onClick={() => onQuickView()}
          icon={<Eye className="w-4 h-4 text-[var(--primary)]" />}
        >
          Lihat Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit()}
          icon={<Pencil className="w-4 h-4 text-[var(--warning)]" />}
        >
          Edit Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onArchive()}
          variant="danger"
          icon={<Archive className="w-4 h-4" />}
        >
          Arsipkan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ============================================
// STUDENT CARD - List View (Compact)
// ============================================
function StudentCard({
  student,
  selected,
  onSelect,
  onQuickView,
  onEdit,
  onArchive,
  isLast,
}: {
  student: StudentWithClass
  selected: boolean
  onSelect: () => void
  onQuickView: () => void
  onEdit: () => void
  onArchive: () => void
  isLast: boolean
}) {
  const { academicYear } = useAcademicYear()
  const router = useRouter()

  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )
  const className = activeClass?.classes
    ? `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    : null

  const birthDate = student.birth_date
    ? new Date(student.birth_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : null

  const handleRowClick = () => {
    router.push(`/buku-induk/${student.id}/`)
  }

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "group relative flex items-center gap-3 py-2.5 px-4 cursor-pointer",
        "hover:bg-muted/50 transition-colors",
        selected && "bg-[var(--primary-soft)]",
        !isLast && "border-b border-[var(--border-light)]"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={selected ? "Batalkan pilihan" : "Pilih siswa"}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          aria-label={selected ? "Batalkan pilihan" : "Pilih siswa"}
        />
      </button>

      {/* Avatar */}
      <Avatar
        fallback={student.full_name}
        src={student.photo_url}
        className="w-9 h-9 flex-shrink-0 overflow-hidden"
        showIcon={false}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Line 1: Name + Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {student.full_name}
          </span>
          <Badge variant={student.is_active ? "success" : "neutral"} size="sm">
            {student.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
        {/* Line 2: NIS, Class, Birth */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
          <span className="font-mono bg-[var(--surface-secondary)] px-1.5 py-0.5 rounded text-[11px]">
            {student.student_number}
          </span>
          {className && (
            <span className="text-blue-700 font-medium">{className}</span>
          )}
          <span>{birthDate || "—"}</span>
        </div>
      </div>

      {/* Gender Badge */}
      <span
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-semibold",
          student.gender === "male"
            ? "bg-blue-50 text-blue-600"
            : "bg-pink-50 text-pink-500"
        )}
      >
        {student.gender === "male" ? "L" : "P"}
      </span>

      {/* Edit Icon - Always visible on desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/buku-induk/${student.id}/edit`)
        }}
        className="hidden md:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-[8px] text-[var(--text-secondary)] hover:text-[var(--warning)] hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {/* Actions Dropdown */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <RowActionDropdown
          student={student}
          onQuickView={onQuickView}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      </div>
    </div>
  )
}

// ============================================
// STUDENT GRID CARD - Grid View
// ============================================
function StudentGridCard({
  student,
  selected,
  onSelect,
  onQuickView,
  onEdit,
  onArchive,
}: {
  student: StudentWithClass
  selected: boolean
  onSelect: () => void
  onQuickView: () => void
  onEdit: () => void
  onArchive: () => void
}) {
  const { academicYear } = useAcademicYear()
  const router = useRouter()

  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )
  const className = activeClass?.classes
    ? `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    : null

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] p-4 shadow-sm border transition-all cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5",
        selected ? "border-[var(--primary)] ring-2 ring-[var(--primary-soft)]" : "border-[var(--border-light)]"
      )}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Avatar */}
      <div className="flex justify-center mb-3">
        <Avatar
          fallback={student.full_name}
          src={student.photo_url}
          size="lg"
          className="w-16 h-16 text-xl"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] truncate mb-1">
          {student.full_name}
        </h3>
        <p className="text-[12px] font-mono text-[var(--text-secondary)] mb-2">
          {student.student_number}
        </p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant={student.is_active ? "success" : "neutral"} size="sm">
            {student.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
          <span className={cn(
            "w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold",
            student.gender === "male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
          )}>
            {student.gender === "male" ? "L" : "P"}
          </span>
        </div>
        {className && (
          <p className="text-[12px] text-blue-700 font-medium truncate">
            {className}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[var(--border-light)]">
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(); }}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors touch-target"
          aria-label="Quick view"
        >
          <Eye className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--warning)] transition-colors touch-target"
          aria-label="Edit"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-colors touch-target"
          aria-label="Arsipkan"
        >
          <Archive className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// STUDENT TABLE VIEW
// ============================================
function StudentTable({
  students,
  selectedIds,
  visibleColumns,
  onToggleOne,
  onToggleAll,
  onQuickView,
}: {
  students: StudentWithClass[]
  selectedIds: Set<string>
  visibleColumns: string[]
  onToggleOne: (id: string) => void
  onToggleAll: () => void
  onQuickView: (id: string) => void
}) {
  const { academicYear } = useAcademicYear()
  const router = useRouter()

  const allSelected = students.length > 0 && students.every((s) => selectedIds.has(s.id))
  const someSelected = students.some((s) => selectedIds.has(s.id)) && !allSelected
  const visibleCols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key))

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={onToggleAll}
                aria-label="Pilih semua"
              />
            </TableHead>
            {visibleCols.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead className="w-24 text-right pr-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s, i) => (
            <TableRow
              key={s.id}
              className={cn("cursor-pointer", i % 2 === 1 && "bg-[var(--surface-secondary)]/50")}
              onClick={() => router.push(`/buku-induk/${s.id}/`)}
            >
              <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(s.id)}
                  onCheckedChange={() => onToggleOne(s.id)}
                />
              </TableCell>

              {/* Nama */}
              {visibleColumns.includes("name") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <span className="font-medium">{s.full_name}</span>
                </TableCell>
              )}

              {/* NIS */}
              {visibleColumns.includes("nis") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <span className="font-mono text-[12px]">{s.student_number}</span>
                </TableCell>
              )}

              {/* NISN */}
              {visibleColumns.includes("nisn") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <span className="font-mono text-[12px]">{s.nisn || "—"}</span>
                </TableCell>
              )}

              {/* Kelas */}
              {visibleColumns.includes("class") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const ac = s.student_classes?.find(
                      (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
                    )
                    return (
                      <span className="text-blue-700">
                        {ac?.classes?.name || "—"}
                      </span>
                    )
                  })()}
                </TableCell>
              )}

              {/* Jurusan */}
              {visibleColumns.includes("major") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const ac = s.student_classes?.find(
                      (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
                    )
                    return <span>{ac?.classes?.majors?.name || "—"}</span>
                  })()}
                </TableCell>
              )}

              {/* L/P */}
              {visibleColumns.includes("gender") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <span
                    className={cn(
                      "inline-flex w-5 h-5 rounded flex items-center justify-center text-[11px] font-semibold",
                      s.gender === "male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                    )}
                  >
                    {s.gender === "male" ? "L" : "P"}
                  </span>
                </TableCell>
              )}

              {/* Tempat/Tgl Lahir */}
              {visibleColumns.includes("birth") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {s.birth_place || s.birth_date
                    ? [s.birth_place, s.birth_date ? new Date(s.birth_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : null]
                        .filter(Boolean)
                        .join(", ")
                    : "—"}
                </TableCell>
              )}

              {/* Nama Wali */}
              {visibleColumns.includes("parent") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {s.parents?.[0]?.full_name || "—"}
                </TableCell>
              )}

              {/* Status */}
              {visibleColumns.includes("status") && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Badge variant={s.is_active ? "success" : "neutral"} size="sm">
                    {s.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
              )}

              {/* Aksi */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => router.push(`/buku-induk/${s.id}/edit`)}
                    className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--warning)] hover:bg-[var(--surface-hover)]"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <RowActionDropdown
                    student={s}
                    onQuickView={() => onQuickView(s.id)}
                    onEdit={() => router.push(`/buku-induk/${s.id}/edit`)}
                    onArchive={() => handleArchiveOne(s.full_name, s.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function BukuIndukPage() {
  const router = useRouter()
  const { academicYear } = useAcademicYear()

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(50)
  const [search, setSearch] = useState("")
  const [gender, setGender] = useState("")
  const [status, setStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [students, setStudents] = useState<StudentWithClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const [majorId, setMajorId] = useState("")
  const [classId, setClassId] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS)
  const { majors } = useMajors()
  const { classes } = useClasses({ majorId: majorId || undefined })

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("buku-induk-view-mode")
      if (savedView === "list" || savedView === "grid" || savedView === "table") {
        setViewMode(savedView)
      }
      const savedCols = localStorage.getItem("buku-induk-table-columns")
      if (savedCols) {
        try {
          const parsed = JSON.parse(savedCols)
          if (Array.isArray(parsed) && parsed.every((c) => typeof c === "string")) {
            setVisibleColumns(parsed)
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  }, [])

  // Save viewMode to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("buku-induk-view-mode", viewMode)
    }
  }, [viewMode])

  // Save visibleColumns to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("buku-induk-table-columns", JSON.stringify(visibleColumns))
    }
  }, [visibleColumns])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
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

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchStudents({
        page,
        perPage,
        filters,
        academicYearId: academicYear?.id,
      })
      setStudents(result.data)
      setTotalCount(result.pagination.total)
      setTotalPages(result.pagination.totalPages)
    } catch (err) {
      console.error(err)
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, debouncedSearch, gender, status, majorId, classId, academicYear?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Selection
  const toggleAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(students.map((s) => s.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  // Bulk archive
  const handleBulkArchive = async () => {
    if (!selectedIds.size) return
    if (!confirm(`Arsipkan ${selectedIds.size} siswa?`)) return
    setIsActionLoading(true)
    try {
      const r = await bulkArchiveStudents(Array.from(selectedIds))
      if (r.success) {
        setSuccessMsg(`${r.archived} siswa diarsipkan`)
        setSelectedIds(new Set())
        fetchData()
      } else {
        alert(r.error || "Gagal")
      }
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleArchiveOne = async (name: string, id: string) => {
    if (!confirm(`Arsipkan ${name}?`)) return
    setIsActionLoading(true)
    try {
      const r = await bulkArchiveStudents([id])
      if (r.success) {
        setSuccessMsg(`${r.archived} siswa diarsipkan`)
        fetchData()
      } else {
        alert(r.error || "Gagal")
      }
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setIsActionLoading(false)
    }
  }

  const resetFilters = () => {
    setSearch("")
    setGender("")
    setStatus("")
    setMajorId("")
    setClassId("")
    setPage(1)
  }

  const hasFilters = gender || status || majorId || classId || debouncedSearch

  return (
    <AppShell showHeader={true} title="Buku Induk" description="Kelola data lengkap siswa dalam buku induk sekolah">
      {/* Success toast */}
      {successMsg && (
        <div className="mb-6 p-4 bg-[var(--success-soft)] border border-[var(--success)]/20 rounded-[18px] flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--success)]" />
            <p className="text-[14px] font-medium text-[var(--success)]">{successMsg}</p>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="w-9 h-9 rounded-full hover:bg-[var(--success)]/10 flex items-center justify-center transition-colors touch-target"
            aria-label="Tutup pesan"
          >
            <X className="w-4 h-4 text-[var(--success)]" />
          </button>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)]/20 rounded-[18px] flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
            <p className="text-[14px] font-medium text-[var(--danger)]">{error}</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={fetchData}
            isLoading={isActionLoading}
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/buku-induk/import")}
          >
            <FileUp className="w-4 h-4" />
            Import
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/buku-induk/archived")}
          >
            <Archive className="w-4 h-4" />
            Diarsipkan
          </Button>
          {selectedIds.size > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkArchive}
              isLoading={isActionLoading}
            >
              <Archive className="w-4 h-4" />
              Arsipkan ({selectedIds.size})
            </Button>
          )}
        </div>

        {/* Right - Add button */}
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/buku-induk/new")}
          className="w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Siswa
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[28px] shadow-sm border border-[var(--border-light)] overflow-hidden">
        {/* Search & Filters */}
        <div className="p-5 border-b border-[var(--border-light)]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full h-12 pl-11 pr-4 text-[15px]",
                  "bg-[var(--surface-secondary)] border-0 rounded-[18px]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20",
                  "transition-all placeholder:text-[var(--text-muted)]",
                  "touch-target"
                )}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters || hasFilters ? "primary" : "outline"}
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasFilters && !showFilters && (
                <span className="ml-1 w-5 h-5 bg-white text-[var(--primary)] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {(gender ? 1 : 0) + (status ? 1 : 0) + (majorId ? 1 : 0) + (classId ? 1 : 0)}
                </span>
              )}
            </Button>

            {/* View Mode Toggle - Desktop only */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-[14px]">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-[10px] transition-colors",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                aria-label="Tampilan daftar"
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-2 rounded-[10px] transition-colors",
                  viewMode === "table"
                    ? "bg-white shadow-sm text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                aria-label="Tampilan tabel"
              >
                <TableIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-[10px] transition-colors",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
                aria-label="Tampilan kartu"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>

            {/* Column Toggle - Only visible in table view */}
            {viewMode === "table" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-[12px]">
                    Kolom
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="right">
                  {ALL_COLUMNS.map((col) => (
                    <DropdownMenuItem
                      key={col.key}
                      onClick={() => {
                        setVisibleColumns((prev) =>
                          prev.includes(col.key)
                            ? prev.filter((c) => c !== col.key)
                            : [...prev, col.key]
                        )
                      }}
                      preventClose
                      className="py-2"
                    >
                      <Checkbox
                        checked={visibleColumns.includes(col.key)}
                        className="mr-3 flex-shrink-0"
                      />
                      {col.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ExportButton
              students={students}
              academicYearId={academicYear?.id}
              academicYearName={academicYear?.name}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={fetchData}
              disabled={loading}
              aria-label="Refresh"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <div>
                <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-2">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-4 text-[14px] bg-[var(--surface-secondary)] border-0 rounded-[14px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 text-[14px] bg-[var(--surface-secondary)] border-0 rounded-[14px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-2">Jurusan</label>
                <select
                  value={majorId}
                  onChange={(e) => {
                    setMajorId(e.target.value)
                    setClassId("")
                  }}
                  className="w-full h-11 px-4 text-[14px] bg-[var(--surface-secondary)] border-0 rounded-[14px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                >
                  <option value="">Semua</option>
                  {majors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              {majorId && (
                <div>
                  <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-2">Kelas</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full h-11 px-4 text-[14px] bg-[var(--surface-secondary)] border-0 rounded-[14px] focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
                  >
                    <option value="">Semua</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.majors?.name} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Active filter pills */}
          {hasFilters && !showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {gender && (
                <button
                  onClick={() => setGender("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors touch-target"
                >
                  {GENDERS.find((g) => g.value === gender)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {status && (
                <button
                  onClick={() => setStatus("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors touch-target"
                >
                  {STATUS_OPTIONS.find((s) => s.value === status)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {majorId && (
                <button
                  onClick={() => {
                    setMajorId("")
                    setClassId("")
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors touch-target"
                >
                  {majors.find((m) => m.id === majorId)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              {classId && (
                <button
                  onClick={() => setClassId("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[12px] font-medium rounded-full hover:bg-[var(--primary)]/15 transition-colors touch-target"
                >
                  {classes.find((c) => c.id === classId)?.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={resetFilters}
                className="text-[12px] text-[var(--primary)] hover:underline font-medium ml-2 touch-target"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>

        {/* List Header - Desktop only */}
        <div className="hidden md:flex px-5 py-3 bg-[var(--surface-secondary)] border-b border-[var(--border-light)] items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={selectedIds.size === students.length ? "Batalkan semua" : "Pilih semua"}
            >
              <Checkbox
                checked={selectedIds.size === students.length && students.length > 0}
                indeterminate={selectedIds.size > 0 && selectedIds.size < students.length}
                onCheckedChange={toggleAll}
                aria-label={selectedIds.size === students.length ? "Batalkan semua" : "Pilih semua"}
              />
            </button>
            <span className="text-[13px] text-[var(--text-secondary)]">
              {selectedIds.size > 0
                ? `${selectedIds.size} dipilih`
                : `${totalCount} siswa`}
            </span>
          </div>
          <span className="text-[12px] text-[var(--text-muted)]">Tahun ajaran aktif: {academicYear?.name || "—"}</span>
        </div>

        {/* Student List/Grid/Table */}
        <div>
          {loading ? (
            // Skeleton Loading
            viewMode === "grid" ? (
              // Grid skeleton
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[20px] p-4 border border-[var(--border-light)]">
                    <div className="flex justify-center mb-3">
                      <Skeleton className="w-16 h-16 rounded-[18px]" />
                    </div>
                    <div className="text-center space-y-2">
                      <Skeleton className="h-5 w-32 mx-auto" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                      <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === "table" ? (
              // Table skeleton
              <div className="overflow-x-auto p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4"><Skeleton className="h-4 w-4" /></TableHead>
                      {visibleColumns.includes("name") && <TableHead><Skeleton className="h-4 w-20" /></TableHead>}
                      {visibleColumns.includes("nis") && <TableHead><Skeleton className="h-4 w-16" /></TableHead>}
                      {visibleColumns.includes("nisn") && <TableHead><Skeleton className="h-4 w-16" /></TableHead>}
                      {visibleColumns.includes("class") && <TableHead><Skeleton className="h-4 w-12" /></TableHead>}
                      {visibleColumns.includes("major") && <TableHead><Skeleton className="h-4 w-20" /></TableHead>}
                      {visibleColumns.includes("gender") && <TableHead><Skeleton className="h-4 w-8" /></TableHead>}
                      {visibleColumns.includes("birth") && <TableHead><Skeleton className="h-4 w-32" /></TableHead>}
                      {visibleColumns.includes("parent") && <TableHead><Skeleton className="h-4 w-24" /></TableHead>}
                      {visibleColumns.includes("status") && <TableHead><Skeleton className="h-4 w-16" /></TableHead>}
                      <TableHead className="w-24"><Skeleton className="h-4 w-12" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-4"><Skeleton className="h-4 w-4" /></TableCell>
                        {visibleColumns.includes("name") && <TableCell><Skeleton className="h-4 w-32" /></TableCell>}
                        {visibleColumns.includes("nis") && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
                        {visibleColumns.includes("nisn") && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
                        {visibleColumns.includes("class") && <TableCell><Skeleton className="h-4 w-12" /></TableCell>}
                        {visibleColumns.includes("major") && <TableCell><Skeleton className="h-4 w-20" /></TableCell>}
                        {visibleColumns.includes("gender") && <TableCell><Skeleton className="h-4 w-5" /></TableCell>}
                        {visibleColumns.includes("birth") && <TableCell><Skeleton className="h-4 w-32" /></TableCell>}
                        {visibleColumns.includes("parent") && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
                        {visibleColumns.includes("status") && <TableCell><Skeleton className="h-6 w-12" /></TableCell>}
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // List skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-4 border-b border-[var(--border-light)]">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-9 h-9 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              ))
            )
          ) : students.length === 0 ? (
            // Empty State
            hasFilters ? (
              <NoResultsState
                searchQuery={debouncedSearch}
                onClear={resetFilters}
                className="py-16"
              />
            ) : (
              <NoDataState
                title="Belum ada siswa"
                description="Mulai dengan menambahkan siswa baru"
                onAction={() => router.push("/buku-induk/new")}
                actionLabel="Tambah Siswa"
                className="py-16"
              />
            )
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {students.map((s) => (
                <StudentGridCard
                  key={s.id}
                  student={s}
                  selected={selectedIds.has(s.id)}
                  onSelect={() => toggleOne(s.id)}
                  onQuickView={() => setQuickViewId(s.id)}
                  onEdit={() => router.push(`/buku-induk/${s.id}/edit`)}
                  onArchive={() => handleArchiveOne(s.full_name, s.id)}
                />
              ))}
            </div>
          ) : viewMode === "table" ? (
            // Table View
            <StudentTable
              students={students}
              selectedIds={selectedIds}
              visibleColumns={visibleColumns}
              onToggleOne={toggleOne}
              onToggleAll={toggleAll}
              onQuickView={(id) => setQuickViewId(id)}
            />
          ) : (
            // List View
            students.map((s, i) => (
              <StudentCard
                key={s.id}
                student={s}
                selected={selectedIds.has(s.id)}
                onSelect={() => toggleOne(s.id)}
                onQuickView={() => setQuickViewId(s.id)}
                onEdit={() => router.push(`/buku-induk/${s.id}/edit`)}
                onArchive={() => handleArchiveOne(s.full_name, s.id)}
                isLast={i === students.length - 1}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <div className="px-5 py-4 border-t border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[12px] text-[var(--text-secondary)]">
              Menampilkan{" "}
              <span className="font-medium text-[var(--text-primary)]">{students.length}</span> dari{" "}
              <span className="font-medium text-[var(--text-primary)]">{totalCount}</span>
            </span>
            <div className="flex items-center gap-2">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value))
                  setPage(1)
                }}
                className="h-9 px-3 text-[12px] bg-[var(--surface-secondary)] border-0 rounded-[12px] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="flex items-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-11 h-11 flex items-center justify-center rounded-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let num
                  if (totalPages <= 5) num = i + 1
                  else if (page <= 3) num = i + 1
                  else if (page >= totalPages - 2) num = totalPages - 4 + i
                  else num = page - 2 + i
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={cn(
                        "w-11 h-11 text-[13px] font-medium rounded-[12px] transition-colors touch-target",
                        page === num
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      )}
                      aria-label={`Halaman ${num}`}
                      aria-current={page === num ? "page" : undefined}
                    >
                      {num}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-11 h-11 flex items-center justify-center rounded-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-target"
                  aria-label="Halaman selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuickViewModal
        isOpen={!!quickViewId}
        onClose={() => setQuickViewId(null)}
        studentId={quickViewId || ""}
        academicYearId={academicYear?.id}
      />
    </AppShell>
  )
}
