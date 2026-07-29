"use client";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui";
import { Wallet, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileTabunganPage() {
  return (
    <MobileShell>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Tabungan
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Kelola tabungan siswa
        </p>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-active)] p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-[13px] text-white/80">Total Tabungan</span>
          </div>
        </div>
        <p className="text-[28px] font-bold text-white mb-1">
          Rp 125.000.000
        </p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-white/80" />
          <span className="text-[12px] text-white/80">
            +Rp 15.000.000 dari bulan lalu
          </span>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--success-soft)] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-[var(--success)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            Rp 85jt
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Total Setoran</p>
        </Card>

        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--danger-soft)] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-[var(--danger)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            Rp 15jt
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Total Penarikan</p>
        </Card>
      </div>

      {/* Active Students */}
      <Card className="p-4 mb-4" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Siswa Aktif
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                Menabung bulan ini
              </p>
            </div>
          </div>
          <span className="text-[18px] font-bold text-[var(--primary)]">
            800
          </span>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-0 overflow-hidden" padding="none">
        <div className="px-4 py-3 border-b border-[var(--border-light)]/60">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Transaksi Terbaru
          </h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]/40">
          {[
            { name: "Anisa Rahman", type: "deposit", amount: 50000, time: "10 menit lalu" },
            { name: "Budi Santoso", type: "withdraw", amount: 100000, time: "25 menit lalu" },
            { name: "Dewi Lestari", type: "deposit", amount: 25000, time: "1 jam lalu" },
          ].map((item, index) => (
            <div key={index} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {item.name}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {item.time}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-[13px] font-semibold",
                  item.type === "deposit" ? "text-[var(--success)]" : "text-[var(--danger)]"
                )}>
                  {item.type === "deposit" ? "+" : "-"} Rp {item.amount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  );
}
