/**
 * Character Points Database Layer
 * Operations for character_categories, behavior_types, character_records
 */

import { supabase } from "./supabase"
import type {
  CharacterCategoryRecord,
  BehaviorType,
  CharacterRecord,
  CharacterStatistics,
} from "@/types/character"

// ==================== CATEGORIES ====================

export async function getCharacterCategories(): Promise<CharacterCategoryRecord[]> {
  const { data, error } = await supabase
    .from("character_categories")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching character categories:", error)
    return []
  }

  return data?.map(transformCategory) || []
}

export async function getCharacterCategoryById(
  id: string
): Promise<CharacterCategoryRecord | null> {
  const { data, error } = await supabase
    .from("character_categories")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data ? transformCategory(data) : null
}

export async function createCharacterCategory(
  category: Omit<CharacterCategoryRecord, "id" | "createdAt" | "updatedAt">
): Promise<CharacterCategoryRecord | null> {
  const { data, error } = await supabase
    .from("character_categories")
    .insert({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      display_order: category.displayOrder,
      status: category.status,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating category:", error)
    return null
  }

  return data ? transformCategory(data) : null
}

export async function updateCharacterCategory(
  id: string,
  updates: Partial<CharacterCategoryRecord>
): Promise<CharacterCategoryRecord | null> {
  const { data, error } = await supabase
    .from("character_categories")
    .update({
      name: updates.name,
      description: updates.description,
      color: updates.color,
      icon: updates.icon,
      display_order: updates.displayOrder,
      status: updates.status,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating category:", error)
    return null
  }

  return data ? transformCategory(data) : null
}

export async function deleteCharacterCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("character_categories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return false
  }

  return true
}

// ==================== BEHAVIORS ====================

export async function getBehaviorTypes(): Promise<BehaviorType[]> {
  const { data, error } = await supabase
    .from("behavior_types")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching behavior types:", error)
    return []
  }

  return data?.map(transformBehavior) || []
}

export async function getBehaviorTypesByCategory(
  categoryId: string
): Promise<BehaviorType[]> {
  const { data, error } = await supabase
    .from("behavior_types")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "active")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching behaviors by category:", error)
    return []
  }

  return data?.map(transformBehavior) || []
}

export async function getBehaviorTypeById(
  id: string
): Promise<BehaviorType | null> {
  const { data, error } = await supabase
    .from("behavior_types")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching behavior:", error)
    return null
  }

  return data ? transformBehavior(data) : null
}

export async function createBehaviorType(
  behavior: Omit<BehaviorType, "id" | "createdAt" | "updatedAt">
): Promise<BehaviorType | null> {
  const { data, error } = await supabase
    .from("behavior_types")
    .insert({
      category_id: behavior.categoryId,
      name: behavior.name,
      description: behavior.description,
      point_value: behavior.pointValue,
      is_positive: behavior.direction === "positive",
      severity: behavior.severity,
      requires_approval: behavior.requiresApproval,
      requires_counseling: behavior.requiresCounseling,
      status: behavior.status,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating behavior:", error)
    return null
  }

  return data ? transformBehavior(data) : null
}

export async function updateBehaviorType(
  id: string,
  updates: Partial<BehaviorType>
): Promise<BehaviorType | null> {
  const { data, error } = await supabase
    .from("behavior_types")
    .update({
      category_id: updates.categoryId,
      name: updates.name,
      description: updates.description,
      point_value: updates.pointValue,
      is_positive: updates.direction === "positive",
      severity: updates.severity,
      requires_approval: updates.requiresApproval,
      requires_counseling: updates.requiresCounseling,
      status: updates.status,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating behavior:", error)
    return null
  }

  return data ? transformBehavior(data) : null
}

export async function deleteBehaviorType(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("behavior_types")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting behavior:", error)
    return false
  }

  return true
}

// ==================== CHARACTER RECORDS ====================

export async function getCharacterRecords(filters?: {
  studentId?: string
  classId?: string
  academicYearId?: string
  semesterId?: string
  startDate?: string
  endDate?: string
  status?: string
  limit?: number
}): Promise<CharacterRecord[]> {
  let query = supabase
    .from("character_records")
    .select("*")
    .order("date", { ascending: false })

  if (filters?.studentId) {
    query = query.eq("student_id", filters.studentId)
  }
  if (filters?.classId) {
    query = query.eq("class_id", filters.classId)
  }
  if (filters?.academicYearId) {
    query = query.eq("academic_year_id", filters.academicYearId)
  }
  if (filters?.semesterId) {
    query = query.eq("semester_id", filters.semesterId)
  }
  if (filters?.startDate) {
    query = query.gte("date", filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte("date", filters.endDate)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching character records:", error)
    return []
  }

  return data?.map(transformRecord) || []
}

export async function createCharacterRecord(
  record: Omit<CharacterRecord, "id" | "createdAt" | "updatedAt">
): Promise<CharacterRecord | null> {
  const { data, error } = await supabase
    .from("character_records")
    .insert({
      student_id: record.studentId,
      behavior_type_id: record.behaviorTypeId,
      event_id: record.eventId,
      class_id: record.classId,
      academic_year_id: record.academicYearId,
      semester_id: record.semesterId,
      date: record.date,
      description: record.description,
      evidence_url: record.evidence,
      status: record.status,
      reporter_id: record.reporterId,
      notes: record.remarks,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating character record:", error)
    return null
  }

  return data ? transformRecord(data) : null
}

export async function updateCharacterRecord(
  id: string,
  updates: Partial<CharacterRecord>
): Promise<CharacterRecord | null> {
  const { data, error } = await supabase
    .from("character_records")
    .update({
      description: updates.description,
      evidence_url: updates.evidence,
      status: updates.status,
      reviewed_by: updates.reviewedBy,
      reviewed_at: updates.reviewedAt,
      approved_by: updates.approvedBy,
      approved_at: updates.approvedAt,
      notes: updates.remarks,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating character record:", error)
    return null
  }

  return data ? transformRecord(data) : null
}

export async function approveCharacterRecord(
  id: string,
  approvedBy: string
): Promise<CharacterRecord | null> {
  return updateCharacterRecord(id, {
    status: "approved",
    approvedBy,
    approvedAt: new Date().toISOString(),
  })
}

// ==================== STATISTICS ====================

export async function getCharacterStatistics(filters?: {
  academicYearId?: string
  semesterId?: string
  classId?: string
}): Promise<CharacterStatistics> {
  let recordsQuery = supabase
    .from("character_records")
    .select("*, behavior_types(point_value, is_positive)")

  if (filters?.academicYearId) {
    recordsQuery = recordsQuery.eq("academic_year_id", filters.academicYearId)
  }
  if (filters?.semesterId) {
    recordsQuery = recordsQuery.eq("semester_id", filters.semesterId)
  }
  if (filters?.classId) {
    recordsQuery = recordsQuery.eq("class_id", filters.classId)
  }

  const { data: records, error } = await recordsQuery

  if (error) {
    console.error("Error fetching statistics:", error)
    return {
      totalPositivePoints: 0,
      totalNegativePoints: 0,
      totalRecords: 0,
      averagePoints: 0,
      mostAwardedCategory: "",
      mostViolationCategory: "",
      studentsRequiringAttention: [],
      topPositiveStudents: [],
    }
  }

  let totalPositivePoints = 0
  let totalNegativePoints = 0

  records?.forEach((record: any) => {
    if (record.behavior_types) {
      if (record.behavior_types.is_positive) {
        totalPositivePoints += record.behavior_types.point_value
      } else {
        totalNegativePoints += Math.abs(record.behavior_types.point_value)
      }
    }
  })

  return {
    totalPositivePoints,
    totalNegativePoints,
    totalRecords: records?.length || 0,
    averagePoints:
      records?.length > 0
        ? Math.round(
            (totalPositivePoints - totalNegativePoints) / records.length
          )
        : 0,
    mostAwardedCategory: "",
    mostViolationCategory: "",
    studentsRequiringAttention: [],
    topPositiveStudents: [],
  }
}

export async function getStudentCharacterSummary(studentId: string): Promise<{
  positivePoints: number
  negativePoints: number
  netScore: number
  totalRecords: number
  positiveRecords: number
  negativeRecords: number
} | null> {
  const { data: records, error } = await supabase
    .from("character_records")
    .select("*, behavior_types(point_value, is_positive)")
    .eq("student_id", studentId)

  if (error) {
    console.error("Error fetching student summary:", error)
    return null
  }

  let positivePoints = 0
  let negativePoints = 0
  let positiveRecords = 0
  let negativeRecords = 0

  records?.forEach((record: any) => {
    if (record.behavior_types) {
      if (record.behavior_types.is_positive) {
        positivePoints += record.behavior_types.point_value
        positiveRecords++
      } else {
        negativePoints += Math.abs(record.behavior_types.point_value)
        negativeRecords++
      }
    }
  })

  return {
    positivePoints,
    negativePoints,
    netScore: positivePoints - negativePoints,
    totalRecords: records?.length || 0,
    positiveRecords,
    negativeRecords,
  }
}

// ==================== TOP STUDENTS ====================

export async function getTopStudentsByCharacter(
  limit: number = 10,
  direction: "positive" | "negative" = "positive"
): Promise<{ id: string; name: string; className?: string; points: number }[]> {
  // Get students with their summaries
  const { data: summaries, error } = await supabase
    .from("character_summary")
    .select("student_id, positive_points, negative_points, students(full_name, student_classes(classes(name)))")
    .order(direction === "positive" ? "positive_points" : "negative_points", {
      ascending: direction === "negative",
    })
    .limit(limit)

  if (error) {
    console.error("Error fetching top students:", error)
    // Fallback to fetching records
    const { data: records } = await supabase
      .from("character_records")
      .select("student_id, students(full_name), behavior_types(point_value, is_positive)")
      .order("date", { ascending: false })
      .limit(500)

    if (!records) return []

    // Calculate points per student
    const studentPoints = new Map<
      string,
      { name: string; points: number }
    >()

    records?.forEach((record: any) => {
      const studentId = record.student_id
      const isPositive = record.behavior_types?.is_positive
      const pointValue = record.behavior_types?.point_value || 0

      if (!studentPoints.has(studentId)) {
        studentPoints.set(studentId, {
          name: record.students?.full_name || "Unknown",
          points: 0,
        })
      }

      const current = studentPoints.get(studentId)!
      if (direction === "positive" && isPositive) {
        current.points += pointValue
      } else if (direction === "negative" && !isPositive) {
        current.points += Math.abs(pointValue)
      }
    })

    return Array.from(studentPoints.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) =>
        direction === "positive" ? b.points - a.points : a.points - b.points
      )
      .slice(0, limit)
  }

  return (
    summaries?.map((s: any) => ({
      id: s.student_id,
      name: s.students?.full_name || "Unknown",
      points:
        direction === "positive" ? s.positive_points : s.negative_points,
    })) || []
  )
}

// ==================== STUDENT SEARCH ====================

export async function searchStudents(query: string, limit: number = 10): Promise<{
  id: string
  name: string
  className?: string
  nisn?: string
}[]> {
  const { data, error } = await supabase
    .from("students")
    .select(`
      id,
      full_name,
      student_number,
      student_classes (
        classes (
          name
        )
      )
    `)
    .eq("is_active", true)
    .or(`full_name.ilike.%${query}%,student_number.ilike.%${query}%`)
    .limit(limit)

  if (error) {
    console.error("Error searching students:", error)
    return []
  }

  return (
    data?.map((s: any) => ({
      id: s.id,
      name: s.full_name,
      nisn: s.student_number,
      className: s.student_classes?.[0]?.classes?.name,
    })) || []
  )
}

// ==================== TRANSFORMERS ====================

function transformCategory(row: any): CharacterCategoryRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    icon: row.icon,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformBehavior(row: any): BehaviorType {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    pointValue: row.point_value,
    direction: row.is_positive ? "positive" : "negative",
    severity: row.severity,
    requiresApproval: row.requires_approval,
    requiresCounseling: row.requires_counseling,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformRecord(row: any): CharacterRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    behaviorTypeId: row.behavior_type_id,
    eventId: row.event_id,
    date: row.date,
    reporterId: row.reporter_id,
    description: row.description,
    evidence: row.evidence_url,
    status: row.status,
    remarks: row.notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
