"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useAssessmentNew } from "@/hooks/useAssessmentNew"
import { AssessmentCategory, AssessmentPeriod, AssessmentFormula, FormulaComponent, DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  MoreVertical,
  Target,
  Layers,
  Calendar,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Play,
  Calculator,
  X,
  BookOpen,
  Zap,
  Copy,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// TEMPLATE PRESETS
// ============================================

interface CategoryTemplate {
  name: string
  description: string
  icon: string
  color: string
  items: {
    name: string
    inputType: InputType
    conversionType: ConversionType
    conversionValue?: string
    weight: number
  }[]
  periods: {
    name: string
    weight: number
  }[]
}

const PRESET_TEMPLATES: CategoryTemplate[] = [
  {
    name: "Jasmani Standar",
    description: "Tes jasmani standar militer",
    icon: "🏃",
    color: "#22C55E",
    items: [
      { name: "Push Up", inputType: "count", conversionType: "multiply", conversionValue: "2.5", weight: 25 },
      { name: "Sit Up", inputType: "count", conversionType: "multiply", conversionValue: "2", weight: 25 },
      { name: "Pull Up", inputType: "count", conversionType: "multiply", conversionValue: "5", weight: 25 },
      { name: "Lari 2.4km", inputType: "time", conversionType: "lookup_table", conversionValue: '{"10:00":100,"11:00":95,"12:00":90,"13:00":85,"14:00":80,"15:00":75,"16:00":70,"17:00":65,"18:00":60,"19:00":55,"20:00":50}', weight: 25 },
    ],
    periods: [
      { name: "Triwulan 1", weight: 25 },
      { name: "Triwulan 2", weight: 25 },
      { name: "Triwulan 3", weight: 25 },
      { name: "Triwulan 4", weight: 25 },
    ],
  },
  {
    name: "PBB Mingguan",
    description: "Pelatihan baris-berbarit mingguan",
    icon: "🎖️",
    color: "#3B82F6",
    items: [
      { name: "Seragam", inputType: "boolean", conversionType: "direct", weight: 20 },
      { name: "Atensi", inputType: "boolean", conversionType: "direct", weight: 20 },
      { name: "Sikap Baris", inputType: "boolean", conversionType: "direct", weight: 20 },
      { name: "Pengetahuan", inputType: "number", conversionType: "direct", weight: 20 },
      { name: "Presensi", inputType: "percentage", conversionType: "direct", weight: 20 },
    ],
    periods: [
      { name: "Minggu 1-4", weight: 25 },
      { name: "Minggu 5-8", weight: 25 },
      { name: "Minggu 9-12", weight: 25 },
      { name: "Minggu 13-16", weight: 25 },
    ],
  },
  {
    name: "Kerajinan Tangan",
    description: "Penilaian kerajinan dan keterampilan",
    icon: "👐",
    color: "#F59E0B",
    items: [
      { name: "Kualitas Produk", inputType: "number", conversionType: "direct", weight: 40 },
      { name: "Ketepatan Waktu", inputType: "number", conversionType: "direct", weight: 30 },
      { name: "Kebersihan", inputType: "number", conversionType: "direct", weight: 30 },
    ],
    periods: [
      { name: "Bulan 1", weight: 33 },
      { name: "Bulan 2", weight: 33 },
      { name: "Bulan 3", weight: 34 },
    ],
  },
]

import { InputType, ConversionType } from "@/types/assessment"

// ============================================
// FORMULA CARD COMPONENT
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

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
                  <span className="text-[14px] font-bold text-purple-600">
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

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card variant="soft" padding="md" className="hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-stat-lg text-[var(--text-primary)]">{value}</p>
          <p className="text-caption text-[var(--text-muted)]">{title}</p>
        </div>
      </div>
    </Card>
  )
}

function CategoryHeaderCard({
  category,
  categoryPeriods,
  categoryItems,
  totalWeight,
  isExpanded,
  onToggle,
  onMenuClick,
  openMenuId,
  onEdit,
  onDelete,
}: {
  category: AssessmentCategory
  categoryPeriods: AssessmentPeriod[]
  categoryItems: any[]
  totalWeight: number
  isExpanded: boolean
  onToggle: () => void
  onMenuClick: (e: React.MouseEvent) => void
  openMenuId: string | null
  onEdit: () => void
  onDelete: () => void
}) {
  const router = useRouter()
  return (
    <Card variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Background gradient decoration */}
      <div
        className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{
          backgroundColor: category.color,
          opacity: 0.08
        }}
      />

      <div
        className={cn(
          "flex items-center justify-between cursor-pointer transition-colors",
          isExpanded && "pb-4"
        )}
        onClick={onToggle}
      >
        <div className="relative flex items-center gap-4 flex-1">
          {/* Avatar dengan warna kategori */}
          <Avatar
            fallback={category.name}
            className="w-14 h-14"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Name & Badge */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                {category.name}
              </h3>
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

            {/* Description */}
            <p className="text-[12px] text-[var(--text-muted)] line-clamp-1">
              {category.description || "Tanpa deskripsi"}
            </p>
          </div>
        </div>

        {/* Quick Stats - Desktop */}
        <div className="hidden md:flex items-center gap-6 mr-4">
          <div className="text-center px-3 py-1.5 bg-[var(--surface-secondary)] rounded-lg">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {categoryPeriods.length}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Periode</p>
          </div>
          <div className="text-center px-3 py-1.5 bg-[var(--surface-secondary)] rounded-lg">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {categoryItems.length}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Item</p>
          </div>
          <div className={cn(
            "text-center px-3 py-1.5 rounded-lg",
            totalWeight === 100 ? "bg-emerald-50" : "bg-amber-50"
          )}>
            <p className={cn(
              "text-lg font-bold",
              totalWeight === 100 ? "text-emerald-600" : "text-amber-600"
            )}>
              {totalWeight}%
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Bobot</p>
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/penilaian/${category.id}`)}
            className="w-10 h-10 rounded-xl hover:bg-[var(--primary-soft)]"
          >
            <Settings2 className="w-4 h-4 text-[var(--primary)]" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="w-10 h-10 rounded-xl"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {openMenuId === category.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => {}} />
                <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-[var(--border-light)]/50 py-2 z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <button
                    onClick={onEdit}
                    className="w-full px-4 py-2.5 text-left text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-3"
                  >
                    <Edit2 className="w-4 h-4 text-[var(--primary)]" />
                    Edit
                  </button>
                  <div className="h-px bg-[var(--border-light)]/60 my-1" />
                  <button
                    onClick={onDelete}
                    className="w-full px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>

          <ChevronDown
            className={cn(
              "w-5 h-5 text-[var(--text-muted)] transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[var(--border-light)] pt-4 mt-2 space-y-4">
          {/* Periods Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Periode Penilaian
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/penilaian/${category.id}`)
                }}
                className="text-[12px]"
              >
                <Plus className="w-3 h-3 mr-1" />
                Tambah
              </Button>
            </div>

            {categoryPeriods.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoryPeriods.map((period, idx) => (
                  <Link
                    key={period.id}
                    href={`/penilaian/${category.id}/${period.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "p-3 bg-[var(--surface-secondary)] rounded-xl border border-transparent",
                      "hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all",
                      "flex items-center justify-between group"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[13px] font-bold text-[var(--primary)] shadow-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--text-primary)]">
                          {period.periodName}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {period.weightPercentage}%
                        </p>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-dashed border-[var(--border)] text-center">
                <p className="text-[12px] text-[var(--text-muted)]">
                  Belum ada periode.{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/penilaian/${category.id}`)
                    }}
                    className="text-[var(--primary)] hover:underline"
                  >
                    Tambah periode
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Items Preview */}
          <div>
            <h4 className="text-[13px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" />
              Item Penilaian
            </h4>

            {categoryItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categoryItems.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="px-3 py-1.5 bg-[var(--surface-secondary)] rounded-full text-[12px] text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-light)] transition-colors"
                  >
                    {item.name}
                  </div>
                ))}
                {categoryItems.length > 8 && (
                  <div className="px-3 py-1.5 text-[12px] text-[var(--text-muted)]">
                    +{categoryItems.length - 8} lagi
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-dashed border-[var(--border)] text-center">
                <p className="text-[12px] text-[var(--text-muted)]">
                  Belum ada item.{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/penilaian/${category.id}`)
                    }}
                    className="text-[var(--primary)] hover:underline"
                  >
                    Tambah item
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Weight Warning */}
          {categoryPeriods.length > 0 && totalWeight !== 100 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <p className="text-[13px] text-amber-700">
                Total bobot periode ({totalWeight}%) belum mencapai 100%
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ============================================
// MAIN PAGE - Assessment Center
// ============================================

export default function AssessmentCenterPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    periods,
    items,
    formulas,
    statistics,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    createFormula,
    updateFormula,
    deleteFormula,
    refresh,
  } = useAssessmentNew()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssessmentCategory | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Formula modal state
  const [showFormulaModal, setShowFormulaModal] = useState(false)
  const [editingFormula, setEditingFormula] = useState<AssessmentFormula | null>(null)
  const [formulaModalLoading, setFormulaModalLoading] = useState(false)
  const [formulaFormData, setFormulaFormData] = useState({
    name: "",
    description: "",
    components: [] as FormulaComponent[],
  })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6B7280",
    status: "active" as "active" | "inactive",
  })

  // Template selection state (for new categories only)
  const [selectedTemplate, setSelectedTemplate] = useState<CategoryTemplate | null>(null)
  const [showTemplateSection, setShowTemplateSection] = useState(true)

  // Need to expose createItem and createPeriod from useAssessmentNew
  // For now, we'll create them after category is created

  const colorOptions = [
    "#3B82F6", // Blue
    "#22C55E", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#F97316", // Orange
  ]

  // Module options for formula components
  const moduleOptions = [
    { type: "module" as const, module: "attendance", name: "Kehadiran", weight: 0 },
  ]

  // Formula handlers
  const handleCreateFormula = () => {
    setEditingFormula(null)
    setFormulaFormData({
      name: "",
      description: "",
      components: [],
    })
    setShowFormulaModal(true)
  }

  const handleEditFormula = (formula: AssessmentFormula) => {
    setEditingFormula(formula)
    setFormulaFormData({
      name: formula.name,
      description: formula.description || "",
      components: formula.components || [],
    })
    setShowFormulaModal(true)
  }

  const handleDeleteFormula = async (formula: AssessmentFormula) => {
    if (!confirm(`Yakin ingin menghapus formula "${formula.name}"?`)) return
    const result = await deleteFormula(formula.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus formula")
    }
  }

  const handleFormulaSubmit = async () => {
    if (!formulaFormData.name.trim()) {
      alert("Nama formula wajib diisi")
      return
    }
    if (formulaFormData.components.length === 0) {
      alert("Minimal harus ada 1 komponen dalam formula")
      return
    }
    const totalWeight = formulaFormData.components.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100) {
      alert(`Total bobot harus 100%. Saat ini: ${totalWeight}%`)
      return
    }

    setFormulaModalLoading(true)
    try {
      let result
      if (editingFormula) {
        result = await updateFormula(editingFormula.id, {
          name: formulaFormData.name,
          description: formulaFormData.description || undefined,
          components: formulaFormData.components,
        })
      } else {
        result = await createFormula({
          name: formulaFormData.name,
          description: formulaFormData.description || undefined,
          components: formulaFormData.components,
        })
      }
      if (result.success) {
        setShowFormulaModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan formula")
      }
    } finally {
      setFormulaModalLoading(false)
    }
  }

  const addFormulaComponent = (type: "category" | "module", id?: string, module?: string) => {
    let name = ""
    if (type === "category" && id) {
      const cat = categories.find((c) => c.id === id)
      name = cat?.name || "Unknown"
    } else if (type === "module" && module) {
      const mod = moduleOptions.find((m) => m.module === module)
      name = mod?.name || module
    }
    setFormulaFormData((prev) => ({
      ...prev,
      components: [...prev.components, { type, id, module, name, weight: 0 }],
    }))
  }

  const updateFormulaComponent = (index: number, weight: number) => {
    setFormulaFormData((prev) => ({
      ...prev,
      components: prev.components.map((c, i) => (i === index ? { ...c, weight } : c)),
    }))
  }

  const removeFormulaComponent = (index: number) => {
    setFormulaFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }))
  }

  const totalFormulaWeight = formulaFormData.components.reduce((sum, c) => sum + c.weight, 0)

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || cat.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Get periods for a category
  const getCategoryPeriods = useCallback(
    (categoryId: string) => periods.filter((p) => p.categoryId === categoryId),
    [periods]
  )

  // Get items for a category
  const getCategoryItems = useCallback(
    (categoryId: string) => items.filter((i) => i.categoryId === categoryId),
    [items]
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Open create modal
  const handleCreate = () => {
    setEditingCategory(null)
    setSelectedTemplate(null)
    setShowTemplateSection(true)
    setFormData({
      name: "",
      description: "",
      color: "#6B7280",
      status: "active",
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleEdit = (category: AssessmentCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#6B7280",
      status: category.status,
    })
    setShowModal(true)
    setOpenMenuId(null)
  }

  // Handle delete
  const handleDelete = async (category: AssessmentCategory) => {
    if (!confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) return

    const result = await deleteCategory(category.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus kategori")
    }
    setOpenMenuId(null)
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Nama kategori wajib diisi")
      return
    }

    setModalLoading(true)
    try {
      let result

      // Create or update category
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          status: formData.status,
        })
      } else {
        result = await createCategory({
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          status: formData.status,
        })
      }

      if (result.success) {
        // If creating new category with template, create items and periods
        if (!editingCategory && selectedTemplate) {
          const categoryId = result.data?.id
          if (categoryId) {
            // Create items from template
            for (const item of selectedTemplate.items) {
              await fetch(`/api/assessment/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category_id: categoryId,
                  name: item.name,
                  input_type: item.inputType,
                  conversion_type: item.conversionType,
                  conversion_value: item.conversionValue,
                  score_min: 0,
                  score_max: 100,
                  weight: item.weight,
                  display_order: selectedTemplate.items.indexOf(item),
                  is_required: true,
                }),
              })
            }

            // Create periods from template
            for (const period of selectedTemplate.periods) {
              await fetch(`/api/assessment/periods`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category_id: categoryId,
                  period_name: period.name,
                  period_order: selectedTemplate.periods.indexOf(period) + 1,
                  weight_percentage: period.weight,
                }),
              })
            }
          }
        }

        setShowModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan kategori")
      }
    } finally {
      setModalLoading(false)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [openMenuId])

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
      title="Pusat Penilaian"
      description="Kelola kategori, periode, dan formula penilaian"
    >
      <div className="space-y-6">
        {/* Header Actions - Pill Style Container */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateFormula} variant="outline" className="gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Formula</span>
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Kategori Baru
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Kategori"
            value={statistics.totalCategories}
            icon={<Layers className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Periode Aktif"
            value={statistics.totalPeriods}
            icon={<Calendar className="w-5 h-5" />}
            color="info"
          />
          <StatCard
            title="Total Item"
            value={statistics.totalItems}
            icon={<Target className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Formula"
            value={statistics.totalFormulas}
            icon={<Calculator className="w-5 h-5" />}
            color="warning"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card variant="soft" padding="md">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStatus("")
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {(selectedStatus || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-[var(--text-muted)]">Filter aktif:</span>
            {searchQuery && (
              <Badge variant="primary" className="cursor-pointer text-[11px]" onClick={() => setSearchQuery("")}>
                "{searchQuery}"
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="primary" className="cursor-pointer text-[11px]" onClick={() => setSelectedStatus("")}>
                {selectedStatus === "active" ? "Aktif" : "Tidak Aktif"}
              </Badge>
            )}
          </div>
        )}

        {/* Categories List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated" padding="lg" className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--surface-hover)] rounded-xl" />
                  <div className="flex-1">
                    <div className="w-48 h-5 bg-[var(--surface-hover)] rounded mb-2" />
                    <div className="w-32 h-4 bg-[var(--surface-hover)] rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Layers className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              {searchQuery || selectedStatus ? "Kategori tidak ditemukan" : "Belum ada kategori"}
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-6">
              {searchQuery || selectedStatus
                ? "Coba ubah filter pencarian"
                : "Mulai dengan membuat kategori penilaian baru"}
            </p>
            {!searchQuery && !selectedStatus && (
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Kategori
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const categoryPeriods = getCategoryPeriods(category.id)
              const categoryItems = getCategoryItems(category.id)
              const isExpanded = expandedCategory === category.id
              const totalWeight = categoryPeriods.reduce((sum, p) => sum + p.weightPercentage, 0)

              return (
                <CategoryHeaderCard
                  key={category.id}
                  category={category}
                  categoryPeriods={categoryPeriods}
                  categoryItems={categoryItems}
                  totalWeight={totalWeight}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedCategory(isExpanded ? null : category.id)}
                  onMenuClick={(e) => {
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === category.id ? null : category.id)
                  }}
                  openMenuId={openMenuId}
                  onEdit={() => handleEdit(category)}
                  onDelete={() => handleDelete(category)}
                />
              )
            })}
          </div>
        )}

        {/* ============================================ */}
        {/* SECTION 2: FORMULA PENILAIAN */}
        {/* ============================================ */}

        {/* Formula Section Header */}
        <div className="flex items-center gap-3 pt-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)]">Formula Penilaian</h2>
            <p className="text-[12px] text-[var(--text-muted)]">Kombinasikan Nilai Kategori menjadi formula</p>
          </div>
        </div>

        {/* Formula Info Card */}
        <Card variant="soft" padding="md" className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--info-soft)] flex items-center justify-center flex-shrink-0">
            <Calculator className="w-4 h-4 text-[var(--info)]" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--info)]">Tentang Formula</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
              Formula digunakan untuk menggabungkan Nilai Kategori dan data dari modul lain
              (seperti Kehadiran) menjadi satu komponen dalam Nilai Rapor. Total bobot = 100%.
            </p>
          </div>
        </Card>

        {/* Formula List */}
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
          <Card variant="elevated" padding="lg" className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Calculator className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">
              Belum ada formula
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] mb-5 max-w-sm mx-auto">
              Buat formula untuk menggabungkan Nilai Kategori menjadi komponen rapor
            </p>
            <Button onClick={handleCreateFormula} className="gap-2">
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
                onEdit={() => handleEditFormula(formula)}
                onDelete={() => handleDeleteFormula(formula)}
              />
            ))}
          </div>
        )}

        {/* Grading Scale Reference - Elevated Card with Gradient */}
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
                  Referensi Sistem Penilaian
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="relative p-6 border-b border-[var(--border-light)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  {editingCategory ? "Edit Kategori" : "Kategori Baru"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Template Selection - Only show for new categories */}
              {showTemplateSection && !editingCategory && (
                <>
                  {/* Template Selection Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">
                        Mulai dari template?
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTemplateSection(false)}
                      className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      Buat manual
                    </button>
                  </div>

                  {/* Template Cards */}
                  <div className="space-y-2">
                    {PRESET_TEMPLATES.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setFormData({
                            ...formData,
                            name: template.name,
                            description: template.description,
                            color: template.color,
                          })
                        }}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all",
                          selectedTemplate?.name === template.name
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-[var(--border-light)] hover:border-[var(--primary)]/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${template.color}20` }}
                          >
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                                {template.name}
                              </span>
                              {selectedTemplate?.name === template.name && (
                                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                              )}
                            </div>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                              {template.items.length} item • {template.periods.length} periode
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.items.slice(0, 3).map((item) => (
                                <span
                                  key={item.name}
                                  className="px-2 py-0.5 bg-white rounded text-[10px] text-[var(--text-secondary)]"
                                >
                                  {item.name}
                                </span>
                              ))}
                              {template.items.length > 3 && (
                                <span className="px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                                  +{template.items.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-light)]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-white text-[11px] text-[var(--text-muted)] uppercase tracking-wide">
                        atau
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Name */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Jasmani Taruna"
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
                  placeholder="Deskripsi singkat..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-none transition-all"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Warna
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        "w-10 h-10 rounded-xl transition-all",
                        formData.color === color
                          ? "ring-2 ring-offset-2 ring-[var(--primary)] scale-110"
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] mb-2 block uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                  }
                  className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-2xl text-[15px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-all"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>

              {/* Template Info - Show when template is selected */}
              {selectedTemplate && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[13px] font-medium text-emerald-700">
                      Template dipilih
                    </span>
                  </div>
                  <p className="text-[12px] text-emerald-600">
                    {selectedTemplate.items.length} item dan {selectedTemplate.periods.length} periode
                    akan dibuat otomatis.
                  </p>
                </div>
              )}

              {/* Back to templates button */}
              {!showTemplateSection && !editingCategory && (
                <button
                  onClick={() => setShowTemplateSection(true)}
                  className="text-[12px] text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Lihat template yang tersedia
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit} isLoading={modalLoading}>
                {editingCategory ? "Simpan" : "Buat"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* FORMULA MODAL */}
      {/* ============================================ */}
      {showFormulaModal && (
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
                  onClick={() => setShowFormulaModal(false)}
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
                  value={formulaFormData.name}
                  onChange={(e) => setFormulaFormData({ ...formulaFormData, name: e.target.value })}
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
                  value={formulaFormData.description}
                  onChange={(e) => setFormulaFormData({ ...formulaFormData, description: e.target.value })}
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
                {formulaFormData.components.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formulaFormData.components.map((component, index) => (
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
                          onChange={(e) => updateFormulaComponent(index, parseFloat(e.target.value) || 0)}
                          className="w-20 h-9 px-3 text-center bg-white border border-transparent rounded-xl text-[14px] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--primary)]/10"
                          min={0}
                          max={100}
                        />
                        <span className="text-[14px] text-[var(--text-muted)]">%</span>
                        <button
                          onClick={() => removeFormulaComponent(index)}
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
                            onClick={() => addFormulaComponent("category", cat.id)}
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
                          onClick={() => addFormulaComponent("module", undefined, mod.module)}
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
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[var(--text-primary)] font-medium">
                    Total Bobot
                  </span>
                  <div className="flex items-center gap-2">
                    {totalFormulaWeight === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <span
                      className={cn(
                        "text-[18px] font-bold",
                        totalFormulaWeight === 100 ? "text-emerald-600" : "text-amber-600"
                      )}
                    >
                      {totalFormulaWeight}%
                    </span>
                  </div>
                </div>
                {totalFormulaWeight !== 100 && (
                  <p className="text-[12px] text-amber-600 mt-2">
                    Total bobot harus = 100% untuk formula yang valid
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]/50">
              <Button variant="outline" onClick={() => setShowFormulaModal(false)}>
                Batal
              </Button>
              <Button
                onClick={handleFormulaSubmit}
                isLoading={formulaModalLoading}
                disabled={totalFormulaWeight !== 100}
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
