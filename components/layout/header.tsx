"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, Calendar, Hand, Command, LogOut, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"
import { useCommand } from "@/hooks/useCommand"

interface HeaderProps {
  title?: string
  description?: string
  onMenuClick?: () => void
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const { academicYears, semesters, activeAcademicYear, activeSemester } = settings.academic

  const activeYear = academicYears.find((y) => y.id === activeAcademicYear)
  const activeSem = semesters.find((s) => s.id === activeSemester)
  const { open } = useCommand()

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Selamat pagi"
    if (hour < 18) return "Selamat siang"
    return "Selamat malam"
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

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
                {getGreeting()}, {user?.name?.split(" ")[0] || "User"}
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
        {/* Global Search - Command Palette Trigger */}
        <button
          onClick={open}
          className={cn(
            "relative hidden md:flex items-center gap-2",
            "h-[44px] px-4",
            "bg-[var(--surface-secondary)] border border-transparent",
            "rounded-[18px] transition-all duration-200",
            "hover:border-[var(--border)] hover:bg-white",
            "group"
          )}
        >
          <Search className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
          <span className="text-[14px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
            Cari atau ketik perintah...
          </span>
          <kbd className="ml-4 px-2 py-1 text-xs font-medium bg-white border border-[var(--border)] rounded text-[var(--text-muted)]">
            Ctrl+K
          </kbd>
        </button>

        {/* Academic Year & Semester */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">
            {activeYear?.name || "2025/2026"}
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[13px] text-[var(--text-secondary)]">
            {activeSem?.name || "Semester Ganjil"}
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

        {/* User Menu */}
        <div className="relative group">
          <button
            className={cn(
              "flex items-center gap-3 h-[44px] px-3",
              "hover:bg-[var(--surface-hover)] rounded-[18px] transition-colors"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-[var(--text-muted)] capitalize">
                {user?.role?.replace("_", " ") || "guest"}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          <div className={cn(
            "absolute right-0 top-full mt-2 w-56",
            "bg-white rounded-xl shadow-lg border border-[var(--border)]",
            "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
            "transition-all duration-200 z-50"
          )}>
            <div className="p-3 border-b border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {user?.email}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Pengaturan
              </Link>
              <Link
                href="/settings/users"
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Profil Saya
              </Link>
            </div>
            <div className="p-2 border-t border-[var(--border)]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">
            {formattedDate}
          </span>
        </div>
      </div>
    </header>
  )
}
