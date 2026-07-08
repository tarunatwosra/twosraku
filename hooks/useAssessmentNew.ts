"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  AssessmentCategory,
  AssessmentItem,
  AssessmentPeriod,
  AssessmentPeriodScore,
  AssessmentCategoryScore,
  AssessmentFormula,
  AssessmentRapor,
  AttendanceConversionRule,
  FormulaComponent,
  InputType,
  ConversionType,
  convertInput,
  calculateGrade,
  DEFAULT_GRADING_SCALE,
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

interface SupabaseItem {
  id: string
  category_id: string
  name: string
  description: string | null
  input_type: InputType | null
  conversion_type: ConversionType | null
  conversion_value: string | null
  score_min: number
  score_max: number
  weight: number
  display_order: number
  is_required: boolean | null
  status: string | null
  created_at: string
  updated_at: string
}

interface SupabasePeriod {
  id: string
  category_id: string
  period_name: string
  period_order: number
  start_date: string | null
  end_date: string | null
  weight_percentage: number
  status: string
  created_at: string
  updated_at: string
}

interface SupabasePeriodScore {
  id: string
  period_id: string
  student_id: string
  item_id: string
  raw_input: string | null
  converted_score: number | null
  created_at: string
  updated_at: string
  students?: {
    id: string
    full_name: string
    student_number: string
  }
  assessment_items?: SupabaseItem
}

interface SupabaseCategoryScore {
  id: string
  student_id: string
  category_id: string
  academic_year_id: string | null
  semester_id: string | null
  total_score: number | null
  grade: string | null
  calculated_at: string
  created_at: string
  updated_at: string
}

interface SupabaseFormula {
  id: string
  name: string
  description: string | null
  academic_year_id: string | null
  semester_id: string | null
  components: FormulaComponent[]
  total_weight: number
  status: string
  created_at: string
  updated_at: string
}

interface SupabaseRapor {
  id: string
  student_id: string
  academic_year_id: string
  semester_id: string | null
  formulas: Record<string, number>
  formula_values: Record<string, unknown>
  total_score: number | null
  grade: string | null
  status: string
  created_at: string
  updated_at: string
}

interface SupabaseConversionRule {
  id: string
  name: string
  description: string | null
  source_field: string
  lookup_table: Record<string, number>
  status: string
  created_at: string
  updated_at: string
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

function mapItem(raw: SupabaseItem): AssessmentItem {
  return {
    id: raw.id,
    categoryId: raw.category_id,
    name: raw.name,
    description: raw.description || undefined,
    inputType: (raw.input_type as InputType) || "number",
    conversionType: (raw.conversion_type as ConversionType) || "direct",
    conversionValue: raw.conversion_value || undefined,
    scoreMin: Number(raw.score_min),
    scoreMax: Number(raw.score_max),
    weight: Number(raw.weight),
    displayOrder: raw.display_order,
    isRequired: raw.is_required ?? true,
    status: (raw.status as "active" | "inactive") || "active",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapPeriod(raw: SupabasePeriod): AssessmentPeriod {
  return {
    id: raw.id,
    categoryId: raw.category_id,
    periodName: raw.period_name,
    periodOrder: raw.period_order,
    startDate: raw.start_date || undefined,
    endDate: raw.end_date || undefined,
    weightPercentage: Number(raw.weight_percentage),
    status: raw.status as "active" | "inactive",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapPeriodScore(raw: SupabasePeriodScore): AssessmentPeriodScore {
  return {
    id: raw.id,
    periodId: raw.period_id,
    studentId: raw.student_id,
    itemId: raw.item_id,
    rawInput: raw.raw_input || undefined,
    convertedScore: raw.converted_score || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    student: raw.students
      ? {
          id: raw.students.id,
          name: raw.students.full_name,
          studentNumber: raw.students.student_number,
        }
      : undefined,
    item: raw.assessment_items ? mapItem(raw.assessment_items) : undefined,
  }
}

function mapCategoryScore(raw: SupabaseCategoryScore): AssessmentCategoryScore {
  return {
    id: raw.id,
    studentId: raw.student_id,
    categoryId: raw.category_id,
    academicYearId: raw.academic_year_id || undefined,
    semesterId: raw.semester_id || undefined,
    totalScore: raw.total_score || undefined,
    grade: raw.grade || undefined,
    calculatedAt: raw.calculated_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapFormula(raw: SupabaseFormula): AssessmentFormula {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || undefined,
    academicYearId: raw.academic_year_id || undefined,
    semesterId: raw.semester_id || undefined,
    components: raw.components || [],
    totalWeight: Number(raw.total_weight),
    status: raw.status as "active" | "inactive",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapRapor(raw: SupabaseRapor): AssessmentRapor {
  return {
    id: raw.id,
    studentId: raw.student_id,
    academicYearId: raw.academic_year_id,
    semesterId: raw.semester_id || undefined,
    formulas: raw.formulas || {},
    formulaValues: (raw.formula_values as AssessmentRapor["formulaValues"]) || {},
    totalScore: raw.total_score || undefined,
    grade: raw.grade || undefined,
    status: raw.status as "draft" | "calculated" | "final",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapConversionRule(raw: SupabaseConversionRule): AttendanceConversionRule {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || undefined,
    sourceField: raw.source_field as AttendanceConversionRule["sourceField"],
    lookupTable: raw.lookup_table || {},
    status: raw.status as "active" | "inactive",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

// ============================================
// MAIN HOOK - useAssessmentNew
// ============================================

export function useAssessmentNew() {
  const [categories, setCategories] = useState<AssessmentCategory[]>([])
  const [items, setItems] = useState<AssessmentItem[]>([])
  const [periods, setPeriods] = useState<AssessmentPeriod[]>([])
  const [periodScores, setPeriodScores] = useState<AssessmentPeriodScore[]>([])
  const [categoryScores, setCategoryScores] = useState<AssessmentCategoryScore[]>([])
  const [formulas, setFormulas] = useState<AssessmentFormula[]>([])
  const [rapor, setRapor] = useState<AssessmentRapor[]>([])
  const [conversionRules, setConversionRules] = useState<AttendanceConversionRule[]>([])
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
        .order("display_order", { ascending: true })

      // Fetch items
      const { data: rawItems } = await supabase
        .from("assessment_items")
        .select("*")
        .order("display_order", { ascending: true })

      // Fetch periods
      const { data: rawPeriods } = await supabase
        .from("assessment_periods")
        .select("*")
        .order("period_order", { ascending: true })

      // Fetch formulas
      const { data: rawFormulas } = await supabase
        .from("assessment_formulas")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch conversion rules
      const { data: rawConversionRules } = await supabase
        .from("attendance_conversion_rules")
        .select("*")

      // Compute category stats
      const categoryPeriodCounts: Record<string, number> = {}
      const categoryItemCounts: Record<string, number> = {}

      rawPeriods?.forEach((p) => {
        categoryPeriodCounts[p.category_id] = (categoryPeriodCounts[p.category_id] || 0) + 1
      })

      rawItems?.forEach((i) => {
        categoryItemCounts[i.category_id] = (categoryItemCounts[i.category_id] || 0) + 1
      })

      setCategories(
        (rawCategories?.map((c) => ({
          ...mapCategory(c),
          periodCount: categoryPeriodCounts[c.id] || 0,
          itemCount: categoryItemCounts[c.id] || 0,
        })) || [])
      )

      setItems(rawItems?.map(mapItem) || [])
      setPeriods(rawPeriods?.map(mapPeriod) || [])
      setFormulas(rawFormulas?.map(mapFormula) || [])
      setConversionRules(rawConversionRules?.map(mapConversionRule) || [])
    } catch (err) {
      console.error("Error fetching assessment data:", err)
      setError("Gagal memuat data penilaian")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ============================================
  // CRUD - CATEGORIES
  // ============================================

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
          status: data.status || "active",
        })
        .select()
        .single()

      if (error && Object.keys(error).length > 0) throw error

      const newCategory = mapCategory(result)
      setCategories((prev) => [...prev, { ...newCategory, periodCount: 0, itemCount: 0 }])
      return { success: true, data: newCategory }
    } catch (err) {
      console.error("Error creating category:", err)
      return { success: false, error: "Gagal membuat kategori" }
    }
  }, [])

  const updateCategory = useCallback(async (id: string, data: Partial<AssessmentCategory>) => {
    try {
      const updateData: Record<string, unknown> = {}
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

      if (error && Object.keys(error).length > 0) throw error

      const updatedCategory = mapCategory(result)
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...updatedCategory, periodCount: c.periodCount, itemCount: c.itemCount } : c))
      )
      return { success: true, data: updatedCategory }
    } catch (err) {
      console.error("Error updating category:", err)
      return { success: false, error: "Gagal mengupdate kategori" }
    }
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("assessment_categories").delete().eq("id", id)

      if (error && Object.keys(error).length > 0) throw error

      setCategories((prev) => prev.filter((c) => c.id !== id))
      setItems((prev) => prev.filter((i) => i.categoryId !== id))
      setPeriods((prev) => prev.filter((p) => p.categoryId !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting category:", err)
      return { success: false, error: "Gagal menghapus kategori" }
    }
  }, [])

  // ============================================
  // CRUD - ITEMS
  // ============================================

  const createItem = useCallback(async (data: Partial<AssessmentItem>) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_items")
        .insert({
          category_id: data.categoryId!,
          name: data.name!,
          description: data.description,
          input_type: data.inputType || "number",
          conversion_type: data.conversionType || "direct",
          conversion_value: data.conversionValue,
          min_score: data.scoreMin ?? 0,
          max_score: data.scoreMax ?? 100,
          weight: data.weight ?? 0,
          display_order: data.displayOrder || 0,
          is_required: data.isRequired ?? true,
          status: data.status || "active",
        })
        .select()
        .maybeSingle()

      if (error && (error.message || error.details || error.hint || error.code)) {
        console.error("Supabase error:", error)
        throw error
      }

      if (!result) {
        console.error("No result returned from insert")
        return { success: false, error: "Gagal membuat item - tidak ada data kembali" }
      }

      const newItem = mapItem(result)
      setItems((prev) => [...prev, newItem])

      // Update category item count
      setCategories((prev) =>
        prev.map((c) =>
          c.id === data.categoryId ? { ...c, itemCount: (c.itemCount || 0) + 1 } : c
        )
      )

      return { success: true, data: newItem }
    } catch (err) {
      console.error("Error creating item:", err)
      return { success: false, error: "Gagal membuat item" }
    }
  }, [])

  const updateItem = useCallback(async (id: string, data: Partial<AssessmentItem>) => {
    try {
      const updateData: Record<string, unknown> = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.inputType !== undefined) updateData.input_type = data.inputType
      if (data.conversionType !== undefined) updateData.conversion_type = data.conversionType
      if (data.conversionValue !== undefined) updateData.conversion_value = data.conversionValue
      if (data.scoreMin !== undefined) updateData.min_score = data.scoreMin
      if (data.scoreMax !== undefined) updateData.max_score = data.scoreMax
      if (data.weight !== undefined) updateData.weight = data.weight
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

      if (!result) {
        return { success: false, error: "Gagal mengupdate item - tidak ada data kembali" }
      }

      const updatedItem = mapItem(result)
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)))
      return { success: true, data: updatedItem }
    } catch (err) {
      console.error("Error updating item:", err)
      return { success: false, error: "Gagal mengupdate item" }
    }
  }, [items])

  const deleteItem = useCallback(async (id: string) => {
    try {
      const item = items.find((i) => i.id === id)
      const { error } = await supabase.from("assessment_items").delete().eq("id", id)

      if (error && Object.keys(error).length > 0) throw error

      setItems((prev) => prev.filter((i) => i.id !== id))

      // Update category item count
      if (item) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === item.categoryId ? { ...c, itemCount: Math.max(0, (c.itemCount || 0) - 1) } : c
          )
        )
      }

      return { success: true }
    } catch (err) {
      console.error("Error deleting item:", err)
      return { success: false, error: "Gagal menghapus item" }
    }
  }, [items])

  // ============================================
  // CRUD - PERIODS
  // ============================================

  const createPeriod = useCallback(async (data: Partial<AssessmentPeriod>) => {
    try {
      const { data: result, error } = await supabase
        .from("assessment_periods")
        .insert({
          category_id: data.categoryId!,
          period_name: data.periodName!,
          period_order: data.periodOrder || 1,
          start_date: data.startDate,
          end_date: data.endDate,
          weight_percentage: data.weightPercentage || 0,
          status: data.status || "active",
        })
        .select()
        .single()

      if (error && Object.keys(error).length > 0) throw error

      const newPeriod = mapPeriod(result)
      setPeriods((prev) => [...prev, newPeriod])

      // Update category period count
      setCategories((prev) =>
        prev.map((c) =>
          c.id === data.categoryId ? { ...c, periodCount: (c.periodCount || 0) + 1 } : c
        )
      )

      return { success: true, data: newPeriod }
    } catch (err) {
      console.error("Error creating period:", err)
      return { success: false, error: "Gagal membuat periode" }
    }
  }, [])

  const updatePeriod = useCallback(async (id: string, data: Partial<AssessmentPeriod>) => {
    try {
      const updateData: Record<string, unknown> = {}
      if (data.periodName !== undefined) updateData.period_name = data.periodName
      if (data.periodOrder !== undefined) updateData.period_order = data.periodOrder
      if (data.startDate !== undefined) updateData.start_date = data.startDate
      if (data.endDate !== undefined) updateData.end_date = data.endDate
      if (data.weightPercentage !== undefined) updateData.weight_percentage = data.weightPercentage
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_periods")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error && Object.keys(error).length > 0) throw error

      const updatedPeriod = mapPeriod(result)
      setPeriods((prev) => prev.map((p) => (p.id === id ? updatedPeriod : p)))
      return { success: true, data: updatedPeriod }
    } catch (err) {
      console.error("Error updating period:", err)
      return { success: false, error: "Gagal mengupdate periode" }
    }
  }, [])

  const deletePeriod = useCallback(async (id: string) => {
    try {
      const period = periods.find((p) => p.id === id)
      const { error } = await supabase.from("assessment_periods").delete().eq("id", id)

      if (error && Object.keys(error).length > 0) throw error

      setPeriods((prev) => prev.filter((p) => p.id !== id))

      // Update category period count
      if (period) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === period.categoryId ? { ...c, periodCount: Math.max(0, (c.periodCount || 0) - 1) } : c
          )
        )
      }

      return { success: true }
    } catch (err) {
      console.error("Error deleting period:", err)
      return { success: false, error: "Gagal menghapus periode" }
    }
  }, [periods])

  // ============================================
  // CRUD - FORMULAS
  // ============================================

  const createFormula = useCallback(async (data: Partial<AssessmentFormula>) => {
    try {
      const totalWeight = data.components?.reduce((sum, c) => sum + c.weight, 0) || 100

      const { data: result, error } = await supabase
        .from("assessment_formulas")
        .insert({
          name: data.name!,
          description: data.description,
          academic_year_id: data.academicYearId,
          semester_id: data.semesterId,
          components: data.components || [],
          total_weight: totalWeight,
          status: data.status || "active",
        })
        .select()
        .single()

      if (error && Object.keys(error).length > 0) throw error

      const newFormula = mapFormula(result)
      setFormulas((prev) => [...prev, newFormula])
      return { success: true, data: newFormula }
    } catch (err) {
      console.error("Error creating formula:", err)
      return { success: false, error: "Gagal membuat formula" }
    }
  }, [])

  const updateFormula = useCallback(async (id: string, data: Partial<AssessmentFormula>) => {
    try {
      const updateData: Record<string, unknown> = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.academicYearId !== undefined) updateData.academic_year_id = data.academicYearId
      if (data.semesterId !== undefined) updateData.semester_id = data.semesterId
      if (data.components !== undefined) {
        updateData.components = data.components
        updateData.total_weight = data.components.reduce((sum, c) => sum + c.weight, 0)
      }
      if (data.status !== undefined) updateData.status = data.status

      const { data: result, error } = await supabase
        .from("assessment_formulas")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error && Object.keys(error).length > 0) throw error

      const updatedFormula = mapFormula(result)
      setFormulas((prev) => prev.map((f) => (f.id === id ? updatedFormula : f)))
      return { success: true, data: updatedFormula }
    } catch (err) {
      console.error("Error updating formula:", err)
      return { success: false, error: "Gagal mengupdate formula" }
    }
  }, [])

  const deleteFormula = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("assessment_formulas").delete().eq("id", id)

      if (error && Object.keys(error).length > 0) throw error

      setFormulas((prev) => prev.filter((f) => f.id !== id))
      return { success: true }
    } catch (err) {
      console.error("Error deleting formula:", err)
      return { success: false, error: "Gagal menghapus formula" }
    }
  }, [])

  // ============================================
  // SCORING - PERIOD SCORES
  // ============================================

  const fetchPeriodScores = useCallback(async (periodId: string) => {
    try {
      const { data: rawScores } = await supabase
        .from("assessment_period_scores")
        .select(`
          *,
          students (
            id,
            full_name,
            student_number
          ),
          assessment_items (*)
        `)
        .eq("period_id", periodId)

      setPeriodScores(rawScores?.map(mapPeriodScore) || [])
      return rawScores?.map(mapPeriodScore) || []
    } catch (err) {
      console.error("Error fetching period scores:", err)
      return []
    }
  }, [])

  const savePeriodScore = useCallback(
    async (periodId: string, studentId: string, itemId: string, rawInput: string) => {
      try {
        const item = items.find((i) => i.id === itemId)
        if (!item) return { success: false, error: "Item tidak ditemukan" }

        // Convert input to score
        const convertedScore = convertInput(rawInput, item.inputType, item.conversionType, item.conversionValue)

        // Check if score exists
        const { data: existing } = await supabase
          .from("assessment_period_scores")
          .select("id")
          .eq("period_id", periodId)
          .eq("student_id", studentId)
          .eq("item_id", itemId)
          .single()

        let result
        if (existing) {
          // Update
          const { data, error } = await supabase
            .from("assessment_period_scores")
            .update({
              raw_input: rawInput,
              converted_score: convertedScore,
            })
            .eq("id", existing.id)
            .select(`
              *,
              students (id, full_name, student_number),
              assessment_items (*)
            `)
            .single()

          if (error && Object.keys(error).length > 0) throw error
          result = mapPeriodScore(data)
        } else {
          // Create
          const { data, error } = await supabase
            .from("assessment_period_scores")
            .insert({
              period_id: periodId,
              student_id: studentId,
              item_id: itemId,
              raw_input: rawInput,
              converted_score: convertedScore,
            })
            .select(`
              *,
              students (id, full_name, student_number),
              assessment_items (*)
            `)
            .single()

          if (error && Object.keys(error).length > 0) throw error
          result = mapPeriodScore(data)
        }

        setPeriodScores((prev) => {
          const filtered = prev.filter((s) => !(s.periodId === periodId && s.studentId === studentId && s.itemId === itemId))
          return [...filtered, result!]
        })

        return { success: true, data: result }
      } catch (err) {
        console.error("Error saving period score:", err)
        return { success: false, error: "Gagal menyimpan nilai" }
      }
    },
    [items]
  )

  // ============================================
  // CALCULATIONS
  // ============================================

  // Calculate item score from raw input
  const calculateItemScore = useCallback(
    (rawInput: string, item: AssessmentItem) => {
      return convertInput(rawInput, item.inputType, item.conversionType, item.conversionValue)
    },
    []
  )

  // Calculate period score (average of item scores)
  const calculatePeriodScore = useCallback(
    (periodId: string, scores: AssessmentPeriodScore[]) => {
      const periodItems = items.filter((i) => items.some((item) => item.categoryId === periods.find((p) => p.id === periodId)?.categoryId))
      const periodScoreList = scores.filter((s) => s.periodId === periodId && s.convertedScore !== undefined)

      if (periodScoreList.length === 0) return null

      const total = periodScoreList.reduce((sum, s) => sum + (s.convertedScore || 0), 0)
      return total / periodScoreList.length
    },
    [items, periods]
  )

  // Calculate category score (weighted average of period scores)
  const calculateCategoryScoreValue = useCallback(
    (categoryId: string, periodScoresMap: Map<string, { score: number; weight: number }[]>) => {
      const categoryPeriods = periods.filter((p) => p.categoryId === categoryId)
      const allScores: { score: number; weight: number }[] = []

      categoryPeriods.forEach((period) => {
        const scores = periodScoresMap.get(period.id) || []
        const avgScore = scores.length > 0
          ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
          : 0
        allScores.push({ score: avgScore, weight: period.weightPercentage })
      })

      if (allScores.length === 0) return null

      const totalWeight = allScores.reduce((sum, s) => sum + s.weight, 0)
      if (totalWeight === 0) return null

      const weightedSum = allScores.reduce((sum, s) => sum + s.score * s.weight, 0)
      return weightedSum / totalWeight
    },
    [periods]
  )

  // Convert attendance to score
  const convertAttendanceToScore = useCallback(
    (attendanceRate: number, rule?: AttendanceConversionRule) => {
      if (!rule) {
        // Default conversion
        return attendanceRate
      }

      const rateStr = attendanceRate.toString()
      if (rule.lookupTable[rateStr] !== undefined) {
        return rule.lookupTable[rateStr]
      }

      // Find closest match
      const keys = Object.keys(rule.lookupTable).map(Number).sort((a, b) => b - a)
      for (const key of keys) {
        if (attendanceRate >= key) {
          return rule.lookupTable[key.toString()]
        }
      }

      return rule.lookupTable[keys[keys.length - 1]] || 0
    },
    []
  )

  // Get grade from score
  const getGrade = useCallback((score: number) => {
    return calculateGrade(score, DEFAULT_GRADING_SCALE)
  }, [])

  // ============================================
  // GETTERS
  // ============================================

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  )

  const getItemsByCategory = useCallback(
    (categoryId: string) => items.filter((i) => i.categoryId === categoryId),
    [items]
  )

  const getPeriodsByCategory = useCallback(
    (categoryId: string) => periods.filter((p) => p.categoryId === categoryId),
    [periods]
  )

  const getPeriodById = useCallback(
    (id: string) => periods.find((p) => p.id === id),
    [periods]
  )

  const getTotalPeriodWeight = useCallback(
    (categoryId: string) => {
      return periods
        .filter((p) => p.categoryId === categoryId)
        .reduce((sum, p) => sum + p.weightPercentage, 0)
    },
    [periods]
  )

  // ============================================
  // STATISTICS
  // ============================================

  const statistics = useMemo(() => {
    return {
      totalCategories: categories.length,
      activeCategories: categories.filter((c) => c.status === "active").length,
      totalPeriods: periods.length,
      totalItems: items.length,
      totalFormulas: formulas.length,
    }
  }, [categories, periods, items, formulas])

  return {
    // Data
    categories,
    items,
    periods,
    periodScores,
    categoryScores,
    formulas,
    conversionRules,
    loading,
    error,
    statistics,

    // Actions - Categories
    createCategory,
    updateCategory,
    deleteCategory,

    // Actions - Items
    createItem,
    updateItem,
    deleteItem,

    // Actions - Periods
    createPeriod,
    updatePeriod,
    deletePeriod,

    // Actions - Formulas
    createFormula,
    updateFormula,
    deleteFormula,

    // Actions - Scores
    fetchPeriodScores,
    savePeriodScore,

    // Calculations
    calculateItemScore,
    calculatePeriodScore,
    calculateCategoryScoreValue,
    convertAttendanceToScore,
    getGrade,

    // Getters
    getCategoryById,
    getItemsByCategory,
    getPeriodsByCategory,
    getPeriodById,
    getTotalPeriodWeight,

    // Refresh
    refresh: fetchData,
  }
}

// ============================================
// CATEGORY DETAIL HOOK
// ============================================

export function useAssessmentCategory(categoryId?: string) {
  const {
    categories,
    items,
    periods,
    loading: globalLoading,
    createItem,
    updateItem,
    deleteItem,
    createPeriod,
    updatePeriod,
    deletePeriod,
    fetchPeriodScores,
    savePeriodScore,
    calculateItemScore,
    getGrade,
    refresh,
  } = useAssessmentNew()

  const category = categories.find((c) => c.id === categoryId)
  const categoryItems = items.filter((i) => i.categoryId === categoryId)
  const categoryPeriods = periods.filter((p) => p.categoryId === categoryId)

  const totalPeriodWeight = categoryPeriods.reduce((sum, p) => sum + p.weightPercentage, 0)

  return {
    category,
    items: categoryItems,
    periods: categoryPeriods,
    totalPeriodWeight,
    loading: globalLoading,

    // Item actions
    createItem: (data: Partial<AssessmentItem>) => createItem({ ...data, categoryId }),
    updateItem,
    deleteItem,

    // Period actions
    createPeriod: (data: Partial<AssessmentPeriod>) => createPeriod({ ...data, categoryId }),
    updatePeriod,
    deletePeriod,

    // Score actions
    fetchPeriodScores,
    savePeriodScore,

    // Calculations
    calculateItemScore,
    getGrade,

    // Refresh
    refresh,
  }
}

// ============================================
// PERIOD SCORING HOOK
// ============================================

export function usePeriodScoring(periodId?: string, categoryId?: string) {
  const {
    periods,
    items,
    conversionRules,
    loading: globalLoading,
    fetchPeriodScores,
    savePeriodScore,
    calculateItemScore,
    getGrade,
    refresh,
  } = useAssessmentNew()

  const period = periods.find((p) => p.id === periodId)
  const periodItems = items.filter((i) => i.categoryId === categoryId)
  const [scores, setScores] = useState<AssessmentPeriodScore[]>([])
  const [students, setStudents] = useState<{ id: string; name: string; studentNumber: string }[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch scores and students
  const fetchData = useCallback(async () => {
    if (!periodId) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      // Fetch scores
      const periodScores = await fetchPeriodScores(periodId)
      setScores(periodScores)

      // Fetch students (all active students)
      const { data: rawStudents } = await supabase
        .from("students")
        .select("id, full_name, student_number")
        .eq("is_active", true)
        .order("full_name")

      setStudents(
        rawStudents?.map((s) => ({
          id: s.id,
          name: s.full_name,
          studentNumber: s.student_number,
        })) || []
      )
    } catch (err) {
      console.error("Error fetching period data:", err)
    } finally {
      setLoading(false)
    }
  }, [periodId, fetchPeriodScores])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Get score for student-item
  const getScore = useCallback(
    (studentId: string, itemId: string) => {
      return scores.find((s) => s.studentId === studentId && s.itemId === itemId)
    },
    [scores]
  )

  // Calculate student period average
  const getStudentPeriodAverage = useCallback(
    (studentId: string) => {
      const studentScores = scores.filter((s) => s.studentId === studentId && s.convertedScore !== undefined)
      if (studentScores.length === 0) return null

      const total = studentScores.reduce((sum, s) => sum + (s.convertedScore || 0), 0)
      return total / studentScores.length
    },
    [scores]
  )

  // Handle save score
  const handleSaveScore = useCallback(
    async (studentId: string, itemId: string, rawInput: string) => {
      const result = await savePeriodScore(periodId!, studentId, itemId, rawInput)

      if (result.success && result.data) {
        setScores((prev) => {
          const filtered = prev.filter(
            (s) => !(s.studentId === studentId && s.itemId === itemId)
          )
          return [...filtered, result.data!]
        })
      }

      return result
    },
    [periodId, savePeriodScore]
  )

  return {
    period,
    items: periodItems,
    scores,
    students,
    conversionRules,
    loading: loading || globalLoading,

    getScore,
    getStudentPeriodAverage,
    handleSaveScore,
    getGrade,
    calculateItemScore,
    refresh: fetchData,
  }
}
