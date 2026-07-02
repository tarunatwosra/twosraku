"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "holiday" | "activity" | "meeting";
}

interface CalendarWidgetProps {
  className?: string;
}

const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const events: CalendarEvent[] = [
  { id: "1", title: "UTS Dimulai", date: "2026-07-03", type: "exam" },
  { id: "2", title: "Libur Hari Raya", date: "2026-07-05", type: "holiday" },
  { id: "3", title: "Meeting Guru", date: "2026-07-07", type: "meeting" },
  { id: "4", title: "Kegiatan ekstrakurikuler", date: "2026-07-08", type: "activity" },
  { id: "5", title: "Pengumuman Hasil UTS", date: "2026-07-10", type: "activity" },
];

const eventTypeConfig = {
  exam: {
    color: "#EF4444",
    bg: "var(--danger-soft)",
    label: "Ujian",
  },
  holiday: {
    color: "#22c55e",
    bg: "var(--success-soft)",
    label: "Libur",
  },
  activity: {
    color: "#4F7CFF",
    bg: "var(--info-soft)",
    label: "Kegiatan",
  },
  meeting: {
    color: "#8b5cf6",
    bg: "bg-purple-50",
    label: "Rapat",
  },
};

// Generate calendar days for current month
function getCalendarDays() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return { days, currentMonth, currentYear, today: today.getDate() };
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const { days, currentMonth, currentYear, today } = getCalendarDays();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[16px] bg-[var(--info-soft)] flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-[var(--info)]" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Kalender
            </h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              {monthNames[currentMonth]} {currentYear}
            </p>
          </div>
        </div>
        <Link
          href="/kalender"
          className="text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat semua
        </Link>
      </div>

      {/* Calendar Grid */}
      <div className="mb-[16px]">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-medium text-[var(--text-muted)] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center text-[13px] rounded-[10px] transition-colors",
                day === null
                  ? "text-transparent"
                  : day === today
                  ? "bg-[var(--primary)] text-white font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-[12px]">
          Acara Mendatang
        </h4>
        <div className="space-y-[8px]">
          {events.slice(0, 3).map((event) => {
            const config = eventTypeConfig[event.type];
            const eventDate = new Date(event.date);
            const dayName = weekDays[eventDate.getDay()];

            return (
              <div
                key={event.id}
                className="flex items-center gap-[10px] p-[10px] rounded-[12px] hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex flex-col items-center justify-center"
                  style={{ backgroundColor: config.bg }}
                >
                  <span className="text-[10px] font-medium" style={{ color: config.color }}>
                    {dayName}
                  </span>
                  <span className="text-[14px] font-bold" style={{ color: config.color }}>
                    {eventDate.getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {config.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
