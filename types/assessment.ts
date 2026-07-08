// =============================================
// Assessment System Types (New Architecture)
// =============================================

// Core entities

// --- Kategori (Jasmani Taruna, PBB, dll) ---
export interface AssessmentCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  displayOrder: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  // Computed fields (from API)
  periodCount?: number
  itemCount?: number
}

// --- Item (Push Up, Sit Up, Lari, dll) ---
export type InputType = "number" | "count" | "time" | "percentage" | "boolean"
export type ConversionType = "direct" | "multiply" | "lookup_table" | "formula"
// Alias for backwards compatibility
export type ScoreType = InputType

export interface AssessmentItem {
  id: string
  categoryId: string
  // Alias for backwards compatibility
  templateId?: string
  name: string
  description?: string
  inputType: InputType
  // Alias for backwards compatibility
  scoreType?: InputType
  conversionType: ConversionType
  // conversion_value:
  //   - 'direct': tidak ada value
  //   - 'multiply': angka multiplier (misal 2.5)
  //   - 'lookup_table': JSON string (misal '{"10:00": 100, "11:00": 90}')
  //   - 'formula': rumus (misal 'x * 2.5')
  conversionValue?: string
  scoreMin: number
  scoreMax: number
  // Aliases for backwards compatibility
  minScore?: number
  maxScore?: number
  passingScore?: number
  required?: boolean
  weight: number // bobot item dalam 1 periode
  displayOrder: number
  isRequired: boolean
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Periode (Januari, April, Juli, Oktober) ---
export interface AssessmentPeriod {
  id: string
  categoryId: string
  periodName: string
  periodOrder: number
  startDate?: string
  endDate?: string
  weightPercentage: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Period Score (Nilai per item per siswa per periode) ---
export interface AssessmentPeriodScore {
  id: string
  periodId: string
  studentId: string
  itemId: string
  rawInput?: string // Input asli user (misal "35" atau "12:30")
  convertedScore?: number // Nilai setelah konversi
  createdAt: string
  updatedAt: string
  // Joined fields
  student?: {
    id: string
    name: string
    studentNumber: string
    class?: string
  }
  item?: AssessmentItem
}

// --- Category Score (Nilai akhir kategori per siswa) ---
export interface AssessmentCategoryScore {
  id: string
  studentId: string
  categoryId: string
  academicYearId?: string
  semesterId?: string
  totalScore?: number
  grade?: string
  calculatedAt: string
  createdAt: string
  updatedAt: string
}

// --- Formula Component ---
export interface FormulaComponent {
  type: "category" | "module"
  id?: string // untuk type="category"
  module?: string // untuk type="module" (misal "attendance")
  weight: number
  name?: string // computed from category/module
}

// --- Formula (Kombinasi Nilai Kategori + modul lain) ---
export interface AssessmentFormula {
  id: string
  name: string
  description?: string
  academicYearId?: string
  semesterId?: string
  components: FormulaComponent[]
  totalWeight: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Nilai Rapor ---
export interface AssessmentRapor {
  id: string
  studentId: string
  academicYearId: string
  semesterId?: string
  formulas: Record<string, number> // { formulaId: score }
  formulaValues: {
    [formulaId: string]: {
      name: string
      score: number
      weight: number
    }
  }
  totalScore?: number
  grade?: string
  status: "draft" | "calculated" | "final"
  createdAt: string
  updatedAt: string
}

// --- Attendance Conversion Rules ---
export interface AttendanceConversionRule {
  id: string
  name: string
  description?: string
  sourceField: "attendance_rate" | "total_present" | "total_absent" | "sick_days" | "permission_days"
  lookupTable: Record<string, number>
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Lookup Table Types ---
export interface LookupTableEntry {
  input: string | number
  output: number
}

// =============================================
// Grading System
// =============================================

export interface GradeInterval {
  grade: string
  minScore: number
  maxScore: number
  description: string
  color: string
  isPassing: boolean
}

export const DEFAULT_GRADING_SCALE: GradeInterval[] = [
  { grade: "A", minScore: 90, maxScore: 100, description: "Sangat Baik", color: "#22C55E", isPassing: true },
  { grade: "B", minScore: 80, maxScore: 89, description: "Baik", color: "#3B82F6", isPassing: true },
  { grade: "C", minScore: 70, maxScore: 79, description: "Cukup", color: "#F59E0B", isPassing: true },
  { grade: "D", minScore: 60, maxScore: 69, description: "Kurang", color: "#F97316", isPassing: true },
  { grade: "E", minScore: 0, maxScore: 59, description: "Sangat Kurang", color: "#EF4444", isPassing: false },
]

// Alias for backwards compatibility
export type GradingScale = GradeInterval[]

// =============================================
// Conversion Utilities
// =============================================

export function convertInput(
  input: string,
  inputType: InputType,
  conversionType: ConversionType,
  conversionValue?: string
): number {
  const numericInput = parseFloat(input)

  switch (conversionType) {
    case "direct":
      return numericInput

    case "multiply":
      const multiplier = parseFloat(conversionValue || "1")
      return numericInput * multiplier

    case "lookup_table":
      if (!conversionValue) return numericInput
      try {
        const lookup = JSON.parse(conversionValue) as Record<string, number>
        // Handle time format (e.g., "12:30")
        const key = input
        if (lookup[key] !== undefined) {
          return lookup[key]
        }
        // Fallback to direct conversion
        return numericInput
      } catch {
        return numericInput
      }

    case "formula":
      // Simple formula support: x * n
      const formulaMatch = conversionValue?.match(/x\s*\*\s*(\d+\.?\d*)/i)
      if (formulaMatch) {
        return numericInput * parseFloat(formulaMatch[1])
      }
      return numericInput

    default:
      return numericInput
  }
}

export function calculateGrade(score: number, scale: GradeInterval[] = DEFAULT_GRADING_SCALE): string {
  for (const interval of scale) {
    if (score >= interval.minScore && score <= interval.maxScore) {
      return interval.grade
    }
  }
  return "E"
}

export function calculateCategoryScore(
  periodScores: { score: number; weight: number }[]
): number {
  const totalWeight = periodScores.reduce((sum, p) => sum + p.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = periodScores.reduce((sum, p) => sum + p.score * p.weight, 0)
  return weightedSum / totalWeight
}

// =============================================
// Student Score Card (UI State)
// =============================================

export interface StudentScoreCard {
  studentId: string
  studentName: string
  studentNumber: string
  className?: string
  items: {
    itemId: string
    itemName: string
    rawInput: string
    convertedScore: number
    weight: number
  }[]
  periodScore?: number
  grade?: string
}

export interface CategoryScoreCard {
  categoryId: string
  categoryName: string
  periods: {
    periodId: string
    periodName: string
    weight: number
    students: StudentScoreCard[]
  }[]
  categoryScore?: number
  grade?: string
}

// =============================================
// API Response Types
// =============================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// =============================================
// Form State Types
// =============================================

export interface CategoryFormState {
  name: string
  description: string
  icon: string
  color: string
  status: "active" | "inactive"
}

export interface ItemFormState {
  name: string
  description: string
  inputType: InputType
  conversionType: ConversionType
  conversionValue: string
  scoreMin: number
  scoreMax: number
  weight: number
  isRequired: boolean
}

export interface PeriodFormState {
  periodName: string
  startDate: string
  endDate: string
  weightPercentage: number
}

export interface FormulaFormState {
  name: string
  description: string
  academicYearId: string
  semesterId: string
  components: FormulaComponent[]
}

// =============================================
// Legacy Types (for backwards compatibility)
// =============================================

// Template for assessment sessions
export interface AssessmentTemplate {
  id: string
  categoryId?: string
  name: string
  description?: string
  scoringMethod: "weighted_average" | "simple_average" | "highest" | "lowest"
  passingScore: number
  minScore: number
  maxScore: number
  allowDecimal: boolean
  autoCalculate: boolean
  status: string
  displayOrder: number
  createdBy?: string
  createdAt: string
  updatedAt: string
  // From join
  category?: {
    id: string
    name: string
    color?: string
  }
}

// Deprecated: Use AssessmentItem instead
export interface LegacyAssessmentItem {
  id: string
  templateId: string
  name: string
  description?: string
  scoreType: string
  weight: number
  minScore: number
  maxScore: number
  passingScore?: number
  displayOrder: number
  isRequired: boolean
  status: string
  createdAt: string
  updatedAt: string
}

// Deprecated: Use AssessmentPeriod instead
export interface AssessmentSession {
  id: string
  templateId: string
  name: string
  academicYearId: string
  semesterId?: string
  classId?: string
  evaluatorId: string
  startDate?: string
  endDate?: string
  status: string
  isLocked: boolean
  lockedBy?: string
  lockedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type SessionStatus = "draft" | "open" | "in_progress" | "completed" | "reviewed" | "locked" | "archived"

// Backwards compatibility aliases
export type ParticipationStatus = "assigned" | "present" | "absent" | "excused"
export type ScoreStatus = "pending" | "saved" | "submitted" | "reviewed"

// Score summary
export interface ScoreSummary {
  totalScores: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passCount: number
  failCount: number
}

// Session detail
export interface SessionDetail {
  session: AssessmentSession
  template: AssessmentTemplate
  category: AssessmentCategory
  participants: AssessmentParticipant[]
  scores: StudentScore[]
}

// Formula type
export type FormulaType = "average" | "weighted" | "highest" | "lowest" | "custom"

// Calculation result
export interface CalculationResult {
  studentId: string
  scores: {
    itemId: string
    rawScore: number
    finalScore: number
  }[]
  totalScore: number
  grade: string
}

// Assessment filter
export interface AssessmentFilter {
  categoryId?: string
  templateId?: string
  sessionId?: string
  academicYearId?: string
  semesterId?: string
  classId?: string
  status?: SessionStatus
}

// Assessment report
export interface AssessmentReport {
  generatedAt: string
  generatedBy: string
  filters: AssessmentFilter
  summary: ScoreSummary
  students: StudentScoreCard[]
}

// Score validation
export interface ScoreValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Participant in an assessment session
export interface AssessmentParticipant {
  id: string
  sessionId: string
  studentId: string
  status: string
  assignedAt: string
  assignedBy: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Score for a student on an assessment item
export interface StudentScore {
  id: string
  participantId: string
  itemId: string
  sessionId: string
  studentId: string
  rawScore?: number
  finalScore?: number
  grade?: string
  remark?: string
  evidence?: string
  status: string
  createdAt: string
  updatedAt: string
}
