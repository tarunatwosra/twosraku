"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment } from "@/hooks/useAssessment"
import { type AssessmentTemplate, type AssessmentCategory } from "@/types/assessment"
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
  Lock,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AssessmentTemplatePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { templates, categories, loading } = useAssessment()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || template.categoryId === selectedCategory
      const matchesStatus = !selectedStatus || template.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [templates, searchQuery, selectedCategory, selectedStatus])

  // Get category name
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Tidak ada"
  }

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#6B7280"
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "draft":
        return "warning"
      case "inactive":
        return "secondary"
      case "archived":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // Handle menu toggle
  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id)
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

  return (
    <AppShell
      title="Template Penilaian"
      description="Kelola template penilaian yang dapat digunakan berulang kali"
      breadcrumbs={[
        { label: "Penilaian", href: "/penilaian" },
        { label: "Template" },
      ]}
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
          <Button
            onClick={() => router.push("/penilaian/template/baru")}
            className="gap-2"
          >
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
              <Badge
                variant="primary"
                className="cursor-pointer"
                onClick={() => setSelectedCategory("")}
              >
                {getCategoryName(selectedCategory)}
              </Badge>
            )}
            {selectedStatus && (
              <Badge
                variant="primary"
                className="cursor-pointer"
                onClick={() => setSelectedStatus("")}
              >
                {selectedStatus}
              </Badge>
            )}
          </div>
        )}

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-10 h-10 bg-[var(--surface-hover)] rounded-lg mb-4" />
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
              <Button onClick={() => router.push("/penilaian/template/baru")}>
                <Plus className="w-4 h-4" />
                Buat Template
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                categoryName={getCategoryName(template.categoryId)}
                categoryColor={getCategoryColor(template.categoryId)}
                onEdit={() => router.push(`/penilaian/template/${template.id}`)}
                onDuplicate={() => router.push(`/penilaian/template/${template.id}/duplikat`)}
                onDelete={() => {}}
              />
            ))}
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
    </AppShell>
  )
}

// Template Card Component
function TemplateCard({
  template,
  categoryName,
  categoryColor,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  template: AssessmentTemplate
  categoryName: string
  categoryColor: string
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "draft":
        return "warning"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={onEdit}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <Layers className="w-6 h-6" style={{ color: categoryColor }} />
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-[var(--border-light)] py-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--surface-hover)] flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplikat
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                  setShowMenu(false)
                }}
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
        <p className="text-[13px] text-[var(--text-muted)]">
          {template.description || "Tidak ada deskripsi"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge
          variant="primary"
          className="text-[11px]"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {categoryName}
        </Badge>
        <Badge variant={getStatusVariant(template.status)} className="text-[11px]">
          {template.status === "active" ? "Aktif" : template.status === "draft" ? "Draft" : template.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
        <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)]">
          <span>Skor: {template.minScore} - {template.maxScore}</span>
        </div>
        <div className="flex items-center gap-1">
          {template.autoCalculate && (
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" title="Auto Calculate" />
          )}
          {template.locked && <Lock className="w-4 h-4 text-[var(--text-muted)]" title="Locked" />}
        </div>
      </div>
    </Card>
  )
}
