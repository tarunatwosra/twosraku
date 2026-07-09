"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { AppShell } from "@/components/layout"
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
  Globe,
  Calendar,
  ChevronRight,
  QrCode,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  {
    title: "Umum",
    description: "Nama aplikasi, zona waktu, format tanggal",
    href: "/settings/general",
    icon: <Settings className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Profil Sekolah",
    description: "Nama sekolah, NPSN, alamat, logo",
    href: "/settings/school",
    icon: <Building2 className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Akademik",
    description: "Tahun ajaran, semester, sistem penilaian",
    href: "/settings/academic",
    icon: <GraduationCap className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Registrasi Siswa",
    description: "Pengaturan registrasi mandiri via QR",
    href: "/settings/registration",
    icon: <QrCode className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Tampilan",
    description: "Tema, warna, kepadatan",
    href: "/settings/appearance",
    icon: <Palette className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Pengguna",
    description: "Manajemen akun pengguna",
    href: "/settings/users",
    icon: <Users className="w-5 h-5" />,
    badge: null,
  },
]

const systemNav = [
  {
    title: "Notifikasi",
    description: "Pengaturan notifikasi",
    href: "/settings/notifications",
    icon: <Bell className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Keamanan",
    description: "Kebijakan sandi, sesi, 2FA",
    href: "/settings/security",
    icon: <Shield className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Backup",
    description: "Cadangan database",
    href: "/settings/backup",
    icon: <Database className="w-5 h-5" />,
    badge: null,
  },
  {
    title: "Template",
    description: "Template laporan dan dokumen",
    href: "/settings/templates",
    icon: <FileText className="w-5 h-5" />,
    badge: null,
  },
]

export default function SettingsPage() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <AppShell title="Pengaturan" description="Konfigurasi aplikasi">
      <div className="max-w-4xl">
        {/* User Info */}
        <Card className="p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--text-primary)]">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              @{user?.username || "user"} • {user?.role || "guest"}
            </p>
          </div>
          <Badge variant="neutral">{user?.role}</Badge>
        </Card>

        {/* Settings Navigation */}
        <div className="space-y-6">
          {/* Main Settings */}
          <div>
            <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Pengaturan Utama
            </h2>
            <div className="grid gap-3">
              {settingsNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card
                    className={cn(
                      "p-4 hover:border-[var(--primary)] transition-colors cursor-pointer",
                      pathname === item.href && "border-[var(--primary)] bg-[var(--primary-soft)]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          pathname === item.href
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[var(--text-primary)]">
                            {item.title}
                          </p>
                          {item.badge && (
                            <Badge variant="default" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div>
            <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Sistem
            </h2>
            <div className="grid gap-3">
              {systemNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card
                    className={cn(
                      "p-4 hover:border-[var(--primary)] transition-colors cursor-pointer opacity-60",
                      pathname === item.href && "border-[var(--primary)] bg-[var(--primary-soft)]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          pathname === item.href
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[var(--text-primary)]">
                            {item.title}
                          </p>
                          {item.badge && (
                            <Badge variant="default" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            Segera
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
