/**
 * Academic Years Management - Supabase Data Layer
 *
 * Fungsi-fungsi untuk CRUD data tahun ajaran dan semester
 */

import { supabase } from "@/lib/supabase"
import type { AcademicYear, Semester } from "@/types/database"

// ============================================
// FETCH ACADEMIC YEARS
// ============================================

/**
 * Ambil semua tahun ajaran
 */
export async function fetchAcademicYears(): Promise<{ data: AcademicYear[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching academic years:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching academic years:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data tahun ajaran" }
  }
}

/**
 * Ambil tahun ajaran aktif
 */
export async function fetchActiveAcademicYear(): Promise<{ data: AcademicYear | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No active academic year found
        return { data: null, error: null }
      }
      console.error("Error fetching active academic year:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Error fetching active academic year:", err)
    return { data: null, error: "Terjadi kesalahan saat mengambil tahun ajaran aktif" }
  }
}

/**
 * Ambil satu tahun ajaran berdasarkan ID
 */
export async function fetchAcademicYear(
  id: string
): Promise<{ data: AcademicYear | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching academic year:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Error fetching academic year:", err)
    return { data: null, error: "Terjadi kesalahan saat mengambil data tahun ajaran" }
  }
}

// ============================================
// CREATE ACADEMIC YEAR
// ============================================

interface CreateAcademicYearData {
  name: string
  start_date: string
  end_date: string
  is_active?: boolean
}

/**
 * Buat tahun ajaran baru
 */
export async function createAcademicYear(
  data: CreateAcademicYearData
): Promise<{ success: boolean; academicYear?: AcademicYear; error: string | null }> {
  try {
    // If this is being set as active, deactivate others first
    if (data.is_active) {
      await supabase
        .from("academic_years")
        .update({ is_active: false })
        .eq("is_active", true)
    }

    const { data: newAcademicYear, error } = await supabase
      .from("academic_years")
      .insert({
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active || false,
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating academic year:", error)
      if (error.code === "23505") {
        return { success: false, error: "Tahun ajaran dengan nama ini sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, academicYear: newAcademicYear, error: null }
  } catch (err) {
    console.error("Error creating academic year:", err)
    return { success: false, error: "Terjadi kesalahan saat membuat tahun ajaran" }
  }
}

// ============================================
// UPDATE ACADEMIC YEAR
// ============================================

interface UpdateAcademicYearData {
  name?: string
  start_date?: string
  end_date?: string
  is_active?: boolean
  is_locked?: boolean
}

/**
 * Update tahun ajaran
 */
export async function updateAcademicYear(
  id: string,
  updates: UpdateAcademicYearData
): Promise<{ success: boolean; academicYear?: AcademicYear; error: string | null }> {
  try {
    // If setting as active, deactivate others first
    if (updates.is_active === true) {
      await supabase
        .from("academic_years")
        .update({ is_active: false })
        .eq("is_active", true)
    }

    const { data: updatedAcademicYear, error } = await supabase
      .from("academic_years")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating academic year:", error)
      if (error.code === "23505") {
        return { success: false, error: "Tahun ajaran dengan nama ini sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, academicYear: updatedAcademicYear, error: null }
  } catch (err) {
    console.error("Error updating academic year:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate tahun ajaran" }
  }
}

/**
 * Set tahun ajaran aktif
 */
export async function setActiveAcademicYear(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Deactivate all first
    const { error: deactivateError } = await supabase
      .from("academic_years")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("is_active", true)

    if (deactivateError) {
      console.error("Error deactivating academic years:", deactivateError)
      return { success: false, error: deactivateError.message }
    }

    // Activate the selected one
    const { error: activateError } = await supabase
      .from("academic_years")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (activateError) {
      console.error("Error activating academic year:", activateError)
      return { success: false, error: activateError.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error setting active academic year:", err)
    return { success: false, error: "Terjadi kesalahan saat mengaktifkan tahun ajaran" }
  }
}

// ============================================
// DELETE ACADEMIC YEAR
// ============================================

/**
 * Hapus tahun ajaran
 */
export async function deleteAcademicYear(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if academic year has related data (classes, students, etc.)
    const { data: classes, error: checkError } = await supabase
      .from("classes")
      .select("id")
      .eq("academic_year_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error checking academic year usage:", checkError)
      return { success: false, error: "Terjadi kesalahan saat mengecek tahun ajaran" }
    }

    if (classes && classes.length > 0) {
      return {
        success: false,
        error: "Tahun ajaran masih digunakan oleh kelas. Hapus atau pindahkan kelas terlebih dahulu.",
      }
    }

    const { error } = await supabase.from("academic_years").delete().eq("id", id)

    if (error) {
      console.error("Error deleting academic year:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error deleting academic year:", err)
    return { success: false, error: "Terjadi kesalahan saat menghapus tahun ajaran" }
  }
}

// ============================================
// FETCH SEMESTERS
// ============================================

/**
 * Ambil semua semester
 */
export async function fetchSemesters(): Promise<{ data: Semester[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("semesters")
      .select("*")
      .order("academic_year_id", { ascending: false })
      .order("semester_number", { ascending: true })

    if (error) {
      console.error("Error fetching semesters:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching semesters:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data semester" }
  }
}

/**
 * Ambil semester berdasarkan tahun ajaran
 */
export async function fetchSemestersByAcademicYear(
  academicYearId: string
): Promise<{ data: Semester[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("semesters")
      .select("*")
      .eq("academic_year_id", academicYearId)
      .order("semester_number", { ascending: true })

    if (error) {
      console.error("Error fetching semesters by academic year:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching semesters by academic year:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data semester" }
  }
}

/**
 * Ambil semester aktif
 */
export async function fetchActiveSemester(): Promise<{ data: Semester | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("semesters")
      .select("*")
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
    return { data: null, error: "Terjadi kesalahan saat mengambil semester aktif" }
  }
}

// ============================================
// CREATE SEMESTER
// ============================================

interface CreateSemesterData {
  academic_year_id: string
  name: string
  semester_number: 1 | 2
  start_date: string
  end_date: string
  is_active?: boolean
}

/**
 * Buat semester baru
 */
export async function createSemester(
  data: CreateSemesterData
): Promise<{ success: boolean; semester?: Semester; error: string | null }> {
  try {
    const { data: newSemester, error } = await supabase
      .from("semesters")
      .insert({
        academic_year_id: data.academic_year_id,
        name: data.name,
        semester_number: data.semester_number,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active || false,
        is_locked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating semester:", error)
      return { success: false, error: error.message }
    }

    return { success: true, semester: newSemester, error: null }
  } catch (err) {
    console.error("Error creating semester:", err)
    return { success: false, error: "Terjadi kesalahan saat membuat semester" }
  }
}

// ============================================
// UPDATE SEMESTER
// ============================================

interface UpdateSemesterData {
  name?: string
  semester_number?: 1 | 2
  start_date?: string
  end_date?: string
  is_active?: boolean
  is_locked?: boolean
}

/**
 * Update semester
 */
export async function updateSemester(
  id: string,
  updates: UpdateSemesterData
): Promise<{ success: boolean; semester?: Semester; error: string | null }> {
  try {
    const { data: updatedSemester, error } = await supabase
      .from("semesters")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating semester:", error)
      return { success: false, error: error.message }
    }

    return { success: true, semester: updatedSemester, error: null }
  } catch (err) {
    console.error("Error updating semester:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate semester" }
  }
}

/**
 * Set semester aktif
 */
export async function setActiveSemester(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Get the semester to find its academic year
    const { data: semester, error: fetchError } = await supabase
      .from("semesters")
      .select("academic_year_id")
      .eq("id", id)
      .single()

    if (fetchError || !semester) {
      return { success: false, error: "Semester tidak ditemukan" }
    }

    // Deactivate all semesters in the same academic year
    await supabase
      .from("semesters")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("academic_year_id", semester.academic_year_id)
      .eq("is_active", true)

    // Activate the selected semester
    const { error: activateError } = await supabase
      .from("semesters")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (activateError) {
      return { success: false, error: activateError.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error setting active semester:", err)
    return { success: false, error: "Terjadi kesalahan saat mengaktifkan semester" }
  }
}
