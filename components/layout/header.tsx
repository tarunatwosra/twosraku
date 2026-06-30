"use client";

import { Bell, Search, Calendar, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      className={cn(
        "h-[80px] bg-white/[0.82] backdrop-blur-[12px] border-b border-[var(--border-light)]",
        "flex items-center justify-between px-8"
      )}
    >
      {/* Left Section - Title or Greeting */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="hidden lg:hidden w-[44px] h-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-[18px] transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {title ? (
          <div>
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)] leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-[13px] text-[var(--text-muted)]">{description}</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[20px] font-semibold text-[var(--text-primary)]">
                Selamat pagi, Budi Santoso
              </span>
              <Hand className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[13px] text-[var(--text-muted)]">
              Semangat mengelola sekolah hari ini!
            </p>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cari siswa, guru, kelas..."
            className={cn(
              "w-72 h-[44px] pl-11 pr-4 text-[14px]",
              "bg-[var(--surface-secondary)] border border-transparent",
              "rounded-[18px] focus:outline-none",
              "focus:border-[var(--border-focus)] focus:bg-white",
              "placeholder:text-[var(--text-muted)]",
              "transition-all duration-200"
            )}
          />
        </div>

        {/* Academic Year & Semester */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">
            2024/2025
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[13px] text-[var(--text-secondary)]">
            Semester Genap
          </span>
        </div>

        {/* Notification */}
        <button
          className={cn(
            "relative w-[44px] h-[44px] flex items-center justify-center",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--surface-hover)] rounded-[18px] transition-colors"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Date */}
        <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">
            {formattedDate}
          </span>
        </div>
      </div>
    </header>
  );
}
