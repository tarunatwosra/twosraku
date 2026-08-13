"use client"

/**
 * Reading: General settings page untuk administrator
 * Bahasa visual: Clean form-based layout dengan sidebar
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/useSettings"
import { Save, RotateCcw, Globe, Clock, Monitor, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GeneralSettingsPage() {
  const { settings, updateGeneralSettings, resetSettings } = useSettings()
  const { general } = settings

  return (
    <div className="max-w-3xl space-y-6">
      {/* Info Banner */}
      <Card className="p-5 bg-[var(--primary-soft)] border-l-4 border-l-[var(--primary)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              Pengaturan Dasar
            </p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              Konfigurasi ini berlaku secara global dan mempengaruhi seluruh perilaku aplikasi.
              Perubahan akan disimpan otomatis.
            </p>
          </div>
        </div>
      </Card>

      {/* Application Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Monitor className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Aplikasi</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Identitas dan tampilan aplikasi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Nama Aplikasi
            </label>
            <Input
              value={general.appName}
              onChange={(e) =>
                updateGeneralSettings({ appName: e.target.value })
              }
              placeholder="Nama aplikasi"
              className="h-11"
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Tampil di judul halaman dan header
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Nama Singkat
            </label>
            <Input
              value={general.appShortName}
              onChange={(e) =>
                updateGeneralSettings({ appShortName: e.target.value })
              }
              placeholder="Nama singkat"
              className="h-11"
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Untuk space terbatas
            </p>
          </div>
        </div>
      </Card>

      {/* Regional Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Regional</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Zona waktu, format tanggal dan angka
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Zona Waktu
            </label>
            <div className="relative">
              <select
                value={general.timezone}
                onChange={(e) =>
                  updateGeneralSettings({ timezone: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-[18px]",
                  "text-[14px] text-[var(--text-primary)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:border-[var(--primary)]"
                )}
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Format Tanggal
            </label>
            <div className="relative">
              <select
                value={general.dateFormat}
                onChange={(e) =>
                  updateGeneralSettings({ dateFormat: e.target.value as any })
                }
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-[18px]",
                  "text-[14px] text-[var(--text-primary)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:border-[var(--primary)]"
                )}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Format Waktu
            </label>
            <div className="relative">
              <select
                value={general.timeFormat}
                onChange={(e) =>
                  updateGeneralSettings({ timeFormat: e.target.value as any })
                }
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-[18px]",
                  "text-[14px] text-[var(--text-primary)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:border-[var(--primary)]"
                )}
              >
                <option value="24h">24 Jam (14:30)</option>
                <option value="12h">12 Jam (2:30 PM)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Mata Uang
            </label>
            <div className="relative">
              <select
                value={general.currency || "IDR"}
                onChange={(e) =>
                  updateGeneralSettings({ currency: e.target.value })
                }
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-[18px]",
                  "text-[14px] text-[var(--text-primary)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:border-[var(--primary)]"
                )}
              >
                <option value="IDR">Rupiah (IDR)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Session and Display Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Sesi dan Tampilan</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Keamanan dan preferensi tampilan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Batas Waktu Sesi
            </label>
            <div className="flex items-center gap-3">
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
                className="h-11 w-28 text-center"
              />
              <span className="text-[13px] text-[var(--text-muted)]">menit</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Sesi berakhir tanpa aktivitas (5-120 menit)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Jumlah Baris Default
            </label>
            <div className="relative">
              <select
                value={general.defaultPageSize}
                onChange={(e) =>
                  updateGeneralSettings({
                    defaultPageSize: parseInt(e.target.value),
                  })
                }
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-default)]",
                  "rounded-[18px]",
                  "text-[14px] text-[var(--text-primary)]",
                  "transition-all duration-200",
                  "focus:outline-none focus:border-[var(--primary)]"
                )}
              >
                <option value="10">10 baris</option>
                <option value="25">25 baris</option>
                <option value="50">50 baris</option>
                <option value="100">100 baris</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Default untuk tabel data
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={resetSettings}
          className="gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <RotateCcw className="w-4 h-4" />
          Reset ke Default
        </Button>
        <Button className="gap-2 h-11 px-6">
          <Save className="w-4 h-4" />
          Simpan Perubahan
        </Button>
      </div>
    </div>
  )
}
