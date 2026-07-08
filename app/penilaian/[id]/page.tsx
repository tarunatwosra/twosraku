"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useAssessmentCategory } from "@/hooks/useAssessmentNew"
import {
  InputType,
  ConversionType,
  AssessmentItem,
  AssessmentPeriod,
} from "@/types/assessment"
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Calendar,
  Target,
  Save,
  Layers,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// HELPER COMPONENTS - Following Buku Induk Patterns
// ============================================

function InfoItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-[14px] text-[var(--text-primary)] font-medium">
        {value || "-"}
      </p>
    </div>
  )
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: AssessmentItem
  onEdit: () => void
  onDelete: () => void
}) {
  const getConversionLabel = (conversionType: ConversionType, conversionValue?: string) => {
    switch (conversionType) {
      case "direct":
        return "Langsung"
      case "multiply":
        return `× ${conversionValue || "?"}`
      case "lookup_table":
        return "Tabel"
      default:
        return "-"
    }
  }

  return (
    <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-transparent hover:border-[var(--border-light)] transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              {item.name}
            </h3>
            {item.isRequired && (
              <span className="px-1.5 py-0.5 text-[10px] bg-red-50 text-red-500 rounded font-medium">
                Wajib
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Target className="w-3 h-3" />
              {item.inputType}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calculator className="w-3 h-3" />
              {getConversionLabel(item.conversionType, item.conversionValue)}
            </span>
            <span>Skor: {item.scoreMin}-{item.scoreMax}</span>
            <span>Bobot: {item.weight}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="w-8 h-8 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="w-8 h-8 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function PeriodCard({
  period,
  index,
  categoryColor,
  categoryId,
  onEdit,
  onDelete,
}: {
  period: AssessmentPeriod
  index: number
  categoryColor: string
  categoryId: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-transparent hover:border-[var(--border-light)] transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-bold shadow-sm"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          >
            {index + 1}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              {period.periodName}
            </h3>
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                Bobot: {period.weightPercentage}%
              </span>
              {period.startDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(period.startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/penilaian/${categoryId}/${period.id}`}>
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              Input
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="w-8 h-8 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function WeightProgressBar({
  totalWeight,
}: {
  totalWeight: number
}) {
  const isValid = totalWeight === 100

  return (
    <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wide">
          Total Bobot
        </span>
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className={cn(
            "text-[14px] font-bold",
            isValid ? "text-emerald-600" : "text-amber-600"
          )}>
            {totalWeight}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            isValid ? "bg-emerald-500" : "bg-amber-500"
          )}
          style={{ width: `${Math.min(totalWeight, 100)}%` }}
        />
      </div>
      {!isValid && (
        <p className="text-[11px] text-amber-600 mt-2">
          Total bobot harus = 100%
        </p>
      )}
    </div>
  )
}

// ============================================
// CATEGORY DETAIL PAGE
// ============================================

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    category,
    items,
    periods,
    totalPeriodWeight,
    loading,
    createItem,
    updateItem,
    deleteItem,
    createPeriod,
    updatePeriod,
    deletePeriod,
    refresh,
  } = useAssessmentCategory(categoryId)

  // Modal states
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState<AssessmentItem | null>(null)
  const [itemModalLoading, setItemModalLoading] = useState(false)

  const [showPeriodModal, setShowPeriodModal] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<AssessmentPeriod | null>(null)
  const [periodModalLoading, setPeriodModalLoading] = useState(false)

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    inputType: "number" as InputType,
    conversionType: "direct" as ConversionType,
    conversionValue: "",
    scoreMin: 0,
    scoreMax: 100,
    weight: 25,
    isRequired: true,
  })

  // Period form state
  const [periodForm, setPeriodForm] = useState({
    periodName: "",
    startDate: "",
    endDate: "",
    weightPercentage: 25,
  })

  // Input type options
  const inputTypeOptions: { value: InputType; label: string; description: string }[] = [
    { value: "number", label: "Angka", description: "Input langsung angka" },
    { value: "count", label: "Jumlah", description: "Jumlah push up, sit up, dll" },
    { value: "time", label: "Waktu", description: "Input waktu (12:30)" },
    { value: "percentage", label: "Persen", description: "Input persentase (0-100)" },
    { value: "boolean", label: "Ya/Tidak", description: "Input Ya atau Tidak" },
  ]

  // Conversion type options
  const conversionTypeOptions: { value: ConversionType; label: string; description: string }[] = [
    { value: "direct", label: "Langsung", description: "Nilai = input" },
    { value: "multiply", label: "Kalikan", description: "Nilai = input × konstanta" },
    { value: "lookup_table", label: "Tabel Konversi", description: "Nilai = lihat di tabel" },
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Open item modal
  const handleOpenItemModal = (item?: AssessmentItem) => {
    if (item) {
      setEditingItem(item)
      setItemForm({
        name: item.name,
        description: item.description || "",
        inputType: item.inputType,
        conversionType: item.conversionType,
        conversionValue: item.conversionValue || "",
        scoreMin: item.scoreMin,
        scoreMax: item.scoreMax,
        weight: item.weight,
        isRequired: item.isRequired,
      })
    } else {
      setEditingItem(null)
      setItemForm({
        name: "",
        description: "",
        inputType: "number",
        conversionType: "direct",
        conversionValue: "",
        scoreMin: 0,
        scoreMax: 100,
        weight: 25,
        isRequired: true,
      })
    }
    setShowItemModal(true)
  }

  // Handle item submit
  const handleItemSubmit = async () => {
    if (!itemForm.name.trim()) {
      alert("Nama item wajib diisi")
      return
    }

    setItemModalLoading(true)
    try {
      let result
      if (editingItem) {
        result = await updateItem(editingItem.id, {
          name: itemForm.name,
          description: itemForm.description || undefined,
          inputType: itemForm.inputType,
          conversionType: itemForm.conversionType,
          conversionValue: itemForm.conversionValue || undefined,
          scoreMin: itemForm.scoreMin,
          scoreMax: itemForm.scoreMax,
          weight: itemForm.weight,
          isRequired: itemForm.isRequired,
        })
      } else {
        result = await createItem({
          name: itemForm.name,
          description: itemForm.description || undefined,
          inputType: itemForm.inputType,
          conversionType: itemForm.conversionType,
          conversionValue: itemForm.conversionValue || undefined,
          scoreMin: itemForm.scoreMin,
          scoreMax: itemForm.scoreMax,
          weight: itemForm.weight,
          isRequired: itemForm.isRequired,
          displayOrder: items.length,
        })
      }

      if (result.success) {
        setShowItemModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan item")
      }
    } finally {
      setItemModalLoading(false)
    }
  }

  // Handle delete item
  const handleDeleteItem = async (item: AssessmentItem) => {
    if (!confirm(`Yakin ingin menghapus item "${item.name}"?`)) return
    await deleteItem(item.id)
  }

  // Open period modal
  const handleOpenPeriodModal = (period?: AssessmentPeriod) => {
    if (period) {
      setEditingPeriod(period)
      setPeriodForm({
        periodName: period.periodName,
        startDate: period.startDate?.split("T")[0] || "",
        endDate: period.endDate?.split("T")[0] || "",
        weightPercentage: period.weightPercentage,
      })
    } else {
      setEditingPeriod(null)
      setPeriodForm({
        periodName: "",
        startDate: "",
        endDate: "",
        weightPercentage: 25,
      })
    }
    setShowPeriodModal(true)
  }

  // Handle period submit
  const handlePeriodSubmit = async () => {
    if (!periodForm.periodName.trim()) {
      alert("Nama periode wajib diisi")
      return
    }

    if (periodForm.weightPercentage <= 0) {
      alert("Bobot harus lebih dari 0")
      return
    }

    setPeriodModalLoading(true)
    try {
      let result
      if (editingPeriod) {
        result = await updatePeriod(editingPeriod.id, {
          periodName: periodForm.periodName,
          startDate: periodForm.startDate || undefined,
          endDate: periodForm.endDate || undefined,
          weightPercentage: periodForm.weightPercentage,
        })
      } else {
        result = await createPeriod({
          periodName: periodForm.periodName,
          startDate: periodForm.startDate || undefined,
          endDate: periodForm.endDate || undefined,
          weightPercentage: periodForm.weightPercentage,
          periodOrder: periods.length + 1,
        })
      }

      if (result.success) {
        setShowPeriodModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan periode")
      }
    } finally {
      setPeriodModalLoading(false)
    }
  }

  // Handle delete period
  const handleDeletePeriod = async (period: AssessmentPeriod) => {
    if (!confirm(`Yakin ingin menghapus periode "${period.periodName}"?`)) return
    await deletePeriod(period.id)
  }

  // Show loading while checking auth
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

  if (!isAuthenticated || !category) {
    return null
  }

  const categoryColor = category.color || "#6B7280"

  return (
    <AppShell
      title={category.name}
      description={category.description || "Kelola item dan periode penilaian"}
    >
      <div className="space-y-6">
        {/* Header - Elevated Card with Gradient */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/penilaian">
              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              {/* Category Avatar */}
              <Avatar
                fallback={category.name}
                className="w-14 h-14"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">
                    {category.name}
                  </h1>
                  <Badge
                    variant={category.status === "active" ? "success" : "secondary"}
                    className={cn(
                      "text-[10px] font-semibold rounded-full",
                      category.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}
                  >
                    {category.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weight Warning/Success Card */}
        {periods.length > 0 && (
          <WeightProgressBar totalWeight={totalPeriodWeight} />
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items Section */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            {/* Gradient decoration */}
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"
              style={{ backgroundColor: categoryColor }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[var(--text-primary)]">
                      Item Penilaian
                    </h2>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {items.length} item
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenItemModal()} className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
                    Belum ada item
                  </h3>
                  <p className="text-[12px] text-[var(--text-muted)] mb-4">
                    Tambah item untuk mulai penilaian
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleOpenItemModal()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => handleOpenItemModal(item)}
                      onDelete={() => handleDeleteItem(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Periods Section */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            {/* Gradient decoration */}
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"
              style={{ backgroundColor: categoryColor }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[var(--text-primary)]">
                      Periode Penilaian
                    </h2>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {periods.length} periode • {totalPeriodWeight}%
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenPeriodModal()} className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </div>

              {periods.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
                    Belum ada periode
                  </h3>
                  <p className="text-[12px] text-[var(--text-muted)] mb-4">
                    Tambah periode untuk menentukan kapan penilaian dilakukan
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleOpenPeriodModal()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Periode
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {periods.map((period, index) => (
                    <PeriodCard
                      key={period.id}
                      period={period}
                      index={index}
                      categoryColor={categoryColor}
                      categoryId={categoryId}
                      onEdit={() => handleOpenPeriodModal(period)}
                      onDelete={() => handleDeletePeriod(period)}
                    />
                  ))}

                  {/* Weight Progress */}
                  <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                    <WeightProgressBar totalWeight={totalPeriodWeight} />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[var(--border-light)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {editingItem ? "Edit Item" : "Item Baru"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowItemModal(false)}
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
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Contoh: Push Up"
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Deskripsi
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Deskripsi item..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-none transition-all"
                />
              </div>

              {/* Input Type */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Tipe Input
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {inputTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setItemForm({ ...itemForm, inputType: opt.value })}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        itemForm.inputType === opt.value
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--border-light)] hover:border-[var(--primary)]"
                      )}
                    >
                      <p className="text-[13px] font-medium text-[var(--text-primary)]">
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversion Type */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Tipe Konversi
                </label>
                <select
                  value={itemForm.conversionType}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      conversionType: e.target.value as ConversionType,
                    })
                  }
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                >
                  {conversionTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conversion Value (for multiply) */}
              {itemForm.conversionType === "multiply" && (
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Nilai Pengali
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={itemForm.conversionValue}
                    onChange={(e) => setItemForm({ ...itemForm, conversionValue: e.target.value })}
                    placeholder="Contoh: 2.5"
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Nilai = Input × {itemForm.conversionValue || "?"}
                  </p>
                </div>
              )}

              {/* Conversion Value (for lookup_table) */}
              {itemForm.conversionType === "lookup_table" && (
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Tabel Konversi (JSON)
                  </label>
                  <textarea
                    value={itemForm.conversionValue}
                    onChange={(e) => setItemForm({ ...itemForm, conversionValue: e.target.value })}
                    placeholder='{"10:00": 100, "11:00": 90, "12:00": 80}'
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-none font-mono text-[12px] transition-all"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Format: {"{\"input\": skor, ...}"}
                  </p>
                </div>
              )}

              {/* Score Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Skor Min
                  </label>
                  <input
                    type="number"
                    value={itemForm.scoreMin}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, scoreMin: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Skor Max
                  </label>
                  <input
                    type="number"
                    value={itemForm.scoreMax}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, scoreMax: parseFloat(e.target.value) || 100 })
                    }
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Bobot dalam Periode (%)
                </label>
                <input
                  type="number"
                  value={itemForm.weight}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, weight: parseFloat(e.target.value) || 0 })
                  }
                  min={0}
                  max={100}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Required */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-[var(--surface-secondary)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                <input
                  type="checkbox"
                  checked={itemForm.isRequired}
                  onChange={(e) => setItemForm({ ...itemForm, isRequired: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border-light)] text-[var(--primary)] focus:ring-[var(--primary)]/20"
                />
                <span className="text-[14px] text-[var(--text-primary)]">Item Wajib Diisi</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowItemModal(false)}>
                Batal
              </Button>
              <Button onClick={handleItemSubmit} isLoading={itemModalLoading}>
                <Save className="w-4 h-4 mr-1" />
                {editingItem ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Period Modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[var(--border-light)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {editingPeriod ? "Edit Periode" : "Periode Baru"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowPeriodModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Period Name */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Nama Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={periodForm.periodName}
                  onChange={(e) => setPeriodForm({ ...periodForm, periodName: e.target.value })}
                  placeholder="Contoh: Januari 2026"
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={periodForm.startDate}
                    onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={periodForm.endDate}
                    onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Bobot (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={periodForm.weightPercentage}
                  onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      weightPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  max={100}
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Quick Weight Buttons */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Preset Bobot
                </label>
                <div className="flex gap-2">
                  {[25, 33, 50, 100].map((weight) => (
                    <button
                      key={weight}
                      onClick={() =>
                        setPeriodForm({ ...periodForm, weightPercentage: weight })
                      }
                      className={cn(
                        "px-4 py-2 rounded-full text-[13px] font-medium transition-all",
                        periodForm.weightPercentage === weight
                          ? "bg-[var(--primary)] text-white shadow-md"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      {weight}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowPeriodModal(false)}>
                Batal
              </Button>
              <Button onClick={handlePeriodSubmit} isLoading={periodModalLoading}>
                <Save className="w-4 h-4 mr-1" />
                {editingPeriod ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
