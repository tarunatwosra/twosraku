"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { MobileShell } from "@/components/layout/mobile-shell"
import { Card } from "@/components/ui"
import { useAcademicYear } from "@/hooks/useAcademicYear"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import type { AttendanceStatus } from "@/types/attendance"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  X,
  Loader2,
  Filter,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Stethoscope,
  FileText,
  UserX,
  BarChart3,
} from "lucide-react"

type ViewMode = "monthly" | "semester" | "yearly"

interface ClassInfo {
  id: string
  name: string
  major: string
  studentCount: number
}

interface StudentAttendance {
  studentId: string
  studentNumber: string
  name: string
  gender: "L" | "P"
  photo?: string
  present: number
  sick: number
  permission: number
  absent: number
  totalDays: number
  percentage: number
}

interface StudentDetail {
  studentId: string
  studentNumber: string
  name: string
  gender: "L" | "P"
  photo?: string
  records: {
    date: string
    status: AttendanceStatus
    notes?: string
  }[]
  statistics: {
    present: number
    sick: number
    permission: number
    absent: number
    totalDays: number
    percentage: number
  }
}

interface ClassStatistics {
  totalStudents: number
  totalDays: number
  present: number
  sick: number
  permission: number
  absent: number
  percentage: number
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; shortLabel: string; bgColor: string; textColor: string; dotColor: string; icon: React.ElementType }> = {
  present: {
    label: "Hadir",
    shortLabel: "H",
    bgColor: "bg-[var(--success-soft)]",
    textColor: "text-[var(--success)]",
    dotColor: "bg-[var(--success)]",
    icon: CheckCircle2
  },
  sick: {
    label: "Sakit",
    shortLabel: "S",
    bgColor: "bg-[var(--warning-soft)]",
    textColor: "text-[var(--warning)]",
    dotColor: "bg-[var(--warning)]",
    icon: Stethoscope
  },
  permission: {
    label: "Izin",
    shortLabel: "I",
    bgColor: "bg-[var(--info-soft)]",
    textColor: "text-[var(--info)]",
    dotColor: "bg-[var(--info)]",
    icon: FileText
  },
  absent: {
    label: "Alpa",
    shortLabel: "A",
    bgColor: "bg-[var(--danger-soft)]",
    textColor: "text-[var(--danger)]",
    dotColor: "bg-[var(--danger)]",
    icon: UserX
  },
}

function CircularProgress({ percentage, size = 80, strokeWidth = 6 }: { percentage: number, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 90) return "var(--success)"
    if (percentage >= 75) return "var(--warning)"
    return "var(--danger)"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-[var(--surface-secondary)]" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={getColor()} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[var(--text-primary)]">{percentage}%</span>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, colorClass, bgClass }: { icon: React.ElementType, label: string, value: number | string, colorClass: string, bgClass: string }) {
  return (
    <div className={cn("flex flex-col items-center p-3 rounded-2xl", bgClass)}>
      <Icon className={cn("w-5 h-5 mb-1", colorClass)} />
      <span className={cn("text-lg font-bold", colorClass)}>{value}</span>
      <span className="text-[11px] text-[var(--text-muted)] font-medium">{label}</span>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="p-8 text-center">
      <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
      <p className="text-[14px] text-[var(--text-secondary)]">{message}</p>
    </Card>
  )
}

export default function MobileRecapPresensiPage() {
  const { academicYear } = useAcademicYear()

  const [viewMode, setViewMode] = useState<ViewMode>("monthly")
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
  })
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showClassFilter, setShowClassFilter] = useState(false)
  const [classStatistics, setClassStatistics] = useState<ClassStatistics | null>(null)

  const getPeriodLabel = useMemo(() => {
    const date = new Date(selectedDate)
    if (viewMode === "monthly") {
      return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    } else if (viewMode === "semester") {
      return date.getMonth() < 6 ? "Semester Ganjil" : "Semester Genap"
    } else {
      return `Tahun ${date.getFullYear()}`
    }
  }, [selectedDate, viewMode])

  const selectedClassName = useMemo(() => {
    if (!selectedClassId) return null
    const cls = classes.find(c => c.id === selectedClassId)
    return cls ? (cls.major ? `${cls.major} ${cls.name}` : cls.name) : null
  }, [selectedClassId, classes])

  const getPeriodDates = useCallback((dateStr: string): string[] => {
    const date = new Date(dateStr)
    const dates: string[] = []

    if (viewMode === "monthly") {
      const year = date.getFullYear()
      const month = date.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day)
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          dates.push(d.toISOString().split("T")[0])
        }
      }
    } else if (viewMode === "semester") {
      const year = date.getFullYear()
      const startMonth = date.getMonth() < 6 ? 0 : 6
      for (let month = startMonth; month < startMonth + 6; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
          const d = new Date(year, month, day)
          if (d.getDay() !== 0 && d.getDay() !== 6) {
            dates.push(d.toISOString().split("T")[0])
          }
        }
      }
    } else {
      const year = date.getFullYear()
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
          const d = new Date(year, month, day)
          if (d.getDay() !== 0 && d.getDay() !== 6) {
            dates.push(d.toISOString().split("T")[0])
          }
        }
      }
    }
    return dates
  }, [viewMode])

  const navigatePeriod = (direction: "prev" | "next") => {
    const date = new Date(selectedDate)
    const multiplier = direction === "next" ? 1 : -1
    if (viewMode === "monthly") date.setMonth(date.getMonth() + multiplier)
    else if (viewMode === "semester") date.setMonth(date.getMonth() + (6 * multiplier))
    else date.setFullYear(date.getFullYear() + multiplier)
    setSelectedDate(date.toISOString().split("T")[0])
  }

  useEffect(() => {
    const fetchClasses = async () => {
      if (!academicYear?.id) { setClasses([]); return }
      try {
        const { data } = await supabase
          .from("student_classes")
          .select("class_id, classes(id, name, majors(name))")
          .eq("academic_year_id", academicYear.id)
          .eq("status", "active")

        const classMap = new Map<string, ClassInfo>()
        ;(data || []).forEach((sc: any) => {
          if (!classMap.has(sc.class_id)) {
            classMap.set(sc.class_id, {
              id: sc.class_id,
              name: sc.classes?.name || "Unknown",
              major: sc.classes?.majors?.name || "",
              studentCount: 0,
            })
          }
          classMap.get(sc.class_id)!.studentCount++
        })

        const list = Array.from(classMap.values()).sort((a, b) =>
          a.major.localeCompare(b.major) || a.name.localeCompare(b.name)
        )
        setClasses(list)
      } catch (err) { console.error(err) }
    }
    fetchClasses()
  }, [academicYear?.id])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!academicYear?.id || !selectedClassId) { setStudents([]); setClassStatistics(null); setLoading(false); return }
      setLoading(true)
      try {
        const dates = getPeriodDates(selectedDate)

        const { data: sc } = await supabase
          .from("student_classes")
          .select("student_id, attendance_number, students(id, full_name, student_number, gender, photo_url)")
          .eq("class_id", selectedClassId)
          .eq("academic_year_id", academicYear.id)
          .eq("status", "active")

        if (!sc || sc.length === 0) { setStudents([]); setClassStatistics(null); setLoading(false); return }

        const ids = sc.map((s: any) => s.student_id)
        const { data: attendances } = await supabase
          .from("attendances")
          .select("student_id, status")
          .in("student_id", ids)
          .in("date", dates)

        const counts = new Map<string, { present: number; sick: number; permission: number; absent: number }>()
        ;(attendances || []).forEach((a: any) => {
          if (!counts.has(a.student_id)) counts.set(a.student_id, { present: 0, sick: 0, permission: 0, absent: 0 })
          const status = a.status as AttendanceStatus
          const current = counts.get(a.student_id)!
          if (status === "present" || status === "sick" || status === "permission" || status === "absent") {
            current[status]++
          }
        })

        // Calculate class statistics
        let totalPresent = 0, totalSick = 0, totalPermission = 0, totalAbsent = 0, totalDays = 0
        const list: StudentAttendance[] = sc.map((s: any) => {
          const c = counts.get(s.student_id) || { present: 0, sick: 0, permission: 0, absent: 0 }
          const studentTotal = c.present + c.sick + c.permission + c.absent
          const percentage = studentTotal > 0 ? Math.round((c.present / studentTotal) * 100) : 0
          totalPresent += c.present
          totalSick += c.sick
          totalPermission += c.permission
          totalAbsent += c.absent
          totalDays += studentTotal
          return {
            studentId: s.student_id,
            studentNumber: s.attendance_number?.toString() || s.students?.student_number || "-",
            name: s.students?.full_name || "Unknown",
            gender: s.students?.gender || "L",
            photo: s.students?.photo_url,
            ...c, totalDays: studentTotal, percentage,
          }
        }).sort((a, b) => a.name.localeCompare(b.name))

        // Set class statistics
        const classPercentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0
        setClassStatistics({
          totalStudents: sc.length,
          totalDays,
          present: totalPresent,
          sick: totalSick,
          permission: totalPermission,
          absent: totalAbsent,
          percentage: classPercentage,
        })

        setStudents(list)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchStudents()
  }, [academicYear?.id, selectedClassId, selectedDate, viewMode, getPeriodDates])

  const fetchStudentDetail = useCallback(async (studentId: string) => {
    setLoadingDetail(true)
    try {
      const dates = getPeriodDates(selectedDate)

      const { data: studentData } = await supabase
        .from("students")
        .select("id, full_name, student_number, gender, photo_url")
        .eq("id", studentId)
        .single()

      const { data: attendances } = await supabase
        .from("attendances")
        .select("date, status, notes")
        .eq("student_id", studentId)
        .in("date", dates)
        .order("date", { ascending: true })

      const present = (attendances || []).filter(a => a.status === "present").length
      const sick = (attendances || []).filter(a => a.status === "sick").length
      const permission = (attendances || []).filter(a => a.status === "permission").length
      const absent = (attendances || []).filter(a => a.status === "absent").length
      const totalDays = present + sick + permission + absent
      const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0

      setSelectedStudent({
        studentId,
        studentNumber: studentData?.student_number || "-",
        name: studentData?.full_name || "Unknown",
        gender: studentData?.gender || "L",
        photo: studentData?.photo_url,
        records: (attendances || []).map(a => ({ date: a.date, status: a.status, notes: a.notes })),
        statistics: { present, sick, permission, absent, totalDays, percentage },
      })
    } catch (err) { console.error(err) }
    finally { setLoadingDetail(false) }
  }, [selectedDate, viewMode, getPeriodDates])

  const goBack = () => {
    if (selectedStudent) setSelectedStudent(null)
    else if (selectedClassId) { setSelectedClassId(null); setStudents([]); setClassStatistics(null) }
  }

  const groupedRecords = useMemo(() => {
    if (!selectedStudent) return {}
    const groups: Record<string, typeof selectedStudent.records> = {}
    selectedStudent.records.forEach(record => {
      const monthKey = new Date(record.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
      if (!groups[monthKey]) groups[monthKey] = []
      groups[monthKey].push(record)
    })
    return groups
  }, [selectedStudent])

  return (
    <MobileShell>
      {/* Header */}
      <div className="mb-4">
        {(selectedClassId || selectedStudent) && (
          <button onClick={goBack} className="flex items-center gap-1.5 text-[var(--primary)] text-[13px] font-semibold mb-2">
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
        )}
        <div className="flex items-center justify-between">
          <div>
            {selectedStudent && <h1 className="text-[18px] font-bold text-[var(--text-primary)]">Detail Presensi</h1>}
            {selectedClassId && !selectedStudent && <h1 className="text-[18px] font-bold text-[var(--text-primary)]">Rekap Presensi</h1>}
            {!selectedClassId && !selectedStudent && <h1 className="text-[18px] font-bold text-[var(--text-primary)]">Rekap Presensi</h1>}
          </div>
          {selectedClassId && !selectedStudent && (
            <div className="text-right">
              <p className="text-[11px] text-[var(--text-muted)]">Total Siswa</p>
              <p className="text-[16px] font-bold text-[var(--text-primary)]">{students.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* Class Selector - First Priority */}
      <button
        onClick={() => setShowClassFilter(true)}
        className={cn(
          "w-full p-4 rounded-2xl border-2 transition-all mb-4 flex items-center justify-between",
          selectedClassId ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-dashed border-[var(--border)] bg-[var(--surface-secondary)]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", selectedClassId ? "bg-[var(--primary)]" : "bg-[var(--surface-hover)]")}>
            <Users className={cn("w-5 h-5", selectedClassId ? "text-white" : "text-[var(--text-muted)]")} />
          </div>
          <div className="text-left">
            <p className={cn("text-[14px] font-semibold", selectedClassId ? "text-[var(--primary)]" : "text-[var(--text-muted)]")}>
              {selectedClassId ? selectedClassName : "Pilih Kelas"}
            </p>
            {selectedClassId && classStatistics && (
              <p className="text-[12px] text-[var(--text-muted)]">{classStatistics.totalStudents} siswa</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
      </button>

      {/* Period Navigator */}
      <Card className="p-3 mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigatePeriod("prev")} className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">{getPeriodLabel}</p>
          </div>
          <button onClick={() => navigatePeriod("next")} className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors">
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </Card>

      {/* View Mode Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--surface-secondary)] rounded-xl mb-4">
        {(["monthly", "semester", "yearly"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5",
              viewMode === mode ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {mode === "monthly" && <Calendar className="w-3.5 h-3.5" />}
            {mode === "semester" && <BookOpen className="w-3.5 h-3.5" />}
            {mode === "yearly" && <BarChart3 className="w-3.5 h-3.5" />}
            {mode === "monthly" ? "Bulanan" : mode === "semester" ? "Semester" : "Tahunan"}
          </button>
        ))}
      </div>

      {loading && <LoadingState />}

      {/* Class Summary Card */}
      {selectedClassId && !selectedStudent && !loading && classStatistics && (
        <Card className="p-4 mb-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">Ringkasan Kelas</p>
                <p className="text-[11px] text-[var(--text-muted)]">{getPeriodLabel}</p>
              </div>
            </div>
            <CircularProgress percentage={classStatistics.percentage} size={52} strokeWidth={4} />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[var(--success-soft)] rounded-xl p-2.5 text-center">
              <p className="text-[18px] font-bold text-[var(--success)]">{classStatistics.present}</p>
              <p className="text-[10px] font-medium text-[var(--success)]">Hadir</p>
            </div>
            <div className="bg-[var(--warning-soft)] rounded-xl p-2.5 text-center">
              <p className="text-[18px] font-bold text-[var(--warning)]">{classStatistics.sick}</p>
              <p className="text-[10px] font-medium text-[var(--warning)]">Sakit</p>
            </div>
            <div className="bg-[var(--info-soft)] rounded-xl p-2.5 text-center">
              <p className="text-[18px] font-bold text-[var(--info)]">{classStatistics.permission}</p>
              <p className="text-[10px] font-medium text-[var(--info)]">Izin</p>
            </div>
            <div className="bg-[var(--danger-soft)] rounded-xl p-2.5 text-center">
              <p className="text-[18px] font-bold text-[var(--danger)]">{classStatistics.absent}</p>
              <p className="text-[10px] font-medium text-[var(--danger)]">Alpa</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[var(--border-light)] flex items-center justify-between">
            <p className="text-[12px] text-[var(--text-muted)]">Total hari aktif</p>
            <p className="text-[13px] font-semibold text-[var(--text-primary)]">{classStatistics.totalDays} hari</p>
          </div>
        </Card>
      )}

      {/* Student List */}
      {selectedClassId && !selectedStudent && !loading && (
        <>
          {students.length === 0 ? (
            <EmptyState message="Belum ada data presensi" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Daftar Siswa</p>
                <p className="text-[12px] text-[var(--text-muted)]">{students.length} siswa</p>
              </div>
              {students.map((student) => (
                <Card
                  key={student.studentId}
                  className="p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer active:scale-[0.99]"
                  onClick={() => fetchStudentDetail(student.studentId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[15px] font-bold text-[var(--primary)]">{student.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">{student.name}</p>
                        <span className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                          student.gender === "L" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[var(--danger-soft)] text-[var(--danger)]"
                        )}>
                          {student.gender}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono">No. {student.studentNumber}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[13px] font-bold",
                        student.percentage >= 90 ? "bg-[var(--success-soft)] text-[var(--success)]" :
                        student.percentage >= 75 ? "bg-[var(--warning-soft)] text-[var(--warning)]" :
                        "bg-[var(--danger-soft)] text-[var(--danger)]"
                      )}>
                        {student.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex gap-1.5 mt-3">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--success-soft)] text-[var(--success)]">H {student.present}</span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--warning-soft)] text-[var(--warning)]">S {student.sick}</span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--info-soft)] text-[var(--info)]">I {student.permission}</span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--danger-soft)] text-[var(--danger)]">A {student.absent}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedClassId && !selectedStudent && !loading && (
        <EmptyState message="Pilih kelas untuk melihat rekap presensi" />
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedStudent(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
            </div>

            <div className="px-5 pb-4 border-b border-[var(--border-light)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{selectedStudent.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedStudent.name}</h2>
                    <p className="text-sm text-[var(--text-muted)]">No. Absen: {selectedStudent.studentNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4 bg-[var(--surface-secondary)] rounded-2xl p-4">
                <CircularProgress percentage={selectedStudent.statistics.percentage} size={64} strokeWidth={5} />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Kehadiran</p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">{selectedStudent.statistics.totalDays} hari</p>
                  <p className="text-xs text-[var(--text-muted)]">{selectedStudent.statistics.present} hadir</p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-4 flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--success-soft)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                  <span className="text-xs font-bold text-[var(--success)]">H {selectedStudent.statistics.present}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--warning-soft)]">
                  <Stethoscope className="w-4 h-4 text-[var(--warning)]" />
                  <span className="text-xs font-bold text-[var(--warning)]">S {selectedStudent.statistics.sick}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--info-soft)]">
                  <FileText className="w-4 h-4 text-[var(--info)]" />
                  <span className="text-xs font-bold text-[var(--info)]">I {selectedStudent.statistics.permission}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--danger-soft)]">
                  <UserX className="w-4 h-4 text-[var(--danger)]" />
                  <span className="text-xs font-bold text-[var(--danger)]">A {selectedStudent.statistics.absent}</span>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] px-5 py-4">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Riwayat Presensi
              </h3>

              {loadingDetail ? (
                <LoadingState />
              ) : (
                Object.entries(groupedRecords).map(([month, records]) => (
                  <div key={month} className="mb-4">
                    <p className="text-xs font-semibold text-[var(--primary)] mb-2">{month}</p>
                    <div className="space-y-1.5">
                      {records.map((record, index) => {
                        const config = STATUS_CONFIG[record.status]
                        const Icon = config.icon
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bgColor)}>
                                <Icon className={cn("w-4 h-4", config.textColor)} />
                              </div>
                              <span className="text-sm text-[var(--text-secondary)]">
                                {new Date(record.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", config.bgColor, config.textColor)}>
                              {config.shortLabel}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Class Filter Modal */}
      {showClassFilter && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClassFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
            </div>
            <div className="px-5 pb-3 border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Pilih Kelas</h2>
                <button onClick={() => setShowClassFilter(false)} className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => { setSelectedClassId(cls.id); setShowClassFilter(false) }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between",
                      selectedClassId === cls.id ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border-light)] bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedClassId === cls.id ? "bg-[var(--primary)]" : "bg-[var(--surface-secondary)]")}>
                        <Users className={cn("w-5 h-5", selectedClassId === cls.id ? "text-white" : "text-[var(--text-muted)]")} />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{cls.major ? `${cls.major} ${cls.name}` : cls.name}</p>
                        <p className="text-[12px] text-[var(--text-muted)]">{cls.studentCount} siswa</p>
                      </div>
                    </div>
                    {selectedClassId === cls.id && (
                      <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-6" />
    </MobileShell>
  )
}
