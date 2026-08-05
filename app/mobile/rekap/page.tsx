"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/layout/mobile-shell"
import { Card } from "@/components/ui"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ThermometerSun,
  FileText,
  TrendingUp,
  Loader2,
  Filter,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useAcademicYear } from "@/hooks"

type ViewMode = "daily" | "weekly" | "monthly"

interface ClassInfo {
  id: string
  name: string
  majors: string | null
  studentCount: number
}

interface DailySummary {
  totalStudents: number
  present: number
  sick: number
  permission: number
  absent: number
  percentage: number
}

interface TrendData {
  date: string
  percentage: number
  dayName: string
}

interface DailyRecap {
  date: string
  summary: DailySummary
  byClass: {
    classId: string
    className: string
    summary: DailySummary
  }[]
}

interface StudentAttendance {
  id: string
  studentId: string
  studentName: string
  studentNumber: string
  status: "present" | "sick" | "permission" | "absent"
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: "success" | "warning" | "info" | "danger" | "primary"
}) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  }

  return (
    <div className={cn("p-3 rounded-2xl flex flex-col", colors[color])}>
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <span className="text-xs font-medium opacity-80 text-center">{label}</span>
    </div>
  )
}

export default function MobileRecapPresensiPage() {
  const router = useRouter()
  const { academicYear } = useAcademicYear()

  // State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [viewMode, setViewMode] = useState<ViewMode>("daily")
  const [loading, setLoading] = useState(true)
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [showClassDetail, setShowClassDetail] = useState(false)
  const [studentAttendances, setStudentAttendances] = useState<StudentAttendance[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [dailyRecap, setDailyRecap] = useState<DailyRecap | null>(null)
  const [weeklyData, setWeeklyData] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])

  // Format helpers
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  const formatDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "short" })
  }

  // Navigate date
  const navigateDate = useCallback((direction: "prev" | "next") => {
    const date = new Date(selectedDate)
    if (viewMode === "daily") {
      date.setDate(date.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "weekly") {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewMode === "monthly") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1))
    }
    setSelectedDate(date.toISOString().split("T")[0])
    setShowClassDetail(false)
  }, [selectedDate, viewMode])

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!academicYear?.id) {
        setClasses([])
        setLoadingClasses(false)
        return
      }

      try {
        const { data: studentClasses, error } = await supabase
          .from("student_classes")
          .select(`
            class_id,
            student_id,
            classes (
              id,
              name,
              majors (name)
            )
          `)
          .eq("academic_year_id", academicYear.id)
          .eq("status", "active")

        if (error) throw error

        // Group by class and count students
        const classMap = new Map<string, ClassInfo>()
        ;(studentClasses || []).forEach((sc: any) => {
          if (!classMap.has(sc.class_id)) {
            classMap.set(sc.class_id, {
              id: sc.class_id,
              name: sc.classes?.name || "Unknown",
              majors: sc.classes?.majors?.name || null,
              studentCount: 0,
            })
          }
          const existing = classMap.get(sc.class_id)!
          existing.studentCount++
        })

        const classList = Array.from(classMap.values()).sort((a, b) =>
          (a.majors || "").localeCompare(b.majors || "") || a.name.localeCompare(b.name)
        )
        setClasses(classList)
      } catch (err) {
        console.error("Error fetching classes:", err)
      } finally {
        setLoadingClasses(false)
      }
    }

    fetchClasses()
  }, [academicYear?.id])

  // Fetch daily recap data
  const fetchDailyRecap = useCallback(async (date: string) => {
    if (!academicYear?.id) return null

    setLoading(true)
    try {
      const { data: studentClasses } = await supabase
        .from("student_classes")
        .select(`
          class_id,
          classes (
            id,
            name,
            majors (name)
          )
        `)
        .eq("academic_year_id", academicYear.id)
        .eq("status", "active")

      if (!studentClasses || studentClasses.length === 0) {
        setLoading(false)
        return null
      }

      // Get unique classes
      const classMap = new Map<string, { name: string; majors: string | null }>()
      studentClasses.forEach((sc: any) => {
        if (!classMap.has(sc.class_id)) {
          classMap.set(sc.class_id, {
            name: sc.classes?.name || "Unknown",
            majors: sc.classes?.majors?.name || null,
          })
        }
      })

      // Get attendance for the date
      const { data: attendances } = await supabase
        .from("attendances")
        .select(`
          status,
          student_classes (
            class_id
          )
        `)
        .eq("date", date)
        .eq("student_classes.academic_year_id", academicYear.id)

      // Process attendance by class
      const byClass: DailyRecap["byClass"] = []
      let totalPresent = 0, totalSick = 0, totalPermission = 0, totalAbsent = 0, totalStudents = 0

      for (const [classId, classInfo] of classMap) {
        const studentsInClass = studentClasses.filter((sc: any) => sc.class_id === classId)
        const classStudentCount = studentsInClass.length
        const classAttendances = (attendances || []).filter((a: any) =>
          a.student_classes?.class_id === classId
        )

        const present = classAttendances.filter((a: any) => a.status === "present").length
        const sick = classAttendances.filter((a: any) => a.status === "sick").length
        const permission = classAttendances.filter((a: any) => a.status === "permission").length
        const absent = classAttendances.filter((a: any) => a.status === "absent").length
        const classPercentage = classStudentCount > 0
          ? (present / classStudentCount) * 100
          : 0

        byClass.push({
          classId,
          className: classInfo.majors
            ? `${classInfo.majors} ${classInfo.name}`
            : classInfo.name,
          summary: {
            totalStudents: classStudentCount,
            present,
            sick,
            permission,
            absent,
            percentage: classPercentage,
          },
        })

        totalStudents += classStudentCount
        totalPresent += present
        totalSick += sick
        totalPermission += permission
        totalAbsent += absent
      }

      const overallPercentage = totalStudents > 0
        ? (totalPresent / totalStudents) * 100
        : 0

      return {
        date,
        summary: {
          totalStudents,
          present: totalPresent,
          sick: totalSick,
          permission: totalPermission,
          absent: totalAbsent,
          percentage: overallPercentage,
        },
        byClass,
      }
    } catch (err) {
      console.error("Error fetching daily recap:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [academicYear?.id])

  // Fetch weekly data
  const fetchWeeklyData = useCallback(async (date: string) => {
    if (!academicYear?.id) return null

    setLoading(true)
    try {
      const targetDate = new Date(date)
      const dayOfWeek = targetDate.getDay()
      const startOfWeek = new Date(targetDate)
      startOfWeek.setDate(targetDate.getDate() - dayOfWeek)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      // Get all students
      const { data: studentClasses } = await supabase
        .from("student_classes")
        .select("student_id")
        .eq("academic_year_id", academicYear.id)
        .eq("status", "active")

      const totalStudents = studentClasses?.length || 0

      // Generate all days of the week
      const days: { date: string; summary: DailySummary }[] = []
      let totalPresent = 0, totalSick = 0, totalPermission = 0, totalAbsent = 0

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + i)
        const dateStr = currentDate.toISOString().split("T")[0]

        // Skip weekend
        const dayNum = currentDate.getDay()
        if (dayNum === 0 || dayNum === 6) continue

        // Get attendance for this day
        const { data: attendances } = await supabase
          .from("attendances")
          .select("status")
          .eq("date", dateStr)
          .eq("student_classes.academic_year_id", academicYear.id)

        const present = (attendances || []).filter((a: any) => a.status === "present").length
        const sick = (attendances || []).filter((a: any) => a.status === "sick").length
        const permission = (attendances || []).filter((a: any) => a.status === "permission").length
        const absent = (attendances || []).filter((a: any) => a.status === "absent").length
        const percentage = totalStudents > 0 ? (present / totalStudents) * 100 : 0

        days.push({
          date: dateStr,
          summary: {
            totalStudents,
            present,
            sick,
            permission,
            absent,
            percentage,
          },
        })

        totalPresent += present
        totalSick += sick
        totalPermission += permission
        totalAbsent += absent
      }

      const totalDays = days.length
      const avgPercentage = totalDays > 0 && totalStudents > 0
        ? (totalPresent / (totalDays * totalStudents)) * 100
        : 0

      return {
        startDate: startOfWeek.toISOString().split("T")[0],
        endDate: endOfWeek.toISOString().split("T")[0],
        weekNumber: Math.ceil(targetDate.getDate() / 7),
        summary: {
          totalStudents,
          present: totalPresent,
          sick: totalSick,
          permission: totalPermission,
          absent: totalAbsent,
          percentage: avgPercentage,
        },
        byDay: days,
      }
    } catch (err) {
      console.error("Error fetching weekly data:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [academicYear?.id])

  // Fetch monthly data
  const fetchMonthlyData = useCallback(async (date: string) => {
    if (!academicYear?.id) return null

    setLoading(true)
    try {
      const targetDate = new Date(date)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth() + 1

      // Get all students
      const { data: studentClasses } = await supabase
        .from("student_classes")
        .select("student_id")
        .eq("academic_year_id", academicYear.id)
        .eq("status", "active")

      const totalStudents = studentClasses?.length || 0
      const daysInMonth = new Date(year, month, 0).getDate()

      // Generate all days of the month
      const days: { date: string; summary: DailySummary }[] = []
      let totalPresent = 0, totalSick = 0, totalPermission = 0, totalAbsent = 0

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day)
        const dateStr = currentDate.toISOString().split("T")[0]

        // Skip weekend
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        // Get attendance for this day
        const { data: attendances } = await supabase
          .from("attendances")
          .select("status")
          .eq("date", dateStr)
          .eq("student_classes.academic_year_id", academicYear.id)

        const present = (attendances || []).filter((a: any) => a.status === "present").length
        const sick = (attendances || []).filter((a: any) => a.status === "sick").length
        const permission = (attendances || []).filter((a: any) => a.status === "permission").length
        const absent = (attendances || []).filter((a: any) => a.status === "absent").length
        const percentage = totalStudents > 0 ? (present / totalStudents) * 100 : 0

        days.push({
          date: dateStr,
          summary: {
            totalStudents,
            present,
            sick,
            permission,
            absent,
            percentage,
          },
        })

        totalPresent += present
        totalSick += sick
        totalPermission += permission
        totalAbsent += absent
      }

      const totalDays = days.length
      const avgPercentage = totalDays > 0 && totalStudents > 0
        ? (totalPresent / (totalDays * totalStudents)) * 100
        : 0

      return {
        year,
        month,
        summary: {
          totalStudents,
          present: totalPresent,
          sick: totalSick,
          permission: totalPermission,
          absent: totalAbsent,
          percentage: avgPercentage,
        },
        byDay: days,
      }
    } catch (err) {
      console.error("Error fetching monthly data:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [academicYear?.id])

  // Fetch student attendance for a specific class
  const fetchStudentAttendances = useCallback(async (classId: string, date: string) => {
    setLoadingStudents(true)
    try {
      // Get students in this class
      const { data: studentClasses } = await supabase
        .from("student_classes")
        .select(`
          student_id,
          attendance_number,
          students (
            id,
            full_name,
            student_number
          )
        `)
        .eq("class_id", classId)
        .eq("academic_year_id", academicYear?.id)
        .eq("status", "active")

      if (!studentClasses || studentClasses.length === 0) {
        setStudentAttendances([])
        return
      }

      // Get attendance for this date
      const studentIds = studentClasses.map((sc: any) => sc.student_id)
      const { data: attendances } = await supabase
        .from("attendances")
        .select(`
          id,
          status,
          student_id
        `)
        .eq("date", date)
        .in("student_id", studentIds)

      // Map students with their attendance
      const attendanceMap = new Map<string, any>()
      ;(attendances || []).forEach((a: any) => {
        attendanceMap.set(a.student_id, a)
      })

      const results: StudentAttendance[] = studentClasses
        .map((sc: any) => {
          const attendance = attendanceMap.get(sc.student_id)
          return {
            id: attendance?.id || `new-${sc.student_id}`,
            studentId: sc.student_id,
            studentName: sc.students?.full_name || "Unknown",
            studentNumber: sc.students?.student_number || "-",
            status: attendance?.status || "present" as const,
          }
        })
        .sort((a: any, b: any) => a.studentName.localeCompare(b.studentName))

      setStudentAttendances(results)
    } catch (err) {
      console.error("Error fetching student attendances:", err)
      setStudentAttendances([])
    } finally {
      setLoadingStudents(false)
    }
  }, [academicYear?.id])

  // Load data based on view mode
  useEffect(() => {
    const loadData = async () => {
      if (viewMode === "daily") {
        const data = await fetchDailyRecap(selectedDate)
        if (data) setDailyRecap(data)
        setWeeklyData(null)
        setMonthlyData(null)
      } else if (viewMode === "weekly") {
        setDailyRecap(null)
        const data = await fetchWeeklyData(selectedDate)
        if (data) setWeeklyData(data)
        setMonthlyData(null)
      } else if (viewMode === "monthly") {
        setDailyRecap(null)
        setWeeklyData(null)
        const data = await fetchMonthlyData(selectedDate)
        if (data) setMonthlyData(data)
      }

      // Load trend data
      const trends: TrendData[] = []
      const targetDate = new Date(selectedDate)
      for (let i = 6; i >= 0; i--) {
        const currentDate = new Date(targetDate)
        currentDate.setDate(targetDate.getDate() - i)
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        // Get attendance for this day
        if (!academicYear?.id) continue
        const { data: attendances } = await supabase
          .from("attendances")
          .select("status")
          .eq("date", currentDate.toISOString().split("T")[0])
          .eq("student_classes.academic_year_id", academicYear.id)

        const { data: studentClasses } = await supabase
          .from("student_classes")
          .select("student_id")
          .eq("academic_year_id", academicYear.id)
          .eq("status", "active")

        const totalStudents = studentClasses?.length || 0
        const present = (attendances || []).filter((a: any) => a.status === "present").length
        const percentage = totalStudents > 0 ? (present / totalStudents) * 100 : 0

        trends.push({
          date: currentDate.toISOString().split("T")[0],
          percentage,
          dayName: formatDayName(currentDate.toISOString().split("T")[0]),
        })
      }
      setTrendData(trends)
    }

    loadData()
  }, [selectedDate, viewMode, fetchDailyRecap, academicYear?.id])

  // Handle class selection
  const handleClassClick = (classId: string) => {
    setSelectedClassId(classId)
    setShowClassDetail(true)
    fetchStudentAttendances(classId, selectedDate)
  }

  const closeClassDetail = () => {
    setShowClassDetail(false)
    setSelectedClassId("")
    setStudentAttendances([])
  }

  // Get current summary based on view mode
  const currentSummary = useMemo(() => {
    if (viewMode === "daily" && dailyRecap) return dailyRecap.summary
    if (viewMode === "weekly" && weeklyData) return weeklyData.summary
    if (viewMode === "monthly" && monthlyData) return monthlyData.summary
    return null
  }, [viewMode, dailyRecap, weeklyData, monthlyData])

  // Get period label for date navigator
  const getPeriodLabel = () => {
    if (viewMode === "daily") return formatDate(selectedDate)
    if (viewMode === "weekly" && weeklyData) {
      return `${formatShortDate(weeklyData.startDate)} - ${formatShortDate(weeklyData.endDate)}`
    }
    if (viewMode === "monthly" && monthlyData) {
      return new Date(monthlyData.year, monthlyData.month - 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    }
    return formatDate(selectedDate)
  }

  // Get percentage color
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-[var(--success)]"
    if (percentage >= 75) return "text-[var(--warning)]"
    return "text-[var(--danger)]"
  }

  const getPercentageBg = (percentage: number) => {
    if (percentage >= 90) return "bg-[var(--success-soft)] text-[var(--success)]"
    if (percentage >= 75) return "bg-[var(--warning-soft)] text-[var(--warning)]"
    return "bg-[var(--danger-soft)] text-[var(--danger)]"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-[var(--success)] text-white"
      case "sick": return "bg-[var(--warning)] text-white"
      case "permission": return "bg-[var(--info)] text-white"
      case "absent": return "bg-[var(--danger)] text-white"
      default: return "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present": return "H"
      case "sick": return "S"
      case "permission": return "I"
      case "absent": return "A"
      default: return "?"
    }
  }

  // Get selected class name
  const selectedClassName = useMemo(() => {
    const cls = classes.find(c => c.id === selectedClassId)
    if (!cls) return ""
    return cls.majors ? `${cls.majors} ${cls.name}` : cls.name
  }, [classes, selectedClassId])

  return (
    <MobileShell>
      {/* Date Navigator Card */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigateDate("prev")}
            className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>

          <button
            onClick={() => {
              const input = document.createElement("input")
              input.type = "date"
              input.value = selectedDate
              input.onchange = (e) => {
                setSelectedDate((e.target as HTMLInputElement).value)
                setShowClassDetail(false)
              }
              input.click()
            }}
            className="flex-1 flex flex-col items-center py-2.5 bg-[var(--primary-soft)] rounded-xl hover:bg-[var(--primary)]/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {getPeriodLabel()}
              </span>
            </div>
          </button>

          <button
            onClick={() => navigateDate("next")}
            className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-full mb-4">
        {(["daily", "weekly", "monthly"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode)
              setShowClassDetail(false)
            }}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all",
              viewMode === mode
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {mode === "daily" ? "Harian" : mode === "weekly" ? "Mingguan" : "Bulanan"}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {(loading || loadingClasses) && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <span className="ml-2 text-[14px] text-[var(--text-muted)]">Memuat data...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && !loadingClasses && currentSummary && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <StatCard
              label="Total Siswa"
              value={currentSummary.totalStudents}
              icon={Users}
              color="primary"
            />
            <StatCard
              label="Hadir"
              value={currentSummary.present}
              icon={CheckCircle2}
              color="success"
            />
            <StatCard
              label="Sakit"
              value={currentSummary.sick}
              icon={ThermometerSun}
              color="warning"
            />
            <StatCard
              label="Izin"
              value={currentSummary.permission}
              icon={FileText}
              color="info"
            />
          </div>

          {/* Alpa Card */}
          <Card className="p-4 mb-4 bg-gradient-to-r from-[var(--danger-soft)] to-[var(--danger)]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--danger)] font-medium">Alpa</p>
                  <p className="text-xl font-bold text-[var(--danger)]">{currentSummary.absent}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Percentage Card */}
          <Card className="p-4 mb-4 bg-gradient-to-r from-[var(--success-soft)] to-[var(--success)]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--success)] font-medium">Tingkat Kehadiran</p>
                  <p className={cn("text-2xl font-bold", getPercentageColor(currentSummary.percentage))}>
                    {currentSummary.percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-[12px] font-semibold", getPercentageBg(currentSummary.percentage))}>
                {currentSummary.percentage >= 90 ? "Baik" : currentSummary.percentage >= 75 ? "Cukup" : "Perlu Perbaikan"}
              </span>
            </div>
          </Card>

          {/* Daily View - Class Breakdown */}
          {viewMode === "daily" && dailyRecap && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-xs font-medium text-[var(--text-secondary)]">
                  Rekap per Kelas
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {dailyRecap.byClass.length} kelas
                </span>
              </div>
              <div className="space-y-2">
                {dailyRecap.byClass.map((cls) => (
                  <Card
                    key={cls.classId}
                    className="p-3 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                    onClick={() => handleClassClick(cls.classId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                          <Users className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {cls.className}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {cls.summary.totalStudents} siswa
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[var(--success)]">
                          {cls.summary.present}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">/</span>
                        <span className={cn("text-[12px] font-semibold px-2 py-0.5 rounded-full", getPercentageBg(cls.summary.percentage))}>
                          {cls.summary.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="mt-2 h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          cls.summary.percentage >= 90
                            ? "bg-[var(--success)]"
                            : cls.summary.percentage >= 75
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--danger)]"
                        )}
                        style={{ width: `${cls.summary.percentage}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Weekly View - Daily Breakdown */}
          {viewMode === "weekly" && weeklyData && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-xs font-medium text-[var(--text-secondary)]">
                  Rekap Harian
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Minggu {weeklyData.weekNumber}
                </span>
              </div>
              <div className="space-y-2">
                {weeklyData.byDay.map((day: any) => (
                  <Card key={day.date} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {formatShortDate(day.date)}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {new Date(day.date).toLocaleDateString("id-ID", { weekday: "long" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[var(--success)]">
                          {day.summary.present}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">/</span>
                        <span className={cn("text-[12px] font-semibold px-2 py-0.5 rounded-full", getPercentageBg(day.summary.percentage))}>
                          {day.summary.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Monthly View - Daily Breakdown */}
          {viewMode === "monthly" && monthlyData && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-xs font-medium text-[var(--text-secondary)]">
                  Rekap Harian
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {monthlyData.byDay.length} hari efektif
                </span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {monthlyData.byDay.map((day: any) => (
                  <Card key={day.date} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {formatShortDate(day.date)}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {new Date(day.date).toLocaleDateString("id-ID", { weekday: "short" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[var(--success)]">
                          {day.summary.present}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">/</span>
                        <span className={cn("text-[12px] font-semibold px-2 py-0.5 rounded-full", getPercentageBg(day.summary.percentage))}>
                          {day.summary.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Trend Chart */}
          {trendData.length > 0 && (
            <Card className="p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Tren 7 Hari Terakhir
                </h3>
              </div>

              <div className="h-24 flex items-end justify-between gap-1">
                {trendData.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all",
                        day.percentage >= 90
                          ? "bg-[var(--success)]"
                          : day.percentage >= 75
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--danger)]",
                        index === trendData.length - 1 ? "" : "opacity-60"
                      )}
                      style={{ height: `${Math.max(day.percentage, 5)}%` }}
                    />
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">
                      {day.dayName}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !loadingClasses && !currentSummary && (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[14px] text-[var(--text-secondary)]">
            Tidak ada data presensi untuk periode ini
          </p>
        </Card>
      )}

      {/* Class Detail Modal */}
      {showClassDetail && (
        <div className="fixed inset-0 z-50 animate-slide-up">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeClassDetail}
          />

          {/* Modal Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-white to-slate-50 rounded-t-[28px] max-h-[90vh] flex flex-col shadow-[0_-4px_30px_rgba(0,0,0,0.15)]">
            {/* Header */}
            <div className="flex-none pt-[env(safe-area-inset-top,12px)] px-5 pb-3 border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
                    {selectedClassName}
                  </h2>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {formatDate(selectedDate)}
                  </p>
                </div>
                <button
                  onClick={closeClassDetail}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-muted)] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto px-5 pb-[calc(120px+env(safe-area-inset-bottom,24px))]">
              {loadingStudents ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                </div>
              ) : studentAttendances.length === 0 ? (
                <div className="py-10 text-center">
                  <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[14px] text-[var(--text-secondary)]">
                    Belum ada data presensi
                  </p>
                </div>
              ) : (
                <div className="py-3 space-y-2">
                  {studentAttendances.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--border-light)]/60"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-muted)] font-medium text-sm">
                        {student.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                          {student.studentName}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">
                          {student.studentNumber}
                        </p>
                      </div>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", getStatusColor(student.status))}>
                        {getStatusLabel(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Footer */}
            {!loadingStudents && studentAttendances.length > 0 && (
              <div className="flex-none px-5 py-4 border-t border-[var(--border-light)] bg-white">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--text-muted)]">
                    Total: {studentAttendances.length} siswa
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-[var(--success)]"></span>
                      H: {studentAttendances.filter(s => s.status === "present").length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-[var(--warning)]"></span>
                      S: {studentAttendances.filter(s => s.status === "sick").length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-[var(--info)]"></span>
                      I: {studentAttendances.filter(s => s.status === "permission").length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-[var(--danger)]"></span>
                      A: {studentAttendances.filter(s => s.status === "absent").length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation Style */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  )
}
