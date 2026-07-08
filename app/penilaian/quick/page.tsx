"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useAssessmentNew } from "@/hooks/useAssessmentNew"
import { usePeriodScoring } from "@/hooks/useAssessmentNew"
import { DEFAULT_GRADING_SCALE } from "@/types/assessment"
import { supabase } from "@/lib/supabase"
import {
  Search,
  Layers,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Zap,
  User,
  Calculator,
  ChevronDown,
  Clock,
  Target,
  Edit2,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { InputType, ConversionType } from "@/types/assessment"

// ============================================
// HELPER COMPONENTS
// ============================================

function QuickStat({
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

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPlaceholder(inputType: string): string {
  switch (inputType) {
    case "count": return "cth: 35"
    case "time": return "cth: 12:30"
    case "percentage": return "cth: 85"
    case "boolean": return "Ya/Tidak"
    default: return "Nilai"
  }
}

function getConversionHint(item: any): string {
  switch (item.conversionType) {
    case "direct": return "Langsung"
    case "multiply": return `× ${item.conversionValue || "?"}`
    case "lookup_table": return "Tabel"
    default: return ""
  }
}

// Get grade with full interval (including color)
function getGradeInterval(score: number): { grade: string; color: string; description: string } | null {
  for (const interval of DEFAULT_GRADING_SCALE) {
    if (score >= interval.minScore && score <= interval.maxScore) {
      return { grade: interval.grade, color: interval.color, description: interval.description }
    }
  }
  return null
}

// ============================================
// QUICK SCORE PAGE
// ============================================

export default function QuickScorePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    periods,
    items,
    loading: categoriesLoading,
    refresh,
  } = useAssessmentNew()

  // Selected category, period, and class
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("")
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  // Classes list
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])

  // Get category & period
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const categoryPeriods = periods.filter((p) => p.categoryId === selectedCategoryId)
  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId)
  const categoryItems = items.filter((i) => i.categoryId === selectedCategoryId)

  // If period selected, use period scoring hook
  const {
    students: allStudents,
    scores,
    loading: studentsLoading,
    handleSaveScore,
    getStudentPeriodAverage,
    calculateItemScore,
    refresh: refreshPeriod,
  } = usePeriodScoring(selectedPeriodId || "placeholder", selectedCategoryId || "placeholder")

  // Students filtered by class (separate state for class filtering)
  const [classFilteredStudents, setClassFilteredStudents] = useState<{ id: string; name: string; studentNumber: string }[]>([])

  // Local scores state
  const [localScores, setLocalScores] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Inline item creation state
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [addItemLoading, setAddItemLoading] = useState(false)
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    inputType: "number" as InputType,
    conversionType: "direct" as ConversionType,
    conversionValue: "",
    weight: 25,
  })

  // Fetch classes
  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase
        .from("classes")
        .select("id, name")
        .order("name")
      if (data) {
        setClasses(data.map((c) => ({ id: c.id, name: c.name })))
      }
    }
    fetchClasses()
  }, [])

  // Filter students by class
  const filteredStudents = useMemo(() => {
    let result = selectedClassId ? classFilteredStudents : allStudents

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [allStudents, classFilteredStudents, selectedClassId, searchQuery])

  // Fetch students filtered by class
  useEffect(() => {
    async function fetchStudentsByClass() {
      if (!selectedClassId) {
        setClassFilteredStudents([])
        return
      }

      try {
        // Get students in the selected class
        const { data: studentClasses } = await supabase
          .from("student_classes")
          .select("student_id")
          .eq("class_id", selectedClassId)

        if (studentClasses && studentClasses.length > 0) {
          const studentIds = studentClasses.map((sc) => sc.student_id)

          const { data: studentsData } = await supabase
            .from("students")
            .select("id, full_name, student_number")
            .in("id", studentIds)
            .eq("is_active", true)
            .order("full_name")

          setClassFilteredStudents(
            studentsData?.map((s) => ({
              id: s.id,
              name: s.full_name,
              studentNumber: s.student_number,
            })) || []
          )
        } else {
          setClassFilteredStudents([])
        }
      } catch (err) {
        console.error("Error fetching students by class:", err)
        setClassFilteredStudents([])
      }
    }

    if (selectedClassId && selectedPeriodId) {
      fetchStudentsByClass()
    } else {
      setClassFilteredStudents([])
    }
  }, [selectedClassId, selectedPeriodId])

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

  // Auto-select first category & period if only one exists
  useEffect(() => {
    if (categories.length === 1 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id)
    }
    if (categoryPeriods.length === 1 && !selectedPeriodId) {
      setSelectedPeriodId(categoryPeriods[0].id)
    }
  }, [categories, categoryPeriods, selectedCategoryId, selectedPeriodId])

  // Reset class when period changes
  useEffect(() => {
    setSelectedClassId("")
  }, [selectedPeriodId])

  // Get converted preview
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

  // Handle input change
  const handleInputChange = useCallback((studentId: string, itemId: string, value: string) => {
    const key = `${studentId}-${itemId}`
    setLocalScores((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }, [])

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
      setHasChanges(false)
      refreshPeriod()
    } finally {
      setSaving(false)
    }
  }, [localScores, handleSaveScore, refreshPeriod])

  // Handle add new item
  const handleAddItem = async () => {
    if (!newItemForm.name.trim()) {
      alert("Nama item wajib diisi")
      return
    }
    if (!selectedCategoryId) {
      alert("Pilih kategori terlebih dahulu")
      return
    }

    setAddItemLoading(true)
    try {
      const response = await fetch(`/api/assessment/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selectedCategoryId,
          name: newItemForm.name,
          input_type: newItemForm.inputType,
          conversion_type: newItemForm.conversionType,
          conversion_value: newItemForm.conversionValue || null,
          score_min: 0,
          score_max: 100,
          weight: newItemForm.weight,
          display_order: categoryItems.length,
          is_required: true,
        }),
      })

      if (response.ok) {
        setShowAddItemModal(false)
        setNewItemForm({
          name: "",
          inputType: "number",
          conversionType: "direct",
          conversionValue: "",
          weight: 25,
        })
        refreshPeriod()
      } else {
        alert("Gagal menambahkan item")
      }
    } finally {
      setAddItemLoading(false)
    }
  }

  // Calculate class stats
  const classStats = useMemo(() => {
    const averages = filteredStudents
      .map((s) => getStudentPeriodAverage(s.id))
      .filter((a) => a !== null) as number[]
    if (averages.length === 0) return { average: 0, highest: 0, lowest: 0 }
    return {
      average: averages.reduce((a, b) => a + b, 0) / averages.length,
      highest: Math.max(...averages),
      lowest: Math.min(...averages),
    }
  }, [filteredStudents, getStudentPeriodAverage])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading
  if (authLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const categoryColor = selectedCategory?.color || "#6B7280"

  return (
    <AppShell
      title="Input Nilai Cepat"
      description="Input nilai dengan cepat tanpa setup rumit"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Input Nilai Cepat
              </h1>
              <p className="text-[12px] text-[var(--text-muted)]">
                Langsung input tanpa setup
              </p>
            </div>
          </div>
        </div>

        {/* Category, Period & Class Selection */}
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: categoryColor }}
          />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                <Layers className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h2 className="text-[15px] font-bold text-[var(--text-primary)]">
                Pilih Kategori, Periode & Kelas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Select */}
              <div>
                <label className="text-[11px] font-medium text-[var(--text-muted)] mb-2 block uppercase tracking-wide">
                  Kategori Penilaian
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value)
                    setSelectedPeriodId("")
                  }}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({items.filter((i) => i.categoryId === cat.id).length} item)
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-[12px] text-amber-600 mt-2">
                    ⚠️ Belum ada kategori.{" "}
                    <a href="/penilaian" className="underline">Buat di Pusat Penilaian</a>
                  </p>
                )}
              </div>

              {/* Period Select */}
              <div>
                <label className="text-[11px] font-medium text-[var(--text-muted)] mb-2 block uppercase tracking-wide">
                  Periode Penilaian
                </label>
                <select
                  value={selectedPeriodId}
                  onChange={(e) => setSelectedPeriodId(e.target.value)}
                  disabled={!selectedCategoryId}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all disabled:opacity-50"
                >
                  <option value="">-- Pilih Periode --</option>
                  {categoryPeriods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.periodName} ({period.weightPercentage}%)
                    </option>
                  ))}
                </select>
                {selectedCategoryId && categoryPeriods.length === 0 && (
                  <p className="text-[12px] text-amber-600 mt-2">
                    ⚠️ Belum ada periode.{" "}
                    <a href={`/penilaian/${selectedCategoryId}`} className="underline">
                      Tambah di Detail Kategori
                    </a>
                  </p>
                )}
              </div>

              {/* Class Select */}
              <div>
                <label className="text-[11px] font-medium text-[var(--text-muted)] mb-2 block uppercase tracking-wide">
                  Kelas
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  disabled={!selectedPeriodId}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all disabled:opacity-50"
                >
                  <option value="">Semua Kelas</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Preview */}
            {categoryItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Item yang akan dinilai ({categoryItems.length})
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddItemModal(true)}
                    className="h-7 text-[11px] gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Tambah Item
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-1.5 bg-[var(--surface-secondary)] rounded-full text-[12px] text-[var(--text-secondary)]"
                    >
                      {item.name}
                      {item.conversionType === "multiply" && (
                        <span className="text-[var(--primary)] ml-1">
                          ×{item.conversionValue}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Item Button - Show when no items */}
            {categoryItems.length === 0 && selectedCategoryId && (
              <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                <div className="text-center py-6 px-4 bg-[var(--surface-secondary)] rounded-xl border-2 border-dashed border-[var(--border-light)]">
                  <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-[13px] text-[var(--text-muted)] mb-3">
                    Belum ada item untuk kategori ini
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddItemModal(true)}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Item Baru
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Students Section - Only show if period selected */}
        {selectedPeriodId && (
          <>
            {/* Stats Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <QuickStat
                label="Total Siswa"
                value={filteredStudents.length}
              />
              <QuickStat
                label="Rata-rata"
                value={classStats.average > 0 ? classStats.average.toFixed(1) : "-"}
              />
              <QuickStat
                label="Tertinggi"
                value={classStats.highest > 0 ? classStats.highest.toFixed(1) : "-"}
                variant="success"
              />
              <QuickStat
                label="Terendah"
                value={classStats.lowest > 0 ? classStats.lowest.toFixed(1) : "-"}
                variant="danger"
              />
              <div className="ml-auto">
                {hasChanges && (
                  <Button
                    onClick={handleSaveAll}
                    isLoading={saving}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Semua
                  </Button>
                )}
              </div>
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
            {filteredStudents.length === 0 ? (
              <Card variant="elevated" padding="lg" className="text-center py-12">
                <div className="w-20 h-20 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
                  Belum ada siswa
                </h3>
                <p className="text-[13px] text-[var(--text-muted)]">
                  {selectedClassId
                    ? "Tidak ada siswa di kelas ini"
                    : "Pastikan siswa sudah ditambahkan ke sistem"
                  }
                </p>
              </Card>
            ) : (
              /* Score Table */
              <Card variant="elevated" padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-light)]">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide w-12">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide min-w-[180px]">
                          Nama Siswa
                        </th>
                        {categoryItems.map((item) => (
                          <th key={item.id} className="px-4 py-3 text-center text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide min-w-[120px]">
                            <div>{item.name}</div>
                            <div className="text-[10px] font-normal normal-case mt-0.5">
                              {item.conversionType === "multiply" ? `×${item.conversionValue}` :
                               item.conversionType === "direct" ? "Langsung" : "Tabel"}
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide w-32 bg-amber-50/50">
                          Hasil Kategori
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => {
                        // Calculate average for this student
                        const scoresForStudent = categoryItems.map((item) => {
                          return getConvertedPreview(student.id, item.id)
                        }).filter((s) => s !== null) as number[]

                        const average = scoresForStudent.length > 0
                          ? scoresForStudent.reduce((a, b) => a + b, 0) / scoresForStudent.length
                          : null

                        const grade = average !== null ? getGradeInterval(average) : null

                        return (
                          <tr key={student.id} className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors">
                            <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  fallback={student.name}
                                  className="w-8 h-8 text-[12px] font-bold"
                                />
                                <div>
                                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                    {student.name}
                                  </p>
                                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                                    {student.studentNumber}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {categoryItems.map((item) => {
                              const key = `${student.id}-${item.id}`
                              const rawInput = localScores[key] || ""
                              const convertedPreview = getConvertedPreview(student.id, item.id)

                              return (
                                <td key={item.id} className="px-4 py-3">
                                  <div className="flex flex-col items-center gap-1">
                                    <input
                                      type="text"
                                      value={rawInput}
                                      onChange={(e) => handleInputChange(student.id, item.id, e.target.value)}
                                      placeholder={getPlaceholder(item.inputType)}
                                      className="w-full h-9 px-2.5 bg-[var(--surface-secondary)] border border-transparent rounded-lg text-[13px] focus:outline-none focus:border-[var(--primary)] text-center max-w-[80px]"
                                    />
                                    {convertedPreview !== null && (
                                      <span className="text-[11px] font-medium text-[var(--primary)]">
                                        → {convertedPreview.toFixed(0)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              )
                            })}
                            {/* Results Column */}
                            <td className="px-4 py-3 bg-amber-50/30">
                              <div className="text-center">
                                <p className={cn(
                                  "text-[16px] font-bold",
                                  average !== null ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                                )}>
                                  {average !== null ? average.toFixed(1) : "-"}
                                </p>
                                {grade && (
                                  <Badge
                                    className="mt-1 text-[10px]"
                                    style={{
                                      backgroundColor: `${grade.color}20`,
                                      color: grade.color,
                                      borderColor: `${grade.color}40`,
                                    }}
                                  >
                                    {grade.description}
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Instructions - When no period selected */}
        {!selectedPeriodId && (
          <Card variant="soft" padding="lg" className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              {!selectedCategoryId
                ? "Pilih Kategori Penilaian"
                : "Pilih Periode Penilaian"
              }
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] max-w-md mx-auto">
              {!selectedCategoryId
                ? "Pilih kategori penilaian di atas untuk melihat siswa yang akan dinilai. Item penilaian akan dimuat otomatis."
                : "Pilih periode untuk menampilkan daftar siswa dan item penilaian. Anda bisa langsung mulai menginput nilai."
              }
            </p>
          </Card>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[var(--border-light)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    Tambah Item Baru
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Nama Item <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  placeholder="Contoh: Push Up"
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Input Type */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Tipe Input
                </label>
                <select
                  value={newItemForm.inputType}
                  onChange={(e) => setNewItemForm({ ...newItemForm, inputType: e.target.value as InputType })}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                >
                  <option value="number">Angka Langsung</option>
                  <option value="count">Jumlah (cth: 35 push up)</option>
                  <option value="time">Waktu (cth: 12:30)</option>
                  <option value="percentage">Persentase (0-100)</option>
                  <option value="boolean">Ya/Tidak</option>
                </select>
              </div>

              {/* Conversion Type */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Tipe Konversi
                </label>
                <select
                  value={newItemForm.conversionType}
                  onChange={(e) => setNewItemForm({ ...newItemForm, conversionType: e.target.value as ConversionType })}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                >
                  <option value="direct">Langsung (nilai = input)</option>
                  <option value="multiply">Kalikan (nilai = input × konstanta)</option>
                </select>
              </div>

              {/* Conversion Value (for multiply) */}
              {newItemForm.conversionType === "multiply" && (
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Nilai Pengali
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItemForm.conversionValue}
                    onChange={(e) => setNewItemForm({ ...newItemForm, conversionValue: e.target.value })}
                    placeholder="Contoh: 2.5"
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Nilai = Input × {newItemForm.conversionValue || "?"}
                  </p>
                </div>
              )}

              {/* Weight */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Bobot (%)
                </label>
                <input
                  type="number"
                  value={newItemForm.weight}
                  onChange={(e) => setNewItemForm({ ...newItemForm, weight: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={100}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowAddItemModal(false)}>
                Batal
              </Button>
              <Button onClick={handleAddItem} isLoading={addItemLoading}>
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
