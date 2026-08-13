"use client"

/**
 * Reading: School profile settings page dengan form-based layout
 * Bahasa visual: Clean form sections dengan visual grouping
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/useSettings"
import {
  Save,
  Upload,
  Image as ImageIcon,
  Building2,
  MapPin,
  Contact,
  Globe,
  User,
  Target,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SchoolSettingsPage() {
  const { settings, updateSchoolSettings } = useSettings()
  const { school } = settings

  return (
    <div className="max-w-3xl space-y-6">
      {/* Identity Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Identitas Sekolah</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Informasi dasar sekolah
            </p>
          </div>
        </div>

        {/* Logo upload */}
        <div className="flex items-start gap-6 mb-6 p-4 bg-[var(--surface-secondary)] rounded-xl">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--border)] flex items-center justify-center bg-[var(--surface-primary)]">
            {school.logo ? (
              <img
                src={school.logo}
                alt="Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Unggah Logo
            </Button>
            <p className="text-[11px] text-[var(--text-muted)] mt-2">
              Format: PNG, JPG, atau SVG. Maksimal 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Nama Sekolah
            </label>
            <Input
              value={school.name}
              onChange={(e) =>
                updateSchoolSettings({ name: e.target.value })
              }
              placeholder="Nama sekolah"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              NPSN
            </label>
            <Input
              value={school.npsn}
              onChange={(e) =>
                updateSchoolSettings({ npsn: e.target.value })
              }
              placeholder="Nomor Pokok Sekolah Nasional"
              className="h-11"
            />
          </div>
        </div>
      </Card>

      {/* Location Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Lokasi</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Alamat dan informasi geografis
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Alamat Lengkap
            </label>
            <textarea
              value={school.address}
              onChange={(e) =>
                updateSchoolSettings({ address: e.target.value })
              }
              placeholder="Alamat lengkap sekolah"
              rows={2}
              className={cn(
                "w-full px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[14px] text-[var(--text-primary)]",
                "transition-all duration-200",
                "focus:outline-none focus:border-[var(--primary)]",
                "resize-none"
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--text-secondary)]">
                Kota/Kabupaten
              </label>
              <Input
                value={school.city}
                onChange={(e) =>
                  updateSchoolSettings({ city: e.target.value })
                }
                placeholder="Kota"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--text-secondary)]">
                Provinsi
              </label>
              <div className="relative">
                <Input
                  value={school.province}
                  onChange={(e) =>
                    updateSchoolSettings({ province: e.target.value })
                  }
                  placeholder="Provinsi"
                  className="h-11 pr-10"
                />
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--text-secondary)]">
                Kode Pos
              </label>
              <Input
                value={school.postalCode}
                onChange={(e) =>
                  updateSchoolSettings({ postalCode: e.target.value })
                }
                placeholder="Kode pos"
                maxLength={5}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Contact className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Kontak</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Informasi kontak sekolah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Telepon
            </label>
            <Input
              value={school.phone}
              onChange={(e) =>
                updateSchoolSettings({ phone: e.target.value })
              }
              placeholder="Nomor telepon"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <Input
              type="email"
              value={school.email}
              onChange={(e) =>
                updateSchoolSettings({ email: e.target.value })
              }
              placeholder="email@sekolah.sch.id"
              className="h-11"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Website
            </label>
            <Input
              value={school.website}
              onChange={(e) =>
                updateSchoolSettings({ website: e.target.value })
              }
              placeholder="https://sekolah.sch.id"
              className="h-11"
            />
          </div>
        </div>
      </Card>

      {/* Leadership Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Kepemimpinan</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Informasi kepala sekolah
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[var(--text-secondary)]">
            Nama Kepala Sekolah
          </label>
          <Input
            value={school.principalName}
            onChange={(e) =>
              updateSchoolSettings({ principalName: e.target.value })
            }
            placeholder="Nama kepala sekolah"
            className="h-11"
          />
        </div>
      </Card>

      {/* Vision & Mission Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Target className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h2 className="text-section-title">Visi dan Misi</h2>
            <p className="text-[12px] text-[var(--text-muted)]">
              Tujuan dan arah sekolah
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Visi
            </label>
            <textarea
              value={school.vision}
              onChange={(e) =>
                updateSchoolSettings({ vision: e.target.value })
              }
              placeholder="Visi sekolah"
              rows={3}
              className={cn(
                "w-full px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[14px] text-[var(--text-primary)]",
                "transition-all duration-200",
                "focus:outline-none focus:border-[var(--primary)]",
                "resize-none"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--text-secondary)]">
              Misi
            </label>
            <textarea
              value={school.mission}
              onChange={(e) =>
                updateSchoolSettings({ mission: e.target.value })
              }
              placeholder="Misi sekolah"
              rows={4}
              className={cn(
                "w-full px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[14px] text-[var(--text-primary)]",
                "transition-all duration-200",
                "focus:outline-none focus:border-[var(--primary)]",
                "resize-none"
              )}
            />
          </div>
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
