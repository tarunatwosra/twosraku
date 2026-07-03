"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  Check,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Card, Button, Badge } from "@/components/ui"
import {
  processImportFile,
  type ImportRow,
  type ImportError,
} from "@/lib/import/student-import"
import { createStudent, checkDuplicateNIS } from "@/app/buku-induk/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

type ImportStep = "upload" | "preview" | "importing" | "complete"

interface ImportState {
  step: ImportStep
  file: File | null
  rows: ImportRow[]
  errors: ImportError[]
  selectedRows: Set<number>
  duplicateNIS: Map<string, string> // NIS -> student ID in database
  importingRows: number[]
  importedCount: number
  failedCount: number
  importErrors: { row: number; message: string }[]
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

// ============================================
// UPLOAD AREA COMPONENT
// ============================================

interface UploadAreaProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
}

function UploadArea({ onFileSelect, isLoading }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        const validTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ]
        if (
          validTypes.includes(file.type) ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          file.name.endsWith(".csv")
        ) {
          onFileSelect(file)
        }
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFileSelect(files[0])
      }
    },
    [onFileSelect]
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-[28px] p-12",
        "flex flex-col items-center justify-center gap-4",
        "transition-all duration-200",
        isDragging
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-[var(--border-default)] hover:border-[var(--border-focus)]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        className="hidden"
      />

      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center",
          "bg-[var(--surface-secondary)]",
          isDragging ? "bg-[var(--primary-soft)]" : ""
        )}
      >
        {isLoading ? (
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
        ) : (
          <Upload
            className={cn(
              "w-10 h-10",
              isDragging ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            )}
          />
        )}
      </div>

      <div className="text-center">
        <p className="text-[16px] font-medium text-[var(--text-primary)]">
          {isLoading ? "Memproses file..." : "Seret file ke sini atau klik untuk pilih"}
        </p>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Format yang didukung: Excel (.xlsx, .xls) dan CSV
        </p>
      </div>

      {!isLoading && (
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Pilih File
        </Button>
      )}
    </div>
  )
}

// ============================================
// ERROR LIST COMPONENT
// ============================================

interface ErrorListProps {
  errors: ImportError[]
  onDismiss?: (index: number) => void
}

function ErrorList({ errors, onDismiss }: ErrorListProps) {
  if (errors.length === 0) return null

  const errorCount = errors.filter((e) => e.severity === "error").length
  const warningCount = errors.filter((e) => e.severity === "warning").length

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
          <span className="text-[14px] font-medium text-[var(--danger)]">
            {errorCount} error
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
          <span className="text-[14px] font-medium text-[var(--warning)]">
            {warningCount} warning
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {errors.slice(0, 20).map((error, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start justify-between gap-3 p-3 rounded-[12px]",
              error.severity === "error"
                ? "bg-[var(--danger-soft)]"
                : "bg-[var(--warning-soft)]"
            )}
          >
            <div className="flex items-start gap-2">
              {error.severity === "error" ? (
                <AlertCircle className="w-4 h-4 text-[var(--danger)] mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[var(--warning)] mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {error.row > 0 ? `Baris ${error.row}` : "File"}{" "}
                  <span className="text-[var(--text-muted)]">• {error.field}</span>
                </p>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {error.message}
                </p>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(index)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {errors.length > 20 && (
          <p className="text-[12px] text-[var(--text-muted)] text-center">
            ... dan {errors.length - 20} error lainnya
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// PREVIEW TABLE COMPONENT
// ============================================

interface PreviewTableProps {
  rows: ImportRow[]
  errors: ImportError[]
  selectedRows: Set<number>
  onToggleRow: (rowNumber: number) => void
  onSelectAll: () => void
  currentPage: number
  perPage: number
  onPageChange: (page: number) => void
}

function PreviewTable({
  rows,
  errors,
  selectedRows,
  onToggleRow,
  onSelectAll,
  currentPage,
  perPage,
  onPageChange,
}: PreviewTableProps) {
  const totalPages = Math.ceil(rows.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const displayedRows = rows.slice(startIndex, endIndex)

  // Get error for a specific row
  const getRowErrors = (rowNumber: number) => {
    return errors.filter((e) => e.row === rowNumber)
  }

  const isRowHasError = (rowNumber: number) => {
    return getRowErrors(rowNumber).some((e) => e.severity === "error")
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-[var(--border-light)] rounded-[20px]">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--surface-secondary)]">
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === displayedRows.filter((r) => !isRowHasError(r.rowNumber)).length && selectedRows.size > 0}
                  onChange={onSelectAll}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                No
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                NIS
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                Nama Lengkap
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                Tanggal Lahir
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                Telepon
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row) => {
              const rowErrors = getRowErrors(row.rowNumber)
              const hasError = rowErrors.length > 0

              return (
                <tr
                  key={row.rowNumber}
                  className={cn(
                    "border-t border-[var(--border-light)]",
                    hasError && "bg-[var(--danger-soft)]",
                    selectedRows.has(row.rowNumber) && "bg-[var(--primary-soft)]"
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.rowNumber)}
                      onChange={() => onToggleRow(row.rowNumber)}
                      disabled={hasError}
                      className="w-5 h-5 rounded cursor-pointer disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">
                    {row.rowNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[13px] font-medium",
                          row.student_number
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--danger)]"
                        )}
                      >
                        {row.student_number || "(kosong)"}
                      </span>
                      {hasError && (
                        <Badge variant="danger" className="text-[10px]">
                          {rowErrors.length}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">
                    {row.full_name || "(kosong)"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                    {row.gender || "-"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                    {formatDate(row.birth_date)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                    {row.phone || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {hasError ? (
                      <Badge variant="danger">Error</Badge>
                    ) : (
                      <Badge variant="success">OK</Badge>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[var(--text-muted)]">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, rows.length)} dari{" "}
            {rows.length} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-[13px] text-[var(--text-secondary)]">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ImportStudentsPage() {
  const router = useRouter()
  const [state, setState] = useState<ImportState>({
    step: "upload",
    file: null,
    rows: [],
    errors: [],
    selectedRows: new Set(),
    duplicateNIS: new Map(),
    importingRows: [],
    importedCount: 0,
    failedCount: 0,
    importErrors: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewPage, setPreviewPage] = useState(1)
  const previewPerPage = 20

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)

    try {
      const result = await processImportFile(file)

      // Check for duplicate NIS in database
      const duplicateNIS = new Map<string, string>()
      for (const row of result.data) {
        if (row.student_number) {
          const isDuplicate = await checkDuplicateNIS(row.student_number)
          if (isDuplicate) {
            duplicateNIS.set(row.student_number, row.rowNumber.toString())
          }
        }
      }

      // Add database duplicate errors
      const dbErrors: ImportError[] = []
      duplicateNIS.forEach((_, nis) => {
        const row = result.data.find((r) => r.student_number === nis)
        if (row) {
          dbErrors.push({
            row: row.rowNumber,
            field: "student_number",
            message: `NIS "${nis}" sudah terdaftar di database`,
            severity: "error",
          })
        }
      })

      // Auto-select valid rows
      const validRows = new Set<number>()
      result.data.forEach((row) => {
        const hasCriticalError = [
          ...result.errors,
          ...dbErrors,
        ].some(
          (e) =>
            e.severity === "error" &&
            e.row === row.rowNumber &&
            ["student_number", "full_name"].includes(e.field)
        )
        if (!hasCriticalError) {
          validRows.add(row.rowNumber)
        }
      })

      setState((prev) => ({
        ...prev,
        step: "preview",
        file,
        rows: result.data,
        errors: [...result.errors, ...dbErrors],
        selectedRows: validRows,
        duplicateNIS,
      }))
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Gagal memproses file: " + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle row selection
  const toggleRow = (rowNumber: number) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedRows)
      if (newSelected.has(rowNumber)) {
        newSelected.delete(rowNumber)
      } else {
        newSelected.add(rowNumber)
      }
      return { ...prev, selectedRows: newSelected }
    })
  }

  // Select all visible valid rows
  const selectAll = () => {
    const validRows = state.rows
      .filter((row) => {
        const hasCriticalError = state.errors.some(
          (e) =>
            e.severity === "error" &&
            e.row === row.rowNumber &&
            ["student_number", "full_name"].includes(e.field)
        )
        return !hasCriticalError
      })
      .map((row) => row.rowNumber)

    const allSelected = validRows.every((r) => state.selectedRows.has(r))

    setState((prev) => {
      const newSelected = new Set(prev.selectedRows)
      if (allSelected) {
        validRows.forEach((r) => newSelected.delete(r))
      } else {
        validRows.forEach((r) => newSelected.add(r))
      }
      return { ...prev, selectedRows: newSelected }
    })
  }

  // Start import
  const startImport = async () => {
    if (state.selectedRows.size === 0) {
      alert("Pilih minimal satu siswa untuk diimport")
      return
    }

    if (!confirm(`Import ${state.selectedRows.size} siswa?`)) return

    setState((prev) => ({ ...prev, step: "importing", importingRows: [] }))
    setIsProcessing(true)

    let importedCount = 0
    let failedCount = 0
    const importErrors: { row: number; message: string }[] = []

    for (const rowNumber of state.selectedRows) {
      const row = state.rows.find((r) => r.rowNumber === rowNumber)
      if (!row) continue

      setState((prev) => ({ ...prev, importingRows: [...prev.importingRows, rowNumber] }))

      try {
        const result = await createStudent({
          student_number: row.student_number,
          full_name: row.full_name,
          nickname: row.nickname || undefined,
          gender:
            row.gender?.toLowerCase() === "female" ||
            row.gender?.toLowerCase() === "perempuan" ||
            row.gender?.toLowerCase() === "p"
              ? "female"
              : "male",
          birth_place: row.birth_place || undefined,
          birth_date: row.birth_date || undefined,
          religion: row.religion || undefined,
          nationality: row.nationality || undefined,
          blood_type: row.blood_type || undefined,
          address: row.address || undefined,
          phone: row.phone || undefined,
          email: row.email || undefined,
          enrollment_year: row.enrollment_year
            ? parseInt(row.enrollment_year)
            : new Date().getFullYear(),
          is_active: true,
        })

        if (result.success) {
          importedCount++
        } else {
          failedCount++
          importErrors.push({
            row: row.rowNumber,
            message: result.error || "Gagal import",
          })
        }
      } catch (error) {
        failedCount++
        importErrors.push({
          row: row.rowNumber,
          message: (error as Error).message,
        })
      }
    }

    setState((prev) => ({
      ...prev,
      step: "complete",
      importedCount,
      failedCount,
      importErrors,
    }))
    setIsProcessing(false)
  }

  // Reset to upload
  const resetUpload = () => {
    setState({
      step: "upload",
      file: null,
      rows: [],
      errors: [],
      selectedRows: new Set(),
      duplicateNIS: new Map(),
      importingRows: [],
      importedCount: 0,
      failedCount: 0,
      importErrors: [],
    })
    setPreviewPage(1)
  }

  // Download template
  const downloadTemplate = () => {
    // Create a simple template as CSV
    const headers = [
      "NIS",
      "Nama Lengkap",
      "Nama Panggilan",
      "Jenis Kelamin",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Kewarganegaraan",
      "Golongan Darah",
      "Alamat",
      "Telepon",
      "Email",
      "NIK",
      "Tahun Masuk",
    ]
    const exampleRow = [
      "2024001",
      "John Doe",
      "John",
      "male",
      "Jakarta",
      "2010-01-15",
      "Islam",
      "Indonesia",
      "A",
      "Jl. Contoh No. 1",
      "081234567890",
      "john@example.com",
      "1234567890123456",
      "2024",
    ]

    const csv = [headers.join(","), exampleRow.join(",")].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template-import-siswa.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate stats
  const validRowsCount = state.rows.filter((row) => {
    return !state.errors.some(
      (e) =>
        e.severity === "error" &&
        e.row === row.rowNumber &&
        ["student_number", "full_name"].includes(e.field)
    )
  }).length

  return (
    <AppShell showHeader={true}>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/buku-induk"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Buku Induk
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[var(--text-primary)]">
          Import Siswa
        </h1>
        <p className="text-[14px] text-[var(--text-muted)] mt-1">
          Import data siswa dari file Excel atau CSV
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {["Upload", "Preview", "Import", "Selesai"].map((step, index) => {
          const stepKey = step.toLowerCase() as ImportStep
          const currentIndex = ["upload", "preview", "importing", "complete"].indexOf(
            state.step
          )
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  isCompleted
                    ? "bg-[var(--success)] text-white"
                    : isActive
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-[13px] font-medium",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                {step}
              </span>
              {index < 3 && (
                <div
                  className={cn(
                    "w-8 h-0.5 rounded",
                    isCompleted
                      ? "bg-[var(--success)]"
                      : "bg-[var(--surface-secondary)]"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Upload Step */}
      {state.step === "upload" && (
        <Card padding="lg">
          {/* Template Download */}
          <div className="mb-6 p-4 bg-[var(--surface-secondary)] rounded-[18px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[var(--text-muted)]" />
              <div>
                <p className="text-[14px] font-medium text-[var(--text-primary)]">
                  Template Import
                </p>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Unduh template untuk format yang benar
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>

          <UploadArea onFileSelect={handleFileSelect} isLoading={isProcessing} />
        </Card>
      )}

      {/* Preview Step */}
      {state.step === "preview" && (
        <div className="space-y-6">
          {/* File Info */}
          <Card padding="md" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-[var(--success)]" />
              <div>
                <p className="text-[14px] font-medium text-[var(--text-primary)]">
                  {state.file?.name}
                </p>
                <p className="text-[12px] text-[var(--text-muted)]">
                  {state.file && formatFileSize(state.file.size)} •{" "}
                  {state.rows.length} baris data
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="md" className="text-center">
              <p className="text-[24px] font-bold text-[var(--text-primary)]">
                {state.rows.length}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">Total Baris</p>
            </Card>
            <Card padding="md" className="text-center">
              <p className="text-[24px] font-bold text-[var(--success)]">
                {validRowsCount}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">Valid</p>
            </Card>
            <Card padding="md" className="text-center">
              <p className="text-[24px] font-bold text-[var(--danger)]">
                {state.rows.length - validRowsCount}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">Error</p>
            </Card>
            <Card padding="md" className="text-center">
              <p className="text-[24px] font-bold text-[var(--primary)]">
                {state.selectedRows.size}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">Dipilih</p>
            </Card>
          </div>

          {/* Errors */}
          <ErrorList errors={state.errors} />

          {/* Preview Table */}
          <Card padding="none">
            <div className="p-[20px] border-b border-[var(--border-light)]">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Preview Data
              </h3>
            </div>
            <div className="p-[20px]">
              <PreviewTable
                rows={state.rows}
                errors={state.errors}
                selectedRows={state.selectedRows}
                onToggleRow={toggleRow}
                onSelectAll={selectAll}
                currentPage={previewPage}
                perPage={previewPerPage}
                onPageChange={setPreviewPage}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={resetUpload}>
              Batal
            </Button>
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-[var(--text-muted)]">
                {state.selectedRows.size} siswa akan diimport
              </p>
              <Button
                onClick={startImport}
                disabled={state.selectedRows.size === 0}
              >
                <Upload className="w-4 h-4" />
                Import {state.selectedRows.size} Siswa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Importing Step */}
      {state.step === "importing" && (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <Loader2 className="w-16 h-16 text-[var(--primary)] animate-spin mx-auto mb-6" />
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
              Sedang Mengimport...
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-4">
              {state.importingRows.length} dari {state.selectedRows.size} siswa
            </p>
            <div className="w-full max-w-md mx-auto bg-[var(--surface-secondary)] rounded-full h-2">
              <div
                className="h-2 bg-[var(--primary)] rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (state.importingRows.length / state.selectedRows.size) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Complete Step */}
      {state.step === "complete" && (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            {state.failedCount === 0 ? (
              <>
                <div className="w-20 h-20 rounded-full bg-[var(--success-soft)] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Import Berhasil!
                </h3>
                <p className="text-[14px] text-[var(--text-muted)]">
                  {state.importedCount} siswa berhasil diimport
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-[var(--warning-soft)] flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-[var(--warning)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  Import Selesai dengan Error
                </h3>
                <p className="text-[14px] text-[var(--text-muted)] mb-4">
                  {state.importedCount} berhasil, {state.failedCount} gagal
                </p>

                {state.importErrors.length > 0 && (
                  <div className="mt-6 text-left">
                    <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-2">
                      Detail Error:
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {state.importErrors.map((err, i) => (
                        <div
                          key={i}
                          className="p-3 bg-[var(--danger-soft)] rounded-[12px] text-[13px]"
                        >
                          Baris {err.row}: {err.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="outline" onClick={resetUpload}>
                Import Lagi
              </Button>
              <Button onClick={() => router.push("/buku-induk")}>
                Lihat Daftar Siswa
              </Button>
            </div>
          </div>
        </Card>
      )}
    </AppShell>
  )
}
