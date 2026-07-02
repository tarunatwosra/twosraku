// Attendance Types

export type AttendanceStatus = "present" | "late" | "permission" | "sick" | "absent"

export interface Attendance {
  id: string
  studentId: string
  academicYearId: string
  semesterId: string
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
  academicYearId: string
  semesterId: string
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
  late: number
  permission: number
  sick: number
  absent: number
  percentage: number
}

export interface ClassAttendance {
  classId: string
  className: string
  academicYearId: string
  semesterId: string
  date: string
  summary: AttendanceSummary
  records: AttendanceRecord[]
}

export interface AttendanceFilter {
  academicYearId?: string
  semesterId?: string
  classId?: string
  date?: string
  startDate?: string
  endDate?: string
  status?: AttendanceStatus
}

export interface AttendanceReport {
  id: string
  type: "daily" | "weekly" | "monthly" | "semester" | "annual"
  title: string
  academicYearId: string
  semesterId?: string
  classId?: string
  date?: string
  startDate: string
  endDate: string
  generatedBy: string
  generatedAt: string
  data: AttendanceSummary
}

// Status display
export const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; shortLabel: string; color: string }
> = {
  present: { label: "Hadir", shortLabel: "H", color: "success" },
  late: { label: "Terlambat", shortLabel: "T", color: "warning" },
  permission: { label: "Izin", shortLabel: "I", color: "info" },
  sick: { label: "Sakit", shortLabel: "S", color: "warning" },
  absent: { label: "Alpha", shortLabel: "A", color: "danger" },
}

// Statistics
export interface AttendanceStatistics {
  attendancePercentage: number
  presentCount: number
  lateCount: number
  permissionCount: number
  sickCount: number
  absentCount: number
  mostFrequentStatus: AttendanceStatus
}

export interface StudentAttendanceHistory {
  studentId: string
  academicYearId: string
  semesterId: string
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
  byWeek: WeeklyRecap[]
}

export interface SemesterRecap {
  academicYearId: string
  semesterId: string
  summary: AttendanceStatistics
  byMonth: MonthlyRecap[]
  byClass: {
    classId: string
    className: string
    statistics: AttendanceStatistics
  }[]
}
