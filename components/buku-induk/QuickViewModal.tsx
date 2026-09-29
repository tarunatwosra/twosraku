"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MapPin,
  Phone,
  Calendar,
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

const GENDER_LABELS = { male: "Laki-laki", female: "Perempuan" } as const

function formatDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export function QuickViewModal({ isOpen, onClose, studentId, academicYearId }: QuickViewModalProps) {
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && studentId) {
      const loadStudent = async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchStudent(studentId)
          if (data) setStudent(data)
          else setError("Siswa tidak ditemukan")
        } catch (err) {
          console.error("Error:", err)
          setError("Gagal memuat data")
        } finally {
          setLoading(false)
        }
      }
      loadStudent()
    }
  }, [isOpen, studentId])

  const getActiveClass = () => {
    if (!student?.student_classes) return null
    const activeClass = student.student_classes.find((sc) => sc.academic_year_id === academicYearId && sc.status === "active")
    if (activeClass?.classes) return `${activeClass.classes.majors?.name || ""} ${activeClass.classes.name || ""}`.trim()
    const anyActive = student.student_classes.find((sc) => sc.status === "active")
    if (anyActive?.classes) return `${anyActive.classes.majors?.name || ""} ${anyActive.classes.name || ""}`.trim()
    return null
  }

  const className = getActiveClass()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin mb-3" />
          <p className="text-[12px] text-[var(--text-secondary)]">Memuat...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-6 h-6 text-[var(--danger)] mb-3" />
          <p className="text-[12px] text-[var(--danger)]">{error}</p>
        </div>
      ) : student ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3 p-4 bg-[var(--surface-secondary)] rounded-[18px]">
            <Avatar fallback={student.full_name} src={student.photo_url} size="md" className="w-12 h-12 text-sm bg-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] truncate">{student.full_name}</h3>
                <Badge variant={student.is_active ? "success" : "neutral"} size="sm">
                  {student.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                <span className="font-mono">{student.student_number}</span>
                {className && <><span>·</span><span className="text-[var(--primary)]">{className}</span></>}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">JK</p>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">{GENDER_LABELS[student.gender] || student.gender}</p>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Lahir</p>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">{formatDate(student.birth_date)}</p>
            </div>
            {student.birth_place && (
              <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Tempat</p>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{student.birth_place}</p>
              </div>
            )}
            {student.religion && (
              <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Agama</p>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{student.religion}</p>
              </div>
            )}
            {student.phone && (
              <div className="col-span-2 p-3 bg-[var(--surface-secondary)] rounded-[14px]">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Telepon</p>
                </div>
                <p className="text-[13px] font-medium text-[var(--text-primary)] mt-1">{student.phone}</p>
              </div>
            )}
          </div>

          {/* Address */}
          {student.address && (
            <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Alamat</p>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)]">{student.address}</p>
            </div>
          )}

          {/* Parents */}
          {student.parents && student.parents.length > 0 && (
            <div className="p-3 bg-[var(--surface-secondary)] rounded-[14px]">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Orang Tua</p>
              </div>
              <div className="space-y-1.5">
                {student.parents.map((parent) => (
                  <div key={parent.id} className="flex justify-between text-[12px]">
                    <span className="text-[var(--text-secondary)]">{parent.type === "father" ? "Ayah" : parent.type === "mother" ? "Ibu" : "Wali"}</span>
                    <span className="font-medium text-[var(--text-primary)]">{parent.full_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Link href={`/buku-induk/${student.id}`} onClick={onClose} className="flex-1 flex items-center justify-center gap-2 h-12 bg-[var(--primary)] text-white text-[13px] font-medium rounded-[14px] hover:opacity-90 transition-opacity touch-target">
              <Eye className="w-4 h-4" />Detail
            </Link>
            <Link href={`/buku-induk/${student.id}/edit`} onClick={onClose} className="flex-1 flex items-center justify-center gap-2 h-12 bg-white text-[var(--text-primary)] text-[13px] font-medium rounded-[14px] border border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors touch-target">
              <Pencil className="w-4 h-4" />Edit
            </Link>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
