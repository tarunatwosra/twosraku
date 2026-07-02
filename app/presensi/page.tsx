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
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  FileText,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    summary,
    classId,
    date,
    isSubmitted,
    classes,
    loading,
    setClass,
    setDate,
    markAllPresent,
  } = useAttendance()
  const { getDailyRecap } = useAttendanceRecap()

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

  return (
    <AppShell title="Presensi" description="Kelola kehadiran siswa">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/presensi/input">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ambil Presensi
              </Button>
            </Link>
            <Link href="/presensi/rekap">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Lihat Rekap
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Siswa"
            value={summary.totalStudents}
            subtitle="terdaftar"
            icon={<Users className="w-5 h-5" />}
            color="primary"
          />
          <KPICard
            title="Hadir"
            value={summary.present}
            subtitle={`${summary.percentage.toFixed(1)}%`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="success"
          />
          <KPICard
            title="Izin / Sakit"
            value={summary.permission + summary.sick}
            subtitle="dengan izin"
            icon={<AlertCircle className="w-5 h-5" />}
            color="warning"
          />
          <KPICard
            title="Alpha"
            value={summary.absent}
            subtitle="tanpa keterangan"
            icon={<AlertCircle className="w-5 h-5" />}
            color="danger"
          />
        </div>

        {/* Attendance by Class */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
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

          <div className="space-y-3">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/presensi/kelas/${cls.id}`}>
                <div
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer",
                    classId === cls.id
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {cls.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {cls.major}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status="present" count={28} />
                    <StatusBadge status="late" count={2} />
                    <StatusBadge status="absent" count={2} />
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Aktivitas Terbaru
          </h2>

          <div className="space-y-4">
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
              icon={<AlertCircle className="w-4 h-4 text-[var(--warning)]" />}
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

// KPI Card Component
interface KPICardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "danger"
}

function KPICard({ title, value, subtitle, icon, color }: KPICardProps) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
    </Card>
  )
}

// Status Badge Component
function StatusBadge({ status, count }: { status: AttendanceStatus; count: number }) {
  const config = ATTENDANCE_STATUS_CONFIG[status]
  const colors = {
    present: "bg-[var(--success-soft)] text-[var(--success)]",
    late: "bg-[var(--warning-soft)] text-[var(--warning)]",
    permission: "bg-[var(--info-soft)] text-[var(--info)]",
    sick: "bg-[var(--warning-soft)] text-[var(--warning)]",
    absent: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("px-2 py-1 rounded text-xs font-medium", colors[status])}>
      {count} {config.shortLabel}
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
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <span className="text-xs text-[var(--text-muted)]">{time}</span>
    </div>
  )
}
