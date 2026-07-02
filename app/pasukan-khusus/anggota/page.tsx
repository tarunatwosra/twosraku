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
  UserPlus,
  Download,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo data for members
const DEMO_MEMBERS = Array.from({ length: 32 }, (_, i) => ({
  id: `member-${i + 1}`,
  student: {
    id: `student-${i + 1}`,
    name: [
      "Andi Pratama", "Budi Santoso", "Dewi Lestari", "Eko Prasetyo", "Fitri Handayani",
      "Gunawan Wijaya", "Hendra Kusuma", "Ika Wahyuni", "Joko Widodo", "Kartika Sari",
      "Luki Hermawan", "Maya Putri", "Nico Utama", "Olivia Chen", "Putu Arya",
      "Qori Amelia", "Rudi Hartono", "Siti Nurhaliza", "Tono Saputra", "Una Fathonah",
      "Vina Marlina", "Wahyu Setiawan", "Xena Putri", "Yusuf Ibrahim",
      "Zahra Nuraini", "Ahmad Fauzi", "Bella Monica", "Candra Dharma", "Diana Sari",
      "Edo Pratama", "Fani Rosalina", "Gilang Ramadhan"
    ][i],
    studentNumber: `2025${String(i + 1).padStart(4, "0")}`,
    class: ["X TKJ 1", "X TKJ 2", "XI TKJ 1", "XI TKJ 2", "XII TKJ 1", "XII TKJ 2"][i % 6],
    major: "TKJ",
  },
  position: ["Komandan", "Wakil Komandan", "Sekretaris", "Bendahara", "Koordinator Pelatihan", "Anggota"][i % 6],
  status: ["active", "candidate", "inactive", "graduated"][i % 4] as "active" | "candidate" | "inactive" | "graduated",
  joinDate: new Date(2024, i % 12, (i % 28) + 1).toISOString().split("T")[0],
}))

export default function MembersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter members
  const filteredMembers = useMemo(() => {
    return DEMO_MEMBERS.filter((member) => {
      const matchesSearch =
        member.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.student.studentNumber.includes(searchQuery)
      const matchesStatus = selectedStatus === "all" || member.status === selectedStatus
      const matchesClass = selectedClass === "all" || member.student.class === selectedClass
      const matchesPosition = selectedPosition === "all" || member.position === selectedPosition
      return matchesSearch && matchesStatus && matchesClass && matchesPosition
    })
  }, [searchQuery, selectedStatus, selectedClass, selectedPosition])

  // Get unique values for filters
  const uniqueClasses = [...new Set(DEMO_MEMBERS.map((m) => m.student.class))]
  const uniquePositions = [...new Set(DEMO_MEMBERS.map((m) => m.position))]

  // Statistics
  const stats = useMemo(() => ({
    total: DEMO_MEMBERS.length,
    active: DEMO_MEMBERS.filter((m) => m.status === "active").length,
    candidate: DEMO_MEMBERS.filter((m) => m.status === "candidate").length,
  }), [])

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Aktif</Badge>
      case "candidate":
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Kandidat</Badge>
      case "inactive":
        return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" /> Nonaktif</Badge>
      case "graduated":
        return <Badge variant="info" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Lulus</Badge>
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
      title="Anggota Pasukan Khusus"
      description="Kelola database anggota Pasukan Khusus"
      breadcrumbs={[
        { label: "Pasukan Khusus", href: "/pasukan-khusus" },
        { label: "Anggota" },
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
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Tambah Anggota
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="candidate">Kandidat</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="graduated">Lulus</option>
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Kelas
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="all">Semua Kelas</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Jabatan
                </label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="all">Semua Jabatan</option>
                  {uniquePositions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedStatus("all")
                    setSelectedClass("all")
                    setSelectedPosition("all")
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {(selectedStatus !== "all" || selectedClass !== "all" || selectedPosition !== "all") && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
            {selectedStatus !== "all" && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedStatus("all")}>
                {selectedStatus}
              </Badge>
            )}
            {selectedClass !== "all" && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedClass("all")}>
                {selectedClass}
              </Badge>
            )}
            {selectedPosition !== "all" && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedPosition("all")}>
                {selectedPosition}
              </Badge>
            )}
          </div>
        )}

        {/* Members Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Anggota
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    No. Induk
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Kelas
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Jabatan
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Bergabung
                  </th>
                  <th className="text-center px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] font-bold">
                          {member.student.name.charAt(0)}
                        </div>
                        <span className="text-[14px] font-medium text-[var(--text-primary)]">
                          {member.student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[var(--text-secondary)] font-mono">
                      {member.student.studentNumber}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[var(--text-secondary)]">
                      {member.student.class}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          member.position === "Komandan" ? "warning" :
                          member.position === "Wakil Komandan" ? "info" :
                          member.position === "Sekretaris" ? "primary" : "secondary"
                        }
                      >
                        {member.position}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[var(--text-muted)]">
                      {new Date(member.joinDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/pasukan-khusus/anggota/${member.id}`)}>
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Menampilkan {filteredMembers.length} dari {DEMO_MEMBERS.length} anggota
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--text-muted)]">Total Aktif:</span>
                <Badge variant="success">{stats.active}</Badge>
                <span className="text-[var(--text-muted)]">Kandidat:</span>
                <Badge variant="warning">{stats.candidate}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
