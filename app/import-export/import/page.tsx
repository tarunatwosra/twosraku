"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ImportStep = "upload" | "preview" | "mapping" | "confirm" | "complete"

export default function ImportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const module = searchParams.get("module") || "students"
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [step, setStep] = useState<ImportStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Module info
  const getModuleInfo = () => {
    const modules: Record<string, { name: string; icon: string; color: string }> = {
      students: { name: "Data Siswa", icon: "Users", color: "#3B82F6" },
      assessment: { name: "Penilaian", icon: "Award", color: "#F59E0B" },
      attendance: { name: "Presensi", icon: "ClipboardCheck", color: "#10B981" },
      character: { name: "Poin Karakter", icon: "Heart", color: "#EC4899" },
    }
    return modules[module] || modules.students
  }

  const moduleInfo = getModuleInfo()

  // Demo preview data
  const previewData = [
    { row: 1, valid: true, data: { no: "1", nama: "Andi Pratama", nilai: 85 } },
    { row: 2, valid: true, data: { no: "2", nama: "Budi Santoso", nilai: 92 } },
    { row: 3, valid: true, data: { no: "3", nama: "Dewi Lestari", nilai: 78 } },
    { row: 4, valid: false, data: { no: "4", nama: "Eko Prasetyo", nilai: "N/A" }, error: "Nilai tidak valid" },
    { row: 5, valid: true, data: { no: "5", nama: "Fitri Handayani", nilai: 88 } },
  ]

  const validCount = previewData.filter((d) => d.valid).length
  const invalidCount = previewData.filter((d) => !d.valid).length

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStep("preview")
    }
  }

  // Handle next step
  const handleNext = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)

    switch (step) {
      case "preview":
        setStep("mapping")
        break
      case "mapping":
        setStep("confirm")
        break
      case "confirm":
        setStep("complete")
        break
    }
  }

  // Handle back step
  const handleBack = () => {
    switch (step) {
      case "preview":
        setStep("upload")
        setFile(null)
        break
      case "mapping":
        setStep("preview")
        break
      case "confirm":
        setStep("mapping")
        break
    }
  }

  return (
    <AppShell
      title="Import Data"
      description={`Import data ${moduleInfo.name}`}
      breadcrumbs={[
        { label: "Import & Export", href: "/import-export" },
        { label: "Import" },
        { label: moduleInfo.name },
      ]}
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            {["upload", "preview", "mapping", "confirm", "complete"].map((s, i) => {
              const stepIndex = ["upload", "preview", "mapping", "confirm", "complete"].indexOf(step)
              const isActive = s === step
              const isCompleted = i < stepIndex

              return (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : isCompleted
                        ? "bg-[var(--success)] text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-[13px] font-medium",
                      isActive ? "text-[var(--primary)]" : isCompleted ? "text-[var(--success)]" : "text-[var(--text-muted)]"
                    )}
                  >
                    {s === "upload" ? "Upload" : s === "preview" ? "Preview" : s === "mapping" ? "Mapping" : s === "confirm" ? "Konfirmasi" : "Selesai"}
                  </span>
                  {i < 4 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 mx-4",
                        i < stepIndex ? "bg-[var(--success)]" : "bg-[var(--surface-secondary)]"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Step Content */}
        {step === "upload" && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-[var(--primary)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Upload File {moduleInfo.name}
              </h2>
              <p className="text-[var(--text-muted)] mb-6">
                Pilih file Excel (.xlsx) atau CSV untuk diimport
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition-colors">
                  Pilih File
                </div>
              </label>

              <div className="mt-6 flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push(`/import-export/templates?module=${module}`)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === "preview" && (
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Preview Data
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {file?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {validCount} valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="danger" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      {invalidCount} error
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)]">Row</th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)]">No</th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)]">Nama</th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)]">Nilai</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row) => (
                    <tr key={row.row} className="border-b border-[var(--border-light)]">
                      <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">{row.row}</td>
                      <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">{row.data.no}</td>
                      <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">{row.data.nama}</td>
                      <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">{row.data.nilai}</td>
                      <td className="px-4 py-3 text-center">
                        {row.valid ? (
                          <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Valid</Badge>
                        ) : (
                          <Badge variant="danger" className="gap-1">
                            <XCircle className="w-3 h-3" /> {row.error}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[var(--border-light)] flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <Button onClick={handleNext} isLoading={isProcessing}>
                Lanjut ke Mapping
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {step === "mapping" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
              Field Mapping
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Pasangkan kolom file dengan field sistem
            </p>

            <div className="space-y-4">
              {[
                { field: "no", label: "No", required: true },
                { field: "nama", label: "Nama Lengkap", required: true },
                { field: "nilai", label: "Nilai", required: true },
              ].map((item) => (
                <div key={item.field} className="flex items-center gap-4">
                  <div className="w-40">
                    <span className="text-[14px] font-medium text-[var(--text-primary)]">
                      {item.label}
                    </span>
                    {item.required && <span className="text-[var(--danger)] ml-1">*</span>}
                  </div>
                  <div className="flex-1">
                    <select className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]">
                      <option value="">Pilih kolom...</option>
                      <option value={item.field} selected>{item.field}</option>
                    </select>
                  </div>
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terpetakan
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <Button onClick={handleNext} isLoading={isProcessing}>
                Lanjut ke Konfirmasi
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {step === "confirm" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
              Konfirmasi Import
            </h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-[14px]">
                  <div>
                    <span className="text-[var(--text-muted)]">Modul:</span>
                    <span className="ml-2 font-medium text-[var(--text-primary)]">{moduleInfo.name}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">File:</span>
                    <span className="ml-2 font-medium text-[var(--text-primary)]">{file?.name}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Total Baris:</span>
                    <span className="ml-2 font-medium text-[var(--text-primary)]">{previewData.length}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Strategy:</span>
                    <span className="ml-2 font-medium text-[var(--text-primary)]">Upsert</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--warning-soft)]/30 border border-[var(--warning)] rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-[var(--warning)]">
                      Import Strategy: Upsert
                    </p>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                      Data yang sudah ada akan diupdate. Data baru akan ditambahkan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <Button onClick={handleNext} isLoading={isProcessing} className="gap-2">
                <Upload className="w-4 h-4" />
                Jalankan Import
              </Button>
            </div>
          </Card>
        )}

        {step === "complete" && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--success-soft)] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[var(--success)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Import Berhasil!
              </h2>
              <p className="text-[var(--text-muted)] mb-6">
                {validCount} record berhasil diimport
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                  <p className="text-2xl font-bold text-[var(--success)]">{validCount}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">Berhasil</p>
                </div>
                <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                  <p className="text-2xl font-bold text-[var(--warning)]">0</p>
                  <p className="text-[12px] text-[var(--text-muted)]">Diupdate</p>
                </div>
                <div className="p-4 bg-[var(--surface-secondary)] rounded-xl">
                  <p className="text-2xl font-bold text-[var(--danger)]">{invalidCount}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">Gagal</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => router.push("/import-export")}>
                  Kembali ke Dashboard
                </Button>
                <Button onClick={() => router.push("/import-export/history")}>
                  Lihat Riwayat
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
