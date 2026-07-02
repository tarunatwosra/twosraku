"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  Lock,
  ChevronRight,
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

// Demo current session
const DEMO_SESSION = {
  id: "session-2026-07-01",
  status: "open" as const,
  cashier: "Bpk. Ahmad",
  date: "2026-07-01",
  openingBalance: 500000,
  openingTime: "07:30",
  transactions: [
    { type: "deposit" as const, amount: 50000, student: "Andi Pratama", time: "08:30" },
    { type: "withdrawal" as const, amount: 20000, student: "Budi Santoso", time: "09:15" },
    { type: "deposit" as const, amount: 100000, student: "Dewi Lestari", time: "10:00" },
    { type: "deposit" as const, amount: 75000, student: "Eko Prasetyo", time: "10:30" },
    { type: "withdrawal" as const, amount: 30000, student: "Fitri Handayani", time: "11:00" },
    { type: "deposit" as const, amount: 25000, student: "Gunawan Wijaya", time: "11:30" },
  ],
  totalDeposits: 250000,
  totalWithdrawals: 50000,
}

export default function CashClosingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [isClosing, setIsClosing] = useState(false)
  const [physicalCash, setPhysicalCash] = useState(0)
  const [closingNotes, setClosingNotes] = useState("")

  // Calculate expected cash
  const expectedCash = DEMO_SESSION.openingBalance + DEMO_SESSION.totalDeposits - DEMO_SESSION.totalWithdrawals
  const difference = physicalCash - expectedCash
  const isBalanced = difference === 0

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

  const handleCloseSession = async () => {
    setIsClosing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsClosing(false)
    router.push("/tabungan/cash-closing/riwayat")
  }

  return (
    <AppShell
      title="Cash Closing"
      description="Tutup kas harian tabungan siswa"
      breadcrumbs={[
        { label: "Tabungan", href: "/tabungan" },
        { label: "Cash Closing" },
      ]}
    >
      <div className="space-y-6">
        {/* Session Info */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                <Wallet className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Session Kasir: {DEMO_SESSION.date}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Kasir: {DEMO_SESSION.cashier} • Dibuka: {DEMO_SESSION.openingTime} WIB
                </p>
              </div>
            </div>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Session Aktif
            </Badge>
          </div>
        </Card>

        {/* Cash Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expected Cash */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-[var(--text-muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Perhitungan Sistem
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-xl">
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="w-5 h-5 text-[var(--success)]" />
                  <span className="text-[14px] text-[var(--text-secondary)]">Saldo Awal</span>
                </div>
                <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                  {formatCurrency(DEMO_SESSION.openingBalance)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--success-soft)]/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="w-5 h-5 text-[var(--success)]" />
                  <span className="text-[14px] text-[var(--text-secondary)]">Total Setoran</span>
                </div>
                <span className="text-[15px] font-semibold text-[var(--success)]">
                  + {formatCurrency(DEMO_SESSION.totalDeposits)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--danger-soft)]/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="w-5 h-5 text-[var(--danger)]" />
                  <span className="text-[14px] text-[var(--text-secondary)]">Total Penarikan</span>
                </div>
                <span className="text-[15px] font-semibold text-[var(--danger)]">
                  - {formatCurrency(DEMO_SESSION.totalWithdrawals)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--primary-soft)] rounded-xl border-2 border-[var(--primary)]">
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                  Saldo Sistem
                </span>
                <span className="text-xl font-bold text-[var(--primary)]">
                  {formatCurrency(expectedCash)}
                </span>
              </div>
            </div>
          </Card>

          {/* Physical Cash */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-[var(--text-muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Hitung Fisik
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Jumlah Uang Fisik (Rp)
                </label>
                <input
                  type="number"
                  value={physicalCash}
                  onChange={(e) => setPhysicalCash(Number(e.target.value))}
                  placeholder="Masukkan jumlah uang fisik"
                  className="w-full h-14 px-4 text-lg bg-[var(--surface-secondary)] border-2 border-transparent rounded-xl focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>

              {/* Difference */}
              <div className={cn(
                "p-4 rounded-xl border-2",
                isBalanced
                  ? "bg-[var(--success-soft)]/30 border-[var(--success)]"
                  : difference > 0
                  ? "bg-[var(--warning-soft)]/30 border-[var(--warning)]"
                  : "bg-[var(--danger-soft)]/30 border-[var(--danger)]"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Selisih
                  </span>
                  <Badge
                    variant={isBalanced ? "success" : difference > 0 ? "warning" : "danger"}
                    className="gap-1"
                  >
                    {isBalanced ? (
                      <><CheckCircle2 className="w-3 h-3" /> Seimbang</>
                    ) : difference > 0 ? (
                      <><AlertCircle className="w-3 h-3" /> Lebih (+)</>
                    ) : (
                      <><AlertCircle className="w-3 h-3" /> Kurang (-)</>
                    )}
                  </Badge>
                </div>
                <p className={cn(
                  "text-2xl font-bold",
                  isBalanced
                    ? "text-[var(--success)]"
                    : difference > 0
                    ? "text-[var(--warning)]"
                    : "text-[var(--danger)]"
                )}>
                  {isBalanced ? formatCurrency(0) : formatCurrency(Math.abs(difference))}
                </p>
                {difference > 0 && (
                  <p className="text-xs text-[var(--warning)] mt-1">
                    Terdapat kelebihan uang fisik
                  </p>
                )}
                {difference < 0 && (
                  <p className="text-xs text-[var(--danger)] mt-1">
                    Terdapat kekurangan uang fisik
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-[14px] font-medium text-[var(--text-primary)] mb-2 block">
                  Catatan Closing
                </label>
                <textarea
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Tambahkan catatan jika ada selisih..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--surface-secondary)] border border-transparent rounded-xl text-[14px] focus:outline-none focus:border-[var(--border-focus)] resize-none"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction List */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[var(--border-light)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Transaksi Hari Ini
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {DEMO_SESSION.transactions.length} transaksi
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Waktu
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Jenis
                  </th>
                  <th className="text-left px-4 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Siswa
                  </th>
                  <th className="text-right px-6 py-4 text-[13px] font-semibold text-[var(--text-secondary)]">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEMO_SESSION.transactions.map((txn, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <td className="px-6 py-4 text-[14px] text-[var(--text-secondary)]">
                      {txn.time}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={txn.type === "deposit" ? "success" : "danger"} className="gap-1">
                        {txn.type === "deposit" ? (
                          <ArrowDownLeft className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {txn.type === "deposit" ? "Setoran" : "Penarikan"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[var(--text-primary)]">
                      {txn.student}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right text-[14px] font-semibold",
                      txn.type === "deposit" ? "text-[var(--success)]" : "text-[var(--danger)]"
                    )}>
                      {txn.type === "deposit" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/tabungan")}>
                Batal
              </Button>
              <Button variant="outline" onClick={() => router.push("/tabungan/cash-closing/riwayat")}>
                <Clock className="w-4 h-4 mr-2" />
                Lihat Riwayat
              </Button>
            </div>
            <Button
              onClick={handleCloseSession}
              isLoading={isClosing}
              disabled={physicalCash === 0}
              className="gap-2"
            >
              <Lock className="w-4 h-4" />
              Tutup Session
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
