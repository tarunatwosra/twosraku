"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Bell,
  BellRing,
  Check,
  X,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "attendance" | "assessment" | "reminder" | "system" | "calendar";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
}

interface NotificationsPanelProps {
  className?: string;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "attendance",
    title: "Presensi belum diinput",
    description: "X IPA 1 - Presensi hari ini belum diinput",
    time: "15 menit yang lalu",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "assessment",
    title: "Batas upload nilai",
    description: "Matematika XI IPS 1 - 2 hari lagi",
    time: "1 jam yang lalu",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "calendar",
    title: "Jadwal ujian",
    description: "Ujian Tengah Semester dimulai besok",
    time: "2 jam yang lalu",
    isRead: true,
    priority: "high",
  },
  {
    id: "4",
    type: "reminder",
    title: "Peringatan terlambat",
    description: "3 siswa memiliki keterlambatan > 3 kali",
    time: "3 jam yang lalu",
    isRead: true,
    priority: "medium",
  },
  {
    id: "5",
    type: "system",
    title: "Maintenance sistem",
    description: "Update database dijadwalkan malam ini",
    time: "5 jam yang lalu",
    isRead: true,
    priority: "low",
  },
];

const typeConfig = {
  attendance: {
    icon: ClipboardCheck,
    color: "var(--success)",
    bg: "var(--success-soft)",
  },
  assessment: {
    icon: FileText,
    color: "var(--warning)",
    bg: "var(--warning-soft)",
  },
  reminder: {
    icon: AlertCircle,
    color: "var(--danger)",
    bg: "var(--danger-soft)",
  },
  calendar: {
    icon: Calendar,
    color: "var(--info)",
    bg: "var(--info-soft)",
  },
  system: {
    icon: Bell,
    color: "var(--text-muted)",
    bg: "var(--surface-secondary)",
  },
};

export function NotificationsPanel({
  className,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayNotifications = showAll
    ? notifications
    : notifications.slice(0, 4);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-[16px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[var(--primary)]" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Notifikasi
            </h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              {unreadCount > 0
                ? `${unreadCount} belum dibaca`
                : "Semua sudah dibaca"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            Tandai semua
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-[12px]">
        {displayNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={cn(
                "relative flex items-start gap-[12px] p-[12px] rounded-[16px]",
                "transition-all duration-200",
                notification.isRead
                  ? "bg-[var(--surface-secondary)] opacity-70"
                  : "bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)]"
              )}
            >
              {/* Unread Indicator */}
              {!notification.isRead && (
                <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[var(--primary)]" />
              )}

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 ml-2"
                style={{ backgroundColor: `var(${config.bg})` }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: `var(${config.color})` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 ml-2">
                <p
                  className={cn(
                    "text-[14px] font-medium",
                    notification.isRead
                      ? "text-[var(--text-secondary)]"
                      : "text-[var(--text-primary)]"
                  )}
                >
                  {notification.title}
                </p>
                <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
                  {notification.description}
                </p>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">
                  {notification.time}
                </p>
              </div>

              {/* Actions */}
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="p-2 rounded-[12px] hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  title="Tandai sudah dibaca"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* View More */}
      {!showAll && notifications.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center justify-center gap-1 w-full mt-[16px] py-[10px] text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border-light)] hover:border-[var(--primary)] rounded-[18px] transition-colors"
        >
          Lihat semua notifikasi
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* View Less */}
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="flex items-center justify-center gap-1 w-full mt-[16px] py-[10px] text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
        >
          Tampilkan lebih sedikit
        </button>
      )}
    </Card>
  );
}
