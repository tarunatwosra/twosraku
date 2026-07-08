"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalFooter } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useSettings } from "@/hooks/useSettings"
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Users,
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle,
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
import type { Class, Major } from "@/types/database"

// ============================================
// TYPES
// ============================================

type TabType = "year" | "grading" | "major" | "class"

interface ClassFormData {
  name: string
  major_id: string
  room_number: string
  academic_year_id: string
}

interface MajorFormData {
  name: string
  code: string
  description: string
}

// ============================================
// CLASS FORM MODAL
// ============================================

function ClassFormModal({
  isOpen,
  onClose,
  onSuccess,
  classToEdit,
  majors,
  academicYearId,
  academicYears,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classToEdit?: Class | null
  majors: Major[]
  academicYearId?: string
  academicYears?: { id: string; name: string }[]
}) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    major_id: "",
    room_number: "",
    academic_year_id: academicYearId || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (classToEdit) {
      setFormData({
        name: classToEdit.name,
        major_id: classToEdit.major_id,
        room_number: classToEdit.room_number || "",
        academic_year_id: classToEdit.academic_year_id || "",
      })
    } else {
      setFormData({
        name: "",
        major_id: "",
        room_number: "",
        academic_year_id: academicYearId || "",
      })
    }
    setError(null)
  }, [classToEdit, isOpen, academicYearId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let result
      if (classToEdit) {
        result = await updateClass(classToEdit.id, {
          name: formData.name,
          major_id: formData.major_id,
          room_number: formData.room_number || null,
        })
      } else {
        result = await createClass({
          name: formData.name,
          major_id: formData.major_id,
          academic_year_id: formData.academic_year_id,
          room_number: formData.room_number || undefined,
        })
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classToEdit ? "Edit Kelas" : "Tambah Kelas Baru"}
      description="Masukkan informasi kelas baru"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Nama Kelas"
            placeholder="Contoh: TKJ 1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Jurusan"
            placeholder="Pilih Jurusan"
            value={formData.major_id}
            onChange={(e) => setFormData({ ...formData, major_id: e.target.value })}
            options={majorOptions}
            required
          />

          {!classToEdit && academicYears && (
            <Select
              label="Tahun Ajaran"
              placeholder="Pilih Tahun Ajaran"
              value={formData.academic_year_id}
              onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
              options={academicYears.map((y) => ({ value: y.id, label: y.name }))}
              required
            />
          )}

          <Input
            label="Nomor Ruang (Opsional)"
            placeholder="Contoh: R-101"
            value={formData.room_number}
            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {classToEdit ? "Simpan Perubahan" : "Tambah Kelas"}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

// ============================================
// MAJOR FORM MODAL
// ============================================

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
  const [formData, setFormData] = useState<MajorFormData>({
    name: "",
    code: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (majorToEdit) {
      setFormData({
        name: majorToEdit.name,
        code: majorToEdit.code,
        description: majorToEdit.description || "",
      })
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
      })
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
        result = await updateMajor(majorToEdit.id, {
          name: formData.name,
          code: formData.code,
          description: formData.description || undefined,
        })
      } else {
        result = await createMajor({
          name: formData.name,
          code: formData.code,
          description: formData.description || undefined,
        })
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={majorToEdit ? "Edit Jurusan" : "Tambah Jurusan Baru"}
      description="Masukkan informasi jurusan"
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Nama Jurusan"
            placeholder="Contoh: Teknik Komputer dan Jaringan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Kode Jurusan"
            placeholder="Contoh: TKJ"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[var(--text-primary)]">
              Deskripsi (Opsional)
            </label>
            <textarea
              placeholder="Deskripsi jurusan"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className={cn(
                "w-full px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[15px] text-[var(--text-primary)]",
                "transition-all duration-200",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                "resize-none"
              )}
            />
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {majorToEdit ? "Simpan Perubahan" : "Tambah Jurusan"}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

// ============================================
// CONFIRM DELETE MODAL
// ============================================

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
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </div>
      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menghapus...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Hapus
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function AcademicSettingsPage() {
  const { settings, updateAcademicSettings } = useSettings()
  const { academic } = settings
  const [activeTab, setActiveTab] = useState<TabType>("year")

  // Data state
  const [majors, setMajors] = useState<Major[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loadingMajors, setLoadingMajors] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)

  // Modal state
  const [showClassModal, setShowClassModal] = useState(false)
  const [showMajorModal, setShowMajorModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "class" | "major"
    id: string
    name: string
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Edit state
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [editingMajor, setEditingMajor] = useState<Major | null>(null)

  // Filter state
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(
    academic.activeAcademicYear || ""
  )

  const activeYear = academic.academicYears.find((y) => y.id === academic.activeAcademicYear)

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "major") {
      fetchMajorsData()
    } else if (activeTab === "class") {
      fetchClassesData()
    }
  }, [activeTab, selectedAcademicYear])

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
      const { data } = await fetchClasses({
        academicYearId: selectedAcademicYear || undefined,
      })
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
      switch (deleteTarget.type) {
        case "class":
          result = await deleteClass(deleteTarget.id)
          break
        case "major":
          result = await deleteMajor(deleteTarget.id)
          break
      }

      if (result?.success) {
        if (deleteTarget.type === "class") {
          fetchClassesData()
        } else {
          fetchMajorsData()
        }
      } else {
        alert(result?.error || "Gagal menghapus data")
      }
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

  return (
    <AppShell title="Pengaturan Akademik" description="Konfigurasi tahun ajaran dan pengaturan lainnya">
      <div className="max-w-4xl">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("year")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "year"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Tahun Ajaran
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "grading"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Sistem Penilaian
          </button>
          <button
            onClick={() => setActiveTab("major")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "major"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Jurusan
          </button>
          <button
            onClick={() => setActiveTab("class")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "class"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Kelas
          </button>
        </div>

        {/* Academic Years Tab */}
        {activeTab === "year" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-section-title">
                  Tahun Ajaran
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Aktif: {activeYear?.name || "Tidak ada"}
                </p>
              </div>
              <Button variant="outline" className="gap-2" disabled>
                <Plus className="w-4 h-4" />
                Tambah Tahun Ajaran
              </Button>
            </div>

            <div className="space-y-3">
              {academic.academicYears.map((year) => (
                <div
                  key={year.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors",
                    year.id === academic.activeAcademicYear
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        year.id === academic.activeAcademicYear
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                      )}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{year.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {year.startDate} - {year.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {year.id === academic.activeAcademicYear ? (
                      <Badge className="bg-[var(--primary)]">Aktif</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateAcademicSettings({ activeAcademicYear: year.id })}
                      >
                        Jadikan Aktif
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {academic.academicYears.length === 0 && (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada tahun ajaran</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Grading Scale Tab */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-section-title">
                    Skala Penilaian
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">{academic.gradingScale.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                {academic.gradingScale.intervals.map((interval) => (
                  <div
                    key={interval.grade}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)]"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: interval.color }}
                    >
                      {interval.grade}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)]">
                        {interval.description}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {interval.minScore} - {interval.maxScore}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {interval.isPassing ? (
                        <Badge className="bg-[var(--success)]">Lulus</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[var(--danger)] border-[var(--danger)]">
                          Tidak Lulus
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-section-title mb-6">
                Pengaturan Lainnya
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Batas Kehadiran</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Minimum kehadiran untuk lulus
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={academic.attendanceThreshold}
                      onChange={(e) =>
                        updateAcademicSettings({
                          attendanceThreshold: parseInt(e.target.value) || 80,
                        })
                      }
                      className="w-20 px-3 py-2 border border-[var(--border)] rounded-lg text-center"
                      min={0}
                      max={100}
                    />
                    <span className="text-[var(--text-muted)]">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Nilai Kelulusan</p>
                    <p className="text-sm text-[var(--text-muted)]">Minimum nilai untuk lulus</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={academic.passingGrade}
                      onChange={(e) =>
                        updateAcademicSettings({
                          passingGrade: parseInt(e.target.value) || 75,
                        })
                      }
                      className="w-20 px-3 py-2 border border-[var(--border)] rounded-lg text-center"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Majors Tab */}
        {activeTab === "major" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-section-title">Jurusan</h2>
                <p className="text-sm text-[var(--text-muted)]">Kelola jurusan di sekolah</p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setEditingMajor(null)
                  setShowMajorModal(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Tambah Jurusan
              </Button>
            </div>

            {loadingMajors ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
              </div>
            ) : (
              <div className="space-y-3">
                {majors.map((major) => (
                  <div
                    key={major.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
                        <span className="font-bold">{major.code}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{major.name}</p>
                        {major.description && (
                          <p className="text-sm text-[var(--text-muted)]">
                            {major.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditMajor(major)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete("major", major.id, major.name)}
                      >
                        <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                      </Button>
                    </div>
                  </div>
                ))}
                {majors.length === 0 && (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada jurusan</p>
                    <p className="text-sm">Tambahkan jurusan untuk membuat kelas</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Classes Tab */}
        {activeTab === "class" && (
          <div className="space-y-6">
            {/* Filter */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Select
                  label="Tahun Ajaran"
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  options={academic.academicYears.map((y) => ({
                    value: y.id,
                    label: y.name,
                  }))}
                />
              </div>
            </Card>

            {/* Classes List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-section-title">
                    Daftar Kelas
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {classes.length} kelas untuk tahun ajaran aktif
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setEditingClass(null)
                    setShowClassModal(true)
                  }}
                  disabled={!selectedAcademicYear || majors.length === 0}
                >
                  <Plus className="w-4 h-4" />
                  Tambah Kelas
                </Button>
              </div>

              {loadingClasses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--primary-soft)] text-[var(--primary)]">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{cls.name}</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {cls.majors?.code || cls.majors?.name}
                            {cls.room_number && ` • Ruang ${cls.room_number}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                          {cls.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => openEditClass(cls)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete("class", cls.id, cls.name)}
                        >
                          <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada kelas</p>
                      <p className="text-sm">
                        {majors.length === 0
                          ? "Tambahkan jurusan terlebih dahulu"
                          : "Tambahkan kelas baru"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ClassFormModal
        isOpen={showClassModal}
        onClose={() => {
          setShowClassModal(false)
          setEditingClass(null)
        }}
        onSuccess={fetchClassesData}
        academicYearId={selectedAcademicYear}
        classToEdit={editingClass}
        majors={majors}
        academicYears={academic.academicYears}
      />

      <MajorFormModal
        isOpen={showMajorModal}
        onClose={() => {
          setShowMajorModal(false)
          setEditingMajor(null)
        }}
        onSuccess={fetchMajorsData}
        majorToEdit={editingMajor}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDelete}
        title={`Hapus ${deleteTarget?.type === "class" ? "Kelas" : "Jurusan"}`}
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"?`}
        isLoading={deleting}
      />
    </AppShell>
  )
}
