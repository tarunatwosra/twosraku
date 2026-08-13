"use client"

/**
 * Reading: Registration settings page dengan toggle dan QR code
 * Bahasa visual: Card-based layout dengan visual hierarchy
 * Dial: ENERGI 2 / RITME 2 / GERAK 1
 */

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  QrCode,
  Link2,
  Copy,
  Check,
  RefreshCw,
  BarChart3,
  Users,
  Clock,
  ExternalLink,
  AlertCircle,
  Info,
  CheckCircle,
  Download,
  Printer,
  Maximize2,
} from "lucide-react"
import {
  getRegistrationSettings,
  updateRegistrationSettings,
  getRegistrationStats,
  getAccessCount,
  getIncompleteStudents,
} from "@/lib/registrasi"

export default function RegistrationSettingsPage() {
  const router = useRouter()
  const qrRef = useRef<HTMLDivElement>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [registrationUrl, setRegistrationUrl] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedCount: 0,
    pendingCount: 0,
    completionRate: 0,
  })
  const [incompleteStudents] = useState<
    Array<{ id: string; student_number: string; full_name: string | null }>
  >([])

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (registrationUrl && isEnabled) {
      generateQRCode(registrationUrl)
    }
  }, [registrationUrl, isEnabled])

  async function loadSettings() {
    try {
      setIsLoading(true)
      setError(null)

      const [settings, statsData] = await Promise.all([
        getRegistrationSettings(),
        getRegistrationStats(),
      ])

      setIsEnabled(settings.isEnabled)
      setRegistrationUrl(settings.registrationUrl)
      setStats(statsData)

      if (settings.isEnabled) {
        await getIncompleteStudents()
      }
    } catch (err) {
      console.warn("Error loading settings:", err)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggle(enabled: boolean) {
    setIsSaving(true)
    setError(null)

    const result = await updateRegistrationSettings(enabled)
    if (result.success) {
      setIsEnabled(enabled)
      if (enabled) {
        const settings = await getRegistrationSettings()
        setRegistrationUrl(settings.registrationUrl)
      }
    } else {
      setError(result.error || "Gagal mengupdate pengaturan")
    }

    setIsSaving(false)
  }

  async function generateQRCode(url: string) {
    try {
      const QRCode = await import("qrcode")
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#172033", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      })
      setQrCodeUrl(dataUrl)
    } catch (err) {
      console.error("Error generating QR code:", err)
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(registrationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = registrationUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function openRegistrationPage() {
    window.open(registrationUrl, "_blank")
  }

  function downloadQRCode() {
    if (!qrCodeUrl) return
    const link = document.createElement("a")
    link.download = "qr-registrasi-siswa.png"
    link.href = qrCodeUrl
    link.click()
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-[var(--surface-secondary)] rounded-xl" />
        <div className="h-32 bg-[var(--surface-secondary)] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Error Message */}
      {error && (
        <Card className="p-4 border-[var(--danger)] bg-[var(--danger-soft)]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--danger)] flex-shrink-0" />
            <p className="text-[14px] text-[var(--danger)]">{error}</p>
          </div>
        </Card>
      )}

      {/* Main Toggle Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
              <QrCode className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Registrasi Mandiri Siswa
              </h2>
              <p className="text-[13px] text-[var(--text-muted)]">
                Aktifkan agar siswa dapat mengisi data sendiri
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isSaving}
          />
        </div>

        {isEnabled && (
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <div className="p-4 bg-[var(--success-soft)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                <span className="text-[13px] font-medium text-[var(--success)]">
                  Registrasi Sedang Aktif
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Siswa dapat mengakses halaman registrasi melalui QR code atau link.
                Data yang diisi akan langsung tersimpan ke database buku induk.
              </p>
            </div>
          </div>
        )}

        {!isEnabled && (
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <div className="p-4 bg-[var(--surface-secondary)] rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[var(--text-muted)]">
                Jika dinonaktifkan, siswa tidak dapat mengakses halaman registrasi.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* QR Code Section */}
      {isEnabled && (
        <>
          {/* QR Code Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  QR Code Registrasi
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateQRCode(registrationUrl)}
                className="gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            <div className="flex flex-col items-center">
              <div
                ref={qrRef}
                className="bg-white p-6 rounded-xl border border-[var(--border)] mb-4"
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Registrasi"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-[var(--surface-secondary)] rounded-xl">
                    <RefreshCw className="w-8 h-8 text-[var(--text-muted)] animate-spin" />
                  </div>
                )}
              </div>

              <p className="text-[13px] text-[var(--text-muted)] text-center mb-5">
                Scan QR code dengan kamera HP untuk mengakses halaman registrasi
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={downloadQRCode} disabled={!qrCodeUrl} className="gap-1.5">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={openRegistrationPage} className="gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  Buka
                </Button>
              </div>
            </div>
          </Card>

          {/* Link Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Link Registrasi
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-[var(--surface-secondary)] rounded-xl text-[13px] text-[var(--text-primary)] truncate font-mono">
                {registrationUrl}
              </div>
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-shrink-0">
                {copied ? (
                  <Check className="w-4 h-4 text-[var(--success)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className="text-[12px] text-[var(--text-muted)] mt-3">
              Bagikan link ini atau gunakan QR code untuk diakses siswa
            </p>
          </Card>

          {/* Statistics Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Statistik
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {stats.totalStudents}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Total Siswa</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {stats.completedCount}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Sudah Mengisi</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--warning-soft)] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--warning)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {stats.pendingCount}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Belum Mengisi</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--info-soft)] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[var(--info)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {stats.completionRate}%
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-2">
                <span className="text-[var(--text-muted)]">Progress</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {stats.completedCount} / {stats.totalStudents}
                </span>
              </div>
              <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
                  Cara Kerja Registrasi Mandiri
                </h3>
                <ol className="text-[13px] text-[var(--text-secondary)] space-y-2">
                  <li className="flex gap-2">
                    <span className="font-medium text-[var(--text-primary)]">1.</span>
                    Aktifkan registrasi dan bagikan link atau QR ke siswa
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-[var(--text-primary)]">2.</span>
                    Siswa scan QR atau buka link
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-[var(--text-primary)]">3.</span>
                    Siswa verifikasi dengan NIS dan tanggal lahir
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-[var(--text-primary)]">4.</span>
                    Siswa isi form data diri secara mandiri
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-[var(--text-primary)]">5.</span>
                    Data langsung tersimpan ke database buku induk
                  </li>
                </ol>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
