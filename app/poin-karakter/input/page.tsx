"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useCharacter } from "@/hooks/useCharacter"
import { type CharacterRecord, type RecordStatus, CATEGORY_COLORS } from "@/types/character"
import {
  Plus,
  Search,
  Filter,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Save,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CharacterInputPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { categories, behaviors, addRecord, loading } = useCharacter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBehavior, setSelectedBehavior] = useState<typeof behaviors[0] | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<"positive" | "negative" | "">("")
  const [showBehaviorList, setShowBehaviorList] = useState(false)
  const [records, setRecords] = useState<Omit<CharacterRecord, "id" | "createdAt" | "updatedAt">[]>([])
  const [saving, setSaving] = useState(false)

  // Filter behaviors by category and direction
  const filteredBehaviors = useMemo(() => {
    return behaviors.filter((behavior) => {
      const matchesCategory = !selectedCategory || behavior.categoryId === selectedCategory
      const matchesDirection = !selectedDirection || behavior.direction === selectedDirection
      const matchesSearch = !searchQuery || behavior.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesDirection && matchesSearch
    })
  }, [behaviors, selectedCategory, selectedDirection, searchQuery])

  // Get category name
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Tidak ada"
  }

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#6B7280"
  }

  // Handle select behavior
  const handleSelectBehavior = (behavior: typeof behaviors[0]) => {
    setSelectedBehavior(behavior)
    setShowBehaviorList(false)
  }

  // Add record to list
  const handleAddRecord = () => {
    if (!selectedBehavior) return

    const newRecord: Omit<CharacterRecord, "id" | "createdAt" | "updatedAt"> = {
      studentId: "demo-student",
      behaviorTypeId: selectedBehavior.id,
      date: new Date().toISOString().split("T")[0],
      reporterId: "admin",
      status: "submitted",
    }

    setRecords((prev) => [...prev, newRecord])
    setSelectedBehavior(null)
  }

  // Remove record from list
  const handleRemoveRecord = (index: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== index))
  }

  // Save all records
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const record of records) {
        await addRecord(record)
      }
      setRecords([])
    } finally {
      setSaving(false)
    }
  }

  // Calculate total points
  const totalPoints = useMemo(() => {
    return records.reduce((sum, record) => {
      const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
      return sum + (behavior?.pointValue || 0)
    }, 0)
  }, [records, behaviors])

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
    <AppShell
      title="Input Poin Karakter"
      description="Rekam perilaku siswa untuk poin karakter"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Direction Toggle */}
            <div className="flex items-center gap-1 bg-[var(--surface-secondary)] rounded-[18px] p-1">
              <button
                onClick={() => setSelectedDirection("")}
                className={cn(
                  "px-4 py-2 rounded-[14px] text-[13px] font-medium transition-all",
                  selectedDirection === ""
                    ? "bg-white shadow-sm text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedDirection("positive")}
                className={cn(
                  "px-4 py-2 rounded-[14px] text-[13px] font-medium transition-all gap-1",
                  selectedDirection === "positive"
                    ? "bg-[var(--success)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--success)]"
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                Positif
              </button>
              <button
                onClick={() => setSelectedDirection("negative")}
                className={cn(
                  "px-4 py-2 rounded-[14px] text-[13px] font-medium transition-all gap-1",
                  selectedDirection === "negative"
                    ? "bg-[var(--danger)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--danger)]"
                )}
              >
                <ThumbsDown className="w-4 h-4" />
                Negatif
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {records.length > 0 && (
            <Button onClick={handleSaveAll} isLoading={saving} className="gap-2">
              <Save className="w-4 h-4" />
              Simpan {records.length} Catatan
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Kategori"
            value={categories.length}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="primary"
          />
          <SummaryCard
            title="Jenis Perilaku"
            value={behaviors.length}
            icon={<AlertCircle className="w-5 h-5" />}
            color="info"
          />
          <SummaryCard
            title="Positif"
            value={behaviors.filter((b) => b.direction === "positive").length}
            icon={<ThumbsUp className="w-5 h-5" />}
            color="success"
          />
          <SummaryCard
            title="Negatif"
            value={behaviors.filter((b) => b.direction === "negative").length}
            icon={<ThumbsDown className="w-5 h-5" />}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Behavior Selection */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-light)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Pilih Perilaku
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Klik perilaku untuk menambahkan ke catatan
                </p>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-[var(--border-light)]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Cari perilaku..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
              </div>

              {/* Behavior Grid */}
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {filteredBehaviors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)]">Tidak ada perilaku yang sesuai</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredBehaviors.map((behavior) => {
                      const categoryColor = getCategoryColor(behavior.categoryId)
                      return (
                        <button
                          key={behavior.id}
                          onClick={() => handleSelectBehavior(behavior)}
                          className={cn(
                            "p-4 rounded-xl border transition-all text-left hover:shadow-md",
                            behavior.direction === "positive"
                              ? "border-[var(--success)]/30 hover:border-[var(--success)] hover:bg-[var(--success-soft)]/30"
                              : "border-[var(--danger)]/30 hover:border-[var(--danger)] hover:bg-[var(--danger-soft)]/30"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${categoryColor}20` }}
                            >
                              {behavior.direction === "positive" ? (
                                <ThumbsUp className="w-5 h-5 text-[var(--success)]" />
                              ) : (
                                <ThumbsDown className="w-5 h-5 text-[var(--danger)]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                  {behavior.name}
                                </p>
                                <Badge
                                  variant={behavior.direction === "positive" ? "success" : "danger"}
                                  className="text-[10px]"
                                >
                                  {behavior.pointValue > 0 ? "+" : ""}{behavior.pointValue}
                                </Badge>
                              </div>
                              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                                {behavior.description || getCategoryName(behavior.categoryId)}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Records List */}
          <div>
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Catatan Baru
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      {records.length} perilaku dipilih
                    </p>
                  </div>
                  {records.length > 0 && (
                    <div className={cn(
                      "text-2xl font-bold",
                      totalPoints >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
                    )}>
                      {totalPoints > 0 ? "+" : ""}{totalPoints}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {records.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <p className="text-[var(--text-muted)] text-sm">
                      Pilih perilaku di sebelah untuk menambahkan catatan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((record, index) => {
                      const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
                      const categoryColor = behavior ? getCategoryColor(behavior.categoryId) : "#6B7280"

                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-3 rounded-xl border",
                            behavior?.direction === "positive"
                              ? "border-[var(--success)]/30 bg-[var(--success-soft)]/20"
                              : "border-[var(--danger)]/30 bg-[var(--danger-soft)]/20"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                  {behavior?.name || "Tidak ditemukan"}
                                </p>
                                <Badge
                                  variant={behavior?.direction === "positive" ? "success" : "danger"}
                                  className="text-[11px]"
                                >
                                  {behavior?.pointValue && behavior.pointValue > 0 ? "+" : ""}
                                  {behavior?.pointValue}
                                </Badge>
                              </div>
                              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                                {behavior?.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveRecord(index)}
                              className="w-6 h-6 rounded-full hover:bg-[var(--surface-hover)] flex items-center justify-center"
                            >
                              <X className="w-4 h-4 text-[var(--text-muted)]" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {records.length > 0 && (
                <div className="p-4 border-t border-[var(--border-light)]">
                  <Button
                    onClick={handleSaveAll}
                    isLoading={saving}
                    className="w-full gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Simpan {records.length} Catatan
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "danger" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </Card>
  )
}
