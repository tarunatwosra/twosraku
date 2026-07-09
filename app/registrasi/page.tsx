"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/registrasi/QRScanner"
import { Button } from "@/components/ui"
import {
  QrCode,
  Smartphone,
  Shield,
  Clock,
  ChevronRight,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  getRegistrationSettings,
  incrementAccessCount,
  getRegistrationSession,
  isSessionValid,
} from "@/lib/registrasi"

export default function RegistrationPage() {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if registration is enabled and handle existing session
  useEffect(() => {
    checkRegistration()
  }, [])

  async function checkRegistration() {
    try {
      // Increment access count
      await incrementAccessCount()

      // Check settings
      const settings = await getRegistrationSettings()
      console.log("Registration settings:", settings)
      setIsEnabled(settings.isEnabled)

      // Check for existing valid session
      const hasValidSession = isSessionValid()
      if (hasValidSession) {
        const session = getRegistrationSession()
        if (session?.studentId) {
          // Has valid session, redirect to form
          router.replace(`/registrasi/form?studentId=${session.studentId}`)
          return
        }
      }
    } catch (err) {
      console.error("Error checking registration:", err)
      setError("Terjadi kesalahan saat memuat halaman")
    } finally {
      setIsLoading(false)
    }
  }

  function handleQRScan(data: string) {
    // Check if scanned data is valid registration URL
    if (data.includes("/registrasi")) {
      setScanSuccess(true)
      // Navigate to verification
      setTimeout(() => {
        router.push("/registrasi/verify")
      }, 500)
    } else {
      // Assume it's a direct link to verify page
      if (data.includes("/verify")) {
        setScanSuccess(true)
        setTimeout(() => {
          router.push(data)
        }, 500)
      } else {
        // Just go to verify page
        setScanSuccess(true)
        setTimeout(() => {
          router.push("/registrasi/verify")
        }, 500)
      }
    }
  }

  function handleManualEntry() {
    router.push("/registrasi/verify")
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Memuat...
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Menghubungi server...
          </p>
        </div>
      </div>
    )
  }

  // Show error if any
  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {error}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  // Registration is disabled
  if (isEnabled === false) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[var(--primary)]/10 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Registrasi Ditutup
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
           Maaf, halaman registrasi sementara tidak tersedia. Silakan hubungi admin sekolah untuk informasi lebih lanjut.
          </p>
          <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <p className="text-sm text-[var(--text-muted)]">
              💡 <strong>Catatan:</strong> Hubungi admin sekolah jika kamu merasa ini adalah kesalahan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show QR Scanner
  if (showScanner) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => setShowScanner(false)}
          className="mb-6 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Scan QR Code
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Arahkan kamera ke QR code yang diberikan sekolah
            </p>
          </div>

          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />

          {scanSuccess && (
            <div className="mt-4 p-4 bg-green-50 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">
                Berhasil! Mengalihkan...
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default: Welcome page
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[var(--primary)]/10 mb-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--primary)]/30">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Registrasi Siswa Baru
          </h1>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Halo! Selamat datang di halaman registrasi mandiri. Silakan lengkapi data dirimu
            dengan mengikuti langkah-langkah di bawah ini.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Scan QR Code</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Scan QR code yang diberikan sekolah dengan kamera HP kamu
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Verifikasi Identitas</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Masukkan NIS dan tanggal lahir untuk verifikasi
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[var(--surface-secondary)] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">Isi Form Data</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Lengkapi data diri, orang tua, dan kesehatan
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full h-14 text-base"
            onClick={() => setShowScanner(true)}
          >
            <QrCode className="w-5 h-5" />
            Scan QR Code
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-base"
            onClick={handleManualEntry}
          >
            <Shield className="w-5 h-5" />
            Masukkan Kode Manual
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)] mb-1">
              Waktu Pengerjaan
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Registrasi membutuhkan waktu sekitar 5-10 menit. Pastikan kamu memiliki
              koneksi internet yang stabil dan prepare data yang diperlukan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
