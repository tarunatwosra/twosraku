// Types barrel export - handle conflicts with database types
export * from "./database"
export * from "./buku-induk"

// Core database types
export type { Class, Major, AcademicYear as AcademicYearType } from "./database"

// Auth types
export type { User, UserRole, UserStatus, LoginCredentials, LoginResponse, LoginErrorCode, AuthState, Session, PasswordPolicy, Permission, PermissionAction, RolePermissions, LoginHistory, PasswordChangeRequest, PasswordResetRequest, PasswordResetResponse } from "./auth"

// Settings types
export type { AppSettings, GeneralSettings, SchoolSettings, AcademicSettings, AppearanceSettings, DateFormat, TimeFormat, Theme, Density, SidebarStyle, TableDensity, AnimationLevel, AppUser, NotificationSettings, SecuritySettings, PasswordPolicySettings, ImportExportSettings, BackupSettings, StorageSettings, IntegrationSettings, ImportStrategy, SettingsChangeLog } from "./settings"
export type { AcademicYear as AcademicYearSettings, Semester as SemesterSettings } from "./settings"

// Command types
export type { Command, CommandCategory, CommandAction, SearchResult, SearchResultType, SearchResultAction, SearchFilters, SearchHistory, SavedSearch, FavoriteItem, CommandPaletteState, CommandResult, RecentActivity, KeyboardShortcut, NavigationItem, SearchAnalytics, SearchSettings } from "./command"

// Attendance types
export type { Attendance, AttendanceRecord, AttendanceSession, AttendanceSummary, ClassAttendance, AttendanceFilter, AttendanceReport, AttendanceStatus, AttendanceStatistics, StudentAttendanceHistory, DailyRecap, WeeklyRecap, MonthlyRecap, SemesterRecap } from "./attendance"
export { ATTENDANCE_STATUS_CONFIG } from "./attendance"

// Assessment types
export type { AssessmentCategory, AssessmentTemplate, AssessmentItem, AssessmentSession, AssessmentParticipant, StudentScore, ScoreType, SessionStatus, ParticipationStatus, ScoreStatus, ScoreSummary, GradeInterval, GradingScale, SessionDetail, FormulaType, CalculationResult, AssessmentFilter, AssessmentReport, ScoreValidation } from "./assessment"
export { DEFAULT_GRADING_SCALE } from "./assessment"

// Character types
export type { CharacterCategoryRecord, BehaviorType, CharacterEvent, CharacterRecord, RecordStatus, StudentCharacterSummary, CharacterFilter, CharacterStatistics, ClassCharacterSummary, CharacterReport, SeverityLevel, CounselingRecommendation, CharacterCategory } from "./character"
export { CATEGORY_COLORS } from "./character"
