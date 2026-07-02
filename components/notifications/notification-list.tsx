"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Archive,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Calendar,
  Award,
  Shield,
  BarChart3,
  Settings,
  Package,
  Clock,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Notification,
  NotificationType,
  NotificationPriority,
  notificationTypeConfig,
  priorityConfig,
} from "@/lib/types/notifications";

// Sample data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Presensi belum diinput",
    message: "X IPA 1 - Presensi hari ini belum diinput oleh wali kelas",
    type: "warning",
    priority: "high",
    status: "unread",
    module: "attendance",
    referenceId: "ATT-001",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    actionUrl: "/presensi",
  },
  {
    id: "2",
    title: "Batas upload nilai",
    message: "Matematika XI IPS 1 - 2 hari lagi batas upload nilai",
    type: "reminder",
    priority: "normal",
    status: "unread",
    module: "assessment",
    referenceId: "ASM-001",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    actionUrl: "/penilaian",
  },
  {
    id: "3",
    title: "Jadwal ujian",
    message: "Ujian Tengah Semester dimulai besok. Pastikan semua persiapan telah dilakukan.",
    type: "announcement",
    priority: "high",
    status: "unread",
    module: "system",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Peringatan keterlambatan",
    message: "3 siswa memiliki keterlambatan lebih dari 3 kali dalam sebulan",
    type: "warning",
    priority: "normal",
    status: "read",
    module: "attendance",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Maintenance sistem",
    message: "Update database dijadwalkan malam ini pukul 23.00 - 01.00",
    type: "system",
    priority: "low",
    status: "read",
    module: "system",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Poin karakter baru",
    message: "Andi Pratama获得了5点正能量积分",
    type: "information",
    priority: "normal",
    status: "unread",
    module: "character",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    actionUrl: "/poin-karakter",
  },
  {
    id: "7",
    title: "Anggota pasukan khusus baru",
    message: "XII IPS 2 - 2 siswa ditambahkan ke Tim Voli",
    type: "information",
    priority: "normal",
    status: "read",
    module: "special_unit",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },
  {
    id: "8",
    title: "Laporan bulanan siap",
    message: "Laporan bulanan Juni 2026 telah tersedia untuk didownload",
    type: "success",
    priority: "normal",
    status: "read",
    module: "report",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    actionUrl: "/laporan",
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
  custom: Info,
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else if (days === 1) {
    return "Kemarin";
  } else if (days < 7) {
    return `${days} hari yang lalu`;
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

interface NotificationListProps {
  searchQuery?: string;
  filter?: string;
}

export function NotificationList({ searchQuery = "", filter = "all" }: NotificationListProps) {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filter === "unread") {
      filtered = filtered.filter((n) => n.status === "unread");
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.status === "read");
    }

    // Priority filter
    if (filter === "high") {
      filtered = filtered.filter((n) => n.priority === "high" || n.priority === "critical");
    } else if (filter === "medium") {
      filtered = filtered.filter((n) => n.priority === "normal");
    } else if (filter === "low") {
      filtered = filtered.filter((n) => n.priority === "low");
    }

    // Sort: unread first, then by date
    filtered.sort((a, b) => {
      if (a.status === "unread" && b.status !== "unread") return -1;
      if (a.status !== "unread" && b.status === "unread") return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return filtered;
  }, [notifications, searchQuery, filter]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "read" as const, readAt: new Date() } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read" as const, readAt: new Date() }))
    );
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "archived" as const } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id)
          ? { ...n, status: "read" as const, readAt: new Date() }
          : n
      )
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id) ? { ...n, status: "archived" as const } : n
      )
    );
    setSelectedIds([]);
  };

  const getNotificationIcon = (type: NotificationType) => {
    const config = notificationTypeConfig[type];
    switch (config.icon) {
      case "bell":
        return Bell;
      case "bell-ring":
        return BellRing;
      case "info":
        return Info;
      case "check-circle":
        return Check;
      case "alert-triangle":
        return AlertCircle;
      case "alert-circle":
        return AlertCircle;
      case "clock":
        return Clock;
      case "megaphone":
        return Bell;
      case "clipboard-check":
        return ClipboardCheck;
      case "file-check":
        return FileText;
      case "settings":
        return Settings;
      default:
        return Bell;
    }
  };

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-[var(--primary)]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[15px] font-medium text-[var(--text-primary)]">
                {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4" />
                Tandai semua dibaca
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-l-4 border-l-[var(--primary)]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              {selectedIds.length} notifikasi dipilih
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                <Check className="w-4 h-4" />
                Tandai dibaca
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                <Archive className="w-4 h-4" />
                Arsipkan
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] mx-auto mb-4 flex items-center justify-center">
            <Bell className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
            Tidak ada notifikasi
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {searchQuery
              ? "Tidak ada notifikasi yang cocok dengan pencarian"
              : "Semua notifikasi sudah dibaca atau tidak ada yang baru"}
          </p>
        </Card>
      ) : (
        <div className="space-y-[12px]">
          {filteredNotifications.map((notification) => {
            const typeConfig = notificationTypeConfig[notification.type];
            const priority = priorityConfig[notification.priority];
            const Icon = getNotificationIcon(notification.type);
            const ModuleIcon = notification.module ? moduleIcons[notification.module] : Bell;
            const isSelected = selectedIds.includes(notification.id);

            return (
              <Card
                key={notification.id}
                className={cn(
                  "p-5 transition-all duration-200",
                  notification.status === "unread"
                    ? "bg-[var(--surface-primary)]"
                    : "bg-[var(--surface-secondary)]/50",
                  isSelected && "ring-2 ring-[var(--primary)]",
                  "hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-[16px]">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleSelect(notification.id)}
                    className={cn(
                      "w-5 h-5 rounded-[8px] border-2 flex-shrink-0 mt-1 transition-colors",
                      isSelected
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-[var(--border-default)] hover:border-[var(--primary)]"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Unread Indicator */}
                  {notification.status === "unread" && (
                    <div className="absolute left-4 top-6 w-2 h-2 rounded-full bg-[var(--primary)]" />
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: typeConfig.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: typeConfig.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">
                            {notification.title}
                          </h4>
                          {(notification.priority === "high" || notification.priority === "critical") && (
                            <Badge variant="danger" size="sm">
                              {priority.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[14px] text-[var(--text-secondary)] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3">
                          {/* Module Badge */}
                          {notification.module && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-[var(--surface-hover)] text-[12px] text-[var(--text-muted)]">
                              <ModuleIcon className="w-3 h-3" />
                              {notification.module.replace("_", " ")}
                            </span>
                          )}
                          {/* Time */}
                          <span className="text-[12px] text-[var(--text-muted)]">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-secondary)]"
                            onClick={() => window.location.href = notification.actionUrl!}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                        {notification.status === "unread" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--success)]"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Tandai sudah dibaca"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                          onClick={() => handleArchive(notification.id)}
                          title="Arsipkan"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                          onClick={() => handleDelete(notification.id)}
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Placeholder */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-[13px] text-[var(--text-muted)]">
            Menampilkan {filteredNotifications.length} dari {notifications.length} notifikasi
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled>
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
