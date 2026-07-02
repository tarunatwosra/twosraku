"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Megaphone,
  ChevronRight,
  Pin,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "high" | "medium" | "low";
  isPinned: boolean;
}

interface AnnouncementsWidgetProps {
  className?: string;
}

const defaultAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Jadwal Ujian Tengah Semester",
    description: "UTS akan dimulai pada tanggal 3 Juli 2026. Harap persiapkan diri.",
    date: "2026-07-01",
    priority: "high",
    isPinned: true,
  },
  {
    id: "2",
    title: "Pendaftaran Ekskul Baru",
    description: "Pendaftaran kegiatan ekstrakurikuler semester baru dibuka hingga 15 Juli.",
    date: "2026-06-28",
    priority: "medium",
    isPinned: false,
  },
  {
    id: "3",
    title: "Perubahan Jam Masuk",
    description: "Tanggal 5 Juli berlaku jam masuk siang karena kegiatan sekolah.",
    date: "2026-06-25",
    priority: "medium",
    isPinned: false,
  },
  {
    id: "4",
    title: "Undangan Rapat Orang Tua",
    description: "Rapat orang tua/wali akan diadakan pada tanggal 20 Juli 2026.",
    date: "2026-06-20",
    priority: "low",
    isPinned: false,
  },
];

const priorityConfig = {
  high: {
    icon: AlertCircle,
    color: "var(--danger)",
    bg: "var(--danger-soft)",
    label: "Penting",
  },
  medium: {
    icon: Info,
    color: "var(--warning)",
    bg: "var(--warning-soft)",
    label: "Info",
  },
  low: {
    icon: Megaphone,
    color: "var(--info)",
    bg: "var(--info-soft)",
    label: "Umum",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

export function AnnouncementsWidget({
  className,
}: AnnouncementsWidgetProps) {
  const pinnedAnnouncements = defaultAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = defaultAnnouncements.filter((a) => !a.isPinned);

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[16px] bg-[var(--warning-soft)] flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-[var(--warning)]" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Pengumuman
            </h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              {defaultAnnouncements.length} pengumuman
            </p>
          </div>
        </div>
        <Link
          href="/pengumuman"
          className="flex items-center gap-1 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat semua
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Announcements List */}
      <div className="space-y-[12px]">
        {/* Pinned Section */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-[16px]">
            <div className="flex items-center gap-2 mb-[8px]">
              <Pin className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[12px] font-medium text-[var(--primary)]">
                Disematkan
              </span>
            </div>
            <div className="space-y-[8px]">
              {pinnedAnnouncements.map((announcement) => {
                const config = priorityConfig[announcement.priority];
                const Icon = config.icon;

                return (
                  <div
                    key={announcement.id}
                    className={cn(
                      "relative p-[12px] rounded-[16px] border-l-4",
                      "bg-[var(--warning-soft)] border-[var(--warning)]"
                    )}
                  >
                    <div className="flex items-start gap-[12px]">
                      <div
                        className="w-8 h-8 rounded-[12px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: config.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                            {announcement.title}
                          </p>
                        </div>
                        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">
                          {announcement.description}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-2">
                          {formatDate(announcement.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-[8px]">
          {regularAnnouncements.map((announcement) => {
            const config = priorityConfig[announcement.priority];
            const Icon = config.icon;

            return (
              <div
                key={announcement.id}
                className={cn(
                  "flex items-start gap-[12px] p-[12px] rounded-[16px]",
                  "hover:bg-[var(--surface-secondary)] transition-colors",
                  "cursor-pointer"
                )}
              >
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    {announcement.title}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {announcement.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-[8px]"
                      style={{
                        backgroundColor: config.bg,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {formatDate(announcement.date)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
