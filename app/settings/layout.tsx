"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const breadcrumbMap: Record<string, string> = {
  general: "Umum",
  school: "Profil Sekolah",
  academic: "Akademik",
  appearance: "Tampilan",
  users: "Pengguna",
  notifications: "Notifikasi",
  security: "Keamanan",
  backup: "Backup",
  templates: "Template",
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Generate breadcrumbs
  const breadcrumbs = segments.slice(1).map((segment, index) => {
    const path = "/" + segments.slice(1, index + 2).join("/")
    const label = breadcrumbMap[segment] || segment
    return { path, label }
  })

  return (
    <>
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <div className="mb-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/settings"
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-[var(--text-secondary)] font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
      {children}
    </>
  )
}
