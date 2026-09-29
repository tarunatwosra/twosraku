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
    <header
      className="fixed top-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-md border-b border-[var(--border-light)]"
      role="banner"
    >
      {/* Safe area padding for notched devices */}
      <div
        className="px-4 h-14 flex items-center justify-between pt-[env(safe-area-inset-top,0px)]"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
        {/* Left - Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[14px] bg-[var(--primary)] flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-[16px] font-bold text-[var(--text-primary)]">
            {pageTitle}
          </span>
        </div>

        {/* Right - Notifications */}
        <button
          className={cn(
            "w-11 h-11 flex items-center justify-center",
            "rounded-[14px]",
            "hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)]",
            "transition-colors relative",
            // Touch target: 44px minimum
            "min-w-[44px] min-h-[44px]"
          )}
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
          {/* Notification badge */}
          <span
            className="absolute top-3 right-3 w-2.5 h-2.5 bg-[var(--danger)] rounded-full"
            aria-label="Ada notifikasi baru"
          />
        </button>
      </div>
    </header>
  );
}

// Helper function for className
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
