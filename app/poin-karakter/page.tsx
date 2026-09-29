"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useCharacterDashboard } from "@/hooks/useCharacter"
import {
  CharacterStatCard,
  StudentLeaderboard,
  CategoryGrid,
  BehaviorCard,
  PointTrendChart,
  CategoryBreakdownChart,
} from "@/components/poin-karakter"
import {
  Plus,
  Trophy,
  AlertTriangle,
  Settings,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock trend data - replace with real data from API
const mockTrendData = [
  { date: "01 Agt", positive: 45, negative: 12 },
  { date: "02 Agt", positive: 52, negative: 8 },
  { date: "03 Agt", positive: 38, negative: 15 },
  { date: "04 Agt", positive: 61, negative: 5 },
  { date: "05 Agt", positive: 48, negative: 10 },
  { date: "06 Agt", positive: 55, negative: 7 },
  { date: "07 Agt", positive: 42, negative: 18 },
  { date: "08 Agt", positive: 65, negative: 3 },
  { date: "09 Agt", positive: 58, negative: 9 },
  { date: "10 Agt", positive: 49, negative: 14 },
  { date: "11 Agt", positive: 72, negative: 6 },
  { date: "12 Agt", positive: 63, negative: 11 },
  { date: "13 Agt", positive: 54, negative: 8 },
  { date: "14 Agt", positive: 68, negative: 4 },
]

export default function CharacterPointsDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    positiveBehaviors,
    negativeBehaviors,
    topPositiveStudents,
    topNegativeStudents,
    statistics,
    loading,
  } = useCharacterDashboard()

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#6B7280"
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

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

  const displayPositiveBehaviors = positiveBehaviors.slice(0, 4)
  const displayNegativeBehaviors = negativeBehaviors.slice(0, 4)

  return (
    <AppShell
      title="Poin Karakter"
      description="Kelola dan pantau perkembangan karakter siswa"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/poin-karakter/input">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Input Poin
              </Button>
            </Link>
            <Link href="/poin-karakter/riwayat">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Riwayat
              </Button>
            </Link>
            <Link href="/poin-karakter/setting">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Pengaturan
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <CharacterStatCard
                title="Poin Positif"
                value={statistics.totalPositivePoints}
                subtitle="total akumulasi"
                icon={<TrendingUp className="w-5 h-5" />}
                color="success"
                trend={12}
              />
              <CharacterStatCard
                title="Poin Negatif"
                value={statistics.totalNegativePoints}
                subtitle="total akumulasi"
                icon={<TrendingDown className="w-5 h-5" />}
                color="danger"
                trend={-5}
              />
              <CharacterStatCard
                title="Total Catatan"
                value={statistics.totalRecords}
                subtitle="semua aktivitas"
                icon={<Award className="w-5 h-5" />}
                color="primary"
              />
              <CharacterStatCard
                title="Net Poin"
                value={statistics.netPoints}
                subtitle="poin bersih"
                icon={<Trophy className="w-5 h-5" />}
                color={statistics.netPoints >= 0 ? "success" : "danger"}
                trend={8}
              />
            </div>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentLeaderboard
                title="Siswa Berprestise"
                subtitle="Poin positif tertinggi"
                students={topPositiveStudents}
                type="positive"
                maxDisplay={5}
                onStudentClick={(id) => router.push(`/buku-induk/${id}`)}
              />
              <StudentLeaderboard
                title="Perlu Perhatian"
                subtitle="Poin negatif tertinggi"
                students={topNegativeStudents}
                type="negative"
                maxDisplay={5}
                onStudentClick={(id) => router.push(`/buku-induk/${id}`)}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PointTrendChart data={mockTrendData} />
              <CategoryBreakdownChart
                data={categories.map((cat) => ({
                  name: cat.name,
                  value: Math.floor(Math.random() * 300) + 50,
                  color: cat.color,
                }))}
              />
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-h5 font-semibold text-[var(--text-primary)]">
                      Kategori Karakter
                    </h2>
                    <p className="text-[13px] text-[var(--text-muted)]">
                      {categories.length} kategori tersedia
                    </p>
                  </div>
                  <Link href="/poin-karakter/setting">
                    <Button variant="ghost" size="sm" className="gap-2">
                      Kelola
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <CategoryGrid
                  categories={categories}
                  onCategoryClick={(id) =>
                    router.push(`/poin-karakter/setting`)
                  }
                />
              </Card>
            )}

            {/* Recent Behaviors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Positive Behaviors */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      Perilaku Positif
                    </h3>
                  </div>
                  <Badge variant="success" className="text-[11px]">
                    {positiveBehaviors.length} Total
                  </Badge>
                </div>
                <div className="space-y-2">
                  {displayPositiveBehaviors.length > 0 ? (
                    displayPositiveBehaviors.map((behavior) => (
                      <BehaviorCard
                        key={behavior.id}
                        behavior={behavior}
                        categoryColor={getCategoryColor(behavior.categoryId)}
                        compact
                      />
                    ))
                  ) : (
                    <p className="text-center py-6 text-[var(--text-muted)] text-[14px]">
                      Belum ada perilaku positif
                    </p>
                  )}
                </div>
              </Card>

              {/* Negative Behaviors */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--danger-soft)] flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      Perilaku Negatif
                    </h3>
                  </div>
                  <Badge variant="danger" className="text-[11px]">
                    {negativeBehaviors.length} Total
                  </Badge>
                </div>
                <div className="space-y-2">
                  {displayNegativeBehaviors.length > 0 ? (
                    displayNegativeBehaviors.map((behavior) => (
                      <BehaviorCard
                        key={behavior.id}
                        behavior={behavior}
                        categoryColor={getCategoryColor(behavior.categoryId)}
                        compact
                      />
                    ))
                  ) : (
                    <p className="text-center py-6 text-[var(--text-muted)] text-[14px]">
                      Belum ada perilaku negatif
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
