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

// Student status options (using is_active boolean)
export const ACTIVE_OPTIONS = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Tidak Aktif" },
] as const

// Helper function to get gender label
export function getGenderLabel(gender: string): string {
  const found = GENDERS.find((g) => g.value === gender)
  return found?.label || gender
}

// Helper function to get status label from is_active
export function getStatusLabel(isActive: boolean): string {
  return isActive ? "Aktif" : "Tidak Aktif"
}
