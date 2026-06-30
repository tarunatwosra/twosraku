/**
 * Student Constants - School Information System
 * Version: 1.0
 */

import type {
  Gender,
  GenderLabel,
  Religion,
  StudentStatus,
  StudentStatusLabel,
} from "@/types";

// Gender options
export const GENDERS: { value: Gender; label: GenderLabel }[] = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

// Religion options
export const RELIGIONS: Religion[] = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

// Student status options
export const STUDENT_STATUSES: { value: StudentStatus; label: StudentStatusLabel }[] = [
  { value: "active", label: "Aktif" },
  { value: "graduated", label: "Lulus" },
  { value: "transferred", label: "Pindah" },
  { value: "dropout", label: "Drop Out" },
];

// Class levels (for filtering)
export const CLASS_LEVELS = ["X", "XI", "XII"] as const;
export type ClassLevel = (typeof CLASS_LEVELS)[number];

// Academic years (example)
export const ACADEMIC_YEARS = [
  "2024/2025",
  "2023/2024",
  "2022/2023",
  "2021/2022",
] as const;
export type AcademicYear = (typeof ACADEMIC_YEARS)[number];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Gender label helper
export function getGenderLabel(gender: Gender): GenderLabel {
  return gender === "L" ? "Laki-laki" : "Perempuan";
}

// Status label helper
export function getStatusLabel(status: StudentStatus): StudentStatusLabel {
  const statusMap: Record<StudentStatus, StudentStatusLabel> = {
    active: "Aktif",
    graduated: "Lulus",
    transferred: "Pindah",
    dropout: "Drop Out",
  };
  return statusMap[status];
}
