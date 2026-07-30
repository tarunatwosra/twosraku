"use client"

import { MobileHeader } from "@/components/layout/mobile-header"

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen-mobile bg-[var(--background-primary)]">
      {/* Mobile Header - Fixed Top */}
      <MobileHeader />

      {/* Main Content */}
      <main className="pt-[56px] pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center px-4">
        <p className="text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} Twosraku • Sistem Informasi Sekolah
        </p>
      </footer>
    </div>
  )
}
