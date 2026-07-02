// Command & Global Search Types

export interface Command {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  category: CommandCategory
  action: CommandAction
  shortcut?: string
  permission?: string[]
  keywords?: string[]
  metadata?: Record<string, unknown>
}

export type CommandCategory =
  | 'navigation'
  | 'create'
  | 'update'
  | 'delete'
  | 'generate'
  | 'export'
  | 'import'
  | 'settings'
  | 'system'
  | 'recent'

export interface CommandAction {
  type: 'navigate' | 'url' | 'function' | 'modal'
  value: string
  params?: Record<string, unknown>
}

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  module?: string
  url?: string
  actions?: SearchResultAction[]
  metadata?: Record<string, unknown>
}

export type SearchResultType =
  | 'student'
  | 'teacher'
  | 'class'
  | 'module'
  | 'report'
  | 'setting'
  | 'notification'
  | 'command'
  | 'document'

export interface SearchResultAction {
  label: string
  icon?: React.ReactNode
  action: () => void
}

export interface SearchFilters {
  modules?: string[]
  types?: SearchResultType[]
  dateRange?: {
    start: string
    end: string
  }
  status?: string
}

export interface SearchHistory {
  id: string
  keyword: string
  module?: string
  timestamp: string
  resultCount: number
  selectedResultId?: string
}

export interface SavedSearch {
  id: string
  name: string
  keyword: string
  filters?: SearchFilters
  createdBy: string
  createdAt: string
  lastUsed?: string
  isShared: boolean
}

export interface FavoriteItem {
  id: string
  type: 'student' | 'report' | 'page' | 'command' | 'setting'
  title: string
  url: string
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
  pinnedAt: string
}

export interface CommandPaletteState {
  isOpen: boolean
  query: string
  selectedIndex: number
  results: CommandResult[]
  isLoading: boolean
}

export interface CommandResult {
  type: 'command' | 'search' | 'recent' | 'favorite' | 'navigation'
  items: (Command | SearchResult)[]
  category?: string
}

// Recent activities for command palette
export interface RecentActivity {
  id: string
  type: 'page' | 'action' | 'search'
  title: string
  description?: string
  url: string
  timestamp: string
  icon?: React.ReactNode
}

// Command shortcuts
export interface KeyboardShortcut {
  key: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  action: string
  description: string
  scope?: string
}

// Navigation items for search index
export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  category: string
  permission?: string[]
  parentId?: string
  order: number
}

// Search analytics
export interface SearchAnalytics {
  keyword: string
  searchCount: number
  avgResultCount: number
  avgDuration: number // in ms
  lastSearched: string
  topResults: SearchResult[]
}

// Search settings
export interface SearchSettings {
  enabled: boolean
  historyEnabled: boolean
  suggestionsEnabled: boolean
  recentLimit: number
  maxResults: number
  fuzzyMatchEnabled: boolean
}
