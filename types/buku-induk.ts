/**
 * Constants for Student Registry
 *
 * Konstanta yang digunakan di Buku Induk
 */

// Re-export from database types
export type { Student, StudentWithClass, StudentFilters, StudentSortOptions } from "./database"

// Gender options for forms
export const GENDERS = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
] as const

// Student status options
export const STUDENT_STATUSES = [
  { value: "prospective", label: "Calon Siswa" },
  { value: "active", label: "Aktif" },
  { value: "transferred", label: "Pindah" },
  { value: "graduated", label: "Lulus" },
  { value: "archived", label: "Diarsipkan" },
] as const

// Religion options
export const RELIGIONS = [
  { value: "Islam", label: "Islam" },
  { value: "Kristen", label: "Kristen" },
  { value: "Katolik", label: "Katolik" },
  { value: "Hindu", label: "Hindu" },
  { value: "Buddha", label: "Buddha" },
  { value: "Konghucu", label: "Konghucu" },
] as const

// Blood type options
export const BLOOD_TYPES = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
] as const

// Education level options
export const EDUCATION_LEVELS = [
  { value: "SD", label: "SD/Sederajat" },
  { value: "SMP", label: "SMP/Sederajat" },
  { value: "SMA", label: "SMA/Sederajat" },
  { value: "D1", label: "Diploma I" },
  { value: "D2", label: "Diploma II" },
  { value: "D3", label: "Diploma III" },
  { value: "D4", label: "Diploma IV" },
  { value: "S1", label: "Sarjana (S1)" },
  { value: "S2", label: "Magister (S2)" },
  { value: "S3", label: "Doktor (S3)" },
] as const

// Parent type options
export const PARENT_TYPES = [
  { value: "father", label: "Ayah" },
  { value: "mother", label: "Ibu" },
  { value: "guardian", label: "Wali" },
] as const

// Helper function to get gender label
export function getGenderLabel(gender: string): string {
  const found = GENDERS.find((g) => g.value === gender)
  return found?.label || gender
}

// Helper function to get status label
export function getStatusLabel(status: string): string {
  const found = STUDENT_STATUSES.find((s) => s.value === status)
  return found?.label || status
}

// Helper function to get religion label
export function getReligionLabel(religion: string): string {
  const found = RELIGIONS.find((r) => r.value === religion)
  return found?.label || religion
}

// Helper function to get blood type label
export function getBloodTypeLabel(bloodType: string): string {
  const found = BLOOD_TYPES.find((b) => b.value === bloodType)
  return found?.label || bloodType
}
