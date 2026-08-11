/**
 * Class Attendance Days Management - Supabase Data Layer
 *
 * Fungsi-fungsi untuk CRUD jadwal hari presensi per kelas
 */

import { supabase } from "@/lib/supabase"
import type { ClassAttendanceDay, DayOfWeek, Class } from "@/types/database"

// ============================================
// FETCH ATTENDANCE DAYS BY CLASS
// ============================================

/**
 * Ambil jadwal hari presensi untuk satu kelas
 */
export async function fetchAttendanceDaysByClass(
  classId: string
): Promise<{ data: ClassAttendanceDay[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("class_attendance_days")
      .select("*")
      .eq("class_id", classId)
      .order("day_of_week", { ascending: true })

    if (error) {
      console.error("Error fetching attendance days:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching attendance days:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil jadwal presensi" }
  }
}

// ============================================
// FETCH ALL ATTENDANCE DAYS
// ============================================

/**
 * Ambil semua jadwal hari presensi untuk semua kelas
 */
export async function fetchAllAttendanceDays(): Promise<{
  data: (ClassAttendanceDay & { classes?: Class })[]
  error: string | null
}> {
  try {
    console.log("[AttendanceDays] fetchAllAttendanceDays called")
    const { data, error } = await supabase
      .from("class_attendance_days")
      .select(`
        *,
        classes (
          id,
          name,
          status,
          majors (
            name,
            code
          )
        )
      `)
      .order("class_id", { ascending: true })
      .order("day_of_week", { ascending: true })

    if (error) {
      console.error("[AttendanceDays] fetchAllAttendanceDays error:", error)
      return { data: [], error: error.message }
    }

    console.log("[AttendanceDays] fetchAllAttendanceDays result:", data?.length || 0, "records")
    return { data: data || [], error: null }
  } catch (err) {
    console.error("[AttendanceDays] fetchAllAttendanceDays catch error:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil jadwal presensi" }
  }
}

// ============================================
// SET ATTENDANCE DAYS FOR CLASS
// ============================================

/**
 * Set jadwal hari presensi untuk satu kelas
 * Menghapus semua jadwal existing dan menggantinya dengan yang baru
 */
export async function setAttendanceDaysForClass(
  classId: string,
  days: DayOfWeek[]
): Promise<{ success: boolean; error: string | null }> {
  console.log(`[AttendanceDays] setAttendanceDaysForClass called:`, { classId, days })

  try {
    // Validasi classId
    if (!classId || classId.trim() === '') {
      return { success: false, error: "Class ID tidak valid" }
    }

    // Hapus jadwal existing
    console.log(`[AttendanceDays] Deleting existing attendance days for class ${classId}`)
    const { error: deleteError } = await supabase
      .from("class_attendance_days")
      .delete()
      .eq("class_id", classId)

    if (deleteError) {
      console.error(`[AttendanceDays] Delete error:`, deleteError)
      // Lanjut meskipun delete gagal (mungkin belum ada data)
    }
    console.log(`[AttendanceDays] Delete completed`)

    // Jika ada jadwal baru, insert
    if (days.length > 0) {
      console.log(`[AttendanceDays] Inserting ${days.length} attendance days`)
      const insertData = days.map((day) => ({
        class_id: classId,
        day_of_week: day,
      }))

      console.log(`[AttendanceDays] Insert data:`, insertData)

      const { error: insertError, data: insertDataResult } = await supabase
        .from("class_attendance_days")
        .insert(insertData)
        .select()

      if (insertError) {
        console.error(`[AttendanceDays] Insert error details:`, JSON.stringify(insertError, null, 2))
        // Cek apakah RLS issue
        if (insertError.message?.includes('row-level security') || insertError.code === '42501') {
          return { success: false, error: "Akses ditolak. Pastikan RLS dimatikan atau policy dibuat." }
        }
        return { success: false, error: insertError.message || "Gagal menyimpan data" }
      }
      console.log(`[AttendanceDays] Insert successful, result:`, insertDataResult)
    } else {
      console.log(`[AttendanceDays] No days to insert (empty array)`)
    }

    return { success: true, error: null }
  } catch (err: any) {
    console.error(`[AttendanceDays] Catch error:`, err)
    return { success: false, error: err?.message || "Terjadi kesalahan saat menyimpan jadwal presensi" }
  }
}

// ============================================
// CHECK IF DATE IS ATTENDANCE DAY
// ============================================

/**
 * Cek apakah tanggal tertentu adalah hari presensi untuk kelas tertentu
 * @param classId - ID kelas
 * @param date - Tanggal yang akan dicek
 * @returns true jika tanggal tersebut adalah hari presensi
 */
export async function isAttendanceDay(
  classId: string,
  date: Date
): Promise<boolean> {
  try {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to our format: 1 = Monday, 7 = Sunday
    let dayOfWeek = date.getDay()
    if (dayOfWeek === 0) dayOfWeek = 7 // Sunday = 7

    const { data, error } = await supabase
      .from("class_attendance_days")
      .select("id")
      .eq("class_id", classId)
      .eq("day_of_week", dayOfWeek)
      .limit(1)

    if (error) {
      console.error("Error checking attendance day:", error)
      return true // Default ke true jika error (fallback)
    }

    return data && data.length > 0
  } catch (err) {
    console.error("Error checking attendance day:", err)
    return true // Default ke true jika error
  }
}

// ============================================
// GET TODAY'S ATTENDANCE SCHEDULE
// ============================================

/**
 * Ambil jadwal presensi untuk hari ini
 * Mengembalikan kelas-kelas yang seharusnya presensi hari ini
 */
export async function getTodayAttendanceSchedule(): Promise<{
  data: {
    classId: string
    className: string
    majorName: string
    dayOfWeek: DayOfWeek
  }[]
  error: string | null
}> {
  try {
    // Get current day of week
    const now = new Date()
    let dayOfWeek = now.getDay()
    if (dayOfWeek === 0) dayOfWeek = 7 // Sunday = 7

    const { data, error } = await supabase
      .from("class_attendance_days")
      .select(`
        class_id,
        day_of_week,
        classes (
          id,
          name,
          majors (
            name
          )
        )
      `)
      .eq("day_of_week", dayOfWeek)
      .eq("classes.status", "active")

    if (error) {
      console.error("Error fetching today's schedule:", error)
      return { data: [], error: error.message }
    }

    const schedule = (data || []).map((item) => ({
      classId: item.class_id,
      className: item.classes?.name || "Unknown",
      majorName: (item.classes as any)?.majors?.name || "",
      dayOfWeek: item.day_of_week as DayOfWeek,
    }))

    return { data: schedule, error: null }
  } catch (err) {
    console.error("Error fetching today's schedule:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil jadwal presensi" }
  }
}

// ============================================
// GET CLASSES WITH ATTENDANCE STATUS
// ============================================

export interface ClassAttendanceStatus {
  classId: string
  className: string
  majorName: string
  hasSchedule: boolean
  isAttendanceDay: boolean
  hasAttendanceRecorded: boolean
  attendancePercentage?: number
}

/**
 * Ambil status presensi semua kelas untuk hari ini
 */
export async function getClassesAttendanceStatus(): Promise<{
  data: ClassAttendanceStatus[]
  error: string | null
}> {
  try {
    const now = new Date()
    let dayOfWeek = now.getDay()
    if (dayOfWeek === 0) dayOfWeek = 7 // Sunday = 7

    const today = now.toISOString().split("T")[0]

    // Get all active classes with their attendance days
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select(`
        id,
        name,
        majors (
          name
        ),
        class_attendance_days (
          id,
          day_of_week
        )
      `)
      .eq("status", "active")

    if (classesError) {
      return { data: [], error: classesError.message }
    }

    // Get today's attendance records
    const { data: todayAttendance, error: attendanceError } = await supabase
      .from("attendances")
      .select(`
        class_id,
        status
      `)
      .eq("date", today)

    if (attendanceError) {
      return { data: [], error: attendanceError.message }
    }

    // Process results
    const result: ClassAttendanceStatus[] = (classes || []).map((cls) => {
      const attendanceDays = cls.class_attendance_days || []
      const hasSchedule = attendanceDays.length > 0
      const isAttendanceDay = attendanceDays.some(
        (d) => d.day_of_week === dayOfWeek
      )

      // Check if attendance has been recorded for this class today
      const classAttendance = (todayAttendance || []).filter(
        (a) => a.class_id === cls.id
      )
      const hasAttendanceRecorded = classAttendance.length > 0

      // Calculate percentage if recorded
      let attendancePercentage: number | undefined
      if (hasAttendanceRecorded) {
        const present = classAttendance.filter(
          (a) => a.status === "present" || a.status === "late"
        ).length
        attendancePercentage = Math.round((present / classAttendance.length) * 100)
      }

      return {
        classId: cls.id,
        className: cls.name,
        majorName: (cls.majors as any)?.name || "",
        hasSchedule,
        isAttendanceDay,
        hasAttendanceRecorded,
        attendancePercentage,
      }
    })

    return { data: result, error: null }
  } catch (err) {
    console.error("Error getting classes attendance status:", err)
    return { data: [], error: "Terjadi kesalahan" }
  }
}

// ============================================
// CREATE DEFAULT SCHEDULE FOR NEW CLASS
// ============================================

/**
 * Buat jadwal default untuk kelas baru (Senin-Jumat)
 */
export async function createDefaultAttendanceSchedule(
  classId: string
): Promise<{ success: boolean; error: string | null }> {
  // Default: Senin (1) sampai Jumat (5)
  const defaultDays: DayOfWeek[] = [1, 2, 3, 4, 5]
  return setAttendanceDaysForClass(classId, defaultDays)
}
