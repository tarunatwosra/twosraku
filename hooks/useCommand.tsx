"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Command,
  SearchResult,
  SearchHistory,
  SavedSearch,
  FavoriteItem,
  CommandPaletteState,
  KeyboardShortcut,
} from "@/types/command"
import { useAuth } from "./useAuth"
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  Bell,
  UserPlus,
  CalendarCheck,
  GraduationCap,
  Award,
  BookOpen,
  Search,
  Clock,
  Star,
  ChevronRight,
  Home,
  LogOut,
  Moon,
  Sun,
  Download,
  Upload,
} from "lucide-react"

// Default keyboard shortcuts
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { key: "k", modifiers: ["ctrl"], action: "open_command", description: "Buka Command Palette" },
  { key: "n", modifiers: ["ctrl"], action: "new_student", description: "Tambah Siswa Baru" },
  { key: "/", modifiers: [], action: "focus_search", description: "Fokus Pencarian" },
  { key: "g h", modifiers: [], action: "go_home", description: "Ke Dashboard" },
  { key: "g s", modifiers: [], action: "go_settings", description: "Ke Pengaturan" },
  { key: "g a", modifiers: [], action: "go_attendance", description: "Ke Presensi" },
  { key: "g p", modifiers: [], action: "go_assessment", description: "Ke Penilaian" },
  { key: "?", modifiers: [], action: "show_shortcuts", description: "Tampilkan Shortcut" },
]

// Command definitions
const NAVIGATION_COMMANDS: Command[] = [
  {
    id: "nav-dashboard",
    title: "Dashboard",
    description: "Halaman utama",
    icon: <LayoutDashboard className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/" },
    shortcut: "g h",
    keywords: ["home", "beranda", "utama"],
  },
  {
    id: "nav-buku-induk",
    title: "Buku Induk",
    description: "Manajemen data siswa",
    icon: <Users className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/buku-induk" },
    keywords: ["student", "siswa", "registry"],
  },
  {
    id: "nav-presensi",
    title: "Presensi",
    description: "Kehadiran siswa",
    icon: <CalendarCheck className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/presensi" },
    keywords: ["attendance", "kehadiran", "hadir"],
  },
  {
    id: "nav-penilaian",
    title: "Penilaian",
    description: "Penilaian siswa",
    icon: <ClipboardCheck className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/penilaian" },
    keywords: ["assessment", "nilai", "rapor"],
  },
  {
    id: "nav-poin-karakter",
    title: "Poin Karakter",
    description: "Catatan karakter siswa",
    icon: <Award className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/poin-karakter" },
    keywords: ["character", "perilaku", "disiplin"],
  },
  {
    id: "nav-tabungan",
    title: "Tabungan",
    description: "Tabungan siswa",
    icon: <BookOpen className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/tabungan" },
    keywords: ["savings", "uang"],
  },
  {
    id: "nav-laporan",
    title: "Laporan",
    description: "Laporan dan statistik",
    icon: <FileText className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/laporan" },
    keywords: ["report", "statistik", "export"],
  },
  {
    id: "nav-notifikasi",
    title: "Notifikasi",
    description: "Pusat notifikasi",
    icon: <Bell className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/notifikasi" },
    keywords: ["notification", "alert"],
  },
  {
    id: "nav-pengaturan",
    title: "Pengaturan",
    description: "Pengaturan aplikasi",
    icon: <Settings className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/settings" },
    shortcut: "g s",
    keywords: ["settings", "config", "konfigurasi"],
  },
  {
    id: "nav-guru-staff",
    title: "Guru & Staff",
    description: "Manajemen guru dan staff",
    icon: <GraduationCap className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/guru-staff" },
    keywords: ["teacher", "staff", "guru"],
  },
]

const ACTION_COMMANDS: Command[] = [
  {
    id: "action-new-student",
    title: "Tambah Siswa Baru",
    description: "Daftarkan siswa baru",
    icon: <UserPlus className="w-4 h-4" />,
    category: "create",
    action: { type: "navigate", value: "/buku-induk/new" },
    shortcut: "Ctrl+N",
    keywords: ["add", "create", "tambah", "daftar"],
  },
  {
    id: "action-record-attendance",
    title: "Catat Presensi",
    description: "Rekam kehadiran hari ini",
    icon: <CalendarCheck className="w-4 h-4" />,
    category: "create",
    action: { type: "navigate", value: "/presensi" },
    keywords: ["attendance", "presensi", "hadir"],
  },
  {
    id: "action-input-assessment",
    title: "Input Penilaian",
    description: "Masukkan nilai siswa",
    icon: <ClipboardCheck className="w-4 h-4" />,
    category: "create",
    action: { type: "navigate", value: "/penilaian" },
    keywords: ["score", "nilai", "rapor"],
  },
  {
    id: "action-import-data",
    title: "Impor Data",
    description: "Impor data dari file",
    icon: <Upload className="w-4 h-4" />,
    category: "import",
    action: { type: "navigate", value: "/buku-induk/import" },
    keywords: ["import", "upload", "masukkan"],
  },
  {
    id: "action-export-data",
    title: "Ekspor Data",
    description: "Ekspor data ke file",
    icon: <Download className="w-4 h-4" />,
    category: "export",
    action: { type: "navigate", value: "/laporan" },
    keywords: ["export", "download", "cetak"],
  },
]

const QUICK_COMMANDS: Command[] = [
  {
    id: "quick-search",
    title: "Cari Siswa",
    description: "Cari data siswa",
    icon: <Search className="w-4 h-4" />,
    category: "navigation",
    action: { type: "navigate", value: "/buku-induk" },
    shortcut: "/",
    keywords: ["search", "cari", "find"],
  },
  {
    id: "quick-recent",
    title: "Aktivitas Terbaru",
    description: "Lihat aktivitas terbaru",
    icon: <Clock className="w-4 h-4" />,
    category: "recent",
    action: { type: "navigate", value: "/#recent-activity" },
    keywords: ["recent", "terbaru", "activity"],
  },
  {
    id: "quick-favorites",
    title: "Favorit",
    description: "Item favorit Anda",
    icon: <Star className="w-4 h-4" />,
    category: "recent",
    action: { type: "navigate", value: "/#favorites" },
    keywords: ["favorite", "suka", "star"],
  },
  {
    id: "quick-dark-mode",
    title: "Toggle Dark Mode",
    description: "Ubah tampilan tema",
    icon: <Moon className="w-4 h-4" />,
    category: "settings",
    action: { type: "function", value: "toggleTheme" },
    keywords: ["dark", "light", "theme", "tema"],
  },
  {
    id: "quick-logout",
    title: "Keluar",
    description: "Logout dari aplikasi",
    icon: <LogOut className="w-4 h-4" />,
    category: "system",
    action: { type: "navigate", value: "/logout" },
    keywords: ["logout", "signout", "keluar"],
  },
]

// All commands combined
const ALL_COMMANDS = [...NAVIGATION_COMMANDS, ...ACTION_COMMANDS, ...QUICK_COMMANDS]

// Storage keys
const SEARCH_HISTORY_KEY = "twosraku_search_history"
const FAVORITES_KEY = "twosraku_favorites"
const MAX_HISTORY = 10

export function useCommand() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [results, setResults] = useState<(Command | SearchResult)[]>([])

  // Load from storage
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (history) {
          setSearchHistory(JSON.parse(history))
        }
        const favs = localStorage.getItem(FAVORITES_KEY)
        if (favs) {
          setFavorites(JSON.parse(favs))
        }
      } catch (error) {
        console.error("Failed to load command data:", error)
      }
    }
  }, [isAuthenticated])

  // Search commands
  const searchCommands = useCallback(
    (searchQuery: string): Command[] => {
      if (!searchQuery.trim()) {
        return ALL_COMMANDS.slice(0, 10)
      }

      const lowerQuery = searchQuery.toLowerCase()
      return ALL_COMMANDS.filter((cmd) => {
        const titleMatch = cmd.title.toLowerCase().includes(lowerQuery)
        const descMatch = cmd.description?.toLowerCase().includes(lowerQuery)
        const keywordMatch = cmd.keywords?.some((k) =>
          k.toLowerCase().includes(lowerQuery)
        )
        return titleMatch || descMatch || keywordMatch
      }).slice(0, 15)
    },
    []
  )

  // Update results when query changes
  useEffect(() => {
    const searchResults = searchCommands(query)
    setResults(searchResults)
    setSelectedIndex(0)
  }, [query, searchCommands])

  // Open command palette
  const open = useCallback(() => {
    setIsOpen(true)
    setQuery("")
    setSelectedIndex(0)
  }, [])

  // Close command palette
  const close = useCallback(() => {
    setIsOpen(false)
    setQuery("")
    setSelectedIndex(0)
  }, [])

  // Toggle command palette
  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  // Navigate to result
  const navigateTo = useCallback(
    (command: Command) => {
      if (command.action.type === "navigate") {
        window.location.href = command.action.value
      } else if (command.action.type === "url") {
        window.open(command.action.value, "_blank")
      }
      close()

      // Add to history
      if (query.trim()) {
        const newHistory: SearchHistory = {
          id: Date.now().toString(),
          keyword: query,
          timestamp: new Date().toISOString(),
          resultCount: 1,
        }
        setSearchHistory((prev) => {
          const filtered = prev.filter((h) => h.keyword !== query)
          const updated = [newHistory, ...filtered].slice(0, MAX_HISTORY)
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
          return updated
        })
      }
    },
    [query, close]
  )

  // Add to favorites
  const addToFavorites = useCallback((item: SearchResult | Command) => {
    const favorite: FavoriteItem = {
      id: item.id,
      type: "command",
      title: item.title,
      url:
        "action" in item && item.action?.type === "navigate"
          ? item.action.value
          : "",
      icon: "icon" in item ? item.icon : undefined,
      pinnedAt: new Date().toISOString(),
    }
    setFavorites((prev) => {
      const updated = [favorite, ...prev.filter((f) => f.id !== favorite.id)]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Remove from favorites
  const removeFromFavorites = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            navigateTo(results[selectedIndex] as Command)
          }
          break
        case "Escape":
          e.preventDefault()
          close()
          break
      }
    },
    [isOpen, results, selectedIndex, navigateTo, close]
  )

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [toggle, handleKeyDown])

  // Get grouped results
  const groupedResults = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      create: [],
      import: [],
      export: [],
      settings: [],
      system: [],
      recent: [],
    }

    results.forEach((result) => {
      const cmd = result as Command
      if (groups[cmd.category]) {
        groups[cmd.category].push(cmd)
      }
    })

    return groups
  }, [results])

  return {
    isOpen,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    results,
    groupedResults,
    searchHistory,
    favorites,
    open,
    close,
    toggle,
    navigateTo,
    addToFavorites,
    removeFromFavorites,
    clearHistory,
    allCommands: ALL_COMMANDS,
  }
}
