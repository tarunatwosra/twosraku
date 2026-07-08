"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessmentNew } from "@/hooks/useAssessmentNew"
import { AssessmentFormula, FormulaComponent, DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  Calculator,
  Layers,
  AlertCircle,
  CheckCircle2,
  Save,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// HELPER COMPONENTS - Following Buku Induk Patterns
// ============================================

function FormulaCard({
  formula,
  onEdit,
  onDelete,
}: {
  formula: AssessmentFormula
  onEdit: () => void
  onDelete: () => void
}) {
  const totalWeight = formula.components.reduce((sum, c) => sum + c.weight, 0)
  const isValid = totalWeight === 100

  return (
    <Card variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Gradient decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 flex items-center justify-center shadow-sm">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                  {formula.name}
                </h3>
                <Badge
                  variant={formula.status === "active" ? "success" : "secondary"}
                  className={cn(
                    "text-[10px] font-semibold rounded-full",
                    formula.status === "active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
                  {formula.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
              {formula.description && (
                <p className="text-[12px] text-[var(--text-muted)]">
                  {formula.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit} className="w-9 h-9 rounded-lg">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="w-9 h-9 rounded-lg hover:bg-red-50">
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Components */}
        {formula.components.length > 0 && (
          <div className="space-y-2 mb-4">
            {formula.components.map((component, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {component.type === "category" ? (
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[var(--info-soft)] flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-[var(--info)]" />
                    </div>
                  )}
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">
                    {component.name}
                  </span>
                  {component.type === "module" && (
                    <span className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 bg-[var(--surface-primary)] rounded">
                      Konversi Modul
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[var(--primary)]">
                    {component.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weight Summary */}
        <div className="p-3 bg-[var(--surface-secondary)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wide">
              Total Bobot
            </span>
            <div className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
              <span className={cn(
                "text-[14px] font-bold",
                isValid ? "text-emerald-600" : "text-amber-600"
              )}>
                {totalWeight}%
              </span>
            </div>
          </div>
          <div className="mt-2 w-full h-2 bg-white rounded-full overflow-hidden">
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
      </div>
    </Card>
  )
}

function WeightSummaryCard({
  totalWeight,
}: {
  totalWeight: number
}) {
  const isValid = totalWeight === 100

  return (
    <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[var(--text-primary)] font-medium">
          Total Bobot
        </span>
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
          <span
            className={cn(
              "text-[18px] font-bold",
              isValid ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {totalWeight}%
          </span>
        </div>
      </div>
      {totalWeight !== 100 && (
        <p className="text-[12px] text-amber-600 mt-2">
          Total bobot harus = 100% untuk formula yang valid
        </p>
      )}
    </div>
  )
}

// ============================================
// FORMULA PAGE
// ============================================

export default function FormulaPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    periods,
    formulas,
    conversionRules,
    loading,
    createFormula,
    updateFormula,
    deleteFormula,
    refresh,
  } = useAssessmentNew()

  const [showModal, setShowModal] = useState(false)
  const [editingFormula, setEditingFormula] = useState<AssessmentFormula | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    components: [] as FormulaComponent[],
  })

  // Module options for formula components
  const moduleOptions = [
    { type: "module" as const, module: "attendance", name: "Kehadiran", weight: 0 },
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Open create modal
  const handleCreate = () => {
    setEditingFormula(null)
    setFormData({
      name: "",
      description: "",
      components: [],
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleEdit = (formula: AssessmentFormula) => {
    setEditingFormula(formula)
    setFormData({
      name: formula.name,
      description: formula.description || "",
      components: formula.components || [],
    })
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = async (formula: AssessmentFormula) => {
    if (!confirm(`Yakin ingin menghapus formula "${formula.name}"?`)) return

    const result = await deleteFormula(formula.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus formula")
    }
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Nama formula wajib diisi")
      return
    }

    if (formData.components.length === 0) {
      alert("Minimal harus ada 1 komponen dalam formula")
      return
    }

    const totalWeight = formData.components.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100) {
      alert(`Total bobot harus 100%. Saat ini: ${totalWeight}%`)
      return
    }

    setModalLoading(true)
    try {
      let result
      if (editingFormula) {
        result = await updateFormula(editingFormula.id, {
          name: formData.name,
          description: formData.description || undefined,
          components: formData.components,
        })
      } else {
        result = await createFormula({
          name: formData.name,
          description: formData.description || undefined,
          components: formData.components,
        })
      }

      if (result.success) {
        setShowModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan formula")
      }
    } finally {
      setModalLoading(false)
    }
  }

  // Add component
  const addComponent = (type: "category" | "module", id?: string, module?: string) => {
    let name = ""
    if (type === "category" && id) {
      const cat = categories.find((c) => c.id === id)
      name = cat?.name || "Unknown"
    } else if (type === "module" && module) {
      const mod = moduleOptions.find((m) => m.module === module)
      name = mod?.name || module
    }

    setFormData((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        { type, id, module, name, weight: 0 },
      ],
    }))
  }

  // Update component
  const updateComponent = (index: number, weight: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) =>
        i === index ? { ...c, weight } : c
      ),
    }))
  }

  // Remove component
  const removeComponent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }))
  }

  // Get total weight
  const totalWeight = formData.components.reduce((sum, c) => sum + c.weight, 0)

  // Show loading
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
      title="Formula & Nilai Rapor"
      description="Kelola formula kombinasi dan nilai rapor"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/penilaian">
              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Formula & Nilai Rapor
              </h1>
              <p className="text-[12px] text-[var(--text-muted)]">
                Kombinasikan Nilai Kategori dan modul lain menjadi formula
              </p>
            </div>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Formula Baru
          </Button>
        </div>

        {/* Info Card */}
        <Card variant="soft" padding="md" className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-[var(--info)]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[var(--info)]">Tentang Formula</p>
            <p className="text-[12px] text-[var(--info)] mt-1 leading-relaxed">
              Formula digunakan untuk menggabungkan Nilai Kategori dan data dari modul lain
              (seperti Kehadiran) menjadi satu komponen dalam Nilai Rapor. Total bobot
              semua komponen harus = 100%.
            </p>
          </div>
        </Card>

        {/* Formulas List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} variant="elevated" padding="lg" className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--surface-hover)] rounded-xl" />
                  <div className="flex-1">
                    <div className="w-48 h-5 bg-[var(--surface-hover)] rounded mb-2" />
                    <div className="w-32 h-4 bg-[var(--surface-hover)] rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : formulas.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Calculator className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              Belum ada formula
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
              Buat formula untuk menggabungkan Nilai Kategori menjadi komponen rapor
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Buat Formula
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {formulas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                onEdit={() => handleEdit(formula)}
                onDelete={() => handleDelete(formula)}
              />
            ))}
          </div>
        )}

        {/* Grade Reference */}
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          {/* Gradient decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                  Referensi Grade
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Grade dan rentang nilai yang digunakan
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {DEFAULT_GRADING_SCALE.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface-secondary)] rounded-xl border border-transparent hover:border-[var(--border-light)] transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-sm"
                    style={{ backgroundColor: grade.color }}
                  >
                    {grade.grade}
                  </div>
                  <div className="text-[13px]">
                    <span className="font-medium text-[var(--text-primary)]">{grade.description}</span>
                    <span className="text-[var(--text-muted)] ml-1">
                      ({grade.minScore}-{grade.maxScore})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Formula Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[var(--border-light)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {editingFormula ? "Edit Formula" : "Formula Baru"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
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
                  Nama Formula <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nilai Semester Ganjil"
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi formula..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-none transition-all"
                />
              </div>

              {/* Components */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Komponen Formula <span className="text-red-500">*</span>
                </label>

                {/* Existing Components */}
                {formData.components.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.components.map((component, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-xl"
                      >
                        {component.type === "category" ? (
                          <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                            <Layers className="w-4 h-4 text-[var(--primary)]" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-[var(--info-soft)] flex items-center justify-center">
                            <Calculator className="w-4 h-4 text-[var(--info)]" />
                          </div>
                        )}
                        <span className="flex-1 text-[14px] font-medium text-[var(--text-primary)]">
                          {component.name}
                        </span>
                        <input
                          type="number"
                          value={component.weight}
                          onChange={(e) => updateComponent(index, parseFloat(e.target.value) || 0)}
                          className="w-20 h-9 px-3 text-center bg-white border border-transparent rounded-xl text-[14px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10"
                          min={0}
                          max={100}
                        />
                        <span className="text-[14px] text-[var(--text-muted)]">%</span>
                        <button
                          onClick={() => removeComponent(index)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Component Buttons */}
                <div className="space-y-3">
                  <p className="text-[12px] text-[var(--text-muted)]">Tambah Komponen:</p>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <p className="text-[11px] text-[var(--text-muted)] mb-2 uppercase tracking-wide">
                        Nilai Kategori:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => addComponent("category", cat.id)}
                            className="px-3 py-1.5 text-[12px] bg-[var(--surface-secondary)] rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5"
                          >
                            <Layers className="w-3 h-3" />
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modules */}
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)] mb-2 uppercase tracking-wide">
                      Konversi Modul:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {moduleOptions.map((mod) => (
                        <button
                          key={mod.module}
                          onClick={() => addComponent("module", undefined, mod.module)}
                          className="px-3 py-1.5 text-[12px] bg-[var(--info-soft)] rounded-full hover:bg-[var(--info)] hover:text-white text-[var(--info)] transition-colors flex items-center gap-1.5"
                        >
                          <Calculator className="w-3 h-3" />
                          {mod.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Summary */}
              <WeightSummaryCard totalWeight={totalWeight} />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={modalLoading}
                disabled={totalWeight !== 100}
              >
                <Save className="w-4 h-4 mr-1" />
                {editingFormula ? "Simpan" : "Buat"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
