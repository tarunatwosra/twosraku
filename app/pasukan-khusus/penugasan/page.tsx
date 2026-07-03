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
  Calendar,
  MapPin,
  Clock,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo data for assignments
const DEMO_ASSIGNMENTS = [
  {
    id: "asgn-1",
    title: "Upacara Bendera Senin Pagi",
    description: "Penugasan upacara bendera hari Senin",
    date: "2026-07-07",
    time: "06:30",
    location: "Halaman Sekolah",
    supervisor: "Bpk. Hendra",
    status: "completed" as const,
    assignedMembers: 12,
    totalMembers: 15,
  },
  {
    id: "asgn-2",
    title: "Sambutan Tamu Sekolah",
    description: "Menyambut kedatangan tamu dari Departemen",
    date: "2026-07-08",
    time: "09:00",
    location: "Ruang Tamu",
    supervisor: "Ibu Sari",
    status: "in_progress" as const,
    assignedMembers: 6,
    totalMembers: 8,
  },
  {
    id: "asgn-3",
    title: "Gladi Bersih Upacara",
    description: "Gladi untuk persiapan upacara besar sekolah",
    date: "2026-07-10",
    time: "14:00",
    location: "Halaman Sekolah",
    supervisor: "Bpk. Hendra",
    status: "scheduled" as const,
    assignedMembers: 15,
    totalMembers: 20,
  },
  {
    id: "asgn-4",
    title: "Penerimaan Siswa Baru",
    description: "Membantu penerimaan siswa baru tahun ajaran 2026/2027",
    date: "2026-07-15",
    time: "08:00",
    location: "Gedung A",
    supervisor: "Bpk. Ahmad",
    status: "scheduled" as const,
    assignedMembers: 8,
    totalMembers: 10,
  },
  {
    id: "asgn-5",
    title: "Upacara HUT Kemerdekaan",
    description: "Penugasan upacara peringatan 17 Agustus",
    date: "2026-08-17",
    time: "07:00",
    location: "Lapangan upacara",
    supervisor: "Bpk. Hendra",
    status: "scheduled" as const,
    assignedMembers: 20,
    totalMembers: 24,
  },
]

const STATUS_CONFIG = {
  scheduled: { label: "Direncanakan", variant: "info" as const, icon: Clock },
  in_progress: { label: "Berlangsung", variant: "warning" as const, icon: AlertCircle },
  completed: { label: "Selesai", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan", variant: "secondary" as const, icon: AlertCircle },
}

export default function AssignmentsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return DEMO_ASSIGNMENTS.filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === "all" || assignment.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  // Statistics
  const stats = useMemo(() => ({
    total: DEMO_ASSIGNMENTS.length,
    scheduled: DEMO_ASSIGNMENTS.filter((a) => a.status === "scheduled").length,
    inProgress: DEMO_ASSIGNMENTS.filter((a) => a.status === "in_progress").length,
    completed: DEMO_ASSIGNMENTS.filter((a) => a.status === "completed").length,
  }), [])

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
      title="Penugasan"
      description="Kelola penugasan anggota Pasukan Khusus"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari penugasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Buat Penugasan
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Penugasan"
            value={stats.total}
            color="primary"
          />
          <StatCard
            title="Direncanakan"
            value={stats.scheduled}
            color="info"
          />
          <StatCard
            title="Berlangsung"
            value={stats.inProgress}
            color="warning"
          />
          <StatCard
            title="Selesai"
            value={stats.completed}
            color="success"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          {["all", "scheduled", "in_progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-[14px] text-[13px] font-medium transition-all",
                selectedStatus === status
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )}
            >
              {status === "all" ? "Semua" : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
            </button>
          ))}
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)]">Tidak ada penugasan yang ditemukan</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((assignment) => {
              const status = STATUS_CONFIG[assignment.status]
              const StatusIcon = status.icon

              return (
                <Card
                  key={assignment.id}
                  className="p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/pasukan-khusus/penugasan/${assignment.id}`)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant={status.variant}
                      className="gap-1"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                    <button className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center">
                      <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">
                    {assignment.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)] mb-4 line-clamp-2">
                    {assignment.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                      <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                      {new Date(assignment.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                      <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      {assignment.time} WIB
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      {assignment.location}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="pt-4 border-t border-[var(--border-light)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-[12px] text-[var(--text-muted)]">
                        <Users className="w-4 h-4" />
                        <span>Anggota ditugaskan</span>
                      </div>
                      <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                        {assignment.assignedMembers}/{assignment.totalMembers}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{
                          width: `${(assignment.assignedMembers / assignment.totalMembers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Calendar Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Kalender Penugasan
            </h2>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Lihat Kalender Lengkap
            </Button>
          </div>

          {/* Simple calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <div
                key={day}
                className="text-center text-[12px] font-medium text-[var(--text-muted)] py-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const date = i + 1
              const hasAssignment = DEMO_ASSIGNMENTS.some((a) =>
                new Date(a.date).getDate() === date
              )
              const assignment = DEMO_ASSIGNMENTS.find((a) =>
                new Date(a.date).getDate() === date
              )

              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-[13px] cursor-pointer transition-all",
                    date <= 0 || date > 31
                      ? "text-[var(--text-muted)]/30"
                      : date === new Date().getDate()
                      ? "bg-[var(--primary)] text-white font-bold"
                      : "hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <span>{date > 0 && date <= 31 ? date : ""}</span>
                  {hasAssignment && assignment && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-0.5" />
                  )}
                </div>
              )
            })}
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
  value: number
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
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <p className={cn("text-2xl font-bold", colors[color].split(" ")[1])}>{value}</p>
    </Card>
  )
}
