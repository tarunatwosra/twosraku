"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  History,
  Search,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Bell,
  ClipboardCheck,
  FileText,
  BarChart3,
  Award,
  Shield,
  Settings,
  Package,
  Calendar,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NotificationHistoryItem,
  NotificationType,
  EventSource,
  DeliveryStatus,
  notificationTypeConfig,
} from "@/lib/types/notifications";

// Sample data
const sampleHistory: NotificationHistoryItem[] = [
  {
    id: "1",
    recipientId: "user-001",
    notification: {
      id: "n1",
      title: "Presensi belum diinput",
      message: "X IPA 1 - Presensi hari ini belum diinput oleh wali kelas",
      type: "warning",
      priority: "high",
      status: "read",
      module: "attendance",
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      readAt: new Date(Date.now() - 10 * 60 * 1000),
    },
    module: "attendance",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 15 * 60 * 1000),
    readAt: new Date(Date.now() - 10 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "2",
    recipientId: "user-001",
    notification: {
      id: "n2",
      title: "Batas upload nilai",
      message: "Matematika XI IPS 1 - 2 hari lagi batas upload nilai",
      type: "reminder",
      priority: "normal",
      status: "read",
      module: "assessment",
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      readAt: new Date(Date.now() - 55 * 60 * 1000),
    },
    module: "assessment",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 60 * 60 * 1000),
    readAt: new Date(Date.now() - 55 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "3",
    recipientId: "user-001",
    notification: {
      id: "n3",
      title: "Jadwal ujian",
      message: "Ujian Tengah Semester dimulai besok. Pastikan semua persiapan telah dilakukan.",
      type: "announcement",
      priority: "high",
      status: "read",
      module: "system",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    module: "system",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "4",
    recipientId: "user-001",
    notification: {
      id: "n4",
      title: "Peringatan keterlambatan",
      message: "3 siswa memiliki keterlambatan lebih dari 3 kali dalam sebulan",
      type: "warning",
      priority: "normal",
      status: "read",
      module: "attendance",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    module: "attendance",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "5",
    recipientId: "user-001",
    notification: {
      id: "n5",
      title: "Maintenance sistem",
      message: "Update database dijadwalkan malam ini pukul 23.00 - 01.00",
      type: "system",
      priority: "low",
      status: "read",
      module: "system",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      readAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    module: "system",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "6",
    recipientId: "user-001",
    notification: {
      id: "n6",
      title: "Poin karakter baru",
      message: "Andi Pratama获得了5点正能量积分",
      type: "information",
      priority: "normal",
      status: "read",
      module: "character",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      readAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    module: "character",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "7",
    recipientId: "user-001",
    notification: {
      id: "n7",
      title: "Notifikasi Gagal Terkirim",
      message: "Notifikasi email tidak dapat dikirim karena server tidak merespons",
      type: "error",
      priority: "normal",
      status: "read",
      module: "system",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    module: "system",
    status: "failed",
    deliveredAt: undefined,
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    channel: "email",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    recipientId: "user-001",
    notification: {
      id: "n8",
      title: "Laporan bulanan siap",
      message: "Laporan bulanan Juni 2026 telah tersedia untuk didownload",
      type: "success",
      priority: "normal",
      status: "read",
      module: "report",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      readAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
    },
    module: "report",
    status: "delivered",
    deliveredAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
    channel: "in_app",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

const moduleIcons: Record<string, typeof Bell> = {
  attendance: ClipboardCheck,
  assessment: BarChart3,
  character: Award,
  special_unit: Shield,
  training: Clock,
  report: FileText,
  import_export: Package,
  auth: Settings,
  system: Settings,
  custom: Bell,
};

const channelLabels: Record<string, string> = {
  in_app: "In-App",
  email: "Email",
  push: "Push",
  sms: "SMS",
  whatsapp: "WhatsApp",
  webhook: "Webhook",
};

const deliveryStatusConfig: Record<DeliveryStatus, {
  icon: typeof CheckCircle2;
  color: string;
  label: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral";
}> = {
  pending: {
    icon: Clock,
    color: "var(--text-muted)",
    label: "Menunggu",
    variant: "neutral",
  },
  processing: {
    icon: AlertCircle,
    color: "var(--warning)",
    label: "Diproses",
    variant: "warning",
  },
  delivered: {
    icon: CheckCircle2,
    color: "var(--success)",
    label: "Terkirim",
    variant: "success",
  },
  failed: {
    icon: XCircle,
    color: "var(--danger)",
    label: "Gagal",
    variant: "danger",
  },
  cancelled: {
    icon: XCircle,
    color: "var(--text-muted)",
    label: "Dibatalkan",
    variant: "neutral",
  },
  retry: {
    icon: AlertCircle,
    color: "var(--warning)",
    label: "Dicoba Ulang",
    variant: "warning",
  },
};

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  if (days < 7) return `${days} hari lalu`;
  return formatDateTime(date);
}

interface NotificationHistoryProps {
  searchQuery?: string;
}

export function NotificationHistory({ searchQuery = "" }: NotificationHistoryProps) {
  const [history, setHistory] = useState(sampleHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter history
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.notification.title.toLowerCase().includes(query) ||
          h.notification.message.toLowerCase().includes(query)
      );
    }

    // Sort by date
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return filtered;
  }, [history, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / pageSize);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const deliveredCount = history.filter((h) => h.status === "delivered").length;
  const failedCount = history.filter((h) => h.status === "failed").length;
  const pendingCount = history.filter((h) => h.status === "pending" || h.status === "processing").length;

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setHistory((prev) => prev.filter((h) => !selectedIds.includes(h.id)));
    setSelectedIds([]);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Tanggal", "Judul", "Tipe", "Module", "Status", "Channel"];
    const rows = filteredHistory.map((h) => [
      formatDateTime(h.createdAt),
      h.notification.title,
      h.notification.type,
      h.module,
      h.status,
      h.channel,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notification-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-[24px]">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--primary-soft)] flex items-center justify-center">
              <History className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Total</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {history.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--success-soft)] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Terkirim</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {deliveredCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--danger-soft)] flex items-center justify-center">
              <XCircle className="w-5 h-5 text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Gagal</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {failedCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--warning-soft)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Pending</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {pendingCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[14px] text-[var(--text-muted)]">
            <History className="w-4 h-4" />
            <span>Riwayat tidak dapat dihapus oleh pengguna</span>
          </div>
          <Button variant="outline" size="md" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-l-4 border-l-[var(--primary)]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              {selectedIds.length} item dipilih
            </span>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4" />
              Hapus
            </Button>
          </div>
        </Card>
      )}

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] mx-auto mb-4 flex items-center justify-center">
            <History className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
            Tidak ada riwayat
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {searchQuery
              ? "Tidak ada riwayat yang cocok dengan pencarian"
              : "Riwayat notifikasi akan ditampilkan di sini"}
          </p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--surface-secondary)]">
                    <th className="w-[48px] px-4 py-3">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Tanggal & Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Notifikasi
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {paginatedHistory.map((item) => {
                    const typeConfig = notificationTypeConfig[item.notification.type];
                    const statusConfig = deliveryStatusConfig[item.status];
                    const ModuleIcon = moduleIcons[item.module] || Bell;
                    const StatusIcon = statusConfig.icon;
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-[var(--surface-hover)] transition-colors",
                          isSelected && "bg-[var(--primary-soft)]"
                        )}
                      >
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleSelect(item.id)}
                            className={cn(
                              "w-5 h-5 rounded-[8px] border-2 flex-shrink-0 transition-colors",
                              isSelected
                                ? "bg-[var(--primary)] border-[var(--primary)]"
                                : "border-[var(--border-default)] hover:border-[var(--primary)]"
                            )}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-[14px] text-[var(--text-secondary)]">
                            {formatDateTime(item.createdAt)}
                          </div>
                          <div className="text-[12px] text-[var(--text-muted)]">
                            {formatTimeAgo(item.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: typeConfig.bgColor }}
                            >
                              <Bell className="w-5 h-5" style={{ color: typeConfig.color }} />
                            </div>
                            <div>
                              <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                {item.notification.title}
                              </p>
                              <p className="text-[12px] text-[var(--text-muted)] line-clamp-1">
                                {item.notification.message}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[999px] bg-[var(--surface-hover)] text-[12px] text-[var(--text-secondary)]">
                            <ModuleIcon className="w-3.5 h-3.5" />
                            {item.module.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[13px] text-[var(--text-secondary)]">
                            {channelLabels[item.channel] || item.channel}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={statusConfig.variant} size="sm">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[var(--text-muted)]">
                Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, filteredHistory.length)} dari{" "}
                {filteredHistory.length} riwayat
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span key={`ellipsis-${page}`} className="px-2 text-[var(--text-muted)]">
                          ...
                        </span>
                      )}
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
