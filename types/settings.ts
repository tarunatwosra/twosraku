// Settings Types

export interface AppSettings {
  general: GeneralSettings
  school: SchoolSettings
  academic: AcademicSettings
  appearance: AppearanceSettings
}

export interface GeneralSettings {
  appName: string
  appShortName: string
  timezone: string
  language: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  numberFormat: string
  currency: string
  defaultPageSize: number
  defaultDashboard: string
  sessionTimeout: number // in minutes
}

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
export type TimeFormat = '24h' | '12h'

export interface SchoolSettings {
  name: string
  npsn: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
  email: string
  website: string
  principalName: string
  logo?: string
  stamp?: string
  vision: string
  mission: string
}

export interface AcademicSettings {
  academicYears: AcademicYear[]
  semesters: Semester[]
  activeAcademicYear?: string
  activeSemester?: string
  gradingScale: GradingScale
  attendanceThreshold: number // minimum attendance percentage
  passingGrade: number
  graduationRules: GraduationRules
}

export interface AcademicYear {
  id: string
  name: string // e.g., "2024/2025"
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Semester {
  id: string
  name: string // e.g., "Semester Ganjil", "Semester Genap"
  type: 'ganjil' | 'genap'
  academicYearId: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface GradingScale {
  id: string
  name: string
  intervals: GradeInterval[]
}

export interface GradeInterval {
  grade: string
  minScore: number
  maxScore: number
  description: string
  color: string
  isPassing: boolean
}

export interface GraduationRules {
  minAttendancePercentage: number
  minAverageScore: number
  minCharacterPoints: number
}

export interface AppearanceSettings {
  theme: Theme
  accentColor: string
  density: Density
  sidebarStyle: SidebarStyle
  cardRadius: number
  tableDensity: TableDensity
  animationLevel: AnimationLevel
  glassEffect: boolean
}

export type Theme = 'light' | 'dark' | 'system'
export type Density = 'compact' | 'normal' | 'comfortable'
export type SidebarStyle = 'expanded' | 'collapsed' | 'floating'
export type TableDensity = 'compact' | 'normal' | 'relaxed'
export type AnimationLevel = 'none' | 'minimal' | 'normal' | 'full'

// User Management Types
export interface AppUser {
  id: string
  username: string
  email: string
  name: string
  role: string
  status: UserStatus
  lastLogin?: string
  createdAt: string
  twoFactorEnabled: boolean
}

export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending'

// Notification Settings
export interface NotificationSettings {
  enableNotifications: boolean
  emailNotifications: boolean
  reminderFrequency: number // in hours
  announcementVisibility: 'all' | 'admin_only' | 'specific'
  defaultPriority: 'low' | 'normal' | 'high' | 'critical'
  retentionDays: number
}

// Security Settings
export interface SecuritySettings {
  passwordPolicy: PasswordPolicySettings
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  requireTwoFactor: boolean
  trustedDevicesEnabled: boolean
  ipRestrictionEnabled: boolean
  allowedIpAddresses?: string[]
}

export interface PasswordPolicySettings {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecialChar: boolean
  passwordHistory: number // remember last N passwords
  maxAge: number // days before password expires, 0 = never
}

// Import/Export Settings
export interface ImportExportSettings {
  defaultImportStrategy: ImportStrategy
  dryRunRequired: boolean
  maxFileSize: number // in MB
  allowedFormats: string[]
  tempStorageDuration: number // in hours
  rollbackEnabled: boolean
}

export type ImportStrategy = 'insert_only' | 'update_only' | 'upsert' | 'replace' | 'merge' | 'skip'

// Backup Settings
export interface BackupSettings {
  autoBackupEnabled: boolean
  backupSchedule: BackupSchedule
  retentionDays: number
  maxBackups: number
  cloudBackupEnabled: boolean
  cloudProvider?: string
}

export type BackupSchedule = 'daily' | 'weekly' | 'monthly' | 'manual'

// Storage Settings
export interface StorageSettings {
  usedStorage: number // in bytes
  maxStorage: number // in bytes
  maxUploadSize: number // in MB
  allowedFileTypes: string[]
  tempFileCleanupDays: number
}

// Integration Settings
export interface IntegrationSettings {
  email: EmailIntegration
  googleWorkspace: GoogleWorkspaceIntegration
  microsoft365: MicrosoftIntegration
  cloudStorage: CloudStorageIntegration
  restApi: RestApiSettings
}

export interface EmailIntegration {
  enabled: boolean
  provider: 'smtp' | 'sendgrid' | 'mailgun'
  host?: string
  port?: number
  username?: string
  fromEmail?: string
  fromName?: string
}

export interface GoogleWorkspaceIntegration {
  enabled: boolean
  clientId?: string
}

export interface MicrosoftIntegration {
  enabled: boolean
  clientId?: string
}

export interface CloudStorageIntegration {
  enabled: boolean
  provider: 's3' | 'google_cloud' | 'azure'
  bucket?: string
}

export interface RestApiSettings {
  enabled: boolean
  apiKey?: string
  allowedOrigins: string[]
}

// Settings change log
export interface SettingsChangeLog {
  id: string
  settingKey: string
  oldValue?: string
  newValue: string
  changedBy: string
  changedAt: string
  reason?: string
  ipAddress: string
}
