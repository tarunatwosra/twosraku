"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Settings,
  Shield,
  Save,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SpecialUnitsSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [unitInfo, setUnitInfo] = useState({
    name: "Pasukan Khusus Taruna",
    shortName: "PASKHAS",
    description: "Pasukan Khusus SMKN 2 Sragen",
    establishedDate: "2020-01-01",
  })

  const [activityTypes, setActivityTypes] = useState([
    { id: "act-1", name: "Latihan Rutin", status: "active" as const },
    { id: "act-2", name: "Upacara Bendera", status: "active" as const },
    { id: "act-3", name: "Gladi", status: "active" as const },
    { id: "act-4", name: "Penugasan Tamu", status: "active" as const },
    { id: "act-5", name: "Kerja Bakti", status: "active" as const },
    { id: "act-6", name: "Lomba", status: "inactive" as const },
  ])

  const [achievementTypes, setAchievementTypes] = useState([
    { id: "ach-1", name: "Juara 1", status: "active" as const },
    { id: "ach-2", name: "Juara 2", status: "active" as const },
    { id: "ach-3", name: "Juara 3", status: "active" as const },
    { id: "ach-4", name: "Harapan 1", status: "active" as const },
    { id: "ach-5", name: "Harapan 2", status: "active" as const },
    { id: "ach-6", name: "Peserta", status: "active" as const },
    { id: "ach-7", name: "Best Performance", status: "inactive" as const },
  ])

  const [memberStatuses, setMemberStatuses] = useState([
    { id: "ms-1", name: "Kandidat", color: "#F59E0B", status: "active" as const },
    { id: "ms-2", name: "Aktif", color: "#10B981", status: "active" as const },
    { id: "ms-3", name: "Nonaktif", color: "#6B7280", status: "active" as const },
    { id: "ms-4", name: "Lulus", color: "#3B82F6", status: "active" as const },
    { id: "ms-5", name: "Pindah", color: "#EF4444", status: "active" as const },
    { id: "ms-6", name: "Dikeluarkan", color: "#DC2626", status: "inactive" as const },
  ])

  const [defaultSettings, setDefaultSettings] = useState({
    minMembers: 15,
    maxMembers: 30,
    requireApproval: true,
    autoPromotion: false,
    notificationEnabled: true,
  })

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell
      title="Pengaturan"
      description="Konfigurasi Pasukan Khusus"
      breadcrumbs={[
        { label: "Pasukan Khusus", href: "/pasukan-khusus" },
        { label: "Pengaturan" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Pengaturan Pasukan Khusus</h1>
              <p className="text-sm text-[var(--text-muted)]">Konfigurasi umum dan preferensi</p>
            </div>
          </div>
          <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unit Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Informasi Unit</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nama Unit
                  </label>
                  <input
                    type="text"
                    value={unitInfo.name}
                    onChange={(e) => setUnitInfo({ ...unitInfo, name: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nama Singkat
                  </label>
                  <input
                    type="text"
                    value={unitInfo.shortName}
                    onChange={(e) => setUnitInfo({ ...unitInfo, shortName: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Deskripsi
                  </label>
                  <textarea
                    value={unitInfo.description}
                    onChange={(e) => setUnitInfo({ ...unitInfo, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Tanggal Berdiri
                  </label>
                  <input
                    type="date"
                    value={unitInfo.establishedDate}
                    onChange={(e) => setUnitInfo({ ...unitInfo, establishedDate: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
              </div>
            </Card>

            {/* Activity Types */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Jenis Kegiatan</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </div>
              <div className="space-y-3">
                {activityTypes.map((type, index) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-xl"
                  >
                    <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab" />
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => {
                        const newTypes = [...activityTypes]
                        newTypes[index].name = e.target.value
                        setActivityTypes(newTypes)
                      }}
                      className="flex-1 h-10 px-3 bg-white border border-transparent rounded-[14px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
                    />
                    <Badge variant={type.status === "active" ? "success" : "secondary"} className="text-[10px]">
                      {type.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    <button className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--danger)]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievement Types */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Jenis Pencapaian</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </div>
              <div className="space-y-3">
                {achievementTypes.map((type, index) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-xl"
                  >
                    <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab" />
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => {
                        const newTypes = [...achievementTypes]
                        newTypes[index].name = e.target.value
                        setAchievementTypes(newTypes)
                      }}
                      className="flex-1 h-10 px-3 bg-white border border-transparent rounded-[14px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
                    />
                    <Badge variant={type.status === "active" ? "success" : "secondary"} className="text-[10px]">
                      {type.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    <button className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--danger)]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Status & Defaults */}
          <div className="space-y-6">
            {/* Member Statuses */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Status Anggota</h2>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {memberStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-[14px] text-[var(--text-primary)]">
                        {status.name}
                      </span>
                    </div>
                    <Badge variant={status.status === "active" ? "success" : "secondary"} className="text-[10px]">
                      {status.status === "active" ? "Aktif" : "Tidak"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Default Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Pengaturan Default</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Minimal Anggota
                  </label>
                  <input
                    type="number"
                    value={defaultSettings.minMembers}
                    onChange={(e) => setDefaultSettings({
                      ...defaultSettings,
                      minMembers: parseInt(e.target.value) || 0
                    })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Maksimal Anggota
                  </label>
                  <input
                    type="number"
                    value={defaultSettings.maxMembers}
                    onChange={(e) => setDefaultSettings({
                      ...defaultSettings,
                      maxMembers: parseInt(e.target.value) || 0
                    })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[14px] text-[var(--text-primary)]">Require Approval</span>
                    <div
                      onClick={() => setDefaultSettings({
                        ...defaultSettings,
                        requireApproval: !defaultSettings.requireApproval
                      })}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors relative cursor-pointer",
                        defaultSettings.requireApproval
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--surface-hover)]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                          defaultSettings.requireApproval
                            ? "left-6"
                            : "left-1"
                        )}
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[14px] text-[var(--text-primary)]">Auto Promotion</span>
                    <div
                      onClick={() => setDefaultSettings({
                        ...defaultSettings,
                        autoPromotion: !defaultSettings.autoPromotion
                      })}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors relative cursor-pointer",
                        defaultSettings.autoPromotion
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--surface-hover)]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                          defaultSettings.autoPromotion
                            ? "left-6"
                            : "left-1"
                        )}
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[14px] text-[var(--text-primary)]">Notification</span>
                    <div
                      onClick={() => setDefaultSettings({
                        ...defaultSettings,
                        notificationEnabled: !defaultSettings.notificationEnabled
                      })}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors relative cursor-pointer",
                        defaultSettings.notificationEnabled
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--surface-hover)]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                          defaultSettings.notificationEnabled
                            ? "left-6"
                            : "left-1"
                        )}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
