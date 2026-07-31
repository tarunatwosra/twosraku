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
  // Data Diri (Step 1)
  full_name: string
  nickname: string
  gender: "male" | "female"
  blood_type: string
  birth_place: string
  birth_date: string
  religion: string
  phone: string

  // Alamat (Step 2) - 8 field terpisah, disimpan sebagai 1 string di database
  address_street: string      // Nama Jalan/Perumahan
  address_village: string     // Desa/Dusun/Kampung
  address_rt: string          // RT
  address_rw: string          // RW
  address_neighborhood: string // Kelurahan
  address_subdistrict: string // Kecamatan
  address_city: string        // Kabupaten/Kota
  address_province: string    // Provinsi
  address: string            // Legacy - digabung saat save

  // Akademik (Step 3)
  nisn: string
  student_number: string     // NIS lokal (auto-filled dari database)
  class_id: string           // ID kelas yang dipilih
  attendance_number: string   // No. Absen (diisi manual oleh siswa)
  academic_year: string      // Tahun ajaran aktif (auto-filled, read-only)

  // Data Orang Tua/Wali (Step 4)
  father_name: string
  father_phone: string
  mother_name: string
  mother_phone: string
  guardian_name: string
  guardian_relation: string
  guardian_phone: string

  // Fisik dan Kesehatan (Step 5)
  height_cm: string
  weight_kg: string
  vision: string
  hearing: string
  teeth: string
  physical_disability: string
  illness_history: string
  allergies: string
  health_notes: string

  // Lainnya (Step 6)
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
// FORM STEPS (6 Steps)
// ============================================

export enum RegistrationStep {
  VERIFY = "verify",
  PERSONAL = "personal",       // Step 1: Data Diri
  ADDRESS = "address",         // Step 2: Alamat Lengkap (BARU)
  ACADEMIC = "academic",       // Step 3: Akademik
  PARENTS = "parents",         // Step 4: Orang Tua/Wali
  HEALTH = "health",           // Step 5: Kesehatan
  OTHER = "other",             // Step 6: Lainnya
  COMPLETE = "complete",
}

export const REGISTRATION_STEPS = [
  { key: RegistrationStep.PERSONAL, label: "Data Diri", icon: "User" },
  { key: RegistrationStep.ADDRESS, label: "Alamat", icon: "MapPin" },
  { key: RegistrationStep.ACADEMIC, label: "Akademik", icon: "GraduationCap" },
  { key: RegistrationStep.PARENTS, label: "Orang Tua", icon: "Users" },
  { key: RegistrationStep.HEALTH, label: "Kesehatan", icon: "Heart" },
  { key: RegistrationStep.OTHER, label: "Lainnya", icon: "StickyNote" },
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
