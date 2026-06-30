"use client";

import { Clock, BookOpen, User, MapPin, ChevronRight } from "lucide-react";
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

export default function ScheduleList() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Jadwal Berikutnya</h3>
        <a
          href="#"
          className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          Lihat semua
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-2">
        {schedules.map((schedule, index) => (
          <div
            key={schedule.id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {/* Number Badge */}
            <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0 w-[88px]">
              <Clock className="w-3 h-3" />
              <span>
                {schedule.time} - {schedule.endTime}
              </span>
            </div>

            {/* Subject & Class */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 truncate">
                  {schedule.subject}
                </span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded font-medium flex-shrink-0">
                  {schedule.class}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                <span className="flex items-center gap-0.5">
                  <User className="w-2.5 h-2.5" />
                  {schedule.teacher}
                </span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {schedule.room}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="flex items-center justify-center gap-1 mt-3 py-2 text-xs font-medium text-blue-500 hover:text-blue-600 border border-blue-100 hover:border-blue-200 rounded-lg transition-colors"
      >
        Lihat semua jadwal
        <ChevronRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
