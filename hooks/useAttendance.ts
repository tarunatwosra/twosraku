"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceStatus,
  DailyRecap,
} from "@/types/attendance"
import {
  fetchAttendanceClasses,
  buildAttendanceRecords,
  saveAttendance,
  getAttendanceStats,
  getActiveAcademicYear,
  getActiveSemester,
} from "@/lib/attendance"
import type { Class } from "@/types/database"

// Type untuk kelas dengan major
interface ClassWithMajor extends Class {
  major?: string
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
  academicYearId: string | null
  semesterId: string | null
}

export function useAttendance() {
  const [classes, setClasses] = useState<ClassWithMajor[]>([])
  const [state, setState] = useState<AttendanceState>({
    classId: "",
    date: new Date().toISOString().split("T")[0],
    records: [],
    isSubmitted: false,
    academicYearId: null,
    semesterId: null,
  })
  const [loading, setLoading] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load active academic year on mount
  useEffect(() => {
    const loadAcademicYear = async () => {
      const { data: year } = await getActiveAcademicYear()
      if (year) {
        setState((prev) => ({ ...prev, academicYearId: year.id }))
      }

      // Also get active semester
      const { data: semester } = await getActiveSemester()
      if (semester) {
        setState((prev) => ({ ...prev, semesterId: semester.id }))
      }
    }
    loadAcademicYear()
  }, [])

  // Load classes on mount and when academic year changes
  useEffect(() => {
    const loadClasses = async () => {
      setLoadingClasses(true)
      try {
        const { data, error: classesError } = await fetchAttendanceClasses(
          state.academicYearId || undefined
        )

        if (classesError) {
          console.error("Error loading classes:", classesError)
          setError(classesError)
        } else {
          // Transform to include major name
          const transformedClasses = (data || []).map((cls) => ({
            ...cls,
            major: cls.majors?.name || "",
          })) as ClassWithMajor[]

          setClasses(transformedClasses)

          // Set default class if not set
          if (transformedClasses.length > 0 && !state.classId) {
            setState((prev) => ({ ...prev, classId: transformedClasses[0].id }))
          }
        }
      } catch {
        console.error("Error loading classes")
        setError("Gagal memuat daftar kelas")
      } finally {
        setLoadingClasses(false)
      }
    }
    loadClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.academicYearId]) // state.classId intentionally omitted - set only once on mount

  // Load attendance records when class or date changes
  const loadRecords = useCallback(async (classId: string, date: string, academicYearId: string | null) => {
    if (!classId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: recordsError } = await buildAttendanceRecords(
        classId,
        date,
        academicYearId || undefined
      )

      if (recordsError) {
        console.error("Error loading records:", recordsError)
        setError(recordsError)
        setState((prev) => ({ ...prev, records: [] }))
      } else {
        // Check if records have been submitted (have real IDs from database)
        const isSubmitted = data.some((r) => r.id && !r.id.includes("-"))
        setState((prev) => ({
          ...prev,
          records: data,
          isSubmitted,
        }))
      }
    } catch {
      console.error("Error loading records")
      setError("Gagal memuat data presensi")
      setState((prev) => ({ ...prev, records: [] }))
    } finally {
      setLoading(false)
    }
  }, [])

  // Load records when class or date changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords(state.classId, state.date, state.academicYearId)
  }, [state.classId, state.date, state.academicYearId, loadRecords])

  // Set class
  const setClass = useCallback((classId: string) => {
    setState((prev) => ({
      ...prev,
      classId,
      isSubmitted: false,
    }))
  }, [])

  // Set date
  const setDate = useCallback((date: string) => {
    setState((prev) => ({
      ...prev,
      date,
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
    if (!state.classId || !state.academicYearId || !state.semesterId) {
      return { success: false, error: "Data tahun ajaran atau semester belum tersedia" }
    }

    setLoading(true)
    setError(null)

    try {
      const recordsToSave = state.records.map((record) => ({
        studentId: record.student.id,
        classId: state.classId,
        academicYearId: state.academicYearId!,
        semesterId: state.semesterId!,
        date: state.date,
        status: record.status === "present" ? "present" as const : record.status,
        notes: record.notes,
      }))

      const { success, error: saveError } = await saveAttendance(recordsToSave)

      if (!success) {
        setError(saveError || "Gagal menyimpan presensi")
        return { success: false, error: saveError }
      }

      setState((prev) => ({
        ...prev,
        isSubmitted: true,
      }))

      return { success: true }
    } catch {
      console.error("Error submitting attendance")
      const errorMsg = "Gagal menyimpan presensi"
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [state])

  // Calculate summary
  const summary = useMemo((): AttendanceSummary => {
    return calculateSummary(state.records)
  }, [state.records])

  // Get class name
  const className = useMemo(() => {
    const classInfo = classes.find((c) => c.id === state.classId)
    return classInfo?.name || "Kelas"
  }, [classes, state.classId])

  // Get major name
  const majorName = useMemo(() => {
    const classInfo = classes.find((c) => c.id === state.classId)
    return classInfo?.major || ""
  }, [classes, state.classId])

  // Load attendance for a specific date/class
  const loadAttendance = useCallback(
    async (classId: string, date: string) => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: recordsError } = await buildAttendanceRecords(
          classId,
          date,
          state.academicYearId || undefined
        )

        if (recordsError) {
          setError(recordsError)
          return { success: false, error: recordsError }
        }

        const isSubmitted = data.some((r) => r.id && !r.id.includes("-"))

        setState((prev) => ({
          ...prev,
          classId,
          date,
          records: data,
          isSubmitted,
        }))

        return { success: true }
      } catch {
        const errorMsg = "Gagal memuat presensi"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [state.academicYearId]
  )

  return {
    // State
    classId: state.classId,
    date: state.date,
    records: state.records,
    isSubmitted: state.isSubmitted,
    className,
    majorName,
    classes: classes.map((c) => ({
      id: c.id,
      name: c.name,
      grade: c.name.split(" ")[0] || "",
      major: c.major || "",
    })),
    summary,
    loading,
    loadingClasses,
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
    refetch: loadRecords,
  }
}

// Hook for attendance recap
export function useAttendanceRecap() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get daily recap for a specific date
  const getDailyRecap = useCallback(async (date: string): Promise<DailyRecap | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data: classes, error: classesError } = await fetchAttendanceClasses()

      if (classesError) {
        setError(classesError)
        return null
      }

      const byClassPromises = classes.map(async (cls) => {
        const { data: stats, error: statsError } = await getAttendanceStats(cls.id, date)

        if (statsError) {
          return null
        }

        return {
          classId: cls.id,
          className: cls.name,
          summary: stats,
        }
      })

      const byClassResults = await Promise.all(byClassPromises)
      const byClass = byClassResults.filter((r): r is NonNullable<typeof r> => r !== null)

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
      console.error("Error getting daily recap:", err)
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
      const start = new Date(startDate)
      const days: DailyRecap[] = []

      // Generate 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split("T")[0]

        const dayRecap = await getDailyRecap(dateStr)
        if (dayRecap) {
          days.push(dayRecap)
        }
      }

      if (days.length === 0) {
        return null
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
      console.error("Error getting weekly recap:", err)
      setError("Gagal memuat rekap mingguan")
      return null
    } finally {
      setLoading(false)
    }
  }, [getDailyRecap])

  // Get monthly recap
  const getMonthlyRecap = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)

    try {
      const daysInMonth = new Date(year, month, 0).getDate()
      const days: DailyRecap[] = []

      // Generate all days in month
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d)
        const dayOfWeek = date.getDay()

        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const dateStr = date.toISOString().split("T")[0]
        const dayRecap = await getDailyRecap(dateStr)
        if (dayRecap) {
          days.push(dayRecap)
        }
      }

      if (days.length === 0) {
        return null
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
      console.error("Error getting monthly recap:", err)
      setError("Gagal memuat rekap bulanan")
      return null
    } finally {
      setLoading(false)
    }
  }, [getDailyRecap])

  // Get trend data (last 7 days)
  const getTrendData = useCallback(async (baseDate: string) => {
    const trend = []
    const base = new Date(baseDate)

    for (let i = 6; i >= 0; i--) {
      const date = new Date(base)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()

      // Skip weekends (or show 100% for display)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        trend.push({
          date: dateStr,
          percentage: 100,
          dayName: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dayOfWeek],
        })
        continue
      }

      const recap = await getDailyRecap(dateStr)
      if (recap) {
        trend.push({
          date: dateStr,
          percentage: recap.summary.percentage,
          dayName: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dayOfWeek],
        })
      }
    }

    return trend
  }, [getDailyRecap])

  return {
    loading,
    error,
    getDailyRecap,
    getWeeklyRecap,
    getMonthlyRecap,
    getTrendData,
  }
}
