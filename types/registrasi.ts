/**
 * Registration Types
 *
 * Type definitions untuk fitur Registrasi Mandiri Siswa
 */

import type { Student, Parent } from "./database"

// ============================================
// REGISTRATION STATUS
// ============================================

export type RegistrationStatus = "pending" | "in_progress" | "completed" | "verified_by_admin"

// ============================================
// VERIFICATION
// ============================================

export interface VerifyStudentData {
  student_number: string
  birth_date: string
}

export interface VerifyStudentResult {
  status: "success" | "not_found" | "invalid_date" | "already_completed" | "error"
  message: string
  student?: Student
  canReupload?: boolean
}

// ============================================
// REGISTRATION DATA
// ============================================

export interface RegistrationFormData {
  // Data Diri
  student_number: string
  nisn: string
  full_name: string
  nickname: string
  gender: "male" | "female"
  blood_type: string
  birth_place: string
  birth_date: string
  religion: string
  phone: string
  address: string

  // Data Akademik (read-only display)
  enrollment_year: number

  // Data Orang Tua/Wali
  father_name: string
  father_phone: string
  mother_name: string
  mother_phone: string
  guardian_name: string
  guardian_relation: string
  guardian_phone: string

  // Fisik dan Kesehatan
  height_cm: string
  weight_kg: string
  vision: string
  hearing: string
  teeth: string
  physical_disability: string
  illness_history: string
  allergies: string
  health_notes: string

  // Lainnya
  notes: string
}

export interface RegistrationParentData {
  type: "father" | "mother" | "guardian"
  full_name: string
  phone?: string | null
  occupation?: string | null
  guardian_relation?: string | null
}

// ============================================
// REGISTRATION SUBMISSION
// ============================================

export interface RegistrationSubmission {
  studentId: string
  data: Partial<RegistrationFormData>
  parents: RegistrationParentData[]
  completedAt: string
  ipAddress?: string
  device?: string
}

// ============================================
// REGISTRATION STATS
// ============================================

export interface RegistrationStats {
  totalStudents: number
  completedCount: number
  pendingCount: number
  completionRate: number
}

// ============================================
// REGISTRATION SETTINGS
// ============================================

export interface RegistrationSettings {
  isEnabled: boolean
  registrationUrl: string
  openedAt: string | null
  closedAt: string | null
  totalAccess: number
}

// ============================================
// FORM STEPS
// ============================================

export enum RegistrationStep {
  VERIFY = "verify",
  PERSONAL = "personal",
  ACADEMIC = "academic",
  PARENTS = "parents",
  HEALTH = "health",
  OTHER = "other",
  COMPLETE = "complete",
}

export const REGISTRATION_STEPS = [
  { key: RegistrationStep.PERSONAL, label: "Data Diri" },
  { key: RegistrationStep.ACADEMIC, label: "Akademik" },
  { key: RegistrationStep.PARENTS, label: "Orang Tua" },
  { key: RegistrationStep.HEALTH, label: "Kesehatan" },
  { key: RegistrationStep.OTHER, label: "Lainnya" },
] as const

// ============================================
// SESSION STORAGE
// ============================================

export interface RegistrationSession {
  studentId: string
  studentNumber: string
  verifiedAt: string
  currentStep: RegistrationStep
  formData: Partial<RegistrationFormData>
}
