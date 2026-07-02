"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { DashboardStats, AttendanceStats, Activity } from "@/types/database"

interface SpecialUnit {
  id: string
  name: string
  shortName: string
  members: number
}

interface SavingsStats {
  totalSavings: number
  totalDeposits: number
  totalWithdrawals: number
  activeStudents: number
}

interface CharacterStats {
  positivePoints: number
  negativePoints: number
  balance: number
}

interface DashboardStatsExtended extends DashboardStats {
  specialUnits: SpecialUnit[]
  savingsStats: SavingsStats
  characterStats: CharacterStats
  notifications: {
    unread: number
    items: Array<{
      id: string
      type: string
      title: string
      description: string
      time: string
      isRead: boolean
      priority: string
    }>
  }
  announcements: Array<{
    id: string
    title: string
    description: string
    date: string
    priority: string
    isPinned: boolean
  }>
  calendarEvents: Array<{
    id: string
    title: string
    date: string
    type: string
  }>
}

interface UseDashboardStatsReturn {
  stats: DashboardStatsExtended | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook untuk mengambil statistik dashboard
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStatsExtended | null>(null)
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

      // Ambil notifikasi untuk dashboard
      const { data: notificationsData } = await supabase
        .from("notifications")
        .select("*")
        .eq("read_status", false)
        .order("created_at", { ascending: false })
        .limit(10)

      const unreadNotifications = notificationsData?.length || 0

      // Ambil pengumuman
      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Ambil karakter stats (dari character_summaries)
      let positivePoints = 0
      let negativePoints = 0

      if (academicYear) {
        const { data: charStats } = await supabase
          .from("character_summaries")
          .select("positive_points, negative_points")
          .eq("academic_year_id", academicYear.id)

        if (charStats) {
          positivePoints = charStats.reduce((sum, s) => sum + (s.positive_points || 0), 0)
          negativePoints = charStats.reduce((sum, s) => sum + (s.negative_points || 0), 0)
        }
      }

      // Data extended untuk dashboard
      const extendedStats: DashboardStatsExtended = {
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        totalClasses: totalClasses || 0,
        totalTeachers: totalTeachers || 0,
        attendanceToday: attendanceStats,
        assessmentCompletion,
        recentActivities,
        // Special Units - bisa di-extend dari database nanti
        specialUnits: [
          { id: "pasus", name: "Pasukan Khusus", shortName: "PASUS", members: 45 },
          { id: "pmr", name: "Palang Merah Remaja", shortName: "PMR", members: 60 },
          { id: "pramuka", name: "Pramuka", shortName: "PRAMUKA", members: 120 },
          { id: "paskibra", name: "Paskibra", shortName: "PASKIBRA", members: 35 },
          { id: "osis", name: "OSIS", shortName: "OSIS", members: 25 },
          { id: "mpk", name: "MPK", shortName: "MPK", members: 15 },
        ],
        // Savings Stats - placeholder, bisa di-extend dari tabel savings
        savingsStats: {
          totalSavings: 125000000,
          totalDeposits: 85000000,
          totalWithdrawals: 15000000,
          activeStudents: 800,
        },
        // Character Stats
        characterStats: {
          positivePoints,
          negativePoints,
          balance: positivePoints - negativePoints,
        },
        // Notifications
        notifications: {
          unread: unreadNotifications,
          items: (notificationsData || []).map((n) => ({
            id: n.id,
            type: n.type || "system",
            title: n.title,
            description: n.message,
            time: new Date(n.created_at).toLocaleDateString("id-ID"),
            isRead: n.read_status,
            priority: n.priority || "normal",
          })),
        },
        // Announcements
        announcements: (announcementsData || []).map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description || "",
          date: a.created_at,
          priority: a.priority || "normal",
          isPinned: a.is_pinned || false,
        })),
        // Calendar Events
        calendarEvents: [],
      }

      setStats(extendedStats)
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
