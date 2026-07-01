"use client"

import { useState, useRef, useEffect } from "react"
import {
  Columns,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  sortable?: boolean
}

interface ColumnConfigButtonProps {
  columns: ColumnConfig[]
  onChange: (columns: ColumnConfig[]) => void
}

// ============================================
// COLUMN CONFIG BUTTON
// ============================================

export function ColumnConfigButton({ columns, onChange }: ColumnConfigButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  const toggleColumn = (columnId: string) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    onChange(newColumns)
  }

  const showAll = () => {
    onChange(columns.map((col) => ({ ...col, visible: true })))
  }

  const hideAll = () => {
    // Always keep at least 2 columns visible
    const essentialColumns = ["name", "nis"]
    onChange(
      columns.map((col) => ({
        ...col,
        visible: essentialColumns.includes(col.id),
      }))
    )
  }

  const visibleCount = columns.filter((c) => c.visible).length

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Columns className="w-4 h-4" />
        Kolom
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-1 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <div className="bg-white rounded-[20px] shadow-xl border border-[var(--border-light)] p-2 min-w-[220px]">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[var(--border-light)] flex items-center justify-between">
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Konfigurasi Kolom
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">
                {visibleCount} kolom
              </span>
            </div>

            {/* Column List */}
            <div className="p-2 max-h-64 overflow-y-auto">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-[10px] cursor-pointer",
                    "hover:bg-[var(--surface-hover)] transition-colors"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-[8px] flex items-center justify-center",
                      column.visible
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                    )}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "text-[13px]",
                      column.visible
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    {column.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="px-3 py-2 border-t border-[var(--border-light)] flex items-center gap-2">
              <button
                onClick={showAll}
                className="flex-1 text-[12px] text-[var(--primary)] hover:underline py-1"
              >
                Tampilkan Semua
              </button>
              <span className="text-[var(--border-light)]">|</span>
              <button
                onClick={hideAll}
                className="flex-1 text-[12px] text-[var(--text-muted)] hover:underline py-1"
              >
                Sembunyikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// DEFAULT COLUMNS
// ============================================

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "name", label: "Nama Siswa", visible: true, sortable: true },
  { id: "nis", label: "NIS", visible: true, sortable: true },
  { id: "class", label: "Kelas", visible: true },
  { id: "gender", label: "Jenis Kelamin", visible: true },
  { id: "birth_date", label: "Tanggal Lahir", visible: false },
  { id: "birth_place", label: "Tempat Lahir", visible: false },
  { id: "religion", label: "Agama", visible: false },
  { id: "address", label: "Alamat", visible: false },
  { id: "phone", label: "Telepon", visible: false },
  { id: "email", label: "Email", visible: false },
  { id: "status", label: "Status", visible: true },
  { id: "enrollment_year", label: "Tahun Masuk", visible: false, sortable: true },
]

// ============================================
// COLUMN RENDERER
// ============================================

interface ColumnRendererProps {
  columns: ColumnConfig[]
  children: React.ReactNode
}

export function ColumnRenderer({ columns, children }: ColumnRendererProps) {
  // This component renders children based on visible columns
  // The actual implementation depends on how the table is structured
  return <>{children}</>
}

// Get visible column IDs
export function getVisibleColumnIds(columns: ColumnConfig[]): string[] {
  return columns.filter((c) => c.visible).map((c) => c.id)
}

// Check if column is visible
export function isColumnVisible(columns: ColumnConfig[], columnId: string): boolean {
  return columns.find((c) => c.id === columnId)?.visible ?? false
}
