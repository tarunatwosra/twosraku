// Attendance Types - v2.0
// Status: HSIA (Hadir, Sakit, Ijin, Alpa)

export type AttendanceStatus = "present" | "sick" | "permission" | "absent"

export interface Attendance {
  id: string
  studentId: string
  classId: string
  date: string
  status: AttendanceStatus
  notes?: string
  recordedBy: string
  recordedAt: string
  updatedBy?: string
  updatedAt?: string
}

export interface AttendanceRecord {
  id: string
  student: {
    id: string
    name: string
    studentNumber: string
    class: string
    major: string
    gender: "L" | "P"
    photo?: string
  }
  status: AttendanceStatus
  notes?: string
}

export interface AttendanceSession {
  classId: string
  date: string
  records: AttendanceRecord[]
  isSubmitted: boolean
  submittedBy?: string
  submittedAt?: string
}

export interface AttendanceSummary {
  totalStudents: number
  present: number
  sick: number
  permission: number
  absent: number
  percentage: number
}

export interface ClassAttendance {
  classId: string
  className: string
  date: string
  summary: AttendanceSummary
  records: AttendanceRecord[]
}

export interface AttendanceFilter {
  classId?: string
  date?: string
  startDate?: string
  endDate?: string
  status?: AttendanceStatus
}

export interface AttendanceReport {
  id: string
  type: "daily" | "weekly" | "monthly"
  title: string
  date?: string
  startDate: string
  endDate: string
  generatedBy: string
  generatedAt: string
  data: AttendanceSummary
}

// Status display - HSIA
export const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; shortLabel: string; color: string }
> = {
  present: { label: "Hadir", shortLabel: "H", color: "success" },
  sick: { label: "Sakit", shortLabel: "S", color: "warning" },
  permission: { label: "Izin", shortLabel: "I", color: "info" },
  absent: { label: "Alpa", shortLabel: "A", color: "danger" },
}

// Statistics
export interface AttendanceStatistics {
  attendancePercentage: number
  presentCount: number
  sickCount: number
  permissionCount: number
  absentCount: number
  mostFrequentStatus: AttendanceStatus
}

export interface StudentAttendanceHistory {
  studentId: string
  statistics: AttendanceStatistics
  records: Attendance[]
}

// Recap types
export interface DailyRecap {
  date: string
  summary: AttendanceSummary
  byClass: {
    classId: string
    className: string
    summary: AttendanceSummary
  }[]
}

export interface WeeklyRecap {
  weekNumber: number
  startDate: string
  endDate: string
  summary: AttendanceSummary
  byDay: DailyRecap[]
}

export interface MonthlyRecap {
  month: number
  year: number
  summary: AttendanceSummary
  byDay: DailyRecap[]
}

export interface TrendData {
  date: string
  percentage: number
  dayName: string
}
