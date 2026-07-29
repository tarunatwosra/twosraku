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
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Status Configuration
const STATUS_CONFIG = [
  { key: "hadir", label: "Hadir", value: 28, icon: CheckCircle2, color: "success" },
  { key: "sakit", label: "Sakit", value: 1, icon: ThermometerSun, color: "warning" },
  { key: "izin", label: "Izin", value: 0, icon: FileText, color: "info" },
  { key: "alpa", label: "Alpa", value: 2, icon: AlertCircle, color: "danger" },
]

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: "success" | "warning" | "info" | "danger" }) {
  const colors = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <div className={cn("p-5 rounded-2xl flex flex-col items-center gap-3", colors[color])}>
      <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm font-medium opacity-80">{label}</span>
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
    <div className="min-h-screen bg-[var(--background-primary)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">Absensi</h1>
            <p className="text-xs text-[var(--text-muted)]">Catat kehadiran siswa</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-5">
        {/* Date Navigator Card */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigateDate("prev")}
              className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <button
              onClick={() => {
                const input = document.createElement("input")
                input.type = "date"
                input.value = selectedDate
                input.onchange = (e) => {
                  setSelectedDate((e.target as HTMLInputElement).value)
                  setDate((e.target as HTMLInputElement).value)
                }
                input.click()
              }}
              className="flex-1 flex flex-col items-center py-2 bg-[var(--primary-soft)] rounded-2xl hover:bg-[var(--primary)]/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                {formatDayName(selectedDate)}
              </span>
            </button>

            <button
              onClick={() => navigateDate("next")}
              className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </Card>

        {/* Class Selector Card */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] font-medium mb-1 block">
                Pilih Kelas
              </label>
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full h-12 px-4 bg-[var(--surface-secondary)] rounded-xl text-[15px] font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
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
          </div>
        </Card>

        {/* Stats Section */}
        <div>
          <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 px-1">
            Statistik Kehadiran
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {STATUS_CONFIG.map((stat) => (
              <StatCard
                key={stat.key}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* Percentage Card */}
        <Card className="p-5 bg-gradient-to-r from-[var(--success-soft)] to-[var(--success)]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--success)] font-medium">Kehadiran</p>
                <p className="text-3xl font-bold text-[var(--success)]">96%</p>
              </div>
            </div>
          </div>
        </Card>

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
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--background-primary)] via-[var(--background-primary)] to-transparent pt-8 px-4 pb-4">
        <Button
          onClick={handleTakeAttendance}
          disabled={isWeekend}
          className={cn(
            "w-full h-14 text-[15px] font-semibold shadow-xl transition-all active:scale-[0.98]",
            isWeekend
              ? "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          )}
        >
          {isWeekend ? (
            "Weekend - Tidak Ada Sekolah"
          ) : (
            <>
              Ambil Absensi
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
