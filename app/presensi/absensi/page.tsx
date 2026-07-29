"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAttendance } from "@/hooks/useAttendance"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ThermometerSun,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

type AttendanceStatus = "present" | "sick" | "permission" | "absent"

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: "success" | "warning" | "info" | "danger"
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("flex-1 min-w-[100px] p-4 rounded-2xl flex flex-col items-center gap-2", colors[color])}>
      <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  )
}

export default function AbsensiMobilePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { classes, date, setDate } = useAttendance()

  const [selectedDate, setSelectedDate] = useState(date)
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedClassName, setSelectedClassName] = useState<string>("")

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Set initial class
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id)
      setSelectedClassName(classes[0].name)
    }
  }, [classes, selectedClassId])

  // Navigate date
  const navigateDate = useCallback((direction: "prev" | "next") => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1))
    const newDate = d.toISOString().split("T")[0]
    setSelectedDate(newDate)
    setDate(newDate)
  }, [selectedDate, setDate])

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format day name
  const formatDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" })
  }

  // Handle take attendance
  const handleTakeAttendance = () => {
    if (selectedClassId) {
      router.push(`/presensi/absensi/input?class=${selectedClassId}&date=${selectedDate}`)
    }
  }

  // Handle class change
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value
    setSelectedClassId(classId)
    const classInfo = classes.find((c) => c.id === classId)
    if (classInfo) {
      setSelectedClassName(classInfo.name)
    }
  }

  // Check if weekend
  const isWeekend = new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6

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
    <div className="min-h-screen bg-[var(--background-primary)] pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Absensi</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Date Navigator */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigateDate("prev")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">
                {formatDayName(selectedDate)}
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setDate(e.target.value)
                }}
                className="absolute opacity-0 pointer-events-none"
              />
            </div>

            <button
              onClick={() => navigateDate("next")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </Card>

        {/* Class Selector */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="flex-1 h-12 px-4 bg-[var(--surface-secondary)] rounded-xl text-[15px] font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "20px",
              }}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Quick Stats - Show demo data for preview */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Hadir"
            value={28}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            label="Alpa"
            value={2}
            icon={<AlertCircle className="w-5 h-5" />}
            color="danger"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Sakit"
            value={1}
            icon={<ThermometerSun className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            label="Izin"
            value={0}
            icon={<FileText className="w-5 h-5" />}
            color="info"
          />
        </div>

        {/* Weekend Warning */}
        {isWeekend && (
          <Card className="p-4 bg-[var(--warning-soft)] border border-[var(--warning)]/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
              <p className="text-sm text-[var(--warning)] font-medium">
                Tidak ada sekolah di hari weekend
              </p>
            </div>
          </Card>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleTakeAttendance}
          disabled={isWeekend}
          className="w-full h-14 text-base font-semibold shadow-md"
        >
          {isWeekend ? "Weekend - Tidak Ada Sekolah" : "Ambil Absensi"}
        </Button>
      </main>
    </div>
  )
}
