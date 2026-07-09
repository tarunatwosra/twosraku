"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Input } from "@/components/ui"
import {
  ArrowLeft,
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { verifyStudent, saveRegistrationSession } from "@/lib/registrasi"
import type { Student } from "@/types/database"
import { cn } from "@/lib/utils"

type VerifyStatus = "idle" | "loading" | "success" | "not_found" | "invalid_date" | "already_completed" | "error"

export default function VerifyPage() {
  const router = useRouter()
  const [nis, setNis] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [status, setStatus] = useState<VerifyStatus>("idle")
  const [message, setMessage] = useState("")
  const [student, setStudent] = useState<Student | null>(null)
  const [canReupload, setCanReupload] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nis.trim()) {
      setStatus("error")
      setMessage("NIS wajib diisi")
      return
    }

    if (!birthDate) {
      setStatus("error")
      setMessage("Tanggal lahir wajib diisi")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const result = await verifyStudent(nis.trim(), birthDate)

      switch (result.status) {
        case "success":
          setStatus("success")
          setMessage("Verifikasi berhasil! Silakan lengkapi data dirimu.")
          setStudent(result.student || null)
          setCanReupload(false)

          // Save session
          if (result.student) {
            saveRegistrationSession({
              studentId: result.student.id,
              studentNumber: result.student.student_number,
              verifiedAt: new Date().toISOString(),
              currentStep: "personal" as any,
              formData: {},
            })
          }
          break

        case "already_completed":
          setStatus("already_completed")
          setMessage("Kamu sudah mengisi data sebelumnya. Kamu bisa memperbarui datamu.")
          setStudent(result.student || null)
          setCanReupload(result.canReupload || false)

          if (result.student) {
            saveRegistrationSession({
              studentId: result.student.id,
              studentNumber: result.student.student_number,
              verifiedAt: new Date().toISOString(),
              currentStep: "personal" as any,
              formData: {},
            })
          }
          break

        case "not_found":
          setStatus("not_found")
          setMessage(result.message)
          setStudent(null)
          break

        case "invalid_date":
          setStatus("invalid_date")
          setMessage(result.message)
          setStudent(null)
          break

        default:
          setStatus("error")
          setMessage(result.message)
          setStudent(null)
      }
    } catch (err) {
      setStatus("error")
      setMessage("Terjadi kesalahan saat verifikasi. Silakan coba lagi.")
    }
  }

  function handleContinue() {
    if (student) {
      router.push(`/registrasi/form?studentId=${student.id}`)
    }
  }

  function handleRetry() {
    setStatus("idle")
    setMessage("")
    setStudent(null)
    setNis("")
    setBirthDate("")
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back Button */}
      <Link
        href="/registrasi"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-[var(--primary)]/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors",
            status === "success" || status === "already_completed"
              ? "bg-green-100"
              : status === "not_found" || status === "invalid_date"
              ? "bg-red-100"
              : "bg-[var(--primary)]/10"
          )}>
            {status === "loading" ? (
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : status === "already_completed" ? (
              <RefreshCw className="w-8 h-8 text-amber-600" />
            ) : status === "not_found" || status === "invalid_date" ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : status === "error" ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Shield className="w-8 h-8 text-[var(--primary)]" />
            )}
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Verifikasi Identitas
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Masukkan NIS dan tanggal lahir untuk melanjutkan
          </p>
        </div>

        {/* Status Messages */}
        {message && status !== "idle" && status !== "loading" && (
          <div className={cn(
            "mb-6 p-4 rounded-2xl flex items-start gap-3",
            status === "success" ? "bg-green-50 border border-green-200" :
            status === "already_completed" ? "bg-amber-50 border border-amber-200" :
            status === "not_found" || status === "invalid_date" || status === "error"
              ? "bg-red-50 border border-red-200"
              : "bg-[var(--surface-secondary)] border border-[var(--border-light)]"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              status === "success" ? "bg-green-100" :
              status === "already_completed" ? "bg-amber-100" :
              "bg-red-100"
            )}>
              {status === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : status === "already_completed" ? (
                <RefreshCw className="w-4 h-4 text-amber-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className={cn(
              "text-sm flex-1",
              status === "success" ? "text-green-700" :
              status === "already_completed" ? "text-amber-700" :
              "text-red-700"
            )}>
              {message}
            </p>
          </div>
        )}

        {/* Form */}
        {status !== "success" && status !== "already_completed" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nomor Induk Siswa (NIS)"
              placeholder="Contoh: 2024001"
              value={nis}
              onChange={(e) => {
                setNis(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              error={status === "error" && !nis.trim() ? "NIS wajib diisi" : undefined}
              disabled={status === "loading"}
              maxLength={20}
            />

            <Input
              label="Tanggal Lahir"
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              error={status === "error" && !birthDate ? "Tanggal lahir wajib diisi" : undefined}
              disabled={status === "loading"}
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Verifikasi
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Success / Already Completed Actions */}
        {(status === "success" || status === "already_completed") && student && (
          <div className="space-y-4">
            {/* Student Info */}
            <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                  {student.full_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] truncate">
                    {student.full_name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    NIS: {student.student_number}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleContinue}
            >
              {status === "already_completed" ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Perbarui Data
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Lanjutkan Pengisian Data
                </>
              )}
            </Button>

            {status === "already_completed" && (
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={handleRetry}
              >
                <ArrowLeft className="w-5 h-5" />
                Batal & Kembali
              </Button>
            )}
          </div>
        )}

        {/* Retry Button for Error States */}
        {(status === "not_found" || status === "invalid_date" || status === "error") && (
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-4"
            onClick={handleRetry}
          >
            <RefreshCw className="w-5 h-5" />
            Coba Lagi
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Tips:</strong> Jika kamu lupa NIS atau tanggal lahir, silakan hubungi
          admin sekolah untuk bantuan.
        </p>
      </div>
    </div>
  )
}
