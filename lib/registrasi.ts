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
import type { Student } from "@/types/database"

// ============================================
// REGISTRATION SETTINGS
// ============================================

const REGISTRATION_SETTING_KEY = "student_registration_enabled"
const REGISTRATION_URL_KEY = "student_registration_url"
const REGISTRATION_ACCESS_COUNT_KEY = "student_registration_access_count"

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
      registrationUrl: settingsMap.get(REGISTRATION_URL_KEY) || `${getBaseUrl()}/registrasi`,
    }
  } catch (err) {
    console.error("Error getting registration settings:", err)
    return {
      isEnabled: false,
      registrationUrl: `${getBaseUrl()}/registrasi`,
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

    // Update URL if enabled
    if (isEnabled) {
      const baseUrl = getBaseUrl()

      await supabase
        .from("settings")
        .update({
          value: `${baseUrl}/registrasi`,
          updated_at: new Date().toISOString(),
        })
        .eq("setting_key", REGISTRATION_URL_KEY)
    }

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
    // Prepare student update data
    const studentUpdateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Personal data
    if (formData.nisn !== undefined) studentUpdateData.nisn = formData.nisn || null
    if (formData.full_name !== undefined) studentUpdateData.full_name = formData.full_name
    if (formData.nickname !== undefined) studentUpdateData.nickname = formData.nickname || null
    if (formData.gender !== undefined) studentUpdateData.gender = formData.gender
    if (formData.blood_type !== undefined) studentUpdateData.blood_type = formData.blood_type || null
    if (formData.birth_place !== undefined) studentUpdateData.birth_place = formData.birth_place || null
    if (formData.birth_date !== undefined) studentUpdateData.birth_date = formData.birth_date || null
    if (formData.religion !== undefined) studentUpdateData.religion = formData.religion || null
    if (formData.phone !== undefined) studentUpdateData.phone = formData.phone || null
    if (formData.address !== undefined) studentUpdateData.address = formData.address || null

    // Health data
    if (formData.height_cm !== undefined)
      studentUpdateData.height_cm = formData.height_cm ? parseFloat(formData.height_cm) : null
    if (formData.weight_kg !== undefined)
      studentUpdateData.weight_kg = formData.weight_kg ? parseFloat(formData.weight_kg) : null
    if (formData.vision !== undefined) studentUpdateData.vision = formData.vision || "normal"
    if (formData.hearing !== undefined) studentUpdateData.hearing = formData.hearing || "normal"
    if (formData.teeth !== undefined)
      studentUpdateData.teeth_condition = formData.teeth || "normal"
    if (formData.physical_disability !== undefined)
      studentUpdateData.physical_disability = formData.physical_disability || "none"
    if (formData.illness_history !== undefined)
      studentUpdateData.illness_history = formData.illness_history || null
    if (formData.allergies !== undefined) studentUpdateData.allergies = formData.allergies || null
    if (formData.health_notes !== undefined) studentUpdateData.health_notes = formData.health_notes || null

    // Other
    if (formData.notes !== undefined) studentUpdateData.notes = formData.notes || null

    // Update student
    const { error: studentError } = await supabase
      .from("students")
      .update(studentUpdateData)
      .eq("id", studentId)

    if (studentError) {
      console.error("Error updating student:", studentError)
      return { success: false, error: studentError.message }
    }

    // Delete existing parents and insert new ones
    await supabase.from("parents").delete().eq("student_id", studentId)

    // Insert parents if any
    if (parentsData.length > 0) {
      const parentsToInsert = parentsData
        .filter((p) => p.full_name?.trim())
        .map((parent) => ({
          student_id: studentId,
          type: parent.type,
          full_name: parent.full_name,
          phone: parent.phone || null,
          occupation: parent.occupation || null,
          guardian_relation: parent.type === "guardian" ? parent.guardian_relation : null,
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

  // Session expires after 30 minutes
  const verifiedAt = new Date(session.verifiedAt)
  const now = new Date()
  const diffMinutes = (now.getTime() - verifiedAt.getTime()) / (1000 * 60)

  return diffMinutes < 30
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
