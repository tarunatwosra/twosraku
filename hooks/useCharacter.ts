"use client"

import { useState, useCallback, useMemo } from "react"
import {
  CharacterCategoryRecord,
  BehaviorType,
  CharacterRecord,
  RecordStatus,
  StudentCharacterSummary,
  SeverityLevel,
  CATEGORY_COLORS,
} from "@/types/character"

// Demo categories
const DEMO_CATEGORIES: CharacterCategoryRecord[] = [
  {
    id: "char-cat-1",
    name: "Disiplin",
    description: "Kedisiplinan siswa",
    color: CATEGORY_COLORS.discipline,
    displayOrder: 1,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "char-cat-2",
    name: "Tanggung Jawab",
    description: "Tanggung jawab siswa",
    color: CATEGORY_COLORS.responsibility,
    displayOrder: 2,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "char-cat-3",
    name: "Kepemimpinan",
    description: "Kemampuan kepemimpinan",
    color: CATEGORY_COLORS.leadership,
    displayOrder: 3,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "char-cat-4",
    name: "Sopan Santun",
    description: "Kesopanan dan keramahan",
    color: CATEGORY_COLORS.courtesy,
    displayOrder: 4,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

// Demo behavior types
const DEMO_BEHAVIORS: BehaviorType[] = [
  {
    id: "beh-1",
    categoryId: "char-cat-1",
    name: "Datang Tepat Waktu",
    description: "Datang sebelum jam masuk",
    pointValue: 10,
    direction: "positive",
    severity: "minor",
    requiresApproval: false,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "beh-2",
    categoryId: "char-cat-1",
    name: "Terlambat",
    description: "Datang setelah bel berbunyi",
    pointValue: -5,
    direction: "negative",
    severity: "minor",
    requiresApproval: false,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "beh-3",
    categoryId: "char-cat-1",
    name: "Seragam Tidak Lengkap",
    description: "Tidak memakai seragam dengan lengkap",
    pointValue: -10,
    direction: "negative",
    severity: "minor",
    requiresApproval: false,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "beh-4",
    categoryId: "char-cat-2",
    name: "Menyelesaikan Tugas",
    description: "Menyelesaikan tugas tepat waktu",
    pointValue: 15,
    direction: "positive",
    severity: "minor",
    requiresApproval: false,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "beh-5",
    categoryId: "char-cat-3",
    name: "Menjadi Komandan",
    description: "Berperan sebagai komandan kelompok",
    pointValue: 20,
    direction: "positive",
    severity: "moderate",
    requiresApproval: true,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "beh-6",
    categoryId: "char-cat-4",
    name: "Membantu Sesama",
    description: "Membantu teman yang kesulitan",
    pointValue: 15,
    direction: "positive",
    severity: "minor",
    requiresApproval: false,
    requiresCounseling: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export function useCharacter() {
  const [categories, setCategories] = useState<CharacterCategoryRecord[]>(
    DEMO_CATEGORIES
  )
  const [behaviors, setBehaviors] = useState<BehaviorType[]>(DEMO_BEHAVIORS)
  const [records, setRecords] = useState<CharacterRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get behaviors by category
  const getBehaviorsByCategory = useCallback(
    (categoryId: string) => {
      return behaviors.filter((b) => b.categoryId === categoryId)
    },
    [behaviors]
  )

  // Get positive behaviors
  const positiveBehaviors = useMemo(
    () => behaviors.filter((b) => b.direction === "positive"),
    [behaviors]
  )

  // Get negative behaviors
  const negativeBehaviors = useMemo(
    () => behaviors.filter((b) => b.direction === "negative"),
    [behaviors]
  )

  // Add record
  const addRecord = useCallback(
    async (record: Omit<CharacterRecord, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const newRecord: CharacterRecord = {
          ...record,
          id: `char-record-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setRecords((prev) => [...prev, newRecord])

        return { success: true, record: newRecord }
      } catch (err) {
        setError("Gagal menambahkan catatan")
        return { success: false, error: "Gagal menambahkan catatan" }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Update record
  const updateRecord = useCallback(
    async (recordId: string, updates: Partial<CharacterRecord>) => {
      setLoading(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        setRecords((prev) =>
          prev.map((r) =>
            r.id === recordId
              ? { ...r, ...updates, updatedAt: new Date().toISOString() }
              : r
          )
        )

        return { success: true }
      } catch (err) {
        setError("Gagal memperbarui catatan")
        return { success: false, error: "Gagal memperbarui catatan" }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Approve record
  const approveRecord = useCallback(
    async (recordId: string, approvedBy: string) => {
      return updateRecord(recordId, {
        status: "approved",
        approvedBy,
        approvedAt: new Date().toISOString(),
      })
    },
    [updateRecord]
  )

  // Calculate student summary
  const getStudentSummary = useCallback(
    (studentId: string): StudentCharacterSummary | null => {
      const studentRecords = records.filter((r) => r.studentId === studentId)

      if (studentRecords.length === 0) {
        return null
      }

      let positivePoints = 0
      let negativePoints = 0
      let positiveCount = 0
      let negativeCount = 0

      studentRecords.forEach((record) => {
        const behavior = behaviors.find((b) => b.id === record.behaviorTypeId)
        if (behavior) {
          if (behavior.direction === "positive") {
            positivePoints += behavior.pointValue
            positiveCount++
          } else {
            negativePoints += Math.abs(behavior.pointValue)
            negativeCount++
          }
        }
      })

      return {
        studentId,
        academicYearId: "1",
        semesterId: "1",
        positivePoints,
        negativePoints,
        netScore: positivePoints - negativePoints,
        totalRecords: studentRecords.length,
        positiveRecords: positiveCount,
        negativeRecords: negativeCount,
        recentActivities: studentRecords.slice(0, 5),
      }
    },
    [records, behaviors]
  )

  // Get top students
  const getTopStudents = useCallback(
    (limit: number = 10, direction: "positive" | "negative" = "positive") => {
      const studentMap = new Map<
        string,
        { id: string; name: string; points: number }
      >()

      // Generate demo students
      for (let i = 1; i <= 32; i++) {
        const points =
          direction === "positive"
            ? Math.floor(Math.random() * 100) + 50
            : Math.floor(Math.random() * 30)

        studentMap.set(`student-${i}`, {
          id: `student-${i}`,
          name: `Siswa ${i}`,
          points,
        })
      }

      return Array.from(studentMap.values())
        .sort((a, b) =>
          direction === "positive" ? b.points - a.points : a.points - b.points
        )
        .slice(0, limit)
    },
    []
  )

  // Statistics
  const statistics = useMemo(() => {
    const totalRecords = records.length
    const positiveRecords = records.filter((r) => {
      const behavior = behaviors.find((b) => b.id === r.behaviorTypeId)
      return behavior?.direction === "positive"
    }).length

    const negativeRecords = totalRecords - positiveRecords

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
      negativeRecords,
      totalPositivePoints,
      totalNegativePoints,
      netPoints: totalPositivePoints - totalNegativePoints,
    }
  }, [records, behaviors])

  return {
    // Data
    categories,
    behaviors,
    records,

    // State
    loading,
    error,
    statistics,

    // Getters
    getBehaviorsByCategory,
    positiveBehaviors,
    negativeBehaviors,

    // Actions
    addRecord,
    updateRecord,
    approveRecord,
    getStudentSummary,
    getTopStudents,

    // Setters
    setCategories,
    setBehaviors,
    setRecords,
  }
}

// Hook for character dashboard
export function useCharacterDashboard() {
  const { categories, positiveBehaviors, negativeBehaviors, getTopStudents, statistics } =
    useCharacter()

  return {
    categories,
    positiveBehaviors,
    negativeBehaviors,
    topPositiveStudents: getTopStudents(10, "positive"),
    topNegativeStudents: getTopStudents(10, "negative"),
    statistics,
  }
}
