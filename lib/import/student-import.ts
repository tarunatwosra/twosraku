/**
 * Student Import Utility
 *
 * Fungsi-fungsi untuk import data siswa dari Excel/CSV
 * Enhanced with Dry Run, Field Mapping, and Import Strategies
 */

import * as XLSX from "xlsx"

// ============================================
// TYPES
// ============================================

export interface ImportRow {
  rowNumber: number
  student_number: string
  national_id: string
  nisn: string
  full_name: string
  nickname: string
  gender: string
  birth_place: string
  birth_date: string
  religion: string
  nationality: string
  blood_type: string
  address: string
  phone: string
  email: string
  enrollment_year: string
  status: string
  // Parent data
  father_name: string
  father_phone: string
  mother_name: string
  mother_phone: string
  guardian_name: string
  guardian_phone: string
  guardian_relation: string
  // Health data
  height_cm: string
  weight_kg: string
  vision: string
  hearing: string
  teeth_condition: string
  physical_disability: string
  illness_history: string
  allergies: string
  health_notes: string
}

export interface ImportError {
  row: number
  field: string
  message: string
  severity: "error" | "warning"
}

export interface ImportResult {
  success: boolean
  data: ImportRow[]
  errors: ImportError[]
  totalRows: number
  validRows: number
  errorRows: number
}

// Import Strategy Types
export type ImportStrategy = "insert" | "update" | "upsert" | "skip"

export interface ImportStrategyInfo {
  strategy: ImportStrategy
  label: string
  description: string
  icon: string
}

export const IMPORT_STRATEGIES: ImportStrategyInfo[] = [
  {
    strategy: "insert",
    label: "Tambah Baru",
    description: "Hanya menambahkan siswa baru. Mengabaikan jika NIS sudah ada.",
    icon: "plus",
  },
  {
    strategy: "upsert",
    label: "Tambah/Update",
    description: "Menambahkan siswa baru atau mengupdate yang sudah ada.",
    icon: "refresh",
  },
  {
    strategy: "update",
    label: "Update Saja",
    description: "Hanya mengupdate siswa yang sudah ada. Mengabaikan yang baru.",
    icon: "edit",
  },
  {
    strategy: "skip",
    label: "Lewati Duplikat",
    description: "Mengabaikan semua siswa yang sudah ada di database.",
    icon: "skip",
  },
]

// Field Mapping Types
export interface FieldMapping {
  sourceColumn: string
  targetField: keyof ImportRow | ""
}

export interface FieldDefinition {
  key: keyof ImportRow
  label: string
  required: boolean
  type: "text" | "date" | "select" | "number"
  options?: string[]
}

// Available fields for mapping
export const AVAILABLE_FIELDS: FieldDefinition[] = [
  { key: "student_number", label: "NIS", required: true, type: "text" },
  { key: "full_name", label: "Nama Lengkap", required: true, type: "text" },
  { key: "nickname", label: "Nama Panggilan", required: false, type: "text" },
  { key: "gender", label: "Jenis Kelamin", required: false, type: "select", options: ["male", "female", "laki-laki", "perempuan", "L", "P"] },
  { key: "birth_place", label: "Tempat Lahir", required: false, type: "text" },
  { key: "birth_date", label: "Tanggal Lahir", required: false, type: "date" },
  { key: "religion", label: "Agama", required: false, type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"] },
  { key: "nationality", label: "Kewarganegaraan", required: false, type: "text" },
  { key: "blood_type", label: "Golongan Darah", required: false, type: "select", options: ["A", "B", "AB", "O", "Tidak Tahu"] },
  { key: "address", label: "Alamat", required: false, type: "text" },
  { key: "phone", label: "No. Telepon", required: false, type: "text" },
  { key: "email", label: "Email", required: false, type: "text" },
  { key: "national_id", label: "NIK", required: false, type: "text" },
  { key: "nisn", label: "NISN", required: false, type: "text" },
  { key: "enrollment_year", label: "Tahun Masuk", required: false, type: "number" },
  // Parent fields
  { key: "father_name", label: "Nama Ayah", required: false, type: "text" },
  { key: "father_phone", label: "No. HP Ayah", required: false, type: "text" },
  { key: "mother_name", label: "Nama Ibu", required: false, type: "text" },
  { key: "mother_phone", label: "No. HP Ibu", required: false, type: "text" },
  { key: "guardian_name", label: "Nama Wali", required: false, type: "text" },
  { key: "guardian_phone", label: "No. HP Wali", required: false, type: "text" },
  { key: "guardian_relation", label: "Hubungan Wali", required: false, type: "text" },
  // Health fields
  { key: "height_cm", label: "Tinggi Badan (cm)", required: false, type: "number" },
  { key: "weight_kg", label: "Berat Badan (kg)", required: false, type: "number" },
  { key: "vision", label: "Penglihatan", required: false, type: "select", options: ["Normal", "Tidak Normal"] },
  { key: "hearing", label: "Pendengaran", required: false, type: "select", options: ["Normal", "Tidak Normal"] },
  { key: "teeth_condition", label: "Kondisi Gigi", required: false, type: "select", options: ["Normal", "Tidak Normal"] },
  { key: "physical_disability", label: "Cacat Tubuh", required: false, type: "select", options: ["Tidak Ada", "Ada"] },
  { key: "illness_history", label: "Riwayat Sakit", required: false, type: "text" },
  { key: "allergies", label: "Alergi", required: false, type: "text" },
  { key: "health_notes", label: "Catatan Kesehatan", required: false, type: "text" },
]

// Default column mapping (Excel column name -> field name)
export const COLUMN_MAPPING: Record<string, keyof ImportRow> = {
  // Basic fields
  NIS: "student_number",
  "Nomor Induk": "student_number",
  "Student Number": "student_number",
  "Nama Lengkap": "full_name",
  "Full Name": "full_name",
  Name: "full_name",
  "Nama Panggilan": "nickname",
  Nickname: "nickname",
  "Jenis Kelamin": "gender",
  Gender: "gender",
  Kelamin: "gender",
  "Tempat Lahir": "birth_place",
  "Birth Place": "birth_place",
  "Tanggal Lahir": "birth_date",
  "Birth Date": "birth_date",
  "Tgl Lahir": "birth_date",
  Agama: "religion",
  Religion: "religion",
  Kewarganegaraan: "nationality",
  Nationality: "nationality",
  "Golongan Darah": "blood_type",
  "Blood Type": "blood_type",
  Alamat: "address",
  Address: "address",
  Telepon: "phone",
  Phone: "phone",
  "No. Telepon": "phone",
  HP: "phone",
  Email: "email",
  "Tahun Masuk": "enrollment_year",
  "Enrollment Year": "enrollment_year",
  "Tahun Daftar": "enrollment_year",
  NIK: "national_id",
  "National ID": "national_id",
  NISN: "nisn",
  Status: "status",
  // Parent fields
  "Nama Ayah": "father_name",
  "Nama Ibu": "mother_name",
  "Nama Wali": "guardian_name",
  "No. HP Ayah": "father_phone",
  "No. HP Ibu": "mother_phone",
  "No. HP Wali": "guardian_phone",
  "Hubungan Wali": "guardian_relation",
  // Health fields
  "Tinggi Badan": "height_cm",
  "Berat Badan": "weight_kg",
  "Tinggi (cm)": "height_cm",
  "Berat (kg)": "weight_kg",
  Penglihatan: "vision",
  Pendengaran: "hearing",
  "Kondisi Gigi": "teeth_condition",
  "Cacat Tubuh": "physical_disability",
  "Riwayat Sakit": "illness_history",
  Alergi: "allergies",
  "Catatan Kesehatan": "health_notes",
}

// ============================================
// DATE CONVERSION
// ============================================

/**
 * Convert Excel serial number to YYYY-MM-DD format (for database)
 * Excel serial date: 1 = Jan 1, 1900 (with leap year bug)
 */
function excelSerialToDate(serial: number): string {
  // Excel serial date epoch: Dec 30, 1899 is day 0
  // Excel incorrectly treats 1900 as a leap year, so we subtract 1 for dates after Feb 28, 1900
  const msPerDay = 24 * 60 * 60 * 1000
  const excelEpoch = new Date(1899, 11, 30).getTime()
  const date = new Date(excelEpoch + serial * msPerDay)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  // Return as YYYY-MM-DD for database compatibility
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
}

/**
 * Convert date to DD/MM/YYYY format (for display)
 */
function excelSerialToDisplayDate(serial: number): string {
  const msPerDay = 24 * 60 * 60 * 1000
  const excelEpoch = new Date(1899, 11, 30).getTime()
  const date = new Date(excelEpoch + serial * msPerDay)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  // Return as DD/MM/YYYY for display
  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`
}

/**
 * Check if a value is an Excel serial date
 * Excel serial dates are typically numbers > 25569 (Jan 1, 1970) and < 60000
 */
function isExcelSerialDate(value: unknown): boolean {
  if (typeof value !== "number") return false
  // Excel serial dates for reasonable date ranges (1970-2100)
  // Jan 1, 1970 = 25569, Jan 1, 2100 = 73049
  return value > 25569 && value < 73050 && Number.isInteger(value)
}

/**
 * Parse and format date from various formats
 * Handles: DD/MM/YYYY, YYYY-MM-DD, Excel serial numbers
 * Returns YYYY-MM-DD for database compatibility
 */
function parseAndFormatDate(value: string | number | unknown): string | null {
  if (value === null || value === undefined || value === "") return null

  // If it's an Excel serial number
  if (typeof value === "number" && isExcelSerialDate(value)) {
    return excelSerialToDate(value)
  }

  // If it's a string that looks like an Excel serial
  const strValue = String(value).trim()
  const numValue = parseInt(strValue)
  if (!isNaN(numValue) && isExcelSerialDate(numValue)) {
    return excelSerialToDate(numValue)
  }

  // Try parsing as DD/MM/YYYY or YYYY-MM-DD
  const parsed = parseDate(strValue)
  return parsed
}

// ============================================
// PARSING FUNCTIONS
// ============================================

/**
 * Parse file Excel/CSV
 * Returns dates in YYYY-MM-DD format for database compatibility
 */
export function parseFile(
  file: File
): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result

        // Read with cellDates: true to get dates as Date objects
        const workbook = XLSX.read(data, {
          type: "array",
          cellDates: true,
          cellNF: true,
        })

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Get raw cell data for better date detection
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
        const headers: string[] = []

        // Get headers from first row
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: C })
          const cell = worksheet[cellRef]
          headers.push(cell ? String(cell.v || "").trim() : "")
        }

        // Check if a column header suggests it's a date field
        const dateHeaderPatterns = /tanggal|tgl|birth|date|lahir/i
        const isDateColumn = (header: string): boolean => {
          return dateHeaderPatterns.test(header)
        }

        // Helper to convert Date to YYYY-MM-DD
        const dateToYYYYMMDD = (date: Date): string => {
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()
          return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
        }

        // Helper to check if a number could be an Excel serial date
        const isLikelySerialDate = (val: number, header: string): boolean => {
          // Excel serial dates for reasonable date ranges (1970-2100)
          // Jan 1, 1970 = 25569, Jan 1, 2100 = 73049
          const isInRange = val > 25569 && val < 73050 && Number.isInteger(val)
          // Also check if it's a date column
          return isInRange && isDateColumn(header)
        }

        // Convert each row, handling dates
        const rows: Record<string, string>[] = []
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const row: Record<string, string> = {}
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
            const cell = worksheet[cellRef]
            const header = headers[C] || `Column${C}`

            if (!cell) {
              row[header] = ""
              continue
            }

            // Handle different cell types
            if (cell.t === "d") {
              // It's a Date object
              const date = cell.v as Date
              if (date instanceof Date && !isNaN(date.getTime())) {
                row[header] = dateToYYYYMMDD(date)
              } else {
                row[header] = String(cell.v || "").trim()
              }
            } else if (cell.t === "n") {
              // It's a number - check if it could be a date
              const numVal = cell.v as number
              if (isLikelySerialDate(numVal, header)) {
                // Convert Excel serial to date
                const msPerDay = 24 * 60 * 60 * 1000
                const excelEpoch = new Date(1899, 11, 30).getTime()
                const date = new Date(excelEpoch + numVal * msPerDay)
                if (!isNaN(date.getTime())) {
                  row[header] = dateToYYYYMMDD(date)
                } else {
                  row[header] = String(cell.v || "").trim()
                }
              } else {
                // Regular number
                row[header] = String(cell.v || "").trim()
              }
            } else if (cell.t === "s") {
              // It's a string
              row[header] = String(cell.v || "").trim()
            } else if (cell.t === "b") {
              // It's a boolean
              row[header] = String(cell.v || "").trim()
            } else {
              // Fallback - try to parse as string
              row[header] = String(cell.v || "").trim()
            }
          }
          rows.push(row)
        }

        if (rows.length === 0) {
          reject(new Error("File kosong atau tidak memiliki data"))
          return
        }

        resolve({ headers, rows })
      } catch (error) {
        reject(new Error("Gagal membaca file: " + (error as Error).message))
      }
    }

    reader.onerror = () => {
      reject(new Error("Gagal membaca file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Convert parsed data to ImportRow format
 */
function convertRow(
  rawRow: Record<string, string>,
  rowNumber: number
): ImportRow {
  const row: Partial<ImportRow> = { rowNumber }

  // Map each header to the correct field
  for (const [header, value] of Object.entries(rawRow)) {
    const normalizedHeader = header.trim()
    const fieldName = COLUMN_MAPPING[normalizedHeader]

    if (fieldName) {
      // Convert value to string and trim
      const stringValue = String(value || "").trim()
      ;(row as Record<string, string>)[fieldName] = stringValue
    }
  }

  return row as ImportRow
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate a single row
 */
export function validateRow(row: ImportRow): ImportError[] {
  const errors: ImportError[] = []

  // NIS (required)
  if (!row.student_number || !row.student_number.trim()) {
    errors.push({
      row: row.rowNumber,
      field: "student_number",
      message: "NIS wajib diisi",
      severity: "error",
    })
  } else if (row.student_number.length < 4) {
    errors.push({
      row: row.rowNumber,
      field: "student_number",
      message: "NIS minimal 4 karakter",
      severity: "warning",
    })
  }

  // Full Name (required)
  if (!row.full_name || !row.full_name.trim()) {
    errors.push({
      row: row.rowNumber,
      field: "full_name",
      message: "Nama lengkap wajib diisi",
      severity: "error",
    })
  } else if (row.full_name.trim().length < 3) {
    errors.push({
      row: row.rowNumber,
      field: "full_name",
      message: "Nama minimal 3 karakter",
      severity: "warning",
    })
  }

  // Gender
  if (row.gender && !["male", "female", "laki-laki", "perempuan", "L", "P"].includes(row.gender.toLowerCase())) {
    errors.push({
      row: row.rowNumber,
      field: "gender",
      message: 'Jenis kelamin harus "male", "female", "L", atau "P"',
      severity: "warning",
    })
  }

  // Birth Date
  if (row.birth_date) {
    const dateValue = parseDate(row.birth_date)
    if (!dateValue) {
      errors.push({
        row: row.rowNumber,
        field: "birth_date",
        message: "Format tanggal tidak valid (gunakan: DD/MM/YYYY, YYYY-MM-DD)",
        severity: "warning",
      })
    }
  }

  // Email
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push({
      row: row.rowNumber,
      field: "email",
      message: "Format email tidak valid",
      severity: "warning",
    })
  }

  // Phone
  if (row.phone && !/^[0-9+\-\s()]+$/.test(row.phone)) {
    errors.push({
      row: row.rowNumber,
      field: "phone",
      message: "Format nomor telepon tidak valid",
      severity: "warning",
    })
  }

  // NIK
  if (row.national_id && !/^[0-9]{16}$/.test(row.national_id)) {
    errors.push({
      row: row.rowNumber,
      field: "national_id",
      message: "NIK harus 16 digit angka",
      severity: "warning",
    })
  }

  // Enrollment Year
  if (row.enrollment_year) {
    const year = parseInt(row.enrollment_year)
    if (isNaN(year) || year < 1900 || year > 2100) {
      errors.push({
        row: row.rowNumber,
        field: "enrollment_year",
        message: "Tahun masuk tidak valid",
        severity: "warning",
      })
    }
  }

  return errors
}

/**
 * Parse various date formats
 * Prioritas: DD/MM/YYYY (Indonesia), YYYY-MM-DD, DD-MM-YYYY
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null

  const trimmed = dateStr.trim()

  // Try DD/MM/YYYY or DD-MM-YYYY (Indonesia format - PRIORITY)
  const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch
    const dayNum = parseInt(day)
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)

    // Validasi range
    if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
      // Buat tanggal untuk validasi
      const date = new Date(yearNum, monthNum - 1, dayNum)
      if (!isNaN(date.getTime())) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      }
    }
  }

  // Try YYYY-MM-DD (ISO format)
  const isoMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    const yearNum = parseInt(year)
    const monthNum = parseInt(month)
    const dayNum = parseInt(day)

    // Validasi range
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
      const date = new Date(yearNum, monthNum - 1, dayNum)
      if (!isNaN(date.getTime())) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      }
    }
  }

  // Try Excel serial date
  const excelDate = parseInt(trimmed)
  if (!isNaN(excelDate) && excelDate > 25569 && excelDate < 50000) {
    const date = new Date((excelDate - 25569) * 86400 * 1000)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]
    }
  }

  return null
}

/**
 * Check for duplicate NIS in the import data
 */
export function checkDuplicateNIS(
  rows: ImportRow[]
): ImportError[] {
  const errors: ImportError[] = []
  const nisCount: Record<string, number[]> = {}

  rows.forEach((row) => {
    if (row.student_number) {
      if (!nisCount[row.student_number]) {
        nisCount[row.student_number] = []
      }
      nisCount[row.student_number].push(row.rowNumber)
    }
  })

  // Find duplicates
  for (const [nis, rowNumbers] of Object.entries(nisCount)) {
    if (rowNumbers.length > 1) {
      rowNumbers.forEach((rowNum) => {
        errors.push({
          row: rowNum,
          field: "student_number",
          message: `NIS "${nis}" duplikat dalam file (juga ada di baris ${rowNumbers.filter((r) => r !== rowNum).join(", ")})`,
          severity: "error",
        })
      })
    }
  }

  return errors
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

/**
 * Process import file
 */
export async function processImportFile(
  file: File
): Promise<ImportResult> {
  try {
    // Parse file
    const { headers, rows } = await parseFile(file)

    // Check if required columns exist
    const hasStudentNumber = headers.some(
      (h) => COLUMN_MAPPING[h.trim()] === "student_number"
    )
    const hasFullName = headers.some(
      (h) => COLUMN_MAPPING[h.trim()] === "full_name"
    )

    if (!hasStudentNumber || !hasFullName) {
      return {
        success: false,
        data: [],
        errors: [
          {
            row: 0,
            field: "file",
            message: `File harus memiliki kolom NIS dan Nama Lengkap. Kolom yang ditemukan: ${headers.join(", ")}`,
            severity: "error",
          },
        ],
        totalRows: 0,
        validRows: 0,
        errorRows: 0,
      }
    }

    // Convert rows
    const importRows: ImportRow[] = rows.map((row, index) =>
      convertRow(row, index + 2) // +2 because Excel row 1 is header, and we want 1-based
    )

    // Validate each row
    const allErrors: ImportError[] = []
    const validRows: ImportRow[] = []

    importRows.forEach((row) => {
      const rowErrors = validateRow(row)
      allErrors.push(...rowErrors)

      // Only include rows without critical errors
      const hasCriticalError = rowErrors.some(
        (e) => e.severity === "error" && ["student_number", "full_name"].includes(e.field)
      )
      if (!hasCriticalError) {
        validRows.push(row)
      }
    })

    // Check for duplicate NIS in import file
    const duplicateErrors = checkDuplicateNIS(importRows)
    allErrors.push(...duplicateErrors)

    return {
      success: allErrors.filter((e) => e.severity === "error").length === 0,
      data: importRows,
      errors: allErrors,
      totalRows: importRows.length,
      validRows: validRows.length,
      errorRows: importRows.length - validRows.length,
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: "file",
          message: (error as Error).message,
          severity: "error",
        },
      ],
      totalRows: 0,
      validRows: 0,
      errorRows: 0,
    }
  }
}

/**
 * Normalize gender value
 */
export function normalizeGender(value: string): "male" | "female" {
  const normalized = value?.toLowerCase().trim()
  if (["male", "laki-laki", "l"].includes(normalized)) return "male"
  if (["female", "perempuan", "p"].includes(normalized)) return "female"
  return "male" // Default
}

/**
 * Normalize status value
 */
export function normalizeStatus(value: string): "prospective" | "active" {
  const normalized = value?.toLowerCase().trim()
  if (["active", "aktif"].includes(normalized)) return "active"
  return "prospective" // Default
}

// ============================================
// DRY RUN FUNCTION
// ============================================

export interface DryRunResult {
  totalRows: number
  validRows: number
  invalidRows: number
  duplicateInFile: number
  duplicateInDb: number
  estimatedInserts: number
  estimatedUpdates: number
  estimatedSkips: number
  warnings: ImportError[]
  errors: ImportError[]
  executionTime: number
}

/**
 * Perform dry run - validate without importing
 */
export async function performDryRun(
  rows: ImportRow[],
  existingNisNumbers: Set<string>,
  strategy: ImportStrategy
): Promise<DryRunResult> {
  const startTime = Date.now()

  const result: Omit<DryRunResult, 'executionTime'> = {
    totalRows: rows.length,
    validRows: 0,
    invalidRows: 0,
    duplicateInFile: 0,
    duplicateInDb: 0,
    estimatedInserts: 0,
    estimatedUpdates: 0,
    estimatedSkips: 0,
    warnings: [],
    errors: [],
  }

  const nisInFile = new Set<string>()

  // First pass: validate and check duplicates
  for (const row of rows) {
    const rowErrors = validateRow(row)
    const criticalErrors = rowErrors.filter(
      (e) => e.severity === "error" && ["student_number", "full_name"].includes(e.field)
    )
    const rowWarnings = rowErrors.filter((e) => e.severity === "warning")

    if (criticalErrors.length > 0) {
      result.invalidRows++
      result.errors.push(...criticalErrors)
    } else {
      result.validRows++

      // Check for duplicate in file
      if (row.student_number) {
        if (nisInFile.has(row.student_number)) {
          result.duplicateInFile++
          result.errors.push({
            row: row.rowNumber,
            field: "student_number",
            message: `NIS "${row.student_number}" duplikat dalam file`,
            severity: "error",
          })
        } else {
          nisInFile.add(row.student_number)
        }

        // Check for duplicate in database
        if (existingNisNumbers.has(row.student_number)) {
          result.duplicateInDb++

          switch (strategy) {
            case "skip":
              result.estimatedSkips++
              break
            case "update":
            case "upsert":
              result.estimatedUpdates++
              break
            case "insert":
              result.estimatedSkips++
              result.warnings.push({
                row: row.rowNumber,
                field: "student_number",
                message: `NIS "${row.student_number}" sudah ada, akan dilewati (strategy: insert)`,
                severity: "warning",
              })
              break
          }
        } else {
          result.estimatedInserts++
        }
      }
    }

    // Add warnings
    if (rowWarnings.length > 0) {
      result.warnings.push(...rowWarnings)
    }
  }

  const executionTime = Date.now() - startTime
  return {
    ...result,
    executionTime,
  }
}

// ============================================
// FIELD MAPPING FUNCTIONS
// ============================================

/**
 * Detect columns from file headers and auto-map
 */
export function detectAndAutoMap(headers: string[]): FieldMapping[] {
  const mappings: FieldMapping[] = []

  for (const header of headers) {
    const trimmedHeader = header.trim()
    const targetField = COLUMN_MAPPING[trimmedHeader]

    if (targetField) {
      mappings.push({
        sourceColumn: header,
        targetField,
      })
    } else {
      // Try case-insensitive matching
      const lowerHeader = trimmedHeader.toLowerCase()
      for (const [columnName, fieldKey] of Object.entries(COLUMN_MAPPING)) {
        if (columnName.toLowerCase() === lowerHeader) {
          mappings.push({
            sourceColumn: header,
            targetField: fieldKey,
          })
          break
        }
      }
    }
  }

  return mappings
}

/**
 * Get unmapped target fields
 */
export function getUnmappedFields(
  mappedFields: FieldMapping[],
  requiredOnly: boolean = false
): FieldDefinition[] {
  const mappedTargets = new Set(
    mappedFields.filter((m) => m.targetField).map((m) => m.targetField)
  )

  return AVAILABLE_FIELDS.filter((field) => {
    if (mappedTargets.has(field.key)) return false
    if (requiredOnly && !field.required) return false
    return true
  })
}

/**
 * Convert raw row using field mapping
 */
export function convertRowWithMapping(
  rawRow: Record<string, string>,
  fieldMapping: FieldMapping[],
  rowNumber: number
): ImportRow {
  const row: Partial<ImportRow> = { rowNumber }

  for (const mapping of fieldMapping) {
    if (mapping.targetField && rawRow[mapping.sourceColumn] !== undefined) {
      const value = String(rawRow[mapping.sourceColumn] || "").trim()
      ;(row as Record<string, string>)[mapping.targetField] = value
    }
  }

  return row as ImportRow
}

// ============================================
// UPDATE STUDENT FUNCTION
// ============================================

/**
 * Update student by student_number (NIS)
 */
export async function updateStudentByNis(
  nis: string,
  updates: Partial<ImportRow>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await import("@/lib/supabase")

    // Map import fields to database fields
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updates.full_name) dbUpdates.full_name = updates.full_name
    if (updates.nickname) dbUpdates.nickname = updates.nickname
    if (updates.gender) dbUpdates.gender = normalizeGender(updates.gender)
    if (updates.birth_place) dbUpdates.birth_place = updates.birth_place
    if (updates.birth_date) {
      const parsedDate = parseDate(updates.birth_date)
      if (parsedDate) dbUpdates.birth_date = parsedDate
    }
    if (updates.religion) dbUpdates.religion = updates.religion
    if (updates.nationality) dbUpdates.nationality = updates.nationality
    if (updates.blood_type) dbUpdates.blood_type = updates.blood_type
    if (updates.address) dbUpdates.address = updates.address
    if (updates.phone) dbUpdates.phone = updates.phone
    if (updates.email) dbUpdates.email = updates.email
    if (updates.national_id) dbUpdates.national_id = updates.national_id
    if (updates.nisn) dbUpdates.nisn = updates.nisn
    if (updates.enrollment_year) {
      const year = parseInt(updates.enrollment_year)
      if (!isNaN(year)) dbUpdates.enrollment_year = year
    }
    // Health fields
    if (updates.height_cm) dbUpdates.height_cm = parseFloat(updates.height_cm) || null
    if (updates.weight_kg) dbUpdates.weight_kg = parseFloat(updates.weight_kg) || null
    if (updates.vision) dbUpdates.vision = updates.vision
    if (updates.hearing) dbUpdates.hearing = updates.hearing
    if (updates.teeth_condition) dbUpdates.teeth_condition = updates.teeth_condition
    if (updates.physical_disability) dbUpdates.physical_disability = updates.physical_disability
    if (updates.illness_history) dbUpdates.illness_history = updates.illness_history
    if (updates.allergies) dbUpdates.allergies = updates.allergies
    if (updates.health_notes) dbUpdates.health_notes = updates.health_notes

    const { error } = await supabase
      .from("students")
      .update(dbUpdates)
      .eq("student_number", nis)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error updating student by NIS:", err)
    return { success: false, error: "Terjadi kesalahan saat mengupdate siswa" }
  }
}

/**
 * Get existing NIS numbers for duplicate checking
 */
export async function getExistingNisNumbers(nisNumbers: string[]): Promise<Set<string>> {
  try {
    const { supabase } = await import("@/lib/supabase")

    const { data, error } = await supabase
      .from("students")
      .select("student_number")
      .in("student_number", nisNumbers)

    if (error) {
      console.error("Error fetching existing NIS:", error)
      return new Set()
    }

    return new Set(data?.map((s) => s.student_number) || [])
  } catch (err) {
    console.error("Error fetching existing NIS:", err)
    return new Set()
  }
}

// ============================================
// CONFLICT DETECTION
// ============================================

export interface ConflictInfo {
  nis: string
  rowNumber: number
  existingStudent: {
    id: string
    full_name: string
    is_active: boolean
  } | null
}

export interface ConflictDetectionResult {
  conflicts: ConflictInfo[]
  hasConflicts: boolean
}

/**
 * Detect conflicts between import data and existing database
 */
export async function detectConflicts(
  rows: ImportRow[]
): Promise<ConflictDetectionResult> {
  const conflicts: ConflictInfo[] = []
  const nisNumbers = rows
    .filter((r) => r.student_number)
    .map((r) => r.student_number)

  if (nisNumbers.length === 0) {
    return { conflicts: [], hasConflicts: false }
  }

  try {
    const { supabase } = await import("@/lib/supabase")

    const { data, error } = await supabase
      .from("students")
      .select("id, student_number, full_name, is_active")
      .in("student_number", nisNumbers)

    if (error) {
      console.error("Error detecting conflicts:", error)
      return { conflicts: [], hasConflicts: false }
    }

    const existingMap = new Map(
      data?.map((s) => [s.student_number, s]) || []
    )

    for (const row of rows) {
      if (row.student_number && existingMap.has(row.student_number)) {
        const existing = existingMap.get(row.student_number)!
        conflicts.push({
          nis: row.student_number,
          rowNumber: row.rowNumber,
          existingStudent: {
            id: existing.id,
            full_name: existing.full_name,
            is_active: existing.is_active,
          },
        })
      }
    }

    return {
      conflicts,
      hasConflicts: conflicts.length > 0,
    }
  } catch (err) {
    console.error("Error detecting conflicts:", err)
    return { conflicts: [], hasConflicts: false }
  }
}
