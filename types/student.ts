/**
 * Student Types - School Information System
 * Version: 1.0
 */

// Gender enum
export type Gender = "L" | "P";

export type GenderLabel = "Laki-laki" | "Perempuan";

// Religion enum
export type Religion =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Buddha"
  | "Konghucu";

// Student status
export type StudentStatus = "active" | "graduated" | "transferred" | "dropout";

export type StudentStatusLabel =
  | "Aktif"
  | "Lulus"
  | "Pindah"
  | "Drop Out";

// Student interface
export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  religion: Religion;
  class?: string;
  academicYear?: string;
  address: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;

  // Parent/Guardian info
  fatherName?: string;
  fatherJob?: string;
  motherName?: string;
  motherJob?: string;
  guardianName?: string;
  guardianPhone?: string;

  // Academic
  status: StudentStatus;
  entryDate?: string;
  graduationDate?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Student filter
export interface StudentFilter {
  search?: string;
  gender?: Gender;
  class?: string;
  academicYear?: string;
  status?: StudentStatus;
  religion?: Religion;
}

// Pagination
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedStudents {
  data: Student[];
  pagination: Pagination;
}

// Create/Update DTO
export interface StudentFormData {
  nis: string;
  nisn: string;
  name: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  religion: Religion;
  class?: string;
  academicYear?: string;
  address: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  fatherName?: string;
  fatherJob?: string;
  motherName?: string;
  motherJob?: string;
  guardianName?: string;
  guardianPhone?: string;
  entryDate?: string;
}
