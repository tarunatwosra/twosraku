"use client";

import { useSettings } from "@/hooks/useSettings";
import { GraduationCap, Menu, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { settings } = useSettings();

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Get current date
  const getFormattedDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const academicYear = settings.academic.academicYears.find(
    (y) => y.id === settings.academic.activeAcademicYear
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] glass border-b border-[var(--border-light)]/60">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left - Menu Button */}
        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-[14px] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)] transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5 text-[var(--icon-default)]" />
        </button>

        {/* Center - Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-[var(--primary)] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="hidden">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              {settings.school.name}
            </span>
          </div>
        </div>

        {/* Right - Notifications */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-[14px] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)] transition-colors relative"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5 text-[var(--icon-default)]" />
          {/* Notification badge */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </button>
      </div>

      {/* Greeting Section */}
      <div className="px-4 pb-3">
        <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">
          {getGreeting()}, Administrator
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[12px] text-[var(--text-muted)]">
            {getFormattedDate()}
          </span>
          <span className="text-[12px] text-[var(--text-muted)]">•</span>
          <span className="text-[12px] text-[var(--primary)] font-medium">
            {academicYear?.name || "2025/2026"}
          </span>
        </div>
      </div>
    </header>
  );
}
