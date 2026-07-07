"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  CheckCircle,
  Trash2,
  MoreHorizontal,
  User,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Button, Card, Badge, Avatar } from "@/components/ui"
import { fetchArchivedStudents, restoreStudent, permanentlyDeleteStudent } from "../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

const getStatusBadgeVariant = (isActive: boolean) => isActive ? "success" : "neutral"
const getStatusLabel = (isActive: boolean) => isActive ? "Aktif" : "Tidak Aktif"
const getGenderLabel = (gender: string) => gender === "male" ? "Laki-laki" : "Perempuan"

function ActionMenu({ student, onRestore, onDelete }: { student: StudentWithClass; onRestore: () => void; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all duration-200 hover:scale-105"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-[var(--border-light)]/50 py-2 min-w-[180px] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            <Link
              href={`/buku-induk/${student.id}`}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Eye className="w-4 h-4 text-[var(--primary)]" />
              Lihat Detail
            </Link>
            <div className="h-px bg-[var(--border-light)]/60 my-2" />
            <button
              onClick={() => { onRestore(); setIsOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Kembalikan
            </button>
            <button
              onClick={() => { onDelete(); setIsOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Permanen
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function ArchivedStudentsPage() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(25)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [students, setStudents] = useState<StudentWithClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchArchivedStudents({ page, perPage, search: debouncedSearch || undefined })
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

  useEffect(() => { fetchData() }, [fetchData])

  const toggleSelectAll = () => {
    if (selectedIds.size === students.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(students.map((s) => s.id)))
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const handleRestore = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin mengembalikan siswa ini?")) return
    setActionLoading(true)
    try {
      const result = await restoreStudent(id)
      if (result.success) {
        setActionSuccess("Siswa berhasil dikembalikan")
        fetchData()
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

  const handleBulkRestore = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengembalikan ${selectedIds.size} siswa?`)) return
    setActionLoading(true)
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
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 border border-emerald-200/50 rounded-2xl flex items-center justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-[14px] font-medium text-emerald-700">{actionSuccess}</p>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="w-8 h-8 rounded-xl hover:bg-emerald-100/50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-red-50/50 border border-red-200/50 rounded-2xl backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-500 text-white text-[13px] font-medium rounded-xl hover:bg-red-600 transition-colors shadow-sm"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            {/* Back Link */}
            <Link
              href="/buku-induk"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Buku Induk
            </Link>

            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-200/50">
                <Archive className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-[26px] font-bold text-[var(--text-primary)]">Siswa Diarsipkan</h1>
                <p className="text-[14px] text-[var(--text-muted)] mt-0.5">Kelola siswa yang telah diarsipkan</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-[var(--border-light)]/50">
            <div className="text-right">
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">Total</p>
              <p className="text-[18px] font-bold text-[var(--text-primary)]">{totalCount.toLocaleString("id-ID")}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Archive className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Selection Info */}
        {selectedIds.size > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10">
            <span className="text-[13px] font-medium text-[var(--primary)]">{selectedIds.size} siswa dipilih</span>
          </div>
        )}
      </div>

      {/* Table Card */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Search & Actions Bar */}
        <div className="p-6 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama, NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[48px] pl-12 pr-10 text-[14px] bg-[var(--surface-secondary)] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[var(--primary)]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(79,124,255,0.08)] transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {isSelectionMode && selectedIds.size > 0 ? (
                <>
                  <Button onClick={handleBulkRestore} disabled={actionLoading} size="sm" variant="primary">
                    <RotateCcw className="w-4 h-4" />
                    Kembalikan ({selectedIds.size})
                  </Button>
                  <Button variant="ghost" onClick={() => { setSelectedIds(new Set()); setIsSelectionMode(false) }} size="sm">
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setIsSelectionMode(true)} size="sm">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={fetchData} disabled={loading} size="sm">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-2">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-50/50">
                  {isSelectionMode && (
                    <th className="text-left px-6 py-4 w-14">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                        className="w-[20px] h-[20px] rounded-lg border-2 border-[var(--border-default)] cursor-pointer accent-[var(--primary)]"
                      />
                    </th>
                  )}
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Siswa</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">NIS</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">JK</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]/40">
                {loading ? (
                  // Loading Skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      {isSelectionMode && (<td className="px-6 py-5"><div className="w-[20px] h-[20px] bg-[var(--surface-hover)] rounded-lg animate-pulse" /></td>)}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse" />
                          <div className="space-y-2">
                            <div className="w-40 h-4 bg-[var(--surface-hover)] rounded-lg animate-pulse" />
                            <div className="w-52 h-3 bg-[var(--surface-hover)] rounded-lg animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><div className="w-24 h-8 bg-[var(--surface-hover)] rounded-lg animate-pulse" /></td>
                      <td className="px-6 py-5"><div className="w-20 h-8 bg-[var(--surface-hover)] rounded-lg animate-pulse" /></td>
                      <td className="px-6 py-5"><div className="w-20 h-7 bg-[var(--surface-hover)] rounded-full animate-pulse" /></td>
                      <td className="px-6 py-5"><div className="w-9 h-9 bg-[var(--surface-hover)] rounded-xl animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={isSelectionMode ? 6 : 5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-dashed border-[var(--border-default)] flex items-center justify-center">
                          <Archive className="w-10 h-10 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                            {debouncedSearch ? "Tidak ada siswa yang cocok" : "Tidak ada siswa diarsipkan"}
                          </p>
                          <p className="text-[14px] text-[var(--text-muted)] mt-1">
                            {debouncedSearch ? "Coba ubah kata kunci pencarian" : "Semua siswa dalam keadaan aktif"}
                          </p>
                        </div>
                        {debouncedSearch && (
                          <Button variant="secondary" onClick={() => setSearch("")} size="sm">
                            Reset Pencarian
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      className={cn(
                        "group hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-transparent transition-all duration-200",
                        selectedIds.has(student.id) && "bg-[var(--primary)]/5",
                        index === 0 && "first:rounded-t-2xl",
                        index === students.length - 1 && "last:rounded-b-2xl last:hover:rounded-b-2xl"
                      )}
                    >
                      {isSelectionMode && (
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(student.id)}
                            onChange={() => toggleSelect(student.id)}
                            className="w-[20px] h-[20px] rounded-lg border-2 border-[var(--border-default)] cursor-pointer accent-[var(--primary)]"
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
                            className="ring-2 ring-white shadow-md bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-[var(--text-primary)]">{student.full_name}</p>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                              {student.birth_place || "-"},{" "}
                              {student.birth_date ? new Date(student.birth_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* NIS */}
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-mono font-semibold text-[var(--text-primary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-lg">
                          {student.student_number}
                        </span>
                      </td>
                      {/* Gender */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center",
                            student.gender === "male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                          )}>
                            {student.gender === "male" ? (
                              <span className="text-[11px] font-bold">L</span>
                            ) : (
                              <span className="text-[11px] font-bold">P</span>
                            )}
                          </div>
                          <span className="text-[13px] text-[var(--text-secondary)]">{getGenderLabel(student.gender)}</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-5">
                        <Badge
                          variant={getStatusBadgeVariant(student.is_active)}
                          className={cn(
                            "px-3 py-1.5 text-[12px] font-semibold rounded-full",
                            student.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {getStatusLabel(student.is_active)}
                        </Badge>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-5">
                        <ActionMenu
                          student={student}
                          onRestore={() => handleRestore(student.id)}
                          onDelete={() => handlePermanentDelete(student.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--border-light)]/40 flex items-center justify-between">
            <p className="text-[13px] text-[var(--text-muted)]">
              Menampilkan <span className="font-semibold text-[var(--text-primary)]">{students.length}</span> dari <span className="font-semibold text-[var(--text-primary)]">{totalCount}</span> siswa
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ←
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-[13px] font-medium transition-all",
                      page === pageNum
                        ? "bg-[var(--primary)] text-white shadow-[0_4px_12px_rgba(79,124,255,0.35)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                →
              </button>
            </div>
          </div>
        )}
      </Card>
    </AppShell>
  )
}
