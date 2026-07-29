"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/layout/mobile-shell"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
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

type StatColor = "success" | "warning" | "info" | "danger"

// Status Configuration
const STATUS_CONFIG: { key: string; label: string; value: number; icon: any; color: StatColor }[] = [
  { key: "hadir", label: "Hadir", value: 28, icon: CheckCircle2, color: "success" },
  { key: "sakit", label: "Sakit", value: 1, icon: ThermometerSun, color: "warning" },
  { key: "izin", label: "Izin", value: 0, icon: FileText, color: "info" },
  { key: "alpa", label: "Alpa", value: 2, icon: AlertCircle, color: "danger" },
]

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: StatColor }) {
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

function AbsensiContent() {
  const router = useRouter()
  const { classes, date, setDate } = useAttendance()

  const [selectedDate, setSelectedDate] = useState(date)
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedClassName, setSelectedClassName] = useState<string>("")

  // Set initial class
  if (classes.length > 0 && !selectedClassId) {
    setSelectedClassId(classes[0].id)
    setSelectedClassName(classes[0].name)
  }

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

  // Handle take attendance - redirect to mobile input page
  const handleTakeAttendance = () => {
    if (selectedClassId) {
      router.push(`/mobile/presensi/input?class=${selectedClassId}&date=${selectedDate}`)
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

  return (
    <>
      <main className="px-4 py-4 space-y-4">
        {/* Date Navigator Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigateDate("prev")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
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
              className="flex-1 flex flex-col items-center py-2.5 bg-[var(--primary-soft)] rounded-xl hover:bg-[var(--primary)]/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">
                {formatDayName(selectedDate)}
              </span>
            </button>

            <button
              onClick={() => navigateDate("next")}
              className="w-11 h-11 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </Card>

        {/* Class Selector Card */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] font-medium mb-1 block">
                Pilih Kelas
              </label>
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full h-11 px-3 bg-[var(--surface-secondary)] rounded-lg text-[14px] font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "18px",
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
          <h2 className="text-xs font-medium text-[var(--text-secondary)] mb-2 px-1">
            Statistik Kehadiran
          </h2>
          <div className="grid grid-cols-2 gap-2">
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
        <Card className="p-4 bg-gradient-to-r from-[var(--success-soft)] to-[var(--success)]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--success)] font-medium">Kehadiran</p>
                <p className="text-2xl font-bold text-[var(--success)]">96%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekend Warning */}
        {isWeekend && (
          <Card className="p-3 bg-[var(--warning-soft)] border border-[var(--warning)]/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
              <p className="text-xs text-[var(--warning)] font-medium">
                Tidak ada sekolah di hari weekend
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Fixed Bottom CTA - Adjusted for bottom nav */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-gradient-to-t from-[var(--background-primary)] via-[var(--background-primary)] to-transparent pt-6 px-4 pb-3">
        <Button
          onClick={handleTakeAttendance}
          disabled={isWeekend}
          className={cn(
            "w-full h-12 text-[14px] font-semibold shadow-lg transition-all active:scale-[0.98]",
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
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </>
  )
}

export default function MobileAbsensiPage() {
  return (
    <MobileShell showBottomNav={true}>
      <AbsensiContent />
    </MobileShell>
  )
}
