"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessmentNew } from "@/hooks/useAssessmentNew"
import { DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  Search,
  FileText,
  Layers,
  Calculator,
  ChevronDown,
  ChevronRight,
  User,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================
// HASIL PENILAIAN PAGE
// ============================================

export default function HasilPenilaianPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    categories,
    periods,
    items,
    formulas,
    loading,
  } = useAssessmentNew()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState<"all" | "kategori" | "formula" | "rapor">("all")
  const [expandedSections, setExpandedSections] = useState<string[]>(["kategori", "formula", "rapor"])
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all")

  // Mock data untuk demo (nanti ini akan diambil dari database)
  // Sample students
  const sampleStudents = [
    { id: "1", name: "Ahmad Fauzi", studentNumber: "2024001", class: "X IPA 1" },
    { id: "2", name: "Budi Santoso", studentNumber: "2024002", class: "X IPA 1" },
    { id: "3", name: "Citra Dewi", studentNumber: "2024003", class: "X IPA 1" },
    { id: "4", name: "Dian Pratama", studentNumber: "2024004", class: "X IPA 2" },
    { id: "5", name: "Eko Wijaya", studentNumber: "2024005", class: "X IPA 2" },
  ]

  // Mock scores untuk demo
  const mockScores = useMemo(() => {
    const scores: Record<string, Record<string, number>> = {}

    sampleStudents.forEach((student) => {
      scores[student.id] = {}
      // Kategori scores
      categories.forEach((cat) => {
        scores[student.id][`kategori_${cat.id}`] = Math.round(70 + Math.random() * 30)
      })
      // Formula scores
      formulas.forEach((formula) => {
        scores[student.id][`formula_${formula.id}`] = Math.round(70 + Math.random() * 30)
      })
      // Total rapor
      scores[student.id]["rapor_total"] = Math.round(70 + Math.random() * 30)
    })

    return scores
  }, [categories, formulas])

  // Get grade from score
  const getGrade = (score: number) => {
    for (const g of DEFAULT_GRADING_SCALE) {
      if (score >= g.minScore && score <= g.maxScore) return g
    }
    return DEFAULT_GRADING_SCALE[DEFAULT_GRADING_SCALE.length - 1]
  }

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  // Filter students by search
  const filteredStudents = sampleStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    return matchesSearch && matchesClass
  })

  // Get unique classes
  const uniqueClasses = useMemo(() => {
    return [...new Set(sampleStudents.map((s) => s.class))]
  }, [])

  // Calculate class statistics
  const calculateStats = (scoreKey: string) => {
    const scores = filteredStudents
      .map((s) => mockScores[s.id]?.[scoreKey])
      .filter((s) => s !== undefined) as number[]

    if (scores.length === 0) return { avg: 0, min: 0, max: 0, count: 0 }

    return {
      avg: scores.reduce((sum, s) => sum + s, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores),
      count: scores.length,
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
      title="Hasil Penilaian"
      description="Lihat nilai per kategori, formula, dan total nilai rapor"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">Hasil Penilaian</h1>
            <p className="text-[13px] text-[var(--text-muted)]">
              Lihat rekapitulasi nilai per kategori, formula, dan total nilai rapor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari nama atau nomor siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-10 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
            >
              <option value="all">Semua Kelas</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-body-sm text-[var(--text-muted)]">Jumlah Siswa</p>
            <p className="text-stat-lg text-[var(--text-primary)]">
              {filteredStudents.length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-body-sm text-[var(--text-muted)]">Rata-rata Rapor</p>
            <p className="text-stat-lg text-[var(--info)]">
              {calculateStats("rapor_total").avg.toFixed(1)}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-body-sm text-[var(--text-muted)]">Nilai Tertinggi</p>
            <p className="text-stat-lg text-[var(--success)]">
              {calculateStats("rapor_total").max}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-body-sm text-[var(--text-muted)]">Nilai Terendah</p>
            <p className="text-stat-lg text-[var(--danger)]">
              {calculateStats("rapor_total").min || "-"}
            </p>
          </Card>
        </div>

        {/* Results by Section */}
        <div className="space-y-4">
          {/* NILAI PER KATEGORI */}
          {(selectedView === "all" || selectedView === "kategori") && (
            <Card className="overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => toggleSection("kategori")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                      Nilai Per Kategori
                    </h2>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {categories.length} kategori
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="primary">{categories.length} Kategori</Badge>
                  {expandedSections.includes("kategori") ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>
              </div>

              {expandedSections.includes("kategori") && (
                <div className="border-t border-[var(--border-light)]">
                  {/* Category Headers */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[var(--surface-secondary)]">
                        <tr>
                          <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)] sticky left-0 bg-[var(--surface-secondary)] z-10 min-w-[200px]">
                            Nama Siswa
                          </th>
                          {categories.map((cat) => (
                            <th
                              key={cat.id}
                              className="text-center px-4 py-3 text-[12px] font-semibold min-w-[100px]"
                              style={{ color: cat.color }}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>{cat.name}</span>
                                <span className="text-[10px] font-normal text-[var(--text-muted)]">
                                  {cat.periodCount || 0}x
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td
                              colSpan={categories.length + 1}
                              className="px-6 py-12 text-center"
                            >
                              <p className="text-[var(--text-muted)]">Tidak ada data siswa</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              className="border-t border-[var(--border-light)] hover:bg-[var(--surface-hover)]"
                            >
                              <td className="px-4 py-3 sticky left-0 bg-white z-10">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-[12px] font-semibold">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                      {student.name}
                                    </p>
                                    <p className="text-[11px] text-[var(--text-muted)]">
                                      {student.studentNumber}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              {categories.map((cat) => {
                                const score = mockScores[student.id]?.[`kategori_${cat.id}`]
                                const grade = score !== undefined ? getGrade(score) : null
                                return (
                                  <td
                                    key={cat.id}
                                    className="px-4 py-3 text-center"
                                  >
                                    {score !== undefined ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-semibold">
                                          {score.toFixed(0)}
                                        </span>
                                        <Badge
                                          variant={
                                            grade?.grade === "A"
                                              ? "success"
                                              : grade?.grade === "B"
                                              ? "info"
                                              : grade?.grade === "C"
                                              ? "warning"
                                              : "danger"
                                          }
                                          className="text-[10px]"
                                        >
                                          {grade?.grade}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <span className="text-[14px] text-[var(--text-muted)]">-</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* NILAI PER FORMULA */}
          {(selectedView === "all" || selectedView === "formula") && (
            <Card className="overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => toggleSection("formula")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                      Nilai Per Formula
                    </h2>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {formulas.length} formula
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="info">{formulas.length} Formula</Badge>
                  {expandedSections.includes("formula") ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>
              </div>

              {expandedSections.includes("formula") && (
                <div className="border-t border-[var(--border-light)]">
                  {formulas.length === 0 ? (
                    <div className="p-12 text-center">
                      <Calculator className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                      <p className="text-[14px] text-[var(--text-muted)] mb-2">
                        Belum ada formula
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        Buat formula di menu Formula terlebih dahulu
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[var(--surface-secondary)]">
                          <tr>
                            <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)] sticky left-0 bg-[var(--surface-secondary)] z-10 min-w-[200px]">
                              Nama Siswa
                            </th>
                            {formulas.map((formula) => (
                              <th
                                key={formula.id}
                                className="text-center px-4 py-3 text-[12px] font-semibold text-[var(--info)] min-w-[120px]"
                              >
                                {formula.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              className="border-t border-[var(--border-light)] hover:bg-[var(--surface-hover)]"
                            >
                              <td className="px-4 py-3 sticky left-0 bg-white z-10">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] flex items-center justify-center text-[12px] font-semibold">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                                      {student.name}
                                    </p>
                                    <p className="text-[11px] text-[var(--text-muted)]">
                                      {student.studentNumber}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              {formulas.map((formula) => {
                                const score = mockScores[student.id]?.[`formula_${formula.id}`]
                                const grade = score !== undefined ? getGrade(score) : null
                                return (
                                  <td
                                    key={formula.id}
                                    className="px-4 py-3 text-center"
                                  >
                                    {score !== undefined ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-semibold">
                                          {score.toFixed(0)}
                                        </span>
                                        <Badge
                                          variant={
                                            grade?.grade === "A"
                                              ? "success"
                                              : grade?.grade === "B"
                                              ? "info"
                                              : grade?.grade === "C"
                                              ? "warning"
                                              : "danger"
                                          }
                                          className="text-[10px]"
                                        >
                                          {grade?.grade}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <span className="text-[14px] text-[var(--text-muted)]">-</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* TOTAL NILAI RAPOR */}
          {(selectedView === "all" || selectedView === "rapor") && (
            <Card className="overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => toggleSection("rapor")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                      Total Nilai Rapor
                    </h2>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      Penjumlahan semua formula
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">
                    {filteredStudents.length} Siswa
                  </Badge>
                  {expandedSections.includes("rapor") ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>
              </div>

              {expandedSections.includes("rapor") && (
                <div className="border-t border-[var(--border-light)] p-4">
                  {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
                      <p className="text-[14px] text-[var(--text-muted)]">Tidak ada data siswa</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map((student) => {
                        const totalScore = mockScores[student.id]?.["rapor_total"]
                        const grade = totalScore !== undefined ? getGrade(totalScore) : null

                        return (
                          <div
                            key={student.id}
                            className="p-4 border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-[16px] font-bold">
                                {student.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                                  {student.name}
                                </p>
                                <p className="text-[12px] text-[var(--text-muted)]">
                                  {student.studentNumber} • {student.class}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                              <div>
                                <p className="text-[11px] text-[var(--text-muted)]">Total Nilai</p>
                                <p className="text-[20px] font-bold text-[var(--text-primary)]">
                                  {totalScore !== undefined ? totalScore.toFixed(0) : "-"}
                                </p>
                              </div>
                              {grade && (
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-bold text-white"
                                  style={{ backgroundColor: grade.color }}
                                >
                                  {grade.grade}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Grade Legend */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[var(--text-muted)]">Legenda Grade:</span>
            <div className="flex items-center gap-2">
              {DEFAULT_GRADING_SCALE.map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${g.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ backgroundColor: g.color }}
                  >
                    {g.grade}
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {g.minScore}-{g.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-[var(--info-soft)] border-[var(--info)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--info)] mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-[var(--info)]">Catatan</p>
              <p className="text-[12px] text-[var(--info)] mt-1">
                Data nilai yang ditampilkan adalah contoh/contoh. Untuk melihat data nyata,
                pastikan sudah ada data input nilai di menu "Input Nilai" dan formula sudah
                dikonfigurasi dengan benar.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
