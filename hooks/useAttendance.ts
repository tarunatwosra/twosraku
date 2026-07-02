"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Attendance,
  AttendanceRecord,
  AttendanceSession,
  AttendanceSummary,
  AttendanceFilter,
  AttendanceStatus,
  ATTENDANCE_STATUS_CONFIG,
} from "@/types/attendance"

// Demo data generator
const generateDemoStudents = (classId: string, className: string): AttendanceRecord[] => {
  const students: AttendanceRecord[] = []
  for (let i = 1; i <= 32; i++) {
    students.push({
      id: `${classId}-${i}`,
      student: {
        id: `${classId}-${i}`,
        name: `Siswa ${className} ${i}`,
        studentNumber: `2025${classId.replace("class-", "")}${String(i).padStart(2, "0")}`,
        class: className,
        major: "TKJ",
        gender: (i % 2 === 0 ? "L" : "P") as "L" | "P",
      },
      status: "present" as AttendanceStatus,
      notes: "",
    })
  }
  return students
}

// Class list demo
const DEMO_CLASSES = [
  { id: "class-x-tkj-1", name: "X TKJ 1", grade: "X", major: "TKJ" },
  { id: "class-x-tkj-2", name: "X TKJ 2", grade: "X", major: "TKJ" },
  { id: "class-xi-tkj-1", name: "XI TKJ 1", grade: "XI", major: "TKJ" },
  { id: "class-xii-tkj-1", name: "XII TKJ 1", grade: "XII", major: "TKJ" },
]

// Current session state
interface AttendanceState {
  academicYearId: string
  semesterId: string
  classId: string
  date: string
  records: AttendanceRecord[]
  isSubmitted: boolean
}

const initialState: AttendanceState = {
  academicYearId: "1",
  semesterId: "1",
  classId: "class-x-tkj-1",
  date: new Date().toISOString().split("T")[0],
  records: generateDemoStudents("class-x-tkj-1", "X TKJ 1"),
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
        records: generateDemoStudents(classId, classInfo.name),
        isSubmitted: false,
      }))
    }
  }, [])

  // Set date
  const setDate = useCallback((date: string) => {
    setState((prev) => ({
      ...prev,
      date,
      isSubmitted: false,
    }))
  }, [])

  // Set academic year and semester
  const setAcademicPeriod = useCallback(
    (academicYearId: string, semesterId: string) => {
      setState((prev) => ({
        ...prev,
        academicYearId,
        semesterId,
      }))
    },
    []
  )

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
      // Simulate API call
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
    const total = state.records.length
    const present = state.records.filter(
      (r) => r.status === "present"
    ).length
    const late = state.records.filter((r) => r.status === "late").length
    const permission = state.records.filter(
      (r) => r.status === "permission"
    ).length
    const sick = state.records.filter((r) => r.status === "sick").length
    const absent = state.records.filter((r) => r.status === "absent").length
    const percentage = total > 0 ? ((present + late) / total) * 100 : 0

    return {
      totalStudents: total,
      present,
      late,
      permission,
      sick,
      absent,
      percentage,
    }
  }, [state.records])

  // Load attendance for a specific date/class
  const loadAttendance = useCallback(
    async (classId: string, date: string) => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300))

        const classInfo = DEMO_CLASSES.find((c) => c.id === classId)
        if (classInfo) {
          setState({
            academicYearId: "1",
            semesterId: "1",
            classId,
            date,
            records: generateDemoStudents(classId, classInfo.name),
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
    classes: DEMO_CLASSES,
    summary,
    loading,
    error,

    // Actions
    setClass,
    setDate,
    setAcademicPeriod,
    updateRecordStatus,
    bulkUpdateStatus,
    markAllPresent,
    resetAttendance,
    submitAttendance,
    loadAttendance,
  }
}

// Hook for attendance recap
export function useAttendanceRecap() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate recap data
  const getDailyRecap = useCallback(async (date: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Generate demo recap for all classes
      const recap = DEMO_CLASSES.map((cls) => {
        const students = generateDemoStudents(cls.id, cls.name)
        const present = students.filter((s) => s.status === "present").length
        const late = students.filter((s) => s.status === "late").length

        return {
          classId: cls.id,
          className: cls.name,
          summary: {
            totalStudents: students.length,
            present,
            late,
            permission: 0,
            sick: 0,
            absent: students.length - present - late,
            percentage:
              students.length > 0
                ? ((present + late) / students.length) * 100
                : 0,
          },
        }
      })

      const totalStudents = recap.reduce((sum, r) => sum + r.summary.totalStudents, 0)
      const totalPresent = recap.reduce((sum, r) => sum + r.summary.present, 0)
      const totalLate = recap.reduce((sum, r) => sum + r.summary.late, 0)
      const totalAbsent = recap.reduce((sum, r) => sum + r.summary.absent, 0)

      return {
        date,
        summary: {
          totalStudents,
          present: totalPresent,
          late: totalLate,
          permission: 0,
          sick: 0,
          absent: totalAbsent,
          percentage:
            totalStudents > 0
              ? ((totalPresent + totalLate) / totalStudents) * 100
              : 0,
        },
        byClass: recap,
      }
    } catch (err) {
      setError("Gagal memuat rekap")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getDailyRecap,
  }
}
