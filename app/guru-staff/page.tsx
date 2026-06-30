"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { ListPageTemplate } from "@/components/templates";
import { Badge, Avatar } from "@/components/ui";
import { getTeachers, getAllPositions, type Teacher } from "./lib/data";

export default function TeachersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positions, setPositions] = useState<string[]>([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getTeachers(pagination.page, pagination.pageSize, {
        search: debouncedSearch || undefined,
        gender: genderFilter || undefined,
        position: positionFilter || undefined,
        status: statusFilter || undefined,
      });
      setTeachers(result.data);
      setPagination((prev) => ({ ...prev, ...result.pagination }));
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, genderFilter, positionFilter, statusFilter]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    setPositions(getAllPositions());
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Columns
  const columns = [
    {
      key: "name",
      header: "Guru",
      render: (teacher: Teacher) => (
        <div className="flex items-center gap-[12px]">
          <Avatar
            fallback={teacher.name}
            size="md"
            className="bg-[var(--primary-soft)] text-[var(--primary)]"
          />
          <div>
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              {teacher.name}
            </p>
            <p className="text-[12px] text-[var(--text-muted)]">
              NIP: {teacher.nip}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Jabatan",
      render: (teacher: Teacher) => (
        <div>
          <p className="text-[14px] text-[var(--text-primary)]">
            {teacher.position}
          </p>
          {teacher.subject && (
            <p className="text-[12px] text-[var(--text-muted)]">
              {teacher.subject}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "gender",
      header: "JK",
      render: (teacher: Teacher) => (
        <span className="text-[14px] text-[var(--text-secondary)]">
          {teacher.gender === "L" ? "Laki-laki" : "Perempuan"}
        </span>
      ),
      width: "100px",
    },
    {
      key: "phone",
      header: "Kontak",
      render: (teacher: Teacher) => (
        <div className="text-[14px] text-[var(--text-secondary)]">
          <p>{teacher.phone}</p>
          <p className="text-[12px] text-[var(--text-muted)]">{teacher.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (teacher: Teacher) => (
        <Badge variant={teacher.status === "active" ? "success" : "neutral"}>
          {teacher.status === "active" ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
      width: "100px",
    },
  ];

  // Row actions
  const rowActions = [
    {
      label: "Lihat",
      icon: <Eye className="w-4 h-4" />,
      onClick: (teacher: Teacher) => console.log("View", teacher.id),
    },
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (teacher: Teacher) => console.log("Edit", teacher.id),
    },
    {
      label: "Hapus",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (teacher: Teacher) => console.log("Delete", teacher.id),
      variant: "danger" as const,
    },
  ];

  return (
    <AppLayout>
      <ListPageTemplate
        title="Guru & Staff"
        description="Kelola data guru dan staff sekolah"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Administrasi" },
          { label: "Guru & Staff" },
        ]}
        primaryAction={{
          label: "Tambah Guru/Staff",
          onClick: () => console.log("Add teacher"),
        }}
        secondaryActions={[
          {
            label: "Export",
            icon: <Download className="w-4 h-4" />,
            onClick: () => console.log("Export"),
          },
        ]}
        filters={{
          search: {
            placeholder: "Cari nama, NIP...",
            value: searchQuery,
            onChange: setSearchQuery,
          },
          selects: [
            {
              name: "gender",
              label: "Jenis Kelamin",
              placeholder: "Semua",
              value: genderFilter,
              onChange: setGenderFilter,
              options: [
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ],
            },
            {
              name: "position",
              label: "Jabatan",
              placeholder: "Semua",
              value: positionFilter,
              onChange: setPositionFilter,
              options: positions.map((p) => ({ value: p, label: p })),
            },
            {
              name: "status",
              label: "Status",
              placeholder: "Semua",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "active", label: "Aktif" },
                { value: "inactive", label: "Nonaktif" },
              ],
            },
          ],
        }}
        columns={columns}
        data={teachers}
        isLoading={isLoading}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          pageSize: pagination.pageSize,
          totalItems: pagination.total,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        rowActions={rowActions}
        emptyState={{
          title: "Tidak ada data guru/staff",
          description: "Tambahkan guru atau staff baru untuk memulai",
          action: {
            label: "Tambah Guru/Staff",
            onClick: () => console.log("Add teacher"),
          },
        }}
      />
    </AppLayout>
  );
}
