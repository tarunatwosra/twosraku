"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  User,
  Loader2,
  AlertCircle,
  Eye,
  Pencil,
  GraduationCap,
  Heart,
} from "lucide-react"
import { Modal } from "@/components/ui"
import { Badge, Avatar } from "@/components/ui"
import { fetchStudent } from "@/app/buku-induk/lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  academicYearId?: string
}

// Status helpers - use is_active boolean
const STATUS_VARIANTS = {
  active: "success",
  inactive: "neutral",
} as const

const STATUS_LABELS = {
  active: "Aktif",
  inactive: "Tidak Aktif",
} as const

const GENDER_LABELS = {
  male: "Laki-laki",
  female: "Perempuan",
} as const

// Format helpers
function formatDate(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatAge(birthDate: string | null): string {
  if (!birthDate) return ""
  const birth = new Date(birthDate)
  const today = new Date()
  const age = Math.floor(
    (today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  )
  return `${age} tahun`
}

// ============================================
// INFO CARD COMPONENT
// ============================================
function InfoCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("p-4 bg-[var(--surface-secondary)] rounded-[16px]", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-[14px] text-[var(--text-primary)] font-semibold truncate">
        {value}
      </p>
    </div>
  )
}

export function QuickViewModal({
  isOpen,
  onClose,
  studentId,
  academicYearId,
}: QuickViewModalProps) {
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch student data
  useEffect(() => {
    if (isOpen && studentId) {
      const loadStudent = async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchStudent(studentId)
          if (data) {
            setStudent(data)
          } else {
            setError("Siswa tidak ditemukan")
          }
        } catch (err) {
          console.error("Error fetching student:", err)
          setError("Gagal memuat data siswa")
        } finally {
          setLoading(false)
        }
      }
      loadStudent()
    }
  }, [isOpen, studentId])

  // Get active class name
  const getActiveClass = () => {
    if (!student?.student_classes) return "-"
    const activeClass = student.student_classes.find(
      (sc) =>
        academicYearId && sc.academic_year_id === academicYearId && sc.status === "active"
    )
    if (activeClass?.classes) {
      return `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    }
    // Fallback to any active class
    const anyActive = student.student_classes.find((sc) => sc.status === "active")
    if (anyActive?.classes) {
      return `${anyActive.classes.majors?.name || ""} ${anyActive.classes.name || ""}`.trim()
    }
    return "-"
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          </div>
          <p className="text-[14px] text-[var(--text-muted)] font-medium">
            Memuat data siswa...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
          </div>
          <p className="text-[14px] text-[var(--danger)] font-medium">{error}</p>
        </div>
      ) : student ? (
        <div className="space-y-6">
          {/* Header - Avatar & Basic Info */}
          <div className="flex items-start gap-5 p-6 bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-hover)] rounded-[24px]">
            <div className="relative">
              <Avatar
                fallback={student.full_name}
                src={student.photo_url}
                size="lg"
                className="w-20 h-20 text-2xl ring-4 ring-white shadow-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                {student.gender === "male" ? (
                  <span className="text-[10px] font-bold text-blue-500">L</span>
                ) : (
                  <span className="text-[10px] font-bold text-pink-500">P</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[20px] font-bold text-[var(--text-primary)] truncate">
                  {student.full_name}
                </h3>
                <Badge
                  variant={student.is_active ? STATUS_VARIANTS.active : STATUS_VARIANTS.inactive}
                  className={cn(
                    "px-3 py-1 text-[11px] font-semibold",
                    student.is_active
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
                  {student.is_active ? STATUS_LABELS.active : STATUS_LABELS.inactive}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                <span className="font-mono bg-white px-2 py-0.5 rounded-[8px] text-[12px] shadow-sm">
                  NIS {student.student_number}
                </span>
              </div>
              {getActiveClass() !== "-" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <GraduationCap className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[13px] text-[var(--text-muted)]">{getActiveClass()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Heart className="w-4 h-4 text-[var(--danger)]" />}
              label="Jenis Kelamin"
              value={GENDER_LABELS[student.gender] || student.gender}
            />
            <InfoCard
              icon={<Calendar className="w-4 h-4 text-[var(--primary)]" />}
              label="Tanggal Lahir"
              value={`${formatDate(student.birth_date)}${
                student.birth_date ? ` (${formatAge(student.birth_date)})` : ""
              }`}
            />
            {student.birth_place && (
              <InfoCard
                icon={<MapPin className="w-4 h-4 text-[var(--warning)]" />}
                label="Tempat Lahir"
                value={student.birth_place}
              />
            )}
            {student.religion && (
              <InfoCard
                icon={<BookOpen className="w-4 h-4 text-[var(--info)]" />}
                label="Agama"
                value={student.religion}
              />
            )}
            {student.phone && (
              <InfoCard
                icon={<Phone className="w-4 h-4 text-emerald-500" />}
                label="Telepon"
                value={student.phone}
                className="col-span-2"
              />
            )}
          </div>

          {/* Address */}
          {student.address && (
            <div className="p-4 bg-[var(--surface-secondary)] rounded-[16px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
                  Alamat
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed pl-10">
                {student.address}
              </p>
            </div>
          )}

          {/* Parents Summary */}
          {student.parents && student.parents.length > 0 && (
            <div className="p-4 bg-[var(--surface-secondary)] rounded-[16px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
                  Orang Tua
                </span>
              </div>
              <div className="space-y-2 pl-10">
                {student.parents.map((parent) => (
                  <div key={parent.id} className="flex items-center justify-between">
                    <span className="text-[13px] text-[var(--text-primary)] font-medium">
                      {parent.type === "father" ? "Ayah" : parent.type === "mother" ? "Ibu" : "Wali"}
                    </span>
                    <span className="text-[13px] text-[var(--text-secondary)]">
                      {parent.full_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/buku-induk/${student.id}`}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                "h-[48px] px-4",
                "text-[14px] font-semibold",
                "bg-[var(--primary)] text-white",
                "rounded-[16px]",
                "hover:shadow-[0_4px_16px_rgba(79,124,255,0.3)] transition-all",
                "active:scale-[0.98]"
              )}
              onClick={onClose}
            >
              <Eye className="w-4 h-4" />
              Lihat Detail
            </Link>
            <Link
              href={`/buku-induk/${student.id}/edit`}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                "h-[48px] px-4",
                "text-[14px] font-semibold",
                "bg-white text-[var(--text-primary)]",
                "rounded-[16px]",
                "hover:bg-[var(--surface-secondary)] transition-all",
                "border border-[var(--border-light)] shadow-sm",
                "active:scale-[0.98]"
              )}
              onClick={onClose}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
