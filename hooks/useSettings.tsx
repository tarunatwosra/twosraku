"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  AppSettings,
  GeneralSettings,
  SchoolSettings,
  AcademicSettings,
  AppearanceSettings,
} from "@/types/settings"

// Default settings
const defaultGeneralSettings: GeneralSettings = {
  appName: "Twosraku",
  appShortName: "Twosraku",
  timezone: "Asia/Jakarta",
  language: "id-ID",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  numberFormat: "id-ID",
  currency: "IDR",
  defaultPageSize: 25,
  defaultDashboard: "/",
  sessionTimeout: 30,
}

const defaultSchoolSettings: SchoolSettings = {
  name: "SMKN 2 Sragen",
  npsn: "203xxxxx",
  address: "Jl. Utama No. 1",
  city: "Sragen",
  province: "Jawa Tengah",
  postalCode: "57211",
  phone: "(0271) xxxxxx",
  email: "info@smkn2sragen.sch.id",
  website: "https://smkn2sragen.sch.id",
  principalName: "Dr. Budi Santoso",
  vision: "",
  mission: "",
}

const defaultAcademicSettings: AcademicSettings = {
  academicYears: [
    {
      id: "1",
      name: "2025/2026",
      startDate: "2025-07-15",
      endDate: "2026-06-30",
      isActive: true,
    },
    {
      id: "2",
      name: "2024/2025",
      startDate: "2024-07-15",
      endDate: "2025-06-30",
      isActive: false,
    },
  ],
  semesters: [
    {
      id: "1",
      name: "Semester Ganjil",
      type: "ganjil",
      academicYearId: "1",
      startDate: "2025-07-15",
      endDate: "2025-12-31",
      isActive: true,
    },
    {
      id: "2",
      name: "Semester Genap",
      type: "genap",
      academicYearId: "1",
      startDate: "2026-01-01",
      endDate: "2026-06-30",
      isActive: false,
    },
  ],
  activeAcademicYear: "1",
  activeSemester: "1",
  gradingScale: {
    id: "1",
    name: "Standar",
    intervals: [
      { grade: "A", minScore: 90, maxScore: 100, description: "Sangat Baik", color: "green", isPassing: true },
      { grade: "B", minScore: 80, maxScore: 89, description: "Baik", color: "blue", isPassing: true },
      { grade: "C", minScore: 70, maxScore: 79, description: "Cukup", color: "yellow", isPassing: true },
      { grade: "D", minScore: 60, maxScore: 69, description: "Kurang", color: "orange", isPassing: true },
      { grade: "E", minScore: 0, maxScore: 59, description: "Sangat Kurang", color: "red", isPassing: false },
    ],
  },
  attendanceThreshold: 80,
  passingGrade: 75,
  graduationRules: {
    minAttendancePercentage: 85,
    minAverageScore: 75,
    minCharacterPoints: 80,
  },
}

const defaultAppearanceSettings: AppearanceSettings = {
  theme: "light",
  accentColor: "#3B82F6",
  density: "normal",
  sidebarStyle: "floating",
  cardRadius: 18,
  tableDensity: "normal",
  animationLevel: "normal",
  glassEffect: false,
}

const defaultSettings: AppSettings = {
  general: defaultGeneralSettings,
  school: defaultSchoolSettings,
  academic: defaultAcademicSettings,
  appearance: defaultAppearanceSettings,
}

// Context type
interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  updateGeneralSettings: (updates: Partial<GeneralSettings>) => void
  updateSchoolSettings: (updates: Partial<SchoolSettings>) => void
  updateAcademicSettings: (updates: Partial<AcademicSettings>) => void
  updateAppearanceSettings: (updates: Partial<AppearanceSettings>) => void
  resetSettings: () => void
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const SETTINGS_STORAGE_KEY = "twosraku_settings"

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from storage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setSettings({ ...defaultSettings, ...parsed })
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save settings to storage
  const saveSettings = (newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  // Update all settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Update general settings
  const updateGeneralSettings = (updates: Partial<GeneralSettings>) => {
    const newSettings = {
      ...settings,
      general: { ...settings.general, ...updates },
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Update school settings
  const updateSchoolSettings = (updates: Partial<SchoolSettings>) => {
    const newSettings = {
      ...settings,
      school: { ...settings.school, ...updates },
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Update academic settings
  const updateAcademicSettings = (updates: Partial<AcademicSettings>) => {
    const newSettings = {
      ...settings,
      academic: { ...settings.academic, ...updates },
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Update appearance settings
  const updateAppearanceSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = {
      ...settings,
      appearance: { ...settings.appearance, ...updates },
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
    saveSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateGeneralSettings,
        updateSchoolSettings,
        updateAcademicSettings,
        updateAppearanceSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

// Hook for academic year
export function useAcademicYear() {
  const { settings } = useSettings()
  const { academicYears, semesters, activeAcademicYear, activeSemester } = settings.academic

  const activeYear = academicYears.find((y) => y.id === activeAcademicYear)
  const activeSem = semesters.find((s) => s.id === activeSemester)

  return {
    academicYear: activeYear,
    semester: activeSem,
    academicYears,
    semesters,
  }
}
