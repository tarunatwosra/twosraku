"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment, useAssessmentSession } from "@/hooks/useAssessment"
import { type StudentScore, DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  Save,
  Download,
  Upload,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Inner component that uses useSearchParams
function AssessmentInputContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session") || "ses-1"

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { templates, categories } = useAssessment()
  const { session, template, category, items, participants, calculateGrade } = useAssessmentSession(sessionId)

  const [scores, setScores] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    setHasChanges(scores.size > 0)
  }, [scores])

  // Handle score change
  const handleScoreChange = useCallback((participantId: string, itemId: string, value: string) => {
    const score = parseFloat(value) || 0
    const key = `${participantId}-${itemId}`
    setScores((prev) => {
      const newMap = new Map(prev)
      newMap.set(key, score)
      return newMap
    })
  }, [])

  // Get score for a specific participant-item
  const getScore = useCallback((participantId: string, itemId: string) => {
    const key = `${participantId}-${itemId}`
    return scores.get(key) ?? ""
  }, [scores])

  // Calculate average for a participant
  const getParticipantAverage = useCallback((participantId: string) => {
    let total = 0
    let count = 0
    items.forEach((item) => {
      const key = `${participantId}-${item.id}`
      const score = scores.get(key)
      if (score !== undefined) {
        total += score
        count++
      }
    })
    if (count === 0) return null
    return total / count
  }, [scores, items])

  // Reset all scores
  const handleReset = () => {
    setScores(new Map())
    setHasChanges(false)
  }

  // Save scores
  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHasChanges(false)
    } finally {
      setSaving(false)
    }
  }

  // Mark all as default (0 or empty)
  const handleMarkAllZero = () => {
    const newScores = new Map<string, number>()
    participants.forEach((p) => {
      items.forEach((item) => {
        const key = `${p.id}-${item.id}`
        newScores.set(key, 0)
      })
    })
    setScores(newScores)
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

  // Check if session is locked
  const isLocked = session?.locked || false

  return (
    <AppShell
      title={session?.name || "Input Nilai"}
      description={`${category?.name || ""} - ${template?.name || ""}`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Session Info */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-secondary)] rounded-[18px]">
              <Badge variant="primary">{participants.length} Peserta</Badge>
              <Badge variant="primary">{items.length} Item</Badge>
              {isLocked && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Terkunci
                </Badge>
              )}
            </div>

            {hasChanges && (
              <Badge variant="warning" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                Ada perubahan belum disimpan
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllZero}>
              <RotateCcw className="w-4 h-4" />
              Reset Nilai
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <div className="w-px h-8 bg-[var(--border-light)]" />
            <Button
              onClick={handleSave}
              isLoading={saving}
              disabled={!hasChanges || isLocked}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </div>

        {/* Weight Info */}
        {template && (
          <Card className="p-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-[var(--text-muted)]">
                <span className="font-medium">Metode:</span>{" "}
                {template.scoringMethod === "weighted_average" ? "Rata-rata Tertimbang" :
                 template.scoringMethod === "simple_average" ? "Rata-rata Sederhana" : "Template.scoringMethod"}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                <span className="font-medium">Skor:</span> {template.minScore} - {template.maxScore}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                <span className="font-medium">Nilai Lulus:</span> {template.passingScore}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                <span className="font-medium">Total Bobot:</span>{" "}
                {items.reduce((sum, item) => sum + item.weight, 0)}%
              </div>
            </div>
          </Card>
        )}

        {/* Score Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)] sticky left-0 bg-[var(--surface-secondary)] z-10 min-w-[60px]">
                    No
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)] sticky left-0 bg-[var(--surface-secondary)] z-10 min-w-[200px]">
                    Nama Siswa
                  </th>
                  {items.map((item) => (
                    <th
                      key={item.id}
                      className="text-center px-3 py-4 text-[12px] font-semibold min-w-[100px]"
                      title={`${item.name} (Bobot: ${item.weight}%)`}
                    >
                      <div className="writing-mode-vertical" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                        {item.name}
                      </div>
                      <div className="text-[10px] font-normal text-[var(--text-muted)] mt-1">
                        {item.weight}%
                      </div>
                    </th>
                  ))}
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)] min-w-[80px] bg-[var(--surface-secondary)]">
                    Rata-rata
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)] min-w-[60px] bg-[var(--surface-secondary)]">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => {
                  const avg = getParticipantAverage(participant.id)
                  const grade = avg !== null ? calculateGrade(avg) : null

                  return (
                    <tr
                      key={participant.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[14px] text-[var(--text-muted)] sticky left-0 bg-white z-10">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {participant.student.name}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)]">
                          {participant.student.studentNumber}
                        </p>
                      </td>
                      {items.map((item) => (
                        <td key={item.id} className="px-2 py-3 text-center">
                          <input
                            type="number"
                            min={item.minScore}
                            max={item.maxScore}
                            step={template?.allowDecimal ? "0.1" : "1"}
                            value={getScore(participant.id, item.id)}
                            onChange={(e) => handleScoreChange(participant.id, item.id, e.target.value)}
                            disabled={isLocked}
                            className={cn(
                              "w-full h-10 px-2 text-center text-[14px] rounded-[14px] border transition-all",
                              "focus:outline-none focus:ring-2",
                              isLocked
                                ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] cursor-not-allowed"
                                : "bg-white border-[var(--border-default)] focus:border-[var(--border-focus)] focus:ring-[var(--primary-soft)]"
                            )}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center bg-[var(--surface-secondary)]">
                        {avg !== null ? (
                          <span className={cn(
                            "text-[14px] font-semibold",
                            avg >= (template?.passingScore || 75) ? "text-[var(--success)]" : "text-[var(--danger)]"
                          )}>
                            {avg.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[14px] text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center bg-[var(--surface-secondary)]">
                        {grade ? (
                          <Badge
                            variant={
                              grade === "A" ? "success" :
                              grade === "B" ? "info" :
                              grade === "C" ? "warning" : "danger"
                            }
                          >
                            {grade}
                          </Badge>
                        ) : (
                          <span className="text-[14px] text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border-light)] bg-[var(--surface-secondary)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Menampilkan {participants.length} peserta
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--text-muted)]">Grade:</span>
                  {DEFAULT_GRADING_SCALE.map((g) => (
                    <Badge
                      key={g.grade}
                      variant={
                        g.grade === "A" ? "success" :
                        g.grade === "B" ? "info" :
                        g.grade === "C" ? "warning" : "danger"
                      }
                      className="text-[11px]"
                    >
                      {g.grade}: {g.minScore}-{g.maxScore}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">Rata-rata Kelas</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {participants.length > 0
                ? (
                    Array.from(scores.values()).reduce((sum, s) => sum + s, 0) /
                    (Array.from(scores.values()).length || 1)
                  ).toFixed(1)
                : "-"}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">Nilai Tertinggi</p>
            <p className="text-2xl font-bold text-[var(--success)]">
              {scores.size > 0 ? Math.max(...Array.from(scores.values())).toFixed(1) : "-"}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">Nilai Terendah</p>
            <p className="text-2xl font-bold text-[var(--danger)]">
              {scores.size > 0 ? Math.min(...Array.from(scores.values())).toFixed(1) : "-"}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">Lulus</p>
            <p className="text-2xl font-bold text-[var(--info)]">
              {participants.length > 0
                ? participants.filter((p) => {
                    const avg = getParticipantAverage(p.id)
                    return avg !== null && avg >= (template?.passingScore || 75)
                  }).length
                : 0} / {participants.length}
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)]">Memuat...</p>
      </div>
    </div>
  )
}

// Main export with Suspense
export default function AssessmentInputPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AssessmentInputContent />
    </Suspense>
  )
}
