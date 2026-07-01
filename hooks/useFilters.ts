"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Major, Grade } from "@/types/database"

/**
 * Hook untuk mengambil semua majors yang aktif
 */
export function useMajors() {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMajors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("majors")
        .select("*")
        .eq("status", "active")
        .order("name", { ascending: true })

      if (fetchError) throw fetchError
      setMajors(data || [])
    } catch (err) {
      console.error("Error fetching majors:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMajors()
  }, [fetchMajors])

  return { majors, loading, error, refetch: fetchMajors }
}

/**
 * Hook untuk mengambil semua grades yang aktif
 */
export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("grades")
        .select("*")
        .eq("status", "active")
        .order("level", { ascending: true })

      if (fetchError) throw fetchError
      setGrades(data || [])
    } catch (err) {
      console.error("Error fetching grades:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  return { grades, loading, error, refetch: fetchGrades }
}

/**
 * Hook untuk mengambil kelas berdasarkan filter
 */
export function useClasses(filters?: {
  academicYearId?: string
  gradeId?: string
  majorId?: string
}) {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from("classes")
        .select(`
          *,
          grades (*),
          majors (*)
        `)
        .eq("status", "active")

      if (filters?.academicYearId) {
        query = query.eq("academic_year_id", filters.academicYearId)
      }
      if (filters?.gradeId) {
        query = query.eq("grade_id", filters.gradeId)
      }
      if (filters?.majorId) {
        query = query.eq("major_id", filters.majorId)
      }

      const { data, error: fetchError } = await query.order("name", { ascending: true })

      if (fetchError) throw fetchError
      setClasses(data || [])
    } catch (err) {
      console.error("Error fetching classes:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filters?.academicYearId, filters?.gradeId, filters?.majorId])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  return { classes, loading, error, refetch: fetchClasses }
}
