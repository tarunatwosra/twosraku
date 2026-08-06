/**
 * Attendance Data Layer - Database Operations
 *
 * Fungsi-fungsi untuk CRUD data presensi dari database
 */

import { supabase } from "@/lib/supabase"
import type {
  Class,
  Major,
  Student,
  StudentClass,
  AcademicYear,
  Attendance as DbAttendance,
  AttendanceStatus as DbAttendanceStatus,
} from "@/types/database"
import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceStatus,
} from "@/types/attendance"

// Valid attendance statuses (HSIA - no 'late')
const VALID_STATUSES: AttendanceStatus[] = ["present", "sick", "permission", "absent"]

// Map database status to app status (filter out 'late')
function mapDbStatusToAppStatus(status: DbAttendanceStatus): AttendanceStatus {
  if (VALID_STATUSES.includes(status as AttendanceStatus)) {
    return status as AttendanceStatus
  }
  // 'late' and other statuses default to 'present'
  return "present"
}

// ============================================
// TYPE ALIASES FOR INTERNAL USE
// ============================================

interface ClassWithMajor extends Class {
  majors?: Major
}

interface StudentWithClass extends Student {
  student_classes?: (StudentClass & {
    classes?: ClassWithMajor
    academic_years?: AcademicYear
  })[]
}

// ============================================
// FETCH CLASSES
// ============================================

/**
 * Ambil daftar kelas untuk presensi
 * Hanya kelas aktif dengan siswa yang terdaftar
 */
export async function fetchAttendanceClasses(
  academicYearId?: string
): Promise<{ data: ClassWithMajor[]; error: string | null }> {
  try {
    // Jika ada academic year filter, gunakan subquery
    let query = supabase
      .from("classes")
      .select(`
        *,
        majors (*)
      `)
      .eq("status", "active")
      .order("name", { ascending: true })

    // Filter kelas yang memiliki siswa aktif
    if (academicYearId) {
      const { data: studentClasses, error: scError } = await supabase
        .from("student_classes")
        .select("class_id")
        .eq("academic_year_id", academicYearId)
        .eq("status", "active")

      if (scError) {
        console.error("Error fetching student classes:", scError)
        return { data: [], error: scError.message }
      }

      const classIds = [...new Set(studentClasses?.map((sc) => sc.class_id) || [])]
      if (classIds.length > 0) {
        query = query.in("id", classIds)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching classes:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching classes:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data kelas" }
  }
}

// ============================================
// FETCH STUDENTS BY CLASS
// ============================================

/**
 * Ambil daftar siswa berdasarkan kelas dan tahun ajaran
 * Menggunakan two-step query: student_classes → students
 */
export async function fetchStudentsByClass(
  classId: string,
  academicYearId?: string
): Promise<{ data: StudentWithClass[]; error: string | null }> {
  try {
    // Step 1: Get student IDs from student_classes junction table
    let scQuery = supabase
      .from("student_classes")
      .select("student_id, attendance_number, status, academic_year_id")
      .eq("class_id", classId)
      .eq("status", "active")

    if (academicYearId) {
      scQuery = scQuery.eq("academic_year_id", academicYearId)
    }

    const { data: studentClasses, error: scError } = await scQuery

    if (scError) {
      console.error("Error fetching student_classes:", scError)
      return { data: [], error: scError.message }
    }

    if (!studentClasses || studentClasses.length === 0) {
      return { data: [], error: null }
    }

    // Extract student IDs and create a map for attendance numbers
    const studentIds = studentClasses.map((sc) => sc.student_id)
    const attendanceMap = new Map<string, number>()
    studentClasses.forEach((sc) => {
      attendanceMap.set(sc.student_id, sc.attendance_number || 999)
    })

    // Step 2: Get students by IDs with their class info
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select(`
        *,
        student_classes (
          *,
          classes (
            *,
            majors (*)
          ),
          academic_years (*)
        )
      `)
      .in("id", studentIds)
      .eq("is_active", true)

    if (studentsError) {
      console.error("Error fetching students:", studentsError)
      return { data: [], error: studentsError.message }
    }

    // Sort by attendance number
    const sortedStudents = (students || []).sort((a, b) => {
      const aNum = attendanceMap.get(a.id) ?? 999
      const bNum = attendanceMap.get(b.id) ?? 999
      return aNum - bNum
    })

    return { data: sortedStudents, error: null }
  } catch (err) {
    console.error("Error fetching students:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data siswa" }
  }
}

// ============================================
// FETCH ATTENDANCE BY DATE
// ============================================

/**
 * Ambil data presensi untuk tanggal tertentu
 */
export async function fetchAttendanceByDate(
  classId: string,
  date: string,
  academicYearId?: string,
  semesterId?: string
): Promise<{ data: DbAttendance[]; error: string | null }> {
  try {
    let query = supabase
      .from("attendances")
      .select("*")
      .eq("class_id", classId)
      .eq("date", date)

    if (academicYearId) {
      query = query.eq("academic_year_id", academicYearId)
    }

    if (semesterId) {
      query = query.eq("semester_id", semesterId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching attendance:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching attendance:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data presensi" }
  }
}

// ============================================
// SAVE ATTENDANCE
// ============================================

/**
 * Simpan atau update presensi siswa
 */
export async function saveAttendance(
  records: {
    studentId: string
    classId: string
    academicYearId: string
    semesterId: string
    date: string
    status: AttendanceStatus
    notes?: string
    recordedBy?: string
  }[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Prepare records for upsert
    const recordsToUpsert = records.map((record) => ({
      student_id: record.studentId,
      class_id: record.classId,
      academic_year_id: record.academicYearId,
      semester_id: record.semesterId,
      date: record.date,
      status: record.status,
      notes: record.notes || null,
      recorded_by: record.recordedBy || null,
      recorded_at: new Date().toISOString(),
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    // Use upsert with conflict handling
    // Note: database UNIQUE index is on (student_id, class_id, date) - migration 009
    const { error: upsertError } = await supabase
      .from("attendances")
      .upsert(recordsToUpsert, {
        onConflict: "student_id,class_id,date",
        ignoreDuplicates: false,
      })

    if (upsertError) {
      console.error("Error saving attendance:", upsertError)
      return { success: false, error: upsertError.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error saving attendance:", err)
    return { success: false, error: "Terjadi kesalahan saat menyimpan presensi" }
  }
}

// ============================================
// GET ATTENDANCE STATS
// ============================================

/**
 * Hitung statistik kehadiran untuk kelas dan tanggal tertentu
 */
export async function getAttendanceStats(
  classId: string,
  date: string,
  academicYearId?: string
): Promise<{ data: AttendanceSummary; error: string | null }> {
  try {
    // Get students count
    const { data: students, error: studentsError } = await fetchStudentsByClass(
      classId,
      academicYearId
    )

    if (studentsError) {
      return { data: { totalStudents: 0, present: 0, sick: 0, permission: 0, absent: 0, percentage: 0 }, error: studentsError }
    }

    const totalStudents = students.length

    // Get attendance records
    const { data: attendanceRecords, error: attendanceError } = await fetchAttendanceByDate(
      classId,
      date,
      academicYearId
    )

    if (attendanceError) {
      return { data: { totalStudents, present: 0, sick: 0, permission: 0, absent: 0, percentage: 0 }, error: attendanceError }
    }

    // Count by status
    const present = attendanceRecords.filter((r) => r.status === "present").length
    const sick = attendanceRecords.filter((r) => r.status === "sick").length
    const permission = attendanceRecords.filter((r) => r.status === "permission").length
    const absent = attendanceRecords.filter((r) => r.status === "absent").length

    // Students without attendance record are considered present (default)
    const recordedStudents = attendanceRecords.length
    const unrecordedStudents = totalStudents - recordedStudents

    const totalPresent = present + unrecordedStudents
    const percentage = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0

    return {
      data: {
        totalStudents,
        present: totalPresent,
        sick,
        permission,
        absent,
        percentage,
      },
      error: null,
    }
  } catch (err) {
    console.error("Error getting attendance stats:", err)
    return {
      data: { totalStudents: 0, present: 0, sick: 0, permission: 0, absent: 0, percentage: 0 },
      error: "Terjadi kesalahan saat menghitung statistik",
    }
  }
}

// ============================================
// BUILD ATTENDANCE RECORDS
// ============================================

/**
 * Bangun AttendanceRecord[] dari database students dan attendance
 */
export async function buildAttendanceRecords(
  classId: string,
  date: string,
  academicYearId?: string
): Promise<{ data: AttendanceRecord[]; error: string | null }> {
  try {
    // Fetch students
    const { data: students, error: studentsError } = await fetchStudentsByClass(
      classId,
      academicYearId
    )

    if (studentsError) {
      return { data: [], error: studentsError }
    }

    // Fetch existing attendance
    const { data: attendanceRecords, error: attendanceError } = await fetchAttendanceByDate(
      classId,
      date,
      academicYearId
    )

    if (attendanceError) {
      return { data: [], error: attendanceError }
    }

    // Create lookup map for attendance
    const attendanceMap = new Map<string, DbAttendance>()
    attendanceRecords?.forEach((record) => {
      attendanceMap.set(record.student_id, record)
    })

    // Build attendance records
    const records: AttendanceRecord[] = students.map((student) => {
      const studentClass = student.student_classes?.find(
        (sc: { class_id: string; status: string }) => sc.class_id === classId && sc.status === "active"
      )
      const attendance = attendanceMap.get(student.id)

      return {
        id: attendance?.id || `${student.id}-${date}`,
        student: {
          id: student.id,
          name: student.full_name,
          studentNumber: student.student_number,
          entryYear: student.created_at
            ? new Date(student.created_at).getFullYear().toString()
            : "",
          attendanceNumber: studentClass?.attendance_number
            ? String(studentClass.attendance_number)
            : "",
          class: studentClass?.classes?.name || "",
          major: studentClass?.classes?.majors?.name || "",
          gender: student.gender === "male" ? "L" : "P",
          photo: student.photo_url || undefined,
        },
        status: attendance ? mapDbStatusToAppStatus(attendance.status) : "present",
        notes: attendance?.notes || undefined,
      }
    })

    return { data: records, error: null }
  } catch (err) {
    console.error("Error building attendance records:", err)
    return { data: [], error: "Terjadi kesalahan saat membangun data presensi" }
  }
}

// ============================================
// GET CLASS ATTENDANCE SUMMARY
// ============================================

/**
 * Ambil ringkasan kehadiran semua kelas untuk tanggal tertentu
 */
export async function getAllClassesAttendanceSummary(
  date: string,
  academicYearId?: string
): Promise<{
  data: { classId: string; className: string; majorName: string; summary: AttendanceSummary }[]
  error: string | null
}> {
  try {
    // Get all classes
    const { data: classes, error: classesError } = await fetchAttendanceClasses(academicYearId)

    if (classesError) {
      return { data: [], error: classesError }
    }

    // Get stats for each class
    const results = await Promise.all(
      classes.map(async (cls) => {
        const { data: stats, error: statsError } = await getAttendanceStats(cls.id, date, academicYearId)

        if (statsError) {
          return null
        }

        return {
          classId: cls.id,
          className: cls.name,
          majorName: cls.majors?.name || "",
          summary: stats,
        }
      })
    )

    return {
      data: results.filter((r): r is NonNullable<typeof r> => r !== null),
      error: null,
    }
  } catch (err) {
    console.error("Error getting all classes summary:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil ringkasan" }
  }
}

// ============================================
// ACTIVE YEAR/SEMESTER HELPERS
// ============================================

/**
 * Ambil tahun ajaran aktif
 */
export async function getActiveAcademicYear(): Promise<{
  data: AcademicYear | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No active academic year
        return { data: null, error: null }
      }
      console.error("Error fetching active academic year:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Error fetching active academic year:", err)
    return { data: null, error: "Terjadi kesalahan" }
  }
}

/**
 * Ambil semester aktif
 */
export async function getActiveSemester(): Promise<{
  data: { id: string; academic_year_id: string } | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from("semesters")
      .select("id, academic_year_id")
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return { data: null, error: null }
      }
      console.error("Error fetching active semester:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Error fetching active semester:", err)
    return { data: null, error: "Terjadi kesalahan" }
  }
}
