"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useCharacter } from "@/hooks/useCharacter"
import {
  CharacterCategoryRecord,
  BehaviorType,
} from "@/types/character"
import {
  Award,
  Shield,
  Star,
  Heart,
  Target,
  Zap,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Settings,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Color palette for categories
const colorPalette = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#EF4444", // Red
  "#F97316", // Orange
  "#84CC16", // Lime
  "#6366F1", // Indigo
]

// Icon mapping
const categoryIcons: Record<string, typeof Award> = {
  disiplin: Shield,
  tanggung: Target,
  responsibility: Target,
  leadership: Star,
  kepemimpinan: Star,
  courtesy: Heart,
  sopan: Heart,
  integrity: Award,
  integritas: Award,
  teamwork: Zap,
  kerja: Zap,
  attendance: Award,
  kehadiran: Award,
  appearance: Award,
  penampilan: Award,
}

type TabType = "kategori" | "perilaku" | "pengaturan"

export default function CharacterSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    behaviors,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addBehavior,
    updateBehavior,
    deleteBehavior,
    refreshData,
  } = useCharacter()

  const [activeTab, setActiveTab] = useState<TabType>("kategori")

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isBehaviorModalOpen, setIsBehaviorModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CharacterCategoryRecord | null>(null)
  const [editingBehavior, setEditingBehavior] = useState<BehaviorType | null>(null)

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    color: colorPalette[0],
  })

  const [behaviorForm, setBehaviorForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    pointValue: 10,
    direction: "positive" as "positive" | "negative",
    severity: "minor" as "minor" | "moderate" | "major" | "critical",
    requiresApproval: false,
    requiresCounseling: false,
  })

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

  // Get category icon
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (lowerName.includes(key)) return Icon
    }
    return Award
  }

  // Get category by ID
  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Tidak ditemukan"
  }

  const getCategoryColor = (id: string) => {
    return categories.find((c) => c.id === id)?.color || "#6B7280"
  }

  // Handlers
  const handleOpenCategoryModal = (category?: CharacterCategoryRecord) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        description: category.description || "",
        color: category.color,
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        name: "",
        description: "",
        color: colorPalette[categories.length % colorPalette.length],
      })
    }
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = async () => {
    if (editingCategory) {
      // Update existing
      await updateCategory(editingCategory.id, {
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
      })
    } else {
      // Create new
      await addCategory({
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        displayOrder: categories.length + 1,
        status: "active",
      })
    }
    setIsCategoryModalOpen(false)
    refreshData()
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      await deleteCategory(id)
      refreshData()
    }
  }

  const handleOpenBehaviorModal = (behavior?: BehaviorType) => {
    if (behavior) {
      setEditingBehavior(behavior)
      setBehaviorForm({
        categoryId: behavior.categoryId,
        name: behavior.name,
        description: behavior.description || "",
        pointValue: behavior.pointValue,
        direction: behavior.direction,
        severity: behavior.severity || "minor",
        requiresApproval: behavior.requiresApproval,
        requiresCounseling: behavior.requiresCounseling,
      })
    } else {
      setEditingBehavior(null)
      setBehaviorForm({
        categoryId: categories[0]?.id || "",
        name: "",
        description: "",
        pointValue: 10,
        direction: "positive",
        severity: "minor",
        requiresApproval: false,
        requiresCounseling: false,
      })
    }
    setIsBehaviorModalOpen(true)
  }

  const handleSaveBehavior = async () => {
    if (editingBehavior) {
      // Update existing
      await updateBehavior(editingBehavior.id, {
        categoryId: behaviorForm.categoryId,
        name: behaviorForm.name,
        description: behaviorForm.description,
        pointValue: behaviorForm.pointValue,
        direction: behaviorForm.direction,
        severity: behaviorForm.severity,
        requiresApproval: behaviorForm.requiresApproval,
        requiresCounseling: behaviorForm.requiresCounseling,
      })
    } else {
      // Create new
      await addBehavior({
        categoryId: behaviorForm.categoryId,
        name: behaviorForm.name,
        description: behaviorForm.description,
        pointValue: behaviorForm.pointValue,
        direction: behaviorForm.direction,
        severity: behaviorForm.severity,
        requiresApproval: behaviorForm.requiresApproval,
        requiresCounseling: behaviorForm.requiresCounseling,
        status: "active",
      })
    }
    setIsBehaviorModalOpen(false)
    refreshData()
  }

  const handleDeleteBehavior = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus perilaku ini?")) {
      await deleteBehavior(id)
      refreshData()
    }
  }

  // Group behaviors by category
  const behaviorsByCategory = categories.map((cat) => ({
    category: cat,
    behaviors: behaviors.filter((b) => b.categoryId === cat.id),
  }))

  return (
    <AppShell
      title="Pengaturan Poin Karakter"
      description="Kelola kategori, perilaku, dan pengaturan poin karakter"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-[var(--surface-secondary)] rounded-2xl p-1.5 w-fit">
          <TabButton
            active={activeTab === "kategori"}
            onClick={() => setActiveTab("kategori")}
            icon={<Award className="w-4 h-4" />}
            label="Kategori"
          />
          <TabButton
            active={activeTab === "perilaku"}
            onClick={() => setActiveTab("perilaku")}
            icon={<Shield className="w-4 h-4" />}
            label="Perilaku"
          />
          <TabButton
            active={activeTab === "pengaturan"}
            onClick={() => setActiveTab("pengaturan")}
            icon={<Settings className="w-4 h-4" />}
            label="Pengaturan"
          />
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "kategori" && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h4 font-semibold text-[var(--text-primary)]">
                      Kategori Karakter
                    </h2>
                    <p className="text-[14px] text-[var(--text-muted)]">
                      {categories.length} kategori aktif
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenCategoryModal()}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kategori
                  </Button>
                </div>

                {/* Category Grid */}
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                      const Icon = getCategoryIcon(category.name)
                      return (
                        <Card
                          key={category.id}
                          className="p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${category.color}15`,
                                color: category.color,
                              }}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                                  {category.name}
                                </h3>
                                <Badge
                                  variant={
                                    category.status === "active"
                                      ? "success"
                                      : "default"
                                  }
                                  className="text-[10px]"
                                >
                                  {category.status === "active" ? "Aktif" : "Nonaktif"}
                                </Badge>
                              </div>
                              <p className="text-[13px] text-[var(--text-muted)] line-clamp-2">
                                {category.description || "Tidak ada deskripsi"}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Badge
                                  variant="default"
                                  className="text-[10px] bg-[var(--surface-hover)]"
                                >
                                  {behaviors.filter(
                                    (b) => b.categoryId === category.id
                                  ).length}{" "}
                                  perilaku
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenCategoryModal(category)}
                                className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-[var(--text-muted)]" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="w-8 h-8 rounded-lg hover:bg-[var(--danger-soft)] flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--text-muted)]">
                      Belum ada kategori. Tambahkan kategori baru untuk memulai.
                    </p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "perilaku" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-h4 font-semibold text-[var(--text-primary)]">
                      Tipe Perilaku
                    </h2>
                    <p className="text-[13px] text-[var(--text-muted)]">
                      {behaviors.length} perilaku dikonfigurasi
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenBehaviorModal()}
                    className="gap-2"
                    disabled={categories.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Perilaku
                  </Button>
                </div>

                {/* Behaviors by Category */}
                {behaviorsByCategory.length > 0 ? (
                  behaviorsByCategory.map(({ category, behaviors: catBehaviors }) => {
                    if (catBehaviors.length === 0) return null
                    const Icon = getCategoryIcon(category.name)

                    return (
                      <Card key={category.id} className="p-5">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-light)]">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${category.color}15`,
                              color: category.color,
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                              {category.name}
                            </h3>
                            <p className="text-[12px] text-[var(--text-muted)]">
                              {catBehaviors.length} perilaku
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {catBehaviors.map((behavior) => (
                            <div
                              key={behavior.id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl",
                                "bg-[var(--surface-secondary)]",
                                "hover:bg-[var(--surface-hover)] transition-colors"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                  behavior.direction === "positive"
                                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                                    : "bg-[var(--danger-soft)] text-[var(--danger)]"
                                )}
                              >
                                {behavior.direction === "positive" ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                  {behavior.name}
                                </p>
                                <p className="text-[12px] text-[var(--text-muted)]">
                                  {behavior.description || "Tidak ada deskripsi"}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  behavior.direction === "positive"
                                    ? "success"
                                    : "danger"
                                }
                                className="text-[11px] shrink-0"
                              >
                                {behavior.direction === "positive" ? "+" : ""}
                                {behavior.pointValue}
                              </Badge>
                              {behavior.severity && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] shrink-0 bg-[var(--surface-hover)]"
                                >
                                  {behavior.severity}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleOpenBehaviorModal(behavior)}
                                  className="w-7 h-7 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBehavior(behavior.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-[var(--danger-soft)] flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-[var(--danger)]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="p-8 text-center">
                    <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--text-muted)]">
                      Belum ada perilaku. Pastikan ada kategori terlebih dahulu.
                    </p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "pengaturan" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-h5 font-semibold text-[var(--text-primary)] mb-6">
                    Pengaturan Umum
                  </h2>

                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium text-[var(--text-primary)]">
                        Batas Poin untuk Rekomendasi Konseling
                      </label>
                      <Input
                        type="number"
                        placeholder="100"
                        defaultValue="100"
                        helperText="Poin negatif akumulasi yang memicu rekomendasi konseling"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium text-[var(--text-primary)]">
                        Poin Default untuk Perilaku Positif
                      </label>
                      <Input
                        type="number"
                        placeholder="10"
                        defaultValue="10"
                        helperText="Nilai default saat membuat perilaku positif baru"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium text-[var(--text-primary)]">
                        Poin Default untuk Perilaku Negatif
                      </label>
                      <Input
                        type="number"
                        placeholder="-10"
                        defaultValue="-10"
                        helperText="Nilai default saat membuat perilaku negatif baru"
                      />
                    </div>

                    <div className="pt-4 border-t border-[var(--border-light)]">
                      <Button className="gap-2">
                        <Check className="w-4 h-4" />
                        Simpan Pengaturan
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
        description="Kategori digunakan untuk mengelompokkan perilaku karakter"
      >
        <div className="space-y-4">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Disiplin"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--text-primary)]">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan kategori ini..."
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={cn(
                "w-full min-h-[100px] px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[15px] text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "resize-y"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[var(--text-primary)]">
              Warna
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setCategoryForm((prev) => ({ ...prev, color }))
                  }
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all",
                    categoryForm.color === color
                      ? "ring-2 ring-offset-2 ring-[var(--primary)] scale-110"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSaveCategory}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Behavior Modal */}
      <Modal
        isOpen={isBehaviorModalOpen}
        onClose={() => setIsBehaviorModalOpen(false)}
        title={editingBehavior ? "Edit Perilaku" : "Tambah Perilaku Baru"}
        description="Definisikan perilaku dan nilai poinnya"
      >
        <div className="space-y-4">
          <Select
            label="Kategori"
            value={behaviorForm.categoryId}
            onChange={(e) =>
              setBehaviorForm((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <Input
            label="Nama Perilaku"
            placeholder="Contoh: Terlambat 5-15 Menit"
            value={behaviorForm.name}
            onChange={(e) =>
              setBehaviorForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--text-primary)]">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan perilaku ini..."
              value={behaviorForm.description}
              onChange={(e) =>
                setBehaviorForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={cn(
                "w-full min-h-[80px] px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[15px] text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "resize-y"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[var(--text-primary)]">
                Arah Poin
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setBehaviorForm((prev) => ({
                      ...prev,
                      direction: "positive",
                    }))
                  }
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    behaviorForm.direction === "positive"
                      ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"
                      : "border-[var(--border-default)] text-[var(--text-muted)]"
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  Positif
                </button>
                <button
                  onClick={() =>
                    setBehaviorForm((prev) => ({
                      ...prev,
                      direction: "negative",
                    }))
                  }
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    behaviorForm.direction === "negative"
                      ? "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]"
                      : "border-[var(--border-default)] text-[var(--text-muted)]"
                  )}
                >
                  <TrendingDown className="w-4 h-4" />
                  Negatif
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-[var(--text-primary)]">
                Nilai Poin
              </label>
              <Input
                type="number"
                value={behaviorForm.pointValue}
                onChange={(e) =>
                  setBehaviorForm((prev) => ({
                    ...prev,
                    pointValue: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="10"
              />
            </div>
          </div>

          <Select
            label="Severity"
            value={behaviorForm.severity}
            onChange={(e) =>
              setBehaviorForm((prev) => ({
                ...prev,
                severity: e.target.value as typeof behaviorForm.severity,
              }))
            }
            options={[
              { value: "minor", label: "Minor - Ringan" },
              { value: "moderate", label: "Moderate - Sedang" },
              { value: "major", label: "Major - Berat" },
              { value: "critical", label: "Critical - Sangat Berat" },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
            <Button
              variant="outline"
              onClick={() => setIsBehaviorModalOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSaveBehavior}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all",
        active
          ? "bg-white shadow-sm text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      )}
    >
      {icon}
      {label}
    </button>
  )
}
