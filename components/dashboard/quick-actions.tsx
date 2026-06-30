"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Users,
  ClipboardCheck,
  BarChart3,
  CalendarPlus,
  FileText,
  Settings,
  Package,
  Mail,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: typeof Users;
  label: string;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  { icon: Users, label: "Tambah Siswa", href: "/buku-induk/new", color: "primary" },
  { icon: ClipboardCheck, label: "Ambil Presensi", href: "/presensi/new", color: "success" },
  { icon: BarChart3, label: "Input Nilai", href: "/penilaian/new", color: "warning" },
  { icon: CalendarPlus, label: "Atur Jadwal", href: "/jadwal/new", color: "info" },
  { icon: FileText, label: "Buat Laporan", href: "/laporan/new", color: "purple" },
  { icon: Package, label: "Inventaris", href: "/inventaris", color: "orange" },
  { icon: Mail, label: "Surat Baru", href: "/surat/new", color: "cyan" },
  { icon: Settings, label: "Pengaturan", href: "/pengaturan", color: "gray" },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  primary: { bg: "bg-[var(--primary-soft)]", icon: "text-[var(--primary)]" },
  success: { bg: "bg-[var(--success-soft)]", icon: "text-[var(--success)]" },
  warning: { bg: "bg-[var(--warning-soft)]", icon: "text-[var(--warning)]" },
  danger: { bg: "bg-[var(--danger-soft)]", icon: "text-[var(--danger)]" },
  info: { bg: "bg-[var(--info-soft)]", icon: "text-[var(--info)]" },
  purple: { bg: "bg-purple-50", icon: "text-purple-500" },
  orange: { bg: "bg-orange-50", icon: "text-orange-500" },
  cyan: { bg: "bg-cyan-50", icon: "text-cyan-500" },
  gray: { bg: "bg-gray-100", icon: "text-gray-500" },
};

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className} padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Aksi Cepat
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Akses cepat ke fitur utama
          </p>
        </div>
        <Link
          href="/settings/shortcuts"
          className="text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Atur pintasan
        </Link>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
        {quickActions.map((action) => {
          const colors = colorMap[action.color] || colorMap.gray;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group flex flex-col items-center gap-[12px] p-[16px]",
                "rounded-[20px] border border-transparent",
                "hover:bg-[var(--surface-secondary)]",
                "hover:border-[var(--border-light)]",
                "hover:shadow-sm",
                "transition-all duration-200"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-[18px] flex items-center justify-center",
                  "transition-transform duration-200 group-hover:scale-110",
                  colors.bg,
                  colors.icon
                )}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-medium text-[var(--text-secondary)] text-center group-hover:text-[var(--text-primary)] transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
