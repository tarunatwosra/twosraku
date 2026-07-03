"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Student, StudentWithClass, StudentFilters, StudentSortOptions } from "@/types/database"

interface UseStudentsReturn {
  students: Student[]
  loading: boolean
  error: Error | null
  count: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

interface UseStudentsOptions {
  page?: number
  perPage?: number
  filters?: StudentFilters
  sort?: StudentSortOptions
}

/**
 * Hook untuk mengambil daftar siswa dengan filter dan pagination
 */
export function useStudents(options: UseStudentsOptions = {}) {
  const { page = 1, perPage = 25, filters = {}, sort = { field: "full_name", direction: "asc" } } = options

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [count, setCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query
      let query = supabase
        .from("students")
        .select("*", { count: "exact" })

      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active)
      }

      if (filters.gender) {
        query = query.eq("gender", filters.gender)
      }

      if (filters.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,student_number.ilike.%${filters.search}%,nickname.ilike.%${filters.search}%`
        )
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === "asc" })

      // Apply pagination
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)

      const { data, error: fetchError, count: totalCount } = await query

      if (fetchError) throw fetchError

      setStudents(data || [])
      setCount(totalCount || 0)
      setTotalPages(Math.ceil((totalCount || 0) / perPage))
    } catch (err) {
      console.error("Error fetching students:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, filters, sort])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return {
    students,
    loading,
    error,
    count,
    page,
    totalPages,
    refetch: fetchStudents,
  }
}

/**
 * Hook untuk mengambil satu siswa berdasarkan ID
 */
export function useStudent(id?: string) {
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setStudent(null)
      setLoading(false)
      return
    }

    const fetchStudent = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from("students")
          .select(`
            *,
            student_classes (
              *,
              classes (
                *,
                grades (*),
                majors (*)
              )
            )
          `)
          .eq("id", id)
          .single()

        if (fetchError) throw fetchError
        setStudent(data)
      } catch (err) {
        console.error("Error fetching student:", err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  return { student, loading, error }
}

/**
 * Hook untuk statistik siswa
 */
export function useStudentStats(academicYearId?: string) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
    prospective: 0,
    transferred: 0,
    graduated: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Total siswa
        const { count: total } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })

        // Berdasarkan status
        const { count: active } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        const { count: prospective } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("status", "prospective")

        const { count: transferred } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("status", "transferred")

        const { count: graduated } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("status", "graduated")

        // Berdasarkan gender
        const { count: male } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("gender", "male")

        const { count: female } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("gender", "female")

        setStats({
          total: total || 0,
          active: active || 0,
          male: male || 0,
          female: female || 0,
          prospective: prospective || 0,
          transferred: transferred || 0,
          graduated: graduated || 0,
        })
      } catch (err) {
        console.error("Error fetching student stats:", err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [academicYearId])

  return { stats, loading, error }
}

/**
 * Hook untuk membuat siswa baru
 */
export function useCreateStudent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createStudent = async (student: Partial<Student>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await supabase
        .from("students")
        .insert(student)
        .select()
        .single()

      if (createError) throw createError
      return data
    } catch (err) {
      console.error("Error creating student:", err)
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createStudent, loading, error }
}

/**
 * Hook untuk update siswa
 */
export function useUpdateStudent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from("students")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (updateError) throw updateError
      return data
    } catch (err) {
      console.error("Error updating student:", err)
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateStudent, loading, error }
}
