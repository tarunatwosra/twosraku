/**
 * Classes Management - Supabase Data Layer
 *
 * Fungsi-fungsi untuk CRUD data kelas dan jurusan
 */

import { supabase } from "@/lib/supabase"
import type { Class, Major } from "@/types/database"

// ============================================
// FETCH CLASSES
// ============================================

interface FetchClassesOptions {
  academicYearId?: string
  majorId?: string
  includeInactive?: boolean
}

/**
 * Ambil daftar kelas dengan filter
 */
export async function fetchClasses(
  options: FetchClassesOptions = {}
): Promise<{ data: Class[]; error: string | null }> {
  try {
    let query = supabase
      .from("classes")
      .select(`
        *,
        majors (*)
      `)

    // Only filter by status if includeInactive is not explicitly true
    if (options.includeInactive !== true) {
      query = query.eq("status", "active")
    }

    // Note: academic_year_id filter is commented out as the column may not exist yet
    // if (options.academicYearId) {
    //   query = query.eq("academic_year_id", options.academicYearId)
    // }

    if (options.majorId) {
      query = query.eq("major_id", options.majorId)
    }

    query = query.order("name", { ascending: true })

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
// FETCH SINGLE CLASS
// ============================================

/**
 * Ambil satu kelas berdasarkan ID
 */
export async function fetchClass(
  id: string
): Promise<{ data: Class | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        majors (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching class:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Error fetching class:", err)
    return { data: null, error: "Terjadi kesalahan saat mengambil data kelas" }
  }
}

// ============================================
// CREATE CLASS
// ============================================

interface CreateClassData {
  name: string
  major_id: string
  academic_year_id: string
  room_number?: string
}

/**
 * Buat kelas baru
 */
export async function createClass(
  data: CreateClassData
): Promise<{ success: boolean; class?: Class; error: string | null }> {
  try {
    const { data: newClass, error } = await supabase
      .from("classes")
      .insert({
        name: data.name,
        major_id: data.major_id,
        academic_year_id: data.academic_year_id,
        room_number: data.room_number || null,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating class:", error)
      if (error.code === "23505") {
        return { success: false, error: "Kelas dengan nama ini sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, class: newClass, error: null }
  } catch (err) {
    console.error("Error creating class:", err)
    return { success: false, error: "Terjadi kesalahan saat membuat kelas" }
  }
}

// ============================================
// UPDATE CLASS
// ============================================

interface UpdateClassData {
  name?: string
  major_id?: string
  academic_year_id?: string
  room_number?: string | null
  status?: string
}

/**
 * Update data kelas
 */
export async function updateClass(
  id: string,
  updates: UpdateClassData
): Promise<{ success: boolean; class?: Class; error: string | null }> {
  try {
    const { data: updatedClass, error } = await supabase
      .from("classes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating class:", error)
      if (error.code === "23505") {
        return { success: false, error: "Kelas dengan nama ini sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, class: updatedClass, error: null }
  } catch (err) {
    console.error("Error updating class:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate kelas" }
  }
}

// ============================================
// DELETE CLASS
// ============================================

/**
 * Hapus kelas (soft delete dengan mengubah status)
 */
export async function deleteClass(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: studentClasses, error: checkError } = await supabase
      .from("student_classes")
      .select("id")
      .eq("class_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error checking class students:", checkError)
      return { success: false, error: "Terjadi kesalahan saat mengecek kelas" }
    }

    if (studentClasses && studentClasses.length > 0) {
      const { error } = await supabase
        .from("classes")
        .update({
          status: "inactive",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        console.error("Error deactivating class:", error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    }

    const { error } = await supabase.from("classes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting class:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error deleting class:", err)
    return { success: false, error: "Terjadi kesalahan saat menghapus kelas" }
  }
}

// ============================================
// FETCH MAJORS
// ============================================

/**
 * Ambil semua jurusan (majors)
 */
export async function fetchMajors(): Promise<{ data: Major[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("majors")
      .select("*")
      .eq("status", "active")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching majors:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Error fetching majors:", err)
    return { data: [], error: "Terjadi kesalahan saat mengambil data jurusan" }
  }
}

// ============================================
// CREATE MAJOR
// ============================================

interface CreateMajorData {
  name: string
  code: string
  description?: string
}

/**
 * Buat jurusan baru
 */
export async function createMajor(
  data: CreateMajorData
): Promise<{ success: boolean; major?: Major; error: string | null }> {
  try {
    const { data: newMajor, error } = await supabase
      .from("majors")
      .insert({
        name: data.name,
        code: data.code,
        description: data.description || null,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating major:", error)
      if (error.code === "23505") {
        return { success: false, error: "Kode jurusan sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, major: newMajor, error: null }
  } catch (err) {
    console.error("Error creating major:", err)
    return { success: false, error: "Terjadi kesalahan saat membuat jurusan" }
  }
}

// ============================================
// UPDATE MAJOR
// ============================================

/**
 * Update jurusan
 */
export async function updateMajor(
  id: string,
  updates: Partial<CreateMajorData>
): Promise<{ success: boolean; major?: Major; error: string | null }> {
  try {
    const { data: updatedMajor, error } = await supabase
      .from("majors")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating major:", error)
      if (error.code === "23505") {
        return { success: false, error: "Kode jurusan sudah ada" }
      }
      return { success: false, error: error.message }
    }

    return { success: true, major: updatedMajor, error: null }
  } catch (err) {
    console.error("Error updating major:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate jurusan" }
  }
}

// ============================================
// DELETE MAJOR
// ============================================

/**
 * Hapus jurusan
 */
export async function deleteMajor(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if major has classes
    const { data: classes, error: checkError } = await supabase
      .from("classes")
      .select("id")
      .eq("major_id", id)
      .limit(1)

    if (checkError) {
      return { success: false, error: "Terjadi kesalahan saat mengecek jurusan" }
    }

    if (classes && classes.length > 0) {
      return { success: false, error: "Jurusan masih digunakan oleh kelas" }
    }

    const { error } = await supabase.from("majors").delete().eq("id", id)

    if (error) {
      console.error("Error deleting major:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Error deleting major:", err)
    return { success: false, error: "Terjadi kesalahan saat menghapus jurusan" }
  }
}
