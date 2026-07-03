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
 *
 * Catatan: SELALU menampilkan semua siswa.
 * Filter kelas/jurusan/tingkat HANYA akan mempengaruhi tampilan jika siswa memiliki record di student_classes.
 * Siswa baru yang belum di-assign ke kelas tetap akan muncul.
 */
export async function fetchStudents(
  options: FetchStudentsOptions = {}
): Promise<FetchStudentsResult> {
  const { page = 1, perPage = 25, filters = {}, academicYearId } = options

  let studentIds: string[] = []
  let studentClassesData: Record<string, unknown>[] = []

  // Ambil student_classes jika academicYearId diberikan
  // Ini digunakan untuk menampilkan informasi kelas siswa
  if (academicYearId) {
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

    studentClassesQuery = studentClassesQuery.eq("academic_year_id", academicYearId)

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

    const { data: scData, error: scError } = await studentClassesQuery

    if (scError) throw scError

    // Simpan student_classes data
    studentClassesData = scData || []
    // Ambil student IDs yang match dengan filter kelas
    studentIds = studentClassesData.map((sc) => sc.student_id) as string[]
  }

  // Build query untuk students - SELALU ambil semua siswa
  let studentsQuery = supabase.from("students").select("*", { count: "exact" })

  // Apply filters
  // Note: Jika kolom is_active belum ada di database, filter ini akan di-skip
  // Setelah SQL migration dijalankan, filter ini akan aktif

  if (filters.gender) {
    studentsQuery = studentsQuery.eq("gender", filters.gender)
  }

  if (filters.search) {
    studentsQuery = studentsQuery.or(
      `full_name.ilike.%${filters.search}%,student_number.ilike.%${filters.search}%,nickname.ilike.%${filters.search}%`
    )
  }

  // Jika ada filter kelas/jurusan/tingkat, filter siswa yang match
  // SISWA YANG TIDAK PUNYA RECORD DI student_classes AKAN TETAP MUNCUL
  // (kecuali jika ada filter kelas aktif)
  if (academicYearId && studentIds.length > 0) {
    // Filter berdasarkan student_ids yang punya record di student_classes
    studentsQuery = studentsQuery.in("id", studentIds)
  }
  // Jika academicYearId diberikan tapi studentIds.length === 0,
  // tetap tampilkan semua siswa (tidak ada siswa yang match filter kelas)

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
    student_classes: studentClassesData.filter((sc) => sc.student_id === student.id),
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
  is_active?: boolean
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
        is_active: data.is_active !== undefined ? data.is_active : true,
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
// CREATE STUDENT WITH PARENTS
// ============================================

interface CreateStudentWithParentsData extends CreateStudentData {
  nisn?: string | null
  height_cm?: number | null
  weight_kg?: number | null
  vision?: string | null
  hearing?: string | null
  teeth_condition?: string | null
  physical_disability?: string | null
  illness_history?: string | null
  allergies?: string | null
  health_notes?: string | null
}

interface ParentData {
  type: "father" | "mother" | "guardian"
  full_name: string
  phone?: string | null
  occupation?: string | null
  nik?: string | null
  address?: string | null
  email?: string | null
  education?: string | null
  guardian_relation?: string | null
}

/**
 * Buat siswa baru beserta data orang tua/wali
 */
export async function createStudentWithParents(
  studentData: CreateStudentWithParentsData,
  parentsData: ParentData[]
): Promise<{ success: boolean; student?: Student; error?: string }> {
  try {
    // Build student data object - basic fields that always exist
    const studentInsertData: Record<string, unknown> = {
      student_number: studentData.student_number,
      full_name: studentData.full_name,
      nickname: studentData.nickname || null,
      gender: studentData.gender,
      birth_place: studentData.birth_place || null,
      birth_date: studentData.birth_date || null,
      religion: studentData.religion || null,
      nationality: studentData.nationality || "Indonesia",
      blood_type: studentData.blood_type || null,
      address: studentData.address || null,
      phone: studentData.phone || null,
      email: studentData.email || null,
      national_id: studentData.national_id || null,
      enrollment_year: studentData.enrollment_year || new Date().getFullYear(),
      notes: studentData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // For backward compatibility: only add new fields if they have meaningful values
    // This allows the code to work even before SQL migration is run
    if (studentData.nisn && studentData.nisn.trim()) {
      studentInsertData.nisn = studentData.nisn.trim()
    }

    // Try to add is_active, but handle gracefully if column doesn't exist
    // Default to true for status
    studentInsertData.is_active = studentData.is_active !== false

    // Health fields
    if (studentData.height_cm) {
      studentInsertData.height_cm = studentData.height_cm
    }
    if (studentData.weight_kg) {
      studentInsertData.weight_kg = studentData.weight_kg
    }
    if (studentData.vision && studentData.vision !== 'normal') {
      studentInsertData.vision = studentData.vision
    }
    if (studentData.hearing && studentData.hearing !== 'normal') {
      studentInsertData.hearing = studentData.hearing
    }
    if (studentData.teeth_condition && studentData.teeth_condition !== 'normal') {
      studentInsertData.teeth_condition = studentData.teeth_condition
    }
    if (studentData.physical_disability && studentData.physical_disability !== 'none') {
      studentInsertData.physical_disability = studentData.physical_disability
    }
    if (studentData.illness_history && studentData.illness_history.trim()) {
      studentInsertData.illness_history = studentData.illness_history.trim()
    }
    if (studentData.allergies && studentData.allergies.trim()) {
      studentInsertData.allergies = studentData.allergies.trim()
    }
    if (studentData.health_notes && studentData.health_notes.trim()) {
      studentInsertData.health_notes = studentData.health_notes.trim()
    }

    // Insert student first
    const { data: newStudent, error: studentError } = await supabase
      .from("students")
      .insert(studentInsertData)
      .select()
      .single()

    if (studentError) {
      console.error("Student creation error:", {
        code: studentError.code,
        message: studentError.message,
        details: studentError.details,
        hint: studentError.hint,
      })
      // Handle duplicate student number
      if (studentError.code === "23505") {
        return { success: false, error: "NIS sudah terdaftar" }
      }
      // Handle unknown column errors (migration belum dijalankan)
      if (studentError.code === "42703") {
        // Retry without new fields and status column (removed in v2.0)
        const basicData: Record<string, unknown> = {
          student_number: studentData.student_number,
          full_name: studentData.full_name,
          nickname: studentData.nickname || null,
          gender: studentData.gender,
          birth_place: studentData.birth_place || null,
          birth_date: studentData.birth_date || null,
          religion: studentData.religion || null,
          nationality: "Indonesia",
          blood_type: studentData.blood_type || null,
          address: studentData.address || null,
          phone: studentData.phone || null,
          email: studentData.email || null,
          national_id: studentData.national_id || null,
          enrollment_year: studentData.enrollment_year || new Date().getFullYear(),
          notes: studentData.notes || null,
          is_active: studentData.is_active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: retryStudent, error: retryError } = await supabase
          .from("students")
          .insert(basicData)
          .select()
          .single()

        if (retryError) {
          console.error("Retry student creation error:", {
            code: retryError.code,
            message: retryError.message,
            details: retryError.details,
            hint: retryError.hint,
          })
          if (retryError.code === "23505") {
            return { success: false, error: "NIS sudah terdaftar" }
          }
          return { success: false, error: retryError.message }
        }

        return { success: true, student: retryStudent }
      }
      return { success: false, error: studentError.message }
    }

    // Insert parents if any
    if (parentsData.length > 0 && newStudent) {
      const parentsToInsert = parentsData.map((parent) => ({
        student_id: newStudent.id,
        type: parent.type,
        full_name: parent.full_name,
        phone: parent.phone || null,
        occupation: parent.occupation || null,
        nik: parent.nik || null,
        address: parent.address || null,
        email: parent.email || null,
        education: parent.education || null,
        is_primary: parent.type === "father" || parent.type === "mother",
        // Only add guardian_relation for guardians
        guardian_relation: parent.type === "guardian" ? parent.guardian_relation : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const { error: parentsError } = await supabase
        .from("parents")
        .insert(parentsToInsert)

      if (parentsError) {
        console.error("Parents creation error:", {
          code: parentsError.code,
          message: parentsError.message,
          details: parentsError.details,
          hint: parentsError.hint,
        })
        // Student was created, but parents failed - still return success
        // The student data is preserved
      }
    }

    return { success: true, student: newStudent }
  } catch (err) {
    console.error("Error creating student with parents:", {
      error: err instanceof Error ? {
        name: err.name,
        message: err.message,
        stack: err.stack,
      } : err,
    })
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
        is_active: false,
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
      .eq("is_active", true)

    // Siswa tidak aktif
    const { count: inactive } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("is_active", false)

    // Berdasarkan gender
    const { count: male } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("gender", "male")
      .eq("is_active", true)

    const { count: female } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("gender", "female")
      .eq("is_active", true)

    return {
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      male: male || 0,
      female: female || 0,
    }
  } catch (err) {
    console.error("Error fetching student stats:", err)
    return {
      total: 0,
      active: 0,
      inactive: 0,
      male: 0,
      female: 0,
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

  // Build query untuk students - ambil yang tidak aktif
  let studentsQuery = supabase
    .from("students")
    .select("*", { count: "exact" })
    .eq("is_active", false)

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
        is_active: true,
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
        is_active: false,
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
