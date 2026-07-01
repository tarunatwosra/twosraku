/**
 * Student Export Utility
 *
 * Fungsi-fungsi untuk export data siswa ke Excel/CSV/PDF
 */

import * as XLSX from "xlsx"
import type { StudentWithClass } from "@/types/database"

// ============================================
// TYPES
// ============================================

export interface ExportOptions {
  format: "xlsx" | "csv"
  includeHeaders?: boolean
  selectedColumns?: ExportColumn[]
  academicYearName?: string
}

export type ExportColumn =
  | "student_number"
  | "full_name"
  | "nickname"
  | "gender"
  | "birth_place"
  | "birth_date"
  | "religion"
  | "nationality"
  | "blood_type"
  | "address"
  | "phone"
  | "email"
  | "national_id"
  | "status"
  | "enrollment_year"
  | "class"
  | "father_name"
  | "mother_name"
  | "guardian_name"
  | "father_phone"
  | "mother_phone"

export const COLUMN_LABELS: Record<ExportColumn, string> = {
  student_number: "NIS",
  full_name: "Nama Lengkap",
  nickname: "Nama Panggilan",
  gender: "Jenis Kelamin",
  birth_place: "Tempat Lahir",
  birth_date: "Tanggal Lahir",
  religion: "Agama",
  nationality: "Kewarganegaraan",
  blood_type: "Golongan Darah",
  address: "Alamat",
  phone: "No. Telepon",
  email: "Email",
  national_id: "NIK",
  status: "Status",
  enrollment_year: "Tahun Masuk",
  class: "Kelas",
  father_name: "Nama Ayah",
  mother_name: "Nama Ibu",
  guardian_name: "Nama Wali",
  father_phone: "Telepon Ayah",
  mother_phone: "Telepon Ibu",
}

export const DEFAULT_COLUMNS: ExportColumn[] = [
  "student_number",
  "full_name",
  "gender",
  "birth_place",
  "birth_date",
  "religion",
  "address",
  "phone",
  "email",
  "status",
  "enrollment_year",
  "class",
]

// ============================================
// HELPERS
// ============================================

const GENDER_LABELS: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  graduated: "Lulus",
  transferred: "Pindah",
  prospective: "Calon Siswa",
  archived: "Diarsipkan",
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Get class name from student
 */
function getClassName(student: StudentWithClass, academicYearId?: string): string {
  const activeClass = student.student_classes?.find(
    (sc) =>
      academicYearId && sc.academic_year_id === academicYearId && sc.status === "active"
  )
  if (activeClass?.classes) {
    return `${activeClass.classes.grades?.name || ""} ${
      activeClass.classes.majors?.name || ""
    }`.trim()
  }
  // Fallback to any active class
  const anyActive = student.student_classes?.find((sc) => sc.status === "active")
  if (anyActive?.classes) {
    return `${anyActive.classes.grades?.name || ""} ${
      anyActive.classes.majors?.name || ""
    }`.trim()
  }
  return ""
}

/**
 * Get parent info from student
 */
function getParentInfo(
  student: StudentWithClass,
  type: "father" | "mother" | "guardian"
): { name: string; phone: string } {
  const parents = student.parents || []
  const parent = parents.find((p) => p.type === type)
  return {
    name: parent?.full_name || "",
    phone: parent?.phone || "",
  }
}

/**
 * Transform student data based on selected columns
 */
function transformStudentData(
  student: StudentWithClass,
  columns: ExportColumn[],
  academicYearId?: string
): Record<string, string> {
  const row: Record<string, string> = {}

  for (const col of columns) {
    switch (col) {
      case "student_number":
        row[COLUMN_LABELS[col]] = student.student_number || ""
        break
      case "full_name":
        row[COLUMN_LABELS[col]] = student.full_name || ""
        break
      case "nickname":
        row[COLUMN_LABELS[col]] = student.nickname || ""
        break
      case "gender":
        row[COLUMN_LABELS[col]] = GENDER_LABELS[student.gender] || student.gender || ""
        break
      case "birth_place":
        row[COLUMN_LABELS[col]] = student.birth_place || ""
        break
      case "birth_date":
        row[COLUMN_LABELS[col]] = formatDate(student.birth_date)
        break
      case "religion":
        row[COLUMN_LABELS[col]] = student.religion || ""
        break
      case "nationality":
        row[COLUMN_LABELS[col]] = student.nationality || ""
        break
      case "blood_type":
        row[COLUMN_LABELS[col]] = student.blood_type || ""
        break
      case "address":
        row[COLUMN_LABELS[col]] = student.address || ""
        break
      case "phone":
        row[COLUMN_LABELS[col]] = student.phone || ""
        break
      case "email":
        row[COLUMN_LABELS[col]] = student.email || ""
        break
      case "national_id":
        row[COLUMN_LABELS[col]] = student.national_id || ""
        break
      case "status":
        row[COLUMN_LABELS[col]] =
          STATUS_LABELS[student.status] || student.status || ""
        break
      case "enrollment_year":
        row[COLUMN_LABELS[col]] = student.enrollment_year?.toString() || ""
        break
      case "class":
        row[COLUMN_LABELS[col]] = getClassName(student, academicYearId)
        break
      case "father_name":
        row[COLUMN_LABELS[col]] = getParentInfo(student, "father").name
        break
      case "mother_name":
        row[COLUMN_LABELS[col]] = getParentInfo(student, "mother").name
        break
      case "guardian_name":
        row[COLUMN_LABELS[col]] = getParentInfo(student, "guardian").name
        break
      case "father_phone":
        row[COLUMN_LABELS[col]] = getParentInfo(student, "father").phone
        break
      case "mother_phone":
        row[COLUMN_LABELS[col]] = getParentInfo(student, "mother").phone
        break
    }
  }

  return row
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Export students to Excel file
 */
export function exportToExcel(
  students: StudentWithClass[],
  options: ExportOptions,
  academicYearId?: string
): void {
  const columns = options.selectedColumns || DEFAULT_COLUMNS

  // Transform data
  const data = students.map((student) =>
    transformStudentData(student, columns, academicYearId)
  )

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(
      COLUMN_LABELS[col].length,
      ...data.map((row) => (row[COLUMN_LABELS[col]] || "").length)
    ) + 2
  }))
  worksheet["!cols"] = colWidths

  // Add worksheet
  XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa")

  // Generate filename
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = options.academicYearName
    ? `daftar-siswa-${options.academicYearName.replace(/\s+/g, "-")}-${timestamp}.xlsx`
    : `daftar-siswa-${timestamp}.xlsx`

  // Download
  XLSX.writeFile(workbook, filename)
}

/**
 * Export students to CSV file
 */
export function exportToCSV(
  students: StudentWithClass[],
  options: ExportOptions,
  academicYearId?: string
): void {
  const columns = options.selectedColumns || DEFAULT_COLUMNS

  // Transform data
  const data = students.map((student) =>
    transformStudentData(student, columns, academicYearId)
  )

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa")

  // Generate filename
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = options.academicYearName
    ? `daftar-siswa-${options.academicYearName.replace(/\s+/g, "-")}-${timestamp}.csv`
    : `daftar-siswa-${timestamp}.csv`

  // Download as CSV
  XLSX.writeFile(workbook, filename, { bookType: "csv" })
}

/**
 * Export with the specified format
 */
export function exportStudents(
  students: StudentWithClass[],
  options: ExportOptions,
  academicYearId?: string
): void {
  if (options.format === "csv") {
    exportToCSV(students, options, academicYearId)
  } else {
    exportToExcel(students, options, academicYearId)
  }
}

/**
 * Generate export preview (first 5 rows)
 */
export function getExportPreview(
  students: StudentWithClass[],
  columns: ExportColumn[],
  academicYearId?: string
): Record<string, string>[] {
  return students.slice(0, 5).map((student) =>
    transformStudentData(student, columns, academicYearId)
  )
}
