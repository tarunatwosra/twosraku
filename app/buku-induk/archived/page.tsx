"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  Archive,
  RotateCcw,
  Eye,
  X,
  Loader2,
  CheckCircle,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import {
  Button,
  Card,
  Badge,
  Avatar,
  Pagination,
} from "@/components/ui"
import { fetchArchivedStudents, restoreStudent, permanentlyDeleteStudent } from "../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

// Status badge variant helper
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active":
      return "success"
    case "graduated":
      return "info"
    case "transferred":
      return "warning"
    case "prospective":
      return "primary"
    case "archived":
    default:
      return "neutral"
  }
}

// Status label helper
const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Aktif"
    case "graduated":
      return "Lulus"
    case "transferred":
      return "Pindah"
    case "prospective":
      return "Calon Siswa"
    case "archived":
      return "Diarsipkan"
    default:
      return status
  }
}

// Gender label helper
const getGenderLabel = (gender: string) => {
  return gender === "male" ? "Laki-laki" : "Perempuan"
}

export default function ArchivedStudentsPage() {
  const router = useRouter()

  // Pagination state
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  // Filters state
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Data state
  const [students, setStudents] = useState<StudentWithClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // Action states
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch archived students
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchArchivedStudents({
        page,
        perPage,
        search: debouncedSearch || undefined,
      })

      setStudents(result.data)
      setTotalCount(result.pagination.total)
      setTotalPages(result.pagination.totalPages)
    } catch (err) {
      console.error("Error fetching archived students:", err)
      setError("Gagal memuat data siswa")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, debouncedSearch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPerPage(newSize)
    setPage(1)
  }

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

  // Restore single student
  const handleRestore = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin mengembalikan siswa ini?")) return

    setActionLoading(true)
    setActionSuccess(null)

    try {
      const result = await restoreStudent(id)
      if (result.success) {
        setActionSuccess("Siswa berhasil dikembalikan")
        fetchData()
        // Clear selection if this student was selected
        const newSet = new Set(selectedIds)
        newSet.delete(id)
        setSelectedIds(newSet)
      } else {
        alert(result.error || "Gagal mengembalikan siswa")
      }
    } catch (err) {
      console.error("Error restoring student:", err)
      alert("Terjadi kesalahan saat mengembalikan siswa")
    } finally {
      setActionLoading(false)
    }
  }

  // Bulk restore
  const handleBulkRestore = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengembalikan ${selectedIds.size} siswa?`)) return

    setActionLoading(true)
    setActionSuccess(null)

    try {
      let restored = 0
      for (const id of selectedIds) {
        const result = await restoreStudent(id)
        if (result.success) restored++
      }
      setActionSuccess(`${restored} siswa berhasil dikembalikan`)
      setSelectedIds(new Set())
      setIsSelectionMode(false)
      fetchData()
    } catch (err) {
      console.error("Error bulk restoring:", err)
      alert("Terjadi kesalahan saat mengembalikan siswa")
    } finally {
      setActionLoading(false)
    }
  }

  // Permanent delete
  const handlePermanentDelete = async (id: string) => {
    if (!confirm("PERHATIAN: Siswa ini akan dihapus secara permanen dan tidak dapat dikembalikan! Apakah Anda yakin?")) return
    if (!confirm("Konfirmasi sekali lagi: Semua data siswa akan hilang permanen!")) return

    setActionLoading(true)

    try {
      const result = await permanentlyDeleteStudent(id)
      if (result.success) {
        setActionSuccess("Siswa berhasil dihapus permanen")
        fetchData()
      } else {
        alert(result.error || "Gagal menghapus siswa")
      }
    } catch (err) {
      console.error("Error deleting student:", err)
      alert("Terjadi kesalahan saat menghapus siswa")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AppShell showHeader={true}>
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
        <div className="mb-6 p-4 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-[18px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
            <p className="text-[14px] font-medium text-[var(--danger)]">{error}</p>
          </div>
          <button onClick={fetchData}>
            <RefreshCw className="w-4 h-4 text-[var(--danger)]" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-[24px]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/buku-induk"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Buku Induk
              </Link>
            </div>
            <h1 className="text-[24px] font-bold text-[var(--text-primary)] flex items-center gap-3">
              <Archive className="w-6 h-6" />
              Siswa Diarsipkan
            </h1>
            <p className="text-[14px] text-[var(--text-muted)]">
              Kelola siswa yang telah diarsipkan
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[var(--text-muted)]">Total Diarsipkan:</span>
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">
              {totalCount.toLocaleString("id-ID")}
            </span>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[var(--primary)]">
                {selectedIds.size} dipilih
              </span>
            </div>
          )}
        </div>
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

            {/* Bulk Actions */}
            {isSelectionMode && selectedIds.size > 0 && (
              <Button onClick={handleBulkRestore} disabled={actionLoading}>
                <RotateCcw className="w-4 h-4" />
                Kembalikan ({selectedIds.size})
              </Button>
            )}

            {/* Toggle Selection Mode */}
            <Button
              variant={isSelectionMode ? "secondary" : "outline"}
              onClick={() => {
                if (isSelectionMode) {
                  clearSelection()
                } else {
                  setIsSelectionMode(true)
                }
              }}
            >
              {isSelectionMode ? "Batal Pilih" : "Pilih Massal"}
            </Button>

            {/* Refresh */}
            <Button
              variant="ghost"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
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
                      className="w-5 h-5 rounded border-[var(--border-default)]"
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
                  <td colSpan={isSelectionMode ? 6 : 5} className="px-[20px] py-[48px] text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                        <Archive className="w-8 h-8 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-[var(--text-primary)]">
                          {debouncedSearch
                            ? "Tidak ada siswa yang cocok"
                            : "Tidak ada siswa diarsipkan"}
                        </p>
                        <p className="text-[13px] text-[var(--text-muted)] mt-1">
                          {debouncedSearch
                            ? "Coba ubah kata kunci pencarian"
                            : "Semua siswa aktif atau berstatus lain"}
                        </p>
                      </div>
                      {debouncedSearch && (
                        <Button variant="outline" onClick={() => setSearch("")}>
                          Reset Pencarian
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
                          className="w-5 h-5 rounded border-[var(--border-default)]"
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
                          className="bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
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

                    {/* Gender */}
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-[var(--text-primary)]">
                        {getGenderLabel(student.gender)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-[20px] py-[16px]">
                      <Badge variant={getStatusBadgeVariant(student.status)}>
                        {getStatusLabel(student.status)}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/buku-induk/${student.id}`}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                          title="Lihat detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleRestore(student.id)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--success)] hover:bg-[var(--success-soft)] transition-colors disabled:opacity-50"
                          title="Kembalikan"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(student.id)}
                          disabled={actionLoading}
                          className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors disabled:opacity-50"
                          title="Hapus Permanen"
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
    </AppShell>
  )
}
