"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment } from "@/hooks/useAssessment"
import { type AssessmentCategory } from "@/types/assessment"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  GraduationCap,
  Shield,
  Crown,
  Wrench,
  Star,
  Heart,
  Target,
  X,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Crown,
  Wrench,
  Star,
  Heart,
  Target,
  GraduationCap,
}

const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Teal", value: "#14B8A6" },
]

export default function AssessmentCategoriesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { categories, loading, createCategory, updateCategory, deleteCategory, refresh } = useAssessment()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssessmentCategory | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Shield",
    color: "#3B82F6",
    displayOrder: 0,
  })

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      return matchesSearch
    })
  }, [categories, searchQuery])

  // Get icon component
  const getIcon = useCallback((iconName: string) => {
    const Icon = iconMap[iconName] || GraduationCap
    return Icon
  }, [])

  // Open modal for create
  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      icon: "Shield",
      color: "#3B82F6",
      displayOrder: categories.length + 1,
    })
    setShowModal(true)
  }

  // Open modal for edit
  const handleEdit = (category: AssessmentCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "Shield",
      color: category.color || "#3B82F6",
      displayOrder: category.displayOrder,
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
          icon: formData.icon,
          color: formData.color,
          displayOrder: formData.displayOrder,
        })
      } else {
        result = await createCategory({
          name: formData.name,
          description: formData.description || undefined,
          icon: formData.icon,
          color: formData.color,
          displayOrder: formData.displayOrder,
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
      title="Kategori Penilaian"
      description="Kelola kategori penilaian untuk mengelompokkan template"
    >
      <div className="space-y-6">
        {/* Header Actions */}
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
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Kategori Baru
          </Button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-12 h-12 bg-[var(--surface-hover)] rounded-lg mb-4" />
                <div className="w-3/4 h-5 bg-[var(--surface-hover)] rounded mb-2" />
                <div className="w-full h-16 bg-[var(--surface-hover)] rounded" />
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-[15px] font-medium text-[var(--text-primary)] mb-2">
              {searchQuery ? "Kategori tidak ditemukan" : "Belum ada kategori"}
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-6">
              {searchQuery ? "Coba ubah kata kunci pencarian" : "Mulai dengan membuat kategori baru"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Buat Kategori
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const Icon = getIcon(category.icon || "Shield")
              return (
                <Card key={category.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === category.id ? null : category.id)
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                      {openMenuId === category.id && (
                        <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
                          <button
                            onClick={() => handleEdit(category)}
                            className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
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
                      {category.name}
                    </h3>
                    <p className="text-[13px] text-[var(--text-muted)] line-clamp-2">
                      {category.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <Badge
                    variant="secondary"
                    className="text-[11px]"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color
                    }}
                  >
                    {category.displayOrder > 0 ? `Order: ${category.displayOrder}` : "Aktif"}
                  </Badge>
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
                <p className="text-sm text-[var(--text-muted)]">Total Kategori</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{categories.length}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Aktif</p>
                <p className="text-2xl font-bold text-[var(--success)]">
                  {categories.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {editingCategory ? "Edit Kategori" : "Kategori Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Nama Kategori <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Disiplin, Leadership"
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
                  placeholder="Deskripsi singkat tentang kategori ini..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Ikon
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(iconMap).map(([name, Icon]) => (
                    <button
                      key={name}
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                        formData.icon === name
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      )}
                      title={name}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        formData.color === color.value
                          ? "ring-2 ring-offset-2 ring-[var(--primary)]"
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
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
