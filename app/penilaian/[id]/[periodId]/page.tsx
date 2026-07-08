"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { usePeriodScoring } from "@/hooks/useAssessmentNew"
import { useAssessmentNew } from "@/hooks/useAssessmentNew"
import { DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Upload,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  User,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// HELPER COMPONENTS - Following Buku Induk Patterns
// ============================================

function StatPill({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string | number
  variant?: "default" | "success" | "warning" | "danger"
}) {
  const variants = {
    default: "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-600",
  }

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full", variants[variant])}>
      <span className="text-[13px] text-[var(--text-muted)]">{label}:</span>
      <span className="text-[14px] font-bold">{value}</span>
    </div>
  )
}

function StudentCard({
  student,
  avg,
  grade,
  isExpanded,
  onToggle,
  items,
  localScores,
  onInputChange,
  onSaveStudent,
  saving,
  getConvertedPreview,
}: {
  student: { id: string; name: string; studentNumber: string }
  avg: number | null
  grade: string | null
  isExpanded: boolean
  onToggle: () => void
  items: any[]
  localScores: Record<string, string>
  onInputChange: (studentId: string, itemId: string, value: string) => void
  onSaveStudent: (studentId: string) => void
  saving: boolean
  getConvertedPreview: (studentId: string, itemId: string) => number | null
}) {
  const getGradeColor = (g: string | null) => {
    switch (g) {
      case "A":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200"
      case "B":
        return "bg-blue-50 text-blue-600 border border-blue-200"
      case "C":
        return "bg-amber-50 text-amber-600 border border-amber-200"
      case "D":
        return "bg-orange-50 text-orange-600 border border-orange-200"
      case "E":
        return "bg-red-50 text-red-600 border border-red-200"
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200"
    }
  }

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Student Header */}
      <div
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer transition-colors",
          isExpanded ? "bg-[var(--surface-secondary)]" : "hover:bg-[var(--surface-hover)]"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <Avatar
            fallback={student.name}
            className="w-11 h-11 text-[16px] font-bold"
          />
          <div>
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">
              {student.name}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] font-mono">
              {student.studentNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Average Score */}
          <div className="text-right">
            <p className={cn(
              "text-[14px] font-bold",
              avg !== null ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
            )}>
              {avg !== null ? avg.toFixed(1) : "-"}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Rata-rata</p>
          </div>

          {/* Grade Badge */}
          {grade && (
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold",
              getGradeColor(grade)
            )}>
              {grade}
            </div>
          )}

          <ChevronDown
            className={cn(
              "w-5 h-5 text-[var(--text-muted)] transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded Score Inputs */}
      {isExpanded && (
        <div className="border-t border-[var(--border-light)] p-4 bg-[var(--surface-secondary)]/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => {
              const key = `${student.id}-${item.id}`
              const rawInput = localScores[key] || ""
              const convertedPreview = getConvertedPreview(student.id, item.id)

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border border-[var(--border-light)] hover:border-[var(--primary)]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 bg-[var(--surface-secondary)] rounded">
                      {item.weight}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rawInput}
                      onChange={(e) =>
                        onInputChange(student.id, item.id, e.target.value)
                      }
                      placeholder={getPlaceholder(item.inputType)}
                      className="flex-1 h-10 px-3 bg-[var(--surface-secondary)] border border-transparent rounded-xl text-[14px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 text-center transition-all"
                    />
                    {convertedPreview !== null && (
                      <div className="px-3 py-2 bg-[var(--primary-soft)] rounded-xl">
                        <span className="text-[14px] font-bold text-[var(--primary)]">
                          {convertedPreview.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1.5 text-center">
                    {getInputHint(item)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[12px] text-[var(--text-muted)]">Skor: </span>
                <span className="text-[14px] font-bold text-[var(--text-primary)]">
                  {avg !== null ? avg.toFixed(1) : "-"}
                </span>
              </div>
              {grade && (
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[12px] font-bold",
                  getGradeColor(grade)
                )}>
                  Grade: {grade}
                </div>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSaveStudent(student.id)
              }}
              isLoading={saving}
              className="gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

function GradeLegend() {
  return (
    <Card variant="soft" padding="md">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wide">
          Legenda Grade:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {DEFAULT_GRADING_SCALE.map((g) => (
            <div
              key={g.grade}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ backgroundColor: `${g.color}15` }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: g.color }}
              >
                {g.grade}
              </div>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {g.minScore}-{g.maxScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPlaceholder(inputType: string): string {
  switch (inputType) {
    case "count":
      return "Jumlah (cth: 35)"
    case "time":
      return "Waktu (cth: 12:30)"
    case "percentage":
      return "Persen (cth: 85)"
    case "boolean":
      return "Ya/Tidak"
    default:
      return "Nilai"
  }
}

function getInputHint(item: { inputType: string; conversionType: string; conversionValue?: string }): string {
  switch (item.conversionType) {
    case "direct":
      return "Langsung"
    case "multiply":
      return `× ${item.conversionValue || "?"}`
    case "lookup_table":
      return "Tabel konversi"
    default:
      return ""
  }
}

// ============================================
// PERIOD SCORING PAGE
// ============================================

export default function PeriodScoringPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const periodId = params.periodId as string

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    period,
    items,
    scores,
    students,
    loading,
    getStudentPeriodAverage,
    handleSaveScore,
    getGrade,
    calculateItemScore,
    refresh,
  } = usePeriodScoring(periodId, categoryId)

  const { categories, getCategoryById } = useAssessmentNew()
  const category = getCategoryById(categoryId)

  // Local scores state (for optimistic updates)
  const [localScores, setLocalScores] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  // Initialize local scores from existing scores
  useEffect(() => {
    if (scores.length > 0) {
      const newLocalScores: Record<string, string> = {}
      scores.forEach((score) => {
        const key = `${score.studentId}-${score.itemId}`
        newLocalScores[key] = score.rawInput || ""
      })
      setLocalScores(newLocalScores)
    }
  }, [scores])

  // Check for changes
  useEffect(() => {
    const hasLocalChanges = Object.keys(localScores).length > 0
    setHasChanges(hasLocalChanges)
  }, [localScores])

  // Handle input change
  const handleInputChange = useCallback((studentId: string, itemId: string, value: string) => {
    const key = `${studentId}-${itemId}`
    setLocalScores((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }, [])

  // Handle save for a single student
  const handleSaveStudent = useCallback(
    async (studentId: string) => {
      setSaving(true)
      try {
        const studentKeys = Object.keys(localScores).filter((key) => key.startsWith(`${studentId}-`))

        for (const key of studentKeys) {
          const [, itemId] = key.split("-")
          const rawInput = localScores[key]

          if (rawInput !== undefined) {
            await handleSaveScore(studentId, itemId, rawInput)
          }
        }

        refresh()
      } finally {
        setSaving(false)
      }
    },
    [localScores, handleSaveScore, refresh]
  )

  // Handle save all
  const handleSaveAll = useCallback(async () => {
    setSaving(true)
    try {
      for (const key of Object.keys(localScores)) {
        const [studentId, itemId] = key.split("-")
        const rawInput = localScores[key]

        if (rawInput !== undefined && rawInput !== "") {
          await handleSaveScore(studentId, itemId, rawInput)
        }
      }

      refresh()
      setHasChanges(false)
    } finally {
      setSaving(false)
    }
  }, [localScores, handleSaveScore, refresh])

  // Get converted score preview
  const getConvertedPreview = useCallback(
    (studentId: string, itemId: string) => {
      const key = `${studentId}-${itemId}`
      const rawInput = localScores[key]

      if (!rawInput) return null

      const item = items.find((i) => i.id === itemId)
      if (!item) return null

      return calculateItemScore(rawInput, item)
    },
    [localScores, items, calculateItemScore]
  )

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [students, searchQuery])

  // Calculate class statistics
  const classStats = useMemo(() => {
    const averages = students
      .map((s) => getStudentPeriodAverage(s.id))
      .filter((a) => a !== null) as number[]

    if (averages.length === 0) {
      return { average: 0, highest: 0, lowest: 0, count: 0 }
    }

    return {
      average: averages.reduce((sum, a) => sum + a, 0) / averages.length,
      highest: Math.max(...averages),
      lowest: Math.min(...averages),
      count: averages.length,
    }
  }, [students, getStudentPeriodAverage])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !period || !category) {
    return null
  }

  const categoryColor = category.color || "#6B7280"

  return (
    <AppShell
      title={`${category.name} - ${period.periodName}`}
      description="Input nilai siswa"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/penilaian/${categoryId}`}>
              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            {/* Category Avatar */}
            <Avatar
              fallback={category.name}
              icon={<Layers className="w-5 h-5" />}
              className="w-12 h-12"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor
              }}
            />

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-[18px] font-bold text-[var(--text-primary)]">
                  {period.periodName}
                </h1>
                <Badge variant="primary" className="text-[11px]">
                  {students.length} Siswa
                </Badge>
              </div>
              <p className="text-[12px] text-[var(--text-muted)]">{category.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={refresh} className="w-10 h-10 rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <div className="w-px h-6 bg-[var(--border-light)] mx-1" />
            <Button
              onClick={handleSaveAll}
              isLoading={saving}
              disabled={!hasChanges}
              className="gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan Semua
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <StatPill
            label="Rata-rata"
            value={classStats.average > 0 ? classStats.average.toFixed(1) : "-"}
          />
          <StatPill
            label="Tertinggi"
            value={classStats.highest > 0 ? classStats.highest.toFixed(1) : "-"}
            variant="success"
          />
          <StatPill
            label="Terendah"
            value={classStats.lowest > 0 ? classStats.lowest.toFixed(1) : "-"}
            variant="danger"
          />
          <StatPill
            label="Total Siswa"
            value={students.length}
          />
          {hasChanges && (
            <Badge variant="warning" className="gap-1 ml-auto">
              <AlertCircle className="w-3 h-3" />
              Ada perubahan belum disimpan
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cari nama atau nomor siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] transition-all"
          />
        </div>

        {/* Empty State */}
        {students.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              Belum ada siswa
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-4">
              Tambahkan siswa terlebih dahulu
            </p>
          </Card>
        ) : filteredStudents.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[15px] font-medium text-[var(--text-primary)] mb-2">
              Siswa tidak ditemukan
            </h3>
            <p className="text-[13px] text-[var(--text-muted)]">
              Coba ubah kata kunci pencarian
            </p>
          </Card>
        ) : (
          /* Student Cards */
          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const avg = getStudentPeriodAverage(student.id)
              const grade = avg !== null ? getGrade(avg) : null
              const isExpanded = expandedStudent === student.id

              return (
                <StudentCard
                  key={student.id}
                  student={student}
                  avg={avg}
                  grade={grade}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedStudent(isExpanded ? null : student.id)}
                  items={items}
                  localScores={localScores}
                  onInputChange={handleInputChange}
                  onSaveStudent={handleSaveStudent}
                  saving={saving}
                  getConvertedPreview={getConvertedPreview}
                />
              )
            })}
          </div>
        )}

        {/* Grade Legend */}
        <GradeLegend />
      </div>
    </AppShell>
  )
}
