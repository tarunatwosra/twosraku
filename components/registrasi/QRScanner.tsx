"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  onClose?: () => void
  className?: string
}

const QR_READER_ID = "qr-reader-main"

interface Html5QrcodeScanner {
  start: (
    cameraIdOrConfig: { facingMode?: string; deviceId?: string } | string,
    config: { fps: number; qrbox?: { width: number; height: number } },
    onScanSuccess: (decodedText: string) => void,
    onScanFailure: (error: string) => void
  ) => Promise<void>
  stop: () => Promise<void>
  clear: () => void
}

declare global {
  interface Window {
    Html5Qrcode?: new (elementId: string) => Html5QrcodeScanner
    html5QrcodeScanner?: Html5QrcodeScanner
  }
}

/**
 * QR Scanner Component - Mobile Optimized
 *
 * Menggunakan html5-qrcode untuk scan QR code.
 * Dioptimalkan untuk Samsung Browser dan browser mobile lainnya.
 */
export function QRScanner({ onScan, onError, onClose, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const isActiveRef = useRef(false)

  // Load html5-qrcode script
  const loadScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Html5Qrcode || window.html5QrcodeScanner) {
        setIsScriptLoaded(true)
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
      script.async = true
      script.onload = () => {
        console.log("html5-qrcode script loaded")
        setIsScriptLoaded(true)
        resolve()
      }
      script.onerror = () => {
        reject(new Error("Gagal memuat library QR scanner"))
      }
      document.body.appendChild(script)
    })
  }, [])

  // Cleanup scanner
  const cleanup = useCallback(async () => {
    if (scannerRef.current && isActiveRef.current) {
      try {
        isActiveRef.current = false
        await scannerRef.current.stop()
      } catch (e) {
        console.warn("Error stopping scanner:", e)
      }
      try {
        scannerRef.current.clear()
      } catch (e) {
        console.warn("Error clearing scanner:", e)
      }
      scannerRef.current = null
    }
    setIsScanning(false)
  }, [])

  // Start scanner with different camera configs
  const startScanner = useCallback(async () => {
    await cleanup()
    setIsLoading(true)
    setError(null)

    try {
      // Load script if not loaded
      if (!isScriptLoaded) {
        await loadScript()
      }

      // Wait for DOM
      await new Promise(resolve => setTimeout(resolve, 300))

      const element = document.getElementById(QR_READER_ID)
      if (!element) {
        throw new Error("Elemen scanner tidak ditemukan")
      }

      // Create scanner - try new API first, fall back to old
      let scanner: Html5QrcodeScanner

      if (window.html5QrcodeScanner) {
        scanner = window.html5QrcodeScanner
      } else if (window.Html5Qrcode) {
        scanner = new window.Html5Qrcode(QR_READER_ID)
      } else {
        throw new Error("Library QR scanner belum dimuat")
      }

      scannerRef.current = scanner

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      }

      // Try different camera configurations for mobile compatibility
      let cameraConfig = { facingMode: "environment" }

      console.log("Starting QR scanner with config:", cameraConfig)

      await scanner.start(
        cameraConfig,
        config,
        (decodedText: string) => {
          console.log("QR Code scanned:", decodedText)
          if (!isActiveRef.current) return
          cleanup()
          onScan(decodedText)
        },
        (errorMessage: string) => {
          // Scan failure is normal, ignore
          // Only log in development
          if (process.env.NODE_ENV === "development") {
            // Silent - this is called frequently
          }
        }
      )

      isActiveRef.current = true
      setIsScanning(true)
      setIsLoading(false)
      setHasCamera(true)
      console.log("QR scanner started successfully")

    } catch (err) {
      console.error("QR Scanner error:", err)
      setIsLoading(false)

      const errorMsg = err instanceof Error ? err.message : "Tidak dapat mengakses kamera"
      console.error("Error details:", errorMsg)

      // Parse error more carefully
      let finalError = errorMsg

      if (
        errorMsg.includes("Permission") ||
        errorMsg.includes("NotAllowed") ||
        errorMsg.includes("permission_denied") ||
        errorMsg.includes("Not permitted")
      ) {
        finalError = "Izin kamera ditolak. Pastikan kamu sudah mengizinkan akses kamera."
      } else if (
        errorMsg.includes("NotFound") ||
        errorMsg.includes("not found") ||
        errorMsg.includes("no cameras") ||
        errorMsg.includes("camera not found")
      ) {
        setHasCamera(false)
        finalError = "Kamera tidak ditemukan di perangkat ini."
        setShowManualInput(true)
      } else if (
        errorMsg.includes("NotReadable") ||
        errorMsg.includes("not readable") ||
        errorMsg.includes("in use")
      ) {
        finalError = "Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain yang menggunakan kamera."
      } else if (
        errorMsg.includes("OverconstrainedError") ||
        errorMsg.includes("constraint")
      ) {
        finalError = "Konfigurasi kamera tidak didukung. Mencoba alternatif..."
        // Try without facingMode constraint
        setTimeout(() => retryWithFallback(), 1000)
        return
      }

      setError(finalError)
      onError?.(finalError)
    }
  }, [cleanup, loadScript, onScan, onError, isScriptLoaded])

  // Retry with fallback camera config
  const retryWithFallback = useCallback(async () => {
    if (!scannerRef.current) return

    try {
      setError("Mencoba kamera lain...")
      const config = { fps: 10, qrbox: { width: 250, height: 250 } }

      // Try without facingMode constraint
      await scannerRef.current.start(
        {}, // No constraints - let browser choose
        config,
        (decodedText: string) => {
          if (!isActiveRef.current) return
          cleanup()
          onScan(decodedText)
        },
        () => {}
      )

      isActiveRef.current = true
      setIsScanning(true)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error("Fallback camera also failed:", err)
      setError("Tidak dapat mengakses kamera. Gunakan input manual.")
      setShowManualInput(true)
      setIsLoading(false)
    }
  }, [cleanup, onScan])

  // Retry handler
  const handleRetry = useCallback(async () => {
    setShowManualInput(false)
    setError(null)
    setHasCamera(true)
    await cleanup()
    setTimeout(() => startScanner(), 100)
  }, [cleanup, startScanner])

  // Load script and start on mount
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        await loadScript()
        if (mounted) {
          // Wait a bit for everything to settle
          setTimeout(() => {
            if (mounted) {
              startScanner()
            }
          }, 500)
        }
      } catch (err) {
        console.error("Failed to load script:", err)
        if (mounted) {
          setError("Gagal memuat library scanner")
        }
      }
    }

    init()

    return () => {
      mounted = false
      cleanup()
    }
  }, [loadScript, startScanner, cleanup])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
    }
  }

  const handleClose = async () => {
    await cleanup()
    onClose?.()
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Scanner Container */}
      <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-4">
        {/* QR Reader element */}
        <div
          id={QR_READER_ID}
          className={cn(
            "w-full h-full",
            !isScanning && "hidden"
          )}
        />

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />

                {/* Animated scan line */}
                <div className="absolute left-4 right-4 h-0.5 bg-white/80 animate-scan" />
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
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface-secondary)]">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)] mb-3" />
            <p className="text-sm text-[var(--text-muted)] text-center px-4">
              Memulai kamera...
            </p>
            <p className="text-xs text-[var(--text-muted)] text-center px-4 mt-1">
              Pastikan izinkan akses kamera
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !showManualInput && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface-secondary)] p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-[var(--text-primary)] text-center mb-4">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Instruction */}
      {isScanning && !error && (
        <p className="text-sm text-[var(--text-muted)] text-center mb-4">
          Arahkan QR code ke kotak pandang
        </p>
      )}

      {/* Manual Input Link */}
      {!showManualInput && hasCamera && !isLoading && (
        <button
          onClick={() => {
            cleanup()
            setShowManualInput(true)
          }}
          className="text-sm text-[var(--primary)] hover:underline text-center"
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
                "focus:outline-none focus:border-[var(--border-focus)]"
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
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-3 w-full text-center"
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
