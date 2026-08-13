"use client"

/**
 * Reading: Settings layout dengan sidebar navigation
 * Bahasa visual: Sidebar + content layout
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { AppShell } from "@/components/layout"
import { SettingsSidebar } from "../components/settings/settings-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell title="Pengaturan" description="Konfigurasi aplikasi">
      <div className="flex gap-6 max-w-7xl">
        {/* Left Sidebar */}
        <SettingsSidebar />

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </AppShell>
  )
}
