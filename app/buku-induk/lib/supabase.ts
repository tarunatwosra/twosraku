/**
 * Student Registry - Supabase Data Layer
 *
 * Fungsi-fungsi untuk mengambil dan memanipulasi data siswa dari Supabase
 */

import { supabase } from "@/lib/supabase"
import type { Student, StudentWithClass, StudentFilters } from "@/types/database"

// ============================================
// FETCH STUDENTS
// ============================================

export type SortField = "full_name" | "student_number" | "created_at" | "enrollment_year"
export type SortDirection = "asc" | "desc"

interface FetchStudentsOptions {
  page?: number
  perPage?: number
  filters?: StudentFilters
  academicYearId?: string
  sortField?: SortField
  sortDirection?: SortDirection
}

interface FetchStudentsResult {
  data: StudentWithClass[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Ambil daftar siswa dengan filter dan pagination
 */
export async function fetchStudents(
  options: FetchStudentsOptions = {}
): Promise<FetchStudentsResult> {
  const { page = 1, perPage = 25, filters = {}, academicYearId } = options

  // Build query untuk student_classes dengan relasi
  let studentClassesQuery = supabase
    .from("student_classes")
    .select(`
      *,
      classes (
        *,
        grades (*),
        majors (*)
      )
    `)

  if (academicYearId) {
    studentClassesQuery = studentClassesQuery.eq("academic_year_id", academicYearId)
  }

  // Apply class/major/grade filters to student_classes query
  if (filters.class_id) {
    studentClassesQuery = studentClassesQuery.eq("class_id", filters.class_id)
  }

  if (filters.major_id) {
    studentClassesQuery = studentClassesQuery.eq("classes.major_id", filters.major_id)
  }

  if (filters.grade_id) {
    studentClassesQuery = studentClassesQuery.eq("classes.grade_id", filters.grade_id)
  }

  const { data: studentClasses, error: scError } = await studentClassesQuery

  if (scError) throw scError

  // Ambil student IDs dari student_classes
  const studentIds = studentClasses?.map((sc) => sc.student_id) || []

  if (studentIds.length === 0) {
    return {
      data: [],
      pagination: { page, pageSize: perPage, total: 0, totalPages: 0 },
    }
  }

  // Build query untuk students
  let studentsQuery = supabase.from("students").select("*", { count: "exact" })

  // Apply filters
  if (filters.status) {
    studentsQuery = studentsQuery.eq("status", filters.status)
  }

  if (filters.gender) {
    studentsQuery = studentsQuery.eq("gender", filters.gender)
  }

  if (filters.search) {
    studentsQuery = studentsQuery.or(
      `full_name.ilike.%${filters.search}%,student_number.ilike.%${filters.search}%,nickname.ilike.%${filters.search}%`
    )
  }

  // Filter hanya siswa yang ada di student_classes
  studentsQuery = studentsQuery.in("id", studentIds)

  // Sorting
  const sortField = options.sortField || "full_name"
  const sortDirection = options.sortDirection || "asc"
  studentsQuery = studentsQuery.order(sortField, { ascending: sortDirection === "asc" })

  // Pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  studentsQuery = studentsQuery.range(from, to)

  const { data: students, error: sError, count } = await studentsQuery

  if (sError) throw sError

  // Gabungkan students dengan student_classes
  const studentsWithClass = (students || []).map((student) => ({
    ...student,
    student_classes: studentClasses?.filter((sc) => sc.student_id === student.id) || [],
  }))

  return {
    data: studentsWithClass,
    pagination: {
      page,
      pageSize: perPage,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
    },
  }
}

// ============================================
// FETCH SINGLE STUDENT
// ============================================

/**
 * Ambil satu siswa berdasarkan ID dengan relasi lengkap
 */
export async function fetchStudent(id: string): Promise<StudentWithClass | null> {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      *,
      student_classes (
        *,
        classes (
          *,
          grades (*),
          majors (*)
        )
      ),
      parents (*)
    `
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching student:", error)
    return null
  }

  return data
}

// ============================================
// CREATE STUDENT
// ============================================

interface CreateStudentData {
  student_number: string
  full_name: string
  nickname?: string | null
  gender: "male" | "female"
  birth_place?: string | null
  birth_date?: string | null
  religion?: string | null
  nationality?: string | null
  blood_type?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  national_id?: string | null
  status?: "prospective" | "active"
  enrollment_year?: number
  notes?: string | null
}

/**
 * Buat siswa baru
 */
export async function createStudent(
  data: CreateStudentData
): Promise<{ success: boolean; student?: Student; error?: string }> {
  try {
    const { data: newStudent, error } = await supabase
      .from("students")
      .insert({
        ...data,
        status: data.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      // Handle duplicate student number
      if (error.code === "23505") {
        return { success: false, error: "NIS sudah terdaftar" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, student: newStudent }
  } catch (err) {
    console.error("Error creating student:", err)
    return { success: false, error: "Terjadi kesalahan saat membuat siswa" }
  }
}

// ============================================
// UPDATE STUDENT
// ============================================

/**
 * Update data siswa
 */
export async function updateStudent(
  id: string,
  updates: Partial<CreateStudentData>
): Promise<{ success: boolean; student?: Student; error?: string }> {
  try {
    const { data: updatedStudent, error } = await supabase
      .from("students")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "NIS sudah terdaftar" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, student: updatedStudent }
  } catch (err) {
    console.error("Error updating student:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate siswa" }
  }
}

// ============================================
// DELETE / ARCHIVE STUDENT
// ============================================

/**
 * Archive siswa (soft delete)
 */
export async function archiveStudent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("students")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error archiving student:", err)
    return { success: false, error: "Terjadi kesalahan saat mengarsipkan siswa" }
  }
}

// ============================================
// ASSIGN STUDENT TO CLASS
// ============================================

/**
 * Tambahkan siswa ke kelas
 */
export async function assignStudentToClass(
  studentId: string,
  classId: string,
  academicYearId: string,
  attendanceNumber?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Cek apakah sudah ada
    const { data: existing } = await supabase
      .from("student_classes")
      .select("id")
      .eq("student_id", studentId)
      .eq("class_id", classId)
      .eq("academic_year_id", academicYearId)
      .single()

    if (existing) {
      return { success: false, error: "Siswa sudah terdaftar di kelas ini" }
    }

    const { error } = await supabase.from("student_classes").insert({
      student_id: studentId,
      class_id: classId,
      academic_year_id: academicYearId,
      attendance_number: attendanceNumber,
      is_homeroom: false,
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error assigning student to class:", err)
    return { success: false, error: "Terjadi kesalahan saat menambahkan ke kelas" }
  }
}

// ============================================
// STUDENT STATS
// ============================================

/**
 * Ambil statistik siswa
 */
export async function fetchStudentStats(academicYearId?: string) {
  try {
    // Total siswa
    const { count: total } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })

    // Siswa aktif
    const { count: active } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Berdasarkan gender
    const { count: male } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("gender", "male")

    const { count: female } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("gender", "female")

    // Berdasarkan status
    const { count: prospective } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "prospective")

    const { count: graduated } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "graduated")

    const { count: transferred } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "transferred")

    return {
      total: total || 0,
      active: active || 0,
      male: male || 0,
      female: female || 0,
      prospective: prospective || 0,
      graduated: graduated || 0,
      transferred: transferred || 0,
    }
  } catch (err) {
    console.error("Error fetching student stats:", err)
    return {
      total: 0,
      active: 0,
      male: 0,
      female: 0,
      prospective: 0,
      graduated: 0,
      transferred: 0,
    }
  }
}

// ============================================
// CHECK DUPLICATE
// ============================================

/**
 * Cek apakah NIS sudah terdaftar
 */
export async function checkDuplicateNIS(
  nis: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("student_number", nis)

  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  const { count } = await query
  return (count || 0) > 0
}

// ============================================
// FETCH ARCHIVED STUDENTS
// ============================================

interface FetchArchivedOptions {
  page?: number
  perPage?: number
  search?: string
}

interface FetchArchivedResult {
  data: StudentWithClass[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Ambil daftar siswa yang diarsipkan
 */
export async function fetchArchivedStudents(
  options: FetchArchivedOptions = {}
): Promise<FetchArchivedResult> {
  const { page = 1, perPage = 25, search } = options

  // Build query untuk students
  let studentsQuery = supabase
    .from("students")
    .select("*", { count: "exact" })
    .eq("status", "archived")

  // Apply search filter
  if (search) {
    studentsQuery = studentsQuery.or(
      `full_name.ilike.%${search}%,student_number.ilike.%${search}%,nickname.ilike.%${search}%`
    )
  }

  // Sorting
  studentsQuery = studentsQuery.order("updated_at", { ascending: false })

  // Pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  studentsQuery = studentsQuery.range(from, to)

  const { data: students, error: sError, count } = await studentsQuery

  if (sError) throw sError

  // Fetch student classes for each student
  const studentsWithClass = await Promise.all(
    (students || []).map(async (student) => {
      const { data: studentClasses } = await supabase
        .from("student_classes")
        .select(`
          *,
          classes (
            *,
            grades (*),
            majors (*)
          )
        `)
        .eq("student_id", student.id)

      const { data: parents } = await supabase
        .from("parents")
        .select("*")
        .eq("student_id", student.id)

      return {
        ...student,
        student_classes: studentClasses || [],
        parents: parents || [],
      } as StudentWithClass
    })
  )

  return {
    data: studentsWithClass,
    pagination: {
      page,
      pageSize: perPage,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
    },
  }
}

// ============================================
// RESTORE STUDENT
// ============================================

/**
 * Kembalikan siswa dari status archived ke active
 */
export async function restoreStudent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("students")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error restoring student:", err)
    return { success: false, error: "Terjadi kesalahan saat mengembalikan siswa" }
  }
}

// ============================================
// BULK ARCHIVE STUDENTS
// ============================================

/**
 * Arsipkan multiple siswa sekaligus
 */
export async function bulkArchiveStudents(
  ids: string[]
): Promise<{ success: boolean; archived?: number; error?: string }> {
  try {
    const { error } = await supabase
      .from("students")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .in("id", ids)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, archived: ids.length }
  } catch (err) {
    console.error("Error bulk archiving students:", err)
    return { success: false, error: "Terjadi kesalahan saat mengarsipkan siswa" }
  }
}

// ============================================
// PERMANENT DELETE STUDENT
// ============================================

/**
 * Hapus siswa secara permanen (hard delete)
 * PERINGATAN: Ini akan menghapus semua data terkait
 */
export async function permanentlyDeleteStudent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete related records first (order matters due to foreign keys)
    // Delete from child tables first

    await supabase.from("parents").delete().eq("student_id", id)
    await supabase.from("student_classes").delete().eq("student_id", id)

    // Attendance records
    await supabase.from("attendance").delete().eq("student_id", id)

    // Assessment participants
    const { data: participants } = await supabase
      .from("assessment_participants")
      .select("id")
      .eq("student_id", id)

    if (participants && participants.length > 0) {
      const participantIds = participants.map((p) => p.id)
      await supabase.from("student_scores").delete().in("participant_id", participantIds)
      await supabase.from("assessment_participants").delete().in("id", participantIds)
    }

    // Character records
    await supabase.from("character_records").delete().eq("student_id", id)

    // Finally delete the student
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error permanently deleting student:", err)
    return { success: false, error: "Terjadi kesalahan saat menghapus siswa" }
  }
}
