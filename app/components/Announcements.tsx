"use client";

import { Megaphone, ChevronRight, Clock } from "lucide-react";
import { Announcement } from "../types";

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

export default function Announcements() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Pengumuman Terbaru</h3>
        <a
          href="#"
          className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          Lihat semua
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-2">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-medium text-gray-700 truncate group-hover:text-blue-500 transition-colors">
                  {announcement.title}
                </h4>
                {announcement.isNew && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-semibold rounded flex-shrink-0">
                    Baru
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                <Clock className="w-2.5 h-2.5" />
                <span>{announcement.date}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1.5 group-hover:text-blue-400 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
