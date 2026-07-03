"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { AcademicYear, Semester } from "@/types/database"

interface UseAcademicYearReturn {
  academicYear: AcademicYear | null
  semester: Semester | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook untuk mengambil data tahun ajaran dan semester aktif
 */
export function useAcademicYear(): UseAcademicYearReturn {
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null)
  const [semester, setSemester] = useState<Semester | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAcademicYear = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Ambil tahun ajaran aktif
      const { data: ayData, error: ayError } = await supabase
        .from("academic_years")
        .select("*")
        .eq("is_active", true)
        .single()

      if (ayError) throw ayError
      setAcademicYear(ayData)

      if (ayData) {
        // Ambil semester aktif untuk tahun ajaran ini
        const { data: semData, error: semError } = await supabase
          .from("semesters")
          .select("*")
          .eq("academic_year_id", ayData.id)
          .eq("is_active", true)
          .single()

        if (semError && semError.code !== "PGRST116") {
          // PGRST116 = no rows returned, bukan error
          throw semError
        }
        setSemester(semData)
      }
    } catch (err) {
      console.error("Error fetching academic year:", {
        error: err,
      })
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAcademicYear()
  }, [fetchAcademicYear])

  return {
    academicYear,
    semester,
    loading,
    error,
    refetch: fetchAcademicYear,
  }
}

/**
 * Hook untuk mengambil semua tahun ajaran
 */
export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("academic_years")
        .select("*")
        .order("start_date", { ascending: false })

      if (fetchError) throw fetchError
      setAcademicYears(data || [])
    } catch (err) {
      console.error("Error fetching academic years:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { academicYears, loading, error, refetch: fetch }
}

/**
 * Hook untuk mengambil semester berdasarkan tahun ajaran
 */
export function useSemesters(academicYearId?: string) {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!academicYearId) {
      setSemesters([])
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from("semesters")
          .select("*")
          .eq("academic_year_id", academicYearId)
          .order("semester_number", { ascending: true })

        if (fetchError) throw fetchError
        setSemesters(data || [])
      } catch (err) {
        console.error("Error fetching semesters:", err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [academicYearId])

  return { semesters, loading, error }
}
