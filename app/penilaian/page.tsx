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
import { AssessmentCategory, AssessmentPeriod, DEFAULT_GRADING_SCALE } from "@/types/assessment"
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
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className="text-xs text-[var(--text-muted)]">{title}</p>
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
            icon={<Layers className="w-6 h-6" />}
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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6B7280",
    status: "active" as "active" | "inactive",
  })

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
            <Link href="/penilaian/formula">
              <Button variant="outline" className="gap-2">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Kelola Formula</span>
              </Button>
            </Link>
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
    </AppShell>
  )
}
