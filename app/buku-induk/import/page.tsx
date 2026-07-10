"use client"

import { useState, useCallback, useRef, useMemo, useEffect } from "react"
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
  Play,
  Settings2,
  ArrowRight,
  GitCompare,
  Eye,
  RefreshCw,
  Plus,
  Edit3,
  SkipForward,
  RotateCcw,
} from "lucide-react"
import { AppShell } from "@/components/layout"
import { Button, Card, Badge } from "@/components/ui"
import {
  processImportFile,
  type ImportRow,
  type ImportError,
  type ImportStrategy,
  type FieldMapping,
  type DryRunResult,
  type ConflictInfo,
  IMPORT_STRATEGIES,
  AVAILABLE_FIELDS,
  detectAndAutoMap,
  performDryRun,
  detectConflicts,
  getExistingNisNumbers,
  convertRowWithMapping,
  updateStudentByNis,
} from "@/lib/import/student-import"
import { createStudent, checkDuplicateNIS, updateStudent } from "@/app/buku-induk/lib/supabase"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

type ImportStep = "upload" | "strategy" | "mapping" | "preview" | "dryrun" | "conflicts" | "importing" | "complete"

interface ImportState {
  step: ImportStep
  file: File | null
  headers: string[]
  rawRows: Record<string, string>[]
  rows: ImportRow[]
  errors: ImportError[]
  selectedRows: Set<number>
  strategy: ImportStrategy
  fieldMapping: FieldMapping[]
  dryRunResult: DryRunResult | null
  conflicts: ConflictInfo[]
  importingRows: number[]
  importedCount: number
  updatedCount: number
  skippedCount: number
  failedCount: number
  importErrors: { row: number; message: string }[]
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"

  // Try parsing as DD/MM/YYYY first (Indonesia format)
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Try parsing as YYYY-MM-DD (ISO format)
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Return as-is if can't parse
  return dateStr
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
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
// STRATEGY SELECTOR COMPONENT
// ============================================

interface StrategySelectorProps {
  selected: ImportStrategy
  onSelect: (strategy: ImportStrategy) => void
  conflictCount: number
}

function StrategySelector({ selected, onSelect, conflictCount }: StrategySelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "plus": return <Plus className="w-5 h-5" />
      case "refresh": return <RefreshCw className="w-5 h-5" />
      case "edit": return <Edit3 className="w-5 h-5" />
      case "skip": return <SkipForward className="w-5 h-5" />
      default: return <Plus className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
        Pilih Strategi Import
      </h3>
      <p className="text-[13px] text-[var(--text-muted)]">
        Tentukan bagaimana data import berinteraksi dengan data yang sudah ada.
      </p>

      {conflictCount > 0 && (
        <div className="p-4 bg-[var(--warning-soft)] rounded-[16px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0" />
          <p className="text-[13px] text-[var(--warning)]">
            Ditemukan <strong>{conflictCount} siswa</strong> dengan NIS yang sudah terdaftar di database.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IMPORT_STRATEGIES.map((strategy) => (
          <button
            key={strategy.strategy}
            onClick={() => onSelect(strategy.strategy)}
            className={cn(
              "p-5 rounded-[20px] border-2 text-left transition-all duration-200",
              selected === strategy.strategy
                ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                : "border-[var(--border-light)] bg-white hover:border-[var(--border-focus)] hover:bg-[var(--surface-secondary)]"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0",
                  selected === strategy.strategy
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                )}
              >
                {getIcon(strategy.icon)}
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {strategy.label}
                </h4>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">
                  {strategy.description}
                </p>
              </div>
              {selected === strategy.strategy && (
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// FIELD MAPPING COMPONENT
// ============================================

interface FieldMappingEditorProps {
  headers: string[]
  mapping: FieldMapping[]
  onChange: (mapping: FieldMapping[]) => void
}

function FieldMappingEditor({ headers, mapping, onChange }: FieldMappingEditorProps) {
  const unmappedHeaders = headers.filter(
    (h) => !mapping.some((m) => m.sourceColumn === h)
  )

  const mappedTargets = new Set(mapping.map((m) => m.targetField))

  const addMapping = (sourceColumn: string, targetField: keyof ImportRow) => {
    onChange([...mapping, { sourceColumn, targetField }])
  }

  const removeMapping = (index: number) => {
    const newMapping = [...mapping]
    newMapping.splice(index, 1)
    onChange(newMapping)
  }

  const updateMapping = (index: number, targetField: keyof ImportRow) => {
    const newMapping = [...mapping]
    newMapping[index].targetField = targetField
    onChange(newMapping)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Pemetaan Kolom
        </h3>
        <p className="text-[13px] text-[var(--text-muted)]">
          Pastikan kolom di file sesuai dengan field sistem.
        </p>
      </div>

      {/* Current Mappings */}
      {mapping.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[13px] font-medium text-[var(--text-secondary)]">
            Kolom yang dipetakan ({mapping.length})
          </h4>
          <div className="space-y-2">
            {mapping.map((m, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-[14px]"
              >
                <div className="flex-1">
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">
                    {m.sourceColumn}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <select
                  value={m.targetField}
                  onChange={(e) => updateMapping(index, e.target.value as keyof ImportRow)}
                  className="flex-1 h-10 px-3 text-[13px] bg-white border border-[var(--border-light)] rounded-[12px] focus:outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="">-- Pilih Field --</option>
                  {AVAILABLE_FIELDS.map((field) => (
                    <option key={field.key} value={field.key}>
                      {field.label} {field.required ? "(Wajib)" : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeMapping(index)}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Mapping */}
      {unmappedHeaders.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[13px] font-medium text-[var(--text-secondary)]">
            Tambahkan Pemetaan Baru
          </h4>
          <div className="flex items-center gap-3">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addMapping(e.target.value, "student_number")
                }
              }}
              className="flex-1 h-10 px-3 text-[13px] bg-white border border-[var(--border-light)] rounded-[12px] focus:outline-none focus:border-[var(--border-focus)]"
            >
              <option value="">-- Pilih Kolom --</option>
              {unmappedHeaders.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Required Fields Status */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-[16px]">
        <h4 className="text-[13px] font-medium text-[var(--text-secondary)] mb-2">
          Status Field Wajib
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FIELDS.filter((f) => f.required).map((field) => {
            const isMapped = mappedTargets.has(field.key)
            return (
              <span
                key={field.key}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
                  isMapped
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]"
                )}
              >
                {isMapped ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {field.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// DRY RUN RESULT COMPONENT
// ============================================

interface DryRunResultViewProps {
  result: DryRunResult
  onContinue: () => void
  onBack: () => void
}

function DryRunResultView({ result, onContinue, onBack }: DryRunResultViewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--success-soft)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[var(--success)]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Validasi Selesai
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Dry run selesai dalam {formatDuration(result.executionTime)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md" className="text-center">
          <p className="text-[24px] font-bold text-[var(--text-primary)]">
            {result.totalRows}
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Total Baris</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-[24px] font-bold text-[var(--success)]">
            {result.validRows}
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Valid</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-[24px] font-bold text-[var(--danger)]">
            {result.invalidRows}
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Error</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-[24px] font-bold text-[var(--warning)]">
            {result.duplicateInDb}
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Duplikat DB</p>
        </Card>
      </div>

      {/* Estimates */}
      <Card padding="md">
        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Estimasi Hasil Import
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[20px] font-bold text-[var(--success)]">
              {result.estimatedInserts}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Akan Ditambah</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-bold text-[var(--info)]">
              {result.estimatedUpdates}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Akan Diupdate</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-bold text-[var(--warning)]">
              {result.estimatedSkips}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Akan Dilewati</p>
          </div>
        </div>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
            <span className="text-[13px] font-medium text-[var(--text-secondary)]">
              {result.warnings.length} Warning
            </span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {result.warnings.slice(0, 10).map((w, i) => (
              <div key={i} className="p-3 bg-[var(--warning-soft)] rounded-[12px]">
                <p className="text-[12px] text-[var(--text-primary)]">
                  <span className="font-medium">Baris {w.row}:</span> {w.message}
                </p>
              </div>
            ))}
            {result.warnings.length > 10 && (
              <p className="text-[12px] text-[var(--text-muted)] text-center">
                ... dan {result.warnings.length - 10} warning lainnya
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </Button>
        <Button onClick={onContinue} disabled={result.validRows === 0}>
          Lanjutkan ke Preview
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ============================================
// CONFLICT RESOLUTION COMPONENT
// ============================================

interface ConflictResolutionProps {
  conflicts: ConflictInfo[]
  onResolved: () => void
  onCancel: () => void
}

function ConflictResolution({ conflicts, onResolved, onCancel }: ConflictResolutionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--warning-soft)] flex items-center justify-center mx-auto mb-4">
          <GitCompare className="w-8 h-8 text-[var(--warning)]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Ditemukan Konflik Data
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          {conflicts.length} siswa memiliki NIS yang sudah terdaftar
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {conflicts.map((conflict, index) => (
          <Card key={index} padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {conflict.nis}
                </p>
                {conflict.existingStudent && (
                  <p className="text-[12px] text-[var(--text-muted)]">
                    Sudah ada: {conflict.existingStudent.full_name} ({conflict.existingStudent.is_active ? "Aktif" : "Tidak Aktif"})
                  </p>
                )}
              </div>
              <Badge variant={conflict.existingStudent?.is_active ? "success" : "neutral"}>
                Baris {conflict.rowNumber}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-[12px] text-[var(--text-muted)] text-center">
        Pilih strategi import untuk menangani konflik ini di langkah sebelumnya.
      </p>

      <div className="flex items-center justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Ubah Strategi
        </Button>
        <Button onClick={onResolved}>
          Lanjutkan
        </Button>
      </div>
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

  const getRowErrors = (rowNumber: number) => {
    return errors.filter((e) => e.row === rowNumber)
  }

  const isRowHasError = (rowNumber: number) => {
    return getRowErrors(rowNumber).some((e) => e.severity === "error")
  }

  return (
    <div className="space-y-4">
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
    headers: [],
    rawRows: [],
    rows: [],
    errors: [],
    selectedRows: new Set(),
    strategy: "upsert",
    fieldMapping: [],
    dryRunResult: null,
    conflicts: [],
    importingRows: [],
    importedCount: 0,
    updatedCount: 0,
    skippedCount: 0,
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
      // Parse file using existing function
      const result = await processImportFile(file)

      if (!result.success && result.errors.length > 0) {
        // Check if it's a missing column error
        const missingColumnError = result.errors.find((e) => e.field === "file")
        if (missingColumnError) {
          alert(missingColumnError.message)
          setIsProcessing(false)
          return
        }
      }

      // Auto-detect field mapping
      const { headers, rows: rawRows } = await parseFileForMapping(file)
      const autoMapping = detectAndAutoMap(headers)

      // Convert rows using auto-mapping
      const importRows = rawRows.map((row, index) =>
        convertRowWithMapping(row, autoMapping, index + 2)
      )

      // Check for database duplicates
      const nisNumbers = importRows
        .filter((r) => r.student_number)
        .map((r) => r.student_number)

      const existingNis = await getExistingNisNumbers(nisNumbers)
      const conflicts = await detectConflicts(importRows)

      // Add database duplicate errors
      const dbErrors: ImportError[] = []
      conflicts.conflicts.forEach((conflict) => {
        dbErrors.push({
          row: conflict.rowNumber,
          field: "student_number",
          message: `NIS "${conflict.nis}" sudah terdaftar di database`,
          severity: "warning", // Use warning since strategy will handle it
        })
      })

      // Auto-select valid rows
      const validRows = new Set<number>()
      importRows.forEach((row) => {
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
        step: "strategy",
        file,
        headers,
        rawRows,
        rows: importRows,
        errors: [...result.errors, ...dbErrors],
        selectedRows: validRows,
        fieldMapping: autoMapping,
        conflicts: conflicts.conflicts,
      }))
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Gagal memproses file: " + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Parse file for headers and raw rows
  const parseFileForMapping = async (file: File): Promise<{
    headers: string[]
    rows: Record<string, string>[]
  }> => {
    const { parseFile } = await import("@/lib/import/student-import")
    return parseFile(file)
  }

  // Handle strategy change
  const handleStrategyChange = (strategy: ImportStrategy) => {
    setState((prev) => ({ ...prev, strategy }))
  }

  // Handle field mapping change
  const handleMappingChange = (mapping: FieldMapping[]) => {
    // Re-convert rows with new mapping
    const newRows = state.rawRows.map((row, index) =>
      convertRowWithMapping(row, mapping, index + 2)
    )

    // Auto-select valid rows
    const validRows = new Set<number>()
    newRows.forEach((row) => {
      const hasCriticalError = state.errors.some(
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
      fieldMapping: mapping,
      rows: newRows,
      selectedRows: validRows,
    }))
  }

  // Run dry run
  const handleDryRun = async () => {
    setIsProcessing(true)

    try {
      const nisNumbers = state.rows
        .filter((r) => r.student_number)
        .map((r) => r.student_number)

      const existingNis = await getExistingNisNumbers(nisNumbers)
      const dryRunResult = await performDryRun(
        state.rows,
        existingNis,
        state.strategy
      )

      setState((prev) => ({
        ...prev,
        step: "dryrun",
        dryRunResult,
      }))
    } catch (error) {
      console.error("Error running dry run:", error)
      alert("Gagal menjalankan validasi")
    } finally {
      setIsProcessing(false)
    }
  }

  // Continue to preview after dry run
  const handleContinueToPreview = () => {
    setState((prev) => ({ ...prev, step: "preview" }))
  }

  // Continue after conflict resolution
  const handleConflictResolved = () => {
    setState((prev) => ({ ...prev, step: "preview" }))
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
    let updatedCount = 0
    let skippedCount = 0
    let failedCount = 0
    const importErrors: { row: number; message: string }[] = []

    // Get existing NIS for strategy
    const nisNumbers = Array.from(state.selectedRows)
      .map((rn) => state.rows.find((r) => r.rowNumber === rn)?.student_number)
      .filter(Boolean) as string[]

    const existingNis = await getExistingNisNumbers(nisNumbers)

    for (const rowNumber of state.selectedRows) {
      const row = state.rows.find((r) => r.rowNumber === rowNumber)
      if (!row) continue

      setState((prev) => ({ ...prev, importingRows: [...prev.importingRows, rowNumber] }))

      try {
        const nis = row.student_number
        const existsInDb = existingNis.has(nis)

        // Handle based on strategy
        if (existsInDb) {
          switch (state.strategy) {
            case "skip":
              skippedCount++
              continue
            case "update":
            case "upsert":
              // Update existing student
              const updateResult = await updateStudentByNis(nis, row)
              if (updateResult.success) {
                updatedCount++
              } else {
                failedCount++
                importErrors.push({
                  row: row.rowNumber,
                  message: updateResult.error || "Gagal update",
                })
              }
              continue
            case "insert":
              skippedCount++
              continue
          }
        }

        // Create new student
        const createResult = await createStudent({
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
          national_id: row.national_id || undefined,
          enrollment_year: row.enrollment_year
            ? parseInt(row.enrollment_year)
            : new Date().getFullYear(),
          is_active: true,
        })

        if (createResult.success) {
          importedCount++
        } else {
          failedCount++
          importErrors.push({
            row: row.rowNumber,
            message: createResult.error || "Gagal import",
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
      updatedCount,
      skippedCount,
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
      headers: [],
      rawRows: [],
      rows: [],
      errors: [],
      selectedRows: new Set(),
      strategy: "upsert",
      fieldMapping: [],
      dryRunResult: null,
      conflicts: [],
      importingRows: [],
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      failedCount: 0,
      importErrors: [],
    })
    setPreviewPage(1)
  }

  // Download template
  const downloadTemplate = () => {
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
      "NISN",
      "Tahun Masuk",
      "Nama Ayah",
      "No. HP Ayah",
      "Nama Ibu",
      "No. HP Ibu",
      "Nama Wali",
      "No. HP Wali",
      "Hubungan Wali",
      "Tinggi Badan (cm)",
      "Berat Badan (kg)",
    ]
    // Format tanggal DD/MM/YYYY (Indonesia)
    const exampleRow = [
      "2024001",
      "John Doe",
      "John",
      "male",
      "Jakarta",
      "15/01/2010",
      "Islam",
      "Indonesia",
      "A",
      "Jl. Contoh No. 1",
      "081234567890",
      "john@example.com",
      "1234567890123456",
      "1234567890",
      "2024",
      "John Sr.",
      "081234567891",
      "Jane Doe",
      "081234567892",
      "",
      "",
      "",
      "150",
      "45",
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

  // Step definitions
  const steps = ["Upload", "Strategi", "Pemetaan", "Validasi", "Preview", "Import", "Selesai"]
  const stepIndex = {
    upload: 0,
    strategy: 1,
    mapping: 2,
    preview: 3,
    dryrun: 3,
    conflicts: 3,
    importing: 4,
    complete: 5,
  }

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
          Import data siswa dari file Excel atau CSV dengan validasi dan preview
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const currentIndex = stepIndex[state.step]
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div key={step} className="flex items-center gap-2 flex-shrink-0">
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
                  "text-[13px] font-medium whitespace-nowrap",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 h-0.5 rounded",
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

      {/* Step Content */}
      <div className="space-y-6">
        {/* Upload Step */}
        {state.step === "upload" && (
          <Card padding="lg">
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

        {/* Strategy Step */}
        {state.step === "strategy" && (
          <div className="space-y-6">
            <Card padding="lg">
              <StrategySelector
                selected={state.strategy}
                onSelect={handleStrategyChange}
                conflictCount={state.conflicts.length}
              />
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={resetUpload}>
                Batal
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setState((prev) => ({ ...prev, step: "mapping" }))}
                >
                  <Settings2 className="w-4 h-4" />
                  Pengaturan Lanjutan
                </Button>
                {state.conflicts.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setState((prev) => ({ ...prev, step: "conflicts" }))}
                  >
                    <GitCompare className="w-4 h-4" />
                    Lihat Konflik
                  </Button>
                )}
                <Button onClick={handleDryRun} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Validasi Data
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mapping Step */}
        {state.step === "mapping" && (
          <Card padding="lg">
            <FieldMappingEditor
              headers={state.headers}
              mapping={state.fieldMapping}
              onChange={handleMappingChange}
            />

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border-light)]">
              <Button variant="outline" onClick={() => setState((prev) => ({ ...prev, step: "strategy" }))}>
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </Button>
              <Button onClick={handleDryRun} disabled={isProcessing}>
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Validasi Data
              </Button>
            </div>
          </Card>
        )}

        {/* Conflicts Step */}
        {state.step === "conflicts" && (
          <Card padding="lg">
            <ConflictResolution
              conflicts={state.conflicts}
              onResolved={handleConflictResolved}
              onCancel={() => setState((prev) => ({ ...prev, step: "strategy" }))}
            />
          </Card>
        )}

        {/* Dry Run Result Step */}
        {state.step === "dryrun" && state.dryRunResult && (
          <Card padding="lg">
            <DryRunResultView
              result={state.dryRunResult}
              onContinue={handleContinueToPreview}
              onBack={() => setState((prev) => ({ ...prev, step: "strategy" }))}
            />
          </Card>
        )}

        {/* Preview Step */}
        {state.step === "preview" && (
          <div className="space-y-6">
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
              <Button variant="outline" onClick={() => setState((prev) => ({ ...prev, step: "strategy" }))}>
                <ChevronLeft className="w-4 h-4" />
                Ubah Strategi
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
                    {state.importedCount > 0 && `${state.importedCount} siswa ditambahkan`}
                    {state.updatedCount > 0 && `${state.updatedCount} siswa diupdate`}
                    {state.skippedCount > 0 && `${state.skippedCount} dilewati`}
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
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {state.importedCount > 0 && (
                      <span className="text-[14px] text-[var(--success)]">
                        {state.importedCount} ditambahkan
                      </span>
                    )}
                    {state.updatedCount > 0 && (
                      <span className="text-[14px] text-[var(--info)]">
                        {state.updatedCount} diupdate
                      </span>
                    )}
                    {state.skippedCount > 0 && (
                      <span className="text-[14px] text-[var(--text-muted)]">
                        {state.skippedCount} dilewati
                      </span>
                    )}
                    {state.failedCount > 0 && (
                      <span className="text-[14px] text-[var(--danger)]">
                        {state.failedCount} gagal
                      </span>
                    )}
                  </div>

                  {state.importErrors.length > 0 && (
                    <div className="mt-6 text-left max-w-md mx-auto">
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
      </div>
    </AppShell>
  )
}
