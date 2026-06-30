"use client";

import { Megaphone, ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui";

interface Announcement {
  id: string;
  title: string;
  date: string;
  isNew: boolean;
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Libur Kenaikan Isa Almas",
    date: "15 Mei 2024",
    isNew: true,
  },
  {
    id: "2",
    title: "Pendaftaran Extrakurikuler Baru 2024",
    date: "10 Mei 2024",
    isNew: true,
  },
  {
    id: "3",
    title: "Jadwal Ujian Tengah Semester Genap",
    date: "5 Mei 2024",
    isNew: false,
  },
];

export function Announcements() {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Pengumuman Terbaru
        </h3>
        <a
          href="#"
          className="flex items-center gap-0.5 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat semua
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-[12px]">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex items-start gap-[12px] p-[12px] rounded-[18px] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-[16px] bg-[var(--warning-soft)] flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[10px]">
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary)] transition-colors">
                  {announcement.title}
                </h4>
                {announcement.isNew && (
                  <span className="px-2 py-0.5 bg-[var(--danger-soft)] text-[var(--danger)] text-[11px] font-semibold rounded-full flex-shrink-0">
                    Baru
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[12px] text-[var(--text-muted)]">
                <Clock className="w-3 h-3" />
                <span>{announcement.date}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-1.5 group-hover:text-[var(--primary)] transition-colors" />
          </div>
        ))}
      </div>
    </Card>
  );
}
