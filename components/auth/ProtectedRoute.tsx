"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackUrl = "/login",
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current URL for redirect after login
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectUrl", pathname)
    }
    router.push(fallbackUrl)
    return null
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    router.push("/")
    return null
  }

  return <>{children}</>
}

// Component to protect entire app layouts
export function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted (avoid hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  // For authenticated layouts, children will be rendered
  // The actual auth check happens in ProtectedRoute or per-page
  return <>{children}</>
}

// Hook for checking permission
export function usePermission(requiredRoles?: UserRole[]) {
  const { user, isAuthenticated } = useAuth()

  const hasPermission = () => {
    if (!isAuthenticated || !user) return false
    if (!requiredRoles || requiredRoles.length === 0) return true
    return requiredRoles.includes(user.role)
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const isPrincipal = user?.role === "principal"
  const isTeacher = user?.role === "teacher" || user?.role === "homeroom_teacher"
  const isStaff = user?.role === "staff"

  return {
    hasPermission: hasPermission(),
    isAdmin,
    isPrincipal,
    isTeacher,
    isStaff,
    canCreate: isAdmin || isPrincipal || isTeacher,
    canEdit: isAdmin || isPrincipal || isTeacher,
    canDelete: isAdmin,
    canApprove: isAdmin || isPrincipal,
    canImport: isAdmin || isStaff,
    canExport: isAdmin || isStaff || isPrincipal || isTeacher,
    canViewReports: isAdmin || isPrincipal || isTeacher,
    canManageSettings: isAdmin,
  }
}

// Component for conditionally rendering based on permission
interface PermissionGateProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  fallback?: ReactNode
  showFallback?: boolean
}

export function PermissionGate({
  children,
  requiredRoles,
  fallback = null,
  showFallback = true,
}: PermissionGateProps) {
  const { hasPermission } = usePermission(requiredRoles)

  if (hasPermission) {
    return <>{children}</>
  }

  if (showFallback) {
    return <>{fallback}</>
  }

  return null
}
