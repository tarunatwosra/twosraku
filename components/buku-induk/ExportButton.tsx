"use client"

import { useState, useRef, useEffect } from "react"
import {
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui"
import {
  exportStudents,
  type ExportOptions,
  type ExportColumn,
  DEFAULT_COLUMNS,
  COLUMN_LABELS,
} from "@/lib/export/student-export"
import type { StudentWithClass } from "@/types/database"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  students: StudentWithClass[]
  academicYearId?: string
  academicYearName?: string
  onExportStart?: () => void
  onExportComplete?: () => void
}

export function ExportButton({
  students,
  academicYearId,
  academicYearName,
  onExportStart,
  onExportComplete,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<"xlsx" | "csv">("xlsx")
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn[]>(DEFAULT_COLUMNS)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleExport = async (format: "xlsx" | "csv") => {
    setIsExporting(true)
    onExportStart?.()

    // Small delay for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const options: ExportOptions = {
        format,
        selectedColumns: selectedColumns,
        academicYearName,
      }

      exportStudents(students, options, academicYearId)
      setIsOpen(false)
    } catch (error) {
      console.error("Export error:", error)
      alert("Gagal mengekspor data: " + (error as Error).message)
    } finally {
      setIsExporting(false)
      onExportComplete?.()
    }
  }

  const toggleColumn = (column: ExportColumn) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((c) => c !== column)
      }
      return [...prev, column]
    })
  }

  const selectAllColumns = () => {
    setSelectedColumns(Object.keys(COLUMN_LABELS) as ExportColumn[])
  }

  const resetColumns = () => {
    setSelectedColumns(DEFAULT_COLUMNS)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={students.length === 0}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-1 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <div className="bg-white rounded-[20px] shadow-xl border border-[var(--border-light)] p-2 min-w-[280px]">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[var(--border-light)]">
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Export Data Siswa
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {students.length} siswa akan diexport
              </p>
            </div>

            {/* Format Selection */}
            <div className="p-3">
              <p className="text-[12px] font-medium text-[var(--text-secondary)] mb-2">
                Format File
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedFormat("xlsx")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-[12px] border transition-colors",
                    selectedFormat === "xlsx"
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border-light)] hover:border-[var(--border-focus)]"
                  )}
                >
                  <FileSpreadsheet
                    className={cn(
                      "w-5 h-5",
                      selectedFormat === "xlsx"
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-muted)]"
                    )}
                  />
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-[var(--text-primary)]">
                      Excel
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">.xlsx</p>
                  </div>
                  {selectedFormat === "xlsx" && (
                    <Check className="w-4 h-4 text-[var(--primary)] ml-auto" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedFormat("csv")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-[12px] border transition-colors",
                    selectedFormat === "csv"
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border-light)] hover:border-[var(--border-focus)]"
                  )}
                >
                  <FileText
                    className={cn(
                      "w-5 h-5",
                      selectedFormat === "csv"
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-muted)]"
                    )}
                  />
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-[var(--text-primary)]">
                      CSV
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">.csv</p>
                  </div>
                  {selectedFormat === "csv" && (
                    <Check className="w-4 h-4 text-[var(--primary)] ml-auto" />
                  )}
                </button>
              </div>
            </div>

            {/* Column Selection */}
            <div className="px-3 pb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Kolom ({selectedColumns.length})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllColumns}
                    className="text-[11px] text-[var(--primary)] hover:underline"
                  >
                    Pilih Semua
                  </button>
                  <span className="text-[var(--border-light)]">|</span>
                  <button
                    onClick={resetColumns}
                    className="text-[11px] text-[var(--text-muted)] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-[10px] border transition-colors",
                  showColumnPicker
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border-light)] hover:border-[var(--border-focus)]"
                )}
              >
                <span className="text-[12px] text-[var(--text-primary)]">
                  {selectedColumns.length === Object.keys(COLUMN_LABELS).length
                    ? "Semua kolom"
                    : `${selectedColumns.length} kolom dipilih`}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[var(--text-muted)] transition-transform",
                    showColumnPicker && "rotate-180"
                  )}
                />
              </button>

              {showColumnPicker && (
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                  {(Object.keys(COLUMN_LABELS) as ExportColumn[]).map((col) => (
                    <label
                      key={col}
                      className="flex items-center gap-2 p-2 rounded-[8px] hover:bg-[var(--surface-hover)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col)}
                        onChange={() => toggleColumn(col)}
                        className="w-4 h-4 rounded border-[var(--border-default)]"
                      />
                      <span className="text-[12px] text-[var(--text-primary)]">
                        {COLUMN_LABELS[col]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="px-3 pb-3">
              <button
                onClick={() => handleExport(selectedFormat)}
                disabled={isExporting || selectedColumns.length === 0}
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-[44px]",
                  "text-[14px] font-medium",
                  "bg-[var(--primary)] text-white",
                  "rounded-[14px]",
                  "hover:opacity-90 transition-opacity",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengexport...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
