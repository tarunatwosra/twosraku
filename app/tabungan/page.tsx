"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Search,
  Filter,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Clock,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Demo data for transactions
const DEMO_TRANSACTIONS = [
  { id: "txn-1", type: "deposit" as const, amount: 50000, student: "Andi Pratama", date: "2026-07-01 08:30", description: "Setoran tabungan" },
  { id: "txn-2", type: "withdrawal" as const, amount: 20000, student: "Budi Santoso", date: "2026-07-01 09:15", description: "Penarikan" },
  { id: "txn-3", type: "deposit" as const, amount: 100000, student: "Dewi Lestari", date: "2026-07-01 10:00", description: "Setoran tabungan bulanan" },
  { id: "txn-4", type: "deposit" as const, amount: 75000, student: "Eko Prasetyo", date: "2026-07-01 10:30", description: "Setoran tabungan" },
  { id: "txn-5", type: "withdrawal" as const, amount: 30000, student: "Fitri Handayani", date: "2026-07-01 11:00", description: "Penarikan kebutuhan sekolah" },
  { id: "txn-6", type: "deposit" as const, amount: 25000, student: "Gunawan Wijaya", date: "2026-07-01 11:30", description: "Setoran tabungan" },
]

// Demo statistics
const DEMO_STATS = {
  totalBalance: 15675000,
  todayDeposits: 325000,
  todayWithdrawals: 65000,
  monthDeposits: 1250000,
  monthWithdrawals: 450000,
  activeAccounts: 45,
  totalAccounts: 50,
}

export default function SavingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return DEMO_TRANSACTIONS.filter((txn) => {
      const matchesSearch =
        txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDate = txn.date.startsWith(selectedDate)
      return matchesSearch && matchesDate
    })
  }, [searchQuery, selectedDate])

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

  return (
    <AppShell
      title="Tabungan"
      description="Kelola tabungan dan transaksi siswa"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari transaksi atau siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-body focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-11 px-4 bg-[var(--surface-secondary)] border border-transparent rounded-[18px] text-body focus:outline-none focus:border-[var(--border-focus)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => router.push("/tabungan/cash-closing")}>
              <FileText className="w-4 h-4" />
              Cash Closing
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => router.push("/tabungan/laporan")}>
              <Download className="w-4 h-4" />
              Laporan
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Transaksi Baru
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Saldo"
            value={formatCurrency(DEMO_STATS.totalBalance)}
            subtitle="saldo seluruh akun"
            icon={<Wallet className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Setoran Hari Ini"
            value={formatCurrency(DEMO_STATS.todayDeposits)}
            icon={<ArrowDownLeft className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Penarikan Hari Ini"
            value={formatCurrency(DEMO_STATS.todayWithdrawals)}
            icon={<ArrowUpRight className="w-5 h-5" />}
            color="danger"
          />
          <StatCard
            title="Akun Aktif"
            value={`${DEMO_STATS.activeAccounts}/${DEMO_STATS.totalAccounts}`}
            subtitle="siswa"
            icon={<Users className="w-5 h-5" />}
            color="info"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-section-title">
                    Transaksi Terbaru
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/tabungan/mutasi")}>
                    Lihat Semua →
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-[var(--border-light)]">
                {filteredTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                    onClick={() => router.push(`/tabungan/siswa/${txn.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          txn.type === "deposit"
                            ? "bg-[var(--success-soft)] text-[var(--success)]"
                            : "bg-[var(--danger-soft)] text-[var(--danger)]"
                        )}
                      >
                        {txn.type === "deposit" ? (
                          <ArrowDownLeft className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-h5 text-[var(--text-primary)]">
                          {txn.student}
                        </p>
                        <p className="text-[13px] text-[var(--text-muted)]">
                          {txn.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-body font-bold",
                          txn.type === "deposit"
                            ? "text-[var(--success)]"
                            : "text-[var(--danger)]"
                        )}
                      >
                        {txn.type === "deposit" ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)]">
                        {txn.date.split(" ")[1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-muted)]">Tidak ada transaksi hari ini</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-section-title mb-4">
                Aksi Cepat
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/tabungan/transaksi?type=deposit")}
                >
                  <ArrowDownLeft className="w-4 h-4 text-[var(--success)]" />
                  Setoran Baru
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/tabungan/transaksi?type=withdrawal")}
                >
                  <ArrowUpRight className="w-4 h-4 text-[var(--danger)]" />
                  Penarikan
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/tabungan/mutasi")}
                >
                  <Clock className="w-4 h-4" />
                  Riwayat Mutasi
                </Button>
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card className="p-6">
              <h2 className="text-section-title mb-4">
                Ringkasan Bulan Ini
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-[14px] text-[var(--text-secondary)]">Total Setoran</span>
                  </div>
                  <span className="text-[14px] font-bold text-[var(--success)]">
                    {formatCurrency(DEMO_STATS.monthDeposits)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
                    <span className="text-[14px] text-[var(--text-secondary)]">Total Penarikan</span>
                  </div>
                  <span className="text-[14px] font-bold text-[var(--danger)]">
                    {formatCurrency(DEMO_STATS.monthWithdrawals)}
                  </span>
                </div>
                <div className="pt-4 border-t border-[var(--border-light)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[var(--text-secondary)]">Saldo Bersih</span>
                    <span className="text-[16px] font-bold text-[var(--primary)]">
                      {formatCurrency(DEMO_STATS.monthDeposits - DEMO_STATS.monthWithdrawals)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cash Closing Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">
                  Cash Closing
                </h2>
                <Badge variant="success">Seimbang</Badge>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] mb-4">
                Tanggal terakhir closing: 30 Juni 2026
              </p>
              <Button variant="outline" className="w-full" onClick={() => router.push("/tabungan/cash-closing")}>
                <FileText className="w-4 h-4 mr-2" />
                Buka Session Baru
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color: "primary" | "success" | "warning" | "secondary" | "info" | "danger"
}) {
  const colors = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-muted)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div>
          <p className="text-stat-lg text-[var(--text-primary)]">{value}</p>
          <p className="text-caption text-[var(--text-muted)]">{title}</p>
          {subtitle && <p className="text-tiny text-[var(--text-muted)]">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}
