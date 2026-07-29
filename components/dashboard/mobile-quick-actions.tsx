"use client";

import Link from "next/link";
import {
  UserPlus,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Wallet,
  BookUser,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  href: string;
  icon: typeof UserPlus;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Absensi",
    href: "/presensi/input",
    icon: CalendarCheck,
    color: "bg-[var(--primary-soft)] text-[var(--primary)]",
  },
  {
    label: "Input Nilai",
    href: "/penilaian/quick",
    icon: ClipboardCheck,
    color: "bg-[var(--success-soft)] text-[var(--success)]",
  },
  {
    label: "Tabungan",
    href: "/tabungan",
    icon: Wallet,
    color: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  {
    label: "Buku Induk",
    href: "/buku-induk",
    icon: BookUser,
    color: "bg-[var(--info-soft)] text-[var(--info)]",
  },
  {
    label: "Tambah Siswa",
    href: "/buku-induk/new",
    icon: UserPlus,
    color: "bg-purple-50 text-purple-500",
  },
  {
    label: "Laporan",
    href: "/laporan",
    icon: FileText,
    color: "bg-[var(--danger-soft)] text-[var(--danger)]",
  },
];

interface MobileQuickActionsProps {
  className?: string;
}

export function MobileQuickActions({ className }: MobileQuickActionsProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Section Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
          Aksi Cepat
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 w-max">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "w-[80px] h-[88px] rounded-[20px]",
                  "bg-[var(--surface-primary)]",
                  "border border-[var(--border-light)]/60",
                  "shadow-[var(--shadow-xs)]",
                  "hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5",
                  "active:scale-95",
                  "transition-all duration-200",
                  "flex-shrink-0"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-[14px] flex items-center justify-center mb-2",
                    action.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] text-center leading-tight px-1">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
