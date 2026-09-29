"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Download,
  History,
  Clock,
  UserPlus,
  MoreHorizontal,
  Heart,
  User,
  BookOpen,
  AlertCircle,
  Activity,
  FileText,
  Calendar,
  Award,
  Stethoscope,
  Ruler,
  Scale,
  Eye,
  Ear,
  FileWarning,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
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

const GENDER_LABELS = { male: "Laki-laki", female: "Perempuan" } as const

function formatDate(date: string | null): string {
  if (!date) return "—"
  const dateStr = date.split("T")[0]
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return localDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

function formatAge(birthDate: string | null): string {
  if (!birthDate) return "—"
  const dateStr = birthDate.split("T")[0]
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    const age = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return `${age} tahun`
  }
  return "—"
}

// ============================================
// PROFILE HEADER
// ============================================
function ProfileHeader({ student }: { student: StudentWithClass }) {
  const router = useRouter()
  const { academicYear } = useAcademicYear()
  const [showActions, setShowActions] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )
  const className = activeClass?.classes
    ? `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    : null

  const handleArchive = async () => {
    if (!confirm("Arsipkan siswa ini?")) return
    setIsArchiving(true)
    const result = await archiveStudent(student.id)
    setIsArchiving(false)
    if (result.success) router.push("/buku-induk")
    else alert(result.error || "Gagal")
  }

  return (
    <div className="bg-white rounded-3xl border border-[var(--border-light)] overflow-hidden shadow-sm">
      {/* Top accent line */}
      <div className="h-1.5 bg-gradient-to-r from-[var(--primary)] via-indigo-400 to-purple-400" />

      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              fallback={student.full_name}
              src={student.photo_url}
              size="lg"
              className="w-18 h-18 text-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5"
            />
            {/* Gender badge */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
              student.gender === "male" ? "bg-blue-500" : "bg-pink-400"
            )}>
              {student.gender === "male" ? "L" : "P"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                {/* Name & Status */}
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">{student.full_name}</h1>
                  <span className={cn(
                    "px-2.5 py-1 text-[11px] font-semibold rounded-full",
                    student.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {student.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* NIS & Class */}
                <div className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)] mb-3">
                  <span className="font-mono font-medium bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md">{student.student_number}</span>
                  {className && (
                    <>
                      <span className="text-[var(--border-default)]">·</span>
                      <span className="font-medium text-[var(--primary)]">{className}</span>
                    </>
                  )}
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)]">
                  <span>{GENDER_LABELS[student.gender] || student.gender}</span>
                  <span className="text-[var(--border-light)]">·</span>
                  <span>{formatDate(student.birth_date)}</span>
                  <span className="text-[var(--border-light)]">·</span>
                  <span>{formatAge(student.birth_date)}</span>
                  {student.birth_place && (
                    <>
                      <span className="text-[var(--border-light)]">·</span>
                      <span>{student.birth_place}</span>
                    </>
                  )}
                  {student.phone && (
                    <>
                      <span className="text-[var(--border-light)]">·</span>
                      <span>{student.phone}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowActions(!showActions)} className="w-10 h-10">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
                {showActions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                    <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-xl border border-[var(--border-light)] py-2 min-w-[180px] overflow-hidden">
                      <Link href={`/buku-induk/${student.id}/edit`} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]">
                        <Pencil className="w-4 h-4 text-[var(--primary)]" />Edit Data
                      </Link>
                      <PrintStudentCardButton student={student} academicYearName={academicYear?.name} />
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]">
                        <Download className="w-4 h-4 text-[var(--text-muted)]" />Download
                      </button>
                      <Link href={`/buku-induk/${student.id}/history`} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]">
                        <History className="w-4 h-4 text-[var(--text-muted)]" />Riwayat
                      </Link>
                      <div className="h-px bg-[var(--border-light)] my-2" />
                      <button onClick={handleArchive} disabled={isArchiving || !student.is_active} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />{isArchiving ? "Mengarsipkan..." : "Arsipkan"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// INFO SECTIONS
// ============================================
function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[var(--border-light)]/50 flex items-center gap-2">
        <span className="text-[var(--primary)]">{icon}</span>
        <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function InfoGrid({ items }: { items: Array<{ label: string; value: string | null }> }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.filter(item => item.value).map((item, i) => (
        <div key={i}>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-[13px] font-medium text-[var(--text-primary)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <p className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">{label}</p>
      <p className="text-[13px] text-[var(--text-primary)]">{value}</p>
    </div>
  )
}

// ============================================
// TABS
// ============================================
const tabs = [
  { id: "personal", label: "Data Siswa", icon: <User className="w-3.5 h-3.5" /> },
  { id: "parents", label: "Orang Tua", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "health", label: "Kesehatan", icon: <Activity className="w-3.5 h-3.5" /> },
  { id: "documents", label: "Dokumen", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "attendance", label: "Absensi", icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: "assessment", label: "Nilai", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "character", label: "Karakter", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "activity", label: "Aktivitas", icon: <History className="w-3.5 h-3.5" /> },
]

// ============================================
// TAB CONTENTS
// ============================================
function PersonalTab({ student }: { student: StudentWithClass }) {
  const { academicYear } = useAcademicYear()
  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )

  return (
    <div className="space-y-5">
      {/* Data Diri */}
      <InfoSection title="Data Diri" icon={<User className="w-4 h-4" />}>
        <InfoGrid
          items={[
            { label: "Nama Lengkap", value: student.full_name },
            { label: "Nama Panggilan", value: student.nickname || null },
            { label: "Jenis Kelamin", value: GENDER_LABELS[student.gender] || student.gender },
            { label: "Tempat Lahir", value: student.birth_place || null },
            { label: "Tanggal Lahir", value: formatDate(student.birth_date) },
            { label: "Usia", value: formatAge(student.birth_date) },
            { label: "Agama", value: student.religion || null },
            { label: "Gol. Darah", value: student.blood_type || null },
          ]}
        />

        {student.address && (
          <div className="mt-4 p-4 bg-[var(--surface-secondary)] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Alamat</p>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{student.address}</p>
          </div>
        )}

        {student.phone && (
          <div className="mt-3 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <p className="text-[12px] text-[var(--text-secondary)]">{student.phone}</p>
          </div>
        )}

        {student.notes && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[10px] text-amber-600 uppercase tracking-wider mb-2">Catatan</p>
            <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">{student.notes}</p>
          </div>
        )}
      </InfoSection>

      {/* Data Akademik */}
      <InfoSection title="Data Akademik" icon={<BookOpen className="w-4 h-4" />}>
        <InfoGrid
          items={[
            { label: "NIS", value: student.student_number },
            { label: "NISN", value: student.nisn || null },
            { label: "Tahun Ajaran", value: academicYear?.name || null },
            ...(activeClass?.classes ? [
              { label: "Kelas", value: `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim() },
              { label: "No. Absen", value: activeClass.attendance_number?.toString() || null },
            ] : []),
          ]}
        />
      </InfoSection>
    </div>
  )
}

function ParentsTab({ student }: { student: StudentWithClass }) {
  const parents = student.parents || []
  const father = parents.find((p) => p.type === "father")
  const mother = parents.find((p) => p.type === "mother")
  const guardian = parents.find((p) => p.type === "guardian")

  const ParentCard = ({ label, parent, color }: { label: string; parent?: typeof parents[0]; color: string }) => (
    <div className={cn("p-5 rounded-2xl border", parent ? "bg-white border-[var(--border-light)]" : "bg-[var(--surface-secondary)] border-dashed border-[var(--border-light)]")}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <User className="w-5 h-5" />
        </div>
        <span className="text-[14px] font-semibold text-[var(--text-primary)]">{label}</span>
      </div>
      {parent ? (
        <div className="space-y-3">
          <InfoRow label="Nama" value={parent.full_name} />
          {parent.phone && <InfoRow label="Telepon" value={parent.phone} />}
          {parent.occupation && <InfoRow label="Pekerjaan" value={parent.occupation} />}
        </div>
      ) : (
        <p className="text-[12px] text-[var(--text-muted)] text-center py-3">Belum ada data</p>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <ParentCard label="Ayah" parent={father} color="bg-blue-100 text-blue-600" />
      <ParentCard label="Ibu" parent={mother} color="bg-pink-100 text-pink-500" />
      {guardian && <ParentCard label="Wali" parent={guardian} color="bg-purple-100 text-purple-600" />}
    </div>
  )
}

function HealthTab({ student }: { student: StudentWithClass }) {
  const hasHealthData = student.height_cm || student.weight_kg || student.blood_type ||
    student.vision || student.hearing || student.teeth_condition || student.physical_disability ||
    student.illness_history || student.allergies || student.health_notes

  if (!hasHealthData) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[var(--border-light)]">
        <div className="w-16 h-16 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <p className="text-[15px] font-semibold text-[var(--text-primary)]">Belum ada data kesehatan</p>
        <p className="text-[12px] text-[var(--text-muted)] mt-1">Data kesehatan belum diisi</p>
      </div>
    )
  }

  const HealthBadge = ({ label, value, icon }: { label: string; value: string | null; icon: React.ReactNode }) => {
    const isNormal = value === "Normal" || value === "Tidak Ada" || value === "-" || !value
    return (
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl text-center">
        <div className={cn("w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center", isNormal ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-500")}>
          {icon}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
        <p className={cn("text-[14px] font-semibold", isNormal ? "text-[var(--text-primary)]" : "text-amber-600")}>{value || "—"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Pengukuran */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4" /> Pengukuran
        </p>
        <div className="grid grid-cols-3 gap-3">
          <HealthBadge label="Tinggi" value={student.height_cm ? `${student.height_cm} cm` : null} icon={<Ruler className="w-5 h-5" />} />
          <HealthBadge label="Berat" value={student.weight_kg ? `${student.weight_kg} kg` : null} icon={<Scale className="w-5 h-5" />} />
          <HealthBadge label="Gol. Darah" value={student.blood_type || null} icon={<Heart className="w-5 h-5" />} />
        </div>
      </div>

      {/* Kondisi */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" /> Kondisi
        </p>
        <div className="grid grid-cols-4 gap-3">
          <HealthBadge label="Penglihatan" value={student.vision || null} icon={<Eye className="w-5 h-5" />} />
          <HealthBadge label="Pendengaran" value={student.hearing || null} icon={<Ear className="w-5 h-5" />} />
          <HealthBadge label="Gigi" value={student.teeth_condition || null} icon={<Activity className="w-5 h-5" />} />
          <HealthBadge label="Cacat" value={student.physical_disability || null} icon={<FileWarning className="w-5 h-5" />} />
        </div>
      </div>

      {/* Riwayat */}
      {(student.illness_history || student.allergies || student.health_notes) && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Riwayat & Catatan
          </p>
          {student.illness_history && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-600 uppercase tracking-wider mb-1">Riwayat Sakit</p>
              <p className="text-[13px] text-[var(--text-primary)]">{student.illness_history}</p>
            </div>
          )}
          {student.allergies && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-[10px] text-red-600 uppercase tracking-wider mb-1">Alergi</p>
              <p className="text-[13px] text-[var(--text-primary)]">{student.allergies}</p>
            </div>
          )}
          {student.health_notes && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] text-blue-600 uppercase tracking-wider mb-1">Catatan</p>
              <p className="text-[13px] text-[var(--text-primary)]">{student.health_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ActivityTab({ student }: { student: StudentWithClass }) {
  const timeline = []

  if (student.student_classes?.[0]?.academic_years?.name) {
    timeline.push({
      title: "Pendaftaran",
      desc: student.student_classes[0].academic_years.name,
      date: student.created_at,
      icon: <UserPlus className="w-4 h-4" />,
      color: "bg-emerald-100 text-emerald-600"
    })
  }

  student.student_classes?.forEach((sc) => {
    if (sc.start_date && sc.classes) {
      const className = `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
      timeline.push({
        title: "Kelas",
        desc: className,
        date: sc.start_date,
        icon: <BookOpen className="w-4 h-4" />,
        color: "bg-blue-100 text-blue-600"
      })
    }
  })

  timeline.push({
    title: "Update Terakhir",
    desc: "Data siswa diperbarui",
    date: student.updated_at,
    icon: <Clock className="w-4 h-4" />,
    color: "bg-slate-100 text-slate-500"
  })

  return (
    <div className="space-y-0">
      {timeline.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
              {item.icon}
            </div>
            {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-[var(--border-light)] my-2 min-h-[20px]" />}
          </div>
          <div className={cn("flex-1 pb-6", i === timeline.length - 1 && "pb-0")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{item.title}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  const { academicYear } = useAcademicYear()
  const { student, loading, error } = useStudent(studentId)
  const [activeTab, setActiveTab] = useState("personal")

  // Error state
  if (error) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-5">
          <Link href="/buku-induk" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ArrowLeft className="w-4 h-4" />Kembali
          </Link>
        </div>
        <Card className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">Gagal Memuat Data</h2>
          <p className="text-[12px] text-[var(--text-muted)]">{error.message || "Terjadi kesalahan"}</p>
        </Card>
      </AppShell>
    )
  }

  // Loading state
  if (loading) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-5">
          <Link href="/buku-induk" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ArrowLeft className="w-4 h-4" />Kembali
          </Link>
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-white rounded-3xl border border-[var(--border-light)] animate-pulse" />
          <div className="h-14 bg-white rounded-2xl border border-[var(--border-light)] animate-pulse" />
          <div className="h-96 bg-white rounded-3xl border border-[var(--border-light)] animate-pulse" />
        </div>
      </AppShell>
    )
  }

  // Not found
  if (!student) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-5">
          <Link href="/buku-induk" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ArrowLeft className="w-4 h-4" />Kembali
          </Link>
        </div>
        <Card className="text-center py-12">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">Siswa Tidak Ditemukan</h2>
          <Button onClick={() => router.push("/buku-induk")}>Kembali ke Buku Induk</Button>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell showHeader={true}>
      {/* Back link */}
      <div className="mb-5">
        <Link href="/buku-induk" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />Kembali ke Buku Induk
        </Link>
      </div>

      {/* Profile Header */}
      <ProfileHeader student={student} />

      {/* Tabs */}
      <div className="mt-5 overflow-x-auto">
        <div className="flex gap-1 p-1.5 bg-white rounded-2xl border border-[var(--border-light)] shadow-sm min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium rounded-xl transition-all",
                activeTab === tab.id
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-5">
        {activeTab === "personal" && <PersonalTab student={student} />}
        {activeTab === "parents" && <ParentsTab student={student} />}
        {activeTab === "health" && <HealthTab student={student} />}
        {activeTab === "documents" && <DocumentsTab studentId={student.id} />}
        {activeTab === "attendance" && <AttendanceSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "assessment" && <AssessmentSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "character" && <CharacterSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "activity" && <ActivityTab student={student} />}
      </div>
    </AppShell>
  )
}
