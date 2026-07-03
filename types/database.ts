/**
 * Database Type Definitions
 *
 * Type definitions untuk semua tabel database.
 * Sinkron dengan database/schema.md
 */

// ============================================
// CORE TYPES
// ============================================

export type UUID = string
export type Timestamp = string
export type Date = string

// ============================================
// CORE TABLES
// ============================================

export interface AcademicYear {
  id: UUID
  name: string
  start_date: Date
  end_date: Date
  is_active: boolean
  is_locked: boolean
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
}

export interface Semester {
  id: UUID
  academic_year_id: UUID
  name: string
  semester_number: 1 | 2
  start_date: Date
  end_date: Date
  is_active: boolean
  is_locked: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Major {
  id: UUID
  name: string
  code: string
  description: string | null
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Grade {
  id: UUID
  name: string
  level: number
  description: string | null
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Class {
  id: UUID
  name: string
  grade_id: UUID
  major_id: UUID
  academic_year_id: UUID
  room_number: string | null
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
  // Relations
  grades?: Grade
  majors?: Major
}

export interface Student {
  id: UUID
  student_number: string
  nisn: string | null
  national_id: string | null
  full_name: string
  nickname: string | null
  gender: 'male' | 'female'
  birth_place: string | null
  birth_date: Date | null
  religion: string | null
  nationality: string | null
  blood_type: string | null
  height_cm: number | null
  weight_kg: number | null
  vision: string | null
  hearing: string | null
  teeth_condition: string | null
  physical_disability: string | null
  illness_history: string | null
  allergies: string | null
  health_notes: string | null
  address: string | null
  phone: string | null
  email: string | null
  photo_url: string | null
  is_active: boolean
  enrollment_year: number | null
  graduation_year: number | null
  transfer_date: Date | null
  transfer_reason: string | null
  notes: string | null
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
}

export interface StudentClass {
  id: UUID
  student_id: UUID
  class_id: UUID
  academic_year_id: UUID
  attendance_number: number | null
  is_homeroom: boolean
  status: 'active' | 'inactive' | 'archived'
  start_date: Date | null
  end_date: Date | null
  created_at: Timestamp
  updated_at: Timestamp
  // Relations
  students?: Student
  classes?: Class
}

export interface Parent {
  id: UUID
  student_id: UUID
  type: 'father' | 'mother' | 'guardian'
  full_name: string
  nik: string | null
  birth_date: Date | null
  occupation: string | null
  education: string | null
  phone: string | null
  email: string | null
  address: string | null
  is_primary: boolean
  guardian_relation: string | null
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================
// USER & AUTH TABLES
// ============================================

export interface User {
  id: UUID
  email: string
  password_hash: string | null
  full_name: string
  nickname: string | null
  gender: 'male' | 'female' | null
  birth_date: Date | null
  phone: string | null
  photo_url: string | null
  employee_number: string | null
  role: string
  status: 'active' | 'inactive' | 'locked'
  last_login: Timestamp | null
  password_changed_at: Timestamp | null
  password_expires_at: Timestamp | null
  login_attempts: number
  locked_until: Timestamp | null
  two_factor_enabled: boolean
  two_factor_secret: string | null
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
}

export interface Role {
  id: UUID
  name: string
  display_name: string
  description: string | null
  is_system: boolean
  status: 'active' | 'inactive'
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================
// ATTENDANCE TABLES
// ============================================

export type AttendanceStatus = 'present' | 'late' | 'permission' | 'sick' | 'absent'

export interface Attendance {
  id: UUID
  student_id: UUID
  class_id: UUID
  academic_year_id: UUID
  semester_id: UUID
  date: Date
  status: AttendanceStatus
  notes: string | null
  recorded_by: UUID | null
  recorded_at: Timestamp
  is_verified: boolean
  verified_by: UUID | null
  verified_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================
// ASSESSMENT TABLES
// ============================================

export interface AssessmentCategory {
  id: UUID
  name: string
  description: string | null
  icon: string | null
  color: string | null
  display_order: number
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
}

export interface AssessmentTemplate {
  id: UUID
  category_id: UUID
  name: string
  description: string | null
  scoring_method: 'weighted_average' | 'simple_average' | 'highest' | 'lowest'
  max_score: number
  min_score: number
  passing_score: number
  allow_decimal: boolean
  auto_calculate: boolean
  display_order: number
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
  // Relations
  assessment_categories?: AssessmentCategory
}

export interface AssessmentItem {
  id: UUID
  template_id: UUID
  name: string
  description: string | null
  score_type: 'numeric' | 'percentage' | 'boolean' | 'rating' | 'letter_grade' | 'custom'
  weight: number
  min_score: number
  max_score: number
  passing_score: number
  display_order: number
  is_required: boolean
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
}

export type SessionStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'reviewed' | 'locked' | 'archived'

export interface AssessmentSession {
  id: UUID
  template_id: UUID
  name: string
  description: string | null
  academic_year_id: UUID
  semester_id: UUID
  class_id: UUID | null
  evaluator_id: UUID | null
  start_date: Date | null
  end_date: Date | null
  status: SessionStatus
  is_locked: boolean
  locked_by: UUID | null
  locked_at: Timestamp | null
  notes: string | null
  created_at: Timestamp
  updated_at: Timestamp
  created_by: UUID | null
  updated_by: UUID | null
  // Relations
  assessment_templates?: AssessmentTemplate
}

export interface AssessmentParticipant {
  id: UUID
  session_id: UUID
  student_id: UUID
  status: 'assigned' | 'present' | 'absent' | 'completed' | 'excluded' | 'withdrawn'
  notes: string | null
  assigned_at: Timestamp
  assigned_by: UUID | null
  created_at: Timestamp
  updated_at: Timestamp
  // Relations
  students?: Student
}

export interface StudentScore {
  id: UUID
  participant_id: UUID
  item_id: UUID
  raw_score: number | null
  final_score: number | null
  grade: string | null
  remark: string | null
  status: 'draft' | 'saved' | 'reviewed' | 'approved' | 'locked'
  evaluator_id: UUID | null
  scored_at: Timestamp
  reviewed_at: Timestamp | null
  reviewed_by: UUID | null
  approved_at: Timestamp | null
  approved_by: UUID | null
  created_at: Timestamp
  updated_at: Timestamp
}

// ============================================
// CHARACTER POINTS TABLES
// ============================================

export interface CharacterCategory {
  id: UUID
  name: string
  description: string | null
  color: string | null
  icon: string | null
  display_order: number
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
}

export interface BehaviorType {
  id: UUID
  category_id: UUID
  name: string
  description: string | null
  point_value: number
  is_positive: boolean
  severity: 'info' | 'minor' | 'moderate' | 'major' | 'critical' | null
  requires_approval: boolean
  requires_counseling: boolean
  status: 'active' | 'inactive' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CharacterEvent {
  id: UUID
  name: string
  description: string | null
  event_date: Date
  location: string | null
  organizer: string | null
  academic_year_id: UUID | null
  semester_id: UUID | null
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
  created_at: Timestamp
  updated_at: Timestamp
}

export type RecordStatus = 'draft' | 'submitted' | 'reviewed' | 'approved' | 'archived'

export interface CharacterRecord {
  id: UUID
  student_id: UUID
  behavior_type_id: UUID
  event_id: UUID | null
  class_id: UUID | null
  academic_year_id: UUID | null
  semester_id: UUID | null
  date: Date
  description: string | null
  evidence_url: string | null
  status: RecordStatus
  reporter_id: UUID
  reviewed_by: UUID | null
  reviewed_at: Timestamp | null
  approved_by: UUID | null
  approved_at: Timestamp | null
  notes: string | null
  created_at: Timestamp
  updated_at: Timestamp
  // Relations
  students?: Student
  behavior_types?: BehaviorType
}

export interface CharacterSummary {
  id: UUID
  student_id: UUID
  academic_year_id: UUID
  positive_points: number
  negative_points: number
  net_score: number
  total_records: number
  positive_records: number
  negative_records: number
  highest_achievement: string | null
  most_frequent_violation: string | null
  last_updated: Timestamp
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'announcement' | 'task' | 'approval' | 'system'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical'

export interface Notification {
  id: UUID
  user_id: UUID
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  module: string | null
  reference_id: UUID | null
  action_url: string | null
  read_status: boolean
  read_at: Timestamp | null
  expires_at: Timestamp | null
  metadata: Record<string, unknown> | null
  created_at: Timestamp
}

// ============================================
// SETTINGS
// ============================================

export interface Setting {
  id: UUID
  category: string
  key: string
  value: string | null
  type: 'string' | 'number' | 'boolean' | 'json'
  description: string | null
  is_public: boolean
  updated_by: UUID | null
  updated_at: Timestamp
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalClasses: number
  totalTeachers: number
  attendanceToday: AttendanceStats
  assessmentCompletion: number
  recentActivities: Activity[]
}

export interface AttendanceStats {
  total: number
  present: number
  late: number
  permission: number
  sick: number
  absent: number
  percentage: number
}

export interface Activity {
  id: string
  type: 'student' | 'attendance' | 'assessment' | 'character' | 'system'
  title: string
  description: string
  timestamp: Timestamp
  user?: string
}

// ============================================
// STUDENT LIST TYPES
// ============================================

export interface StudentWithClass extends Student {
  student_classes: (StudentClass & {
    classes: Class & {
      grades: Grade
      majors: Major
    }
  })[]
  parents?: Parent[]
}

export interface StudentFilters {
  search?: string
  is_active?: boolean
  gender?: Student['gender']
  class_id?: UUID
  major_id?: UUID
  grade_id?: UUID
  academic_year_id?: UUID
}

export interface StudentSortOptions {
  field: 'full_name' | 'student_number' | 'created_at' | 'enrollment_year'
  direction: 'asc' | 'desc'
}
