"use client";

import { Clock, BookOpen, User, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";
import { Schedule } from "../types";

const schedules: Schedule[] = [
  {
    id: "1",
    time: "08.00",
    endTime: "09.30",
    subject: "Matematika",
    class: "XII IPA 1",
    teacher: "Pak DWI",
    room: "Ruang 203",
  },
  {
    id: "2",
    time: "09.45",
    endTime: "11.15",
    subject: "Bahasa Indonesia",
    class: "XI IPS 2",
    teacher: "Bu Rina",
    room: "Ruang 105",
  },
  {
    id: "3",
    time: "12.30",
    endTime: "14.00",
    subject: "Fisika",
    class: "XII IPA 1",
    teacher: "Pak Andi",
    room: "Ruang 204",
  },
  {
    id: "4",
    time: "14.15",
    endTime: "15.45",
    subject: "Kimia",
    class: "XI IPA 1",
    teacher: "Bu Sari",
    room: "Ruang 202",
  },
];

export function ScheduleList() {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Jadwal Berikutnya
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
        {schedules.map((schedule, index) => (
          <div
            key={schedule.id}
            className="flex items-center gap-[12px] p-[12px] rounded-[18px] bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            {/* Number Badge */}
            <div className="w-8 h-8 rounded-[12px] bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[13px] flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-[12px] text-[var(--text-muted)] flex-shrink-0 w-[100px]">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {schedule.time} - {schedule.endTime}
              </span>
            </div>

            {/* Subject & Class */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[10px]">
                <BookOpen className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                <span className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                  {schedule.subject}
                </span>
                <span className="px-2 py-0.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[11px] font-medium rounded-full flex-shrink-0">
                  {schedule.class}
                </span>
              </div>
              <div className="flex items-center gap-[16px] mt-1 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {schedule.teacher}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {schedule.room}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="flex items-center justify-center gap-1 mt-[16px] py-[10px] text-[13px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] border border-[var(--border-light)] hover:border-[var(--border-default)] rounded-[18px] transition-colors"
      >
        Lihat semua jadwal
        <ChevronRight className="w-4 h-4" />
      </a>
    </Card>
  );
}
