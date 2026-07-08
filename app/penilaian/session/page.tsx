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
  X,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<SessionStatus, { label: string; variant: "success" | "warning" | "info" | "secondary" | "danger"; icon: React.ReactNode }> = {
  draft: { label: "Draft", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
  open: { label: "Buka", variant: "info", icon: <Play className="w-3 h-3" /> },
  in_progress: { label: "Berlangsung", variant: "warning", icon: <Clock className="w-3 h-3" /> },
  completed: { label: "Selesai", variant: "success", icon: <CheckCircle2 className="w-3 h-3" /> },
  reviewed: { label: "Ditinjau", variant: "info", icon: <Eye className="w-3 h-3" /> },
  locked: { label: "Terkunci", variant: "secondary", icon: <Lock className="w-3 h-3" /> },
  archived: { label: "Arsip", variant: "secondary", icon: <FileText className="w-3 h-3" /> },
}

export default function AssessmentSessionPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { sessions, templates, categories, loading, createSession, updateSession, lockSession, unlockSession, deleteSession, refresh } = useAssessment()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | "">("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingSession, setEditingSession] = useState<AssessmentSession | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    templateId: "",
    name: "",
    academicYearId: "",
    semesterId: "",
    classId: "",
    evaluatorId: "",
    startDate: "",
    endDate: "",
    notes: "",
  })

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

  // Get template color
  const getTemplateColor = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    return template?.categoryId ? categories.find((c) => c.id === template.categoryId)?.color || "#6B7280" : "#6B7280"
  }

  // Open create modal
  const handleCreate = () => {
    setEditingSession(null)
    setFormData({
      templateId: templates[0]?.id || "",
      name: "",
      academicYearId: "",
      semesterId: "",
      classId: "",
      evaluatorId: "",
      startDate: "",
      endDate: "",
      notes: "",
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleEdit = (session: AssessmentSession) => {
    setEditingSession(session)
    setFormData({
      templateId: session.templateId,
      name: session.name,
      academicYearId: session.academicYearId,
      semesterId: session.semesterId || "",
      classId: session.classId || "",
      evaluatorId: session.evaluatorId,
      startDate: session.startDate?.split("T")[0] || "",
      endDate: session.endDate?.split("T")[0] || "",
      notes: session.notes || "",
    })
    setShowModal(true)
    setOpenMenuId(null)
  }

  // Handle lock/unlock
  const handleLockToggle = async (session: AssessmentSession) => {
    if (session.isLocked) {
      if (!confirm(`Buka kunci sesi "${session.name}"?`)) return
      await unlockSession(session.id)
    } else {
      if (!confirm(`Kunci sesi "${session.name}"? Data tidak bisa diedit setelah dikunci.`)) return
      await lockSession(session.id)
    }
    refresh()
    setOpenMenuId(null)
  }

  // Handle delete
  const handleDelete = async (session: AssessmentSession) => {
    if (session.isLocked) {
      alert("Tidak bisa menghapus sesi yang terkunci")
      return
    }
    if (!confirm(`Yakin ingin menghapus sesi "${session.name}"?`)) return

    const result = await deleteSession(session.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus sesi")
    }
    setOpenMenuId(null)
  }

  // Handle duplicate
  const handleDuplicate = async (session: AssessmentSession) => {
    const result = await createSession({
      templateId: session.templateId,
      name: `${session.name} (Copy)`,
      academicYearId: session.academicYearId,
      semesterId: session.semesterId,
      classId: session.classId,
      evaluatorId: session.evaluatorId,
      startDate: session.startDate,
      endDate: session.endDate,
    })
    if (!result.success) {
      alert(result.error || "Gagal menduplikasi sesi")
    }
    setOpenMenuId(null)
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Nama sesi wajib diisi")
      return
    }
    if (!formData.templateId) {
      alert("Template wajib dipilih")
      return
    }

    setModalLoading(true)
    try {
      let result
      if (editingSession) {
        result = await updateSession(editingSession.id, {
          name: formData.name,
          templateId: formData.templateId,
          academicYearId: formData.academicYearId || undefined,
          semesterId: formData.semesterId || undefined,
          classId: formData.classId || undefined,
          evaluatorId: formData.evaluatorId || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          notes: formData.notes || undefined,
        })
      } else {
        result = await createSession({
          templateId: formData.templateId,
          name: formData.name,
          academicYearId: formData.academicYearId || "1",
          semesterId: formData.semesterId || "1",
          classId: formData.classId || undefined,
          evaluatorId: formData.evaluatorId || "system",
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          notes: formData.notes || undefined,
        })
      }

      if (result.success) {
        setShowModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan sesi")
      }
    } finally {
      setModalLoading(false)
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [openMenuId])

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
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Sesi Baru
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Sesi" value={sessions.length} color="primary" />
          <StatCard title="Sesi Aktif" value={sessions.filter((s) => s.status === "open" || s.status === "in_progress").length} color="info" />
          <StatCard title="Selesai" value={sessions.filter((s) => s.status === "completed" || s.status === "locked").length} color="success" />
          <StatCard title="Draft" value={sessions.filter((s) => s.status === "draft").length} color="warning" />
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
                {statusConfig[selectedStatus as SessionStatus]?.label || selectedStatus}
              </Badge>
            )}
            {selectedTemplate && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedTemplate("")}>
                {getTemplateName(selectedTemplate)}
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
                          <Button onClick={handleCreate}>
                            <Plus className="w-4 h-4" />
                            Buat Sesi
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const templateColor = getTemplateColor(session.templateId)
                    const config = statusConfig[session.status as SessionStatus]
                    return (
                      <tr key={session.id} className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[var(--primary)]" />
                            </div>
                            <div>
                              <p className="text-[14px] font-medium text-[var(--text-primary)]">{session.name}</p>
                              <p className="text-[12px] text-[var(--text-muted)]">
                                {session.classId ? `Kelas: ${session.classId}` : "Semua kelas"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="primary"
                            className="text-[11px]"
                            style={{ backgroundColor: `${templateColor}20`, color: templateColor }}
                          >
                            {getTemplateName(session.templateId)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
                          {session.startDate
                            ? new Date(session.startDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant={config.variant} className="gap-1">
                            {config.icon}
                            {config.label}
                          </Badge>
                          {session.isLocked && (
                            <Lock className="w-4 h-4 text-[var(--text-muted)] ml-1 inline" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {session.status === "open" || session.status === "in_progress" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/penilaian/input?session=${session.id}`)}
                                title="Input Nilai"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/penilaian/input?session=${session.id}`)}
                                title="Lihat"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(openMenuId === session.id ? null : session.id)
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              {openMenuId === session.id && (
                                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                                  <button
                                    onClick={() => handleEdit(session)}
                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleLockToggle(session)}
                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                                  >
                                    {session.isLocked ? (
                                      <><Unlock className="w-4 h-4" /> Buka Kunci</>
                                    ) : (
                                      <><Lock className="w-4 h-4" /> Kunci</>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(session)}
                                    className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                                  >
                                    <Copy className="w-4 h-4" /> Duplikat
                                  </button>
                                  <button
                                    onClick={() => handleDelete(session)}
                                    className="w-full px-4 py-2 text-left text-[14px] text-[var(--danger)] hover:bg-[var(--danger-soft)] flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" /> Hapus
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {editingSession ? "Edit Sesi" : "Sesi Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Template */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Template <span className="text-[var(--danger)]">*</span>
                </label>
                <select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  disabled={editingSession?.isLocked}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] disabled:opacity-50"
                >
                  <option value="">Pilih Template</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Nama Sesi <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Inspeksi Minggu 1"
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit} isLoading={modalLoading}>
                {editingSession ? "Simpan" : "Buat"}
              </Button>
            </div>
          </div>
        </div>
      )}
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
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </Card>
  )
}
