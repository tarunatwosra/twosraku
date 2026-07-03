"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  BarChart,
  Download,
  Printer,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Eye,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Report types
interface ReportType {
  id: string
  name: string
  module: string
  category: string
  description: string
  icon: typeof Users
  color: string
}

// Steps for wizard
const STEPS = [
  { id: 1, title: "Pilih Laporan", description: "Pilih jenis laporan" },
  { id: 2, title: "Filter Data", description: "Tentukan filter" },
  { id: 3, title: "Preview", description: "Pratinjau laporan" },
  { id: 4, title: "Selesai", description: "Unduh laporan" },
]

// Available reports
const REPORT_TYPES: ReportType[] = [
  // Student Reports
  { id: "student-list", name: "Daftar Siswa", module: "students", category: "Siswa", description: "Daftar lengkap semua siswa", icon: Users, color: "#4F7CFF" },
  { id: "student-detail", name: "Detail Siswa", module: "students", category: "Siswa", description: "Data detail per siswa", icon: Users, color: "#4F7CFF" },
  { id: "student-birthday", name: "Daftar Ulang Tahun", module: "students", category: "Siswa", description: "Daftar siswa berdasarkan tanggal lahir", icon: Users, color: "#4F7CFF" },
  // Attendance Reports
  { id: "attendance-daily", name: "Absensi Harian", module: "attendance", category: "Absensi", description: "Rekap absensi harian", icon: ClipboardCheck, color: "#22c55e" },
  { id: "attendance-weekly", name: "Absensi Mingguan", module: "attendance", category: "Absensi", description: "Rekap absensi mingguan", icon: ClipboardCheck, color: "#22c55e" },
  { id: "attendance-monthly", name: "Absensi Bulanan", module: "attendance", category: "Absensi", description: "Rekap absensi bulanan", icon: ClipboardCheck, color: "#22c55e" },
  // Assessment Reports
  { id: "score-summary", name: "Ringkasan Nilai", module: "assessment", category: "Penilaian", description: "Ringkasan nilai per siswa/kelas", icon: GraduationCap, color: "#F59E0B" },
  { id: "score-detail", name: "Detail Nilai", module: "assessment", category: "Penilaian", description: "Detail nilai lengkap", icon: GraduationCap, color: "#F59E0B" },
  { id: "score-rank", name: "Peringkat Siswa", module: "assessment", category: "Penilaian", description: "Peringkat berdasarkan nilai", icon: GraduationCap, color: "#F59E0B" },
  // Character Reports
  { id: "character-summary", name: "Ringkasan Poin", module: "character", category: "Poin Karakter", description: "Ringkasan poin karakter", icon: Award, color: "#8b5cf6" },
  { id: "character-detail", name: "Detail Poin", module: "character", category: "Poin Karakter", description: "Detail poin karakter per siswa", icon: Award, color: "#8b5cf6" },
  { id: "character-rank", name: "Peringkat Karakter", module: "character", category: "Poin Karakter", description: "Peringkat karakter terbaik", icon: Award, color: "#8b5cf6" },
  // Special Units Reports
  { id: "unit-members", name: "Daftar Anggota", module: "special-units", category: "Pasukan Khusus", description: "Daftar anggota pasukan khusus", icon: Shield, color: "#EF4444" },
  { id: "unit-assignment", name: "Penugasan", module: "special-units", category: "Pasukan Khusus", description: "Daftar penugasan", icon: Shield, color: "#EF4444" },
  // Analytics Reports
  { id: "analytics-overview", name: "Overview", module: "analytics", category: "Analytics", description: "Ringkasan analytics", icon: BarChart, color: "#06b6d4" },
  { id: "analytics-trend", name: "Tren", module: "analytics", category: "Analytics", description: "Analisis tren", icon: BarChart, color: "#06b6d4" },
]

// Export formats
const EXPORT_FORMATS = [
  { id: "pdf", name: "PDF", icon: FileText, description: "Cocok untuk打印", color: "#EF4444" },
  { id: "xlsx", name: "Excel", icon: FileSpreadsheet, description: "Cocok untuk analisis data", color: "#22c55e" },
  { id: "csv", name: "CSV", icon: FileText, description: "Cocok untuk import ke sistem lain", color: "#F59E0B" },
]

// Group reports by category
const groupedReports = REPORT_TYPES.reduce((acc, report) => {
  if (!acc[report.category]) {
    acc[report.category] = []
  }
  acc[report.category].push(report)
  return acc
}, {} as Record<string, ReportType[]>)

export default function GenerateReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    semester: "Ganjil",
    class: "all",
    grade: "all",
    dateFrom: "",
    dateTo: "",
    status: "all",
  })

  // Initialize from URL params
  useEffect(() => {
    const type = searchParams.get("type")
    const template = searchParams.get("template")

    if (type) {
      const report = REPORT_TYPES.find((r) => r.id === type)
      if (report) {
        setSelectedReport(report)
        setCurrentStep(2)
      }
    }

    if (template) {
      // Load template settings
      setCurrentStep(2)
    }
  }, [searchParams])

  // Handle next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle generate
  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setIsComplete(true)
    setCurrentStep(4)
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
    <AppShell title="Buat Laporan" description="Wizard untuk membuat laporan">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/laporan"
            className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Buat Laporan</h1>
            <p className="text-sm text-[var(--text-muted)]">Pilih jenis laporan dan tentukan filter</p>
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
                    <p className="text-[11px] text-[var(--text-muted)]">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-12 lg:w-16 h-1 mx-4 rounded-full",
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
          {/* Step 1: Select Report */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                Pilih Jenis Laporan
              </h2>

              {Object.entries(groupedReports).map(([category, reports]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-[14px] font-medium text-[var(--text-muted)] mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reports.map((report) => {
                      const Icon = report.icon
                      return (
                        <button
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-[14px] border-2 text-left transition-all",
                            selectedReport?.id === report.id
                              ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                              : "border-transparent bg-[var(--surface-secondary)] hover:border-[var(--border)]"
                          )}
                        >
                          <div
                            className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                            style={{ backgroundColor: `${report.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: report.color }} />
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[var(--text-primary)]">
                              {report.name}
                            </p>
                            <p className="text-[12px] text-[var(--text-muted)]">
                              {report.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Filters */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Filter Data
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Tentukan filter untuk laporan "{selectedReport?.name}"
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
                    Tingkat/Kelas
                  </label>
                  <select
                    value={filters.grade}
                    onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  >
                    <option value="all">Semua Tingkat</option>
                    <option value="x">X (Sepuluh)</option>
                    <option value="xi">XI (Sebelas)</option>
                    <option value="xii">XII (Dua Belas)</option>
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
                    <option value="xii-ipa-1">XII IPA 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full h-12 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <div className="md:col-span-2">
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
                    <option value="graduated">Lulus</option>
                    <option value="transferred">Pindah</option>
                  </select>
                </div>
              </div>

              {/* Export Format Selection */}
              <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                  Format Export
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {EXPORT_FORMATS.map((format) => {
                    const Icon = format.icon
                    return (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 transition-all",
                          selectedFormat === format.id
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-transparent bg-[var(--surface-secondary)] hover:border-[var(--border)]"
                        )}
                      >
                        <Icon className="w-6 h-6" style={{ color: format.color }} />
                        <div className="text-center">
                          <p className="text-[14px] font-medium text-[var(--text-primary)]">{format.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{format.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Pratinjau Laporan
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Pratinjau laporan "{selectedReport?.name}"
              </p>

              {/* Report Summary */}
              <div className="bg-[var(--surface-secondary)] rounded-[18px] p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-[12px]">
                    <p className="text-[18px] font-bold text-[var(--text-primary)]">
                      {selectedReport?.category}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Kategori</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-[12px]">
                    <p className="text-[18px] font-bold text-[var(--text-primary)]">
                      {filters.academicYear}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Tahun Ajaran</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-[12px]">
                    <p className="text-[18px] font-bold text-[var(--text-primary)]">
                      {filters.semester}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Semester</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-[12px]">
                    <p className="text-[18px] font-bold text-[var(--primary)] uppercase">
                      {selectedFormat}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Format</p>
                  </div>
                </div>
              </div>

              {/* Filters Summary */}
              <div className="mb-6">
                <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-3">Filter yang digunakan:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.grade !== "all" && (
                    <Badge variant="secondary">Tingkat: {filters.grade.toUpperCase()}</Badge>
                  )}
                  {filters.class !== "all" && (
                    <Badge variant="secondary">Kelas: {filters.class.replace("-", " ").toUpperCase()}</Badge>
                  )}
                  {filters.status !== "all" && (
                    <Badge variant="secondary">Status: {filters.status}</Badge>
                  )}
                  {filters.dateFrom && (
                    <Badge variant="secondary">Dari: {filters.dateFrom}</Badge>
                  )}
                  {filters.dateTo && (
                    <Badge variant="secondary">Sampai: {filters.dateTo}</Badge>
                  )}
                </div>
              </div>

              {/* Preview Placeholder */}
              <div className="border border-[var(--border-light)] rounded-[18px] p-8 text-center">
                <Eye className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-muted)]">
                  Pratinjau akan muncul di sini
                </p>
                <p className="text-[12px] text-[var(--text-muted)] mt-2">
                  Estimasi waktu توليد: 3-5 detik
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && isComplete && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[var(--success-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[var(--success)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Laporan Berhasil Dibuat!
              </h2>
              <p className="text-[var(--text-muted)] mb-8">
                Laporan "{selectedReport?.name}" telah berhasil dibuat
              </p>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => router.push("/laporan")}>
                  Kembali ke Laporan
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => router.push("/laporan/print")}>
                  <Printer className="w-4 h-4" />
                  Cetak
                </Button>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
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

            {currentStep === 3 ? (
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                توليد Laporan
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedReport}
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
