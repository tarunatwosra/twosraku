"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { User, AuthState, LoginCredentials, LoginResponse, LoginErrorCode } from "@/types/auth"

// Auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Action types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: Partial<User> }

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>
  logout: () => Promise<void>
  clearError: () => void
  updateUser: (data: Partial<User>) => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Storage keys
const AUTH_STORAGE_KEY = "twosraku_auth"
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

// Demo user for development
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      email: "admin@smkn2sragen.sch.id",
      name: "Administrator",
      role: "admin",
      status: "active",
      avatar: undefined,
      lastLogin: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
  },
  kepala_sekolah: {
    password: "kepala123",
    user: {
      id: "2",
      username: "kepala_sekolah",
      email: "kepala@smkn2sragen.sch.id",
      name: "Dr. Budi Santoso",
      role: "principal",
      status: "active",
      avatar: undefined,
      lastLogin: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
  },
  guru: {
    password: "guru123",
    user: {
      id: "3",
      username: "guru",
      email: "guru@smkn2sragen.sch.id",
      name: "Siti Rahayu, S.Pd.",
      role: "teacher",
      status: "active",
      avatar: undefined,
      lastLogin: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
  },
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          const { user, timestamp } = JSON.parse(stored)

          // Check session expiration
          if (Date.now() - timestamp > SESSION_TIMEOUT) {
            localStorage.removeItem(AUTH_STORAGE_KEY)
            dispatch({ type: "AUTH_LOGOUT" })
          } else {
            dispatch({ type: "AUTH_SUCCESS", payload: user })
          }
        } else {
          dispatch({ type: "AUTH_LOGOUT" })
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        dispatch({ type: "AUTH_LOGOUT" })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    dispatch({ type: "AUTH_START" })

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Demo authentication - check against demo users
      const demoUser = DEMO_USERS[credentials.username.toLowerCase()]

      if (!demoUser || demoUser.password !== credentials.password) {
        const errorCode: LoginErrorCode = "INVALID_CREDENTIALS"
        dispatch({
          type: "AUTH_FAILURE",
          payload: "Username atau password yang Anda masukkan salah.",
        })
        return {
          success: false,
          error: "Username atau password yang Anda masukkan salah.",
          errorCode,
        }
      }

      // Check if account is active
      if (demoUser.user.status !== "active") {
        const errorCode: LoginErrorCode =
          demoUser.user.status === "locked"
            ? "ACCOUNT_LOCKED"
            : demoUser.user.status === "pending"
              ? "ACCOUNT_PENDING"
              : "ACCOUNT_INACTIVE"

        const errorMessages: Record<LoginErrorCode, string> = {
          ACCOUNT_LOCKED: "Akun Anda terkunci. Hubungi administrator.",
          ACCOUNT_PENDING: "Akun Anda belum diaktifkan.",
          ACCOUNT_INACTIVE: "Akun Anda tidak aktif.",
          INVALID_CREDENTIALS: "",
          SESSION_EXPIRED: "",
          NETWORK_ERROR: "",
          UNKNOWN_ERROR: "",
        }

        dispatch({
          type: "AUTH_FAILURE",
          payload: errorMessages[errorCode],
        })
        return {
          success: false,
          error: errorMessages[errorCode],
          errorCode,
        }
      }

      // Update last login
      const updatedUser: User = {
        ...demoUser.user,
        lastLogin: new Date().toISOString(),
      }

      // Store in localStorage
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: updatedUser,
          timestamp: Date.now(),
        })
      )

      dispatch({ type: "AUTH_SUCCESS", payload: updatedUser })

      return {
        success: true,
        user: updatedUser,
        token: "demo_token_" + Date.now(),
      }
    } catch (error) {
      console.error("Login error:", error)
      dispatch({
        type: "AUTH_FAILURE",
        payload: "Terjadi kesalahan. Silakan coba lagi.",
      })
      return {
        success: false,
        error: "Terjadi kesalahan. Silakan coba lagi.",
        errorCode: "UNKNOWN_ERROR",
      }
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    dispatch({ type: "AUTH_START" })

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Clear storage
      localStorage.removeItem(AUTH_STORAGE_KEY)

      dispatch({ type: "AUTH_LOGOUT" })
    } catch (error) {
      console.error("Logout error:", error)
      // Still logout even on error
      localStorage.removeItem(AUTH_STORAGE_KEY)
      dispatch({ type: "AUTH_LOGOUT" })
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // Update user data
  const updateUser = (data: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: data })

    // Update localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.user = { ...parsed.user, ...data }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed))
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-secondary)]">Memuat...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return null
    }

    return <WrappedComponent {...props} />
  }
}
