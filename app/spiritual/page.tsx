"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  Download,
  CheckCircle2,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Activity types
const ACTIVITY_TYPES = [
  { id: "tadarrus", name: "Tadarrus Al-Quran", icon: BookOpen, color: "#10B981" },
  { id: "iqro", name: "Iqro", icon: BookOpen, color: "#3B82F6" },
  { id: "hafalan", name: "Hafalan", icon: Award, color: "#F59E0B" },
  { id: "khataman", name: "Khataman Al-Quran", icon: Target, color: "#EC4899" },
]

// Demo activities
const DEMO_ACTIVITIES = [
  {
    id: "act-1",
    title: "Tadarrus Pagi",
    type: "tadarrus",
    date: "2026-07-01",
    time: "06:30",
    location: "Masjid Al-Hidayah",
    participants: 45,
    total: 50,
    status: "completed" as const,
  },
  {
    id: "act-2",
    title: "Hafalan Juz 30",
    type: "hafalan",
    date: "2026-07-02",
    time: "07:00",
    location: "Ruang Kelas X",
    participants: 30,
    total: 32,
    status: "completed" as const,
  },
  {
    id: "act-3",
    title: "Pembelajaran Iqro 5",
    type: "iqro",
    date: "2026-07-03",
    time: "14:00",
    location: "Ruang Agama",
    participants: 28,
    total: 30,
    status: "in_progress" as const,
  },
  {
    id: "act-4",
    title: "Khataman Batch 1",
    type: "khataman",
    date: "2026-07-15",
    time: "09:00",
    location: "Masjid Al-Hidayah",
    participants: 0,
    total: 40,
    status: "scheduled" as const,
  },
]

// Demo statistics
const DEMO_STATS = {
  totalActivities: 156,
  participationRate: 87,
  activeStudents: 48,
  totalStudents: 55,
}

export default function SpiritualPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Filter activities
  const filteredActivities = useMemo(() => {
    return DEMO_ACTIVITIES.filter((activity) => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === "all" || activity.type === selectedType
      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedType])

  // Get activity type info
  const getActivityType = (typeId: string) => {
    return ACTIVITY_TYPES.find((t) => t.id === typeId) || ACTIVITY_TYPES[0]
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</Badge>
      case "in_progress":
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Berlangsung</Badge>
      case "scheduled":
        return <Badge variant="info" className="gap-1"><Clock className="w-3 h-3" /> Direncanakan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell
      title="Spiritual"
      description="Kelola kegiatan spiritual dan partisipasi siswa"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-body focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => router.push("/spiritual/laporan")}>
              <Download className="w-4 h-4" />
              Laporan
            </Button>
            <Button className="gap-2" onClick={() => router.push("/spiritual/kegiatan/baru")}>
              <Plus className="w-4 h-4" />
              Kegiatan Baru
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Kegiatan"
            value={DEMO_STATS.totalActivities}
            subtitle="semua jenis"
            icon={<Calendar className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Tingkat Partisipasi"
            value={`${DEMO_STATS.participationRate}%`}
            subtitle="bulan ini"
            icon={<TrendingUp className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Siswa Aktif"
            value={DEMO_STATS.activeStudents}
            subtitle={`dari ${DEMO_STATS.totalStudents} siswa`}
            icon={<Users className="w-5 h-5" />}
            color="info"
          />
          <StatCard
            title="Jenis Kegiatan"
            value={ACTIVITY_TYPES.length}
            subtitle="Tadarrus, Iqro, Hafalan, Khataman"
            icon={<Award className="w-5 h-5" />}
            color="warning"
          />
        </div>

        {/* Activity Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACTIVITY_TYPES.map((type) => {
            const TypeIcon = type.icon
            const count = DEMO_ACTIVITIES.filter((a) => a.type === type.id).length

            return (
              <Card
                key={type.id}
                className={cn(
                  "p-5 cursor-pointer hover:shadow-lg transition-all",
                  selectedType === type.id && "ring-2 ring-offset-2"
                )}
                style={{
                  // @ts-ignore - custom ring color via CSS variable
                  "--tw-ring-color": selectedType === type.id ? type.color : undefined,
                } as React.CSSProperties}
                onClick={() => setSelectedType(selectedType === type.id ? "all" : type.id)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <TypeIcon className="w-6 h-6" style={{ color: type.color }} />
                </div>
                <p className="text-h5 text-[var(--text-primary)]">
                  {type.name}
                </p>
                <p className="text-body-sm text-[var(--text-muted)]">
                  {count} kegiatan
                </p>
              </Card>
            )
          })}
        </div>

        {/* Recent Activities */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between">
              <h2 className="text-section-title">
                Kegiatan Terbaru
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedType("all")}
                  className={cn(
                    "px-3 py-1 rounded-[14px] text-[12px] font-medium transition-all",
                    selectedType === "all"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  Semua
                </button>
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "px-3 py-1 rounded-[14px] text-[12px] font-medium transition-all",
                      selectedType === type.id
                        ? "text-white"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    )}
                    style={{
                      backgroundColor: selectedType === type.id ? type.color : undefined,
                    }}
                  >
                    {type.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-light)]">
            {filteredActivities.map((activity) => {
              const activityType = getActivityType(activity.type)
              const TypeIcon = activityType.icon

              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/spiritual/kegiatan/${activity.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${activityType.color}20` }}
                    >
                      <TypeIcon className="w-6 h-6" style={{ color: activityType.color }} />
                    </div>
                    <div>
                      <p className="text-h5 text-[var(--text-primary)]">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 text-body-sm text-[var(--text-muted)]">
                        <span>{new Date(activity.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}</span>
                        <span>•</span>
                        <span>{activity.time} WIB</span>
                        <span>•</span>
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[14px] font-medium text-[var(--text-primary)]">
                        {activity.participants}/{activity.total}
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        peserta
                      </p>
                    </div>
                    {getStatusBadge(activity.status)}
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-muted)]">Tidak ada kegiatan yang ditemukan</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/spiritual/kehadiran")}
          >
            <Users className="w-5 h-5" />
            <span>Input Kehadiran</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/spiritual/refleksi")}
          >
            <BookOpen className="w-5 h-5" />
            <span>Catat Refleksi</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/spiritual/pencapaian")}
          >
            <Award className="w-5 h-5" />
            <span>Tambah Pencapaian</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/spiritual/laporan")}
          >
            <Download className="w-5 h-5" />
            <span>Generate Laporan</span>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "secondary" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-stat-lg text-[var(--text-primary)]">{value}</p>
          <p className="text-caption text-[var(--text-muted)]">{title}</p>
          {subtitle && <p className="text-tiny text-[var(--text-muted)]">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}
