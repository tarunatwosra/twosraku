"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useAssessment } from "@/hooks/useAssessment"
import { SessionStatus, DEFAULT_GRADING_SCALE } from "@/types/assessment"
import {
  Plus,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  GraduationCap,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<SessionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "neutral", icon: <Clock className="w-4 h-4" /> },
  open: { label: "Terbuka", color: "info", icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: "Berlangsung", color: "warning", icon: <Clock className="w-4 h-4" /> },
  completed: { label: "Selesai", color: "success", icon: <CheckCircle2 className="w-4 h-4" /> },
  reviewed: { label: "Ditinjau", color: "info", icon: <CheckCircle2 className="w-4 h-4" /> },
  locked: { label: "Terkunci", color: "neutral", icon: <Lock className="w-4 h-4" /> },
  archived: { label: "Arsip", color: "neutral", icon: <FileText className="w-4 h-4" /> },
}

export default function AssessmentPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { sessions, categories, templates, statistics } = useAssessment()

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

  const activeSessions = sessions.filter(
    (s) => s.status === "open" || s.status === "in_progress"
  )
  const recentSessions = sessions.slice(0, 5)

  return (
    <AppShell title="Penilaian" description="Kelola penilaian siswa">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/penilaian/session/baru">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Sesi Penilaian
              </Button>
            </Link>
            <Link href="/penilaian/template">
              <Button variant="outline" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Kelola Template
              </Button>
            </Link>
            <Link href="/penilaian/input">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Input Nilai
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sesi"
            value={statistics.totalSessions}
            subtitle="seluruh sesi"
            icon={<FileText className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Sesi Aktif"
            value={statistics.activeSessions}
            subtitle="sedang berlangsung"
            icon={<Clock className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            title="Sesi Selesai"
            value={statistics.completedSessions}
            subtitle="sudah dikunci"
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Template"
            value={templates.length}
            subtitle="template penilaian"
            icon={<Target className="w-5 h-5" />}
            color="info"
          />
        </div>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Kategori Penilaian
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <p className="font-medium text-[var(--text-primary)]">
                  {category.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {templates.filter((t) => t.categoryId === category.id).length} template
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Sesi Aktif
              </h2>
              <Badge variant="warning">{activeSessions.length} sesi</Badge>
            </div>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/penilaian/session/${session.id}`}
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                        <Target className="w-6 h-6 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {session.name}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {session.classId ? "Kelas " + session.classId : "Semua kelas"} •{" "}
                          {session.startDate || session.endDate || "Tanpa batas"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusConfig[session.status].color as any}>
                        {statusConfig[session.status].icon}
                        <span className="ml-1">{statusConfig[session.status].label}</span>
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Sesi Terbaru
            </h2>
            <Link
              href="/penilaian/session"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/penilaian/session/${session.id}`}
              >
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {session.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {session.startDate || session.endDate || "Tanpa tanggal"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusConfig[session.status].color as any}>
                      {statusConfig[session.status].label}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Quick Grading Scale */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Sistem Penilaian
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {DEFAULT_GRADING_SCALE.map((grade) => (
              <div
                key={grade.grade}
                className="text-center p-4 rounded-lg border border-[var(--border)]"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-2"
                  style={{ backgroundColor: grade.color }}
                >
                  {grade.grade}
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {grade.description}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {grade.minScore} - {grade.maxScore}
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
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
    </Card>
  )
}
