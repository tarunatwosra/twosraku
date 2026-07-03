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
      return `${activeClass.classes.grades?.name || ""} ${
        activeClass.classes.majors?.name || ""
      }`.trim()
    }
    // Fallback to any active class
    const anyActive = student.student_classes.find((sc) => sc.status === "active")
    if (anyActive?.classes) {
      return `${anyActive.classes.grades?.name || ""} ${
        anyActive.classes.majors?.name || ""
      }`.trim()
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
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-4" />
          <p className="text-sm text-[var(--text-muted)]">
            Memuat data siswa...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
          </div>
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </div>
      ) : student ? (
        <div className="space-y-6">
          {/* Header - Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar
              fallback={student.full_name}
              src={student.photo_url}
              size="lg"
              className="w-20 h-20 text-xl bg-[var(--primary-soft)] text-[var(--primary)]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] truncate">
                  {student.full_name}
                </h3>
                <Badge variant={student.is_active ? STATUS_VARIANTS.active : STATUS_VARIANTS.inactive}>
                  {student.is_active ? STATUS_LABELS.active : STATUS_LABELS.inactive}
                </Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                NIS: {student.student_number}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">{getActiveClass()}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<User className="w-4 h-4" />}
              label="Jenis Kelamin"
              value={GENDER_LABELS[student.gender] || student.gender}
            />
            {student.birth_place && (
              <InfoItem
                icon={<MapPin className="w-4 h-4" />}
                label="Tempat Lahir"
                value={student.birth_place}
              />
            )}
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Tanggal Lahir"
              value={`${formatDate(student.birth_date)}${
                student.birth_date ? ` (${formatAge(student.birth_date)})` : ""
              }`}
            />
            {student.religion && (
              <InfoItem
                icon={<User className="w-4 h-4" />}
                label="Agama"
                value={student.religion}
              />
            )}
            {student.phone && (
              <InfoItem
                icon={<Phone className="w-4 h-4" />}
                label="Telepon"
                value={student.phone}
              />
            )}
            {student.email && (
              <InfoItem
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={student.email}
              />
            )}
          </div>

          {/* Address */}
          {student.address && (
            <div className="pt-4 border-t border-[var(--border-light)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">Alamat</p>
              <p className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                {student.address}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-light)]">
            <Link
              href={`/buku-induk/${student.id}`}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                "h-[44px] px-4",
                "text-[14px] font-medium",
                "bg-[var(--primary)] text-white",
                "rounded-[18px]",
                "hover:opacity-90 transition-opacity"
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
                "h-[44px] px-4",
                "text-[14px] font-medium",
                "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
                "rounded-[18px]",
                "hover:bg-[var(--surface-hover)] transition-colors",
                "border border-[var(--border-light)]"
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

// Helper component
interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[var(--text-muted)]">{icon}</span>
        <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
      </div>
      <p className="text-[13px] text-[var(--text-primary)] font-medium truncate">
        {value}
      </p>
    </div>
  )
}
