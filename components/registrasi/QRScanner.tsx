"use client"

import { useState } from "react"
import { Smartphone, Shield, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  onClose?: () => void
  className?: string
}

/**
 * Manual Code Input Component
 *
 * Input kode registrasi secara manual.
 * Lebih reliable untuk semua device dan browser.
 */
export function QRScanner({ onScan, onClose, className }: QRScannerProps) {
  const [manualInput, setManualInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualInput.trim()) {
      setError("Kode registrasi wajib diisi")
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 300))

    // Pass the code to onScan
    setSuccess(true)
    setIsLoading(false)

    // Small delay before calling onScan
    setTimeout(() => {
      onScan(manualInput.trim())
    }, 500)
  }

  if (success) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-sm text-green-600 font-medium">Kode diterima!</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-[var(--primary)]" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Masukkan Kode Manual
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          Masukkan kode registrasi yang diberikan sekolah
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => {
              setManualInput(e.target.value.toUpperCase())
              if (error) setError(null)
            }}
            placeholder="Contoh: TWOSRAKU2024"
            className={cn(
              "w-full px-4 py-4",
              "bg-[var(--surface-primary)]",
              "border-2",
              "rounded-2xl",
              "text-center text-lg font-mono font-medium",
              "text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:border-[var(--primary)]",
              "focus:shadow-[0_0_0_4px_rgba(79,124,255,0.15)]",
              "transition-all duration-200",
              error && "border-red-400 focus:border-red-500 focus:shadow-red-100"
            )}
            autoFocus
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
          />
          {error && (
            <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !manualInput.trim()}
          className={cn(
            "w-full py-4 rounded-2xl",
            "text-base font-semibold",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            isLoading || !manualInput.trim()
              ? "bg-[var(--primary)]/50 text-white/70 cursor-not-allowed"
              : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verifikasi Kode
            </>
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
        <p className="text-xs text-amber-700 text-center">
          💡 <strong>Tips:</strong> Kode registrasi biasanya berupa kombinasi huruf dan angka yang diberikan oleh admin sekolah.
        </p>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] text-center"
        >
          Batal
        </button>
      )}
    </div>
  )
}

export default QRScanner
