// Authentication Types

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'homeroom_teacher'
  | 'staff'
  | 'guest'

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  status: UserStatus
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending'

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
  errorCode?: LoginErrorCode
}

export type LoginErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_PENDING'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface Session {
  id: string
  userId: string
  device: string
  browser: string
  os: string
  ipAddress: string
  location?: string
  loginTime: string
  lastActivity: string
  expiresAt: string
  isCurrent: boolean
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecialChar: boolean
  maxFailedAttempts: number
  lockoutDuration: number // in minutes
}

// Permission types
export interface Permission {
  module: string
  actions: PermissionAction[]
}

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'import'
  | 'export'
  | 'print'
  | 'settings'
  | 'audit'

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
}

// Login history
export interface LoginHistory {
  id: string
  userId: string
  date: string
  time: string
  device: string
  browser: string
  ipAddress: string
  result: 'success' | 'failed'
  failureReason?: string
}

// Password change
export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Password reset
export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetResponse {
  success: boolean
  message: string
}
