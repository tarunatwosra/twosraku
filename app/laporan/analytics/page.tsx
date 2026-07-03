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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ClipboardCheck,
  GraduationCap,
  Award,
  Shield,
  PiggyBank,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  LineChart,
  PieChart,
  BarChart,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Time period options
const TIME_PERIODS = [
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "monthly", label: "Bulanan" },
  { id: "semester", label: "Semester" },
  { id: "yearly", label: "Tahunan" },
]

// Analytics data types
interface AnalyticsCard {
  id: string
  title: string
  value: number | string
  change: number
  changeLabel: string
  icon: typeof Users
  color: string
}

interface ChartData {
  label: string
  value: number
  color?: string
}

// Demo analytics data
const DEMO_ANALYTICS: {
  cards: AnalyticsCard[]
  attendanceTrend: ChartData[]
  assessmentTrend: ChartData[]
  characterTrend: ChartData[]
  moduleDistribution: ChartData[]
} = {
  cards: [
    { id: "1", title: "Total Siswa", value: 1248, change: 5.2, changeLabel: "vs bulan lalu", icon: Users, color: "#4F7CFF" },
    { id: "2", title: "Rata-rata Kehadiran", value: "94.5%", change: 1.8, changeLabel: "vs bulan lalu", icon: ClipboardCheck, color: "#22c55e" },
    { id: "3", title: "Rata-rata Nilai", value: 82.3, change: -2.1, changeLabel: "vs semester lalu", icon: GraduationCap, color: "#F59E0B" },
    { id: "4", title: "Total Poin Karakter", value: 3456, change: 12.5, changeLabel: "vs bulan lalu", icon: Award, color: "#8b5cf6" },
  ],
  attendanceTrend: [
    { label: "Jan", value: 92 },
    { label: "Feb", value: 94 },
    { label: "Mar", value: 91 },
    { label: "Apr", value: 93 },
    { label: "Mei", value: 95 },
    { label: "Jun", value: 94 },
  ],
  assessmentTrend: [
    { label: "Jan", value: 78 },
    { label: "Feb", value: 80 },
    { label: "Mar", value: 82 },
    { label: "Apr", value: 81 },
    { label: "Mei", value: 83 },
    { label: "Jun", value: 82 },
  ],
  characterTrend: [
    { label: "Jan", value: 2800 },
    { label: "Feb", value: 3100 },
    { label: "Mar", value: 2950 },
    { label: "Apr", value: 3200 },
    { label: "Mei", value: 3400 },
    { label: "Jun", value: 3456 },
  ],
  moduleDistribution: [
    { label: "Siswa", value: 45, color: "#4F7CFF" },
    { label: "Absensi", value: 25, color: "#22c55e" },
    { label: "Penilaian", value: 15, color: "#F59E0B" },
    { label: "Karakter", value: 10, color: "#8b5cf6" },
    { label: "Lainnya", value: 5, color: "#06b6d4" },
  ],
}

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  students: "Siswa",
  attendance: "Absensi",
  assessment: "Penilaian",
  character: "Poin Karakter",
  specialUnits: "Pasukan Khusus",
  savings: "Tabungan",
  spiritual: "Spiritual",
}

export default function AnalyticsReportsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedModule, setSelectedModule] = useState("all")

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

  // Calculate chart height for SVG
  const maxValue = Math.max(...DEMO_ANALYTICS.attendanceTrend.map((d) => d.value))
  const chartHeight = 200
  const chartWidth = 100

  return (
    <AppShell title="Analytics Laporan" description="Analisis dan statistik laporan sekolah">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/laporan"
              className="w-10 h-10 rounded-[14px] bg-[var(--surface-secondary)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics Laporan</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Analisis dan statistik penggunaan laporan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Period Filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-[14px] focus:outline-none focus:border-[var(--border-focus)]"
            >
              {TIME_PERIODS.map((period) => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_ANALYTICS.cards.map((card) => {
            const Icon = card.icon
            const isPositive = card.change >= 0

            return (
              <Card key={card.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <Badge
                    variant={isPositive ? "success" : "danger"}
                    className="gap-1 text-[11px]"
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                  {card.value}
                </p>
                <p className="text-[13px] text-[var(--text-muted)]">
                  {card.title}
                </p>
              </Card>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#22c55e]" />
                  Tren Kehadiran
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">Rata-rata kehadiran per bulan</p>
              </div>
              <Badge variant="success" className="text-[11px]">
                +1.8%
              </Badge>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-[200px]">
              {DEMO_ANALYTICS.attendanceTrend.map((data, index) => {
                const height = (data.value / 100) * chartHeight
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-[#22c55e]/20 rounded-t-lg relative group"
                      style={{ height: `${chartHeight}px` }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#22c55e] to-[#22c55e]/60 rounded-t-lg transition-all group-hover:from-[#22c55e]"
                        style={{ height: `${height}px` }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[12px] font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.value}%
                      </div>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)]">{data.label}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Assessment Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                  Tren Nilai
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">Rata-rata nilai per bulan</p>
              </div>
              <Badge variant="danger" className="text-[11px]">
                -2.1%
              </Badge>
            </div>

            {/* Line Chart */}
            <div className="h-[200px] relative">
              <svg className="w-full h-full" viewBox={`0 0 600 200`} preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y + 10}
                    x2="590"
                    y2={y + 10}
                    stroke="var(--border-light)"
                    strokeDasharray="4"
                  />
                ))}

                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area */}
                <path
                  d={`
                    M 40 ${200 - ((DEMO_ANALYTICS.assessmentTrend[0].value - 70) / 20) * 200 + 10}
                    ${DEMO_ANALYTICS.assessmentTrend.slice(1).map((data, i) => {
                      const x = 40 + (i + 1) * 92
                      const y = 200 - ((data.value - 70) / 20) * 200 + 10
                      return `L ${x} ${y}`
                    }).join(" ")}
                    L 580 210 L 40 210 Z
                  `}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={`
                    M 40 ${200 - ((DEMO_ANALYTICS.assessmentTrend[0].value - 70) / 20) * 200 + 10}
                    ${DEMO_ANALYTICS.assessmentTrend.slice(1).map((data, i) => {
                      const x = 40 + (i + 1) * 92
                      const y = 200 - ((data.value - 70) / 20) * 200 + 10
                      return `L ${x} ${y}`
                    }).join(" ")}
                  `}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {DEMO_ANALYTICS.assessmentTrend.map((data, i) => {
                  const x = 40 + i * 92
                  const y = 200 - ((data.value - 70) / 20) * 200 + 10
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="white" stroke="#F59E0B" strokeWidth="3" />
                    </g>
                  )
                })}

                {/* X-axis labels */}
                {DEMO_ANALYTICS.assessmentTrend.map((data, i) => {
                  const x = 40 + i * 92
                  return (
                    <text
                      key={i}
                      x={x}
                      y="195"
                      textAnchor="middle"
                      className="fill-[var(--text-muted)]"
                      style={{ fontSize: "11px" }}
                    >
                      {data.label}
                    </text>
                  )
                })}
              </svg>
            </div>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#8b5cf6]" />
                  Tren Poin Karakter
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">Total poin per bulan</p>
              </div>
              <Badge variant="success" className="text-[11px]">
                +12.5%
              </Badge>
            </div>

            {/* Simple Line Chart */}
            <div className="h-[160px] relative">
              <svg className="w-full h-full" viewBox={`0 0 400 160`} preserveAspectRatio="none">
                {/* Line */}
                <path
                  d={`
                    M 20 ${140 - (DEMO_ANALYTICS.characterTrend[0].value / 4000) * 120}
                    ${DEMO_ANALYTICS.characterTrend.slice(1).map((data, i) => {
                      const x = 20 + i * 60
                      const y = 140 - (data.value / 4000) * 120
                      return `L ${x} ${y}`
                    }).join(" ")}
                  `}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {DEMO_ANALYTICS.characterTrend.map((data, i) => {
                  const x = 20 + i * 60
                  const y = 140 - (data.value / 4000) * 120
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="#8b5cf6" />
                  )
                })}

                {/* X-axis labels */}
                {DEMO_ANALYTICS.characterTrend.map((data, i) => {
                  const x = 20 + i * 60
                  return (
                    <text
                      key={i}
                      x={x}
                      y="155"
                      textAnchor="middle"
                      className="fill-[var(--text-muted)]"
                      style={{ fontSize: "10px" }}
                    >
                      {data.label}
                    </text>
                  )
                })}
              </svg>
            </div>
          </Card>

          {/* Module Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                  Distribusi Modul
                </h3>
                <p className="text-[12px] text-[var(--text-muted)]">Penggunaan per modul</p>
              </div>
            </div>

            {/* Simple Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-[140px] h-[140px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--surface-secondary)"
                    strokeWidth="20"
                  />

                  {/* Segments */}
                  {(() => {
                    let currentAngle = 0
                    return DEMO_ANALYTICS.moduleDistribution.map((item, index) => {
                      const angle = (item.value / 100) * 360
                      const startAngle = currentAngle
                      currentAngle += angle

                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (startAngle + angle - 90) * (Math.PI / 180)

                      const x1 = 50 + 40 * Math.cos(startRad)
                      const y1 = 50 + 40 * Math.sin(startRad)
                      const x2 = 50 + 40 * Math.cos(endRad)
                      const y2 = 50 + 40 * Math.sin(endRad)

                      const largeArc = angle > 180 ? 1 : 0

                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                          opacity="0.9"
                        />
                      )
                    })
                  })()}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">156</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Total</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {DEMO_ANALYTICS.moduleDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] text-[var(--text-muted)]">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--success)]" />
              Statistik Cepat
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--primary-soft)] flex items-center justify-center">
                    <Download className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">Total Download</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Bulan ini</p>
                  </div>
                </div>
                <span className="text-[18px] font-bold text-[var(--primary)]">847</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--success-soft)] flex items-center justify-center">
                    <BarChart className="w-4 h-4 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">Template Digunakan</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Bulan ini</p>
                  </div>
                </div>
                <span className="text-[18px] font-bold text-[var(--success)]">23</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--warning-soft)] flex items-center justify-center">
                    <LineChart className="w-4 h-4 text-[var(--warning)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">Avg. Generation</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Waktu rata-rata</p>
                  </div>
                </div>
                <span className="text-[18px] font-bold text-[var(--warning)]">3.2s</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--info-soft)] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[var(--info)]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">Terjadwal Aktif</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Saat ini</p>
                  </div>
                </div>
                <span className="text-[18px] font-bold text-[var(--info)]">5</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Performance Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Performa per Modul
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Modul
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Laporan Dibuat
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Download
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Avg. Waktu
                  </th>
                  <th className="text-center px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Trend
                  </th>
                  <th className="text-right px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "students", name: "Siswa", reports: 45, downloads: 234, avgTime: "2.8s", trend: 12.5 },
                  { id: "attendance", name: "Absensi", reports: 38, downloads: 189, avgTime: "3.5s", trend: 8.2 },
                  { id: "assessment", name: "Penilaian", reports: 32, downloads: 156, avgTime: "4.2s", trend: -3.1 },
                  { id: "character", name: "Poin Karakter", reports: 25, downloads: 98, avgTime: "2.5s", trend: 15.8 },
                  { id: "specialUnits", name: "Pasukan Khusus", reports: 12, downloads: 45, avgTime: "2.1s", trend: 5.4 },
                  { id: "analytics", name: "Analytics", reports: 8, downloads: 67, avgTime: "5.8s", trend: 22.1 },
                ].map((module) => {
                  const isPositive = module.trend >= 0
                  return (
                    <tr
                      key={module.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-medium text-[var(--text-primary)]">
                          {module.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
                        {module.reports}
                      </td>
                      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
                        {module.downloads}
                      </td>
                      <td className="px-4 py-4 text-center text-[14px] text-[var(--text-secondary)]">
                        {module.avgTime}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge variant={isPositive ? "success" : "danger"} className="text-[11px] gap-1">
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(module.trend)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Detail <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
