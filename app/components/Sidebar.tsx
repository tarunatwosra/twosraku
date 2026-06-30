"use client";

import {
  Home,
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Calendar,
  Book,
  School,
  Briefcase,
  Package,
  Mail,
  Megaphone,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const academicMenu = [
  { icon: BookOpen, label: "Buku Induk", href: "#" },
  { icon: Users, label: "Data Siswa", href: "#" },
  { icon: ClipboardCheck, label: "Presensi Siswa", href: "#" },
  { icon: BarChart3, label: "Penilaian", href: "#" },
  { icon: Calendar, label: "Jadwal Pelajaran", href: "#" },
  { icon: Book, label: "Mata Pelajaran", href: "#" },
  { icon: School, label: "Kelas", href: "#" },
];

const administrationMenu = [
  { icon: Briefcase, label: "Guru & Staff", href: "#" },
  { icon: Package, label: "Inventaris", href: "#" },
  { icon: Mail, label: "Surat", href: "#" },
  { icon: Megaphone, label: "Pengumuman", href: "#" },
];

const reportMenu = [{ icon: FileText, label: "Laporan", href: "#" }];

const systemMenu = [{ icon: Settings, label: "Pengaturan", href: "#" }];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "AKADEMIK",
    "ADMINISTRASI",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderMenuSection = (
    title: string,
    items: { icon: typeof Home; label: string; href: string }[]
  ) => {
    const isExpanded = expandedSections.includes(title);

    return (
      <div className="mb-1">
        <button
          onClick={() => toggleSection(title)}
          className="flex items-center justify-between w-full px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          <span>{title}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        {isExpanded && (
          <nav className="mt-0.5 space-y-0.5">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-4 py-2 mx-1 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo & School Name */}
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800">SMA Negeri 1</h1>
            <p className="text-[11px] text-gray-400 -mt-0.5">Yogyakarta</p>
          </div>
        </div>

        {/* Dashboard Link */}
        <div className="px-2.5 py-3">
          <a
            href="#"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200"
          >
            <Home className="w-[18px] h-[18px]" />
            <span className="text-sm font-semibold">Dashboard</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="px-2 flex-1 overflow-y-auto">
          {renderMenuSection("AKADEMIK", academicMenu)}
          {renderMenuSection("ADMINISTRASI", administrationMenu)}
          {renderMenuSection("LAPORAN", reportMenu)}
          {renderMenuSection("SISTEM", systemMenu)}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
              BS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                Budi Santoso
              </p>
              <p className="text-[11px] text-gray-400">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </aside>
    </>
  );
}
