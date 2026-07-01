/**
 * Student Import Utility
 *
 * Fungsi-fungsi untuk import data siswa dari Excel/CSV
 */

import * as XLSX from "xlsx"

// ============================================
// TYPES
// ============================================

export interface ImportRow {
  rowNumber: number
  student_number: string
  national_id: string
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

// Required columns mapping (Excel column name -> field name)
export const COLUMN_MAPPING: Record<string, keyof ImportRow> = {
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
  Status: "status",
}

// ============================================
// PARSING FUNCTIONS
// ============================================

/**
 * Parse file Excel/CSV
 */
export function parseFile(
  file: File
): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "array" })

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
          defval: "",
        })

        if (jsonData.length === 0) {
          reject(new Error("File kosong atau tidak memiliki data"))
          return
        }

        // Ambil headers dari baris pertama
        const headers = Object.keys(jsonData[0])

        resolve({ headers, rows: jsonData })
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
        message: "Format tanggal tidak valid (gunakan: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY)",
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
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null

  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) return dateStr
  }

  // Try DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (!isNaN(date.getTime())) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }
  }

  // Try MM/DD/YYYY (US format)
  const mmddyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (!isNaN(date.getTime())) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }
  }

  // Try Excel serial date
  const excelDate = parseInt(dateStr)
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
