"use client";

import { useSettings } from "@/hooks/useSettings";
import { GraduationCap, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  showGreeting?: boolean;
}

export function MobileHeader({ showGreeting = false }: MobileHeaderProps) {
  const { settings } = useSettings();

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Get short date format
  const getShortDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const academicYear = settings.academic.academicYears.find(
    (y) => y.id === settings.academic.activeAcademicYear
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] glass border-b border-[var(--border-light)]/60">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Left - Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-[var(--primary)] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
            {settings.school.name}
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

      {/* Greeting Section - Only show if showGreeting is true */}
      {showGreeting && (
        <div className="px-4 pb-3">
          <p className="text-[14px] text-[var(--text-secondary)]">
            {getGreeting()}, <span className="font-semibold text-[var(--text-primary)]">Administrator</span>
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] text-[var(--text-muted)]">
              {getShortDate()}
            </span>
            <span className="text-[12px] text-[var(--text-muted)]">•</span>
            <span className="text-[12px] text-[var(--primary)] font-medium">
              {academicYear?.name || "2025/2026"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
