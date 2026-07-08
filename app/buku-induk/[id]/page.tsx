"use client"

import { useState } from "react"
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
  AlertCircle,
  Download,
  History,
  Clock,
  UserPlus,
  MoreVertical,
  Heart,
  Award,
  FileText,
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

const GENDER_LABELS = {
  male: "Laki-laki",
  female: "Perempuan",
} as const

function getStatusVariant(isActive: boolean): "success" | "neutral" {
  return isActive ? "success" : "neutral"
}

function getStatusLabel(isActive: boolean): string {
  return isActive ? "Aktif" : "Tidak Aktif"
}

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

  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )
  const className = activeClass?.classes
    ? `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
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
    <Card variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            fallback={student.full_name}
            src={student.photo_url}
            size="lg"
            className="w-24 h-24 text-2xl ring-4 ring-white shadow-xl"
          />
          {/* Gender indicator */}
          <div className={cn(
            "absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center border-2 border-white shadow-sm",
            student.gender === "male" ? "bg-blue-500 text-white" : "bg-pink-500 text-white"
          )}>
            <span className="text-[10px] font-bold">
              {student.gender === "male" ? "L" : "P"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Name & Badge */}
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[26px] font-bold text-[var(--text-primary)]">
                  {student.full_name}
                </h2>
                <Badge
                  variant={getStatusVariant(student.is_active)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-semibold rounded-full",
                    student.is_active
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
                  {getStatusLabel(student.is_active)}
                </Badge>
              </div>

              {/* NIS & NIK */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] mb-3">
                <div className="flex items-center gap-2 bg-[var(--surface-secondary)] px-3 py-1.5 rounded-lg">
                  <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="font-mono font-medium">NIS: {student.student_number}</span>
                </div>
                {student.national_id && (
                  <div className="flex items-center gap-2 bg-[var(--surface-secondary)] px-3 py-1.5 rounded-lg">
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="font-mono font-medium">NIK: {student.national_id}</span>
                  </div>
                )}
              </div>

              {/* Personal Info */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>{GENDER_LABELS[student.gender] || student.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>{formatDate(student.birth_date)} ({formatAge(student.birth_date)})</span>
                </div>
                {student.birth_place && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>{student.birth_place}</span>
                  </div>
                )}
              </div>

              {/* Class & Contact */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
                {className !== "-" && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                    <span className="font-medium text-[var(--primary)]">{className}</span>
                  </div>
                )}
                {student.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>{student.email}</span>
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>{student.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="w-10 h-10 rounded-xl"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              {showActions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-[var(--border-light)]/50 py-2 min-w-[180px] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <Link
                      href={`/buku-induk/${student.id}/edit`}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-[var(--primary)]" />
                      Edit Data
                    </Link>
                    <PrintStudentCardButton
                      student={student}
                      academicYearName={academicYear?.name}
                    />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                      <Download className="w-4 h-4 text-[var(--info)]" />
                      Download Data
                    </button>
                    <Link
                      href={`/buku-induk/${student.id}/history`}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <History className="w-4 h-4 text-[var(--warning)]" />
                      Riwayat
                    </Link>
                    <div className="h-px bg-[var(--border-light)]/60 my-2" />
                    <button
                      onClick={handleArchive}
                      disabled={isArchiving || !student.is_active}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
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
  icon,
}: {
  label: string
  value: React.ReactNode
  fullWidth?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className={cn(fullWidth ? "md:col-span-2" : "")}>
      <p className="text-[11px] text-[var(--text-muted)] mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
        {icon && <span className="w-4 h-4">{icon}</span>}
        {label}
      </p>
      <p className="text-[14px] text-[var(--text-primary)] font-medium">
        {value || "-"}
      </p>
    </div>
  )
}

function PersonalInfoSection({ student }: { student: StudentWithClass }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="NIS" value={student.student_number} />
      {student.nisn && <InfoItem label="NISN" value={student.nisn} />}
      {student.national_id && <InfoItem label="NIK" value={student.national_id} />}
      <InfoItem label="Nama Lengkap" value={student.full_name} />
      {student.nickname && <InfoItem label="Nama Panggilan" value={student.nickname} />}
      <InfoItem label="Jenis Kelamin" value={GENDER_LABELS[student.gender]} />
      {student.birth_place && <InfoItem label="Tempat Lahir" value={student.birth_place} />}
      <InfoItem label="Tanggal Lahir" value={`${formatDate(student.birth_date)} (${formatAge(student.birth_date)})`} />
      {student.religion && <InfoItem label="Agama" value={student.religion} />}
      {student.nationality && <InfoItem label="Kewarganegaraan" value={student.nationality} />}
      {student.blood_type && <InfoItem label="Golongan Darah" value={student.blood_type} />}
      <InfoItem label="Alamat" value={student.address} fullWidth icon={<MapPin className="w-3 h-3" />} />
      <InfoItem label="No. Telepon" value={student.phone} icon={<Phone className="w-3 h-3" />} />
      <InfoItem label="Email" value={student.email} icon={<Mail className="w-3 h-3" />} />
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
        ? `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
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
        <InfoItem
          label="Status"
          value={
            <Badge
              variant={getStatusVariant(student.is_active)}
              className={cn(
                "px-3 py-1 text-[12px] font-semibold rounded-full",
                student.is_active
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              )}
            >
              {getStatusLabel(student.is_active)}
            </Badge>
          }
        />
        {student.graduation_year && (
          <InfoItem label="Tahun Lulus" value={student.graduation_year.toString()} />
        )}
        {activeClass && (
          <>
            <InfoItem
              label="Kelas"
              value={
                activeClass.classes
                  ? `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
                  : "-"
              }
            />
            <InfoItem label="No. Absen" value={activeClass.attendance_number?.toString()} />
          </>
        )}
      </div>

      {/* Class History */}
      {getAllClasses().length > 1 && (
        <div>
          <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
            Riwayat Kelas
          </h4>
          <div className="space-y-2">
            {getAllClasses().map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[var(--surface-secondary)]/70 rounded-xl hover:bg-[var(--surface-hover)] transition-colors border border-transparent hover:border-[var(--border-light)]/50"
              >
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{item.class}</span>
                <Badge
                  variant={item.status === "active" ? "success" : "neutral"}
                  className={cn(
                    "px-3 py-1 text-[11px] font-semibold rounded-full",
                    item.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
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
    <Card variant="soft" padding="md">
      <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          type === "father" ? "bg-blue-50 text-blue-600" :
          type === "mother" ? "bg-pink-50 text-pink-600" :
          "bg-purple-50 text-purple-600"
        )}>
          <User className="w-4 h-4" />
        </div>
        Data {label}
      </h4>
      {parent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Nama Lengkap" value={parent.full_name} />
          {parent.nik && <InfoItem label="NIK" value={parent.nik} />}
          {parent.occupation && <InfoItem label="Pekerjaan" value={parent.occupation} />}
          {parent.education && <InfoItem label="Pendidikan" value={parent.education} />}
          {parent.phone && <InfoItem label="No. Telepon" value={parent.phone} icon={<Phone className="w-3 h-3" />} />}
          {parent.email && <InfoItem label="Email" value={parent.email} icon={<Mail className="w-3 h-3" />} />}
          {parent.address && (
            <InfoItem label="Alamat" value={parent.address} fullWidth icon={<MapPin className="w-3 h-3" />} />
          )}
        </div>
      ) : (
        <p className="text-[13px] text-[var(--text-muted)] py-4 text-center bg-[var(--surface-primary)] rounded-lg">
          Data {label} belum diisi
        </p>
      )}
    </Card>
  )

  return (
    <div className="space-y-4">
      {renderParentCard("father", "Ayah", father)}
      {renderParentCard("mother", "Ibu", mother)}
      {guardian && renderParentCard("guardian", "Wali", guardian)}
    </div>
  )
}

function GuardianSection({ student }: { student: StudentWithClass }) {
  const parents = student.parents || []
  const guardian = parents.find((p) => p.type === "guardian")

  const renderGuardianCard = () => {
    if (guardian) {
      return (
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 flex items-center justify-center shadow-sm">
              <User className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
                  {guardian.full_name}
                </h3>
                <Badge variant="primary" className="text-[11px] px-2 py-0.5 rounded-full">
                  Wali Siswa
                </Badge>
              </div>
              {guardian.occupation && (
                <p className="text-[13px] text-[var(--text-muted)] mb-4">{guardian.occupation}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guardian.nik && <InfoItem label="NIK" value={guardian.nik} />}
                {guardian.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[14px] text-[var(--text-primary)] font-medium">{guardian.phone}</span>
                  </div>
                )}
                {guardian.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[14px] text-[var(--text-primary)]">{guardian.email}</span>
                  </div>
                )}
                {guardian.address && (
                  <div className="md:col-span-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5" />
                    <span className="text-[14px] text-[var(--text-secondary)]">{guardian.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <Card variant="soft" padding="lg" className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-primary)] flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
          Data Wali Belum Tersedia
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-4">
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
    <div className="space-y-4">
      {renderGuardianCard()}

      <Card variant="soft" padding="md">
        <h4 className="text-[13px] font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
          Catatan
        </h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          Jika siswa tidak diasuh oleh orang tua kandung, wali yang ditunjuk bertanggung jawab penuh
          terhadap pendidikan dan perkembangan siswa selama di sekolah.
        </p>
      </Card>
    </div>
  )
}

function ActivitySection({ student }: { student: StudentWithClass }) {
  const generateTimeline = () => {
    const items = []

    if (student.enrollment_year) {
      items.push({
        id: "enrollment",
        title: "Pendaftaran Siswa Baru",
        description: `Masuk sebagai siswa baru tahun ajaran ${student.enrollment_year}`,
        date: student.created_at,
        icon: <UserPlus className="w-4 h-4" />,
        variant: "success" as const,
      })
    }

    const classHistory = [...(student.student_classes || [])]
      .filter((sc) => sc.start_date)
      .sort((a, b) => new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime())

    classHistory.forEach((sc, index) => {
      const className = sc.classes
        ? `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
        : "Kelas"

      items.push({
        id: `class-${sc.id}`,
        title: index === 0 ? "Kelas Saat Ini" : "Perpindahan Kelas",
        description: index === 0 ? `Di kelas ${className}` : `Pindah ke ${className}`,
        date: sc.start_date || student.updated_at,
        icon: <BookOpen className="w-4 h-4" />,
        variant: index === 0 ? "success" as const : "info" as const,
      })
    })

    items.push({
      id: "last-update",
      title: "Terakhir Diperbarui",
      description: "Data siswa terakhir diperbarui oleh administrator",
      date: student.updated_at,
      icon: <Clock className="w-4 h-4" />,
      variant: "neutral" as const,
    })

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const timeline = generateTimeline()

  const variantStyles = {
    success: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 border border-emerald-200/50",
    info: "bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200/50",
    warning: "bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 border border-amber-200/50",
    danger: "bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 border border-red-200/50",
    neutral: "bg-gradient-to-br from-slate-50 to-slate-100/50 text-slate-600 border border-slate-200/50",
  }

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="soft" padding="md" className="hover:shadow-sm transition-shadow">
          <p className="text-[11px] text-[var(--text-muted)] mb-2 uppercase tracking-wide">Status</p>
          <Badge
            variant={getStatusVariant(student.is_active)}
            className={cn(
              "px-3 py-1.5 text-[12px] font-semibold rounded-full",
              student.is_active
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            )}
          >
            {getStatusLabel(student.is_active)}
          </Badge>
        </Card>
        <Card variant="soft" padding="md" className="hover:shadow-sm transition-shadow">
          <p className="text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wide">Tahun Masuk</p>
          <p className="text-[18px] font-bold text-[var(--text-primary)]">
            {student.enrollment_year || "-"}
          </p>
        </Card>
        <Card variant="soft" padding="md" className="hover:shadow-sm transition-shadow">
          <p className="text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wide">Total Kelas</p>
          <p className="text-[18px] font-bold text-[var(--text-primary)]">
            {student.student_classes?.length || 0}
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
              Riwayat Aktivitas
            </h3>
            <p className="text-[12px] text-[var(--text-muted)]">
              Timeline aktivitas dan perubahan siswa
            </p>
          </div>
        </div>

        {timeline.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-[14px] text-[var(--text-muted)]">
              Belum ada riwayat aktivitas
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {timeline.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105",
                    variantStyles[item.variant]
                  )}>
                    {item.icon}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[var(--border-light)]/60 my-1 min-h-[32px]" />
                  )}
                </div>
                <div className={cn("flex-1 pb-6", index < timeline.length - 1 ? "" : "pb-0")}>
                  <div className="flex items-start justify-between gap-4 bg-[var(--surface-secondary)]/50 rounded-xl p-3 hover:bg-[var(--surface-hover)]/50 transition-colors">
                    <div>
                      <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-[var(--border-light)]/50">
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

      {/* Quick Action */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `/buku-induk/${student.id}/history`}
        >
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
  const [activeTab, setActiveTab] = useState("personal-academic")

  const tabs = [
    { id: "personal-academic", label: "Data Pribadi & Akademik", icon: <User className="w-4 h-4" /> },
    { id: "parents-guardian", label: "Data Orang Tua & Wali", icon: <Heart className="w-4 h-4" /> },
    { id: "documents", label: "Dokumen", icon: <FileText className="w-4 h-4" /> },
    { id: "attendance", label: "Absensi", icon: <Calendar className="w-4 h-4" /> },
    { id: "assessment", label: "Penilaian", icon: <Award className="w-4 h-4" /> },
    { id: "character", label: "Karakter", icon: <Heart className="w-4 h-4" /> },
    { id: "activity", label: "Aktivitas", icon: <History className="w-4 h-4" /> },
  ]

  // Error state
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

        <Card variant="elevated" className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-6">
            {error.message || "Terjadi kesalahan saat mengambil data siswa"}
          </p>
          <Button variant="outline" onClick={() => router.refresh()}>
            Coba Lagi
          </Button>
        </Card>
      </AppShell>
    )
  }

  // Loading state
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
          <div className="h-40 bg-white rounded-3xl shadow-sm border border-[var(--border-light)]/50" />
          <div className="h-14 bg-white rounded-2xl shadow-sm border border-[var(--border-light)]/50" />
          <div className="h-80 bg-white rounded-3xl shadow-sm border border-[var(--border-light)]/50" />
        </div>
      </AppShell>
    )
  }

  // Not found state
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

        <Card variant="elevated" className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">
            Siswa Tidak Ditemukan
          </h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-6">
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

      {/* Tabs - Modern Pill Style */}
      <Card variant="soft" padding="sm" className="mt-6">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-primary)] hover:text-[var(--text-primary)]"
              )}
            >
              <span className={cn(activeTab !== tab.id && "text-[var(--text-muted)]")}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="mt-6 space-y-6">
        {activeTab === "personal-academic" && (
          <Card variant="elevated" padding="lg">
            <PersonalInfoSection student={student} />
            <div className="border-t border-[var(--border-light)] my-6" />
            <AcademicInfoSection student={student} />
          </Card>
        )}
        {activeTab === "parents-guardian" && (
          <Card variant="elevated" padding="lg">
            <ParentInfoSection student={student} />
            <div className="border-t border-[var(--border-light)] my-6" />
            <GuardianSection student={student} />
          </Card>
        )}
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
    </AppShell>
  )
}
