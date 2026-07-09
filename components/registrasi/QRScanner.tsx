"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Camera, X, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  onClose?: () => void
  className?: string
}

// Generate unique ID for this instance
const generateId = () => `qr-reader-${Math.random().toString(36).substr(2, 9)}`

/**
 * QR Scanner Component
 *
 * Menggunakan kamera device untuk scan QR code.
 * Menggunakan library html5-qrcode yang lightweight.
 */
export function QRScanner({ onScan, onError, onClose, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [qrReaderId] = useState(generateId)
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<unknown>(null)

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        const html5QrCode = html5QrCodeRef.current as {
          stop: () => Promise<void>
        }
        await html5QrCode.stop()
      } catch (err) {
        // Ignore stop errors
      }
      html5QrCodeRef.current = null
    }
    setIsScanning(false)
  }, [])

  const startScanning = useCallback(async () => {
    setError(null)

    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100))

    const element = document.getElementById(qrReaderId)
    if (!element) {
      console.warn("QR reader element not found yet, waiting...")
      // Try again after a short delay
      setTimeout(() => startScanning(), 200)
      return
    }

    try {
      // Dynamically import html5-qrcode
      const { Html5Qrcode } = await import("html5-qrcode")

      const html5QrCode = new Html5Qrcode(qrReaderId)
      html5QrCodeRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      }

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Success callback
          stopScanning()
          onScan(decodedText)
        },
        () => {
          // Error callback - ignore scan failures (they're normal)
        }
      )

      setIsScanning(true)
    } catch (err) {
      console.error("QR Scanner Error:", err)
      const errorMessage =
        err instanceof Error ? err.message : "Tidak dapat mengakses kamera"

      // Check if it's a camera permission issue
      if (
        errorMessage.includes("Permission") ||
        errorMessage.includes("NotAllowed")
      ) {
        setError("Izin kamera diperlukan. Silakan aktifkan kamera di pengaturan browser.")
      } else if (
        errorMessage.includes("NotFound") ||
        errorMessage.includes("no cameras")
      ) {
        setHasCamera(false)
        setError("Kamera tidak ditemukan di perangkat ini.")
        setShowManualInput(true)
      } else {
        setError(errorMessage)
      }

      onError?.(errorMessage)
    }
  }, [qrReaderId, onScan, onError, stopScanning])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  // Auto-start scanning when component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanning()
    }, 300)

    return () => clearTimeout(timer)
  }, [startScanning])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Scanner Container */}
      <div
        ref={scannerRef}
        className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-4"
      >
        {/* Camera View */}
        {isScanning && (
          <>
            {/* QR Reader element - must have the specific ID */}
            <div
              id={qrReaderId}
              className="w-full h-full"
              style={{ minHeight: "200px" }}
            />

            {/* Overlay with viewfinder */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Clear viewfinder area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primary)] rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--primary)] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--primary)] rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primary)] rounded-br-lg" />

                  {/* Scanning line animation */}
                  <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-scan" />
                </div>
              </div>
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={() => {
                  stopScanning()
                  onClose()
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* Loading State */}
        {!isScanning && !error && !showManualInput && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface-secondary)]">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Memulai kamera...</p>
          </div>
        )}

        {/* Error State */}
        {error && !showManualInput && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface-secondary)] p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-[var(--text-primary)] text-center mb-4">{error}</p>
            <button
              onClick={() => startScanning()}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Instruction Text */}
      {!error && isScanning && (
        <p className="text-sm text-[var(--text-muted)] text-center mb-4">
          Arahkan QR code ke kotak pandang
        </p>
      )}

      {/* Manual Input Toggle */}
      {!showManualInput && hasCamera && (
        <button
          onClick={() => {
            stopScanning()
            setShowManualInput(true)
          }}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Tidak bisa scan? Masukkan kode manual
        </button>
      )}

      {/* Manual Input Form */}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Masukkan kode registrasi"
              className={cn(
                "flex-1 px-4 py-3",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-default)]",
                "rounded-xl",
                "text-[15px] text-[var(--text-primary)]",
                "focus:outline-none focus:border-[var(--border-focus)]",
                "focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]"
              )}
              autoFocus
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                "bg-[var(--primary)] text-white",
                "hover:bg-[var(--primary)]/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Submit
            </button>
          </div>
          {hasCamera && (
            <button
              type="button"
              onClick={() => {
                setShowManualInput(false)
                setTimeout(() => startScanning(), 100)
              }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-3"
            >
              ← Kembali ke scan QR
            </button>
          )}
        </form>
      )}
    </div>
  )
}

export default QRScanner
