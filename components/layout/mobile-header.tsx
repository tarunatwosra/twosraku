"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { GraduationCap, Bell } from "lucide-react";

// Page title mapping for mobile routes
const PAGE_TITLES: Record<string, string> = {
  "/mobile": "Dashboard Twosraku",
  "/mobile/buku-induk": "Buku Induk Taruna",
  "/mobile/presensi": "Presensi Taruna",
  "/mobile/presensi/input": "Input Presensi",
  "/mobile/penilaian": "Penilaian",
  "/mobile/rekap": "Rekap Presensi",
  "/mobile/more": "Menu",
};

export function MobileHeader() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Get page title from pathname or default to school name
  const getPageTitle = () => {
    // Check exact match first
    if (PAGE_TITLES[pathname]) {
      return PAGE_TITLES[pathname];
    }
    // Check partial match for nested routes
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (pathname.startsWith(path + "/") || pathname === path) {
        return title;
      }
    }
    // Default to school name if no match
    return settings.school.name;
  };

  const pageTitle = getPageTitle();

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] bg-white/50 backdrop-blur-sm border-b border-[var(--border-light)]/60">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Left - Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-[var(--primary)] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
            {pageTitle}
          </span>
        </div>

        {/* Right - Notifications */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-[14px] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)] transition-colors relative"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5 text-[var(--icon-default)]" />
          {/* Notification badge */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </button>
      </div>
    </header>
  );
}
