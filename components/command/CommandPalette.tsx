"use client"

import { useEffect, useRef } from "react"
import { useCommand } from "@/hooks/useCommand"
import { Modal } from "@/components/ui/modal"
import { Command } from "@/types/command"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardCheck,
  Award,
  BookOpen,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  UserPlus,
  Calendar,
  Download,
  Upload,
  Search,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
  Moon,
  Sun,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  navigation: <LayoutDashboard className="w-4 h-4" />,
  create: <UserPlus className="w-4 h-4" />,
  import: <Upload className="w-4 h-4" />,
  export: <Download className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  system: <LogOut className="w-4 h-4" />,
  recent: <Clock className="w-4 h-4" />,
}

const categoryLabels: Record<string, string> = {
  navigation: "Navigasi",
  create: "Buat Baru",
  import: "Impor",
  export: "Ekspor",
  settings: "Pengaturan",
  system: "Sistem",
  recent: "Terbaru",
}

export function CommandPalette() {
  const {
    isOpen,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    results,
    groupedResults,
    close,
    navigateTo,
    allCommands,
  } = useCommand()

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-selected="true"]`
      )
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  // Get display commands based on query
  const displayCommands = query.trim()
    ? results
    : allCommands.slice(0, 10)

  // Calculate flat index for selection
  const getFlatIndex = (cmd: Command): number => {
    return displayCommands.findIndex((c) => (c as Command).id === cmd.id)
  }

  return (
    <Modal isOpen={isOpen} onClose={close} className="p-0 max-w-xl" showCloseButton={false}>
      <div className="flex flex-col max-h-[70vh]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik perintah atau cari..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <kbd className="px-2 py-1 text-xs font-medium bg-[var(--surface-secondary)] text-[var(--text-muted)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {displayCommands.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[var(--text-muted)]">
                Tidak ada hasil untuk &quot;{query}&quot;
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Coba kata kunci lain
              </p>
            </div>
          ) : (
            <>
              {/* Show grouped if no query */}
              {!query.trim() && (
                <>
                  {/* Favorites Section */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
                      Favorit
                    </p>
                  </div>

                  {/* Navigation Section */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
                      Navigasi
                    </p>
                    <div className="space-y-1">
                      {groupedResults.navigation.slice(0, 5).map((cmd, index) => (
                        <CommandItem
                          key={cmd.id}
                          command={cmd}
                          isSelected={selectedIndex === index}
                          onSelect={() => navigateTo(cmd)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">
                      Aksi Cepat
                    </p>
                    <div className="space-y-1">
                      {[...groupedResults.create, ...groupedResults.settings, ...groupedResults.system]
                        .slice(0, 5)
                        .map((cmd, i) => {
                          const index = groupedResults.navigation.length + i
                          return (
                            <CommandItem
                              key={cmd.id}
                              command={cmd}
                              isSelected={selectedIndex === index}
                              onSelect={() => navigateTo(cmd)}
                              onMouseEnter={() => setSelectedIndex(index)}
                            />
                          )
                        })}
                    </div>
                  </div>
                </>
              )}

              {/* Search Results */}
              {query.trim() && (
                <div className="px-4 py-2 space-y-1">
                  {displayCommands.map((cmd, index) => (
                    <CommandItem
                      key={cmd.id}
                      command={cmd as Command}
                      isSelected={selectedIndex === index}
                      onSelect={() => navigateTo(cmd as Command)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--surface-secondary)] rounded">
                ↑↓
              </kbd>
              navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--surface-secondary)] rounded">
                ↵
              </kbd>
              pilih
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[var(--surface-secondary)] rounded">
              Ctrl+K
            </kbd>
            <span>untuk membuka</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Command Item Component
interface CommandItemProps {
  command: Command
  isSelected: boolean
  onSelect: () => void
  onMouseEnter: () => void
}

function CommandItem({
  command,
  isSelected,
  onSelect,
  onMouseEnter,
}: CommandItemProps) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      data-selected={isSelected}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
        isSelected
          ? "bg-[var(--primary)] text-white"
          : "hover:bg-[var(--surface-hover)]"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isSelected
            ? "bg-white/20"
            : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
        )}
      >
        {command.icon || categoryIcons[command.category] || (
          <ChevronRight className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isSelected ? "text-white" : "text-[var(--text-primary)]"
          )}
        >
          {command.title}
        </p>
        {command.description && (
          <p
            className={cn(
              "text-xs truncate",
              isSelected
                ? "text-white/80"
                : "text-[var(--text-muted)]"
            )}
          >
            {command.description}
          </p>
        )}
      </div>

      {/* Shortcut & Arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {command.shortcut && (
          <kbd
            className={cn(
              "px-1.5 py-0.5 text-xs rounded",
              isSelected
                ? "bg-white/20 text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
            )}
          >
            {command.shortcut}
          </kbd>
        )}
        {isSelected && (
          <ArrowRight className="w-4 h-4 text-white/80" />
        )}
      </div>
    </button>
  )
}
