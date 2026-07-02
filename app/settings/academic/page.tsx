"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/useSettings"
import { Save, Plus, Trash2, Check, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AcademicSettingsPage() {
  const { settings, updateAcademicSettings } = useSettings()
  const { academic } = settings
  const [activeTab, setActiveTab] = useState<"year" | "semester" | "grading">("year")

  const activeYear = academic.academicYears.find((y) => y.id === academic.activeAcademicYear)
  const activeSem = academic.semesters.find((s) => s.id === academic.activeSemester)

  return (
    <AppShell title="Pengaturan Akademik" description="Konfigurasi tahun ajaran dan semester">
      <div className="max-w-4xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("year")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "year"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Tahun Ajaran
          </button>
          <button
            onClick={() => setActiveTab("semester")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "semester"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Semester
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "grading"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            )}
          >
            Sistem Penilaian
          </button>
        </div>

        {/* Academic Years Tab */}
        {activeTab === "year" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Tahun Ajaran
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Aktif: {activeYear?.name || "Tidak ada"}
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Tahun Ajaran
              </Button>
            </div>

            <div className="space-y-3">
              {academic.academicYears.map((year) => (
                <div
                  key={year.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors",
                    year.id === academic.activeAcademicYear
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        year.id === academic.activeAcademicYear
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                      )}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {year.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {year.startDate} - {year.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {year.id === academic.activeAcademicYear ? (
                      <Badge className="bg-[var(--primary)]">Aktif</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateAcademicSettings({ activeAcademicYear: year.id })
                        }
                      >
                        Jadikan Aktif
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Semesters Tab */}
        {activeTab === "semester" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Semester
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Aktif: {activeSem?.name || "Tidak ada"}
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Semester
              </Button>
            </div>

            <div className="space-y-3">
              {academic.semesters.map((sem) => (
                <div
                  key={sem.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors",
                    sem.id === academic.activeSemester
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        sem.id === academic.activeSemester
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                      )}
                    >
                      {sem.type === "ganjil" ? "1" : "2"}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {sem.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {sem.startDate} - {sem.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sem.id === academic.activeSemester ? (
                      <Badge className="bg-[var(--primary)]">Aktif</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateAcademicSettings({ activeSemester: sem.id })
                        }
                      >
                        Jadikan Aktif
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Grading Scale Tab */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            {/* Grading Scale */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Skala Penilaian
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {academic.gradingScale.name}
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Grade
                </Button>
              </div>

              <div className="space-y-3">
                {academic.gradingScale.intervals.map((interval) => (
                  <div
                    key={interval.grade}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)]"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: interval.color }}
                    >
                      {interval.grade}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)]">
                        {interval.description}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {interval.minScore} - {interval.maxScore}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {interval.isPassing ? (
                        <Badge className="bg-[var(--success)]">Lulus</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[var(--danger)] border-[var(--danger)]">
                          Tidak Lulus
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-[var(--text-muted)]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Other Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                Pengaturan Lainnya
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      Batas Kehadiran
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Minimum kehadiran untuk lulus
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={academic.attendanceThreshold}
                      onChange={(e) =>
                        updateAcademicSettings({
                          attendanceThreshold: parseInt(e.target.value) || 80,
                        })
                      }
                      className="w-20 px-3 py-2 border border-[var(--border)] rounded-lg text-center"
                      min={0}
                      max={100}
                    />
                    <span className="text-[var(--text-muted)]">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      Nilai Kelulusan
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Minimum nilai untuk lulus
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={academic.passingGrade}
                      onChange={(e) =>
                        updateAcademicSettings({
                          passingGrade: parseInt(e.target.value) || 75,
                        })
                      }
                      className="w-20 px-3 py-2 border border-[var(--border)] rounded-lg text-center"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
