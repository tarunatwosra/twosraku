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
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Shield,
  Users,
  Crown,
  FileText,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo positions data
const DEMO_POSITIONS = [
  {
    id: "pos-1",
    name: "Komandan",
    description: "Memimpin dan mengkoordinasikan seluruh anggota Pasukan Khusus",
    responsibilities: [
      "Memimpin seluruh operasional",
      "Mengambil keputusan strategis",
      "Menjadi kontak utama dengan pihak sekolah",
    ],
    memberCount: 1,
    displayOrder: 1,
    status: "active" as const,
  },
  {
    id: "pos-2",
    name: "Wakil Komandan",
    description: "Menggantikan Comandante saat berhalangan dan membantu koordinasi",
    responsibilities: [
      "Menggantikan komandan saat berhalangan",
      "Membantu koordinasi anggota",
      "Mem监督 kegiatan lapangan",
    ],
    memberCount: 2,
    displayOrder: 2,
    status: "active" as const,
  },
  {
    id: "pos-3",
    name: "Sekretaris",
    description: "Mengelola administrasi dan dokumentasi",
    responsibilities: [
      "Mengelola surat masuk dan keluar",
      "Mencatat notulen rapat",
      "Mengelola arsip dokumen",
    ],
    memberCount: 2,
    displayOrder: 3,
    status: "active" as const,
  },
  {
    id: "pos-4",
    name: "Bendahara",
    description: "Mengelola keuangan dan kas Pasukan Khusus",
    responsibilities: [
      "Mencatat keluar masuknya keuangan",
      "Membuat laporan keuangan",
      "Mengelola kas kecil",
    ],
    memberCount: 1,
    displayOrder: 4,
    status: "active" as const,
  },
  {
    id: "pos-5",
    name: "Koordinator Pelatihan",
    description: "Mengkoordinasikan kegiatan pelatihan",
    responsibilities: [
      "Menyusun jadwal pelatihan",
      "Mengkoordinasikan instruktur",
      "Memantau progress pelatihan",
    ],
    memberCount: 2,
    displayOrder: 5,
    status: "active" as const,
  },
  {
    id: "pos-6",
    name: "Koordinator Disiplin",
    description: "Mengkoordinasikan penegakan displin",
    responsibilities: [
      "Memantau kehadiran anggota",
      "Mencatat pelanggaran displin",
      "Membuat laporan displin",
    ],
    memberCount: 2,
    displayOrder: 6,
    status: "active" as const,
  },
  {
    id: "pos-7",
    name: "Koordinator Logistik",
    description: "Mengelola perlengkapan dan inventaris",
    responsibilities: [
      "Mengelola perlengkapan",
      "Memeriksa kondisi inventaris",
      "Membuat laporan logistik",
    ],
    memberCount: 1,
    displayOrder: 7,
    status: "inactive" as const,
  },
  {
    id: "pos-8",
    name: "Anggota",
    description: "Anggota biasa Pasukan Khusus",
    responsibilities: [
      "Mengikuti pelatihan",
      "Menjalankan tugas yang diberikan",
      "Menjaga displin",
    ],
    memberCount: 14,
    displayOrder: 99,
    status: "active" as const,
  },
]

export default function PositionsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter positions
  const filteredPositions = useMemo(() => {
    return DEMO_POSITIONS.filter((pos) => {
      const matchesSearch =
        pos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pos.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === "all" || pos.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus])

  // Statistics
  const stats = useMemo(() => ({
    total: DEMO_POSITIONS.length,
    active: DEMO_POSITIONS.filter((p) => p.status === "active").length,
    totalMembers: DEMO_POSITIONS.reduce((sum, p) => sum + p.memberCount, 0),
  }), [])

  // Get position icon
  const getPositionIcon = (name: string) => {
    if (name === "Komandan") return Crown
    if (name === "Bendahara") return FileText
    return Shield
  }

  // Get position color
  const getPositionColor = (name: string) => {
    switch (name) {
      case "Komandan":
        return "#F59E0B"
      case "Wakil Komandan":
        return "#3B82F6"
      case "Sekretaris":
        return "#10B981"
      case "Bendahara":
        return "#8B5CF6"
      case "Koordinator Pelatihan":
        return "#EC4899"
      case "Koordinator Disiplin":
        return "#EF4444"
      default:
        return "#6B7280"
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
      title="Jabatan"
      description="Kelola struktur jabatan Pasukan Khusus"
      breadcrumbs={[
        { label: "Pasukan Khusus", href: "/pasukan-khusus" },
        { label: "Jabatan" },
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
                placeholder="Cari jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Jabatan Baru
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total Jabatan</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Jabatan Aktif</p>
            <p className="text-2xl font-bold text-[var(--success)]">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-[var(--text-muted)]">Total Anggota</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalMembers}</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((status) => (
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
              {status === "all" ? "Semua" : status === "active" ? "Aktif" : "Tidak Aktif"}
            </button>
          ))}
        </div>

        {/* Positions List */}
        <div className="space-y-4">
          {filteredPositions.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-muted)]">Tidak ada jabatan yang ditemukan</p>
            </Card>
          ) : (
            filteredPositions.map((position) => {
              const Icon = getPositionIcon(position.name)
              const color = getPositionColor(position.name)

              return (
                <Card
                  key={position.id}
                  className={cn(
                    "p-5 hover:shadow-lg transition-all cursor-pointer",
                    position.status === "inactive" && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-7 h-7" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                            {position.name}
                          </h3>
                          <Badge
                            variant={position.status === "active" ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {position.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </div>
                        <p className="text-[14px] text-[var(--text-muted)] mb-3">
                          {position.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[var(--text-muted)]" />
                          <span className="text-[13px] text-[var(--text-secondary)]">
                            {position.memberCount} anggota
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/pasukan-khusus/jabatan/${position.id}`)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOpenMenuId(openMenuId === position.id ? null : position.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {openMenuId === position.id && (
                          <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2 text-[var(--danger)]"
                            >
                              <Trash2 className="w-4 h-4" />
                              Nonaktifkan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                    <p className="text-[12px] font-medium text-[var(--text-muted)] mb-2">
                      Tanggung Jawab:
                    </p>
                    <ul className="space-y-1">
                      {position.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}
