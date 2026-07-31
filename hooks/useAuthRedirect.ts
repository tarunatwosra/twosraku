"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

/**
 * Saves the current URL to sessionStorage and redirects to login.
 * This ensures that after successful login, the user is redirected back
 * to the page they were trying to access.
 */
export function redirectToLogin(router: ReturnType<typeof useRouter>, redirectUrl?: string) {
  const currentPath = redirectUrl || (typeof window !== "undefined" ? window.location.pathname : "/")

  // Only save redirect URL if not already on login page
  if (currentPath !== "/login") {
    sessionStorage.setItem("redirectUrl", currentPath)
  }

  router.push("/login")
}

/**
 * Hook that handles authentication check with redirect URL saving.
 * Use this instead of manually checking auth and pushing to login.
 *
 * @param options.redirectToLoginPath - Custom redirect path (default: "/login")
 * @param options.onAuthenticated - Callback when user is authenticated
 */
export function useAuthRedirect(options?: { redirectToLoginPath?: string }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const loginPath = options?.redirectToLoginPath || "/login"

  const redirectToLoginWithSave = (customPath?: string) => {
    const currentPath = customPath || (typeof window !== "undefined" ? window.location.pathname : "/")

    if (currentPath !== loginPath) {
      sessionStorage.setItem("redirectUrl", currentPath)
    }

    router.push(loginPath)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToLoginWithSave()
    }
  }, [isAuthenticated, isLoading, router, loginPath])

  return {
    isAuthenticated,
    isLoading,
    redirectToLogin: redirectToLoginWithSave,
  }
}

/**
 * Gets the stored redirect URL from sessionStorage.
 * Returns null if no URL is stored or if on login page.
 */
export function getStoredRedirectUrl(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem("redirectUrl")
}

/**
 * Clears the stored redirect URL from sessionStorage.
 */
export function clearStoredRedirectUrl(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("redirectUrl")
  }
}
