"use client"

import { useState, useRef, useEffect } from "react"
import { X, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  onClose?: () => void
  className?: string
}

// Static ID untuk avoid multiple instances
const QR_READER_ID = "qr-reader-main"

interface Html5Qrcode {
  start: (
    cameraId: { facingMode: string },
    config: { fps: number; qrbox: { width: number; height: number } },
    onScanSuccess: (decodedText: string) => void,
    onScanFailure: () => void
  ) => Promise<void>
  stop: () => Promise<void>
  clear: () => void
}

declare global {
  interface Window {
    Html5Qrcode: new (elementId: string) => Html5Qrcode
  }
}

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
  const [isLoading, setIsLoading] = useState(true)

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isActiveRef = useRef(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function
  const cleanup = async () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    if (scannerRef.current && isActiveRef.current) {
      try {
        isActiveRef.current = false
        await scannerRef.current.stop()
      } catch {
        // Ignore stop errors
      }
      try {
        scannerRef.current.clear()
      } catch {
        // Ignore clear errors
      }
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  // Initialize scanner
  const initScanner = async () => {
    // Clean up any existing scanner
    await cleanup()
    setIsLoading(true)
    setError(null)

    try {
      // Load html5-qrcode script dynamically
      if (!window.Html5Qrcode) {
        await loadHtml5Qrcode()
      }

      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 200))

      // Check if element exists
      const element = document.getElementById(QR_READER_ID)
      if (!element) {
        console.error("QR reader element not found")
        setError("Elemen scanner tidak ditemukan")
        setHasCamera(false)
        setShowManualInput(true)
        setIsLoading(false)
        return
      }

      // Create scanner instance
      const html5QrCode = new window.Html5Qrcode(QR_READER_ID)
      scannerRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      }

      // Start scanner
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          if (!isActiveRef.current) return
          cleanup()
          onScan(decodedText)
        },
        () => {
          // Scan failure - ignore, keep scanning
        }
      )

      isActiveRef.current = true
      setIsScanning(true)
      setIsLoading(false)
      setHasCamera(true)
    } catch (err) {
      console.error("QR Scanner initialization error:", err)
      setIsLoading(false)

      const errorMsg = err instanceof Error ? err.message : "Tidak dapat mengakses kamera"

      // Check error type
      if (
        errorMsg.includes("Permission") ||
        errorMsg.includes("NotAllowed") ||
        errorMsg.includes("permission") ||
        errorMsg.includes("Not permitted")
      ) {
        setError("Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.")
      } else if (
        errorMsg.includes("NotFound") ||
        errorMsg.includes("no cameras") ||
        errorMsg.includes("camera")
      ) {
        setHasCamera(false)
        setError("Kamera tidak ditemukan di perangkat ini.")
        setShowManualInput(true)
      } else if (
        errorMsg.includes("element") ||
        errorMsg.includes("undefined")
      ) {
        // Element not ready, retry after delay
        retryTimeoutRef.current = setTimeout(() => {
          initScanner()
        }, 500)
        return
      } else {
        setError(errorMsg)
        setHasCamera(false)
        setShowManualInput(true)
      }

      onError?.(errorMsg)
    }
  }

  // Load html5-qrcode script
  const loadHtml5Qrcode = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Html5Qrcode) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Gagal memuat library QR scanner"))
      document.body.appendChild(script)
    })
  }

  // Start scanner on mount
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const startTimeout = setTimeout(() => {
      initScanner()
    }, 300)

    return () => {
      clearTimeout(startTimeout)
      cleanup()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
    }
  }

  const handleRetry = async () => {
    setShowManualInput(false)
    setError(null)
    setHasCamera(true)
    await cleanup()
    setTimeout(() => initScanner(), 100)
  }

  const handleClose = async () => {
    await cleanup()
    onClose?.()
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Scanner Container */}
      <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-4">
        {/* QR Reader element - always rendered, hidden when not scanning */}
        <div
          id={QR_READER_ID}
          className={cn(
            "w-full h-full",
            !isScanning && "hidden"
          )}
          style={{ minHeight: "200px" }}
        />

        {/* Camera View Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark overlay with clear center */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                {/* Clear area in center */}
                <div className="absolute inset-4 bg-transparent" />

                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primary)] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--primary)] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--primary)] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primary)] rounded-br-lg" />

                {/* Scanning line animation */}
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-scan" />
              </div>
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && !showManualInput && (
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
              onClick={handleRetry}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Instruction Text */}
      {isScanning && !error && (
        <p className="text-sm text-[var(--text-muted)] text-center mb-4">
          Arahkan QR code ke kotak pandang
        </p>
      )}

      {/* Manual Input Toggle */}
      {!showManualInput && hasCamera && !isLoading && (
        <button
          onClick={() => {
            cleanup()
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
              onClick={handleRetry}
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
