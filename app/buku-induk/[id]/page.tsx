"use client"

import { use, useState, useCallback, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Pencil,
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
  Award,
  Phone,
  Plus,
  GraduationCap,
  IdCard,
  Cake,
  Users,
  Home,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Trash2,
  Ruler,
  Scale,
  Eye,
  Ear,
  Stethoscope,
  FileWarning,
  AlertTriangle,
  HeartPulse,
  CalendarCheck,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Button, Badge } from "@/components/ui"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useStudent, useAcademicYear } from "@/hooks"
import { archiveStudent } from "../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"
import { DocumentsTab } from "@/components/buku-induk/DocumentsTab"
import { AttendanceSummary } from "@/components/buku-induk/AttendanceSummary"
import { AssessmentSummary } from "@/components/buku-induk/AssessmentSummary"
import { CharacterSummary } from "@/components/buku-induk/CharacterSummary"
import { PrintStudentCardButton } from "@/components/buku-induk/PrintStudentCard"
import { Tooltip } from "@/components/ui/tooltip"
import { showToast } from "@/hooks/use-toast"

const GENDER_LABELS = { male: "Laki-laki", female: "Perempuan" } as const

// ============================================
// VISUAL TOKENS - Konsistensi UI
// ============================================
const VT = {
  // Border radius
  card: "rounded-2xl",
  element: "rounded-lg",
  small: "rounded-md",
  // Shadows
  shadowCard: "shadow-sm hover:shadow-md transition-shadow duration-200",
  // Spacing
  sectionGap: "space-y-6",
  cardGap: "gap-4",
  // Typography
  titlePage: "text-2xl font-semibold tracking-tight",
  titleCard: "text-base font-semibold",
  label: "text-xs font-medium text-muted-foreground",
  value: "text-sm font-medium text-foreground",
  valueMuted: "text-sm text-muted-foreground italic",
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
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

// CopyableValue - komponen untuk menyalin nilai
function CopyableValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    setCopied(true)
    showToast("Tersalin", "success")
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group relative">
      <span className="text-sm font-medium text-foreground cursor-pointer" onClick={handleCopy}>
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="ml-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        aria-label={`Salin ${label}`}
      >
        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  )
}

// CompletenessIndicator - indikator kelengkapan data
function CompletenessIndicator({ student }: { student: StudentWithClass }) {
  const fields = [
    { key: "nama", label: "Nama lengkap", filled: !!student.full_name },
    { key: "tempat_lahir", label: "Tempat lahir", filled: !!student.birth_place },
    { key: "tanggal_lahir", label: "Tanggal lahir", filled: !!student.birth_date },
    { key: "agama", label: "Agama", filled: !!student.religion },
    { key: "alamat", label: "Alamat", filled: !!student.address },
    { key: "nisn", label: "NISN", filled: !!student.nisn },
    { key: "telepon", label: "Nomor telepon", filled: !!student.phone },
    { key: "ayah", label: "Data ayah", filled: student.parents?.some(p => p.type === "father" && p.full_name) },
    { key: "ibu", label: "Data ibu", filled: student.parents?.some(p => p.type === "mother" && p.full_name) },
    { key: "gol_darah", label: "Golongan darah", filled: !!student.blood_type },
    { key: "tinggi", label: "Tinggi badan", filled: !!student.height_cm },
    { key: "berat", label: "Berat badan", filled: !!student.weight_kg },
  ]

  const filledCount = fields.filter(f => f.filled).length
  const percentage = Math.round((filledCount / fields.length) * 100)
  const missingFields = fields.filter(f => !f.filled).map(f => f.label)

  return (
    <Tooltip
      content={
        <div className="space-y-1.5">
          <p className="font-medium">Field yang belum terisi:</p>
          {missingFields.length > 0 ? (
            <ul className="text-muted-foreground space-y-0.5">
              {missingFields.map((field) => (
                <li key={field}>• {field}</li>
              ))}
            </ul>
          ) : (
            <p className="text-emerald-500">Semua field penting sudah terisi!</p>
          )}
        </div>
      }
    >
      <div className="flex-1 max-w-xs cursor-help">
        <Progress value={percentage} size="sm" />
        <p className="text-xs text-muted-foreground mt-1">{percentage}% lengkap</p>
      </div>
    </Tooltip>
  )
}

// ============================================
// PROFILE HERO - Hero profil elegan
// ============================================
function ProfileHero({ student }: { student: StudentWithClass }) {
  const router = useRouter()
  const { academicYear } = useAcademicYear()
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

  // Generate initials for avatar fallback
  const initials = student.full_name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* Gradient banner */}
      <div className="h-20 bg-gradient-to-r from-primary/15 via-primary/10 to-violet-500/10" />

      <div className="px-5 pb-5 -mt-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Avatar with overlapping ring */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl ring-4 ring-background bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden shadow-lg">
              {student.photo_url ? (
                <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-white">{initials}</span>
              )}
            </div>
            {/* Status indicator */}
            {student.is_active && (
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-background" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2 lg:pt-0">
            {/* Name & Status */}
            <div className="flex items-center gap-2 mb-3">
              <h1 className={cn(VT.titlePage, "truncate")}>{student.full_name}</h1>
              <Badge variant={student.is_active ? "success" : "neutral"} size="sm" dot>
                {student.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>

            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <IdCard className="w-3.5 h-3.5" />
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{student.student_number}</span>
              </span>
              {className && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {className}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {GENDER_LABELS[student.gender] || student.gender}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5" />
                {student.birth_place ? `${student.birth_place}, ` : ""}{formatDate(student.birth_date)}
                {student.birth_date && <span className="text-muted-foreground/70">({formatAge(student.birth_date)})</span>}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:flex-col lg:items-end pt-2 lg:pt-0">
            <div className="flex items-center gap-2">
              <Link href={`/buku-induk/${student.id}/edit`}>
                <Button size="sm" className="gap-1.5">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <PrintStudentCardButton student={student} academicYearName={academicYear?.name} />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="sm" className="w-9 px-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="right">
                  <DropdownMenuItem icon={<History className="w-4 h-4" />} onClick={() => router.push(`/buku-induk/${student.id}/history`)}>
                    Riwayat
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={<Download className="w-4 h-4" />}>
                    Download Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    icon={<Trash2 className="w-4 h-4" />}
                    variant="danger"
                    disabled={isArchiving || !student.is_active}
                    onClick={handleArchive}
                  >
                    Arsipkan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Completeness indicator - mobile */}
            <div className="lg:hidden w-full">
              <CompletenessIndicator student={student} />
            </div>
          </div>
        </div>

        {/* Completeness indicator - desktop */}
        <div className="hidden lg:block mt-4 pt-4 border-t border-border/40">
          <CompletenessIndicator student={student} />
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
    <div className="bg-card rounded-xl border border-border/60 shadow-sm">
      <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function InfoGrid({ items }: { items: Array<{ label: string; value: string | null | React.ReactNode }> }) {
  const filteredItems = items.filter(item => item.value)
  if (filteredItems.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-8">
      {filteredItems.map((item, i) => (
        <div key={i}>
          <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
          <p className="text-sm font-medium text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <p className="text-xs text-muted-foreground w-28 flex-shrink-0">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

// ============================================
// TABS - Seragam dengan ikon lucide-react
// ============================================
const tabs = [
  { id: "personal", label: "Data Siswa", icon: <User className="w-4 h-4" /> },
  { id: "parents", label: "Orang Tua", icon: <Users className="w-4 h-4" /> },
  { id: "health", label: "Kesehatan", icon: <HeartPulse className="w-4 h-4" /> },
  { id: "documents", label: "Dokumen", icon: <FileText className="w-4 h-4" /> },
  { id: "attendance", label: "Absensi", icon: <CalendarCheck className="w-4 h-4" /> },
  { id: "assessment", label: "Nilai", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "character", label: "Karakter", icon: <Award className="w-4 h-4" /> },
  { id: "activity", label: "Aktivitas", icon: <History className="w-4 h-4" /> },
]

// ============================================
// TAB CONTENTS
// ============================================
function PersonalTab({ student }: { student: StudentWithClass }) {
  const { academicYear } = useAcademicYear()
  const activeClass = student.student_classes?.find(
    (sc) => sc.academic_year_id === academicYear?.id && sc.status === "active"
  )

  // Calculate entry year from student_classes or use current year
  const entryYear = student.student_classes?.[0]?.academic_years?.name?.split("/")[0]
    || new Date().getFullYear().toString()

  // Field with edit link
  const EditableField = ({ label, value, field }: { label: string; value: string | null; field: string }) => {
    if (!value) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/70 italic">Belum diisi</span>
          <Link
            href={`/buku-induk/${student.id}/edit?focus=${field}`}
            className="text-xs text-primary hover:underline"
          >
            Lengkapi
          </Link>
        </div>
      )
    }
    return <CopyableValue value={value} label={label} />
  }

  return (
    <div className="space-y-6">
      {/* Identitas */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Identitas</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Nama Lengkap</p>
              <p className="text-sm font-medium text-foreground group cursor-pointer hover:text-primary transition-colors">
                <CopyableValue value={student.full_name} label="Nama lengkap" />
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Nama Panggilan</p>
              <EditableField label="Nama panggilan" value={student.nickname} field="nickname" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Jenis Kelamin</p>
              <p className="text-sm font-medium text-foreground">
                {GENDER_LABELS[student.gender] || student.gender}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Tempat Lahir</p>
              <EditableField label="Tempat lahir" value={student.birth_place} field="birth_place" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Tanggal Lahir</p>
              <p className="text-sm font-medium text-foreground">{formatDate(student.birth_date)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Usia</p>
              <p className="text-sm font-medium text-foreground">{formatAge(student.birth_date)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Agama</p>
              <EditableField label="Agama" value={student.religion} field="religion" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Gol. Darah</p>
              <EditableField label="Golongan darah" value={student.blood_type} field="blood_type" />
            </div>
          </div>
        </div>
      </div>

      {/* Kontak dan Alamat */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Kontak dan Alamat</h3>
        </div>
        <div className="p-4 space-y-4">
          {student.phone ? (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <CopyableValue value={student.phone} label="Nomor telepon" />
              <a
                href={`https://wa.me/${student.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-muted-foreground/70 italic">Belum ada nomor telepon</span>
              <Link
                href={`/buku-induk/${student.id}/edit?focus=phone`}
                className="text-xs text-primary hover:underline"
              >
                Lengkapi
              </Link>
            </div>
          )}

          {student.address ? (
            <div className="bg-muted/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Alamat</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(student.address!)
                      showToast("Alamat disalin", "success")
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Salin
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(student.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Buka di peta
                  </a>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{student.address}</p>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground/50" />
                <span className="text-muted-foreground/70 italic">Belum ada alamat</span>
              </div>
              <Link
                href={`/buku-induk/${student.id}/edit?focus=address`}
                className="text-xs text-primary hover:underline"
              >
                Lengkapi
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Data Akademik */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Data Akademik</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">NIS</p>
              <p className="text-sm font-medium font-mono text-foreground">{student.student_number}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">NISN</p>
              <EditableField label="NISN" value={student.nisn} field="nisn" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Tahun Masuk</p>
              <p className="text-sm font-medium text-foreground">{entryYear}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Tahun Ajaran Aktif</p>
              <p className="text-sm font-medium text-foreground">{academicYear?.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Kelas</p>
              <p className="text-sm font-medium text-foreground">
                {activeClass?.classes ? (
                  `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
                ) : (
                  <span className="text-muted-foreground/70 italic">Belum ada kelas</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Jurusan</p>
              <p className="text-sm font-medium text-foreground">
                {activeClass?.classes?.majors?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">No. Absen</p>
              <p className="text-sm font-medium text-foreground">
                {activeClass?.attendance_number || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
              <Badge variant={student.is_active ? "success" : "neutral"} size="sm" dot>
                {student.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Catatan */}
      {student.notes && (
        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-medium text-amber-700">Catatan</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{student.notes}</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// TAB ORANG TUA
// ============================================
function ParentsTab({ student }: { student: StudentWithClass }) {
  const parents = student.parents || []
  const father = parents.find((p) => p.type === "father")
  const mother = parents.find((p) => p.type === "mother")
  const guardian = parents.find((p) => p.type === "guardian")

  const ParentCard = ({ label, parent, color, bgColor }: {
    label: string
    parent?: typeof parents[0]
    color: string
    bgColor: string
  }) => {
    if (!parent) {
      return (
        <div className="bg-card rounded-xl border-2 border-dashed border-border/60 p-6 text-center">
          <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center", bgColor, "opacity-50")}>
            <User className={cn("w-6 h-6", color)} />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Belum ada data {label}</p>
          <Link
            href={`/buku-induk/${student.id}/edit?focus=parent_${label.toLowerCase()}`}
            className="text-xs text-primary hover:underline"
          >
            Tambahkan data {label}
          </Link>
        </div>
      )
    }

    return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgColor)}>
            <User className={cn("w-6 h-6", color)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{parent.full_name || <span className="italic">Nama belum diisi</span>}</p>
          </div>
        </div>

        {parent.phone && (
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${parent.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Telepon
            </a>
            <a
              href={`https://wa.me/${parent.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(parent.phone!)
                showToast("Nomor disalin", "success")
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Salin
            </button>
          </div>
        )}

        {parent.occupation && (
          <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <span className="font-medium">Pekerjaan:</span> {parent.occupation}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ParentCard label="Ayah" parent={father} color="text-blue-600" bgColor="bg-blue-100" />
      <ParentCard label="Ibu" parent={mother} color="text-pink-600" bgColor="bg-pink-100" />
      {guardian && (
        <div className="lg:col-span-2">
          <ParentCard label="Wali" parent={guardian} color="text-purple-600" bgColor="bg-purple-100" />
        </div>
      )}
    </div>
  )
}

// ============================================
// TAB KESEHATAN
// ============================================
function HealthTab({ student }: { student: StudentWithClass }) {
  const hasHealthData = student.height_cm || student.weight_kg || student.blood_type ||
    student.vision || student.hearing || student.teeth_condition || student.physical_disability ||
    student.illness_history || student.allergies || student.health_notes

  if (!hasHealthData) {
    return (
      <UnifiedEmptyState
        icon={<HeartPulse className="w-7 h-7" />}
        title="Belum ada data kesehatan"
        description="Data kesehatan siswa akan ditampilkan di sini setelah diisi."
      />
    )
  }

  // Normalize health values for display
  const normalizeValue = (value: string | null | undefined): string => {
    if (!value) return "—"
    const normalized = value.toLowerCase()
    if (normalized === "none" || normalized === "-" || normalized === "unknown") return "Belum diketahui"
    if (normalized === "normal") return "Normal"
    if (normalized === "tidak ada") return "Tidak ada"
    return value
  }

  // Get status indicator color
  const getStatusColor = (value: string | null | undefined) => {
    if (!value) return "bg-muted"
    const normalized = value.toLowerCase()
    if (normalized === "normal" || normalized === "tidak ada" || normalized === "none" || normalized === "-") return "bg-emerald-500"
    if (normalized === "unknown") return "bg-muted"
    return "bg-amber-500"
  }

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    if (!student.height_cm || !student.weight_kg) return null
    const heightInM = student.height_cm / 100
    const bmi = student.weight_kg / (heightInM * heightInM)
    let category = ""
    if (bmi < 18.5) category = "Kurus"
    else if (bmi < 25) category = "Normal"
    else if (bmi < 30) category = "Gemuk"
    else category = "Obesitas"
    return { value: bmi.toFixed(1), category }
  }

  const bmiData = calculateBMI()

  // Health item with status dot
  const HealthItem = ({ label, value, icon }: { label: string; value: string | null | undefined; icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/60">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{normalizeValue(value)}</p>
      </div>
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", getStatusColor(value))} />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Pengukuran */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Ruler className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Pengukuran</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Ruler className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Tinggi Badan</p>
              <p className="text-lg font-semibold text-foreground">
                {student.height_cm ? `${student.height_cm} cm` : "—"}
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Scale className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Berat Badan</p>
              <p className="text-lg font-semibold text-foreground">
                {student.weight_kg ? `${student.weight_kg} kg` : "—"}
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Gol. Darah</p>
              <p className="text-lg font-semibold text-foreground">
                {student.blood_type || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* IMT */}
      {bmiData && (
        <div className="bg-card rounded-xl border border-border/60 shadow-sm">
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Indeks Massa Tubuh (IMT)</h3>
          </div>
          <div className="p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{bmiData.value}</span>
              <span className="text-sm text-muted-foreground">{bmiData.category}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">*Gambaran awal, bukan diagnosis</p>
          </div>
        </div>
      )}

      {/* Kondisi */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Kondisi Kesehatan</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <HealthItem label="Penglihatan" value={student.vision} icon={<Eye className="w-4 h-4" />} />
            <HealthItem label="Pendengaran" value={student.hearing} icon={<Ear className="w-4 h-4" />} />
            <HealthItem label="Gigi & Mulut" value={student.teeth_condition} icon={<Activity className="w-4 h-4" />} />
            <HealthItem label="Disabilitas" value={student.physical_disability === "none" ? "Tidak Ada" : student.physical_disability} icon={<FileWarning className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      {/* Riwayat */}
      {(student.illness_history || student.allergies || student.health_notes) && (
        <div className="bg-card rounded-xl border border-border/60 shadow-sm">
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Riwayat & Catatan</h3>
          </div>
          <div className="p-4 space-y-3">
            {student.allergies && (
              <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-700 mb-0.5">Alergi</p>
                  <p className="text-sm text-foreground">{student.allergies}</p>
                </div>
              </div>
            )}
            {student.illness_history && (
              <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-0.5">Riwayat Sakit</p>
                  <p className="text-sm text-foreground">{student.illness_history}</p>
                </div>
              </div>
            )}
            {student.health_notes && (
              <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-0.5">Catatan Kesehatan</p>
                  <p className="text-sm text-foreground">{student.health_notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// TAB AKTIVITAS
// ============================================
function ActivityTab({ student }: { student: StudentWithClass }) {
  const [visibleCount, setVisibleCount] = useState(10)

  // Build timeline data - newest first
  const buildTimeline = () => {
    const items: Array<{
      id: string
      title: string
      desc: string
      date: string
      icon: React.ReactNode
      color: string
      iconBg: string
    }> = []

    // Pendaftaran siswa baru
    if (student.created_at) {
      items.push({
        id: "registration",
        title: "Terdaftar sebagai siswa baru",
        desc: `Tahun ajaran ${student.student_classes?.[0]?.academic_years?.name || "—"}`,
        date: student.created_at,
        icon: <UserPlus className="w-4 h-4" />,
        color: "text-emerald-600",
        iconBg: "bg-emerald-100",
      })
    }

    // Riwayat kelas
    student.student_classes?.forEach((sc, idx) => {
      if (sc.start_date && sc.classes) {
        const className = `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
        items.push({
          id: `class-${idx}`,
          title: "Kelas diperbarui",
          desc: `Pindah ke kelas ${className}`,
          date: sc.start_date,
          icon: <BookOpen className="w-4 h-4" />,
          color: "text-blue-600",
          iconBg: "bg-blue-100",
        })
      }
    })

    // Update terakhir
    if (student.updated_at && student.updated_at !== student.created_at) {
      items.push({
        id: "update",
        title: "Data siswa diperbarui",
        desc: `Tahun ajaran ${student.student_classes?.[0]?.academic_years?.name || "—"}`,
        date: student.updated_at,
        icon: <Clock className="w-4 h-4" />,
        color: "text-slate-600",
        iconBg: "bg-slate-100",
      })
    }

    return items
  }

  const timeline = buildTimeline()
  const visibleItems = timeline.slice(0, visibleCount)
  const hasMore = timeline.length > visibleCount

  // Relative date formatting
  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" })

    if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, "minute")
    } else if (diffHours < 24) {
      return rtf.format(-diffHours, "hour")
    } else if (diffDays < 30) {
      return rtf.format(-diffDays, "day")
    } else {
      return rtf.format(-Math.floor(diffDays / 30), "month")
    }
  }

  const formatAbsoluteDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (timeline.length === 0) {
    return (
      <UnifiedEmptyState
        icon={<History className="w-7 h-7" />}
        title="Belum ada aktivitas"
        description="Aktivitas siswa akan ditampilkan di sini"
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Timeline header */}
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Riwayat Aktivitas</h3>
      </div>

      {/* Timeline */}
      <div className="relative pl-0">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/60" />

        <div className="space-y-0">
          {visibleItems.map((item, index) => (
            <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Icon */}
              <div className={cn(
                "relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                item.iconBg
              )}>
                <span className={item.color}>{item.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {formatAbsoluteDate(item.date)} · {formatRelativeDate(item.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="pl-13 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Tampilkan lebih banyak
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Menampilkan {visibleItems.length} dari {timeline.length} aktivitas
          </p>
        </div>
      )}

      {/*
        Catatan developer: Untuk mencatat setiap perubahan data siswa secara otomatis,
        buat tabel activity_logs dengan trigger di Supabase.
        Trigger dapat mencatat setiap UPDATE/INSERT/DELETE pada tabel siswa
        beserta user yang melakukan perubahan.
      */}
    </div>
  )
}

// ============================================
// UNIFIED EMPTY STATE
// ============================================
function UnifiedEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// ============================================
// UNIFIED ERROR STATE
// ============================================
function UnifiedErrorState({
  title,
  description,
  onRetry,
}: {
  title: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4 text-destructive">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  )
}

// ============================================
// LOADING SKELETON
// ============================================
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="h-20 bg-muted" />
        <div className="p-5 -mt-12">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-7 w-64 bg-muted rounded-lg" />
              <div className="flex gap-3">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-5 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5 space-y-4">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
function StudentDetailContent({ studentId, initialTab }: { studentId: string; initialTab: string }) {
  const router = useRouter()
  const { academicYear } = useAcademicYear()
  const { student, loading, error } = useStudent(studentId)

  // Active tab from parent (StickyTabBar)
  const activeTab = initialTab

  // Error state
  if (error) {
    return (
      <UnifiedErrorState
        title="Gagal memuat data siswa"
        description={error.message}
        onRetry={() => window.location.reload()}
      />
    )
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />
  }

  // Not found
  if (!student) {
    return (
      <UnifiedEmptyState
        icon={<AlertCircle className="w-7 h-7" />}
        title="Siswa tidak ditemukan"
        description="ID siswa tidak valid atau data sudah tidak tersedia."
        action={{ label: "Kembali ke Daftar", onClick: () => router.push("/buku-induk") }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <ProfileHero student={student} />

      {/* Tab Content with animation */}
      <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200">
        {activeTab === "personal" && <PersonalTab student={student} />}
        {activeTab === "parents" && <ParentsTab student={student} />}
        {activeTab === "health" && <HealthTab student={student} />}
        {activeTab === "documents" && <DocumentsTab studentId={student.id} />}
        {activeTab === "attendance" && <AttendanceSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "assessment" && <AssessmentSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "character" && <CharacterSummary studentId={student.id} academicYearId={academicYear?.id} />}
        {activeTab === "activity" && <ActivityTab student={student} />}
      </div>
    </div>
  )
}

// ============================================
// MINI HEADER - Tampil saat scroll
// ============================================
function MiniHeader({ studentId, initialActiveTab }: { studentId: string; initialActiveTab: string }) {
  const router = useRouter()
  const { student, loading } = useStudent(studentId)
  const [isVisible, setIsVisible] = useState(false)
  const [navInfo, setNavInfo] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null })

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get navigation info
  useEffect(() => {
    const listData = sessionStorage.getItem("buku-induk-list")
    const currentId = sessionStorage.getItem("buku-induk-current-id")
    if (listData && currentId) {
      try {
        const { studentIds } = JSON.parse(listData)
        const currentIndex = studentIds.indexOf(currentId)
        setNavInfo({
          prev: currentIndex > 0 ? studentIds[currentIndex - 1] : null,
          next: currentIndex < studentIds.length - 1 ? studentIds[currentIndex + 1] : null,
        })
      } catch {
        // Ignore
      }
    }
  }, [])

  if (loading || !student) return null

  const initials = student.full_name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border/60 transition-transform duration-200",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="h-14 px-4 flex items-center gap-3">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Link href="/buku-induk">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            disabled={!navInfo.prev}
            onClick={() => navInfo.prev && (window.location.href = `/buku-induk/${navInfo.prev}`)}
            aria-label="Siswa sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            disabled={!navInfo.next}
            onClick={() => navInfo.next && (window.location.href = `/buku-induk/${navInfo.next}`)}
            aria-label="Siswa berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden flex-shrink-0">
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-white">{initials}</span>
          )}
        </div>

        {/* Name and status */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm font-medium truncate">{student.full_name}</span>
          <Badge variant={student.is_active ? "success" : "neutral"} size="sm">
            {student.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        {/* Edit button */}
        <Link href={`/buku-induk/${student.id}/edit`}>
          <Button size="sm" className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// STICKY TAB BAR (Client Component)
// ============================================
function StickyTabBar({ studentId, initialActiveTab }: { studentId: string; initialActiveTab: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialActiveTab)

  // Sync with URL changes (e.g., back/forward navigation)
  const handlePopState = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab") || "personal"
    setActiveTab(tab)
  }, [])

  // Listen for browser back/forward
  useEffect(() => {
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [handlePopState])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", tabId)
    router.push(url.pathname + url.search, { scroll: false })
  }

  return (
    <>
      {/* Tab Bar - underline style */}
      <div className="relative bg-background/80 backdrop-blur border-b border-border/60 -mx-4 px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-none",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
              {/* Underline indicator */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-200",
                  activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ============================================
// PAGE COMPONENT
// ============================================
interface StudentDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default function StudentDetailPage({ params, searchParams }: StudentDetailPageProps) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)
  const activeTab = resolvedSearchParams.tab || "personal"

  // Store student list in sessionStorage for navigation
  useEffect(() => {
    // This will be populated from the list page via sessionStorage
    // For now, we just ensure the navigation IDs are available
    const listData = sessionStorage.getItem("buku-induk-list")
    if (listData) {
      try {
        const parsed = JSON.parse(listData)
        // Store the current student ID for navigation
        sessionStorage.setItem("buku-induk-current-id", resolvedParams.id)
      } catch {
        // Ignore parse errors
      }
    }
  }, [resolvedParams.id])

  // Keyboard navigation [ and ]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if focus is on an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "[") {
        // Navigate to previous student
        const currentId = sessionStorage.getItem("buku-induk-current-id")
        const listData = sessionStorage.getItem("buku-induk-list")
        if (listData && currentId) {
          try {
            const { studentIds } = JSON.parse(listData)
            const currentIndex = studentIds.indexOf(currentId)
            if (currentIndex > 0) {
              window.location.href = `/buku-induk/${studentIds[currentIndex - 1]}`
            }
          } catch {
            // Ignore
          }
        }
      } else if (e.key === "]") {
        // Navigate to next student
        const currentId = sessionStorage.getItem("buku-induk-current-id")
        const listData = sessionStorage.getItem("buku-induk-list")
        if (listData && currentId) {
          try {
            const { studentIds } = JSON.parse(listData)
            const currentIndex = studentIds.indexOf(currentId)
            if (currentIndex < studentIds.length - 1) {
              window.location.href = `/buku-induk/${studentIds[currentIndex + 1]}`
            }
          } catch {
            // Ignore
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <AppShell showHeader={true}>
      {/* Mini Header - tampil saat scroll */}
      <MiniHeader studentId={resolvedParams.id} initialActiveTab={activeTab} />

      {/* Breadcrumb with navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/buku-induk"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Buku Induk</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]">
          Detail Siswa
        </span>
      </div>

      {/* Sticky Tab Bar */}
      <StickyTabBar studentId={resolvedParams.id} initialActiveTab={activeTab} />
    </AppShell>
  )
}
