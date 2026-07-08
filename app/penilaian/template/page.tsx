"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment } from "@/hooks/useAssessment"
import { type AssessmentTemplate, type AssessmentCategory, type AssessmentItem } from "@/types/assessment"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  FileText,
  Layers,
  CheckCircle2,
  X,
  ArrowRight,
  Calculator,
} from "lucide-react"
import { cn } from "@/lib/utils"

const scoringMethodOptions = [
  { value: "weighted_average", label: "Rata-rata Tertimbang" },
  { value: "simple_average", label: "Rata-rata Sederhana" },
  { value: "highest", label: "Nilai Tertinggi" },
  { value: "lowest", label: "Nilai Terendah" },
]

export default function AssessmentTemplatePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    templates,
    categories,
    items,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createItem,
    updateItem,
    deleteItem,
    refresh
  } = useAssessment()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<AssessmentTemplate | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Item modal state
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState<AssessmentItem | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [itemModalLoading, setItemModalLoading] = useState(false)

  // Template form state
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    scoringMethod: "weighted_average",
    passingScore: 75,
    maxScore: 100,
    minScore: 0,
    allowDecimal: true,
    autoCalculate: true,
    status: "draft" as "draft" | "active" | "inactive" | "archived",
  })

  // Item form state
  const [itemFormData, setItemFormData] = useState({
    name: "",
    description: "",
    scoreType: "numeric",
    weight: 0,
    minScore: 0,
    maxScore: 100,
    passingScore: 75,
    displayOrder: 0,
    required: true,
  })

  // Get items for a template
  const getTemplateItems = useCallback((templateId: string) => {
    return items.filter((i) => i.templateId === templateId)
  }, [items])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesCategory = !selectedCategory || template.categoryId === selectedCategory
      const matchesStatus = !selectedStatus || template.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [templates, searchQuery, selectedCategory, selectedStatus])

  // Get category name and color
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Tidak ada"
  }

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#6B7280"
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success"
      case "draft": return "warning"
      case "inactive": return "secondary"
      case "archived": return "secondary"
      default: return "secondary"
    }
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Aktif"
      case "draft": return "Draft"
      case "inactive": return "Tidak Aktif"
      case "archived": return "Arsip"
      default: return status
    }
  }

  // Get scoring method label
  const getScoringMethodLabel = (method: string) => {
    return scoringMethodOptions.find((m) => m.value === method)?.label || method
  }

  // Open modal for create
  const handleCreate = () => {
    setEditingTemplate(null)
    setFormData({
      categoryId: categories[0]?.id || "",
      name: "",
      description: "",
      scoringMethod: "weighted_average",
      passingScore: 75,
      maxScore: 100,
      minScore: 0,
      allowDecimal: true,
      autoCalculate: true,
      status: "draft",
    })
    setShowModal(true)
  }

  // Open modal for edit
  const handleEdit = (template: AssessmentTemplate) => {
    setEditingTemplate(template)
    setFormData({
      categoryId: template.categoryId || "",
      name: template.name,
      description: template.description || "",
      scoringMethod: template.scoringMethod,
      passingScore: template.passingScore,
      maxScore: template.maxScore,
      minScore: template.minScore,
      allowDecimal: template.allowDecimal,
      autoCalculate: template.autoCalculate,
      status: template.status as "draft" | "active" | "inactive" | "archived",
    })
    setShowModal(true)
    setOpenMenuId(null)
  }

  // Handle delete
  const handleDelete = async (template: AssessmentTemplate) => {
    if (!confirm(`Yakin ingin menghapus template "${template.name}"?`)) return

    const result = await deleteTemplate(template.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus template")
    }
    setOpenMenuId(null)
  }

  // Handle duplicate
  const handleDuplicate = async (template: AssessmentTemplate) => {
    const result = await createTemplate({
      categoryId: template.categoryId,
      name: `${template.name} (Copy)`,
      description: template.description,
      scoringMethod: template.scoringMethod,
      passingScore: template.passingScore,
      maxScore: template.maxScore,
      minScore: template.minScore,
      allowDecimal: template.allowDecimal,
      autoCalculate: template.autoCalculate,
      status: "draft",
    })

    if (!result.success) {
      alert(result.error || "Gagal menduplikasi template")
    }
    setOpenMenuId(null)
  }

  // Handle template form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Nama template wajib diisi")
      return
    }
    if (!formData.categoryId) {
      alert("Kategori wajib dipilih")
      return
    }

    setModalLoading(true)
    try {
      let result
      if (editingTemplate) {
        result = await updateTemplate(editingTemplate.id, {
          name: formData.name,
          description: formData.description || undefined,
          categoryId: formData.categoryId,
          scoringMethod: formData.scoringMethod as any,
          passingScore: formData.passingScore,
          maxScore: formData.maxScore,
          minScore: formData.minScore,
          allowDecimal: formData.allowDecimal,
          autoCalculate: formData.autoCalculate,
          status: formData.status,
        })
      } else {
        result = await createTemplate({
          categoryId: formData.categoryId,
          name: formData.name,
          description: formData.description || undefined,
          scoringMethod: formData.scoringMethod as any,
          passingScore: formData.passingScore,
          maxScore: formData.maxScore,
          minScore: formData.minScore,
          allowDecimal: formData.allowDecimal,
          autoCalculate: formData.autoCalculate,
          status: formData.status,
        })
      }

      if (result.success) {
        setShowModal(false)
        refresh()
      } else {
        alert(result.error || "Gagal menyimpan template")
      }
    } finally {
      setModalLoading(false)
    }
  }

  // Open item modal
  const handleOpenItemModal = (templateId: string, item?: AssessmentItem) => {
    setSelectedTemplateId(templateId)
    if (item) {
      setEditingItem(item)
      setItemFormData({
        name: item.name,
        description: item.description || "",
        scoreType: item.scoreType || item.inputType || "numeric",
        weight: item.weight,
        minScore: item.minScore || 0,
        maxScore: item.maxScore || 100,
        passingScore: item.passingScore || 75,
        displayOrder: item.displayOrder,
        required: item.isRequired,
      })
    } else {
      setEditingItem(null)
      const existingItems = getTemplateItems(templateId)
      setItemFormData({
        name: "",
        description: "",
        scoreType: "numeric",
        weight: 0,
        minScore: 0,
        maxScore: 100,
        passingScore: 75,
        displayOrder: existingItems.length + 1,
        required: true,
      })
    }
    setShowItemModal(true)
  }

  // Handle item form submit
  const handleItemSubmit = async () => {
    if (!itemFormData.name.trim()) {
      alert("Nama item wajib diisi")
      return
    }
    if (!selectedTemplateId) {
      alert("Template ID tidak valid")
      return
    }

    // Validate total weight
    const existingItems = getTemplateItems(selectedTemplateId)
    const totalWeight = existingItems
      .filter((i) => !editingItem || i.id !== editingItem.id)
      .reduce((sum, i) => sum + i.weight, 0) + itemFormData.weight

    setItemModalLoading(true)
    try {
      let result
      if (editingItem) {
        result = await updateItem(editingItem.id, {
          name: itemFormData.name,
          description: itemFormData.description || undefined,
          scoreType: itemFormData.scoreType as any,
          weight: itemFormData.weight,
          minScore: itemFormData.minScore,
          maxScore: itemFormData.maxScore,
          passingScore: itemFormData.passingScore,
          displayOrder: itemFormData.displayOrder,
          required: itemFormData.required,
        })
      } else {
        result = await createItem({
          templateId: selectedTemplateId,
          name: itemFormData.name,
          description: itemFormData.description || undefined,
          scoreType: itemFormData.scoreType as any,
          weight: itemFormData.weight,
          minScore: itemFormData.minScore,
          maxScore: itemFormData.maxScore,
          passingScore: itemFormData.passingScore,
          displayOrder: itemFormData.displayOrder,
          required: itemFormData.required,
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

    const result = await deleteItem(item.id)
    if (!result.success) {
      alert(result.error || "Gagal menghapus item")
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

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
      title="Template Penilaian"
      description="Kelola template penilaian yang dapat digunakan berulang kali"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Template Baru
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("")
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
        {(selectedCategory || selectedStatus) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
            {selectedCategory && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedCategory("")}>
                {getCategoryName(selectedCategory)}
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedStatus("")}>
                {getStatusLabel(selectedStatus)}
              </Badge>
            )}
          </div>
        )}

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-12 h-12 bg-[var(--surface-hover)] rounded-lg mb-4" />
                <div className="w-3/4 h-5 bg-[var(--surface-hover)] rounded mb-2" />
                <div className="w-1/2 h-4 bg-[var(--surface-hover)] rounded mb-4" />
                <div className="w-full h-20 bg-[var(--surface-hover)] rounded" />
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-[15px] font-medium text-[var(--text-primary)] mb-2">
              {searchQuery || selectedCategory || selectedStatus
                ? "Template tidak ditemukan"
                : "Belum ada template"}
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-6">
              {searchQuery || selectedCategory || selectedStatus
                ? "Coba ubah kata kunci pencarian atau filter"
                : "Mulai dengan membuat template penilaian baru"}
            </p>
            {!searchQuery && !selectedCategory && !selectedStatus && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Buat Template
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const templateItems = getTemplateItems(template.id)
              const categoryColor = getCategoryColor(template.categoryId || "")
              return (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                    >
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === template.id ? null : template.id)
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                      {openMenuId === template.id && (
                        <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                          <button
                            onClick={() => handleEdit(template)}
                            className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicate(template)}
                            className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplikat
                          </button>
                          <button
                            onClick={() => handleDelete(template)}
                            className="w-full px-4 py-2 text-left text-[14px] text-[var(--danger)] hover:bg-[var(--danger-soft)] flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">
                      {template.name}
                    </h3>
                    <p className="text-[13px] text-[var(--text-muted)] line-clamp-2">
                      {template.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <Badge
                      variant="primary"
                      className="text-[11px]"
                      style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                    >
                      {getCategoryName(template.categoryId || "")}
                    </Badge>
                    <Badge variant={getStatusVariant(template.status)} className="text-[11px]">
                      {getStatusLabel(template.status)}
                    </Badge>
                  </div>

                  {/* Items List */}
                  <div className="border-t border-[var(--border-light)] pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-[var(--text-muted)]">
                        {templateItems.length} Item
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenItemModal(template.id)}
                        className="h-6 text-[11px]"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah Item
                      </Button>
                    </div>
                    {templateItems.length > 0 ? (
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {templateItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-[12px]">
                            <span className="text-[var(--text-secondary)]">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-muted)]">{item.weight}%</span>
                              <button
                                onClick={() => handleOpenItemModal(template.id, item)}
                                className="text-[var(--primary)] hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="text-[var(--danger)] hover:underline"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                        {templateItems.length > 3 && (
                          <p className="text-[11px] text-[var(--text-muted)]">
                            +{templateItems.length - 3} item lainnya
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[var(--text-muted)] italic">
                        Belum ada item
                      </p>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                      <Calculator className="w-3 h-3" />
                      <span>{getScoringMethodLabel(template.scoringMethod)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.autoCalculate && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)]" aria-label="Auto Calculate" />
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Stats Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Total Template</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{templates.length}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Aktif</p>
                <p className="text-2xl font-bold text-[var(--success)]">
                  {templates.filter((t) => t.status === "active").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Draft</p>
                <p className="text-2xl font-bold text-[var(--warning)]">
                  {templates.filter((t) => t.status === "draft").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Template Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {editingTemplate ? "Edit Template" : "Template Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Category */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Kategori <span className="text-[var(--danger)]">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Nama Template <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Inspeksi Mingguan"
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                />
              </div>

              {/* Scoring Method */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Metode Perhitungan
                </label>
                <select
                  value={formData.scoringMethod}
                  onChange={(e) => setFormData({ ...formData, scoringMethod: e.target.value })}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  {scoringMethodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score Range */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nilai Min
                  </label>
                  <input
                    type="number"
                    value={formData.minScore}
                    onChange={(e) => setFormData({ ...formData, minScore: parseFloat(e.target.value) || 0 })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nilai Max
                  </label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseFloat(e.target.value) || 100 })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nilai Lulus
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseFloat(e.target.value) || 75 })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowDecimal}
                    onChange={(e) => setFormData({ ...formData, allowDecimal: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border)]"
                  />
                  <span className="text-[14px] text-[var(--text-primary)]">Izinkan Nilai Desimal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoCalculate}
                    onChange={(e) => setFormData({ ...formData, autoCalculate: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border)]"
                  />
                  <span className="text-[14px] text-[var(--text-primary)]">Hitung Otomatis</span>
                </label>
              </div>

              {/* Status */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit} isLoading={modalLoading}>
                {editingTemplate ? "Simpan" : "Buat"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {editingItem ? "Edit Item" : "Item Baru"}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Nama Item <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  placeholder="Contoh: Seragam, Atensi"
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Deskripsi
                </label>
                <textarea
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  placeholder="Deskripsi item..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                />
              </div>

              {/* Weight & Score Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Bobot (%) <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    type="number"
                    value={itemFormData.weight}
                    onChange={(e) => setItemFormData({ ...itemFormData, weight: parseFloat(e.target.value) || 0 })}
                    min={0}
                    max={100}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Tipe Nilai
                  </label>
                  <select
                    value={itemFormData.scoreType}
                    onChange={(e) => setItemFormData({ ...itemFormData, scoreType: e.target.value })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="numeric">Numerik</option>
                    <option value="percentage">Persentase</option>
                    <option value="boolean">Ya/Tidak</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              {/* Score Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nilai Min
                  </label>
                  <input
                    type="number"
                    value={itemFormData.minScore}
                    onChange={(e) => setItemFormData({ ...itemFormData, minScore: parseFloat(e.target.value) || 0 })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                    Nilai Max
                  </label>
                  <input
                    type="number"
                    value={itemFormData.maxScore}
                    onChange={(e) => setItemFormData({ ...itemFormData, maxScore: parseFloat(e.target.value) || 100 })}
                    className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-js)]"
                  />
                </div>
              </div>

              {/* Required */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemFormData.required}
                  onChange={(e) => setItemFormData({ ...itemFormData, required: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)]"
                />
                <span className="text-[14px] text-[var(--text-primary)]">Item Wajib Diisi</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
              <Button variant="outline" onClick={() => setShowItemModal(false)}>
                Batal
              </Button>
              <Button onClick={handleItemSubmit} isLoading={itemModalLoading}>
                {editingItem ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
