"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useCharacter, useStudentSearch } from "@/hooks/useCharacter"
import {
  BehaviorCard,
  CategoryGrid,
} from "@/components/poin-karakter"
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Calendar,
  FileText,
  Save,
} from "lucide-react"
import { cn, formatLocalDate } from "@/lib/utils"

type DirectionFilter = "all" | "positive" | "negative"
type Step = "siswa" | "perilaku" | "detail"

interface RecordItem {
  studentId: string
  studentName: string
  studentClass?: string
  behaviorTypeId: string
  date: string
  description?: string
}

export default function CharacterInputPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    behaviors,
    addRecord,
    loading: characterLoading,
  } = useCharacter()
  const { results: searchResults, loading: searchLoading, search } = useStudentSearch()

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>("siswa")
  const steps: { key: Step; label: string; icon: typeof User }[] = [
    { key: "siswa", label: "Pilih Siswa", icon: User },
    { key: "perilaku", label: "Pilih Perilaku", icon: ThumbsUp },
    { key: "detail", label: "Detail & Simpan", icon: FileText },
  ]

  // Selection state
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string
    name: string
    className?: string
  } | null>(null)
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([])
  const [recordDescription, setRecordDescription] = useState("")

  // Filter state
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>("all")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  // Saving state
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Filter behaviors
  const filteredBehaviors = useMemo(() => {
    return behaviors.filter((behavior) => {
      const matchesDirection =
        directionFilter === "all" || behavior.direction === directionFilter
      const matchesCategory =
        !selectedCategoryId || behavior.categoryId === selectedCategoryId
      const matchesSearch =
        !searchQuery ||
        behavior.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesDirection && matchesCategory && matchesSearch
    })
  }, [behaviors, directionFilter, selectedCategoryId, searchQuery])

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#6B7280"
  }

  // Toggle behavior selection
  const toggleBehavior = (behaviorId: string) => {
    setSelectedBehaviors((prev) =>
      prev.includes(behaviorId)
        ? prev.filter((id) => id !== behaviorId)
        : [...prev, behaviorId]
    )
  }

  // Calculate total points
  const totalPoints = useMemo(() => {
    return selectedBehaviors.reduce((sum, id) => {
      const behavior = behaviors.find((b) => b.id === id)
      return sum + (behavior?.pointValue || 0)
    }, 0)
  }, [selectedBehaviors, behaviors])

  // Handle next step
  const handleNextStep = () => {
    const stepOrder: Step[] = ["siswa", "perilaku", "detail"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  // Handle prev step
  const handlePrevStep = () => {
    const stepOrder: Step[] = ["siswa", "perilaku", "detail"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  // Check if can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case "siswa":
        return selectedStudent !== null
      case "perilaku":
        return selectedBehaviors.length > 0
      case "detail":
        return true
      default:
        return false
    }
  }

  // Save records
  const handleSave = async () => {
    if (!selectedStudent || selectedBehaviors.length === 0) return

    setIsSaving(true)

    try {
      // Create a record for each selected behavior
      for (const behaviorId of selectedBehaviors) {
        await addRecord({
          studentId: selectedStudent.id,
          behaviorTypeId: behaviorId,
          date: formatLocalDate(),
          reporterId: user?.id || "system",
          status: "submitted",
          description: recordDescription || undefined,
        })
      }

      setIsSaved(true)
    } catch (err) {
      console.error("Error saving records:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Reset and start over
  const handleStartOver = () => {
    setSelectedStudent(null)
    setSelectedBehaviors([])
    setRecordDescription("")
    setCurrentStep("siswa")
    setIsSaved(false)
  }

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

  // Success state
  if (isSaved) {
    return (
      <AppShell
        title="Input Poin Karakter"
        description="Rekam perilaku siswa untuk poin karakter"
      >
        <div className="max-w-md mx-auto py-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-[var(--success-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h2 className="text-h4 font-semibold text-[var(--text-primary)] mb-2">
              Berhasil!
            </h2>
            <p className="text-[14px] text-[var(--text-muted)] mb-6">
              Catatan poin karakter untuk {selectedStudent?.name} berhasil
              disimpan.
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="success" className="text-[12px]">
                +{selectedBehaviors.filter((id) =>
                  behaviors.find((b) => b.id === id)?.direction === "positive"
                ).length}{" "}
                Positif
              </Badge>
              <Badge variant="danger" className="text-[12px]">
                {selectedBehaviors.filter((id) =>
                  behaviors.find((b) => b.id === id)?.direction === "negative"
                ).length}{" "}
                Negatif
              </Badge>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Button variant="outline" onClick={handleStartOver}>
                Input Lagi
              </Button>
              <Button onClick={() => router.push("/poin-karakter")}>
                Lihat Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="Input Poin Karakter"
      description="Rekam perilaku siswa untuk poin karakter"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const stepIndex = steps.findIndex((s) => s.key === currentStep)
              const isActive = step.key === currentStep
              const isCompleted = index < stepIndex

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-[var(--success)] text-white"
                          : isActive
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[14px] font-medium hidden sm:block",
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 mx-3",
                        index < stepIndex
                          ? "bg-[var(--success)]"
                          : "bg-[var(--surface-hover)]"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Student */}
          {currentStep === "siswa" && (
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-h5 font-semibold text-[var(--text-primary)] mb-1">
                  Pilih Siswa
                </h2>
                <p className="text-[13px] text-[var(--text-muted)]">
                  Cari dan pilih siswa yang akan menerima poin karakter
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Ketik nama atau NISN siswa..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    search(e.target.value)
                  }}
                  className={cn(
                    "w-full h-12 pl-11 pr-4",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "transition-all duration-200"
                  )}
                />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="mt-2 border border-[var(--border-light)] rounded-2xl overflow-hidden bg-white shadow-lg">
                  {searchLoading ? (
                    <div className="p-4 text-center text-[var(--text-muted)] text-[14px]">
                      Mencari...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto p-1">
                      {searchResults.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => {
                            setSelectedStudent(student)
                            setSearchQuery("")
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl",
                            "hover:bg-[var(--surface-hover)]",
                            "transition-colors text-left"
                          )}
                        >
                          <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[13px] font-semibold text-[var(--primary)]">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[var(--text-primary)]">
                              {student.name}
                            </p>
                            <p className="text-[12px] text-[var(--text-muted)]">
                              {student.className}
                              {student.nisn && ` • ${student.nisn}`}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-[var(--text-muted)] text-[14px]">
                      Siswa tidak ditemukan
                    </div>
                  )}
                </div>
              )}

              {/* Selected Student */}
              {selectedStudent && (
                <div className="mt-6 p-4 rounded-xl bg-[var(--success-soft)] border border-[var(--success)]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--success)] text-white flex items-center justify-center text-[14px] font-bold">
                      {selectedStudent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                        {selectedStudent.name}
                      </p>
                      <p className="text-[13px] text-[var(--text-muted)]">
                        {selectedStudent.className}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Step 2: Select Behaviors */}
          {currentStep === "perilaku" && (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-[13px] font-bold">
                      {selectedStudent?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--text-primary)]">
                        {selectedStudent?.name}
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        {selectedBehaviors.length} perilaku dipilih
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-stat-md font-bold",
                      totalPoints >= 0
                        ? "text-[var(--success)]"
                        : "text-[var(--danger)]"
                    )}
                  >
                    {totalPoints >= 0 ? "+" : ""}
                    {totalPoints}
                  </div>
                </div>
              </Card>

              {/* Direction Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-[var(--surface-secondary)] rounded-xl p-1">
                  {[
                    { key: "all" as DirectionFilter, label: "Semua" },
                    { key: "positive" as DirectionFilter, label: "Positif", icon: ThumbsUp },
                    { key: "negative" as DirectionFilter, label: "Negatif", icon: ThumbsDown },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setDirectionFilter(filter.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all",
                        directionFilter === filter.key
                          ? filter.key === "positive"
                            ? "bg-[var(--success)] text-white"
                            : filter.key === "negative"
                            ? "bg-[var(--danger)] text-white"
                            : "bg-white shadow-sm text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      {filter.icon && (
                        <filter.icon className="w-4 h-4" />
                      )}
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategoryId("")}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap",
                    !selectedCategoryId
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  Semua
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap",
                      selectedCategoryId === category.id
                        ? "text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    )}
                    style={
                      selectedCategoryId === category.id
                        ? { backgroundColor: category.color }
                        : undefined
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Cari perilaku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full h-12 pl-11 pr-4",
                    "bg-[var(--surface-primary)]",
                    "border border-[var(--border-default)]",
                    "rounded-[18px]",
                    "text-[15px] text-[var(--text-primary)]",
                    "placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:border-[var(--border-focus)]",
                    "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                    "transition-all duration-200"
                  )}
                />
              </div>

              {/* Behaviors Grid */}
              <div className="max-h-[400px] overflow-y-auto">
                {characterLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : filteredBehaviors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[var(--text-muted)]">
                      Tidak ada perilaku yang sesuai filter
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredBehaviors.map((behavior) => (
                      <BehaviorCard
                        key={behavior.id}
                        behavior={behavior}
                        categoryColor={getCategoryColor(behavior.categoryId)}
                        isSelected={selectedBehaviors.includes(behavior.id)}
                        onClick={() => toggleBehavior(behavior.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Detail & Save */}
          {currentStep === "detail" && (
            <div className="space-y-6">
              {/* Summary */}
              <Card className="p-6">
                <h2 className="text-h5 font-semibold text-[var(--text-primary)] mb-4">
                  Ringkasan Catatan
                </h2>

                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-secondary)]">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-[14px] font-bold">
                      {selectedStudent?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                        {selectedStudent?.name}
                      </p>
                      <p className="text-[13px] text-[var(--text-muted)]">
                        {selectedStudent?.className}
                      </p>
                    </div>
                  </div>

                  {/* Selected Behaviors */}
                  <div className="space-y-2">
                    <h3 className="text-[14px] font-medium text-[var(--text-primary)]">
                      Perilaku yang Dipilih ({selectedBehaviors.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedBehaviors.map((id) => {
                        const behavior = behaviors.find((b) => b.id === id)
                        if (!behavior) return null
                        const isPositive = behavior.direction === "positive"

                        return (
                          <div
                            key={id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl",
                              isPositive
                                ? "bg-[var(--success-soft)]"
                                : "bg-[var(--danger-soft)]"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isPositive ? (
                                <ThumbsUp className="w-4 h-4 text-[var(--success)]" />
                              ) : (
                                <ThumbsDown className="w-4 h-4 text-[var(--danger)]" />
                              )}
                              <span className="text-[14px] text-[var(--text-primary)]">
                                {behavior.name}
                              </span>
                            </div>
                            <Badge
                              variant={isPositive ? "success" : "danger"}
                              className="text-[11px]"
                            >
                              {isPositive ? "+" : ""}
                              {behavior.pointValue}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
                    <div>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        Tanggal Pencatatan
                      </p>
                      <p className="text-[14px] text-[var(--text-primary)]">
                        {formatLocalDate()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-[var(--text-primary)]">
                      Keterangan (Opsional)
                    </label>
                    <textarea
                      placeholder="Tambahkan keterangan atau catatan tambahan..."
                      value={recordDescription}
                      onChange={(e) => setRecordDescription(e.target.value)}
                      className={cn(
                        "w-full min-h-[100px] px-4 py-3",
                        "bg-[var(--surface-primary)]",
                        "border border-[var(--border-default)]",
                        "rounded-[18px]",
                        "text-[15px] text-[var(--text-primary)]",
                        "placeholder:text-[var(--text-muted)]",
                        "focus:outline-none focus:border-[var(--border-focus)]",
                        "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                        "resize-y"
                      )}
                    />
                  </div>

                  {/* Total Points */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-light)]">
                    <span className="text-[14px] font-medium text-[var(--text-primary)]">
                      Total Poin
                    </span>
                    <span
                      className={cn(
                        "text-stat-lg font-bold",
                        totalPoints >= 0
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      )}
                    >
                      {totalPoints >= 0 ? "+" : ""}
                      {totalPoints}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === "siswa"}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {currentStep === "detail" ? (
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Catatan
            </Button>
          ) : (
            <Button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className="gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
