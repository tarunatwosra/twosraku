"use client"

/**
 * Reading: Appearance settings page dengan visual customization
 * Bahasa visual: Card-based layout dengan color swatches
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/hooks/useSettings"
import { Save, Sun, Moon, Monitor, Check, Layout, Layers, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const themes = [
  { value: "light", label: "Terang", icon: Sun, description: "Tampilan cerah untuk siang hari" },
  { value: "dark", label: "Gelap", icon: Moon, description: "Mudah di mata di malam hari" },
  { value: "system", label: "Sistem", icon: Monitor, description: "Ikuti pengaturan perangkat" },
]

const densities = [
  { value: "compact", label: "Padat", description: "Lebih banyak konten dalam satu layar" },
  { value: "normal", label: "Normal", description: "Setara, seimbang" },
  { value: "comfortable", label: "Lega", description: "Lebih spasi dan nyaman" },
]

const sidebarStyles = [
  { value: "expanded", label: "Luas", description: "Selalu tampilkan label navigasi" },
  { value: "collapsed", label: "Ringkas", description: "Hanya ikon untuk hemat ruang" },
  { value: "floating", label: "Mengambang", description: "Sidebar mengambang dengan shadow" },
]

const accentColors = [
  { value: "#4F7CFF", name: "Biru" },
  { value: "#22C55E", name: "Hijau" },
  { value: "#F59E0B", name: "Kuning" },
  { value: "#EF4444", name: "Merah" },
  { value: "#8B5CF6", name: "Ungu" },
]

export default function AppearanceSettingsPage() {
  const { settings, updateAppearanceSettings } = useSettings()
  const { appearance } = settings

  return (
    <div className="max-w-3xl space-y-6">
      {/* Theme Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Tema</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Pilih tampilan yang sesuai dengan preferensi Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon
            const active = appearance.theme === theme.value
            return (
              <button
                key={theme.value}
                onClick={() =>
                  updateAppearanceSettings({ theme: theme.value as any })
                }
                className={cn(
                  "relative p-4 rounded-2xl border-2 transition-colors duration-200",
                  active
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface-primary)]"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      active
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "font-semibold text-[14px]",
                        active ? "text-[var(--primary)]" : "text-[var(--text-primary)]"
                      )}
                    >
                      {theme.label}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {theme.description}
                    </p>
                  </div>
                </div>
                {active && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Accent Color Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Layout className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Warna Aksen</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Pilih warna utama untuk elemen interaktif
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {accentColors.map((color) => {
            const active = appearance.accentColor === color.value
            return (
              <button
                key={color.value}
                onClick={() => updateAppearanceSettings({ accentColor: color.value })}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    "transition-all duration-200",
                    active
                      ? "ring-4 ring-offset-2 scale-110"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {active && <Check className="w-6 h-6 text-white" />}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {color.name}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Density and Sidebar Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Density Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Kepadatan
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Jarak antar elemen
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {densities.map((density) => {
              const active = appearance.density === density.value
              return (
                <button
                  key={density.value}
                  onClick={() =>
                    updateAppearanceSettings({ density: density.value as any })
                  }
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200",
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <div className="text-left">
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        active ? "text-white" : "text-[var(--text-primary)]"
                      )}
                    >
                      {density.label}
                    </p>
                    <p
                      className={cn(
                        "text-[11px]",
                        active ? "text-white/70" : "text-[var(--text-muted)]"
                      )}
                    >
                      {density.description}
                    </p>
                  </div>
                  {active && <Check className="w-5 h-5 text-white" />}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Sidebar Style Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
              <Layout className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Gaya Sidebar
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Tampilan navigasi
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {sidebarStyles.map((style) => {
              const active = appearance.sidebarStyle === style.value
              return (
                <button
                  key={style.value}
                  onClick={() =>
                    updateAppearanceSettings({ sidebarStyle: style.value as any })
                  }
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200",
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <div className="text-left">
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        active ? "text-white" : "text-[var(--text-primary)]"
                      )}
                    >
                      {style.label}
                    </p>
                    <p
                      className={cn(
                        "text-[11px]",
                        active ? "text-white/70" : "text-[var(--text-muted)]"
                      )}
                    >
                      {style.description}
                    </p>
                  </div>
                  {active && <Check className="w-5 h-5 text-white" />}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Card Radius and Animation Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card Radius Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Kelengkungan
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Radius sudut kartu
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min={0}
              max={28}
              value={appearance.cardRadius}
              onChange={(e) =>
                updateAppearanceSettings({
                  cardRadius: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-[var(--surface-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--primary)]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-muted)]">Kotak</span>
              <div
                className="px-4 py-2 bg-[var(--surface-secondary)] transition-all duration-200"
                style={{ borderRadius: `${appearance.cardRadius}px` }}
              >
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                  {appearance.cardRadius}px
                </span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)]">Bulat</span>
            </div>
          </div>
        </Card>

        {/* Animation Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Animasi
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Tingkat animasi UI
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={appearance.animationLevel}
              onChange={(e) =>
                updateAppearanceSettings({ animationLevel: e.target.value as any })
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
              <option value="none">Tanpa Animasi</option>
              <option value="minimal">Minimal</option>
              <option value="normal">Normal</option>
              <option value="full">Penuh</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </Card>
      </div>

      {/* Glass Effect Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Efek Kaca
              </h3>
              <p className="text-[12px] text-[var(--text-muted)]">
                Tampilkan efek transparan pada sidebar dan elemen tertentu
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              updateAppearanceSettings({
                glassEffect: !appearance.glassEffect,
              })
            }
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors duration-300",
              appearance.glassEffect
                ? "bg-[var(--primary)]"
                : "bg-[var(--surface-secondary)]"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-6 h-6 rounded-full bg-white",
                "transition-transform duration-300",
                appearance.glassEffect ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 h-11 px-6">
          <Save className="w-4 h-4" />
          Simpan Perubahan
        </Button>
      </div>
    </div>
  )
}
