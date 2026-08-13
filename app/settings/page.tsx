"use client"

/**
 * Reading: Settings overview page untuk administrator sekolah
 * Bahasa visual: Card-based overview dengan quick access
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui"
import {
  Settings,
  Building2,
  GraduationCap,
  Palette,
  Users,
  QrCode,
  Info,
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

export default function SettingsPage() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) => pathname === href

  return (
    <div className="max-w-4xl space-y-6">
      {/* Welcome Card */}
      <Card className="p-8 border border-[var(--border-default)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
            <Settings className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Pengaturan Sistem</h2>
            <p className="text-sm text-[var(--text-muted)]">Twosraku</p>
          </div>
        </div>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-lg">
          Kelola semua konfigurasi aplikasi dari satu tempat. Pengaturan di sini menentukan
          bagaimana sistem berperilaku tanpa menyentuh data operasional.
        </p>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4">
        {mainSettings.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Card
                className={cn(
                  "p-5 transition-colors duration-200 cursor-pointer",
                  active
                    ? "ring-2 ring-[var(--primary)] bg-[var(--primary-soft)]"
                    : "hover:bg-[var(--surface-hover)]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      active
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-[var(--info)]" />
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)] mb-1">
              Akun Anda
            </p>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              {user?.role === "admin"
                ? "Sebagai administrator, Anda memiliki akses penuh ke semua pengaturan sistem."
                : "Hubungi administrator untuk mengubah pengaturan sistem."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
