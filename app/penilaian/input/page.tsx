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
import {
  Search,
  Layers,
  Calendar,
  Play,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// HELPER COMPONENTS - Following Buku Induk Patterns
// ============================================

function CategoryCard({
  category,
  periods,
  itemCount,
  onPeriodClick,
}: {
  category: any
  periods: any[]
  itemCount: number
  onPeriodClick: (period: any) => void
}) {
  const categoryColor = category.color || "#6B7280"

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Category Header */}
      <div className="p-5 bg-[var(--surface-secondary)] border-b border-[var(--border-light)]">
        <div className="flex items-center gap-4">
          <Avatar
            fallback={category.name}
            icon={<Layers className="w-6 h-6" />}
            className="w-12 h-12"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                {category.name}
              </h3>
              <Badge variant="primary" className="text-[10px]">
                {periods.length} Periode
              </Badge>
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">
              {itemCount} item
            </p>
          </div>
        </div>
      </div>

      {/* Periods Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {periods.map((period, index) => (
            <button
              key={period.id}
              onClick={() => onPeriodClick(period)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all group",
                "hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]",
                "border-[var(--border-light)] bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center text-[14px] font-bold text-[var(--primary)] group-hover:bg-white transition-colors">
                  {index + 1}
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">
                    {period.periodName}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {period.weightPercentage}%
                  </p>
                </div>
              </div>
              <Play className="w-5 h-5 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

function InfoCard() {
  return (
    <Card variant="soft" padding="md" className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center flex-shrink-0">
        <Info className="w-5 h-5 text-[var(--info)]" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-[var(--info)]">Tips</p>
        <p className="text-[12px] text-[var(--info)] mt-1 leading-relaxed">
          Klik periode untuk membuka halaman input nilai. Anda dapat melihat hasil
          penilaian di menu "Hasil Penilaian".
        </p>
      </div>
    </Card>
  )
}

// ============================================
// INPUT NILAI PAGE
// ============================================

export default function InputNilaiPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    periods,
    items,
    loading,
  } = useAssessmentNew()

  const [searchQuery, setSearchQuery] = useState("")

  // Get categories with periods
  const categoriesWithPeriods = categories
    .filter((cat) => {
      const catPeriods = periods.filter((p) => p.categoryId === cat.id)
      return catPeriods.length > 0
    })
    .map((cat) => ({
      ...cat,
      periods: periods.filter((p) => p.categoryId === cat.id).sort((a, b) => a.periodOrder - b.periodOrder),
    }))

  // Filter by search
  const filteredCategories = categoriesWithPeriods.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Get item count for category
  const getItemCount = (categoryId: string) => {
    return items.filter((i) => i.categoryId === categoryId).length
  }

  // Handle period click
  const handlePeriodClick = (period: any) => {
    // Find the category that owns this period
    const category = categories.find((c) => c.id === period.categoryId)
    if (category) {
      router.push(`/penilaian/${category.id}/${period.id}`)
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell
      title="Input Nilai"
      description="Pilih kategori dan periode untuk input nilai siswa"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">Input Nilai</h1>
            <p className="text-[12px] text-[var(--text-muted)]">
              Pilih kategori dan periode penilaian untuk input nilai
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)] transition-all"
            />
          </div>
        </div>

        {/* Categories with Periods */}
        {filteredCategories.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Layers className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              {searchQuery ? "Kategori tidak ditemukan" : "Belum ada kategori dengan periode"}
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-6">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Tambahkan periode di Pusat Penilaian terlebih dahulu"}
            </p>
            {!searchQuery && (
              <Link href="/penilaian">
                <Button className="gap-2">
                  <Layers className="w-4 h-4" />
                  ke Pusat Penilaian
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                periods={category.periods}
                itemCount={getItemCount(category.id)}
                onPeriodClick={handlePeriodClick}
              />
            ))}
          </div>
        )}

        {/* Info */}
        <InfoCard />
      </div>
    </AppShell>
  )
}
