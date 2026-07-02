"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  Award,
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  UserPlus,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo data for members
const DEMO_MEMBERS = Array.from({ length: 24 }, (_, i) => ({
  id: `member-${i + 1}`,
  student: {
    id: `student-${i + 1}`,
    name: i % 3 === 0 ? `Andi Pratama ${i + 1}` : i % 3 === 1 ? `Budi Santoso ${i + 1}` : `Dewi Lestari ${i + 1}`,
    studentNumber: `2025${String(i + 1).padStart(4, "0")}`,
    class: ["X TKJ 1", "XI TKJ 1", "XII TKJ 1"][i % 3],
  },
  position: ["Komandan", "Wakil Komandan", "Sekretaris", "Anggota"][i % 4],
  status: ["active", "candidate", "inactive"][i % 3] as "active" | "candidate" | "inactive",
  joinDate: new Date(2025, i % 12, (i % 28) + 1).toISOString().split("T")[0],
}))

const DEMO_POSITIONS = [
  { id: "pos-1", name: "Komandan", count: 1 },
  { id: "pos-2", name: "Wakil Komandan", count: 2 },
  { id: "pos-3", name: "Sekretaris", count: 2 },
  { id: "pos-4", name: "Bendahara", count: 1 },
  { id: "pos-5", name: "Koordinator Pelatihan", count: 2 },
  { id: "pos-6", name: "Koordinator Disciplin", count: 2 },
  { id: "pos-7", name: "Anggota", count: 14 },
]

const DEMO_ACTIVITIES = [
  { id: "act-1", title: "Upacara Bendera Senin", date: "2026-07-07", time: "06:30", status: "completed" },
  { id: "act-2", title: "Sambutan Tamu Sekolah", date: "2026-07-08", time: "09:00", status: "scheduled" },
  { id: "act-3", title: "Gladi Bersih", date: "2026-07-10", time: "14:00", status: "scheduled" },
]

export default function SpecialUnitsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "candidate" | "inactive">("all")

  // Filter members
  const filteredMembers = useMemo(() => {
    return DEMO_MEMBERS.filter((member) => {
      const matchesSearch =
        member.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.student.studentNumber.includes(searchQuery)
      const matchesStatus = selectedStatus === "all" || member.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  // Statistics
  const stats = useMemo(() => ({
    total: DEMO_MEMBERS.length,
    active: DEMO_MEMBERS.filter((m) => m.status === "active").length,
    candidate: DEMO_MEMBERS.filter((m) => m.status === "candidate").length,
    inactive: DEMO_MEMBERS.filter((m) => m.status === "inactive").length,
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
      title="Pasukan Khusus"
      description="Kelola anggota dan aktivitas Pasukan Khusus"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari anggota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <Button
              variant={selectedStatus !== "all" ? "secondary" : "outline"}
              onClick={() => setSelectedStatus("all")}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Laporan
            </Button>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Tambah Anggota
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Anggota"
            value={stats.total}
            icon={<Users className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Aktif"
            value={stats.active}
            icon={<Shield className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Kandidat"
            value={stats.candidate}
            icon={<Clock className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            title="Nonaktif"
            value={stats.inactive}
            icon={<Award className="w-5 h-5" />}
            color="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Daftar Anggota
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStatus("all")}
                      className={cn(
                        "px-3 py-1 rounded-[14px] text-[12px] font-medium transition-all",
                        selectedStatus === "all"
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      Semua ({stats.total})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("active")}
                      className={cn(
                        "px-3 py-1 rounded-[14px] text-[12px] font-medium transition-all",
                        selectedStatus === "active"
                          ? "bg-[var(--success)] text-white"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      Aktif ({stats.active})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("candidate")}
                      className={cn(
                        "px-3 py-1 rounded-[14px] text-[12px] font-medium transition-all",
                        selectedStatus === "candidate"
                          ? "bg-[var(--warning)] text-white"
                          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      Kandidat ({stats.candidate})
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[var(--border-light)]">
                {filteredMembers.slice(0, 10).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                    onClick={() => router.push(`/pasukan-khusus/anggota/${member.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                        {member.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-[var(--text-primary)]">
                          {member.student.name}
                        </p>
                        <p className="text-[13px] text-[var(--text-muted)]">
                          {member.student.studentNumber} • {member.student.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          member.position === "Komandan" ? "warning" :
                          member.position === "Wakil Komandan" ? "info" :
                          member.position === "Sekretaris" ? "primary" : "secondary"
                        }
                      >
                        {member.position}
                      </Badge>
                      <Badge
                        variant={
                          member.status === "active" ? "success" :
                          member.status === "candidate" ? "warning" : "secondary"
                        }
                      >
                        {member.status === "active" ? "Aktif" :
                         member.status === "candidate" ? "Kandidat" : "Nonaktif"}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length > 10 && (
                <div className="p-4 border-t border-[var(--border-light)] text-center">
                  <Button variant="ghost" onClick={() => router.push("/pasukan-khusus/anggota")}>
                    Lihat Semua ({filteredMembers.length}) →
                  </Button>
                </div>
              )}

              {filteredMembers.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-muted)]">Tidak ada anggota yang ditemukan</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Positions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Struktur Organisasi
              </h2>
              <div className="space-y-3">
                {DEMO_POSITIONS.map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  >
                    <span className="text-[14px] text-[var(--text-primary)]">{pos.name}</span>
                    <Badge variant="secondary">{pos.count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Activities */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Jadwal Mendatang
              </h2>
              <div className="space-y-3">
                {DEMO_ACTIVITIES.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-secondary)]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[var(--primary)] font-medium">
                        {new Date(activity.date).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-[14px] font-bold text-[var(--primary)]">
                        {new Date(activity.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[var(--text-primary)]">
                        {activity.title}
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        {activity.time} WIB
                      </p>
                    </div>
                    <Badge
                      variant={activity.status === "completed" ? "success" : "info"}
                      className="text-[10px]"
                    >
                      {activity.status === "completed" ? "Selesai" : "Direncanakan"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" onClick={() => router.push("/pasukan-khusus/penugasan")}>
                <Calendar className="w-4 h-4 mr-2" />
                Lihat Semua Penugasan
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Aksi Cepat
              </h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/pasukan-khusus/penugasan")}>
                  <Shield className="w-4 h-4" />
                  Buat Penugasan Baru
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/pasukan-khusus/pelatihan")}>
                  <TrendingUp className="w-4 h-4" />
                  Catat Pelatihan
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/pasukan-khusus/pencapaian")}>
                  <Award className="w-4 h-4" />
                  Tambah Pencapaian
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
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
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
        </div>
      </div>
    </Card>
  )
}
