"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/hooks/useSettings"
import { Save, Sun, Moon, Monitor, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const themes = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
]

const densities = [
  { value: "compact", label: "Padat", description: "Lebih banyak konten" },
  { value: "normal", label: "Normal", description: "Setara" },
  { value: "comfortable", label: "Lega", description: "Lebih spasi" },
]

const sidebarStyles = [
  { value: "expanded", label: "Luas", description: "Selalu tampilkan label" },
  { value: "collapsed", label: "Ringkas", description: "Hanya ikon" },
  { value: "floating", label: "Mengambang", description: "Sidebar mengambang" },
]

export default function AppearanceSettingsPage() {
  const { settings, updateAppearanceSettings } = useSettings()
  const { appearance } = settings

  return (
    <AppShell title="Pengaturan Tampilan" description="Konfigurasi tampilan aplikasi">
      <div className="max-w-2xl space-y-6">
        {/* Theme */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Tema
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Pilih tampilan yang sesuai dengan preferensi Anda
          </p>

          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() =>
                  updateAppearanceSettings({ theme: theme.value as any })
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all",
                  appearance.theme === theme.value
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    appearance.theme === theme.value
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                  )}
                >
                  <theme.icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-body-sm font-medium",
                    appearance.theme === theme.value
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)]"
                  )}
                >
                  {theme.label}
                </span>
                {appearance.theme === theme.value && (
                  <Check className="w-4 h-4 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Accent Color */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Warna Aksen
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Pilih warna utama untuk elemen UI
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "#3B82F6", // Blue
              "#10B981", // Green
              "#F59E0B", // Amber
              "#EF4444", // Red
              "#8B5CF6", // Purple
              "#EC4899", // Pink
              "#06B6D4", // Cyan
              "#F97316", // Orange
            ].map((color) => (
              <button
                key={color}
                onClick={() => updateAppearanceSettings({ accentColor: color })}
                className={cn(
                  "w-10 h-10 rounded-full transition-transform hover:scale-110",
                  appearance.accentColor === color && "ring-2 ring-offset-2 ring-[var(--text-primary)]"
                )}
                style={{ backgroundColor: color }}
              >
                {appearance.accentColor === color && (
                  <Check className="w-5 h-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Density */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Kepadatan Tampilan
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Atur jarak antar elemen
          </p>

          <div className="space-y-3">
            {densities.map((density) => (
              <button
                key={density.value}
                onClick={() =>
                  updateAppearanceSettings({ density: density.value as any })
                }
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors",
                  appearance.density === density.value
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                )}
              >
                <div className="text-left">
                  <p
                    className={cn(
                      "font-medium",
                      appearance.density === density.value
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {density.label}
                  </p>
                  <p className="text-body-sm text-[var(--text-muted)]">
                    {density.description}
                  </p>
                </div>
                {appearance.density === density.value && (
                  <Check className="w-5 h-5 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Sidebar Style */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Gaya Sidebar
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Pilih tampilan sidebar navigasi
          </p>

          <div className="space-y-3">
            {sidebarStyles.map((style) => (
              <button
                key={style.value}
                onClick={() =>
                  updateAppearanceSettings({ sidebarStyle: style.value as any })
                }
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors",
                  appearance.sidebarStyle === style.value
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                )}
              >
                <div className="text-left">
                  <p
                    className={cn(
                      "font-medium",
                      appearance.sidebarStyle === style.value
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {style.label}
                  </p>
                  <p className="text-body-sm text-[var(--text-muted)]">
                    {style.description}
                  </p>
                </div>
                {appearance.sidebarStyle === style.value && (
                  <Check className="w-5 h-5 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Card Radius */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Kelengkungan Kartu
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Atur tingkat kelengkungan sudut kartu
          </p>

          <div className="space-y-4">
            <input
              type="range"
              min={0}
              max={24}
              value={appearance.cardRadius}
              onChange={(e) =>
                updateAppearanceSettings({
                  cardRadius: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-[var(--text-muted)]">Kotak</span>
              <div
                className="px-4 py-2 bg-[var(--surface-secondary)]"
                style={{
                  borderRadius: `${appearance.cardRadius}px`,
                }}
              >
                <span className="text-body-sm font-medium">
                  {appearance.cardRadius}px
                </span>
              </div>
              <span className="text-body-sm text-[var(--text-muted)]">Bulat</span>
            </div>
          </div>
        </Card>

        {/* Animation */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Animasi
          </h2>
          <p className="text-body-sm text-[var(--text-muted)] mb-4">
            Tingkat animasi antarmuka
          </p>

          <select
            value={appearance.animationLevel}
            onChange={(e) =>
              updateAppearanceSettings({ animationLevel: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="none">Tanpa Animasi</option>
            <option value="minimal">Minimal</option>
            <option value="normal">Normal</option>
            <option value="full">Penuh</option>
          </select>
        </Card>

        {/* Glass Effect */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-section-title">
                Efek Kaca
              </h2>
              <p className="text-body-sm text-[var(--text-muted)]">
                Tampilkan efek transparan pada beberapa elemen
              </p>
            </div>
            <button
              onClick={() =>
                updateAppearanceSettings({
                  glassEffect: !appearance.glassEffect,
                })
              }
              className={cn(
                "relative w-14 h-8 rounded-full transition-colors",
                appearance.glassEffect
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--surface-secondary)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-white transition-transform shadow-sm",
                  appearance.glassEffect ? "translate-x-7" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
