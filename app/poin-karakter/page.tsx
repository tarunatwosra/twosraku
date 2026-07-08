"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useCharacterDashboard } from "@/hooks/useCharacter"
import { CharacterCategoryRecord, BehaviorType } from "@/types/character"
import {
  Plus,
  Award,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CharacterPointsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    positiveBehaviors,
    negativeBehaviors,
    topPositiveStudents,
    topNegativeStudents,
    statistics,
  } = useCharacterDashboard()

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

  return (
    <AppShell title="Poin Karakter" description="Kelola catatan karakter siswa">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/poin-karakter/input">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Catatan
              </Button>
            </Link>
            <Link href="/poin-karakter/riwayat">
              <Button variant="outline" className="gap-2">
                <Award className="w-4 h-4" />
                Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Poin Positif"
            value={statistics.totalPositivePoints}
            subtitle="total poin"
            icon={<TrendingUp className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Poin Negatif"
            value={statistics.totalNegativePoints}
            subtitle="total poin"
            icon={<TrendingDown className="w-5 h-5" />}
            color="danger"
          />
          <StatCard
            title="Total Catatan"
            value={statistics.totalRecords}
            subtitle="semua aktivitas"
            icon={<Award className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Net Poin"
            value={statistics.netPoints}
            subtitle="poin bersih"
            icon={<Trophy className="w-5 h-5" />}
            color={statistics.netPoints >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Kategori Karakter
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <p className="font-medium text-[var(--text-primary)]">
                  {category.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Positive */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-section-title flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--success)]" />
                Siswa Berprestise
              </h2>
            </div>
            <div className="space-y-3">
              {topPositiveStudents.slice(0, 5).map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-secondary)]"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0
                        ? "bg-[var(--warning)] text-white"
                        : index === 1
                        ? "bg-[var(--text-muted)] text-white"
                        : index === 2
                        ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                        : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">
                      {student.name}
                    </p>
                  </div>
                  <Badge variant="success">+{student.points}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Negative */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-section-title flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
                Perlu Perhatian
              </h2>
            </div>
            <div className="space-y-3">
              {topNegativeStudents.slice(0, 5).map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-secondary)]"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--danger-soft)] text-[var(--danger)] text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">
                      {student.name}
                    </p>
                  </div>
                  <Badge variant="danger">-{student.points}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Behaviors */}
        <Card className="p-6">
          <h2 className="text-section-title mb-4">
            Perilaku Positif
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {positiveBehaviors.slice(0, 6).map((behavior) => (
              <div
                key={behavior.id}
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--success)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                  <Badge variant="success" className="text-caption">
                    +{behavior.pointValue}
                  </Badge>
                </div>
                <p className="font-medium text-[var(--text-primary)]">
                  {behavior.name}
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-section-title mb-4 mt-6">
            Perilaku Negatif
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {negativeBehaviors.slice(0, 6).map((behavior) => (
              <div
                key={behavior.id}
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--danger)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
                  <Badge variant="danger" className="text-caption">
                    {behavior.pointValue}
                  </Badge>
                </div>
                <p className="font-medium text-[var(--text-primary)]">
                  {behavior.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "danger" | "info"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-stat-lg text-[var(--text-primary)]">{value}</p>
          <p className="text-caption text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
    </Card>
  )
}
