/**
 * Registration Library
 *
 * Fungsi-fungsi untuk Registrasi Mandiri Siswa
 */

import { supabase } from "@/lib/supabase"
import type {
  VerifyStudentResult,
  RegistrationFormData,
  RegistrationParentData,
  RegistrationSession,
  RegistrationStats,
} from "@/types/registrasi"
import type { Student, Parent, Class, AcademicYear } from "@/types/database"

// ============================================
// REGISTRATION SETTINGS
// ============================================

const REGISTRATION_SETTING_KEY = "student_registration_enabled"
const REGISTRATION_URL_KEY = "student_registration_url"
const REGISTRATION_ACCESS_COUNT_KEY = "student_registration_access_count"

// Production URL untuk QR code dan link registrasi
const PRODUCTION_REGISTRATION_URL = "https://twosraku.vercel.app/registrasi"
const LOCALHOST_REGISTRATION_URL = "http://localhost:3000/registrasi"

/**
 * Get base URL
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return ""
}

/**
 * Get registration URL based on environment
 * Production: https://twosraku.vercel.app/registrasi
 * Development: http://localhost:3000/registrasi
 */
function getRegistrationUrl(): string {
  const baseUrl = getBaseUrl()
  const isProduction = baseUrl.includes("vercel.app") || baseUrl.includes("twosraku.com")

  if (isProduction || baseUrl === "") {
    return PRODUCTION_REGISTRATION_URL
  }
  return LOCALHOST_REGISTRATION_URL
}

/**
 * Ambil pengaturan registrasi
 */
export async function getRegistrationSettings() {
  try {
    const { data: settings, error } = await supabase
      .from("settings")
      .select("setting_key, value")
      .in("setting_key", [REGISTRATION_SETTING_KEY, REGISTRATION_URL_KEY])

    if (error) throw error

    const settingsMap = new Map(settings?.map((s) => [s.setting_key, s.value]))

    return {
      isEnabled: settingsMap.get(REGISTRATION_SETTING_KEY) === "true",
      // Selalu gunakan URL production untuk QR code
      registrationUrl: PRODUCTION_REGISTRATION_URL,
    }
  } catch (err) {
    console.error("Error getting registration settings:", err)
    return {
      isEnabled: false,
      // Selalu gunakan URL production untuk QR code
      registrationUrl: PRODUCTION_REGISTRATION_URL,
    }
  }
}

/**
 * Update pengaturan registrasi
 */
export async function updateRegistrationSettings(
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update existing record
    const { error: updateError } = await supabase
      .from("settings")
      .update({
        value: isEnabled ? "true" : "false",
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", REGISTRATION_SETTING_KEY)

    // If no rows updated, insert new record
    if (updateError) {
      throw updateError
    }

    // Update URL with production URL
    await supabase
      .from("settings")
      .update({
        value: PRODUCTION_REGISTRATION_URL,
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", REGISTRATION_URL_KEY)

    return { success: true }
  } catch (err) {
    console.error("Error updating registration settings:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan",
    }
  }
}

/**
 * Increment access count
 */
export async function incrementAccessCount(): Promise<void> {
  try {
    // Get current count
    const { data: current } = await supabase
      .from("settings")
      .select("value")
      .eq("setting_key", REGISTRATION_ACCESS_COUNT_KEY)
      .single()

    const currentCount = parseInt(current?.value || "0")
    const newCount = currentCount + 1

    // Update count
    await supabase
      .from("settings")
      .update({
        value: newCount.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", REGISTRATION_ACCESS_COUNT_KEY)
  } catch (err) {
    console.error("Error incrementing access count:", err)
  }
}

/**
 * Get access count
 */
export async function getAccessCount(): Promise<number> {
  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("setting_key", REGISTRATION_ACCESS_COUNT_KEY)
      .single()

    return parseInt(data?.value || "0")
  } catch {
    return 0
  }
}

// ============================================
// ACADEMIC YEAR & CLASSES
// ============================================

/**
 * Get active academic year
 * Returns the academic year with is_active = true
 */
export async function getActiveAcademicYear(): Promise<AcademicYear | null> {
  try {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error || !data) {
      console.error("Error fetching active academic year:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Error in getActiveAcademicYear:", err)
    return null
  }
}

/**
 * Get active classes
 * Returns all classes with status = 'active'
 * Optionally filtered by academic year for enrollment purposes
 */
export async function getActiveClasses(
  academicYearId?: string
): Promise<Class[]> {
  try {
    let query = supabase
      .from("classes")
      .select(`
        id,
        name,
        major_id,
        status,
        created_at,
        updated_at,
        majors (
          id,
          name,
          code
        )
      `)
      .eq("status", "active")
      .order("name")

    if (academicYearId) {
      // Get classes that are assigned to this academic year via student_classes
      const { data: assignedClasses } = await supabase
        .from("student_classes")
        .select("class_id")
        .eq("academic_year_id", academicYearId)

      const classIds = assignedClasses?.map((sc) => sc.class_id) || []

      if (classIds.length > 0) {
        query = query.in("id", classIds)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching active classes:", error)
      return []
    }

    return (data || []) as unknown as Class[]
  } catch (err) {
    console.error("Error in getActiveClasses:", err)
    return []
  }
}

/**
 * Get all active classes (for registration dropdown)
 * Returns classes with their major info, sorted by name
 */
export async function getClassesForRegistration(): Promise<
  Array<{ id: string; name: string; major_name: string; major_code: string }>
> {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select(`
        id,
        name,
        majors (
          name,
          code
        )
      `)
      .eq("status", "active")
      .order("name")

    if (error) {
      console.error("Error fetching classes for registration:", error)
      return []
    }

    return (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      major_name: (c.majors as unknown as { name: string })?.name || "",
      major_code: (c.majors as unknown as { code: string })?.code || "",
    }))
  } catch (err) {
    console.error("Error in getClassesForRegistration:", err)
    return []
  }
}

// ============================================
// VERIFICATION
// ============================================

/**
 * Verifikasi siswa berdasarkan NIS dan tanggal lahir
 */
export async function verifyStudent(
  studentNumber: string,
  birthDate: string
): Promise<VerifyStudentResult> {
  try {
    // Normalize student number (remove spaces)
    const normalizedNumber = studentNumber.trim()

    // Query student
    const { data: student, error } = await supabase
      .from("students")
      .select("*")
      .eq("student_number", normalizedNumber)
      .single()

    if (error || !student) {
      return {
        status: "not_found",
        message: "NIS tidak ditemukan dalam sistem. Pastikan NIS yang kamu masukkan benar.",
      }
    }

    // Check birth date match
    const studentBirthDate = student.birth_date?.split("T")[0]
    if (birthDate && studentBirthDate && studentBirthDate !== birthDate) {
      return {
        status: "invalid_date",
        message: "Tanggal lahir tidak cocok dengan data kami. Silakan hubungi admin.",
      }
    }

    // Check if already completed registration
    // We'll check if the student has all required fields filled
    const isRegistrationComplete = checkRegistrationComplete(student)

    if (isRegistrationComplete) {
      return {
        status: "already_completed",
        message: "Kamu sudah mengisi data sebelumnya. Kamu bisa memperbarui datamu.",
        student,
        canReupload: true,
      }
    }

    return {
      status: "success",
      message: "Verifikasi berhasil. Silakan lengkapi data dirimu.",
      student,
    }
  } catch (err) {
    console.error("Error verifying student:", err)
    return {
      status: "error",
      message: "Terjadi kesalahan saat verifikasi. Silakan coba lagi.",
    }
  }
}

/**
 * Check if student registration is complete
 */
function checkRegistrationComplete(student: Student): boolean {
  // A registration is considered complete if key fields are filled
  const keyFields = [
    student.full_name,
    student.gender,
    student.birth_date,
    student.address,
    student.phone,
  ]

  const filledCount = keyFields.filter(Boolean).length
  return filledCount >= 3 // At least 3 of 5 key fields must be filled
}

// ============================================
// REGISTRATION FORM SUBMISSION
// ============================================

/**
 * Submit registration data
 */
export async function submitRegistration(
  studentId: string,
  formData: Partial<RegistrationFormData>,
  parentsData: RegistrationParentData[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Helper function to truncate strings to max length
    const truncate = (val: string | null | undefined, max: number): string | null => {
      if (!val) return null
      return val.slice(0, max)
    }

    // Prepare student update data
    const studentUpdateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      is_active: true, // Set status aktif secara otomatis saat registrasi
    }

    // Personal data - with truncation safeguards
    if (formData.nisn !== undefined) studentUpdateData.nisn = truncate(formData.nisn, 20) || null
    if (formData.student_number !== undefined) studentUpdateData.student_number = truncate(formData.student_number, 20) || null
    if (formData.full_name !== undefined) studentUpdateData.full_name = truncate(formData.full_name, 255)
    if (formData.nickname !== undefined) studentUpdateData.nickname = truncate(formData.nickname, 100) || null
    if (formData.gender !== undefined) studentUpdateData.gender = truncate(formData.gender, 10)
    if (formData.blood_type !== undefined) studentUpdateData.blood_type = truncate(formData.blood_type, 5) || null
    if (formData.birth_place !== undefined) studentUpdateData.birth_place = truncate(formData.birth_place, 100) || null
    if (formData.birth_date !== undefined) studentUpdateData.birth_date = formData.birth_date || null
    if (formData.religion !== undefined) studentUpdateData.religion = truncate(formData.religion, 50) || null
    if (formData.phone !== undefined) studentUpdateData.phone = truncate(formData.phone, 20) || null
    if (formData.address !== undefined) studentUpdateData.address = formData.address || null // TEXT field, no limit
    // Note: enrollment_year sudah dihapus dari schema, tahun ajaran dikelola via academic_years

    // Health data
    if (formData.height_cm !== undefined)
      studentUpdateData.height_cm = formData.height_cm ? parseFloat(formData.height_cm) : null
    if (formData.weight_kg !== undefined)
      studentUpdateData.weight_kg = formData.weight_kg ? parseFloat(formData.weight_kg) : null
    if (formData.vision !== undefined) studentUpdateData.vision = truncate(formData.vision, 20) || "normal"
    if (formData.hearing !== undefined) studentUpdateData.hearing = truncate(formData.hearing, 20) || "normal"
    if (formData.teeth !== undefined)
      studentUpdateData.teeth_condition = truncate(formData.teeth, 20) || "normal"
    if (formData.physical_disability !== undefined)
      studentUpdateData.physical_disability = truncate(formData.physical_disability, 20) || "none"
    if (formData.illness_history !== undefined)
      studentUpdateData.illness_history = formData.illness_history || null // TEXT field
    if (formData.allergies !== undefined)
      studentUpdateData.allergies = formData.allergies || null // TEXT field
    if (formData.health_notes !== undefined)
      studentUpdateData.health_notes = formData.health_notes || null // TEXT field

    // Other
    if (formData.notes !== undefined) studentUpdateData.notes = formData.notes || null // TEXT field

    // Update student
    const { error: studentError } = await supabase
      .from("students")
      .update(studentUpdateData)
      .eq("id", studentId)

    if (studentError) {
      console.error("Error updating student:", studentError)
      return { success: false, error: studentError.message }
    }

    // Save class enrollment to student_classes
    if (formData.class_id && formData.class_id.trim()) {
      // Get active academic year
      const activeYear = await getActiveAcademicYear()

      if (activeYear) {
        // Check if student already has a class enrollment for this academic year
        const { data: existingEnrollment } = await supabase
          .from("student_classes")
          .select("id")
          .eq("student_id", studentId)
          .eq("academic_year_id", activeYear.id)
          .eq("status", "active")
          .single()

        // Parse attendance number
        const attendanceNumber = formData.attendance_number
          ? parseInt(formData.attendance_number)
          : null

        if (existingEnrollment) {
          // Update existing enrollment
          const { error: updateError } = await supabase
            .from("student_classes")
            .update({
              class_id: formData.class_id,
              attendance_number: attendanceNumber,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingEnrollment.id)

          if (updateError) {
            console.error("Error updating student class enrollment:", updateError)
            // Don't fail the whole registration for this
          }
        } else {
          // Insert new enrollment
          const { error: insertError } = await supabase
            .from("student_classes")
            .insert({
              student_id: studentId,
              class_id: formData.class_id,
              academic_year_id: activeYear.id,
              attendance_number: attendanceNumber,
              status: "active",
              start_date: new Date().toISOString().split("T")[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

          if (insertError) {
            console.error("Error inserting student class enrollment:", insertError)
            // Don't fail the whole registration for this
          }
        }
      }
    }

    // Delete existing parents and insert new ones
    await supabase.from("parents").delete().eq("student_id", studentId)

    // Insert parents if any
    if (parentsData.length > 0) {
      const parentsToInsert = parentsData
        .filter((p) => p.full_name?.trim())
        .map((parent) => ({
          student_id: studentId,
          // Ensure type is always valid (father, mother, guardian)
          type: parent.type === "father" || parent.type === "mother" || parent.type === "guardian"
            ? parent.type
            : "guardian" as const,
          full_name: parent.full_name.slice(0, 255), // Max 255 chars
          phone: parent.phone?.slice(0, 20) || null, // Max 20 chars
          occupation: parent.occupation?.slice(0, 100) || null, // Max 100 chars
          // Truncate guardian_relation to max 50 chars
          guardian_relation: parent.type === "guardian" && parent.guardian_relation
            ? parent.guardian_relation.slice(0, 50)
            : null,
          is_primary: parent.type === "father" || parent.type === "mother",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))

      if (parentsToInsert.length > 0) {
        const { error: parentsError } = await supabase.from("parents").insert(parentsToInsert)

        if (parentsError) {
          console.warn("Error inserting parents:", parentsError)
          // Don't fail the whole registration for this
        }
      }
    }

    return { success: true }
  } catch (err) {
    console.error("Error submitting registration:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data",
    }
  }
}

// ============================================
// REGISTRATION STATS
// ============================================

/**
 * Ambil statistik registrasi
 */
export async function getRegistrationStats(): Promise<RegistrationStats> {
  try {
    // Total students
    const { count: total } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Students with complete registration
    // A student is considered complete if they have: full_name, gender, birth_date, address, phone
    const { data: students, count: completed } = await supabase
      .from("students")
      .select("id, full_name, gender, birth_date, address, phone", { count: "exact" })
      .eq("is_active", true)
      .not("full_name", "is", null)
      .not("gender", "is", null)
      .not("birth_date", "is", null)

    // Count actually complete
    const completedCount = (students || []).filter((s) => {
      return s.full_name && s.gender && s.birth_date && s.address && s.phone
    }).length

    return {
      totalStudents: total || 0,
      completedCount,
      pendingCount: (total || 0) - completedCount,
      completionRate: total ? Math.round((completedCount / total) * 100) : 0,
    }
  } catch (err) {
    console.error("Error getting registration stats:", err)
    return {
      totalStudents: 0,
      completedCount: 0,
      pendingCount: 0,
      completionRate: 0,
    }
  }
}

/**
 * Get students who haven't completed registration
 */
export async function getIncompleteStudents(): Promise<
  Array<{ id: string; student_number: string; full_name: string | null }>
> {
  try {
    const { data: students } = await supabase
      .from("students")
      .select("id, student_number, full_name")
      .eq("is_active", true)
      .or("full_name.is.null,gender.is.null,birth_date.is.null,address.is.null,phone.is.null")

    return students || []
  } catch (err) {
    console.error("Error getting incomplete students:", err)
    return []
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

const REGISTRATION_SESSION_KEY = "registration_session"

/**
 * Simpan session registrasi
 */
export function saveRegistrationSession(session: RegistrationSession): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(REGISTRATION_SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    console.error("Error saving registration session:", err)
  }
}

/**
 * Ambil session registrasi
 */
export function getRegistrationSession(): RegistrationSession | null {
  if (typeof window === "undefined") return null
  try {
    const data = sessionStorage.getItem(REGISTRATION_SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Hapus session registrasi
 */
export function clearRegistrationSession(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(REGISTRATION_SESSION_KEY)
  } catch (err) {
    console.error("Error clearing registration session:", err)
  }
}

/**
 * Check if registration session is valid (not expired)
 */
export function isSessionValid(): boolean {
  const session = getRegistrationSession()
  if (!session) return false

  // Session expires after 240 minutes (4 hours)
  const verifiedAt = new Date(session.verifiedAt)
  const now = new Date()
  const diffMinutes = (now.getTime() - verifiedAt.getTime()) / (1000 * 60)

  return diffMinutes < 240
}

/**
 * Get student by ID with parents data and class info
 * Used for pre-filling registration form
 */
export async function getStudentById(studentId: string): Promise<{
  student: Student | null
  parents: Parent[]
  className?: string
}> {
  try {
    // Fetch student data
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single()

    if (studentError || !student) {
      console.error("Error fetching student:", studentError)
      return { student: null, parents: [], className: undefined }
    }

    // Fetch parents data
    const { data: parents, error: parentsError } = await supabase
      .from("parents")
      .select("*")
      .eq("student_id", studentId)

    if (parentsError) {
      console.warn("Error fetching parents:", parentsError)
    }

    // Fetch current class info from student_classes
    let className: string | undefined
    try {
      const { data: studentClass } = await supabase
        .from("student_classes")
        .select(`
          classes (
            name
          )
        `)
        .eq("student_id", studentId)
        .eq("status", "active")
        .single()

      if (studentClass?.classes) {
        const classesData = studentClass.classes as { name: string } | { name: string }[] | null
        if (classesData && !Array.isArray(classesData)) {
          className = classesData.name
        } else if (Array.isArray(classesData) && classesData.length > 0) {
          className = classesData[0].name
        }
      }
    } catch {
      // Ignore class fetch errors
    }

    return { student, parents: parents || [], className }
  } catch (err) {
    console.error("Error in getStudentById:", err)
    return { student: null, parents: [], className: undefined }
  }
}

// ============================================
// RESET REGISTRATION
// ============================================

/**
 * Reset registration status for all students
 */
export async function resetAllRegistrations(): Promise<{ success: boolean; error?: string }> {
  try {
    // This would reset the tracking fields
    // For now, we just return success as we don't have dedicated tracking fields
    return { success: true }
  } catch (err) {
    console.error("Error resetting registrations:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan",
    }
  }
}
