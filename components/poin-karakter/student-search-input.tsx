"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useStudentSearch } from "@/hooks/useCharacter"
import { Search, X, User, ChevronRight, Loader2 } from "lucide-react"

interface Student {
  id: string
  name: string
  className?: string
  nisn?: string
}

interface StudentSearchInputProps {
  value?: Student | null
  onChange: (student: Student | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function StudentSearchInput({
  value,
  onChange,
  placeholder = "Cari nama atau NISN siswa...",
  disabled = false,
  className,
}: StudentSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { results: searchResults, loading: searchLoading, search, clearResults } = useStudentSearch()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        search(searchQuery)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      clearResults()
    }
  }, [searchQuery, search, clearResults])

  const handleSelect = (student: Student) => {
    onChange(student)
    setSearchQuery("")
    setIsOpen(false)
    clearResults()
  }

  const handleClear = () => {
    onChange(null)
    setSearchQuery("")
    clearResults()
    inputRef.current?.focus()
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Selected Student Display */}
      {value && !isOpen && (
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl",
            "bg-[var(--surface-secondary)] border border-[var(--border-light)]",
            "cursor-pointer hover:border-[var(--border-default)] transition-colors"
          )}
          onClick={() => !disabled && setIsOpen(true)}
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[13px] font-semibold text-[var(--primary)]">
            {getInitials(value.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              {value.name}
            </p>
            <p className="text-[12px] text-[var(--text-muted)]">
              {value.className}
              {value.nisn && ` • ${value.nisn}`}
            </p>
          </div>
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="w-8 h-8 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          )}
        </div>
      )}

      {/* Search Input */}
      {(!value || isOpen) && (
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full h-12 pl-11 pr-11",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-[18px]",
                "text-[15px] text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]",
                "transition-all duration-200",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div
              className={cn(
                "absolute z-50 w-full mt-2",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-light)]",
                "rounded-2xl shadow-lg shadow-[var(--shadow-medium)]",
                "overflow-hidden"
              )}
            >
              <div className="max-h-64 overflow-y-auto p-1">
                {!searchQuery.trim() ? (
                  <div className="text-center py-6">
                    <User className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-[14px] text-[var(--text-muted)]">
                      Ketik nama atau NISN untuk mencari
                    </p>
                  </div>
                ) : searchLoading ? (
                  <div className="text-center py-6">
                    <Loader2 className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 animate-spin" />
                    <p className="text-[14px] text-[var(--text-muted)]">
                      Mencari...
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-6">
                    <User className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-[14px] text-[var(--text-muted)]">
                      Siswa tidak ditemukan
                    </p>
                  </div>
                ) : (
                  searchResults.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleSelect(student)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl",
                        "hover:bg-[var(--surface-hover)]",
                        "transition-colors text-left"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[13px] font-semibold text-[var(--primary)]">
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {student.name}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)]">
                          {student.className}
                          {student.nisn && ` • ${student.nisn}`}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
