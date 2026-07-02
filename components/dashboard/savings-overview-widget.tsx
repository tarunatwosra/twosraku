"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { PiggyBank, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsOverviewWidgetProps {
  totalSavings?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  activeStudents?: number;
  className?: string;
}

export function SavingsOverviewWidget({
  totalSavings = 0,
  totalDeposits = 0,
  totalWithdrawals = 0,
  activeStudents = 0,
  className,
}: SavingsOverviewWidgetProps) {
  const netChange = totalDeposits - totalWithdrawals;
  const isPositive = netChange >= 0;

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Tabungan
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Ringkasan tabungan siswa
          </p>
        </div>
        <Link
          href="/tabungan"
          className="text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Detail
        </Link>
      </div>

      {/* Total Savings */}
      <div className="bg-gradient-to-br from-[var(--primary-soft)] to-[var(--info-soft)] rounded-[20px] p-[16px] mb-[16px]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-[var(--primary)] flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Total Tabungan
            </p>
            <p className="text-[24px] font-bold text-[var(--text-primary)]">
              Rp {totalSavings.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-[12px]">
        {/* Deposits */}
        <div className="bg-[var(--success-soft)] rounded-[16px] p-[12px]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-[12px] bg-[var(--success)] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-medium text-[var(--success)]">
              Masuk
            </span>
          </div>
          <p className="text-[18px] font-bold text-[var(--success)]">
            Rp {(totalDeposits / 1000000).toFixed(1)}jt
          </p>
        </div>

        {/* Withdrawals */}
        <div className="bg-[var(--danger-soft)] rounded-[16px] p-[12px]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-[12px] bg-[var(--danger)] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-medium text-[var(--danger)]">
              Keluar
            </span>
          </div>
          <p className="text-[18px] font-bold text-[var(--danger)]">
            Rp {(totalWithdrawals / 1000000).toFixed(1)}jt
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[var(--border-light)]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">
            {activeStudents.toLocaleString("id-ID")} siswa aktif
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-[13px] font-medium",
            isPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingUp className="w-4 h-4 rotate-180" />
          )}
          <span>
            {isPositive ? "+" : ""}Rp{(netChange / 1000000).toFixed(1)}jt
          </span>
        </div>
      </div>
    </Card>
  );
}
