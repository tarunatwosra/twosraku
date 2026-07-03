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
  Printer,
  FileText,
  Settings,
  Eye,
  Download,
  Monitor,
  Smartphone,
  Maximize2,
  Minimize2,
  ChevronDown,
  Check,
  Image,
  Type,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Paper sizes
const PAPER_SIZES = [
  { id: "a4", name: "A4", width: 210, height: 297, unit: "mm" },
  { id: "letter", name: "Letter", width: 215.9, height: 279.4, unit: "mm" },
  { id: "legal", name: "Legal", width: 215.9, height: 355.6, unit: "mm" },
]

// Paper orientations
const PAPER_ORIENTATIONS = [
  { id: "portrait", name: "Portrait", icon: Maximize2 },
  { id: "landscape", name: "Landscape", icon: Minimize2 },
]

// Margin presets
const MARGIN_PRESETS = [
  { id: "normal", name: "Normal", top: 20, right: 20, bottom: 20, left: 20 },
  { id: "narrow", name: "Sempit", top: 10, right: 10, bottom: 10, left: 10 },
  { id: "wide", name: "Lebar", top: 25, right: 25, bottom: 25, left: 25 },
  { id: "custom", name: "Kustom", top: 20, right: 20, bottom: 20, left: 20 },
]

// Print settings
interface PrintSettings {
  paperSize: string
  orientation: "portrait" | "landscape"
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  header: {
    enabled: boolean
    showLogo: boolean
    showTitle: boolean
    showDate: boolean
    text: string
  }
  footer: {
    enabled: boolean
    showPageNumber: boolean
    showDate: boolean
    showSchoolName: boolean
    text: string
  }
  watermark: {
    enabled: boolean
    text: string
    opacity: number
  }
  schoolLogo: string | null
}

// Demo recent prints
const DEMO_RECENT_PRINTS = [
  { id: "print-1", name: "Daftar Siswa X IPA 1", printedAt: "2026-07-01 10:30", format: "A4 Portrait", copies: 1 },
  { id: "print-2", name: "Rekap Absensi Juni", printedAt: "2026-07-01 09:15", format: "A4 Landscape", copies: 5 },
  { id: "print-3", name: "Nilai Semester Ganjil", printedAt: "2026-06-30 16:00", format: "A4 Portrait", copies: 2 },
]

export default function PrintEnginePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<"settings" | "preview" | "recent">("settings")
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    paperSize: "a4",
    orientation: "portrait",
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    header: {
      enabled: true,
      showLogo: true,
      showTitle: true,
      showDate: true,
      text: "",
    },
    footer: {
      enabled: true,
      showPageNumber: true,
      showDate: false,
      showSchoolName: true,
      text: "",
    },
    watermark: {
      enabled: false,
      text: "DRAFT",
      opacity: 15,
    },
    schoolLogo: null,
  })

  const [selectedMarginPreset, setSelectedMarginPreset] = useState("normal")

  // Handle margin preset change
  const handleMarginPresetChange = (presetId: string) => {
    setSelectedMarginPreset(presetId)
    const preset = MARGIN_PRESETS.find((p) => p.id === presetId)
    if (preset && presetId !== "custom") {
      setPrintSettings({
        ...printSettings,
        margins: {
          top: preset.top,
          right: preset.right,
          bottom: preset.bottom,
          left: preset.left,
        },
      })
    }
  }

  // Handle print
  const handlePrint = () => {
    window.print()
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
    <AppShell title="Print Engine" description="Pengaturan dan preview untuk cetak laporan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/laporan"
              className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Print Engine</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Pengaturan dan preview untuk cetak laporan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setActiveTab("preview")}>
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-[var(--surface-secondary)] rounded-[14px] w-fit">
          {[
            { id: "settings", label: "Pengaturan", icon: Settings },
            { id: "preview", label: "Preview", icon: Eye },
            { id: "recent", label: "Cetakan Terakhir", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-[12px] text-[14px] font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Paper Settings */}
            <Card className="p-6">
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Ukuran Kertas
              </h3>

              {/* Paper Size Selection */}
              <div className="space-y-3 mb-6">
                {PAPER_SIZES.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setPrintSettings({ ...printSettings, paperSize: paper.id })}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-[14px] border-2 transition-all",
                      printSettings.paperSize === paper.id
                        ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                        : "border-transparent bg-[var(--surface-secondary)] hover:border-[var(--border)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg border-2 flex items-center justify-center",
                        printSettings.paperSize === paper.id
                          ? "border-[var(--primary)] bg-white"
                          : "border-[var(--border)]"
                      )}>
                        {printSettings.paperSize === paper.id && (
                          <Check className="w-4 h-4 text-[var(--primary)]" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">{paper.name}</p>
                        <p className="text-[12px] text-[var(--text-muted)]">
                          {paper.width} × {paper.height} {paper.unit}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Orientation Selection */}
              <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-3">Orientasi</h4>
              <div className="flex gap-3">
                {PAPER_ORIENTATIONS.map((orientation) => {
                  const Icon = orientation.icon
                  return (
                    <button
                      key={orientation.id}
                      onClick={() => setPrintSettings({
                        ...printSettings,
                        orientation: orientation.id as "portrait" | "landscape"
                      })}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 transition-all",
                        printSettings.orientation === orientation.id
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-transparent bg-[var(--surface-secondary)]"
                      )}
                    >
                      <Icon className="w-6 h-6 text-[var(--text-secondary)]" />
                      <span className="text-[13px] font-medium text-[var(--text-primary)]">
                        {orientation.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Margin Settings */}
            <Card className="p-6">
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <AlignLeft className="w-5 h-5" />
                Margin
              </h3>

              {/* Margin Presets */}
              <div className="mb-4">
                <p className="text-[13px] text-[var(--text-muted)] mb-2">Preset</p>
                <div className="flex flex-wrap gap-2">
                  {MARGIN_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleMarginPresetChange(preset.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-all",
                        selectedMarginPreset === preset.id
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Margins */}
              <div className="grid grid-cols-2 gap-3">
                {["top", "right", "bottom", "left"].map((side) => (
                  <div key={side}>
                    <label className="text-[12px] text-[var(--text-muted)] mb-1 block capitalize">
                      {side === "top" ? "Atas" : side === "bottom" ? "Bawah" : side === "left" ? "Kiri" : "Kanan"}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={printSettings.margins[side as keyof typeof printSettings.margins]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0
                          setPrintSettings({
                            ...printSettings,
                            margins: { ...printSettings.margins, [side]: value },
                          })
                          setSelectedMarginPreset("custom")
                        }}
                        className="w-full h-10 px-3 bg-[var(--surface-secondary)] border border-transparent rounded-[12px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
                        min={0}
                        max={100}
                      />
                      <span className="text-[13px] text-[var(--text-muted)]">mm</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Header & Footer Settings */}
            <Card className="p-6">
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Header & Footer
              </h3>

              {/* Header Settings */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">Header</span>
                  <button
                    onClick={() => setPrintSettings({
                      ...printSettings,
                      header: { ...printSettings.header, enabled: !printSettings.header.enabled }
                    })}
                    className={cn(
                      "w-10 h-6 rounded-full transition-all relative",
                      printSettings.header.enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                      printSettings.header.enabled ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>

                {printSettings.header.enabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.header.showLogo}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          header: { ...printSettings.header, showLogo: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Logo Sekolah</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.header.showTitle}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          header: { ...printSettings.header, showTitle: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Judul Laporan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.header.showDate}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          header: { ...printSettings.header, showDate: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Tanggal</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Footer Settings */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">Footer</span>
                  <button
                    onClick={() => setPrintSettings({
                      ...printSettings,
                      footer: { ...printSettings.footer, enabled: !printSettings.footer.enabled }
                    })}
                    className={cn(
                      "w-10 h-6 rounded-full transition-all relative",
                      printSettings.footer.enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                      printSettings.footer.enabled ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>

                {printSettings.footer.enabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.footer.showPageNumber}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          footer: { ...printSettings.footer, showPageNumber: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Nomor Halaman</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.footer.showSchoolName}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          footer: { ...printSettings.footer, showSchoolName: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Nama Sekolah</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printSettings.footer.showDate}
                        onChange={(e) => setPrintSettings({
                          ...printSettings,
                          footer: { ...printSettings.footer, showDate: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-[var(--border)]"
                      />
                      <span className="text-[13px] text-[var(--text-secondary)]">Tanggal Cetak</span>
                    </label>
                  </div>
                )}
              </div>
            </Card>

            {/* Watermark Settings */}
            <Card className="p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Watermark
                </h3>
                <button
                  onClick={() => setPrintSettings({
                    ...printSettings,
                    watermark: { ...printSettings.watermark, enabled: !printSettings.watermark.enabled }
                  })}
                  className={cn(
                    "w-10 h-6 rounded-full transition-all relative",
                    printSettings.watermark.enabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                    printSettings.watermark.enabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>

              {printSettings.watermark.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] text-[var(--text-muted)] mb-2 block">Teks Watermark</label>
                    <input
                      type="text"
                      value={printSettings.watermark.text}
                      onChange={(e) => setPrintSettings({
                        ...printSettings,
                        watermark: { ...printSettings.watermark, text: e.target.value }
                      })}
                      className="w-full h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[14px] text-[15px] focus:outline-none focus:border-[var(--border-focus)]"
                      placeholder="DRAFT, CONFIDENTIAL, dll"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-[var(--text-muted)] mb-2 block">
                      Opacity: {printSettings.watermark.opacity}%
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={printSettings.watermark.opacity}
                      onChange={(e) => setPrintSettings({
                        ...printSettings,
                        watermark: { ...printSettings.watermark, opacity: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-[var(--surface-secondary)] rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Preview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Monitor className="w-4 h-4" />
                  Desktop
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </Button>
              </div>
            </div>

            {/* Paper Preview */}
            <div className="flex justify-center">
              <div
                className={cn(
                  "bg-white shadow-lg border border-[var(--border)] relative overflow-hidden",
                  printSettings.orientation === "portrait" ? "w-[210mm] min-h-[297mm]" : "w-[297mm] min-h-[210mm]"
                )}
                style={{
                  padding: `${printSettings.margins.top}mm ${printSettings.margins.right}mm ${printSettings.margins.bottom}mm ${printSettings.margins.left}mm`,
                }}
              >
                {/* Watermark Overlay */}
                {printSettings.watermark.enabled && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity: printSettings.watermark.opacity / 100 }}
                  >
                    <span className="text-[80px] font-bold text-gray-300 -rotate-45 select-none">
                      {printSettings.watermark.text}
                    </span>
                  </div>
                )}

                {/* Header */}
                {printSettings.header.enabled && (
                  <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      {printSettings.header.showLogo && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">Logo</span>
                        </div>
                      )}
                      {printSettings.header.showTitle && (
                        <div>
                          <p className="text-[14px] font-semibold text-gray-800">SMA Negeri 1 Yogyakarta</p>
                          <p className="text-[11px] text-gray-500">Daftar Siswa</p>
                        </div>
                      )}
                    </div>
                    {printSettings.header.showDate && (
                      <span className="text-[11px] text-gray-500">
                        {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                )}

                {/* Content Preview */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>

                {/* Footer */}
                {printSettings.footer.enabled && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                      {printSettings.footer.showSchoolName && <span>SMA Negeri 1 Yogyakarta</span>}
                      {printSettings.footer.showDate && <span>{new Date().toLocaleDateString("id-ID")}</span>}
                    </div>
                    {printSettings.footer.showPageNumber && (
                      <span className="text-[10px] text-gray-500">Halaman 1 dari 1</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Recent Prints Tab */}
        {activeTab === "recent" && (
          <div className="space-y-4">
            {DEMO_RECENT_PRINTS.map((print) => (
              <Card key={print.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-secondary)] flex items-center justify-center">
                      <Printer className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--text-primary)]">{print.name}</p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        {print.format} • {print.copies} kopi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-[var(--text-muted)]">
                      {new Date(print.printedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
