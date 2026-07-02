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
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Target,
  ChevronRight,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Activity types with colors
const ACTIVITY_TYPES = [
  { id: "tadarrus", name: "Tadarrus", icon: BookOpen, color: "#10B981" },
  { id: "iqro", name: "Iqro", icon: BookOpen, color: "#3B82F6" },
  { id: "hafalan", name: "Hafalan", icon: Award, color: "#F59E0B" },
  { id: "khataman", name: "Khataman", icon: Target, color: "#EC4899" },
]

// Demo participation records
const DEMO_PARTICIPATIONS = Array.from({ length: 30 }, (_, i) => ({
  id: `part-${i + 1}`,
  student: {
    id: `student-${i + 1}`,
    name: [
      "Andi Pratama", "Budi Santoso", "Dewi Lestari", "Eko Prasetyo", "Fitri Handayani",
      "Gunawan Wijaya", "Hendra Kusuma", "Ika Wahyuni", "Joko Widodo", "Kartika Sari",
      "Luki Hermawan", "Maya Putri", "Nico Utama", "Olivia Chen", "Putu Arya",
      "Qori Amelia", "Rudi Hartono", "Siti Nurhaliza", "Tono Saputra", "Una Fathonah",
      "Vina Marlina", "Wahyu Setiawan", "Xena Putri", "Yusuf Ibrahim",
      "Zahra Nuraini", "Ahmad Fauzi", "Bella Monica", "Candra Dharma", "Diana Sari",
      "Edo Pratama"
    ][i],
    studentNumber: `2025${String(i + 1).padStart(4, "0")}`,
    class: ["X TKJ 1", "X TKJ 2", "XI TKJ 1", "XI TKJ 2", "XII TKJ 1"][i % 5],
  },
  activityId: ["act-1", "act-2", "act-3", "act-4"][i % 4],
  activityName: ["Tadarrus Pagi", "Hafalan Juz 30", "Pembelajaran Iqro 5", "Khataman Batch 1"][i % 4],
  activityType: ["tadarrus", "hafalan", "iqro", "khataman"][i % 4],
  date: new Date(2026, 6, (i % 28) + 1).toISOString().split("T")[0],
  status: ["present", "present", "present", "excused", "absent"][i % 5] as "present" | "excused" | "absent",
  level: ["excellent", "good", "satisfactory", "observed"][i % 4] as "excellent" | "good" | "satisfactory" | "observed",
  notes: i % 3 === 0 ? "Hadir tepat waktu" : "",
}))

// Demo activities for dropdown
const DEMO_ACTIVITIES = [
  { id: "act-1", name: "Tadarrus Pagi", type: "tadarrus", date: "2026-07-01" },
  { id: "act-2", name: "Hafalan Juz 30", type: "hafalan", date: "2026-07-02" },
  { id: "act-3", name: "Pembelajaran Iqro 5", type: "iqro", date: "2026-07-03" },
  { id: "act-4", name: "Khataman Batch 1", type: "khataman", date: "2026-07-15" },
]

export default function SpiritualAttendancePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")

  // Filter participations
  const filteredParticipations = useMemo(() => {
    return DEMO_PARTICIPATIONS.filter((p) => {
      const matchesSearch =
        p.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.student.studentNumber.includes(searchQuery)
      const matchesActivity = !selectedActivity || p.activityId === selectedActivity
      const matchesStatus = !selectedStatus || p.status === selectedStatus
      const matchesLevel = !selectedLevel || p.level === selectedLevel
      return matchesSearch && matchesActivity && matchesStatus && matchesLevel
    })
  }, [searchQuery, selectedActivity, selectedStatus, selectedLevel])

  // Statistics
  const stats = useMemo(() => {
    const total = filteredParticipations.length
    const present = filteredParticipations.filter((p) => p.status === "present").length
    const excused = filteredParticipations.filter((p) => p.status === "excused").length
    const absent = filteredParticipations.filter((p) => p.status === "absent").length
    const excellent = filteredParticipations.filter((p) => p.level === "excellent").length

    return {
      total,
      present,
      excused,
      absent,
      participationRate: total > 0 ? ((present + excused) / total * 100).toFixed(1) : "0",
      excellent,
    }
  }, [filteredParticipations])

  // Get activity type info
  const getActivityType = (typeId: string) => {
    return ACTIVITY_TYPES.find((t) => t.id === typeId) || ACTIVITY_TYPES[0]
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Hadir</Badge>
      case "excused":
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Izin</Badge>
      case "absent":
        return <Badge variant="danger" className="gap-1"><Clock className="w-3 h-3" /> Alpha</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Get level badge
  const getLevelBadge = (level: string) => {
    const config: Record<string, { label: string; variant: "success" | "info" | "warning" | "secondary" }> = {
      excellent: { label: "Sangat Baik", variant: "success" },
      good: { label: "Baik", variant: "info" },
      satisfactory: { label: "Cukup", variant: "warning" },
      observed: { label: "Teramati", variant: "secondary" },
    }
    const { label, variant } = config[level] || config.satisfactory
    return <Badge variant={variant}>{label}</Badge>
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
      title="Kehadiran Spiritual"
      description="Rekam partisipasi kehadiran kegiatan spiritual"
      breadcrumbs={[
        { label: "Spiritual", href: "/spiritual" },
        { label: "Kehadiran" },
      ]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama atau nomor induk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Input Kehadiran
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Record"
            value={stats.total}
            color="primary"
          />
          <StatCard
            title="Tingkat Partisipasi"
            value={`${stats.participationRate}%`}
            color="success"
          />
          <StatCard
            title="Hadir"
            value={stats.present}
            color="success"
          />
          <StatCard
            title="Izin"
            value={stats.excused}
            color="warning"
          />
          <StatCard
            title="Alpha"
            value={stats.absent}
            color="danger"
          />
        </div>

        {/* Filters */}
        <Card className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                Kegiatan
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              >
                <option value="">Semua Kegiatan</option>
                {DEMO_ACTIVITIES.map((act) => (
                  <option key={act.id} value={act.id}>{act.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                Status Kehadiran
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              >
                <option value="">Semua Status</option>
                <option value="present">Hadir</option>
                <option value="excused">Izin</option>
                <option value="absent">Alpha</option>
              </select>
            </div>
            <div>
              <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                Tingkat Partisipasi
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              >
                <option value="">Semua</option>
                <option value="excellent">Sangat Baik</option>
                <option value="good">Baik</option>
                <option value="satisfactory">Cukup</option>
                <option value="observed">Teramati</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedActivity("")
                  setSelectedStatus("")
                  setSelectedLevel("")
                }}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </Card>

        {/* Participations Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Siswa
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Kegiatan
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Tanggal
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Tingkat
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipations.map((p) => {
                  const activityType = getActivityType(p.activityType)

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] font-bold">
                            {p.student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[var(--text-primary)]">
                              {p.student.name}
                            </p>
                            <p className="text-[12px] text-[var(--text-muted)]">
                              {p.student.studentNumber} • {p.student.class}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${activityType.color}20` }}
                          >
                            <activityType.icon
                              className="w-4 h-4"
                              style={{ color: activityType.color }}
                            />
                          </div>
                          <span className="text-[14px] text-[var(--text-primary)]">
                            {p.activityName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] text-[var(--text-secondary)]">
                        {new Date(p.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getLevelBadge(p.level)}
                      </td>
                      <td className="px-4 py-4 text-[14px] text-[var(--text-muted)]">
                        {p.notes || "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Menampilkan {filteredParticipations.length} dari {DEMO_PARTICIPATIONS.length} record
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--text-muted)]">Tingkat Partisipasi:</span>
                <Badge variant="success">{stats.participationRate}%</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  color,
}: {
  title: string
  value: string | number
  color: "primary" | "success" | "warning" | "secondary" | "info" | "danger"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <Card className="p-4">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <p className={cn("text-2xl font-bold", colors[color].split(" ")[1])}>{value}</p>
    </Card>
  )
}
