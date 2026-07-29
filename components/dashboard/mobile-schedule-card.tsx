"use client";

import { Card } from "@/components/ui";
import { CalendarDays, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  time: string;
  subject: string;
  class: string;
  teacher?: string;
}

interface MobileScheduleCardProps {
  schedules?: ScheduleItem[];
  className?: string;
}

// Sample data for demonstration
const sampleSchedules: ScheduleItem[] = [
  {
    time: "07:00 - 07:45",
    subject: "Matematika",
    class: "X IPA 1",
    teacher: "Budi Santoso, S.Pd.",
  },
  {
    time: "07:45 - 08:30",
    subject: "Bahasa Indonesia",
    class: "X IPA 1",
    teacher: "Siti Aminah, S.Pd.",
  },
  {
    time: "08:30 - 09:15",
    subject: "Fisika",
    class: "X IPA 1",
    teacher: "Ahmad Dahlan, S.Pd.",
  },
  {
    time: "09:15 - 10:00",
    subject: "Istirahat",
    class: "",
  },
  {
    time: "10:15 - 11:00",
    subject: "Kimia",
    class: "X IPA 1",
    teacher: "Dewi Lestari, S.Pd.",
  },
];

export function MobileScheduleCard({
  schedules = sampleSchedules,
  className,
}: MobileScheduleCardProps) {
  return (
    <Card className={cn("p-0 overflow-hidden", className)} padding="none">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-light)]/60">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Jadwal Hari Ini
          </h3>
        </div>
        <button className="text-[12px] text-[var(--primary)] font-medium flex items-center gap-0.5 hover:opacity-80 transition-opacity">
          Lihat Semua
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Schedule List */}
      <div className="divide-y divide-[var(--border-light)]/40">
        {schedules.map((schedule, index) => {
          const isBreak = schedule.subject === "Istirahat";
          return (
            <div
              key={index}
              className={cn(
                "px-4 py-3 flex items-center gap-3",
                isBreak && "bg-[var(--surface-secondary)]"
              )}
            >
              {/* Time */}
              <div className="flex items-center gap-1.5 w-[85px] flex-shrink-0">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[11px] text-[var(--text-muted)]">
                  {schedule.time}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[13px] font-medium truncate",
                    isBreak
                      ? "text-[var(--text-muted)]"
                      : "text-[var(--text-primary)]"
                  )}
                >
                  {schedule.subject}
                </p>
                {schedule.class && (
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {schedule.class}
                  </p>
                )}
              </div>

              {/* Status indicator for current time */}
              {index === 1 && !isBreak && (
                <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
