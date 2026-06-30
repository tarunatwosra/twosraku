"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookUser,
  Users,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  BookOpen,
  School,
  Briefcase,
  Package,
  Mail,
  Megaphone,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  GraduationCap,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "AKADEMIK",
    items: [
      { icon: BookUser, label: "Buku Induk", href: "/buku-induk" },
      { icon: Users, label: "Data Siswa", href: "/siswa" },
      { icon: ClipboardCheck, label: "Presensi Siswa", href: "/presensi" },
      { icon: BarChart3, label: "Penilaian", href: "/penilaian" },
      { icon: CalendarDays, label: "Jadwal Pelajaran", href: "/jadwal" },
      { icon: BookOpen, label: "Mata Pelajaran", href: "/mapel" },
      { icon: School, label: "Kelas", href: "/kelas" },
    ],
  },
  {
    title: "ADMINISTRASI",
    items: [
      { icon: Briefcase, label: "Guru & Staff", href: "/guru-staff" },
      { icon: Package, label: "Inventaris", href: "/inventaris" },
      { icon: Mail, label: "Surat", href: "/surat" },
      { icon: Megaphone, label: "Pengumuman", href: "/pengumuman" },
    ],
  },
  {
    title: "LAPORAN",
    items: [{ icon: FileText, label: "Laporan", href: "/laporan" }],
  },
  {
    title: "SISTEM",
    items: [{ icon: Settings, label: "Pengaturan", href: "/pengaturan" }],
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
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

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        `
        fixed top-0 left-0 z-[var(--z-sidebar)]
        h-screen
        bg-white/[0.82] backdrop-blur-[12px]
        border-r border-[var(--border-light)]
        transition-all duration-300 ease-out
        flex flex-col
        `,
        isCollapsed ? "w-[88px]" : "w-[280px]"
      )}
      style={{
        margin: "24px",
        borderRadius: "32px",
        height: "calc(100vh - 48px)",
      }}
    >
      {/* Logo & School Name */}
      <div className="h-[72px] flex items-center gap-3 px-6 border-b border-[var(--border-light)]">
        <div
          className={cn(
            "w-10 h-10 rounded-[12px] bg-[var(--primary)] flex items-center justify-center shadow-md flex-shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight">
              SMA Negeri 1
            </h1>
            <p className="text-[12px] text-[var(--text-muted)]">Yogyakarta</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <div className="px-3 py-3 border-b border-[var(--border-light)]">
        <button
          onClick={() => onCollapsedChange?.(!isCollapsed)}
          className={cn(
            `
            flex items-center gap-3 px-4 py-2.5 w-full
            rounded-[18px]
            text-[14px] font-medium
            text-[var(--text-secondary)]
            hover:bg-[var(--surface-hover)]
            hover:text-[var(--text-primary)]
            transition-all duration-200
            `,
            isCollapsed && "justify-center px-0"
          )}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto py-2">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);
          return (
            <div key={section.title} className="mb-2">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                </button>
              )}
              {isExpanded && (
                <div className="space-y-1 mt-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        `
                        flex items-center gap-3 px-4 py-2.5 mx-1
                        rounded-[18px]
                        text-[14px]
                        transition-all duration-200
                        `,
                        isActive(item.href)
                          ? "bg-[var(--surface-active)] text-[var(--primary)] font-medium"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
                        isCollapsed && "justify-center px-2 mx-0"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[var(--border-light)]">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-[18px] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-10 h-10 rounded-[18px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center font-semibold text-[14px] flex-shrink-0">
            BS
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                  Budi Santoso
                </p>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Administrator
                </p>
              </div>
              <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
