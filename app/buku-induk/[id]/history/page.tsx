"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  Clock,
  User,
  GraduationCap,
  ArrowRightLeft,
  Pencil,
  UserPlus,
  History,
  TrendingUp,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Card, Button, Badge, Avatar } from "@/components/ui"
import { fetchStudent } from "../../lib/supabase"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface HistoryItem {
  id: string
  type: "status_change" | "class_change" | "enrollment" | "graduation" | "transfer" | "update" | "character" | "attendance" | "assessment"
  title: string
  description: string
  date: string
  icon: React.ReactNode
  variant: "info" | "success" | "warning" | "danger" | "neutral"
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ============================================
// COMPONENTS
// ============================================

function TimelineItem({
  item,
  isLast,
}: {
  item: HistoryItem
  isLast: boolean
}) {
  const variantStyles = {
    info: "bg-blue-100 text-blue-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    neutral: "bg-gray-100 text-gray-600",
  }

  return (
    <div className="flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            variantStyles[item.variant]
          )}
        >
          {item.icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-[var(--border-light)] my-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-[14px] font-medium text-[var(--text-primary)]">
              {item.title}
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">
              {item.description}
            </p>
          </div>
          <span className="text-[12px] text-[var(--text-muted)] whitespace-nowrap">
            {formatDate(item.date)}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatusChangeCard({
  student,
}: {
  student: StudentWithClass
}) {
  const statusVariants = {
    active: { label: "Aktif", variant: "success" as const },
    inactive: { label: "Tidak Aktif", variant: "warning" as const },
  }

  const status = statusVariants[student.is_active ? "active" : "inactive"] || {
    label: student.is_active ? "Aktif" : "Tidak Aktif",
    variant: "neutral" as const,
  }

  return (
    <Card padding="md" className="bg-[var(--surface-secondary)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-[13px] text-[var(--text-muted)]">Status Saat Ini</p>
            <p className="text-[15px] font-medium text-[var(--text-primary)]">
              {status.label}
            </p>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
    </Card>
  )
}

function EnrollmentCard({
  student,
}: {
  student: StudentWithClass
}) {
  return (
    <Card padding="md" className="bg-[var(--surface-secondary)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--success-soft)] flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-[var(--success)]" />
        </div>
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">Tahun Masuk</p>
          <p className="text-[15px] font-medium text-[var(--text-primary)]">
            {student.enrollment_year || "-"}
          </p>
        </div>
      </div>
    </Card>
  )
}

function GraduationCard({
  student,
}: {
  student: StudentWithClass
}) {
  if (!student.graduation_year) return null

  return (
    <Card padding="md" className="bg-[var(--surface-secondary)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--info-soft)] flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-[var(--info)]" />
        </div>
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">Tahun Lulus</p>
          <p className="text-[15px] font-medium text-[var(--text-primary)]">
            {student.graduation_year}
          </p>
        </div>
      </div>
    </Card>
  )
}

function ClassHistoryCard({
  studentClasses,
}: {
  studentClasses: StudentWithClass["student_classes"]
}) {
  // Sort by start_date descending
  const sortedClasses = [...(studentClasses || [])].sort((a, b) => {
    const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
    const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="space-y-3">
      <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">
        Riwayat Kelas
      </h4>
      {sortedClasses.length === 0 ? (
        <p className="text-[13px] text-[var(--text-muted)]">Belum ada data kelas</p>
      ) : (
        <div className="space-y-2">
          {sortedClasses.map((sc, index) => {
            const className = sc.classes
              ? `${sc.classes.grades?.name || ""} ${sc.classes.majors?.name || ""}`.trim()
              : "-"
            return (
              <div
                key={sc.id}
                className="flex items-center justify-between py-2 px-3 bg-[var(--surface-secondary)] rounded-[12px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                      {className}
                    </p>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      No. Absen: {sc.attendance_number || "-"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={sc.status === "active" ? "success" : "neutral"}>
                    {sc.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                  {sc.start_date && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      {formatDate(sc.start_date)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AuditInfo({
  student,
}: {
  student: StudentWithClass
}) {
  return (
    <Card padding="md">
      <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
        Informasi Audit
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[var(--text-muted)]">Dibuat</p>
          <p className="text-[13px] text-[var(--text-primary)]">
            {formatDateTime(student.created_at)}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--text-muted)]">Terakhir Diperbarui</p>
          <p className="text-[13px] text-[var(--text-primary)]">
            {formatDateTime(student.updated_at)}
          </p>
        </div>
      </div>
    </Card>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

interface StudentHistoryPageProps {
  params: Promise<{ id: string }>
}

export default function StudentHistoryPage({ params }: StudentHistoryPageProps) {
  const router = useRouter()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolve params
  useEffect(() => {
    params.then((p) => setStudentId(p.id))
  }, [params])

  // Fetch student data
  useEffect(() => {
    if (!studentId) return

    const loadStudent = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStudent(studentId)
        if (!data) {
          setError("Siswa tidak ditemukan")
          return
        }
        setStudent(data)
      } catch (err) {
        console.error("Error loading student:", err)
        setError("Gagal memuat data siswa")
      } finally {
        setLoading(false)
      }
    }

    loadStudent()
  }, [studentId])

  // Generate history timeline
  const generateTimeline = (): HistoryItem[] => {
    if (!student) return []

    const items: HistoryItem[] = []

    // Enrollment
    if (student.enrollment_year) {
      items.push({
        id: "enrollment",
        type: "enrollment",
        title: "Pendaftaran Siswa Baru",
        description: `Masuk sebagai siswa baru tahun ajaran ${student.enrollment_year}`,
        date: student.created_at,
        icon: <UserPlus className="w-5 h-5" />,
        variant: "success",
      })
    }

    // Status changes - check graduation via graduation_year
    if (student.graduation_year) {
      items.push({
        id: "graduation",
        type: "graduation",
        title: "Kelulusan",
        description: `Lulus dari sekolah tahun ${student.graduation_year}`,
        date: student.graduation_year
          ? `${student.graduation_year}-06-01`
          : student.updated_at,
        icon: <GraduationCap className="w-5 h-5" />,
        variant: "info",
      })
    }

    // Check transfer via transfer_date
    if (student.transfer_date && !student.graduation_year) {
      items.push({
        id: "transfer",
        type: "transfer",
        title: "perpindahan",
        description: student.transfer_reason || "Siswa pindah ke sekolah lain",
        date: student.transfer_date || student.updated_at,
        icon: <ArrowRightLeft className="w-5 h-5" />,
        variant: "warning",
      })
    }

    // Class changes
    const classHistory = [...(student.student_classes || [])]
      .filter((sc) => sc.start_date)
      .sort(
        (a, b) =>
          new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime()
      )

    classHistory.forEach((sc, index) => {
      const className = sc.classes
        ? `${sc.classes.grades?.name || ""} ${sc.classes.majors?.name || ""}`.trim()
        : "Kelas Tidak Diketahui"

      items.push({
        id: `class-${sc.id}`,
        type: "class_change",
        title: index === 0 ? "Kelas Saat Ini" : "perpindahan Kelas",
        description: `Pindah ke ${className}`,
        date: sc.start_date || student.updated_at,
        icon: <BookOpen className="w-5 h-5" />,
        variant: index === 0 ? "success" : "info",
      })
    })

    // Last update
    items.push({
      id: "last-update",
      type: "update",
      title: "Terakhir Diperbarui",
      description: "Data siswa terakhir diperbarui",
      date: student.updated_at,
      icon: <Clock className="w-5 h-5" />,
      variant: "neutral",
    })

    // Sort by date descending
    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  // Loading state
  if (loading) {
    return (
      <AppShell showHeader={true}>
        <div className="mb-6">
          <Link
            href={`/buku-induk/${studentId}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Siswa
          </Link>
        </div>

        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-[var(--surface-hover)] rounded-[28px]" />
          <div className="h-96 bg-[var(--surface-hover)] rounded-[28px]" />
        </div>
      </AppShell>
    )
  }

  // Error state
  if (error || !student) {
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
            {error || "Siswa Tidak Ditemukan"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Data siswa tidak dapat dimuat
          </p>
          <Button onClick={() => router.push("/buku-induk")}>
            Kembali ke Buku Induk
          </Button>
        </Card>
      </AppShell>
    )
  }

  const timeline = generateTimeline()

  return (
    <AppShell showHeader={true}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/buku-induk/${studentId}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Detail Siswa
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar
          fallback={student.full_name}
          src={student.photo_url}
          size="lg"
          className="w-16 h-16 text-xl bg-[var(--primary-soft)] text-[var(--primary)]"
        />
        <div>
          <h1 className="text-[24px] font-bold text-[var(--text-primary)]">
            Riwayat Siswa
          </h1>
          <p className="text-[14px] text-[var(--text-muted)]">
            {student.full_name} • NIS: {student.student_number}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusChangeCard student={student} />
            <EnrollmentCard student={student} />
            {student.graduation_year && (
              <GraduationCard student={student} />
            )}
          </div>

          {/* Timeline */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                <History className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  Timeline Aktivitas
                </h2>
                <p className="text-[13px] text-[var(--text-muted)]">
                  Riwayat perubahan dan aktivitas siswa
                </p>
              </div>
            </div>

            {timeline.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--text-muted)]">
                  Belum ada riwayat aktivitas
                </p>
              </div>
            ) : (
              <div className="pl-2">
                {timeline.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isLast={index === timeline.length - 1}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Class History */}
          <Card padding="lg">
            <ClassHistoryCard studentClasses={student.student_classes} />
          </Card>

          {/* Audit Info */}
          <AuditInfo student={student} />
        </div>
      </div>
    </AppShell>
  )
}
