// Assessment Types

// Core entities
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
}

export interface AssessmentTemplate {
  id: string
  categoryId: string
  name: string
  description?: string
  academicYearScope: string[]
  scoringMethod: "weighted_average" | "simple_average" | "highest" | "lowest"
  passingScore: number
  maxScore: number
  minScore: number
  allowDecimal: boolean
  autoCalculate: boolean
  status: "draft" | "active" | "inactive" | "archived"
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface AssessmentItem {
  id: string
  templateId: string
  name: string
  description?: string
  scoreType: ScoreType
  weight: number
  minScore: number
  maxScore: number
  passingScore?: number
  displayOrder: number
  required: boolean
  status: "draft" | "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface AssessmentSession {
  id: string
  templateId: string
  name: string
  academicYearId: string
  semesterId: string
  classId?: string
  evaluatorId: string
  startDate?: string
  endDate?: string
  status: SessionStatus
  locked: boolean
  lockedBy?: string
  lockedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AssessmentParticipant {
  id: string
  sessionId: string
  studentId: string
  status: ParticipationStatus
  assignedAt: string
  assignedBy: string
  notes?: string
}

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
  evaluatorId: string
  scoredAt: string
  updatedAt: string
  status: ScoreStatus
}

// Types and enums
export type ScoreType =
  | "numeric"
  | "percentage"
  | "boolean"
  | "rating"
  | "letter_grade"
  | "custom_scale"

export type SessionStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "reviewed"
  | "locked"
  | "archived"

export type ParticipationStatus =
  | "assigned"
  | "present"
  | "absent"
  | "completed"
  | "excluded"
  | "withdrawn"

export type ScoreStatus = "draft" | "saved" | "reviewed" | "approved" | "locked"

// Score summary
export interface ScoreSummary {
  studentId: string
  sessionId: string
  averageScore: number
  highestScore: number
  lowestScore: number
  passingStatus: boolean
  grade: string
  completionPercentage: number
  items: {
    itemId: string
    rawScore?: number
    finalScore?: number
    grade?: string
  }[]
}

// Grade conversion
export interface GradeInterval {
  grade: string
  minScore: number
  maxScore: number
  description: string
  color: string
  isPassing: boolean
}

export interface GradingScale {
  id: string
  name: string
  intervals: GradeInterval[]
}

// Session detail view
export interface SessionDetail {
  session: AssessmentSession
  template: AssessmentTemplate
  category: AssessmentCategory
  items: AssessmentItem[]
  participants: {
    participant: AssessmentParticipant
    student: {
      id: string
      name: string
      studentNumber: string
      class: string
    }
    summary?: ScoreSummary
  }[]
  statistics: {
    totalParticipants: number
    completedScores: number
    averageScore: number
    highestScore: number
    lowestScore: number
    passRate: number
  }
}

// Formulas
export type FormulaType = "weighted_average" | "simple_average" | "highest" | "lowest"

export interface CalculationResult {
  rawScore: number
  weight: number
  weightedScore: number
  totalWeightedScore: number
  finalScore: number
  grade: string
}

// Filter types
export interface AssessmentFilter {
  academicYearId?: string
  semesterId?: string
  categoryId?: string
  templateId?: string
  sessionId?: string
  classId?: string
  evaluatorId?: string
  status?: SessionStatus
  dateRange?: {
    start: string
    end: string
  }
}

// Report types
export interface AssessmentReport {
  id: string
  type: "session" | "student" | "class" | "template" | "ranking"
  sessionId?: string
  studentId?: string
  classId?: string
  generatedBy: string
  generatedAt: string
  data: Record<string, unknown>
}

// Validation
export interface ScoreValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Default grading scale
export const DEFAULT_GRADING_SCALE: GradeInterval[] = [
  { grade: "A", minScore: 90, maxScore: 100, description: "Sangat Baik", color: "#22C55E", isPassing: true },
  { grade: "B", minScore: 80, maxScore: 89, description: "Baik", color: "#3B82F6", isPassing: true },
  { grade: "C", minScore: 70, maxScore: 79, description: "Cukup", color: "#F59E0B", isPassing: true },
  { grade: "D", minScore: 60, maxScore: 69, description: "Kurang", color: "#F97316", isPassing: true },
  { grade: "E", minScore: 0, maxScore: 59, description: "Sangat Kurang", color: "#EF4444", isPassing: false },
]
