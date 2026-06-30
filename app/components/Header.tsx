"use client";

import { Bell, Search, Menu, Calendar, Hand } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formattedDate = "Selasa, 21 Mei 2024";

  return (
    <header className="h-[68px] bg-white border-b border-gray-100 flex items-center justify-between px-5">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg font-semibold text-gray-800">
              Selamat pagi, Budi Santoso
            </span>
            <Hand className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-400">
            Semangat mengelola sekolah hari ini!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari siswa, guru, kelas, mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>
        </div>

        {/* Mobile Search Button */}
        <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Date */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
