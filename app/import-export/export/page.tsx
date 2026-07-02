"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Circle,
  ChevronRight,
  FileText,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  PiggyBank,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Steps for export wizard
const STEPS = [
  { id: 1, title: "Pilih Modul", description: "Pilih modul data yang akan diekspor" },
  { id: 2, title: "Pilih Kolom", description: "Pilih kolom yang akan diekspor" },
  { id: 3, title: "Filter Data", description: "Tentukan filter data" },
  { id: 4, title: "Preview", description: "Pratinjau data sebelum ekspor" },
  { id: 5, title: "Selesai", description: "Unduh file ekspor" },
]

// Available modules
const MODULES = [
  {
    id: "students",
    name: "Buku Induk Siswa",
    description: "Data lengkap siswa",
    icon: Users,
    color: "#4F7CFF",
    recordCount: 1248,
  },
  {
    id: "attendance",
    name: "Absensi",
    description: "Data kehadiran siswa",
    icon: ClipboardCheck,
    color: "#22c55e",
    recordCount: 45600,
  },
  {
    id: "assessment",
    name: "Penilaian",
    description: "Data nilai siswa",
    icon: GraduationCap,
    color: "#F59E0B",
    recordCount: 8900,
  },
  {
    id: "character",
    name: "Poin Karakter",
    description: "Data poin karakter",
    icon: Award,
    color: "#8b5cf6",
    recordCount: 3200,
  },
  {
    id: "special-units",
    name: "Pasukan Khusus",
    description: "Data anggota pasukan khusus",
    icon: Shield,
    color: "#EF4444",
    recordCount: 45,
  },
  {
    id: "savings",
    name: "Tabungan",
    description: "Data tabungan siswa",
    icon: PiggyBank,
    color: "#06b6d4",
    recordCount: 890,
  },
]

// Column options per module
const COLUMNS_BY_MODULE: Record<string, { id: string; name: string; required?: boolean }[]> = {
  students: [
    { id: "nis", name: "NIS", required: true },
    { id: "name", name: "Nama Lengkap", required: true },
    { id: "gender", name: "Jenis Kelamin" },
    { id: "class", name: "Kelas" },
    { id: "major", name: "Jurusan" },
    { id: "birth_date", name: "Tanggal Lahir" },
    { id: "birth_place", name: "Tempat Lahir" },
    { id: "address", name: "Alamat" },
    { id: "phone", name: "No. Telepon" },
    { id: "parent_name", name: "Nama Orang Tua" },
    { id: "status", name: "Status" },
  ],
  attendance: [
    { id: "date", name: "Tanggal", required: true },
    { id: "nis", name: "NIS", required: true },
    { id: "name", name: "Nama", required: true },
    { id: "class", name: "Kelas", required: true },
    { id: "status", name: "Status Hadir", required: true },
    { id: "notes", name: "Keterangan" },
  ],
  assessment: [
    { id: "nis", name: "NIS", required: true },
    { id: "name", name: "Nama", required: true },
    { id: "subject", name: "Mata Pelajaran", required: true },
    { id: "score", name: "Nilai" },
    { id: "semester", name: "Semester" },
  ],
}

// File formats
const FILE_FORMATS = [
  { id: "xlsx", name: "Microsoft Excel (.xlsx)", icon: FileSpreadsheet },
  { id: "csv", name: "CSV (.csv)", icon: FileText },
  { id: "pdf", name: "PDF (.pdf)", icon: FileText },
]

export default function ExportWizardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [selectedFormat, setSelectedFormat] = useState("xlsx")
  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    semester: "Ganjil",
    class: "all",
    status: "all",
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  // Get current module data
  const currentModule = MODULES.find((m) => m.id === selectedModule)
  const moduleColumns = selectedModule ? COLUMNS_BY_MODULE[selectedModule] || [] : []

  // Handle column toggle
  const toggleColumn = (columnId: string) => {
    const column = moduleColumns.find((c) => c.id === columnId)
    if (column?.required) return // Can't uncheck required columns

    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    )
  }

  // Handle export
  const handleExport = async () => {
    setIsExporting(true)
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    setExportComplete(true)
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
    // Auto-select required columns
    const requiredCols = (COLUMNS_BY_MODULE[moduleId] || [])
      .filter((c) => c.required)
      .map((c) => c.id)
    setSelectedColumns(requiredCols)
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppShell title="Export Data" description="Wizard ekspor data">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/import-export"
            className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Export Data</h1>
            <p className="text-sm text-[var(--text-muted)]">Ekspor data ke file Excel, CSV, atau PDF</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      currentStep > step.id
                        ? "bg-[var(--success)] text-white"
                        : currentStep === step.id
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden lg:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-12 lg:w-20 h-1 mx-4 rounded-full",
                      currentStep > step.id ? "bg-[var(--success)]" : "bg-[var(--surface-secondary)]"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6">
          {/* Step 1: Select Module */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Pilih Modul Data
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Pilih modul yang datanya akan diekspor
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MODULES.map((module) => {
                  const Icon = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleSelect(module.id)}
                      className={cn(
                        "p-4 rounded-[18px] border-2 text-left transition-all",
                        selectedModule === module.id
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-transparent bg-[var(--surface-secondary)] hover:border-[var(--border)]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: module.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[var(--text-primary)]">{module.name}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{module.description}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {module.recordCount.toLocaleString("id-ID")} data
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Select Columns */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Pilih Kolom
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Pilih kolom yang akan disertakan dalam file ekspor
              </p>

              {/* File Format Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Format File</p>
                <div className="flex gap-3">
                  {FILE_FORMATS.map((format) => {
                    const Icon = format.icon
                    return (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-[14px] border transition-all",
                          selectedFormat === format.id
                            ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                            : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--primary)]"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{format.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Column Selection */}
              <div className="space-y-2">
                {moduleColumns.map((column) => (
                  <label
                    key={column.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-[14px] cursor-pointer transition-all",
                      column.required
                        ? "bg-[var(--surface-secondary)] cursor-not-allowed"
                        : "hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    <div
                      onClick={() => !column.required && toggleColumn(column.id)}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        selectedColumns.includes(column.id)
                          ? "bg-[var(--primary)] border-[var(--primary)]"
                          : "border-[var(--border)]",
                        column.required && "bg-[var(--surface-hover)]"
                      )}
                    >
                      {selectedColumns.includes(column.id) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => toggleColumn(column.id)}
                      disabled={column.required}
                      className="sr-only"
                    />
                    <span className="text-sm text-[var(--text-primary)]">{column.name}</span>
                    {column.required && (
                      <Badge variant="secondary" className="text-[10px] ml-auto">
                        Wajib
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Filters */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Filter Data
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Tentukan filter untuk data yang akan diekspor
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Tahun Ajaran
                  </label>
                  <select
                    value={filters.academicYear}
                    onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="2025-2026">2025/2026</option>
                    <option value="2024-2025">2024/2025</option>
                    <option value="2023-2024">2023/2024</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Kelas
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="all">Semua Kelas</option>
                    <option value="x-ipa-1">X IPA 1</option>
                    <option value="x-ipa-2">X IPA 2</option>
                    <option value="xi-ips-1">XI IPS 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-[var(--surface-secondary)] rounded-[18px]">
                <p className="text-sm text-[var(--text-muted)]">
                  Estimasi data yang akan diekspor:{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {currentModule?.recordCount.toLocaleString("id-ID")} record
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Pratinjau Data
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Pratinjau 5 data pertama yang akan diekspor
              </p>

              {/* Preview Table */}
              <div className="overflow-x-auto rounded-[18px] border border-[var(--border-light)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-secondary)]">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">NIS</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Nama</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Kelas</th>
                      <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-light)]">
                    <tr className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">12345</td>
                      <td className="px-4 py-3 font-medium">Ahmad Fauzi Rahman</td>
                      <td className="px-4 py-3">X IPA 1</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px]">Aktif</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">12346</td>
                      <td className="px-4 py-3 font-medium">Siti Nurhaliza</td>
                      <td className="px-4 py-3">XI IPA 2</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px]">Aktif</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">12347</td>
                      <td className="px-4 py-3 font-medium">Budi Santoso</td>
                      <td className="px-4 py-3">X IPA 2</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px]">Aktif</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">12348</td>
                      <td className="px-4 py-3 font-medium">Dewi Lestari</td>
                      <td className="px-4 py-3">XII IPS 1</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px]">Aktif</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3">12349</td>
                      <td className="px-4 py-3 font-medium">Rizki Pratama</td>
                      <td className="px-4 py-3">XI IPS 2</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="text-[10px]">Aktif</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-3">
                Menampilkan 5 dari {currentModule?.recordCount.toLocaleString("id-ID")} data
              </p>

              {/* Export Summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[var(--surface-secondary)] rounded-[14px] text-center">
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {currentModule?.recordCount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Total Record</p>
                </div>
                <div className="p-4 bg-[var(--surface-secondary)] rounded-[14px] text-center">
                  <p className="text-2xl font-bold text-[var(--success)]">
                    {selectedColumns.length}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Kolom</p>
                </div>
                <div className="p-4 bg-[var(--surface-secondary)] rounded-[14px] text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {filters.academicYear}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Tahun Ajaran</p>
                </div>
                <div className="p-4 bg-[var(--surface-secondary)] rounded-[14px] text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)] uppercase">
                    {selectedFormat}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Format</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && exportComplete && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[var(--success-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[var(--success)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Export Berhasil!
              </h2>
              <p className="text-[var(--text-muted)] mb-8">
                File {currentModule?.name} berhasil diekspor
              </p>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push("/import-export")}>
                  Kembali ke Import/Export
                </Button>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Unduh File
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>

            {currentStep === 4 ? (
              <Button
                onClick={handleExport}
                isLoading={isExporting}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export Sekarang
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedModule}
                className="gap-2"
              >
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
