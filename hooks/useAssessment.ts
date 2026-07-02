"use client"

import { useState, useCallback, useMemo } from "react"
import {
  AssessmentCategory,
  AssessmentTemplate,
  AssessmentItem,
  AssessmentSession,
  AssessmentParticipant,
  StudentScore,
  SessionStatus,
  DEFAULT_GRADING_SCALE,
} from "@/types/assessment"

// Demo categories
const DEMO_CATEGORIES: AssessmentCategory[] = [
  {
    id: "cat-1",
    name: "Disiplin",
    description: "Penilaian kedisiplinan siswa",
    icon: "Shield",
    color: "#3B82F6",
    displayOrder: 1,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "cat-2",
    name: "Leadership",
    description: "Penilaian kepemimpinan siswa",
    icon: "Crown",
    color: "#F59E0B",
    displayOrder: 2,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "cat-3",
    name: "Keterampilan",
    description: "Penilaian keterampilan praktis",
    icon: "Wrench",
    color: "#10B981",
    displayOrder: 3,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

// Demo templates
const DEMO_TEMPLATES: AssessmentTemplate[] = [
  {
    id: "tpl-1",
    categoryId: "cat-1",
    name: "Inspeksi Mingguan",
    description: "Inspeksi每周 kelengkapan dan kedisiplinan",
    academicYearScope: ["1", "2"],
    scoringMethod: "weighted_average",
    passingScore: 75,
    maxScore: 100,
    minScore: 0,
    allowDecimal: true,
    autoCalculate: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
  },
  {
    id: "tpl-2",
    categoryId: "cat-2",
    name: "Evaluasi Kepemimpinan",
    description: "Penilaian kemampuan kepemimpinan",
    academicYearScope: ["1", "2"],
    scoringMethod: "weighted_average",
    passingScore: 70,
    maxScore: 100,
    minScore: 0,
    allowDecimal: true,
    autoCalculate: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
  },
]

// Demo items
const DEMO_ITEMS: AssessmentItem[] = [
  {
    id: "item-1",
    templateId: "tpl-1",
    name: "Seragam",
    description: "Kelengkapan dan kebersihan seragam",
    scoreType: "numeric",
    weight: 20,
    minScore: 0,
    maxScore: 100,
    displayOrder: 1,
    required: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "item-2",
    templateId: "tpl-1",
    name: "Atensi",
    description: "Konsentrasi dan perhatian",
    scoreType: "numeric",
    weight: 30,
    minScore: 0,
    maxScore: 100,
    displayOrder: 2,
    required: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "item-3",
    templateId: "tpl-1",
    name: "Postur",
    description: "Berdiri dan sikap militer",
    scoreType: "numeric",
    weight: 25,
    minScore: 0,
    maxScore: 100,
    displayOrder: 3,
    required: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "item-4",
    templateId: "tpl-1",
    name: "Komandan",
    description: "Kemampuan menjadi komandan",
    scoreType: "numeric",
    weight: 25,
    minScore: 0,
    maxScore: 100,
    displayOrder: 4,
    required: true,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

// Demo sessions
const DEMO_SESSIONS: AssessmentSession[] = [
  {
    id: "ses-1",
    templateId: "tpl-1",
    name: "Inspeksi Minggu 1",
    academicYearId: "1",
    semesterId: "1",
    classId: "class-x-tkj-1",
    evaluatorId: "admin",
    startDate: "2025-01-06",
    endDate: "2025-01-06",
    status: "completed",
    locked: true,
    notes: "",
    createdAt: "2025-01-06",
    updatedAt: "2025-01-06",
  },
  {
    id: "ses-2",
    templateId: "tpl-1",
    name: "Inspeksi Minggu 2",
    academicYearId: "1",
    semesterId: "1",
    classId: "class-x-tkj-1",
    evaluatorId: "admin",
    startDate: "2025-01-13",
    endDate: "2025-01-13",
    status: "in_progress",
    locked: false,
    notes: "",
    createdAt: "2025-01-13",
    updatedAt: "2025-01-13",
  },
]

export function useAssessment() {
  const [categories, setCategories] = useState<AssessmentCategory[]>(DEMO_CATEGORIES)
  const [templates, setTemplates] = useState<AssessmentTemplate[]>(DEMO_TEMPLATES)
  const [items, setItems] = useState<AssessmentItem[]>(DEMO_ITEMS)
  const [sessions, setSessions] = useState<AssessmentSession[]>(DEMO_SESSIONS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get templates by category
  const getTemplatesByCategory = useCallback(
    (categoryId: string) => {
      return templates.filter((t) => t.categoryId === categoryId)
    },
    [templates]
  )

  // Get items by template
  const getItemsByTemplate = useCallback(
    (templateId: string) => {
      return items.filter((i) => i.templateId === templateId)
    },
    [items]
  )

  // Get sessions by template
  const getSessionsByTemplate = useCallback(
    (templateId: string) => {
      return sessions.filter((s) => s.templateId === templateId)
    },
    [sessions]
  )

  // Get sessions by status
  const getSessionsByStatus = useCallback(
    (status: SessionStatus) => {
      return sessions.filter((s) => s.status === status)
    },
    [sessions]
  )

  // Create session
  const createSession = useCallback(
    async (session: Partial<AssessmentSession>) => {
      setLoading(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newSession: AssessmentSession = {
          id: `ses-${Date.now()}`,
          templateId: session.templateId || "",
          name: session.name || "",
          academicYearId: session.academicYearId || "1",
          semesterId: session.semesterId || "1",
          classId: session.classId,
          evaluatorId: session.evaluatorId || "admin",
          startDate: session.startDate,
          endDate: session.endDate,
          status: "draft",
          locked: false,
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setSessions((prev) => [...prev, newSession])

        return { success: true, session: newSession }
      } catch (err) {
        setError("Gagal membuat sesi")
        return { success: false, error: "Gagal membuat sesi" }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Update session
  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<AssessmentSession>) => {
      setLoading(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, ...updates, updatedAt: new Date().toISOString() }
              : s
          )
        )

        return { success: true }
      } catch (err) {
        setError("Gagal memperbarui sesi")
        return { success: false, error: "Gagal memperbarui sesi" }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Lock session
  const lockSession = useCallback(
    async (sessionId: string) => {
      return updateSession(sessionId, { status: "locked", locked: true })
    },
    [updateSession]
  )

  // Calculate grade from score
  const calculateGrade = useCallback((score: number) => {
    const scale = DEFAULT_GRADING_SCALE
    for (const interval of scale) {
      if (score >= interval.minScore && score <= interval.maxScore) {
        return interval.grade
      }
    }
    return "E"
  }, [])

  // Calculate average
  const calculateAverage = useCallback(
    (
      scores: { score: number; weight: number }[]
    ) => {
      const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0)
      if (totalWeight === 0) return 0

      const weightedSum = scores.reduce(
        (sum, s) => sum + (s.score * s.weight) / 100,
        0
      )
      return weightedSum / (totalWeight / 100)
    },
    []
  )

  // Statistics
  const statistics = useMemo(() => {
    const active = sessions.filter((s) => s.status === "open" || s.status === "in_progress")
    const completed = sessions.filter((s) => s.status === "completed" || s.status === "locked")

    return {
      totalSessions: sessions.length,
      activeSessions: active.length,
      completedSessions: completed.length,
      draftSessions: sessions.filter((s) => s.status === "draft").length,
    }
  }, [sessions])

  return {
    // Data
    categories,
    templates,
    items,
    sessions,

    // State
    loading,
    error,
    statistics,

    // Getters
    getTemplatesByCategory,
    getItemsByTemplate,
    getSessionsByTemplate,
    getSessionsByStatus,

    // Actions
    createSession,
    updateSession,
    lockSession,
    calculateGrade,
    calculateAverage,

    // Setters (for demo)
    setCategories,
    setTemplates,
    setItems,
    setSessions,
  }
}

// Hook for session detail
export function useAssessmentSession(sessionId?: string) {
  const { sessions, items, templates, categories, calculateGrade, calculateAverage } =
    useAssessment()

  const session = sessions.find((s) => s.id === sessionId)
  const template = templates.find((t) => t.id === session?.templateId)
  const category = categories.find((c) => c.id === template?.categoryId)
  const sessionItems = items.filter((i) => i.templateId === session?.templateId)

  // Generate demo participants
  const participants = Array.from({ length: 32 }, (_, i) => ({
    id: `part-${sessionId}-${i}`,
    sessionId: sessionId || "",
    studentId: `student-${i}`,
    status: "assigned" as const,
    assignedAt: new Date().toISOString(),
    assignedBy: "admin",
    student: {
      id: `student-${i}`,
      name: `Siswa ${i + 1}`,
      studentNumber: `2025${String(i + 1).padStart(4, "0")}`,
      class: "X TKJ 1",
    },
  }))

  return {
    session,
    template,
    category,
    items: sessionItems,
    participants,
    calculateGrade,
    calculateAverage,
  }
}
