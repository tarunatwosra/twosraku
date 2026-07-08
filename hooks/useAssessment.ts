"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  AssessmentCategory,
  AssessmentTemplate,
  AssessmentItem,
  AssessmentSession,
  AssessmentParticipant,
  StudentScore,
  SessionStatus,
  DEFAULT_GRADING_SCALE,
  InputType,
} from "@/types/assessment"
import { supabase } from "@/lib/supabase"

// ============================================
// TYPE MAPPING - Convert Supabase snake_case to camelCase
// ============================================

interface SupabaseCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  display_order: number
  status: string
  created_at: string
  updated_at: string
}

interface SupabaseTemplate {
  id: string
  category_id: string
  name: string
  description: string | null
  scoring_method: string
  passing_score: number
  max_score: number
  min_score: number
  allow_decimal: boolean
  auto_calculate: boolean
  status: string
  display_order: number
  created_at: string
  updated_at: string
  created_by: string | null
  assessment_categories?: {
    id: string
    name: string
    color: string | null
  }
}

interface SupabaseItem {
  id: string
  template_id: string
  name: string
  description: string | null
  score_type: string
  weight: number
  min_score: number
  max_score: number
  passing_score: number | null
  display_order: number
  required: boolean
  status: string
  created_at: string
  updated_at: string
}

interface SupabaseSession {
  id: string
  template_id: string
  name: string
  academic_year_id: string
  semester_id: string
  class_id: string | null
  evaluator_id: string
  start_date: string | null
  end_date: string | null
  status: string
  is_locked: boolean
  locked_by: string | null
  locked_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  participantCount?: number
  assessment_templates?: SupabaseTemplate
}

interface SupabaseParticipant {
  id: string
  session_id: string
  student_id: string
  status: string
  assigned_at: string
  assigned_by: string
  notes: string | null
  created_at: string
  updated_at: string
  students?: {
    id: string
    name: string
    student_number: string
  }
}

interface SupabaseScore {
  id: string
  participant_id: string
  item_id: string
  session_id: string
  student_id: string
  raw_score: number | null
  final_score: number | null
  grade: string | null
  remark: string | null
  evidence: string | null
  updated_at: string
  status: string
  assessment_items?: {
    id: string
    name: string
    weight: number
    max_score: number
    min_score: number
  }
}

// Type mappers
function mapCategory(raw: SupabaseCategory): AssessmentCategory {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || undefined,
    icon: raw.icon || undefined,
    color: raw.color || "#6B7280",
    displayOrder: raw.display_order,
    status: raw.status as "active" | "inactive",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapTemplate(raw: SupabaseTemplate): AssessmentTemplate {
  return {
    id: raw.id,
    categoryId: raw.category_id,
    name: raw.name,
    description: raw.description || undefined,
    scoringMethod: raw.scoring_method as AssessmentTemplate["scoringMethod"],
    passingScore: raw.passing_score,
    maxScore: raw.max_score,
    minScore: raw.min_score,
    allowDecimal: raw.allow_decimal,
    autoCalculate: raw.auto_calculate,
    status: raw.status as AssessmentTemplate["status"],
    displayOrder: raw.display_order || 0,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: raw.created_by || "system",
  }
}

function mapItem(raw: SupabaseItem): AssessmentItem {
  return {
    id: raw.id,
    categoryId: raw.template_id, // Use template_id as categoryId for backwards compatibility
    templateId: raw.template_id,
    name: raw.name,
    description: raw.description || undefined,
    inputType: (raw.score_type as InputType) || "number",
    scoreType: raw.score_type as AssessmentItem["scoreType"],
    conversionType: "direct" as const, // Default conversion type
    scoreMin: Number(raw.min_score),
    scoreMax: Number(raw.max_score),
    minScore: Number(raw.min_score),
    maxScore: Number(raw.max_score),
    weight: Number(raw.weight),
    passingScore: raw.passing_score ? Number(raw.passing_score) : undefined,
    displayOrder: raw.display_order,
    isRequired: raw.required ?? true,
    required: raw.required ?? true,
    status: raw.status as AssessmentItem["status"],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapSession(raw: SupabaseSession): AssessmentSession {
  return {
    id: raw.id,
    templateId: raw.template_id,
    name: raw.name,
    academicYearId: raw.academic_year_id,
    semesterId: raw.semester_id,
    classId: raw.class_id || undefined,
    evaluatorId: raw.evaluator_id,
    startDate: raw.start_date ? new Date(raw.start_date).toISOString() : undefined,
    endDate: raw.end_date ? new Date(raw.end_date).toISOString() : undefined,
    status: raw.status as SessionStatus,
    isLocked: raw.is_locked ?? false,
    lockedBy: raw.locked_by || undefined,
    lockedAt: raw.locked_at ? new Date(raw.locked_at).toISOString() : undefined,
    notes: raw.notes || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapParticipant(raw: SupabaseParticipant): AssessmentParticipant & {
  student: { id: string; name: string; studentNumber: string }
} {
  return {
    id: raw.id,
    sessionId: raw.session_id,
    studentId: raw.student_id,
    status: raw.status as AssessmentParticipant["status"],
    assignedAt: raw.assigned_at,
    assignedBy: raw.assigned_by,
    notes: raw.notes || undefined,
    createdAt: raw.created_at || raw.assigned_at,
    updatedAt: raw.updated_at || raw.assigned_at,
    student: {
      id: raw.students?.id || raw.student_id,
      name: raw.students?.name || "Unknown",
      studentNumber: raw.students?.student_number || "",
    },
  }
}

function mapScore(raw: SupabaseScore): StudentScore {
  return {
    id: raw.id,
    participantId: raw.participant_id,
    itemId: raw.item_id,
    sessionId: raw.session_id,
    studentId: raw.student_id,
    rawScore: raw.raw_score || undefined,
    finalScore: raw.final_score || undefined,
    grade: raw.grade || undefined,
    remark: raw.remark || undefined,
    evidence: raw.evidence || undefined,
    createdAt: raw.updated_at, // Use updated_at as created_at fallback
    updatedAt: raw.updated_at,
    status: raw.status as StudentScore["status"],
  }
}

// ============================================
// MAIN HOOK - useAssessment
// ============================================

export function useAssessment() {
  const [categories, setCategories] = useState<AssessmentCategory[]>([])
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([])
  const [items, setItems] = useState<AssessmentItem[]>([])
  const [sessions, setSessions] = useState<AssessmentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch categories
      const { data: rawCategories } = await supabase
        .from("assessment_categories")
        .select("*")
        .eq("status", "active")
        .order("display_order", { ascending: true })

      // Fetch templates
      const { data: rawTemplates } = await supabase
        .from("assessment_templates")
        .select(`
          *,
          assessment_categories (
            id,
            name,
            color
          )
        `)
        .order("display_order", { ascending: true })

      // Fetch sessions
      const { data: rawSessions } = await supabase
        .from("assessment_sessions")
        .select(`
          *,
          assessment_templates (
            id,
            name,
            category_id,
            assessment_categories (
              id,
              name,
              color
            )
          )
        `)
        .order("created_at", { ascending: false })

      // Fetch all items
      const { data: rawItems } = await supabase
        .from("assessment_items")
        .select("*")
        .order("display_order", { ascending: true })

      setCategories(rawCategories?.map(mapCategory) || [])
      setTemplates(rawTemplates?.map(mapTemplate) || [])
      setSessions(rawSessions?.map(mapSession) || [])
      setItems(rawItems?.map(mapItem) || [])
    } catch (err) {
      console.error("Error fetching assessment data:", err)
      setError("Failed to fetch assessment data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  // Create category
  const createCategory = useCallback(async (data: Partial<AssessmentCategory>) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_categories")
        .insert({
          name: data.name!,
          description: data.description,
          icon: data.icon,
          color: data.color || "#6B7280",
          display_order: data.displayOrder || 0,
          status: "active",
        })
        .select()
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const newCategory = mapCategory(result)
      setCategories((prev) => [...prev, newCategory])
      return { success: true, data: newCategory }
    } catch (err) {
      console.error("Error creating category:", err)
      return { success: false, error: "Failed to create category" }
    }
  }, [])

  // Update category
  const updateCategory = useCallback(async (id: string, data: Partial<AssessmentCategory>) => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.icon !== undefined) updateData.icon = data.icon
      if (data.color !== undefined) updateData.color = data.color
      if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedCategory = mapCategory(result)
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)))
      return { success: true, data: updatedCategory }
    } catch (err) {
      console.error("Error updating category:", err)
      return { success: false, error: "Failed to update category" }
    }
  }, [])

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessment_categories")
        .delete()
        .eq("id", id)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      setCategories((prev) => prev.filter((c) => c.id !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting category:", err)
      return { success: false, error: "Failed to delete category" }
    }
  }, [])

  // Create template
  const createTemplate = useCallback(async (data: Partial<AssessmentTemplate>) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_templates")
        .insert({
          category_id: data.categoryId!,
          name: data.name!,
          description: data.description,
          scoring_method: data.scoringMethod || "weighted_average",
          passing_score: data.passingScore || 75,
          max_score: data.maxScore || 100,
          min_score: data.minScore || 0,
          allow_decimal: data.allowDecimal ?? true,
          auto_calculate: data.autoCalculate ?? true,
          display_order: data.displayOrder || 0,
          status: "draft",
        })
        .select(`
          *,
          assessment_categories (
            id,
            name,
            color
          )
        `)
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const newTemplate = mapTemplate(result)
      setTemplates((prev) => [...prev, newTemplate])
      return { success: true, data: newTemplate }
    } catch (err) {
      console.error("Error creating template:", err)
      return { success: false, error: "Failed to create template" }
    }
  }, [])

  // Update template
  const updateTemplate = useCallback(async (id: string, data: Partial<AssessmentTemplate>) => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.categoryId !== undefined) updateData.category_id = data.categoryId
      if (data.scoringMethod !== undefined) updateData.scoring_method = data.scoringMethod
      if (data.passingScore !== undefined) updateData.passing_score = data.passingScore
      if (data.maxScore !== undefined) updateData.max_score = data.maxScore
      if (data.minScore !== undefined) updateData.min_score = data.minScore
      if (data.allowDecimal !== undefined) updateData.allow_decimal = data.allowDecimal
      if (data.autoCalculate !== undefined) updateData.auto_calculate = data.autoCalculate
      if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_templates")
        .update(updateData)
        .eq("id", id)
        .select(`
          *,
          assessment_categories (
            id,
            name,
            color
          )
        `)
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedTemplate = mapTemplate(result)
      setTemplates((prev) => prev.map((t) => (t.id === id ? updatedTemplate : t)))
      return { success: true, data: updatedTemplate }
    } catch (err) {
      console.error("Error updating template:", err)
      return { success: false, error: "Failed to update template" }
    }
  }, [])

  // Delete template
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessment_templates")
        .delete()
        .eq("id", id)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      setTemplates((prev) => prev.filter((t) => t.id !== id))
      setItems((prev) => prev.filter((i) => i.templateId !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting template:", err)
      return { success: false, error: "Failed to delete template" }
    }
  }, [])

  // Create session
  const createSession = useCallback(async (data: Partial<AssessmentSession>) => {
    try {
      // Fetch active academic year and semester if not provided
      let academicYearId = data.academicYearId
      let semesterId = data.semesterId

      if (!academicYearId || !semesterId) {
        const { data: activeYear } = await supabase
          .from("academic_years")
          .select("id")
          .eq("is_active", true)
          .limit(1)
          .single()

        if (activeYear) {
          academicYearId = academicYearId || activeYear.id

          const { data: activeSemester } = await supabase
            .from("semesters")
            .select("id")
            .eq("academic_year_id", activeYear.id)
            .eq("is_active", true)
            .limit(1)
            .single()

          if (activeSemester) {
            semesterId = semesterId || activeSemester.id
          }
        }
      }

      // Validate required references exist
      if (!academicYearId) {
        return { success: false, error: "Tidak ada tahun ajaran aktif. Silakan buat tahun ajaran terlebih dahulu." }
      }

      if (!semesterId) {
        return { success: false, error: "Tidak ada semester aktif. Silakan buat semester terlebih dahulu." }
      }

      // Debug: Log what we're inserting
      console.log("Creating session with data:", {
        template_id: data.templateId,
        name: data.name,
        academic_year_id: academicYearId,
        semester_id: semesterId,
        status: "draft",
        is_locked: false,
      })

      const { data: result, error } = await supabase
        .from("assessment_sessions")
        .insert({
          template_id: data.templateId!,
          name: data.name!,
          academic_year_id: academicYearId,
          semester_id: semesterId,
          class_id: data.classId,
          evaluator_id: data.evaluatorId || "system",
          start_date: data.startDate,
          end_date: data.endDate,
          notes: data.notes,
          status: "draft",
          is_locked: false,
        })
        .select(`
          *,
          assessment_templates (
            id,
            name,
            category_id,
            assessment_categories (
              id,
              name,
              color
            )
          )
        `)
        .single()

      console.log("Supabase response:", { data: result, error })

      if (error) {
        console.error("Supabase error creating session:", JSON.stringify(error, null, 2))
        throw error
      }

      const newSession = mapSession(result)
      setSessions((prev) => [newSession, ...prev])
      return { success: true, data: newSession }
    } catch (err) {
      console.error("Error creating session:", err)
      return { success: false, error: "Gagal membuat sesi. Pastikan template, tahun ajaran, dan semester valid." }
    }
  }, [])

  // Update session
  const updateSession = useCallback(async (id: string, data: Partial<AssessmentSession>) => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (data.name !== undefined) updateData.name = data.name
      if (data.templateId !== undefined) updateData.template_id = data.templateId
      if (data.academicYearId !== undefined) updateData.academic_year_id = data.academicYearId
      if (data.semesterId !== undefined) updateData.semester_id = data.semesterId
      if (data.classId !== undefined) updateData.class_id = data.classId
      if (data.evaluatorId !== undefined) updateData.evaluator_id = data.evaluatorId
      if (data.startDate !== undefined) updateData.start_date = data.startDate
      if (data.endDate !== undefined) updateData.end_date = data.endDate
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_sessions")
        .update(updateData)
        .eq("id", id)
        .select(`
          *,
          assessment_templates (
            id,
            name,
            category_id,
            assessment_categories (
              id,
              name,
              color
            )
          )
        `)
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedSession = mapSession(result)
      setSessions((prev) => prev.map((s) => (s.id === id ? updatedSession : s)))
      return { success: true, data: updatedSession }
    } catch (err) {
      console.error("Error updating session:", err)
      return { success: false, error: "Failed to update session" }
    }
  }, [])

  // Lock session
  const lockSession = useCallback(async (id: string) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_sessions")
        .update({
          status: "locked",
          is_locked: true,
          locked_at: new Date().toISOString(),
          locked_by: "system",
        })
        .eq("id", id)
        .select()
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedSession = mapSession(result)
      setSessions((prev) => prev.map((s) => (s.id === id ? updatedSession : s)))
      return { success: true, data: updatedSession }
    } catch (err) {
      console.error("Error locking session:", err)
      return { success: false, error: "Failed to lock session" }
    }
  }, [])

  // Unlock session
  const unlockSession = useCallback(async (id: string) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_sessions")
        .update({
          status: "completed",
          is_locked: false,
          locked_at: null,
          locked_by: null,
        })
        .eq("id", id)
        .select()
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedSession = mapSession(result)
      setSessions((prev) => prev.map((s) => (s.id === id ? updatedSession : s)))
      return { success: true, data: updatedSession }
    } catch (err) {
      console.error("Error unlocking session:", err)
      return { success: false, error: "Failed to unlock session" }
    }
  }, [])

  // Delete session
  const deleteSession = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessment_sessions")
        .delete()
        .eq("id", id)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      setSessions((prev) => prev.filter((s) => s.id !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting session:", err)
      return { success: false, error: "Failed to delete session" }
    }
  }, [])

  // Create item
  const createItem = useCallback(async (data: Partial<AssessmentItem>) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_items")
        .insert({
          template_id: data.templateId!,
          name: data.name!,
          description: data.description,
          score_type: data.scoreType || "numeric",
          weight: data.weight || 0,
          min_score: data.minScore ?? 0,
          max_score: data.maxScore ?? 100,
          passing_score: data.passingScore,
          display_order: data.displayOrder || 0,
          is_required: data.isRequired ?? true,
          status: "active",
        })
        .select()
        .maybeSingle()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      if (!result) {
        return { success: false, error: "Failed to create item - no data returned" }
      }

      const newItem = mapItem(result)
      setItems((prev) => [...prev, newItem])
      return { success: true, data: newItem }
    } catch (err) {
      console.error("Error creating item:", err)
      return { success: false, error: "Failed to create item" }
    }
  }, [])

  // Update item
  const updateItem = useCallback(async (id: string, data: Partial<AssessmentItem>) => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.scoreType !== undefined) updateData.score_type = data.scoreType
      if (data.weight !== undefined) updateData.weight = data.weight
      if (data.minScore !== undefined) updateData.min_score = data.minScore
      if (data.maxScore !== undefined) updateData.max_score = data.maxScore
      if (data.passingScore !== undefined) updateData.passing_score = data.passingScore
      if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder
      if (data.isRequired !== undefined) updateData.is_required = data.isRequired
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_items")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      const updatedItem = mapItem(result)
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)))
      return { success: true, data: updatedItem }
    } catch (err) {
      console.error("Error updating item:", err)
      return { success: false, error: "Failed to update item" }
    }
  }, [])

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("assessment_items")
        .delete()
        .eq("id", id)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      setItems((prev) => prev.filter((i) => i.id !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting item:", err)
      return { success: false, error: "Failed to delete item" }
    }
  }, [])

  // ============================================
  // CALCULATIONS
  // ============================================

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
    (scores: { score: number; weight: number }[]) => {
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

    // Actions - Categories
    createCategory,
    updateCategory,
    deleteCategory,

    // Actions - Templates
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // Actions - Sessions
    createSession,
    updateSession,
    lockSession,
    unlockSession,
    deleteSession,

    // Actions - Items
    createItem,
    updateItem,
    deleteItem,

    // Calculations
    calculateGrade,
    calculateAverage,

    // Refresh
    refresh: fetchData,
  }
}

// ============================================
// SESSION DETAIL HOOK
// ============================================

export function useAssessmentSession(sessionId?: string) {
  const [session, setSession] = useState<AssessmentSession | null>(null)
  const [template, setTemplate] = useState<AssessmentTemplate | null>(null)
  const [category, setCategory] = useState<AssessmentCategory | null>(null)
  const [items, setItems] = useState<AssessmentItem[]>([])
  const [participants, setParticipants] = useState<(AssessmentParticipant & { student: { id: string; name: string; studentNumber: string } })[]>([])
  const [scores, setScores] = useState<StudentScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { calculateGrade, calculateAverage } = useAssessment()

  // Fetch session data
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get session with template and category
      const { data: rawSession, error: sessionError } = await supabase
        .from("assessment_sessions")
        .select(`
          *,
          assessment_templates (
            *,
            assessment_categories (
              id,
              name,
              color
            )
          )
        `)
        .eq("id", sessionId)
        .single()

      if (sessionError) throw sessionError

      // Get items for this template
      const { data: rawItems } = await supabase
        .from("assessment_items")
        .select("*")
        .eq("template_id", rawSession.template_id)
        .order("display_order", { ascending: true })

      // Get participants
      const { data: rawParticipants } = await supabase
        .from("assessment_participants")
        .select(`
          *,
          students (
            id,
            name,
            student_number
          )
        `)
        .eq("session_id", sessionId)

      // Get scores
      const { data: rawScores } = await supabase
        .from("student_scores")
        .select("*")
        .eq("session_id", sessionId)

      // Set data
      const mappedSession = mapSession(rawSession)
      setSession(mappedSession)

      if (rawSession.assessment_templates) {
        const mappedTemplate = mapTemplate(rawSession.assessment_templates)
        setTemplate(mappedTemplate)

        if (rawSession.assessment_templates.assessment_categories) {
          setCategory(mapCategory({
            ...rawSession.assessment_templates.assessment_categories,
            display_order: 0,
            status: "active",
            created_at: "",
            updated_at: "",
          }))
        }
      }

      setItems(rawItems?.map(mapItem) || [])
      setParticipants(rawParticipants?.map(mapParticipant) || [])
      setScores(rawScores?.map(mapScore) || [])
    } catch (err) {
      console.error("Error fetching session:", err)
      setError("Failed to fetch session data")
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  // Initial fetch
  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  // Add participants
  const addParticipants = useCallback(async (studentIds: string[]) => {
    if (!sessionId) return { success: false, error: "No session ID" }

    try {
      const participantsToAdd = studentIds.map((studentId) => ({
        session_id: sessionId,
        student_id: studentId,
        status: "assigned",
      }))

      const { data, error } = await supabase
        .from("assessment_participants")
        .insert(participantsToAdd)
        .select(`
          *,
          students (
            id,
            name,
            student_number
          )
        `)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      if (!data) {
        return { success: false, error: "No data returned" }
      }

      const newParticipants = data.map(mapParticipant)
      setParticipants((prev) => [...prev, ...newParticipants])
      return { success: true, data: newParticipants }
    } catch (err) {
      console.error("Error adding participants:", err)
      return { success: false, error: "Failed to add participants" }
    }
  }, [sessionId])

  // Remove participant
  const removeParticipant = useCallback(async (participantId: string) => {
    try {
      const { error } = await supabase
        .from("assessment_participants")
        .delete()
        .eq("id", participantId)

      if (error && (error.message || error.details || error.hint || error.code)) {
        throw error
      }

      setParticipants((prev) => prev.filter((p) => p.id !== participantId))
      return { success: true }
    } catch (err) {
      console.error("Error removing participant:", err)
      return { success: false, error: "Failed to remove participant" }
    }
  }, [])

  // Save scores
  const saveScores = useCallback(async (scoresToSave: { participantId: string; itemId: string; rawScore: number }[]) => {
    if (!sessionId) return { success: false, error: "No session ID" }

    try {
      const results: (StudentScore & { success: boolean })[] = []

      for (const score of scoresToSave) {
        // Check if score exists
        const { data: existing } = await supabase
          .from("student_scores")
          .select("id")
          .eq("participant_id", score.participantId)
          .eq("item_id", score.itemId)
          .single()

        if (existing) {
          // Update
          const { data, error } = await supabase
            .from("student_scores")
            .update({
              raw_score: score.rawScore,
              updated_at: new Date().toISOString(),
              status: "saved",
            })
            .eq("id", existing.id)
            .select()
            .single()

          if (!error && data) results.push({ ...mapScore(data), success: true })
        } else {
          // Create
          const { data: participant } = await supabase
            .from("assessment_participants")
            .select("student_id")
            .eq("id", score.participantId)
            .single()

          const { data, error } = await supabase
            .from("student_scores")
            .insert({
              participant_id: score.participantId,
              item_id: score.itemId,
              session_id: sessionId,
              student_id: participant?.student_id || "",
              raw_score: score.rawScore,
              status: "saved",
            })
            .select()
            .single()

          if (!error && data) results.push({ ...mapScore(data), success: true })
        }
      }

      // Update local scores
      setScores((prev) => {
        const updated = [...prev]
        results.forEach((newScore) => {
          const index = updated.findIndex((s) => s.id === newScore.id)
          if (index >= 0) {
            updated[index] = newScore
          } else {
            updated.push(newScore)
          }
        })
        return updated
      })

      // Update session status
      if (results.length > 0 && session && (session.status === "draft" || session.status === "open")) {
        const { data: updatedSession } = await supabase
          .from("assessment_sessions")
          .update({ status: "in_progress" })
          .eq("id", sessionId)
          .select()
          .single()

        if (updatedSession) {
          setSession(mapSession(updatedSession))
        }
      }

      return { success: true, saved: results.length }
    } catch (err) {
      console.error("Error saving scores:", err)
      return { success: false, error: "Failed to save scores" }
    }
  }, [sessionId, session])

  // Get score for participant-item
  const getScore = useCallback(
    (participantId: string, itemId: string) => {
      return scores.find(
        (s) => s.participantId === participantId && s.itemId === itemId
      )
    },
    [scores]
  )

  // Get participant average
  const getParticipantAverage = useCallback(
    (participantId: string) => {
      const participantScores = scores.filter((s) => s.participantId === participantId)
      if (participantScores.length === 0) return null

      const total = participantScores.reduce((sum, s) => sum + (s.rawScore || 0), 0)
      return total / participantScores.length
    },
    [scores]
  )

  return {
    // Data
    session,
    template,
    category,
    items,
    participants,
    scores,

    // State
    loading,
    error,

    // Actions
    addParticipants,
    removeParticipant,
    saveScores,
    refresh: fetchSession,

    // Getters
    getScore,
    getParticipantAverage,
    calculateGrade,
    calculateAverage,
  }
}
