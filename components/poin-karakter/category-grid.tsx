"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui"
import { CharacterCategoryRecord } from "@/types/character"
import { Award, Shield, Heart, Star, Target, Zap } from "lucide-react"

// Icon mapping based on category name
const categoryIcons: Record<string, typeof Award> = {
  discipline: Shield,
  tanggung: Target,
  tanggung_jawab: Target,
  responsibility: Target,
  leadership: Star,
  kepemimpinan: Star,
  courtesy: Heart,
  sopan_santun: Heart,
  integrity: Award,
  integritas: Award,
  teamwork: Zap,
  kerja_tim: Zap,
  attendance: Award,
  kehadiran: Award,
  appearance: Award,
  penampilan: Award,
  safety: Shield,
  keamanan: Shield,
  religious: Award,
  religiosa: Award,
}

interface CategoryGridProps {
  categories: CharacterCategoryRecord[]
  onCategoryClick?: (categoryId: string) => void
  selectedCategoryId?: string
  className?: string
}

export function CategoryGrid({
  categories,
  onCategoryClick,
  selectedCategoryId,
  className,
}: CategoryGridProps) {
  const getIcon = (category: CharacterCategoryRecord) => {
    const iconName = category.name.toLowerCase()
    for (const key of Object.keys(categoryIcons)) {
      if (iconName.includes(key)) {
        return categoryIcons[key]
      }
    }
    return Award
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-5 gap-3", className)}>
      {categories.map((category) => {
        const Icon = getIcon(category)
        const isSelected = category.id === selectedCategoryId

        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 text-left",
              "hover:shadow-md hover:-translate-y-0.5",
              isSelected
                ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-sm"
                : "border-[var(--border-light)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
            )}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
              {category.name}
            </p>
            {category.description && (
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                {category.description}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface CategoryListProps {
  categories: CharacterCategoryRecord[]
  onCategoryClick?: (categoryId: string) => void
  selectedCategoryId?: string
  className?: string
}

export function CategoryList({
  categories,
  onCategoryClick,
  selectedCategoryId,
  className,
}: CategoryListProps) {
  const getIcon = (category: CharacterCategoryRecord) => {
    const iconName = category.name.toLowerCase()
    for (const key of Object.keys(categoryIcons)) {
      if (iconName.includes(key)) {
        return categoryIcons[key]
      }
    }
    return Award
  }

  return (
    <div className={cn("space-y-2", className)}>
      {categories.map((category) => {
        const Icon = getIcon(category)
        const isSelected = category.id === selectedCategoryId

        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category.id)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left",
              isSelected
                ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                : "border-[var(--border-light)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
            )}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[var(--text-primary)]">
                {category.name}
              </p>
              {category.description && (
                <p className="text-[12px] text-[var(--text-muted)] truncate">
                  {category.description}
                </p>
              )}
            </div>
            <Badge
              variant={
                category.status === "active" ? "success" : "default"
              }
              className="text-[10px]"
            >
              {category.status === "active" ? "Aktif" : "Nonaktif"}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

// Inline Badge import
import { Badge } from "@/components/ui/badge"
