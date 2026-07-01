"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { DashboardStats, AttendanceStats, Activity } from "@/types/database"

interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook untuk mengambil statistik dashboard
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Ambil tahun ajaran aktif
      const { data: academicYear } = await supabase
        .from("academic_years")
        .select("id")
        .eq("is_active", true)
        .single()

      // Ambil semester aktif
      let semesterId = null
      if (academicYear) {
        const { data: semester } = await supabase
          .from("semesters")
          .select("id")
          .eq("academic_year_id", academicYear.id)
          .eq("is_active", true)
          .single()
        semesterId = semester?.id
      }

      // Ambil statistik siswa
      const { count: totalStudents } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })

      const { count: activeStudents } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Ambil statistik kelas
      const { count: totalClasses } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Ambil statistik guru
      const { count: totalTeachers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("role", ["teacher", "homeroom_teacher"])

      // Ambil presensi hari ini
      const today = new Date().toISOString().split("T")[0]
      const { data: todayAttendances } = await supabase
        .from("attendances")
        .select("status")
        .eq("date", today)

      const attendanceStats: AttendanceStats = {
        total: todayAttendances?.length || 0,
        present: todayAttendances?.filter((a) => a.status === "present").length || 0,
        late: todayAttendances?.filter((a) => a.status === "late").length || 0,
        permission: todayAttendances?.filter((a) => a.status === "permission").length || 0,
        sick: todayAttendances?.filter((a) => a.status === "sick").length || 0,
        absent: todayAttendances?.filter((a) => a.status === "absent").length || 0,
        percentage:
          todayAttendances && todayAttendances.length > 0
            ? ((todayAttendances.filter((a) => a.status === "present" || a.status === "late").length /
                todayAttendances.length) *
                100)
            : 0,
      }

      // Ambil recent activities (dari audit logs atau notifikasi)
      const { data: recentActivitiesData } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      const recentActivities: Activity[] =
        recentActivitiesData?.map((n) => ({
          id: n.id,
          type: "system" as const,
          title: n.title,
          description: n.message,
          timestamp: n.created_at,
        })) || []

      // Hitung assessment completion (contoh sederhana)
      const { count: totalSessions } = await supabase
        .from("assessment_sessions")
        .select("*", { count: "exact", head: true })

      const { count: completedSessions } = await supabase
        .from("assessment_sessions")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")

      const assessmentCompletion =
        totalSessions && totalSessions > 0
          ? Math.round(((completedSessions || 0) / totalSessions) * 100)
          : 0

      setStats({
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        totalClasses: totalClasses || 0,
        totalTeachers: totalTeachers || 0,
        attendanceToday: attendanceStats,
        assessmentCompletion,
        recentActivities,
      })
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
