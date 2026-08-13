"use client"

/**
 * Reading: Settings sidebar navigation component
 * Bahasa visual: Clean sidebar dengan grouped navigation
 * Dial: ENERGI 2 / RITME 1 / GERAK 1
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Building2,
  GraduationCap,
  Palette,
  Users,
  Bell,
  Shield,
  Database,
  FileText,
  ChevronRight,
  QrCode,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainSettings = [
  {
    title: "Umum",
    description: "Nama aplikasi, zona waktu, format",
    href: "/settings/general",
    icon: Settings,
  },
  {
    title: "Profil Sekolah",
    description: "NPSN, alamat, logo, visi misi",
    href: "/settings/school",
    icon: Building2,
  },
  {
    title: "Akademik",
    description: "Tahun ajaran, penilaian, jurusan",
    href: "/settings/academic",
    icon: GraduationCap,
  },
  {
    title: "Registrasi",
    description: "QR code, registrasi mandiri",
    href: "/settings/registration",
    icon: QrCode,
  },
]

const appearanceSettings = [
  {
    title: "Tampilan",
    description: "Tema, warna, kepadatan",
    href: "/settings/appearance",
    icon: Palette,
  },
]

const userManagement = [
  {
    title: "Pengguna",
    description: "Manajemen akun & akses",
    href: "/settings/users",
    icon: Users,
  },
]

const systemSettings = [
  {
    title: "Notifikasi",
    description: "Pengaturan notifikasi",
    href: "/settings/notifications",
    icon: Bell,
    disabled: true,
  },
  {
    title: "Keamanan",
    description: "Sandi, sesi, 2FA",
    href: "/settings/security",
    icon: Shield,
    disabled: true,
  },
  {
    title: "Backup",
    description: "Cadangan database",
    href: "/settings/backup",
    icon: Database,
    disabled: true,
  },
  {
    title: "Template",
    description: "Template laporan",
    href: "/settings/templates",
    icon: FileText,
    disabled: true,
  },
]

interface NavItem {
  title: string
  description: string
  href: string
  icon: React.ElementType
  disabled?: boolean
}

export function SettingsSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) => pathname === href

  const NavItem = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const disabled = item.disabled

    if (disabled) {
      return (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">
              {item.title}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] truncate">
              {item.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium px-2.5">
            Segera
          </Badge>
        </div>
      )
    }

    return (
      <Link href={item.href}>
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "transition-colors duration-200",
            active
              ? "bg-[var(--primary)] text-white"
              : "hover:bg-[var(--surface-hover)]"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "transition-colors duration-200",
              active
                ? "bg-white/20 text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-[14px] font-medium",
                active ? "text-white" : "text-[var(--text-primary)]"
              )}
            >
              {item.title}
            </p>
            <p
              className={cn(
                "text-[12px] truncate",
                active ? "text-white/70" : "text-[var(--text-muted)]"
              )}
            >
              {item.description}
            </p>
          </div>
          <ChevronRight
            className={cn(
              "w-4 h-4",
              active ? "text-white" : "text-[var(--text-muted)]"
            )}
          />
        </div>
      </Link>
    )
  }

  return (
    <div className="w-80 flex-shrink-0">
      {/* User Profile Card */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {user?.role === "admin" && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--warning)] flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] truncate">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] truncate">
              @{user?.username || "admin"}
            </p>
            <Badge
              variant={user?.role === "admin" ? "default" : "secondary"}
              className="mt-1.5 text-[10px] capitalize"
            >
              {user?.role || "guest"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Settings Navigation */}
      <div className="space-y-6">
        {/* Main Settings */}
        <div>
          <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Utama
          </h3>
          <div className="space-y-1">
            {mainSettings.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Tampilan
          </h3>
          <div className="space-y-1">
            {appearanceSettings.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* User Management */}
        <div>
          <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Pengguna
          </h3>
          <div className="space-y-1">
            {userManagement.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* System Settings */}
        <div>
          <h3 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
            Sistem
          </h3>
          <div className="space-y-1">
            {systemSettings.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
