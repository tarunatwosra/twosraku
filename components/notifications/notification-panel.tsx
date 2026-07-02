"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
  X,
  Settings,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "attendance" | "assessment" | "reminder" | "system" | "calendar" | "info";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
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
    isRead: false,
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
    icon: Settings,
    color: "var(--text-muted)",
    bg: "var(--surface-secondary)",
  },
  info: {
    icon: Info,
    color: "var(--primary)",
    bg: "var(--primary-soft)",
  },
};

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayNotifications = notifications.slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-[44px] h-[44px] flex items-center justify-center",
          "rounded-[18px] transition-all duration-200",
          isOpen
            ? "bg-[var(--primary-soft)] text-[var(--primary)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-bell")} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-[400px]",
            "bg-white rounded-[24px] shadow-[var(--shadow-lg)] border border-[var(--border-light)]",
            "overflow-hidden z-[var(--z-dropdown)]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BellRing className="w-5 h-5 text-[var(--primary)]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--danger)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  Notifikasi
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-[14px] transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Baca semua
                </button>
              )}
              <button
                onClick={handleClose}
                className="w-[32px] h-[32px] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-hover)] rounded-[12px] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] mx-auto mb-3 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-[14px] text-[var(--text-secondary)]">
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-light)]">
                {displayNotifications.map((notification) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "relative p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer",
                        !notification.isRead && "bg-[var(--primary-soft)]/30"
                      )}
                    >
                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="absolute top-4 left-3 w-2 h-2 rounded-full bg-[var(--primary)]" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.bg }}
                        >
                          <Icon className="w-5 h-5" style={{ color: config.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
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
                          <p className="text-[13px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                            {notification.description}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1">
                            {notification.time}
                          </p>
                        </div>

                        {/* Actions */}
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="p-2 rounded-[12px] hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--success)] transition-colors"
                            title="Tandai sudah dibaca"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border-light)]">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-[14px] font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-[18px] transition-colors"
            >
              Lihat semua notifikasi
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
