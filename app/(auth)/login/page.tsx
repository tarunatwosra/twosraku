"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Loader2,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading, error, clearError } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearError()
      setValidationErrors({})
    }
  }, [username, password])

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!username.trim()) {
      errors.username = "Username wajib diisi"
    }

    if (!password) {
      errors.password = "Password wajib diisi"
    } else if (password.length < 6) {
      errors.password = "Password minimal 6 karakter"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    clearError()

    try {
      const result = await login({
        username: username.trim(),
        password,
        rememberMe,
      })

      if (result.success) {
        router.push("/")
      } else {
        setValidationErrors({ general: result.error || "Login gagal" })
      }
    } catch (err) {
      setValidationErrors({ general: "Terjadi kesalahan. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = (role: "admin" | "guru" | "kepala") => {
    clearError()
    setValidationErrors({})
    switch (role) {
      case "admin":
        setUsername("admin")
        setPassword("admin123")
        break
      case "guru":
        setUsername("guru")
        setPassword("guru123")
        break
      case "kepala":
        setUsername("kepala_sekolah")
        setPassword("kepala123")
        break
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)] mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Twosraku
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Sistem Manajemen SMKN 2 Sragen
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 text-center">
          Masuk ke Akun Anda
        </h2>

        {/* Error Alert */}
        {validationErrors.general && (
          <div className="mb-4 p-3 bg-[var(--danger-soft)] border border-[var(--danger)] rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--danger)]">
              {validationErrors.general}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <User className="w-4 h-4" />
              </div>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "pl-10",
                  validationErrors.username && "border-[var(--danger)] focus:border-[var(--danger)]"
                )}
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>
            {validationErrors.username && (
              <p className="text-xs text-[var(--danger)]">
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "pl-10 pr-10",
                  validationErrors.password && "border-[var(--danger)] focus:border-[var(--danger)]"
                )}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-xs text-[var(--danger)]">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Ingat saya
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memasuki...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-center text-[var(--text-muted)] mb-3">
            Demo Account - Klik untuk mengisi otomatis
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("guru")}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[var(--success-soft)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white transition-colors"
            >
              Guru
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("kepala")}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[var(--warning-soft)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-white transition-colors"
            >
              Kepala
            </button>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <p className="text-xs text-center text-[var(--text-muted)] mt-6">
        &copy; {new Date().getFullYear()} SMKN 2 Sragen. Hak cipta dilindungi.
      </p>
    </div>
  )
}
