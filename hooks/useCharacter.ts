"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
  CharacterCategoryRecord,
  BehaviorType,
  CharacterRecord,
  StudentCharacterSummary,
} from "@/types/character"

// ==================== TRANSFORMERS ====================

function transformCategory(row: any): CharacterCategoryRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color || "#6B7280",
    icon: row.icon,
    displayOrder: row.display_order || 0,
    status: row.status || "active",
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
    requiresApproval: row.requires_approval || false,
    requiresCounseling: row.requires_counseling || false,
    status: row.status || "active",
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
    classId: row.class_id,
    academicYearId: row.academic_year_id,
    semesterId: row.semester_id,
    date: row.date,
    reporterId: row.reporter_id,
    description: row.description,
    evidence: row.evidence_url,
    status: row.status || "draft",
    remarks: row.remarks,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ==================== DATABASE OPERATIONS ====================

async function fetchCategories(): Promise<CharacterCategoryRecord[]> {
  const { data, error } = await supabase
    .from("character_categories")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  console.log("Fetched categories:", data?.length, data)
  return data?.map(transformCategory) || []
}

async function fetchBehaviors(): Promise<BehaviorType[]> {
  const { data, error } = await supabase
    .from("behavior_types")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching behaviors:", error)
    return []
  }

  console.log("Fetched behaviors:", data?.length, data)
  return data?.map(transformBehavior) || []
}

async function fetchRecords(): Promise<CharacterRecord[]> {
  const { data, error } = await supabase
    .from("character_records")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching records:", error)
    return []
  }

  return data?.map(transformRecord) || []
}

// ==================== DEFAULT DATA ====================

const DEFAULT_CATEGORIES: CharacterCategoryRecord[] = [
  {
    id: "cat-1",
    name: "Disiplin",
    description: "Ketepatan waktu, kedisiplinan dalam aturan sekolah",
    color: "#3B82F6",
    displayOrder: 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Tanggung Jawab",
    description: "Mengambil tanggung jawab atas tindakan dan tugas",
    color: "#10B981",
    displayOrder: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Kepemimpinan",
    description: "Kemampuan memimpin dan menginspirasi",
    color: "#F59E0B",
    displayOrder: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Sopan Santun",
    description: "Perilaku sopan dan menghargai orang lain",
    color: "#EC4899",
    displayOrder: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-5",
    name: "Integritas",
    description: "Jujur dan dapat dipercaya",
    color: "#8B5CF6",
    displayOrder: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-6",
    name: "Kerja Tim",
    description: "Mampu bekerja sama dengan baik",
    color: "#06B6D4",
    displayOrder: 6,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const DEFAULT_BEHAVIORS: BehaviorType[] = [
  { id: "beh-1", categoryId: "cat-1", name: "Tepat Waktu", description: "Mengikuti jadwal dengan baik", pointValue: 10, direction: "positive", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-2", categoryId: "cat-1", name: "Terlambat 5-15 Menit", description: "Terlambat datang ke sekolah", pointValue: -5, direction: "negative", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-3", categoryId: "cat-1", name: "Terlambat >15 Menit", description: "Terlambat lebih dari 15 menit", pointValue: -10, direction: "negative", severity: "moderate", requiresApproval: true, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-4", categoryId: "cat-2", name: "Menyelesaikan Tugas Tepat Waktu", description: "Tugas dikumpulkan sesuai deadline", pointValue: 15, direction: "positive", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-5", categoryId: "cat-2", name: "Tidak Menyelesaikan Tugas", description: "Tidak mengerjakan tugas", pointValue: -10, direction: "negative", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-6", categoryId: "cat-3", name: "Menjadi Komandan", description: "Memimpin diskusi kelompok", pointValue: 20, direction: "positive", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-7", categoryId: "cat-3", name: "Inisiatif Positif", description: "Mengambil inisiatif kebaikan", pointValue: 25, direction: "positive", severity: "moderate", requiresApproval: true, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-8", categoryId: "cat-4", name: "Menghormati Guru", description: "Sikap hormat kepada guru", pointValue: 10, direction: "positive", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-9", categoryId: "cat-4", name: "Berkata Kasar", description: "Kata-kata tidak sopan", pointValue: -20, direction: "negative", severity: "moderate", requiresApproval: true, requiresCounseling: true, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-10", categoryId: "cat-5", name: "Jujur", description: "Mengaku kesalahan sendiri", pointValue: 15, direction: "positive", severity: "minor", requiresApproval: false, requiresCounseling: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "beh-11", categoryId: "cat-5", name: "Menyontek", description: "Kecurangan dalam ujian", pointValue: -50, direction: "negative", severity: "major", requiresApproval: true, requiresCounseling: true, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

// ==================== HOOK ====================

export function useCharacter() {
  const [categories, setCategories] = useState<CharacterCategoryRecord[]>([])
  const [behaviors, setBehaviors] = useState<BehaviorType[]>([])
  const [records, setRecords] = useState<CharacterRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingDatabase, setIsUsingDatabase] = useState(false)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching character data from database...")
      setLoading(true)
      setError(null)

      try {
        // Try to fetch from database
        const [cats, behs, recs] = await Promise.all([
          fetchCategories(),
          fetchBehaviors(),
          fetchRecords(),
        ])

        console.log("Database response:", { cats: cats.length, behs: behs.length, recs: recs.length })

        if (cats.length > 0) {
          // Use database data
          setCategories(cats)
          setBehaviors(behs)
          setRecords(recs)
          setIsUsingDatabase(true)
          console.log("Using DATABASE data")
        } else {
          // Use default data
          setCategories(DEFAULT_CATEGORIES)
          setBehaviors(DEFAULT_BEHAVIORS)
          setRecords([])
          setIsUsingDatabase(false)
          console.log("Using DEFAULT data (database empty)")
        }
      } catch (err) {
        console.error("Fetch error:", err)
        // Use default data on error
        setCategories(DEFAULT_CATEGORIES)
        setBehaviors(DEFAULT_BEHAVIORS)
        setRecords([])
        setError("Gagal mengambil data dari database")
        setIsUsingDatabase(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get behaviors by category
  const getBehaviorsByCategory = useCallback(
    (categoryId: string) => behaviors.filter((b) => b.categoryId === categoryId),
    [behaviors]
  )

  // Get positive/negative behaviors
  const positiveBehaviors = useMemo(
    () => behaviors.filter((b) => b.direction === "positive"),
    [behaviors]
  )

  const negativeBehaviors = useMemo(
    () => behaviors.filter((b) => b.direction === "negative"),
    [behaviors]
  )

  // Refresh data
  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const [cats, behs, recs] = await Promise.all([
        fetchCategories(),
        fetchBehaviors(),
        fetchRecords(),
      ])

      if (cats.length > 0) {
        setCategories(cats)
        setBehaviors(behs)
        setRecords(recs)
      }
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add category
  const addCategory = useCallback(
    async (category: Omit<CharacterCategoryRecord, "id" | "createdAt" | "updatedAt">) => {
      if (isUsingDatabase) {
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

        if (!error && data) {
          const newCategory = transformCategory(data)
          setCategories((prev) => [...prev, newCategory])
          return newCategory
        }
        console.error("Error adding category:", error)
      }

      // Fallback
      const newCategory: CharacterCategoryRecord = {
        ...category,
        id: `cat-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCategories((prev) => [...prev, newCategory])
      return newCategory
    },
    [isUsingDatabase]
  )

  // Update category
  const updateCategory = useCallback(
    async (id: string, updates: Partial<CharacterCategoryRecord>) => {
      if (isUsingDatabase) {
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

        if (!error && data) {
          const updated = transformCategory(data)
          setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
          return updated
        }
        console.error("Error updating category:", error)
      }

      // Fallback
      const updated: CharacterCategoryRecord = {
        ...categories.find((c) => c.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
      return updated
    },
    [isUsingDatabase, categories]
  )

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      if (isUsingDatabase) {
        const { error } = await supabase
          .from("character_categories")
          .delete()
          .eq("id", id)

        if (!error) {
          setCategories((prev) => prev.filter((c) => c.id !== id))
          return true
        }
        console.error("Error deleting category:", error)
      }

      // Fallback
      setCategories((prev) => prev.filter((c) => c.id !== id))
      return true
    },
    [isUsingDatabase]
  )

  // Add behavior
  const addBehavior = useCallback(
    async (behavior: Omit<BehaviorType, "id" | "createdAt" | "updatedAt">) => {
      if (isUsingDatabase) {
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

        if (!error && data) {
          const newBehavior = transformBehavior(data)
          setBehaviors((prev) => [...prev, newBehavior])
          return newBehavior
        }
        console.error("Error adding behavior:", error)
      }

      // Fallback
      const newBehavior: BehaviorType = {
        ...behavior,
        id: `beh-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setBehaviors((prev) => [...prev, newBehavior])
      return newBehavior
    },
    [isUsingDatabase]
  )

  // Update behavior
  const updateBehavior = useCallback(
    async (id: string, updates: Partial<BehaviorType>) => {
      if (isUsingDatabase) {
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

        if (!error && data) {
          const updated = transformBehavior(data)
          setBehaviors((prev) => prev.map((b) => (b.id === id ? updated : b)))
          return updated
        }
        console.error("Error updating behavior:", error)
      }

      // Fallback
      const updated: BehaviorType = {
        ...behaviors.find((b) => b.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      setBehaviors((prev) => prev.map((b) => (b.id === id ? updated : b)))
      return updated
    },
    [isUsingDatabase, behaviors]
  )

  // Delete behavior
  const deleteBehavior = useCallback(
    async (id: string) => {
      if (isUsingDatabase) {
        const { error } = await supabase
          .from("behavior_types")
          .delete()
          .eq("id", id)

        if (!error) {
          setBehaviors((prev) => prev.filter((b) => b.id !== id))
          return true
        }
        console.error("Error deleting behavior:", error)
      }

      // Fallback
      setBehaviors((prev) => prev.filter((b) => b.id !== id))
      return true
    },
    [isUsingDatabase]
  )

  // Add record
  const addRecord = useCallback(
    async (record: Omit<CharacterRecord, "id" | "createdAt" | "updatedAt">) => {
      if (isUsingDatabase) {
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
            remarks: record.remarks,
          })
          .select()
          .single()

        if (!error && data) {
          const newRecord = transformRecord(data)
          setRecords((prev) => [newRecord, ...prev])
          return { success: true, record: newRecord }
        }
        console.error("Error adding record:", error)
      }

      // Fallback
      const newRecord: CharacterRecord = {
        ...record,
        id: `record-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRecords((prev) => [newRecord, ...prev])
      return { success: true, record: newRecord }
    },
    [isUsingDatabase]
  )

  // Update record
  const updateRecord = useCallback(
    async (recordId: string, updates: Partial<CharacterRecord>) => {
      if (isUsingDatabase) {
        const { data, error } = await supabase
          .from("character_records")
          .update({
            description: updates.description,
            evidence_url: updates.evidence,
            status: updates.status,
            remarks: updates.remarks,
            reviewed_by: updates.reviewedBy,
            reviewed_at: updates.reviewedAt,
            approved_by: updates.approvedBy,
            approved_at: updates.approvedAt,
          })
          .eq("id", recordId)
          .select()
          .single()

        if (!error && data) {
          const updated = transformRecord(data)
          setRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)))
          return { success: true }
        }
        console.error("Error updating record:", error)
      }

      // Fallback
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? { ...r, ...updates, updatedAt: new Date().toISOString() }
            : r
        )
      )
      return { success: true }
    },
    [isUsingDatabase]
  )

  // Approve record
  const approveRecord = useCallback(
    async (recordId: string, approvedBy: string) => {
      return updateRecord(recordId, {
        status: "approved",
        approvedBy,
        approvedAt: new Date().toISOString(),
      }).then((r) => r.success)
    },
    [updateRecord]
  )

  // Get student summary
  const getStudentSummary = useCallback(
    async (studentId: string): Promise<StudentCharacterSummary | null> => {
      const studentRecords = records.filter((r) => r.studentId === studentId)

      if (studentRecords.length === 0) return null

      let positivePoints = 0
      let negativePoints = 0

      studentRecords.forEach((record) => {
        const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
        if (behavior) {
          if (behavior.direction === "positive") {
            positivePoints += behavior.pointValue
          } else {
            negativePoints += Math.abs(behavior.pointValue)
          }
        }
      })

      return {
        studentId,
        academicYearId: "",
        semesterId: undefined,
        positivePoints,
        negativePoints,
        netScore: positivePoints - negativePoints,
        totalRecords: studentRecords.length,
        positiveRecords: studentRecords.filter((r) =>
          behaviors.find((b) => b.id === r.behaviorTypeId)?.direction === "positive"
        ).length,
        negativeRecords: studentRecords.filter((r) =>
          behaviors.find((b) => b.id === r.behaviorTypeId)?.direction === "negative"
        ).length,
        recentActivities: studentRecords.slice(0, 5),
      }
    },
    [records, behaviors]
  )

  // Get top students
  const getTopStudents = useCallback(
    async (
      limit: number = 10,
      direction: "positive" | "negative" = "positive"
    ) => {
      const studentMap = new Map<string, { id: string; name: string; points: number }>()

      records.forEach((record) => {
        const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
        if (!behavior) return

        const studentId = record.studentId
        const isPositive = behavior.direction === "positive"
        const pointValue = Math.abs(behavior.pointValue)

        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: studentId,
            name: `Siswa ${studentId.slice(-4)}`,
            points: 0,
          })
        }

        const current = studentMap.get(studentId)!
        if (direction === "positive" && isPositive) {
          current.points += pointValue
        } else if (direction === "negative" && !isPositive) {
          current.points += pointValue
        }
      })

      return Array.from(studentMap.values())
        .sort((a, b) =>
          direction === "positive" ? b.points - a.points : a.points - b.points
        )
        .slice(0, limit)
    },
    [records, behaviors]
  )

  // Statistics
  const statistics = useMemo(() => {
    const totalRecords = records.length
    const positiveRecords = records.filter((r) => {
      const behavior = behaviors.find((b) => b.id === r.behaviorTypeId)
      return behavior?.direction === "positive"
    }).length

    const totalPositivePoints = records.reduce((sum, r) => {
      const behavior = behaviors.find((b) => b.id === r.behaviorTypeId)
      return sum + (behavior?.direction === "positive" ? behavior.pointValue : 0)
    }, 0)

    const totalNegativePoints = records.reduce((sum, r) => {
      const behavior = behaviors.find((b) => b.id === r.behaviorTypeId)
      return sum + (behavior?.direction === "negative" ? Math.abs(behavior.pointValue) : 0)
    }, 0)

    return {
      totalRecords,
      positiveRecords,
      negativeRecords: totalRecords - positiveRecords,
      totalPositivePoints,
      totalNegativePoints,
      netPoints: totalPositivePoints - totalNegativePoints,
    }
  }, [records, behaviors])

  return {
    categories,
    behaviors,
    records,
    loading,
    error,
    statistics,
    isUsingDatabase,
    getBehaviorsByCategory,
    positiveBehaviors,
    negativeBehaviors,
    addRecord,
    updateRecord,
    approveRecord,
    getStudentSummary,
    getTopStudents,
    addCategory,
    updateCategory,
    deleteCategory,
    addBehavior,
    updateBehavior,
    deleteBehavior,
    refreshData,
    setCategories,
    setBehaviors,
    setRecords,
  }
}

// Hook for dashboard
export function useCharacterDashboard() {
  const {
    categories,
    positiveBehaviors,
    negativeBehaviors,
    getTopStudents,
    statistics,
    loading,
  } = useCharacter()

  const [topPositiveStudents, setTopPositiveStudents] = useState<
    { id: string; name: string; className?: string; points: number }[]
  >([])
  const [topNegativeStudents, setTopNegativeStudents] = useState<
    { id: string; name: string; className?: string; points: number }[]
  >([])

  useEffect(() => {
    const fetchTopStudents = async () => {
      const [positive, negative] = await Promise.all([
        getTopStudents(10, "positive"),
        getTopStudents(10, "negative"),
      ])
      setTopPositiveStudents(positive)
      setTopNegativeStudents(negative)
    }
    fetchTopStudents()
  }, [getTopStudents])

  return {
    categories,
    positiveBehaviors,
    negativeBehaviors,
    topPositiveStudents,
    topNegativeStudents,
    statistics,
    loading,
  }
}

// Hook for student search
export function useStudentSearch() {
  const [results, setResults] = useState<
    { id: string; name: string; className?: string; nisn?: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, student_number, student_classes(classes(name))")
        .eq("is_active", true)
        .or(`full_name.ilike.%${query}%,student_number.ilike.%${query}%`)
        .limit(10)

      if (!error && data) {
        const mapped = data.map((s: any) => ({
          id: s.id,
          name: s.full_name,
          nisn: s.student_number,
          className: s.student_classes?.[0]?.classes?.name,
        }))
        setResults(mapped)
      } else {
        console.error("Search error:", error)
        setResults([])
      }
    } catch (err) {
      console.error("Search error:", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => setResults([]), [])

  return { results, loading, search, clearResults }
}
