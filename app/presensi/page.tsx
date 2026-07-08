"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance, useAttendanceRecap } from "@/hooks/useAttendance"
import { ATTENDANCE_STATUS_CONFIG, type AttendanceStatus } from "@/types/attendance"
import {
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    classId,
    date,
    classes,
    setClass,
    setDate,
  } = useAttendance()
  const { getDailyRecap } = useAttendanceRecap()

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClassId, setSelectedClassId] = useState("")

  // Set initial date from hook
  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Navigate date
  const navigateDate = (direction: "prev" | "next") => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(d.toISOString().split("T")[0])
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Handle take attendance
  const handleTakeAttendance = () => {
    if (selectedClassId) {
      router.push(`/presensi/input?class=${selectedClassId}&date=${selectedDate}`)
    }
  }

  return (
    <AppShell title="Presensi" description="Kelola kehadiran siswa">
      <div className="space-y-6">
        {/* Header Card - Date & Class Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between gap-6">
            {/* Date Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                  className="w-10 h-10 rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3 px-5 py-3 bg-[var(--surface-secondary)] rounded-2xl min-w-[280px]">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-body font-semibold focus:outline-none cursor-pointer"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate("next")}
                  className="w-10 h-10 rounded-xl"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-caption text-[var(--text-muted)]">
                {formatDate(selectedDate)}
              </div>
            </div>

            {/* Class Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-[var(--surface-secondary)] rounded-2xl min-w-[200px]">
                <Users className="w-5 h-5 text-[var(--text-muted)]" />
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-transparent text-[15px] font-medium focus:outline-none cursor-pointer flex-1"
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleTakeAttendance}
                disabled={!selectedClassId}
                className="gap-2 px-6"
              >
                <Plus className="w-4 h-4" />
                Ambil Presensi
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Link href="/presensi/rekap" className="block">
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Rekapitulasi</p>
                    <p className="text-caption text-[var(--text-muted)]">Lihat rekap harian & mingguan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--success-soft)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-body-sm text-[var(--text-muted)]">Hadir Hari Ini</p>
                <p className="text-stat-lg text-[var(--success)]">87%</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--danger-soft)] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[var(--danger)]" />
              </div>
              <div>
                <p className="text-body-sm text-[var(--text-muted)]">Alpha Hari Ini</p>
                <p className="text-stat-lg text-[var(--danger)]">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Attendance by Class */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between">
              <h2 className="text-section-title">
                Presensi per Kelas
              </h2>
              <Link
                href="/presensi/rekap"
                className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-light)]">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/presensi/kelas/${cls.id}`}>
                <div className="flex items-center justify-between p-5 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center group-hover:bg-[var(--primary-soft)] transition-colors">
                      <Users className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {cls.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {cls.major}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <StatusBadge label="H" count={28} color="success" />
                    <StatusBadge label="S" count={2} color="warning" />
                    <StatusBadge label="I" count={1} color="info" />
                    <StatusBadge label="A" count={1} color="danger" />
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Aktivitas Terbaru
          </h2>

          <div className="space-y-3">
            <ActivityItem
              title="Presensi X TKJ 1"
              description="32 siswa - 100% hadir"
              time="08:30"
              icon={<CheckCircle2 className="w-4 h-4 text-[var(--success)]" />}
            />
            <ActivityItem
              title="Presensi XI TKJ 1"
              description="30 siswa - 2 izin"
              time="08:45"
              icon={<AlertCircle className="w-4 h-4 text-[var(--info)]" />}
            />
            <ActivityItem
              title="Presensi XII TKJ 1"
              description="28 siswa - 1 alpha"
              time="09:00"
              icon={<AlertCircle className="w-4 h-4 text-[var(--danger)]" />}
            />
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Status Badge Component
function StatusBadge({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: "success" | "warning" | "info" | "danger"
}) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold", colors[color])}>
      <span>{label}</span>
      <span className="opacity-70">{count}</span>
    </div>
  )
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--surface-secondary)] transition-colors">
      <div className="w-10 h-10 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-caption text-[var(--text-muted)]">{description}</p>
      </div>
      <span className="text-caption text-[var(--text-muted)] font-medium">{time}</span>
    </div>
  )
}
