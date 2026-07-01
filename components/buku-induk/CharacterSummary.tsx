"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertCircle,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"
import { Card, Badge } from "@/components/ui"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface CharacterRecord {
  id: string
  date: string
  behavior_name: string
  category_name: string
  point_value: number
  is_positive: boolean
  description: string | null
}

interface CharacterSummaryProps {
  studentId: string
  academicYearId?: string
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getPointsColor(points: number): { bg: string; text: string } {
  if (points > 0) return { bg: "bg-[var(--success-soft)]", text: "text-[var(--success)]" }
  if (points < 0) return { bg: "bg-[var(--danger-soft)]", text: "text-[var(--danger)]" }
  return { bg: "bg-[var(--surface-secondary)]", text: "text-[var(--text-muted)]" }
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string
  value: number
  subtitle?: string
  icon: React.ElementType
  color: string
}

function StatCard({ label, value, subtitle, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-[var(--surface-secondary)] rounded-[20px] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-[14px] flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-[12px] text-[var(--text-muted)] mb-1">{label}</p>
      <p className={cn("text-[20px] font-bold", getPointsColor(value).text)}>
        {value > 0 ? `+${value}` : value}
      </p>
      {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-1">{subtitle}</p>}
    </div>
  )
}

// ============================================
// TREND CARD
// ============================================

interface TrendCardProps {
  current: number
  previous: number
  label: string
}

function TrendCard({ current, previous, label }: TrendCardProps) {
  const diff = current - previous
  const isPositive = diff > 0
  const isNegative = diff < 0
  const isNeutral = diff === 0

  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-[14px]">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isPositive && "bg-[var(--success-soft)]",
          isNegative && "bg-[var(--danger-soft)]",
          isNeutral && "bg-[var(--surface-hover)]"
        )}
      >
        {isPositive && <TrendingUp className="w-4 h-4 text-[var(--success)]" />}
        {isNegative && <TrendingDown className="w-4 h-4 text-[var(--danger)]" />}
        {isNeutral && <Minus className="w-4 h-4 text-[var(--text-muted)]" />}
      </div>
      <div>
        <p className={cn("text-[13px] font-medium", getPointsColor(diff).text)}>
          {diff > 0 ? `+${diff}` : diff} poin
        </p>
        <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  )
}

// ============================================
// RECENT RECORDS
// ============================================

interface RecentRecordsProps {
  records: CharacterRecord[]
}

function RecentRecords({ records }: RecentRecordsProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-6">
        <Heart className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-[13px] text-[var(--text-muted)]">Belum ada catatan karakter</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {records.slice(0, 5).map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                record.is_positive ? "bg-[var(--success-soft)]" : "bg-[var(--danger-soft)]"
              )}
            >
              {record.is_positive ? (
                <ThumbsUp className="w-4 h-4 text-[var(--success)]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
              )}
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                {record.behavior_name}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {record.category_name} • {formatDate(record.date)}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-[12px] font-medium",
              record.is_positive ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--danger-soft)] text-[var(--danger)]"
            )}
          >
            {record.is_positive ? `+${record.point_value}` : record.point_value}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CharacterSummary({ studentId, academicYearId }: CharacterSummaryProps) {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<CharacterRecord[]>([])
  const [stats, setStats] = useState({
    positive: 0,
    negative: 0,
    net: 0,
    total: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query
        let query = supabase
          .from("character_records")
          .select(
            `
            id,
            date,
            description,
            behavior_types!inner(
              name,
              point_value,
              is_positive,
              character_categories!inner(name)
            )
          `
          )
          .eq("student_id", studentId)
          .eq("status", "approved")
          .order("date", { ascending: false })

        if (academicYearId) {
          query = query.eq("academic_year_id", academicYearId)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        // Transform data
        const transformedRecords: CharacterRecord[] = (data || []).map((r: any) => ({
          id: r.id,
          date: r.date,
          behavior_name: r.behavior_types?.name || "Perilaku",
          category_name: r.behavior_types?.character_categories?.name || "Kategori",
          point_value: r.behavior_types?.point_value || 0,
          is_positive: r.behavior_types?.is_positive || false,
          description: r.description,
        }))

        // Calculate stats
        const positive = transformedRecords
          .filter((r) => r.is_positive)
          .reduce((sum, r) => sum + r.point_value, 0)
        const negative = transformedRecords
          .filter((r) => !r.is_positive)
          .reduce((sum, r) => sum + Math.abs(r.point_value), 0)

        setRecords(transformedRecords)
        setStats({
          positive,
          negative: -negative,
          net: positive - negative,
          total: transformedRecords.length,
        })
      } catch (err) {
        console.error("Error fetching character:", err)
        setError("Gagal memuat data karakter")
      } finally {
        setLoading(false)
      }
    }

    fetchCharacter()
  }, [studentId, academicYearId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--surface-hover)] rounded-[20px] animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-[var(--surface-hover)] rounded-[20px] animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <Card padding="lg" className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-[var(--danger)] mx-auto mb-4" />
        <p className="text-[14px] text-[var(--danger)]">{error}</p>
      </Card>
    )
  }

  if (records.length === 0) {
    return (
      <Card padding="lg" className="text-center py-8">
        <Heart className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">
          Belum Ada Catatan Karakter
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-6">
          Catatan karakter akan muncul setelah siswa memiliki记录 di modul karakter
        </p>
        <Link
          href="/karakter"
          className="inline-flex items-center gap-2 text-[var(--primary)] text-[13px] font-medium hover:underline"
        >
          Buka Modul Karakter
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    )
  }

  // Calculate class ranking
  // Note: This would need a proper calculation with class average

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Poin"
          value={stats.net}
          subtitle={stats.net >= 0 ? "Positif" : "Negatif"}
          icon={Heart}
          color={cn(
            stats.net >= 0 ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--danger-soft)] text-[var(--danger)]"
          )}
        />
        <StatCard
          label="Poin Positif"
          value={stats.positive}
          icon={ThumbsUp}
          color="bg-[var(--success-soft)] text-[var(--success)]"
        />
        <StatCard
          label="Poin Negatif"
          value={stats.negative}
          icon={AlertTriangle}
          color="bg-[var(--danger-soft)] text-[var(--danger)]"
        />
        <StatCard
          label="Total Catatan"
          value={stats.total}
          icon={Heart}
          color="bg-blue-100 text-blue-500"
        />
      </div>

      {/* Recent Activity */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Catatan Terbaru
          </h3>
          <Link
            href={`/karakter/siswa/${studentId}`}
            className="text-[12px] text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <RecentRecords records={records} />
      </Card>

      {/* Summary Info */}
      <Card padding="lg">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Ringkasan
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
            <span className="text-[13px] text-[var(--text-primary)]">Catatan Positif</span>
            <Badge variant="success">
              {records.filter((r) => r.is_positive).length} kali
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
            <span className="text-[13px] text-[var(--text-primary)]">Catatan Negatif</span>
            <Badge variant="danger">
              {records.filter((r) => !r.is_positive).length} kali
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
            <span className="text-[13px] text-[var(--text-primary)]">Rasio Positif/Negatif</span>
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              {records.filter((r) => !r.is_positive).length === 0
                ? "Sempurna"
                : `${(
                    records.filter((r) => r.is_positive).length /
                    records.filter((r) => !r.is_positive).length
                  ).toFixed(1)}:1`}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
