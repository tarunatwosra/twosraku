"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  ArrowRight,
  Star,
} from "lucide-react"
import Link from "next/link"
import { Card, Badge } from "@/components/ui"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface AssessmentScore {
  id: string
  template_name: string
  category_name: string
  score: number
  max_score: number
  grade: string | null
  semester: string
  date: string
}

interface AssessmentSummaryProps {
  studentId: string
  academicYearId?: string
}

// ============================================
// HELPERS
// ============================================

function getGradeFromScore(score: number, maxScore: number): { letter: string; color: string } {
  const percentage = (score / maxScore) * 100

  if (percentage >= 90) return { letter: "A", color: "text-[var(--success)]" }
  if (percentage >= 80) return { letter: "B", color: "text-blue-500" }
  if (percentage >= 70) return { letter: "C", color: "text-[var(--warning)]" }
  if (percentage >= 60) return { letter: "D", color: "text-orange-500" }
  return { letter: "E", color: "text-[var(--danger)]" }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getAverage(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
  color: string
}

function StatCard({ label, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-[var(--surface-secondary)] rounded-[20px] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-[14px] flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              trend === "up" && "bg-[var(--success-soft)]",
              trend === "down" && "bg-[var(--danger-soft)]",
              trend === "neutral" && "bg-[var(--surface-hover)]"
            )}
          >
            {trend === "up" && <TrendingUp className="w-3 h-3 text-[var(--success)]" />}
            {trend === "down" && <TrendingDown className="w-3 h-3 text-[var(--danger)]" />}
          </div>
        )}
      </div>
      <p className="text-[12px] text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-[20px] font-bold text-[var(--text-primary)]">{value}</p>
      {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-1">{subtitle}</p>}
    </div>
  )
}

// ============================================
// GRADE DISTRIBUTION
// ============================================

interface GradeDistributionProps {
  scores: AssessmentScore[]
}

function GradeDistribution({ scores }: GradeDistributionProps) {
  const grades = ["A", "B", "C", "D", "E"]
  const distribution = grades.map((grade) => {
    const count = scores.filter((s) => s.grade === grade).length
    return { grade, count }
  })
  const maxCount = Math.max(...distribution.map((d) => d.count), 1)

  return (
    <div className="space-y-2">
      {distribution.map(({ grade, count }) => {
        const percentage = (count / maxCount) * 100
        const gradeInfo = getGradeFromScore(
          grades.indexOf(grade) === 0 ? 95 : 100 - grades.indexOf(grade) * 15,
          100
        )

        return (
          <div key={grade} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-secondary)] flex items-center justify-center">
              <span className={cn("text-[13px] font-bold", gradeInfo.color)}>{grade}</span>
            </div>
            <div className="flex-1">
              <div className="h-6 bg-[var(--surface-secondary)] rounded-[10px] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-[10px] transition-all",
                    grade === "A" && "bg-[var(--success)]",
                    grade === "B" && "bg-blue-400",
                    grade === "C" && "bg-[var(--warning)]",
                    grade === "D" && "bg-orange-400",
                    grade === "E" && "bg-[var(--danger)]"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-[13px] font-medium text-[var(--text-primary)] w-8 text-right">
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// RECENT SCORES
// ============================================

interface RecentScoresProps {
  scores: AssessmentScore[]
}

function RecentScores({ scores }: RecentScoresProps) {
  if (scores.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-[13px] text-[var(--text-muted)]">Belum ada nilai</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {scores.slice(0, 5).map((score) => {
        const gradeInfo = getGradeFromScore(score.score, score.max_score)

        return (
          <div
            key={score.id}
            className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                {score.template_name}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {score.category_name} • {formatDate(score.date)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {score.score}/{score.max_score}
                </p>
              </div>
              <div
                className={cn(
                  "w-8 h-8 rounded-[10px] flex items-center justify-center",
                  (score.grade || gradeInfo.letter) === "A" && "bg-[var(--success-soft)]",
                  (score.grade || gradeInfo.letter) === "B" && "bg-blue-100",
                  (score.grade || gradeInfo.letter) === "C" && "bg-[var(--warning-soft)]",
                  (score.grade || gradeInfo.letter) === "D" && "bg-orange-100",
                  (score.grade || gradeInfo.letter) === "E" && "bg-[var(--danger-soft)]"
                )}
              >
                <span className={cn("text-[13px] font-bold", gradeInfo.color)}>
                  {score.grade || gradeInfo.letter}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AssessmentSummary({ studentId, academicYearId }: AssessmentSummaryProps) {
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<AssessmentScore[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get assessment participants for this student
        const { data: participants, error: participantsError } = await supabase
          .from("assessment_participants")
          .select("id, session_id, assessment_sessions(name, semester_id)")
          .eq("student_id", studentId)

        if (participantsError) throw participantsError

        if (!participants || participants.length === 0) {
          setScores([])
          return
        }

        // Get scores for these participants
        const participantIds = participants.map((p) => p.id)
        const { data: studentScores, error: scoresError } = await supabase
          .from("student_scores")
          .select(
            `
            id,
            raw_score,
            final_score,
            grade,
            scored_at,
            participant_id,
            assessment_items(name, max_score, weight),
            assessment_participants!inner(session_id, assessment_sessions(name, semester_id))
          `
          )
          .in("participant_id", participantIds)
          .eq("status", "approved")

        if (scoresError) throw scoresError

        // Transform data
        const transformedScores: AssessmentScore[] = (studentScores || []).map((s: any) => ({
          id: s.id,
          template_name: s.assessment_participants?.assessment_sessions?.name || "Nilai",
          category_name: s.assessment_items?.name || "Aspek",
          score: s.final_score || s.raw_score || 0,
          max_score: s.assessment_items?.max_score || 100,
          grade: s.grade,
          semester: s.assessment_participants?.assessment_sessions?.semester_id || "",
          date: s.scored_at,
        }))

        // Sort by date
        transformedScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setScores(transformedScores)
      } catch (err) {
        console.error("Error fetching assessment:", err)
        setError("Gagal memuat data penilaian")
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
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

  if (scores.length === 0) {
    return (
      <Card padding="lg" className="text-center py-8">
        <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="text-[16px] font-medium text-[var(--text-primary)] mb-2">
          Belum Ada Data Penilaian
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mb-6">
          Data penilaian akan muncul setelah siswa memiliki nilai di modul penilaian
        </p>
        <Link
          href="/penilaian"
          className="inline-flex items-center gap-2 text-[var(--primary)] text-[13px] font-medium hover:underline"
        >
          Buka Modul Penilaian
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    )
  }

  // Calculate stats
  const totalScores = scores.length
  const averageScore = getAverage(scores.map((s) => (s.score / s.max_score) * 100))
  const gradeCounts = scores.reduce(
    (acc, s) => {
      const grade = s.grade || getGradeFromScore(s.score, s.max_score).letter
      acc[grade] = (acc[grade] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const highestGrade = Object.entries(gradeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Penilaian"
          value={totalScores}
          icon={BookOpen}
          color="bg-blue-100 text-blue-500"
        />
        <StatCard
          label="Rata-rata Nilai"
          value={`${averageScore.toFixed(1)}%`}
          icon={Award}
          trend={averageScore >= 80 ? "up" : averageScore >= 60 ? "neutral" : "down"}
          color="bg-[var(--success-soft)] text-[var(--success)]"
        />
        <StatCard
          label="Nilai Tertinggi"
          value={Math.max(...scores.map((s) => (s.score / s.max_score) * 100)).toFixed(0) + "%"}
          icon={Star}
          trend="up"
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          label="Grade Dominan"
          value={highestGrade}
          icon={Award}
          color="bg-purple-100 text-purple-500"
        />
      </div>

      {/* Grade Distribution */}
      <Card padding="lg">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Distribusi Grade
        </h3>
        <GradeDistribution scores={scores} />
      </Card>

      {/* Recent Scores */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Nilai Terbaru
          </h3>
          <Link
            href={`/penilaian/siswa/${studentId}`}
            className="text-[12px] text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <RecentScores scores={scores} />
      </Card>
    </div>
  )
}
