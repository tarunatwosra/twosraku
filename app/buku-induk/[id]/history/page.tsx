"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  AlertCircle,
  BookOpen,
  Clock,
  GraduationCap,
  ArrowRightLeft,
  UserPlus,
  History,
  TrendingUp,
  Calendar,
  Edit,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Button, Badge, Avatar, Card } from "@/components/ui"
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
    info: "bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200/50",
    success: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 border border-emerald-200/50",
    warning: "bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 border border-amber-200/50",
    danger: "bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 border border-red-200/50",
    neutral: "bg-gradient-to-br from-slate-50 to-slate-100/50 text-slate-600 border border-slate-200/50",
  }

  return (
    <div className="flex gap-5 group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-sm",
            variantStyles[item.variant]
          )}
        >
          {item.icon}
        </div>
        {!isLast && (
          <div className="w-1 flex-1 bg-gradient-to-b from-[var(--border-light)] to-[var(--border-light)]/30 my-2 min-h-[48px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--border-light)]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Timeline dot */}
              <div className={cn(
                "w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 shadow-sm",
                item.variant === "success" ? "bg-emerald-500" :
                item.variant === "info" ? "bg-blue-500" :
                item.variant === "warning" ? "bg-amber-500" :
                item.variant === "danger" ? "bg-red-500" : "bg-slate-400"
              )} />
              <div>
                <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h4>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            {/* Date pill */}
            <span className="text-[12px] text-[var(--text-muted)] whitespace-nowrap bg-slate-50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-[var(--border-light)]/50 font-medium">
              {formatDate(item.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--border-light)]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
          iconBg
        )}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <p className="text-[12px] text-[var(--text-muted)] mb-0.5 uppercase tracking-wide">{label}</p>
          <p className="text-[20px] font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  )
}

function ClassHistoryCard({
  studentClasses,
  studentId,
}: {
  studentClasses: StudentWithClass["student_classes"]
  studentId: string
}) {
  // Sort by start_date descending
  const sortedClasses = [...(studentClasses || [])].sort((a, b) => {
    const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
    const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border-light)]/50">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-[15px] font-semibold text-[var(--text-primary)] flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
          </div>
          Riwayat Kelas
        </h4>
        <Link
          href={`/buku-induk/${studentId}/edit`}
          className="text-[12px] text-[var(--primary)] hover:text-[var(--primary)]/80 flex items-center gap-1 transition-colors"
        >
          <Edit className="w-3 h-3" />
          Edit
        </Link>
      </div>

      {sortedClasses.length === 0 ? (
        <div className="py-10 text-center bg-[var(--surface-secondary)] rounded-xl border border-dashed border-[var(--border-default)]">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-[13px] text-[var(--text-muted)]">Belum ada data kelas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedClasses.map((sc, index) => {
            const className = sc.classes
              ? `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
              : "-"
            return (
              <div
                key={sc.id}
                className="flex items-center justify-between p-4 bg-[var(--surface-secondary)]/70 rounded-xl hover:bg-[var(--surface-hover)] transition-colors border border-transparent hover:border-[var(--border-light)]/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {className}
                    </p>
                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                      No. Absen: {sc.attendance_number || "-"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={sc.status === "active" ? "success" : "neutral"}
                    className={cn(
                      "px-3 py-1.5 text-[11px] font-semibold rounded-full",
                      sc.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}
                  >
                    {sc.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                  {sc.start_date && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3 h-3" />
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border-light)]/50">
      <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
          <Clock className="w-4 h-4 text-slate-500" />
        </div>
        Informasi Sistem
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)]/70 rounded-xl border border-transparent">
          <div>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Dibuat</p>
            <p className="text-[13px] text-[var(--text-primary)] font-medium">
              {formatDateTime(student.created_at)}
            </p>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
        </div>
        <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)]/70 rounded-xl border border-transparent">
          <div>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">Terakhir Diperbarui</p>
            <p className="text-[13px] text-[var(--text-primary)] font-medium">
              {formatDateTime(student.updated_at)}
            </p>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
        </div>
      </div>
    </div>
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
        ? `${sc.classes.majors?.name || ""} ${sc.classes.name || ""}`.trim()
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

        <Card variant="elevated" className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">
            {error || "Siswa Tidak Ditemukan"}
          </h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-6">
            Data siswa tidak dapat dimuat
          </p>
          <Button onClick={() => router.push("/buku-induk")}>
            Kembali ke Buku Induk
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
            href={`/buku-induk/${studentId}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Siswa
          </Link>
        </div>

        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-[var(--surface-hover)] rounded-xl" />
              <div className="w-32 h-4 bg-[var(--surface-hover)] rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-24 bg-white rounded-2xl shadow-sm border border-[var(--border-light)]/50" />
            <div className="h-24 bg-white rounded-2xl shadow-sm border border-[var(--border-light)]/50" />
          </div>
          <div className="h-96 bg-white rounded-2xl shadow-sm border border-[var(--border-light)]/50" />
        </div>
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
      <div className="mb-8 flex items-center gap-5">
        <div className="relative">
          <Avatar
            fallback={student.full_name}
            src={student.photo_url}
            size="lg"
            className="w-16 h-16 text-xl ring-4 ring-white shadow-xl"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm shadow-emerald-200" />
        </div>
        <div className="flex-1">
          <h1 className="text-[26px] font-bold text-[var(--text-primary)]">
            Riwayat Siswa
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            {student.full_name}
          </p>
          <span className="inline-flex items-center gap-2 text-[12px] font-mono bg-[var(--surface-secondary)] px-4 py-2 rounded-full text-[var(--text-muted)] mt-2 border border-[var(--border-light)]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            NIS {student.student_number}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-amber-50 to-amber-100/50"
              iconColor="text-amber-600"
              label="Status"
              value={student.is_active ? "Aktif" : "Tidak Aktif"}
            />
            <SummaryCard
              icon={<UserPlus className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
              iconColor="text-emerald-600"
              label="Tahun Masuk"
              value={student.enrollment_year?.toString() || "-"}
            />
            {student.graduation_year && (
              <SummaryCard
                icon={<GraduationCap className="w-5 h-5" />}
                iconBg="bg-gradient-to-br from-blue-50 to-blue-100/50"
                iconColor="text-blue-600"
                label="Tahun Lulus"
                value={student.graduation_year.toString()}
              />
            )}
          </div>

          {/* Timeline */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                  Timeline Aktivitas
                </h2>
                <p className="text-[13px] text-[var(--text-muted)]">
                  Riwayat perubahan dan aktivitas siswa
                </p>
              </div>
            </div>

            {timeline.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-[14px] text-[var(--text-muted)]">
                  Belum ada riwayat aktivitas
                </p>
              </div>
            ) : (
              <div className="pl-1">
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
        <div className="space-y-5">
          {/* Class History */}
          <ClassHistoryCard studentClasses={student.student_classes} studentId={studentId!} />

          {/* Audit Info */}
          <AuditInfo student={student} />
        </div>
      </div>
    </AppShell>
  )
}
