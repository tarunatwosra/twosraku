"use client";

import { Card } from "@/components/ui";
import { TrendingUp, TrendingDown, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CharacterBalanceWidgetProps {
  positivePoints: number;
  negativePoints: number;
  className?: string;
}

export function CharacterBalanceWidget({
  positivePoints = 0,
  negativePoints = 0,
  className,
}: CharacterBalanceWidgetProps) {
  const balance = positivePoints - negativePoints;
  const isPositive = balance >= 0;

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between mb-[16px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Balance Karakter
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Statistik poin karakter siswa
          </p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-[16px] flex items-center justify-center",
            isPositive ? "bg-[var(--success-soft)]" : "bg-[var(--danger-soft)]"
          )}
        >
          {isPositive ? (
            <Star className="w-5 h-5 text-[var(--success)]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
          )}
        </div>
      </div>

      {/* Balance Display */}
      <div className="text-center mb-[20px]">
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-[18px]",
            isPositive ? "bg-[var(--success-soft)]" : "bg-[var(--danger-soft)]"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-[var(--success)]" />
          ) : (
            <TrendingDown className="w-5 h-5 text-[var(--danger)]" />
          )}
          <span
            className={cn(
              "text-[24px] font-bold",
              isPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
            )}
          >
            {isPositive ? "+" : ""}
            {balance.toLocaleString("id-ID")}
          </span>
          <span className="text-[14px] text-[var(--text-secondary)]">poin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-[12px]">
        <div className="bg-[var(--success-soft)] rounded-[16px] p-[12px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-[12px] text-[var(--success)] font-medium">
              Poin Positif
            </span>
          </div>
          <p className="text-[20px] font-bold text-[var(--success)]">
            +{positivePoints.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-[var(--danger-soft)] rounded-[16px] p-[12px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
            <span className="text-[12px] text-[var(--danger)] font-medium">
              Poin Negatif
            </span>
          </div>
          <p className="text-[20px] font-bold text-[var(--danger)]">
            -{negativePoints.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </Card>
  );
}
