"use client"

/**
 * Reading: Academic settings page dengan tab navigation
 * Bahasa visual: Card-based dengan tabbed interface
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { useState, useEffect } from "react"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useSettings } from "@/hooks/useSettings"
import { AttendanceScheduleSettings } from "@/components/settings/attendance-schedule-settings"
import {
  Plus,
  Trash2,
  Edit,
  Users,
  GraduationCap,
  Calendar,
  CalendarDays,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  School,
  Trophy,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  fetchMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "@/lib/classes"
import {
  fetchAcademicYears,
  createAcademicYear,
  setActiveAcademicYear,
  deleteAcademicYear,
} from "@/lib/academic-years"
import type { Class, Major, AcademicYear } from "@/types/database"

type TabType = "year" | "grading" | "major" | "class" | "schedule"

interface ClassFormData {
  name: string
  major_id: string
}

interface MajorFormData {
  name: string
  code: string
  description: string
}

function ClassFormModal({
  isOpen,
  onClose,
  onSuccess,
  classToEdit,
  majors,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classToEdit?: Class | null
  majors: Major[]
}) {
  const [formData, setFormData] = useState<ClassFormData>({ name: "", major_id: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (classToEdit) {
      setFormData({ name: classToEdit.name, major_id: classToEdit.major_id })
    } else {
      setFormData({ name: "", major_id: "" })
    }
    setError(null)
  }, [classToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let result
      if (classToEdit) {
        result = await updateClass(classToEdit.id, { name: formData.name, major_id: formData.major_id })
      } else {
        result = await createClass({ name: formData.name, major_id: formData.major_id })
      }

      if (!result.success) {
        setError(result.error)
        return
      }

      onSuccess()
      onClose()
    } catch {
      setError("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const majorOptions = majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={classToEdit ? "Edit Kelas" : "Tambah Kelas Baru"} description="Masukkan informasi kelas baru" size="md">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input label="Nama Kelas" placeholder="Contoh: TKJ 1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Select label="Jurusan" placeholder="Pilih Jurusan" value={formData.major_id} onChange={(e) => setFormData({ ...formData, major_id: e.target.value })} options={majorOptions} required />
        </div>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {classToEdit ? "Simpan Perubahan" : "Tambah Kelas"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

function MajorFormModal({
  isOpen,
  onClose,
  onSuccess,
  majorToEdit,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  majorToEdit?: Major | null
}) {
  const [formData, setFormData] = useState<MajorFormData>({ name: "", code: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (majorToEdit) {
      setFormData({ name: majorToEdit.name, code: majorToEdit.code, description: majorToEdit.description || "" })
    } else {
      setFormData({ name: "", code: "", description: "" })
    }
    setError(null)
  }, [majorToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let result
      if (majorToEdit) {
        result = await updateMajor(majorToEdit.id, { name: formData.name, code: formData.code, description: formData.description || undefined })
      } else {
        result = await createMajor({ name: formData.name, code: formData.code, description: formData.description || undefined })
      }

      if (!result.success) {
        setError(result.error)
        return
      }

      onSuccess()
      onClose()
    } catch {
      setError("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={majorToEdit ? "Edit Jurusan" : "Tambah Jurusan Baru"} description="Masukkan informasi jurusan" size="sm">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input label="Nama Jurusan" placeholder="Contoh: Teknik Komputer dan Jaringan" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Kode Jurusan" placeholder="Contoh: TKJ" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[var(--text-primary)]">Deskripsi (Opsional)</label>
            <textarea
              placeholder="Deskripsi jurusan"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-[18px] text-[15px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] resize-none"
            />
          </div>
        </div>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {majorToEdit ? "Simpan Perubahan" : "Tambah Jurusan"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="text-[var(--text-primary)]">{message}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </div>
      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Hapus
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default function AcademicSettingsPage() {
  const { settings, updateAcademicSettings } = useSettings()
  const { academic } = settings
  const [activeTab, setActiveTab] = useState<TabType>("year")
  const [majors, setMajors] = useState<Major[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loadingMajors, setLoadingMajors] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)
  const [showClassModal, setShowClassModal] = useState(false)
  const [showMajorModal, setShowMajorModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "class" | "major"; id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [editingMajor, setEditingMajor] = useState<Major | null>(null)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("")

  const activeYear = academicYears.find((y) => y.is_active)

  useEffect(() => {
    if (academicYears.length > 0 && !selectedAcademicYear) {
      const active = academicYears.find((y) => y.is_active)
      if (active) setSelectedAcademicYear(active.id)
      else setSelectedAcademicYear(academicYears[0].id)
    }
  }, [academicYears, selectedAcademicYear])

  useEffect(() => {
    if (activeTab === "year") fetchAcademicYearsData()
    else if (activeTab === "major") fetchMajorsData()
    else if (activeTab === "class") fetchClassesData()
  }, [activeTab])

  const fetchAcademicYearsData = async () => {
    setLoadingYears(true)
    try {
      const { data } = await fetchAcademicYears()
      setAcademicYears(data)
    } finally {
      setLoadingYears(false)
    }
  }

  const handleSetActiveYear = async (id: string) => {
    const result = await setActiveAcademicYear(id)
    if (result.success) fetchAcademicYearsData()
    else alert(result.error || "Gagal mengaktifkan tahun ajaran")
  }

  const handleCreateAcademicYear = async (data: { name: string; start_date: string; end_date: string }) => {
    const result = await createAcademicYear(data)
    if (result.success) fetchAcademicYearsData()
    else return result.error
    return null
  }

  const handleDeleteAcademicYear = async (id: string) => {
    const result = await deleteAcademicYear(id)
    if (result.success) fetchAcademicYearsData()
    else alert(result.error || "Gagal menghapus tahun ajaran")
  }

  const fetchMajorsData = async () => {
    setLoadingMajors(true)
    try {
      const { data } = await fetchMajors()
      setMajors(data)
    } finally {
      setLoadingMajors(false)
    }
  }

  const fetchClassesData = async () => {
    setLoadingClasses(true)
    try {
      const { data } = await fetchClasses()
      setClasses(data)
    } finally {
      setLoadingClasses(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      let result
      if (deleteTarget.type === "class") result = await deleteClass(deleteTarget.id)
      else result = await deleteMajor(deleteTarget.id)
      if (result?.success) {
        if (deleteTarget.type === "class") fetchClassesData()
        else fetchMajorsData()
      } else alert(result?.error || "Gagal menghapus data")
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      setDeleteTarget(null)
    }
  }

  const confirmDelete = (type: "class" | "major", id: string, name: string) => {
    setDeleteTarget({ type, id, name })
    setShowDeleteModal(true)
  }

  const openEditClass = (cls: Class) => {
    setEditingClass(cls)
    setShowClassModal(true)
  }

  const openEditMajor = (major: Major) => {
    setEditingMajor(major)
    setShowMajorModal(true)
  }

  const tabs = [
    { id: "year" as const, label: "Tahun Ajaran", icon: Calendar },
    { id: "grading" as const, label: "Sistem Penilaian", icon: Trophy },
    { id: "major" as const, label: "Jurusan", icon: BookOpen },
    { id: "class" as const, label: "Kelas", icon: Users },
    { id: "schedule" as const, label: "Jadwal Presensi", icon: CalendarDays },
  ]

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-[var(--surface-secondary)] rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200",
                active
                  ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "year" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-section-title">Tahun Ajaran</h2>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Aktif: <span className="font-medium text-[var(--primary)]">{activeYear?.name || "Tidak ada"}</span>
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => {
              const name = prompt("Nama Tahun Ajaran (contoh: 2025/2026):")
              if (name) {
                const startDate = prompt("Tanggal Mulai (YYYY-MM-DD):", "2025-07-15")
                const endDate = prompt("Tanggal Selesai (YYYY-MM-DD):", "2026-06-30")
                if (startDate && endDate) handleCreateAcademicYear({ name, start_date: startDate, end_date: endDate })
              }
            }}>
              <Plus className="w-4 h-4" /> Tambah Tahun Ajaran
            </Button>
          </div>
          {loadingYears ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
            </div>
          ) : (
            <div className="space-y-3">
              {academicYears.map((year) => (
                <div
                  key={year.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all duration-200",
                    year.is_active
                      ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", year.is_active ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]")}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{year.name}</p>
                      <p className="text-[12px] text-[var(--text-muted)]">{year.start_date} - {year.end_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {year.is_active ? (
                      <Badge className="bg-[var(--primary)]">Aktif</Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSetActiveYear(year.id)}>Jadikan Aktif</Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Hapus "${year.name}"?`)) handleDeleteAcademicYear(year.id) }} className="hover:bg-[var(--danger-soft)]">
                      <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                    </Button>
                  </div>
                </div>
              ))}
              {academicYears.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-[var(--surface-secondary)]">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
                  <p className="font-medium text-[var(--text-secondary)]">Belum ada tahun ajaran</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-1">Tambahkan tahun ajaran baru untuk memulai</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {activeTab === "grading" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--warning-soft)] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[var(--warning)]" />
              </div>
              <div>
                <h2 className="text-section-title">Skala Penilaian</h2>
                <p className="text-[12px] text-[var(--text-muted)]">{academic.gradingScale.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              {academic.gradingScale.intervals.map((interval) => (
                <div key={interval.grade} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/30 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ backgroundColor: interval.color }}>
                    {interval.grade}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{interval.description}</p>
                    <p className="text-[12px] text-[var(--text-muted)]">Nilai {interval.minScore} - {interval.maxScore}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {interval.isPassing ? (
                      <Badge className="bg-[var(--success)]>Lulus</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[var(--danger)] border-[var(--danger)]>Tidak Lulus</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--info-soft)] flex items-center justify-center">
                <Percent className="w-6 h-6 text-[var(--info)]" />
              </div>
              <div>
                <h2 className="text-section-title">Pengaturan Kelulusan</h2>
                <p className="text-[12px] text-[var(--text-muted)]>Atur standar kelulusan</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-secondary)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--success-soft)] flex items-center justify-center">
                    <Percent className="w-5 h-5 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]>Batas Kehadiran</p>
                    <p className="text-[12px] text-[var(--text-muted)]>Minimum kehadiran untuk lulus</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={academic.attendanceThreshold}
                    onChange={(e) => updateAcademicSettings({ attendanceThreshold: parseInt(e.target.value) || 80 })}
                    min={0} max={100}
                    className="w-20 h-10 px-3 border border-[var(--border)] rounded-xl text-center text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--primary)]"
                  />
                  <span className="text-[var(--text-muted)] font-medium>%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-secondary)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--warning-soft)] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[var(--warning)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]>Nilai Kelulusan</p>
                    <p className="text-[12px] text-[var(--text-muted)]>Minimum nilai untuk lulus</p>
                  </div>
                </div>
                <input
                  type="number"
                  value={academic.passingGrade}
                  onChange={(e) => updateAcademicSettings({ passingGrade: parseInt(e.target.value) || 75 })}
                  min={0} max={100}
                  className="w-20 h-10 px-3 border border-[var(--border)] rounded-xl text-center text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "major" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--success-soft)] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[var(--success)]" />
              </div>
              <div>
                <h2 className="text-section-title">Jurusan</h2>
                <p className="text-[12px] text-[var(--text-muted)]>Kelola jurusan di sekolah</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => { setEditingMajor(null); setShowMajorModal(true) }}>
              <Plus className="w-4 h-4" /> Tambah Jurusan
            </Button>
          </div>
          {loadingMajors ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
            </div>
          ) : (
            <div className="space-y-3">
              {majors.map((major) => (
                <div key={major.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white flex items-center justify-center font-bold text-lg">{major.code}</div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{major.name}</p>
                      {major.description && <p className="text-[12px] text-[var(--text-muted)]">{major.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditMajor(major)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete("major", major.id, major.name)}><Trash2 className="w-4 h-4 text-[var(--danger)] /></Button>
                  </div>
                </div>
              ))}
              {majors.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-[var(--surface-secondary)]">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
                  <p className="font-medium text-[var(--text-secondary)]">Belum ada jurusan</p>
                  <p className="text-[12px] text-[var(--text-muted)]">Tambahkan jurusan untuk membuat kelas</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {activeTab === "class" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <School className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="text-section-title">Daftar Kelas</h2>
                  <p className="text-[12px] text-[var(--text-muted)]">{classes.length} kelas</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => { setEditingClass(null); setShowClassModal(true) }} disabled={majors.length === 0}>
                <Plus className="w-4 h-4" /> Tambah Kelas
              </Button>
            </div>
            {loadingClasses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white flex items-center justify-center"><Users className="w-5 h-5" /></div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{cls.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{cls.majors?.code || cls.majors?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cls.status === "active" ? "default" : "secondary"}>{cls.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge>
                      <Button variant="ghost" size="icon" onClick={() => openEditClass(cls)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete("class", cls.id, cls.name)}><Trash2 className="w-4 h-4 text-[var(--danger)] /></Button>
                    </div>
                  </div>
                ))}
                {classes.length === 0 && (
                  <div className="text-center py-12 rounded-xl bg-[var(--surface-secondary)]">
                    <School className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
                    <p className="font-medium text-[var(--text-secondary)]">Belum ada kelas</p>
                    <p className="text-[12px] text-[var(--text-muted)]">{majors.length === 0 ? "Tambahkan jurusan terlebih dahulu" : "Tambahkan kelas baru"}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "schedule" && <AttendanceScheduleSettings />}

      <ClassFormModal isOpen={showClassModal} onClose={() => { setShowClassModal(false); setEditingClass(null) }} onSuccess={fetchClassesData} classToEdit={editingClass} majors={majors} />
      <MajorFormModal isOpen={showMajorModal} onClose={() => { setShowMajorModal(false); setEditingMajor(null) }} onSuccess={fetchMajorsData} majorToEdit={editingMajor} />
      <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteTarget(null) }} onConfirm={handleDelete} title={`Hapus ${deleteTarget?.type === "class" ? "Kelas" : "Jurusan"}`} message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"?`} isLoading={deleting} />
    </div>
  )
}
