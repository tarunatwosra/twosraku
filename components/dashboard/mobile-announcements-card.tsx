"use client";

import { Card } from "@/components/ui";
import { Megaphone, ChevronRight, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  date: string;
  priority?: "normal" | "important" | "urgent";
  excerpt?: string;
}

interface MobileAnnouncementsCardProps {
  announcements?: Announcement[];
  className?: string;
}

// Sample data
const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Pemberitahuan Libur Semester",
    date: "29 Jul 2026",
    priority: "important",
    excerpt: "Libur semester ganjil akan dimulai pada tanggal 15 Juli 2026...",
  },
  {
    id: 2,
    title: "Rapat Orang Tua/Wali",
    date: "28 Jul 2026",
    priority: "normal",
    excerpt: "Rapat orang tua/wali siswa akan dilaksanakan pada hari Sabtu...",
  },
  {
    id: 3,
    title: "Pengingat Pengumpulan Nilai",
    date: "27 Jul 2026",
    priority: "urgent",
    excerpt: "Batas akhir pengumpulan nilai midterm adalah tanggal 30 Juni...",
  },
];

const priorityConfig = {
  normal: {
    icon: Info,
    bg: "bg-[var(--info-soft)]",
    text: "text-[var(--info)]",
  },
  important: {
    icon: Megaphone,
    bg: "bg-[var(--warning-soft)]",
    text: "text-[var(--warning)]",
  },
  urgent: {
    icon: AlertCircle,
    bg: "bg-[var(--danger-soft)]",
    text: "text-[var(--danger)]",
  },
};

export function MobileAnnouncementsCard({
  announcements = sampleAnnouncements,
  className,
}: MobileAnnouncementsCardProps) {
  return (
    <Card className={cn("p-0 overflow-hidden", className)} padding="none">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-light)]/60">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Pengumuman
          </h3>
        </div>
        <button className="text-[12px] text-[var(--primary)] font-medium flex items-center gap-0.5 hover:opacity-80 transition-opacity">
          Lihat Semua
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Announcement List */}
      <div className="divide-y divide-[var(--border-light)]/40">
        {announcements.map((announcement) => {
          const priority = announcement.priority || "normal";
          const config = priorityConfig[priority];
          const PriorityIcon = config.icon;

          return (
            <div
              key={announcement.id}
              className="px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Priority Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0",
                    config.bg
                  )}
                >
                  <PriorityIcon className={cn("w-4 h-4", config.text)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] line-clamp-1">
                    {announcement.title}
                  </p>
                  {announcement.excerpt && (
                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                      {announcement.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    {announcement.date}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
