"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import { Sidebar, Header, PageHeader } from "@/components/layout";
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Avatar,
  Pagination,
} from "@/components/ui";
import { getStudents, getAllClasses } from "./lib/data";
import type { Student, PaginatedStudents, StudentStatus } from "@/types";
import { GENDERS, STUDENT_STATUSES } from "@/constants";
import { getGenderLabel, getStatusLabel } from "@/constants";
import { cn } from "@/lib/utils";

export default function BukuIndukPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getStudents(pagination.page, pagination.pageSize, {
        search: debouncedSearch,
        gender: genderFilter || undefined,
        class: classFilter || undefined,
        status: statusFilter || undefined,
      });
      setStudents(result.data);
      setPagination((prev) => ({ ...prev, ...result.pagination }));
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, genderFilter, classFilter, statusFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setClasses(getAllClasses());
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setGenderFilter("");
    setClassFilter("");
    setStatusFilter("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters =
    searchQuery || genderFilter || classFilter || statusFilter;

  // Status badge variant helper
  const getStatusBadgeVariant = (status: StudentStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "graduated":
        return "info";
      case "transferred":
        return "warning";
      case "dropout":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-[136px]" : "ml-[328px]"
        )}
        style={{ marginRight: "24px" }}
      >
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-[40px]">
          {/* Page Header */}
          <PageHeader
            title="Buku Induk"
            description="Kelola data lengkap siswa dalam buku induk sekolah"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Akademik" },
              { label: "Buku Induk" },
            ]}
            actions={
              <Button>
                <Plus className="w-4 h-4" />
                Tambah Siswa
              </Button>
            }
          />

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
                    placeholder="Cari nama, NIS, NISN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[44px] pl-11 pr-4 text-[14px] bg-[var(--surface-secondary)] border border-transparent rounded-[18px] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
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
                      {(genderFilter ? 1 : 0) +
                        (classFilter ? 1 : 0) +
                        (statusFilter ? 1 : 0)}
                    </span>
                  )}
                </Button>

                {/* Export */}
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-[var(--border-light)] grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gender Filter */}
                  <Select
                    label="Jenis Kelamin"
                    placeholder="Semua"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    options={[
                      { value: "", label: "Semua" },
                      ...GENDERS.map((g) => ({ value: g.value, label: g.label })),
                    ]}
                  />

                  {/* Class Filter */}
                  <Select
                    label="Kelas"
                    placeholder="Semua"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    options={[
                      { value: "", label: "Semua" },
                      ...classes.map((c) => ({ value: c, label: c })),
                    ]}
                  />

                  {/* Status Filter */}
                  <Select
                    label="Status"
                    placeholder="Semua"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                      { value: "", label: "Semua" },
                      ...STUDENT_STATUSES.map((s) => ({
                        value: s.value,
                        label: s.label,
                      })),
                    ]}
                  />
                </div>
              )}

              {/* Active Filters Pills */}
              {hasActiveFilters && !showFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] text-[var(--text-muted)]">
                    Filter aktif:
                  </span>
                  {genderFilter && (
                    <Badge
                      variant="primary"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setGenderFilter("")}
                    >
                      {GENDERS.find((g) => g.value === genderFilter)?.label}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {classFilter && (
                    <Badge
                      variant="primary"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setClassFilter("")}
                    >
                      {classFilter}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {statusFilter && (
                    <Badge
                      variant="primary"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setStatusFilter("")}
                    >
                      {STUDENT_STATUSES.find((s) => s.value === statusFilter)?.label}
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
                    <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                      Siswa
                    </th>
                    <th className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                      NIS / NISN
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
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-[var(--border-light)]"
                      >
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
                      <td colSpan={6} className="px-[20px] py-[48px] text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                            <Search className="w-8 h-8 text-[var(--text-muted)]" />
                          </div>
                          <div>
                            <p className="text-[15px] font-medium text-[var(--text-primary)]">
                              Tidak ada data siswa
                            </p>
                            <p className="text-[13px] text-[var(--text-muted)] mt-1">
                              {hasActiveFilters
                                ? "Coba ubah filter pencarian"
                                : "Tambahkan siswa baru untuk memulai"}
                            </p>
                          </div>
                          {hasActiveFilters && (
                            <Button variant="outline" onClick={resetFilters}>
                              Reset Filter
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
                        className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                      >
                        {/* Student Info */}
                        <td className="px-[20px] py-[16px]">
                          <div className="flex items-center gap-3">
                            <Avatar
                              fallback={student.name}
                              size="md"
                              className="bg-[var(--primary-soft)] text-[var(--primary)]"
                            />
                            <div>
                              <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                {student.name}
                              </p>
                              <p className="text-[12px] text-[var(--text-muted)]">
                                {student.birthPlace},{" "}
                                {new Date(student.birthDate).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* NIS / NISN */}
                        <td className="px-[20px] py-[16px]">
                          <div className="text-[14px] text-[var(--text-primary)]">
                            {student.nis}
                          </div>
                          <div className="text-[12px] text-[var(--text-muted)]">
                            {student.nisn}
                          </div>
                        </td>

                        {/* Class */}
                        <td className="px-[20px] py-[16px]">
                          <span className="text-[14px] text-[var(--text-primary)]">
                            {student.class || "-"}
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
                            <button
                              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                              title="Lihat detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="w-8 h-8 rounded-[12px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
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
            {!isLoading && students.length > 0 && (
              <div className="px-[20px] border-t border-[var(--border-light)]">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
