"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card, Button } from "@/components/ui"
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
} from "lucide-react"
import {
  getRegistrationSettings,
  updateRegistrationSettings,
  getRegistrationStats,
  getAccessCount,
  getIncompleteStudents,
} from "@/lib/registrasi"
import { cn } from "@/lib/utils"

export default function RegistrationSettingsPage() {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(false)
  const [registrationUrl, setRegistrationUrl] = useState("")
  const [accessCount, setAccessCount] = useState(0)
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
  const [incompleteStudents, setIncompleteStudents] = useState<
    Array<{ id: string; student_number: string; full_name: string | null }>
  >([])

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setIsLoading(true)
      setError(null)

      const [settings, statsData, access] = await Promise.all([
        getRegistrationSettings(),
        getRegistrationStats(),
        getAccessCount(),
      ])

      setIsEnabled(settings.isEnabled)
      setRegistrationUrl(settings.registrationUrl || `${window.location.origin}/registrasi`)
      setStats(statsData)
      setAccessCount(access)

      // Load incomplete students if registration is enabled
      if (settings.isEnabled) {
        const incomplete = await getIncompleteStudents()
        setIncompleteStudents(incomplete)
      }
    } catch (err) {
      console.warn("Error loading settings:", err)
      // Don't show error to user, just use defaults
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
        // Reload to get the URL
        const settings = await getRegistrationSettings()
        setRegistrationUrl(settings.registrationUrl || `${window.location.origin}/registrasi`)
      }
    } else {
      setError(result.error || "Gagal mengupdate pengaturan")
    }

    setIsSaving(false)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(registrationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
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

  if (isLoading) {
    return (
      <AppShell title="Pengaturan Registrasi Siswa" description="Kelola pengaturan registrasi mandiri siswa">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-[var(--surface-secondary)] rounded-2xl" />
          <div className="h-32 bg-[var(--surface-secondary)] rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Pengaturan Registrasi Siswa" description="Kelola pengaturan registrasi mandiri siswa">
      <div className="max-w-2xl space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Main Toggle Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Registrasi Mandiri Siswa
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Aktifkan agar siswa dapat mengisi data sendiri
                  </p>
                </div>
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={isSaving}
            />
          </div>

          {isEnabled && (
            <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
              <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    Registrasi Sedang Aktif
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  Siswa dapat mengakses halaman registrasi melalui QR code atau link di
                  bawah. Data yang diisi akan langsung tersimpan ke database buku induk.
                </p>
              </div>
            </div>
          )}

          {!isEnabled && (
            <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
              <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-muted)]">
                  Jika dinonaktifkan, siswa tidak dapat mengakses halaman registrasi.
                  Aktifkan kembali untuk membuka akses.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Registration URL Card */}
        {isEnabled && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-[var(--text-secondary)]" />
              <h3 className="font-medium text-[var(--text-primary)]">Link Registrasi</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-[var(--surface-secondary)] rounded-xl text-sm text-[var(--text-primary)] truncate font-mono">
                {registrationUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openRegistrationPage}
                className="flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-3">
              Bagikan link ini atau gunakan QR code untuk diakses siswa
            </p>
          </Card>
        )}

        {/* Stats Card */}
        {isEnabled && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[var(--text-secondary)]" />
              <h3 className="font-medium text-[var(--text-primary)]">Statistik</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {stats.totalStudents}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Total Siswa</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {stats.completedCount}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Sudah Mengisi</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {stats.pendingCount}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Belum Mengisi</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {stats.completionRate}%
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Progress</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {stats.completedCount} / {stats.totalStudents}
                </span>
              </div>
              <div className="h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Incomplete Students List */}
        {isEnabled && incompleteStudents.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                <h3 className="font-medium text-[var(--text-primary)]">
                  Siswa yang Belum Mengisi ({incompleteStudents.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/buku-induk")}
              >
                Lihat di Buku Induk
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {incompleteStudents.slice(0, 10).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-medium text-sm">
                    {student.full_name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {student.full_name || "Tanpa Nama"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      NIS: {student.student_number}
                    </p>
                  </div>
                </div>
              ))}
              {incompleteStudents.length > 10 && (
                <p className="text-xs text-center text-[var(--text-muted)] py-2">
                  +{incompleteStudents.length - 10} siswa lainnya
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">
                Cara Kerja Registrasi Mandiri
              </h3>
              <ol className="text-sm text-[var(--text-muted)] space-y-2 list-decimal list-inside">
                <li>Aktifkan registrasi dan bagikan link/QR ke siswa</li>
                <li>Siswa scan QR atau buka link</li>
                <li>Siswa verifikasi dengan NIS dan tanggal lahir</li>
                <li>Siswa isi form data diri secara mandiri</li>
                <li>Data langsung tersimpan ke database buku induk</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
