"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Loader2,
  AlertCircle,
  MoreVertical,
  Printer,
  Download,
  History,
  GraduationCap,
  ArrowRightLeft,
  Clock,
  UserPlus,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Card, Button, Badge, Avatar } from "@/components/ui"
import { useStudent, useAcademicYear } from "@/hooks"
import { archiveStudent } from "../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"
import { DocumentsTab } from "@/components/buku-induk/DocumentsTab"
import { AttendanceSummary } from "@/components/buku-induk/AttendanceSummary"
import { AssessmentSummary } from "@/components/buku-induk/AssessmentSummary"
import { CharacterSummary } from "@/components/buku-induk/CharacterSummary"
import { PrintStudentCardButton } from "@/components/buku-induk/PrintStudentCard"

// ============================================
// STATUS HELPERS
// ============================================

const STATUS_VARIANTS = {
  active: "success",
  graduated: "info",
  transferred: "warning",
  prospective: "primary",
  archived: "neutral",
} as const

const STATUS_LABELS = {
  active: "Aktif",
  graduated: "Lulus",
  transferred: "Pindah",
  prospective: "Calon Siswa",
  archived: "Diarsipkan",
} as const

const GENDER_LABELS = {
  male: "Laki-laki",
  female: "Perempuan",
} as const

// ============================================
// FORMAT HELPERS
// ============================================

function formatDate(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatAge(birthDate: string | null): string {
  if (!birthDate) return "-"
  const birth = new Date(birthDate)
  const today = new Date()
  const age = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  return `${age} tahun`
}

// ============================================
// COMPONENTS
// ============================================

function StudentHeader({ student }: { student: StudentWithClass }) {
  const router = useRouter()
  const { academicYear } = useAcademicYear()
  const [showActions, setShowActions] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  // Get active class
  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )
  const className = activeClass?.classes
    ? `${activeClass.classes.grades?.name || ""} ${activeClass.classes.majors?.name || ""}`.trim()
    : "-"

  const handleArchive = async () => {
    if (!confirm("Apakah Anda yakin ingin mengarsipkan siswa ini?")) return

    setIsArchiving(true)
    const result = await archiveStudent(student.id)
    setIsArchiving(false)

    if (result.success) {
      router.push("/buku-induk")
    } else {
      alert(result.error || "Gagal mengarsipkan siswa")
    }
  }

  return (
    <Card padding="lg" className="relative">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <Avatar
          fallback={student.full_name}
          src={student.photo_url}
          size="lg"
          className="w-24 h-24 text-2xl bg-[var(--primary-soft)] text-[var(--primary)]"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {student.full_name}
                </h2>
                <Badge variant={STATUS_VARIANTS[student.status] || "neutral"}>
                  {STATUS_LABELS[student.status] || student.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>NIS: {student.student_number}</span>
                </div>
                {student.national_id && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>NIK: {student.national_id}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                  {GENDER_LABELS[student.gender] || student.gender}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                  {formatDate(student.birth_date)} ({formatAge(student.birth_date)})
                </div>
                {student.birth_place && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.birth_place}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                  {className}
                </div>
                {student.email && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.email}
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                    {student.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-[18px] shadow-lg border border-[var(--border-light)] py-2 min-w-[160px]">
                    <Link
                      href={`/buku-induk/${student.id}/edit`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Data
                    </Link>
                    <PrintStudentCardButton
                      student={student}
                      academicYearName={academicYear?.name}
                    />
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                      <Download className="w-4 h-4" />
                      Download Data
                    </button>
                    <Link
                      href={`/buku-induk/${student.id}/history`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <History className="w-4 h-4" />
                      Riwayat
                    </Link>
                    <div className="border-t border-[var(--border-light)] my-2" />
                    <button
                      onClick={handleArchive}
                      disabled={isArchiving || student.status === "archived"}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isArchiving ? "Mengarsipkan..." : "Arsipkan"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function InfoItem({
  label,
  value,
  fullWidth,
}: {
  label: string
  value: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-medium">
        {value || "-"}
      </p>
    </div>
  )
}

function PersonalInfoSection({ student }: { student: StudentWithClass }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="NIS" value={student.student_number} />
      {student.national_id && <InfoItem label="NIK" value={student.national_id} />}
      <InfoItem label="Nama Lengkap" value={student.full_name} />
      {student.nickname && <InfoItem label="Nama Panggilan" value={student.nickname} />}
      <InfoItem label="Jenis Kelamin" value={GENDER_LABELS[student.gender]} />
      {student.birth_place && <InfoItem label="Tempat Lahir" value={student.birth_place} />}
      <InfoItem label="Tanggal Lahir" value={formatDate(student.birth_date)} />
      {student.religion && <InfoItem label="Agama" value={student.religion} />}
      {student.nationality && <InfoItem label="Kewarganegaraan" value={student.nationality} />}
      {student.blood_type && <InfoItem label="Golongan Darah" value={student.blood_type} />}
      <InfoItem
        label="Alamat"
        value={student.address}
        fullWidth
      />
      <InfoItem label="No. Telepon" value={student.phone} />
      <InfoItem label="Email" value={student.email} />
    </div>
  )
}

function AcademicInfoSection({ student }: { student: StudentWithClass }) {
  const { academicYear } = useAcademicYear()

  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )

  const getAllClasses = () => {
    return student.student_classes?.map((sc) => ({
      year: sc.academic_year_id,
      class: sc.classes
        ? `${sc.classes.grades?.name || ""} ${sc.classes.majors?.name || ""}`.trim()
        : "-",
      status: sc.status,
      attendanceNumber: sc.attendance_number,
    })) || []
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="NIS" value={student.student_number} />
        <InfoItem label="Tahun Masuk" value={student.enrollment_year?.toString()} />
        <InfoItem label="Status" value={STATUS_LABELS[student.status]} />
        {student.graduation_year && (
          <InfoItem label="Tahun Lulus" value={student.graduation_year.toString()} />
        )}
        {activeClass && (
          <>
            <InfoItem
              label="Kelas"
              value={
                activeClass.classes
                  ? `${activeClass.classes.grades?.name || ""} ${activeClass.classes.majors?.name || ""}`.trim()
                  : "-"
              }
            />
            <InfoItem label="No. Absen" value={activeClass.attendance_number?.toString()} />
          </>
        )}
      </div>

      {/* Riwayat Kelas */}
      {getAllClasses().length > 1 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Riwayat Kelas
          </h4>
          <div className="space-y-2">
            {getAllClasses().map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-[var(--surface-secondary)] rounded-[12px]"
              >
                <span className="text-sm text-[var(--text-primary)]">{item.class}</span>
                <Badge variant={item.status === "active" ? "success" : "neutral"}>
                  {item.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ParentInfoSection({ student }: { student: StudentWithClass }) {
  const parents = student.parents || []

  const father = parents.find((p) => p.type === "father")
  const mother = parents.find((p) => p.type === "mother")
  const guardian = parents.find((p) => p.type === "guardian")

  const renderParentCard = (
    type: string,
    label: string,
    parent: (typeof parents)[0] | undefined
  ) => (
    <Card padding="md" className="bg-[var(--surface-secondary)]">
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Data {label}
      </h4>
      {parent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Nama Lengkap" value={parent.full_name} />
          {parent.nik && <InfoItem label="NIK" value={parent.nik} />}
          {parent.occupation && <InfoItem label="Pekerjaan" value={parent.occupation} />}
          {parent.education && <InfoItem label="Pendidikan" value={parent.education} />}
          {parent.phone && <InfoItem label="No. Telepon" value={parent.phone} />}
          {parent.email && <InfoItem label="Email" value={parent.email} />}
          {parent.address && (
            <InfoItem label="Alamat" value={parent.address} fullWidth />
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Data {label} belum diisi</p>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      {renderParentCard("father", "Ayah", father)}
      {renderParentCard("mother", "Ibu", mother)}
      {guardian && renderParentCard("guardian", "Wali", guardian)}
    </div>
  )
}

// ============================================
// GUARDIAN SECTION
// ============================================

function GuardianSection({ student }: { student: StudentWithClass }) {
  const parents = student.parents || []
  const guardian = parents.find((p) => p.type === "guardian")

  // Get main guardian info from parents OR show empty state
  const renderGuardianCard = () => {
    if (guardian) {
      return (
        <Card padding="lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
              <User className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                {guardian.full_name}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Wali Siswa</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guardian.nik && <InfoItem label="NIK" value={guardian.nik} />}
                {guardian.occupation && <InfoItem label="Pekerjaan" value={guardian.occupation} />}
                {guardian.education && <InfoItem label="Pendidikan Terakhir" value={guardian.education} />}
                {guardian.phone && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">No. Telepon</p>
                    <p className="text-sm text-[var(--text-primary)] font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                      {guardian.phone}
                    </p>
                  </div>
                )}
                {guardian.email && (
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                    <p className="text-sm text-[var(--text-primary)] font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                      {guardian.email}
                    </p>
                  </div>
                )}
                {guardian.address && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Alamat</p>
                    <p className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5" />
                      {guardian.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <Card padding="lg" className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Data Wali Belum Tersedia
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Belum ada data wali yang diisi untuk siswa ini
        </p>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
          Tambah Data Wali
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {renderGuardianCard()}

      <Card padding="md">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Catatan Wali
        </h4>
        <div className="bg-[var(--surface-secondary)] rounded-[12px] p-4">
          <p className="text-sm text-[var(--text-muted)]">
            Jika siswa tidak diasuh oleh orang tua kandung, wali yang ditunjuk bertanggung jawab penuh
            terhadap pendidikan dan perkembangan siswa selama di sekolah.
          </p>
        </div>
      </Card>
    </div>
  )
}

// ============================================
// ACTIVITY TIMELINE SECTION
// ============================================

interface ActivityItem {
  id: string
  type: "enrollment" | "status_change" | "class_change" | "graduation" | "transfer" | "character" | "attendance" | "assessment"
  title: string
  description: string
  date: string
  icon: React.ReactNode
  variant: "success" | "info" | "warning" | "danger" | "neutral"
}

function ActivitySection({ student }: { student: StudentWithClass }) {
  const generateTimeline = (): ActivityItem[] => {
    const items: ActivityItem[] = []

    // Enrollment
    if (student.enrollment_year) {
      items.push({
        id: "enrollment",
        type: "enrollment",
        title: "Pendaftaran Siswa Baru",
        description: `Masuk sebagai siswa baru tahun ajaran ${student.enrollment_year}`,
        date: student.created_at,
        icon: <UserPlus className="w-4 h-4" />,
        variant: "success",
      })
    }

    // Class history
    const classHistory = [...(student.student_classes || [])]
      .filter((sc) => sc.start_date)
      .sort((a, b) => new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime())

    classHistory.forEach((sc, index) => {
      const className = sc.classes
        ? `${sc.classes.grades?.name || ""} ${sc.classes.majors?.name || ""}`.trim()
        : "Kelas"

      items.push({
        id: `class-${sc.id}`,
        type: "class_change",
        title: index === 0 ? "Kelas Saat Ini" : "perpindahan Kelas",
        description: index === 0 ? `Di kelas ${className}` : `Pindah ke ${className}`,
        date: sc.start_date || student.updated_at,
        icon: <BookOpen className="w-4 h-4" />,
        variant: index === 0 ? "success" : "info",
      })
    })

    // Status changes
    if (student.status === "graduated") {
      items.push({
        id: "graduation",
        type: "graduation",
        title: "Kelulusan",
        description: student.graduation_year ? `Lulus tahun ${student.graduation_year}` : "Telah menyelesaikan pendidikan",
        date: student.graduation_year ? `${student.graduation_year}-06-01` : student.updated_at,
        icon: <GraduationCap className="w-4 h-4" />,
        variant: "info",
      })
    }

    if (student.status === "transferred") {
      items.push({
        id: "transfer",
        type: "transfer",
        title: "perpindahan",
        description: student.transfer_reason || "Siswa pindah ke sekolah lain",
        date: student.transfer_date || student.updated_at,
        icon: <ArrowRightLeft className="w-4 h-4" />,
        variant: "warning",
      })
    }

    // Last update
    items.push({
      id: "last-update",
      type: "status_change",
      title: "Terakhir Diperbarui",
      description: "Data siswa terakhir diperbarui oleh administrator",
      date: student.updated_at,
      icon: <Clock className="w-4 h-4" />,
      variant: "neutral",
    })

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const timeline = generateTimeline()

  const variantStyles = {
    success: "bg-green-100 text-green-600",
    info: "bg-blue-100 text-blue-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    neutral: "bg-gray-100 text-gray-600",
  }

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="bg-[var(--surface-secondary)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Status</p>
          <Badge variant={student.status === "active" ? "success" : "neutral"}>
            {student.status === "active" ? "Aktif" : student.status}
          </Badge>
        </Card>
        <Card padding="md" className="bg-[var(--surface-secondary)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Tahun Masuk</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {student.enrollment_year || "-"}
          </p>
        </Card>
        <Card padding="md" className="bg-[var(--surface-secondary)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Kelas</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {student.student_classes?.length || 0} kelas
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
            <History className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Riwayat Aktivitas
            </h3>
            <p className="text-[12px] text-[var(--text-muted)]">
              Timeline aktivitas dan perubahan siswa
            </p>
          </div>
        </div>

        {timeline.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">
              Belum ada riwayat aktivitas
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {timeline.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      variantStyles[item.variant]
                    )}
                  >
                    {item.icon}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[var(--border-light)] my-1" />
                  )}
                </div>

                {/* Content */}
                <div className={cn("flex-1 pb-6", index < timeline.length - 1 ? "" : "pb-0")}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-[13px] font-medium text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => window.location.href = `/buku-induk/${student.id}/history`}>
          <History className="w-4 h-4" />
          Lihat Riwayat Lengkap
        </Button>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  const { academicYear } = useAcademicYear()

  const { student, loading, error } = useStudent(studentId)
  const [activeTab, setActiveTab] = useState("personal")

  const tabs = [
    { id: "personal", label: "Informasi Pribadi" },
    { id: "academic", label: "Data Akademik" },
    { id: "parents", label: "Data Orang Tua" },
    { id: "guardian", label: "Wali" },
    { id: "documents", label: "Dokumen" },
    { id: "attendance", label: "Absensi" },
    { id: "assessment", label: "Penilaian" },
    { id: "character", label: "Karakter" },
    { id: "activity", label: "Aktivitas" },
  ]

  // Handle error state
  if (error) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href="/buku-induk"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Buku Induk
          </Link>
        </div>

        <Card padding="lg" className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-[var(--danger)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            {error.message || "Terjadi kesalahan saat mengambil data siswa"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.refresh()}
          >
            Coba Lagi
          </Button>
        </Card>
      </AppShell>
    )
  }

  // Handle loading state
  if (loading) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href="/buku-induk"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Buku Induk
          </Link>
        </div>

        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="h-48 bg-[var(--surface-hover)] rounded-[28px]" />
          {/* Tabs skeleton */}
          <div className="h-12 bg-[var(--surface-hover)] rounded-[18px]" />
          {/* Content skeleton */}
          <div className="h-64 bg-[var(--surface-hover)] rounded-[28px]" />
        </div>
      </AppShell>
    )
  }

  // Handle not found
  if (!student) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href="/buku-induk"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Buku Induk
          </Link>
        </div>

        <Card padding="lg" className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Siswa Tidak Ditemukan
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Data siswa dengan ID ini tidak ditemukan dalam sistem
          </p>
          <Button onClick={() => router.push("/buku-induk")}>
            Kembali ke Buku Induk
          </Button>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell showHeader={true}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/buku-induk"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Buku Induk
        </Link>
      </div>

      {/* Student Header */}
      <StudentHeader student={student} />

      {/* Tabs */}
      <Card padding="md" className="mt-6">
        <div className="flex gap-2 border-b border-[var(--border-light)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "personal" && <PersonalInfoSection student={student} />}
          {activeTab === "academic" && <AcademicInfoSection student={student} />}
          {activeTab === "parents" && <ParentInfoSection student={student} />}
          {activeTab === "guardian" && <GuardianSection student={student} />}
          {activeTab === "documents" && <DocumentsTab studentId={student.id} />}
          {activeTab === "attendance" && (
            <AttendanceSummary studentId={student.id} academicYearId={academicYear?.id} />
          )}
          {activeTab === "assessment" && (
            <AssessmentSummary studentId={student.id} academicYearId={academicYear?.id} />
          )}
          {activeTab === "character" && (
            <CharacterSummary studentId={student.id} academicYearId={academicYear?.id} />
          )}
          {activeTab === "activity" && <ActivitySection student={student} />}
        </div>
      </Card>
    </AppShell>
  )
}
