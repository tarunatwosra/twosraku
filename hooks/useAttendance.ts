"use client"

import { useState, useCallback, useMemo } from "react"
import {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceStatus,
  DailyRecap,
} from "@/types/attendance"

// Generate realistic student names
const STUDENT_NAMES = [
  "Ahmad Fauzi Rahman", "Siti Aminah Zahra", "Budi Santoso", "Dewi Lestari",
  "Rizki Ramadhan", "Putri Ayu Wulandari", "Dimas Prasetyo", "Nabila Safitri",
  "Fajar Nugroho", "Maya Sari Dewi", "Bagus Setiawan", "Anisa Rahmawati",
  "Galang Hendra", "Kartika Sari", "Indra Gunawan", "Rina Wati",
  "Hendra Wijaya", "Sari Novita", "Rizky Aditya", "Dian Pertiwi",
  "Agus Salim", "Fitri Handayani", "Wahyu Seto", "Lina Marlina",
  "Yusuf Ibrahim", "Ranti Kusuma", "Denny Firmansyah", "Evi Susilowati",
  "Galih Pramudya", "Nita Kusumawardani", "Riko Hermawan", "Dhea Ayu Lestari",
]

// Class list
const DEMO_CLASSES = [
  { id: "class-x-tkj-1", name: "X TKJ 1", grade: "X", major: "Teknik Komputer dan Jaringan" },
  { id: "class-x-tkj-2", name: "X TKJ 2", grade: "X", major: "Teknik Komputer dan Jaringan" },
  { id: "class-xi-tkj-1", name: "XI TKJ 1", grade: "XI", major: "Teknik Komputer dan Jaringan" },
  { id: "class-xii-tkj-1", name: "XII TKJ 1", grade: "XII", major: "Teknik Komputer dan Jaringan" },
  { id: "class-x-mm-1", name: "X MM 1", grade: "X", major: "Multimedia" },
  { id: "class-xi-mm-1", name: "XI MM 1", grade: "XI", major: "Multimedia" },
]

// Generate students for a class
const generateStudents = (classId: string): AttendanceRecord[] => {
  const classInfo = DEMO_CLASSES.find((c) => c.id === classId)
  const studentCount = 28 + Math.floor(Math.random() * 8) // 28-35 students
  const students: AttendanceRecord[] = []

  for (let i = 0; i < studentCount; i++) {
    students.push({
      id: `${classId}-${i}`,
      student: {
        id: `${classId}-${i}`,
        name: STUDENT_NAMES[i % STUDENT_NAMES.length],
        studentNumber: `2025${classId.replace("class-", "").replace("-", "")}${String(i + 1).padStart(2, "0")}`,
        class: classInfo?.name || "Kelas",
        major: classInfo?.major || "TKJ",
        gender: (i % 2 === 0 ? "L" : "P") as "L" | "P",
      },
      status: "present" as AttendanceStatus,
      notes: "",
    })
  }
  return students
}

// Generate realistic attendance for a date
const generateDailyAttendance = (classId: string, date: string): AttendanceRecord[] => {
  const students = generateStudents(classId)
  const dayOfWeek = new Date(date).getDay()

  // Weekend = no school
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return students.map(s => ({ ...s, status: "present" as AttendanceStatus }))
  }

  // Random distribution based on day
  students.forEach(student => {
    const rand = Math.random() * 100

    // Monday = higher absent rate
    if (dayOfWeek === 1) {
      if (rand < 3) student.status = "absent"
      else if (rand < 6) student.status = "permission"
      else if (rand < 8) student.status = "sick"
      else student.status = "present"
    }
    // Friday = higher permission rate
    else if (dayOfWeek === 5) {
      if (rand < 1) student.status = "absent"
      else if (rand < 5) student.status = "permission"
      else if (rand < 7) student.status = "sick"
      else student.status = "present"
    }
    // Normal days
    else {
      if (rand < 1.5) student.status = "absent"
      else if (rand < 3.5) student.status = "permission"
      else if (rand < 5.5) student.status = "sick"
      else student.status = "present"
    }
  })

  return students
}

// Calculate summary from records
const calculateSummary = (records: AttendanceRecord[]): AttendanceSummary => {
  const total = records.length
  const present = records.filter((r) => r.status === "present").length
  const sick = records.filter((r) => r.status === "sick").length
  const permission = records.filter((r) => r.status === "permission").length
  const absent = records.filter((r) => r.status === "absent").length
  const percentage = total > 0 ? (present / total) * 100 : 0

  return { totalStudents: total, present, sick, permission, absent, percentage }
}

// Current session state
interface AttendanceState {
  classId: string
  date: string
  records: AttendanceRecord[]
  isSubmitted: boolean
}

const initialState: AttendanceState = {
  classId: "class-x-tkj-1",
  date: new Date().toISOString().split("T")[0],
  records: generateDailyAttendance("class-x-tkj-1", new Date().toISOString().split("T")[0]),
  isSubmitted: false,
}

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set class
  const setClass = useCallback((classId: string) => {
    const classInfo = DEMO_CLASSES.find((c) => c.id === classId)
    if (classInfo) {
      setState((prev) => ({
        ...prev,
        classId,
        records: generateDailyAttendance(classId, prev.date),
        isSubmitted: false,
      }))
    }
  }, [])

  // Set date
  const setDate = useCallback((date: string) => {
    setState((prev) => ({
      ...prev,
      date,
      records: generateDailyAttendance(prev.classId, date),
      isSubmitted: false,
    }))
  }, [])

  // Update single record status
  const updateRecordStatus = useCallback(
    (studentId: string, status: AttendanceStatus, notes?: string) => {
      setState((prev) => ({
        ...prev,
        records: prev.records.map((record) =>
          record.student.id === studentId
            ? { ...record, status, notes: notes || record.notes }
            : record
        ),
      }))
    },
    []
  )

  // Bulk update statuses
  const bulkUpdateStatus = useCallback(
    (studentIds: string[], status: AttendanceStatus) => {
      setState((prev) => ({
        ...prev,
        records: prev.records.map((record) =>
          studentIds.includes(record.student.id)
            ? { ...record, status }
            : record
        ),
      }))
    },
    []
  )

  // Mark all as present
  const markAllPresent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      records: prev.records.map((record) => ({
        ...record,
        status: "present" as AttendanceStatus,
      })),
    }))
  }, [])

  // Reset attendance
  const resetAttendance = useCallback(() => {
    setState((prev) => ({
      ...prev,
      records: prev.records.map((record) => ({
        ...record,
        status: "present" as AttendanceStatus,
        notes: "",
      })),
    }))
  }, [])

  // Submit attendance
  const submitAttendance = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setState((prev) => ({
        ...prev,
        isSubmitted: true,
      }))

      return { success: true }
    } catch (err) {
      setError("Gagal menyimpan presensi")
      return { success: false, error: "Gagal menyimpan presensi" }
    } finally {
      setLoading(false)
    }
  }, [])

  // Calculate summary
  const summary = useMemo((): AttendanceSummary => {
    return calculateSummary(state.records)
  }, [state.records])

  // Get class name
  const className = useMemo(() => {
    const classInfo = DEMO_CLASSES.find((c) => c.id === state.classId)
    return classInfo?.name || "Kelas"
  }, [state.classId])

  // Load attendance for a specific date/class
  const loadAttendance = useCallback(
    async (classId: string, date: string) => {
      setLoading(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const classInfo = DEMO_CLASSES.find((c) => c.id === classId)
        if (classInfo) {
          setState({
            classId,
            date,
            records: generateDailyAttendance(classId, date),
            isSubmitted: false,
          })
        }

        return { success: true }
      } catch (err) {
        setError("Gagal memuat presensi")
        return { success: false, error: "Gagal memuat presensi" }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    // State
    ...state,
    className,
    classes: DEMO_CLASSES,
    summary,
    loading,
    error,

    // Actions
    setClass,
    setDate,
    updateRecordStatus,
    bulkUpdateStatus,
    markAllPresent,
    resetAttendance,
    submitAttendance,
    loadAttendance,
  }
}

// Hook for attendance recap - Realistic data
export function useAttendanceRecap() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get daily recap for a specific date
  const getDailyRecap = useCallback(async (date: string): Promise<DailyRecap | null> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Generate recap for all classes
      const byClass = DEMO_CLASSES.map((cls) => {
        const records = generateDailyAttendance(cls.id, date)
        const summary = calculateSummary(records)

        return {
          classId: cls.id,
          className: cls.name,
          summary,
        }
      })

      // Calculate totals
      const totalStudents = byClass.reduce((sum, r) => sum + r.summary.totalStudents, 0)
      const totalPresent = byClass.reduce((sum, r) => sum + r.summary.present, 0)
      const totalSick = byClass.reduce((sum, r) => sum + r.summary.sick, 0)
      const totalPermission = byClass.reduce((sum, r) => sum + r.summary.permission, 0)
      const totalAbsent = byClass.reduce((sum, r) => sum + r.summary.absent, 0)

      return {
        date,
        summary: {
          totalStudents,
          present: totalPresent,
          sick: totalSick,
          permission: totalPermission,
          absent: totalAbsent,
          percentage: totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0,
        },
        byClass,
      }
    } catch (err) {
      setError("Gagal memuat rekap")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get weekly recap
  const getWeeklyRecap = useCallback(async (startDate: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const start = new Date(startDate)
      const days: DailyRecap[] = []

      // Generate 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split("T")[0]

        const byClass = DEMO_CLASSES.map((cls) => {
          const records = generateDailyAttendance(cls.id, dateStr)
          const summary = calculateSummary(records)

          return {
            classId: cls.id,
            className: cls.name,
            summary,
          }
        })

        const totalStudents = byClass.reduce((sum, r) => sum + r.summary.totalStudents, 0)
        const totalPresent = byClass.reduce((sum, r) => sum + r.summary.present, 0)
        const totalSick = byClass.reduce((sum, r) => sum + r.summary.sick, 0)
        const totalPermission = byClass.reduce((sum, r) => sum + r.summary.permission, 0)
        const totalAbsent = byClass.reduce((sum, r) => sum + r.summary.absent, 0)

        days.push({
          date: dateStr,
          summary: {
            totalStudents,
            present: totalPresent,
            sick: totalSick,
            permission: totalPermission,
            absent: totalAbsent,
            percentage: totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0,
          },
          byClass,
        })
      }

      // Weekly totals
      const weeklyTotal = days.reduce((sum, d) => sum + d.summary.totalStudents, 0)
      const weeklyPresent = days.reduce((sum, d) => sum + d.summary.present, 0)
      const weeklySick = days.reduce((sum, d) => sum + d.summary.sick, 0)
      const weeklyPermission = days.reduce((sum, d) => sum + d.summary.permission, 0)
      const weeklyAbsent = days.reduce((sum, d) => sum + d.summary.absent, 0)

      return {
        weekNumber: Math.ceil(start.getDate() / 7),
        startDate,
        endDate: days[days.length - 1].date,
        summary: {
          totalStudents: weeklyTotal,
          present: weeklyPresent,
          sick: weeklySick,
          permission: weeklyPermission,
          absent: weeklyAbsent,
          percentage: weeklyTotal > 0 ? (weeklyPresent / weeklyTotal) * 100 : 0,
        },
        byDay: days,
      }
    } catch (err) {
      setError("Gagal memuat rekap mingguan")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get monthly recap
  const getMonthlyRecap = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const daysInMonth = new Date(year, month, 0).getDate()
      const days: DailyRecap[] = []

      // Generate all days in month
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        const dayOfWeek = date.getDay()

        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const dateStr = date.toISOString().split("T")[0]

        const byClass = DEMO_CLASSES.map((cls) => {
          const records = generateDailyAttendance(cls.id, dateStr)
          const summary = calculateSummary(records)

          return {
            classId: cls.id,
            className: cls.name,
            summary,
          }
        })

        const totalStudents = byClass.reduce((sum, r) => sum + r.summary.totalStudents, 0)
        const totalPresent = byClass.reduce((sum, r) => sum + r.summary.present, 0)
        const totalSick = byClass.reduce((sum, r) => sum + r.summary.sick, 0)
        const totalPermission = byClass.reduce((sum, r) => sum + r.summary.permission, 0)
        const totalAbsent = byClass.reduce((sum, r) => sum + r.summary.absent, 0)

        days.push({
          date: dateStr,
          summary: {
            totalStudents,
            present: totalPresent,
            sick: totalSick,
            permission: totalPermission,
            absent: totalAbsent,
            percentage: totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0,
          },
          byClass,
        })
      }

      // Monthly totals
      const monthlyTotal = days.reduce((sum, d) => sum + d.summary.totalStudents, 0)
      const monthlyPresent = days.reduce((sum, d) => sum + d.summary.present, 0)
      const monthlySick = days.reduce((sum, d) => sum + d.summary.sick, 0)
      const monthlyPermission = days.reduce((sum, d) => sum + d.summary.permission, 0)
      const monthlyAbsent = days.reduce((sum, d) => sum + d.summary.absent, 0)

      return {
        month,
        year,
        summary: {
          totalStudents: monthlyTotal,
          present: monthlyPresent,
          sick: monthlySick,
          permission: monthlyPermission,
          absent: monthlyAbsent,
          percentage: monthlyTotal > 0 ? (monthlyPresent / monthlyTotal) * 100 : 0,
        },
        byDay: days,
      }
    } catch (err) {
      setError("Gagal memuat rekap bulanan")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get trend data (last 7 days)
  const getTrendData = useCallback(async (baseDate: string) => {
    const trend = []
    const base = new Date(baseDate)

    for (let i = 6; i >= 0; i--) {
      const date = new Date(base)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        trend.push({ date: dateStr, percentage: 100, dayName: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dayOfWeek] })
        continue
      }

      const records: AttendanceRecord[] = []
      DEMO_CLASSES.forEach(cls => {
        records.push(...generateDailyAttendance(cls.id, dateStr))
      })

      const summary = calculateSummary(records)
      trend.push({
        date: dateStr,
        percentage: summary.percentage,
        dayName: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dayOfWeek]
      })
    }

    return trend
  }, [])

  return {
    loading,
    error,
    getDailyRecap,
    getWeeklyRecap,
    getMonthlyRecap,
    getTrendData,
  }
}
