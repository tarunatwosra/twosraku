"use client"

import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/useSettings"
import { Save, RotateCcw } from "lucide-react"

export default function GeneralSettingsPage() {
  const { settings, updateGeneralSettings, resetSettings } = useSettings()
  const { general } = settings

  const handleSave = () => {
    // Settings are auto-saved by the hook
  }

  return (
    <AppShell title="Pengaturan Umum" description="Konfigurasi umum aplikasi">
      <div className="max-w-2xl">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
            Pengaturan Umum
          </h2>

          <div className="space-y-6">
            {/* App Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Nama Aplikasi
              </label>
              <Input
                value={general.appName}
                onChange={(e) =>
                  updateGeneralSettings({ appName: e.target.value })
                }
                placeholder="Nama aplikasi"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Nama ini akan ditampilkan di judul halaman dan logo
              </p>
            </div>

            {/* Short Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Nama Singkat
              </label>
              <Input
                value={general.appShortName}
                onChange={(e) =>
                  updateGeneralSettings({ appShortName: e.target.value })
                }
                placeholder="Nama singkat"
              />
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Zona Waktu
              </label>
              <select
                value={general.timezone}
                onChange={(e) =>
                  updateGeneralSettings({ timezone: e.target.value })
                }
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Format Tanggal
              </label>
              <select
                value={general.dateFormat}
                onChange={(e) =>
                  updateGeneralSettings({ dateFormat: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
              </select>
            </div>

            {/* Time Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Format Waktu
              </label>
              <select
                value={general.timeFormat}
                onChange={(e) =>
                  updateGeneralSettings({ timeFormat: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="24h">24 Jam (14:30)</option>
                <option value="12h">12 Jam (2:30 PM)</option>
              </select>
            </div>

            {/* Session Timeout */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Batas Waktu Sesi (menit)
              </label>
              <Input
                type="number"
                value={general.sessionTimeout}
                onChange={(e) =>
                  updateGeneralSettings({
                    sessionTimeout: parseInt(e.target.value) || 30,
                  })
                }
                min={5}
                max={120}
              />
              <p className="text-xs text-[var(--text-muted)]">
                Sesi akan berakhir setelah tidak ada aktivitas selama waktu ini
              </p>
            </div>

            {/* Default Page Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Jumlah Baris Default
              </label>
              <select
                value={general.defaultPageSize}
                onChange={(e) =>
                  updateGeneralSettings({
                    defaultPageSize: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="10">10 baris</option>
                <option value="25">25 baris</option>
                <option value="50">50 baris</option>
                <option value="100">100 baris</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset ke Default
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
