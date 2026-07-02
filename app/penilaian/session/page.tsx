"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment } from "@/hooks/useAssessment"
import { type AssessmentSession, type SessionStatus } from "@/types/assessment"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Edit2,
  Copy,
  Trash2,
  MoreVertical,
  Lock,
  Unlock,
  FileText,
  Eye,
  Play,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AssessmentSessionPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { sessions, templates, categories, loading, statistics } = useAssessment()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | "">("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !selectedStatus || session.status === selectedStatus
      const matchesTemplate = !selectedTemplate || session.templateId === selectedTemplate
      return matchesSearch && matchesStatus && matchesTemplate
    })
  }, [sessions, searchQuery, selectedStatus, selectedTemplate])

  // Get template name
  const getTemplateName = (templateId: string) => {
    return templates.find((t) => t.id === templateId)?.name || "Template tidak ditemukan"
  }

  // Get status badge
  const getStatusBadge = (status: SessionStatus) => {
    const config: Record<SessionStatus, { label: string; variant: "success" | "warning" | "info" | "secondary" | "danger"; icon: React.ReactNode }> = {
      draft: { label: "Draft", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      open: { label: "Buka", variant: "info", icon: <Play className="w-3 h-3" /> },
      in_progress: { label: "Berlangsung", variant: "warning", icon: <Clock className="w-3 h-3" /> },
      completed: { label: "Selesai", variant: "success", icon: <CheckCircle2 className="w-3 h-3" /> },
      reviewed: { label: "Ditinjau", variant: "info", icon: <Eye className="w-3 h-3" /> },
      locked: { label: "Terkunci", variant: "secondary", icon: <Lock className="w-3 h-3" /> },
      archived: { label: "Arsip", variant: "secondary", icon: <FileText className="w-3 h-3" /> },
    }
    const { label, variant, icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        {icon}
        {label}
      </Badge>
    )
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
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
      title="Sesi Penilaian"
      description="Kelola sesi penilaian untuk setiap template"
      breadcrumbs={[
        { label: "Penilaian", href: "/penilaian" },
        { label: "Sesi" },
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
                placeholder="Cari sesi..."
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
          <Button
            onClick={() => router.push("/penilaian/session/baru")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Sesi Baru
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sesi"
            value={statistics.totalSessions}
            color="primary"
          />
          <StatCard
            title="Sesi Aktif"
            value={statistics.activeSessions}
            color="info"
          />
          <StatCard
            title="Selesai"
            value={statistics.completedSessions}
            color="success"
          />
          <StatCard
            title="Draft"
            value={statistics.draftSessions}
            color="warning"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as SessionStatus | "")}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="open">Buka</option>
                  <option value="in_progress">Berlangsung</option>
                  <option value="completed">Selesai</option>
                  <option value="reviewed">Ditinjau</option>
                  <option value="locked">Terkunci</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Template</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedStatus("")
                    setSelectedTemplate("")
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {(selectedStatus || selectedTemplate) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
            {selectedStatus && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedStatus("")}>
                Status: {selectedStatus}
              </Badge>
            )}
            {selectedTemplate && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedTemplate("")}>
                Template: {getTemplateName(selectedTemplate)}
              </Badge>
            )}
          </div>
        )}

        {/* Sessions Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Nama Sesi
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Template
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Tanggal
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--border-light)]">
                      <td className="px-6 py-4"><div className="w-40 h-4 bg-[var(--surface-hover)] rounded animate-pulse" /></td>
                      <td className="px-4 py-4"><div className="w-32 h-4 bg-[var(--surface-hover)] rounded animate-pulse" /></td>
                      <td className="px-4 py-4"><div className="w-24 h-4 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                      <td className="px-4 py-4"><div className="w-20 h-6 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                      <td className="px-4 py-4"><div className="w-16 h-8 bg-[var(--surface-hover)] rounded animate-pulse mx-auto" /></td>
                    </tr>
                  ))
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-[15px] font-medium text-[var(--text-primary)]">
                          {searchQuery || selectedStatus || selectedTemplate
                            ? "Sesi tidak ditemukan"
                            : "Belum ada sesi penilaian"}
                        </p>
                        <p className="text-[13px] text-[var(--text-muted)]">
                          {searchQuery || selectedStatus || selectedTemplate
                            ? "Coba ubah filter pencarian"
                            : "Mulai dengan membuat sesi penilaian baru"}
                        </p>
                        {!searchQuery && !selectedStatus && !selectedTemplate && (
                          <Button onClick={() => router.push("/penilaian/session/baru")}>
                            <Plus className="w-4 h-4" />
                            Buat Sesi
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      templateName={getTemplateName(session.templateId)}
                      onView={() => router.push(`/penilaian/session/${session.id}`)}
                      onInputScores={() => router.push(`/penilaian/input?session=${session.id}`)}
                      onEdit={() => router.push(`/penilaian/session/${session.id}/edit`)}
                      onDuplicate={() => {}}
                      onLockToggle={() => {}}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Session Row Component
function SessionRow({
  session,
  templateName,
  onView,
  onInputScores,
  onEdit,
  onDuplicate,
  onLockToggle,
  getStatusBadge,
}: {
  session: AssessmentSession
  templateName: string
  onView: () => void
  onInputScores: () => void
  onEdit: () => void
  onDuplicate: () => void
  onLockToggle: () => void
  getStatusBadge: (status: SessionStatus) => React.ReactNode
}) {
  const [showMenu, setShowMenu] = useState(false)

  const canInputScores = session.status === "open" || session.status === "in_progress"
  const canEdit = !session.locked && session.status !== "locked" && session.status !== "archived"

  return (
    <tr className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[var(--text-primary)]">{session.name}</p>
            <p className="text-[12px] text-[var(--text-muted)]">ID: {session.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-[14px] text-[var(--text-primary)]">
        {templateName}
      </td>
      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
        {session.startDate ? new Date(session.startDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) : "-"}
      </td>
      <td className="px-4 py-4 text-center">
        {getStatusBadge(session.status)}
        {session.locked && (
          <Lock className="w-4 h-4 text-[var(--text-muted)] ml-1 inline" />
        )}
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1">
          {canInputScores && (
            <Button variant="ghost" size="sm" onClick={onInputScores} title="Input Nilai">
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onView} title="Lihat">
            <Eye className="w-4 h-4" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                {canEdit && (
                  <>
                    <button
                      onClick={() => { onEdit(); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => { onInputScores(); setShowMenu(false) }}
                      className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Input Nilai
                    </button>
                  </>
                )}
                <button
                  onClick={() => { onDuplicate(); setShowMenu(false) }}
                  className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Duplikat
                </button>
                <button
                  onClick={() => { onLockToggle(); setShowMenu(false) }}
                  className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                >
                  {session.locked ? (
                    <><Unlock className="w-4 h-4" /> Buka Kunci</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Kunci</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
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
  color: "primary" | "success" | "warning" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card className="p-4">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <p className={cn("text-2xl font-bold", colors[color].split(" ")[1])}>
        {value}
      </p>
    </Card>
  )
}
