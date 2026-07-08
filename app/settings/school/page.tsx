"use client"

import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/useSettings"
import { Save, Upload, Image as ImageIcon } from "lucide-react"

export default function SchoolSettingsPage() {
  const { settings, updateSchoolSettings } = useSettings()
  const { school } = settings

  return (
    <AppShell title="Profil Sekolah" description="Informasi identitas sekolah">
      <div className="max-w-2xl">
        <Card className="p-6">
          <h2 className="text-section-title mb-6">
            Profil Sekolah
          </h2>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Logo Sekolah
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center bg-[var(--surface-secondary)]">
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
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Unggah Logo
                </Button>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Format: PNG, JPG, atau SVG. Maksimal 2MB.
              </p>
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Nama Sekolah *
              </label>
              <Input
                value={school.name}
                onChange={(e) =>
                  updateSchoolSettings({ name: e.target.value })
                }
                placeholder="Nama sekolah"
              />
            </div>

            {/* NPSN */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                NPSN
              </label>
              <Input
                value={school.npsn}
                onChange={(e) =>
                  updateSchoolSettings({ npsn: e.target.value })
                }
                placeholder="Nomor Pokok Sekolah Nasional"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Alamat
              </label>
              <textarea
                value={school.address}
                onChange={(e) =>
                  updateSchoolSettings({ address: e.target.value })
                }
                placeholder="Alamat lengkap"
                rows={3}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            {/* City & Province */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                  Kota/Kabupaten
                </label>
                <Input
                  value={school.city}
                  onChange={(e) =>
                    updateSchoolSettings({ city: e.target.value })
                  }
                  placeholder="Kota"
                />
              </div>
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                  Provinsi
                </label>
                <Input
                  value={school.province}
                  onChange={(e) =>
                    updateSchoolSettings({ province: e.target.value })
                  }
                  placeholder="Provinsi"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Kode Pos
              </label>
              <Input
                value={school.postalCode}
                onChange={(e) =>
                  updateSchoolSettings({ postalCode: e.target.value })
                }
                placeholder="Kode pos"
                maxLength={5}
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                  Telepon
                </label>
                <Input
                  value={school.phone}
                  onChange={(e) =>
                    updateSchoolSettings({ phone: e.target.value })
                  }
                  placeholder="Nomor telepon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                  Email
                </label>
                <Input
                  type="email"
                  value={school.email}
                  onChange={(e) =>
                    updateSchoolSettings({ email: e.target.value })
                  }
                  placeholder="email@sekolah.sch.id"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Website
              </label>
              <Input
                value={school.website}
                onChange={(e) =>
                  updateSchoolSettings({ website: e.target.value })
                }
                placeholder="https://sekolah.sch.id"
              />
            </div>

            {/* Principal Name */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Nama Kepala Sekolah
              </label>
              <Input
                value={school.principalName}
                onChange={(e) =>
                  updateSchoolSettings({ principalName: e.target.value })
                }
                placeholder="Nama kepala sekolah"
              />
            </div>

            {/* Vision */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Visi
              </label>
              <textarea
                value={school.vision}
                onChange={(e) =>
                  updateSchoolSettings({ vision: e.target.value })
                }
                placeholder="Visi sekolah"
                rows={3}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            {/* Mission */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-[var(--text-secondary)]">
                Misi
              </label>
              <textarea
                value={school.mission}
                onChange={(e) =>
                  updateSchoolSettings({ mission: e.target.value })
                }
                placeholder="Misi sekolah"
                rows={4}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-8 pt-6 border-t border-[var(--border)]">
            <Button onClick={() => {}} className="gap-2">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
