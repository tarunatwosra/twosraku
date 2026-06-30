"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Eye, Calendar, ClipboardCheck } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { ListPageTemplate } from "@/components/templates";
import { Badge } from "@/components/ui";
import { KPICard } from "@/components/dashboard";
import { getAttendance, getAllClasses, getTodaySummary, type Attendance } from "./lib/data";

export default function AttendancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [todaySummary, setTodaySummary] = useState({
    totalRecords: 0,
    totalStudents: 0,
    present: 0,
    absent: 0,
    averageRate: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [classes, setClasses] = useState<string[]>([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAttendance(pagination.page, pagination.pageSize, {
        search: debouncedSearch || undefined,
        class: classFilter || undefined,
        date: dateFilter || undefined,
      });
      setAttendance(result.data);
      setPagination((prev) => ({ ...prev, ...result.pagination }));
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, classFilter, dateFilter]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    setClasses(getAllClasses());
    setTodaySummary(getTodaySummary());
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
      key: "date",
      header: "Tanggal",
      render: (item: Attendance) => (
        <div className="flex items-center gap-[10px]">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--primary-soft)] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              {new Date(item.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-[12px] text-[var(--text-muted)]">
              {item.recordedBy}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "class",
      header: "Kelas",
      render: (item: Attendance) => (
        <div>
          <p className="text-[14px] font-medium text-[var(--text-primary)]">
            {item.class}
          </p>
          {item.subject && (
            <p className="text-[12px] text-[var(--text-muted)]">
              {item.subject}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "present",
      header: "Kehadiran",
      render: (item: Attendance) => (
        <div className="flex items-center gap-[16px]">
          <div className="text-center">
            <p className="text-[14px] font-semibold text-[var(--success)]">
              {item.present}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Hadir</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-[var(--warning)]">
              {item.sick + item.permission}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Izin/Sakit</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-[var(--danger)]">
              {item.absent}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Alpha</p>
          </div>
        </div>
      ),
    },
    {
      key: "rate",
      header: "Tingkat",
      render: (item: Attendance) => {
        const variant =
          item.attendanceRate >= 95
            ? "success"
            : item.attendanceRate >= 90
            ? "warning"
            : "danger";
        return (
          <Badge variant={variant}>
            {item.attendanceRate.toFixed(1)}%
          </Badge>
        );
      },
      width: "100px",
    },
  ];

  // Row actions
  const rowActions = [
    {
      label: "Detail",
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: Attendance) => console.log("View", item.id),
    },
  ];

  return (
    <AppLayout>
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
        <KPICard
          title="Total Presensi"
          value={todaySummary.totalRecords}
          subtitle="data hari ini"
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="primary"
        />
        <KPICard
          title="Total Siswa"
          value={todaySummary.totalStudents}
          subtitle="terdaftar"
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="info"
        />
        <KPICard
          title="Hadir"
          value={todaySummary.present}
          subtitle="siswa hadir"
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="success"
        />
        <KPICard
          title="Tidak Hadir"
          value={todaySummary.absent}
          subtitle="alpha/izin/sakit"
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="danger"
        />
      </div>

      {/* Attendance List */}
      <ListPageTemplate
        title="Presensi Siswa"
        description="Kelola dan lihat data presensi siswa"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Akademik" },
          { label: "Presensi Siswa" },
        ]}
        primaryAction={{
          label: "Ambil Presensi",
          onClick: () => console.log("Take attendance"),
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
            placeholder: "Cari kelas, mapel...",
            value: searchQuery,
            onChange: setSearchQuery,
          },
          selects: [
            {
              name: "class",
              label: "Kelas",
              placeholder: "Semua",
              value: classFilter,
              onChange: setClassFilter,
              options: classes.map((c) => ({ value: c, label: c })),
            },
            {
              name: "date",
              label: "Tanggal",
              placeholder: "Semua",
              value: dateFilter,
              onChange: setDateFilter,
              options: [
                { value: "2025-01-15", label: "15 Januari 2025" },
                { value: "2025-01-14", label: "14 Januari 2025" },
                { value: "2025-01-13", label: "13 Januari 2025" },
              ],
            },
          ],
        }}
        columns={columns}
        data={attendance}
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
          title: "Tidak ada data presensi",
          description: "Ambil presensi untuk menambahkan data",
          action: {
            label: "Ambil Presensi",
            onClick: () => console.log("Take attendance"),
          },
        }}
      />
    </AppLayout>
  );
}
