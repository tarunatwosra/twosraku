"use client";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui";
import Link from "next/link";
import {
  BookUser,
  FileText,
  Settings,
  Users,
  Shield,
  BarChart3,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  icon: typeof BookUser;
  color: string;
}

const menuItems: MenuItem[] = [
  { label: "Buku Induk", href: "/buku-induk", icon: BookUser, color: "bg-[var(--primary-soft)] text-[var(--primary)]" },
  { label: "Guru & Staff", href: "/guru-staff", icon: Users, color: "bg-[var(--success-soft)] text-[var(--success)]" },
  { label: "Unit Khusus", href: "/pasukan-khusus", icon: Shield, color: "bg-purple-50 text-purple-500" },
  { label: "Laporan", href: "/laporan", icon: FileText, color: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  { label: "Statistik", href: "/statistik", icon: BarChart3, color: "bg-[var(--info-soft)] text-[var(--info)]" },
  { label: "Pengaturan", href: "/settings", icon: Settings, color: "bg-[var(--surface-hover)] text-[var(--text-secondary)]" },
];

export default function MobileMorePage() {
  return (
    <MobileShell>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Lainnya
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Menu dan fitur lainnya
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "p-4 rounded-[20px]",
                "bg-[var(--surface-primary)]",
                "border border-[var(--border-light)]/60",
                "shadow-[var(--shadow-xs)]",
                "hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5",
                "active:scale-95",
                "transition-all duration-200"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-[16px] flex items-center justify-center mb-3",
                  item.color
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-medium text-[var(--text-primary)] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Help & Support */}
      <Card className="p-4 mb-4" padding="md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-hover)] flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-[var(--text-primary)]">
              Pusat Bantuan
            </p>
            <p className="text-[12px] text-[var(--text-muted)]">
              Panduan dan FAQ
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-4" padding="md">
        <div className="text-center">
          <div className="w-12 h-12 rounded-[16px] bg-[var(--primary)] mx-auto mb-3 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">
            Twosraku
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">
            SMKN 2 Sragen
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Versi 1.0.0
          </p>
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  );
}
