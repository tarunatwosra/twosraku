"use client";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui";
import { ClipboardCheck, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobilePenilaianPage() {
  return (
    <MobileShell>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Penilaian
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Pusat penilaian dan rapor
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--success-soft)] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            78%
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Rapor Terisi</p>
        </Card>

        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--warning-soft)] flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            245
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Menunggu Review</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-[var(--shadow-sm)] transition-all"
          padding="md"
        >
          <ClipboardCheck className="w-6 h-6 text-[var(--primary)] mb-2" />
          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
            Input Nilai Cepat
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Input nilai beberapa siswa sekaligus
          </p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-[var(--shadow-sm)] transition-all"
          padding="md"
        >
          <ClipboardCheck className="w-6 h-6 text-[var(--info)] mb-2" />
          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
            Lihat Rapor
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Preview rapor siswa
          </p>
        </Card>
      </div>

      {/* Recent Input */}
      <Card className="p-0 overflow-hidden" padding="none">
        <div className="px-4 py-3 border-b border-[var(--border-light)]/60">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Input Terbaru
          </h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]/40">
          {[
            { subject: "Matematika", class: "X IPA 1", teacher: "Budi Santoso", date: "10 menit lalu" },
            { subject: "Bahasa Indonesia", class: "X IPA 1", teacher: "Siti Aminah", date: "25 menit lalu" },
            { subject: "Fisika", class: "XI IPA 1", teacher: "Ahmad Dahlan", date: "1 jam lalu" },
          ].map((item, index) => (
            <div key={index} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {item.subject}
                </p>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {item.date}
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)]">
                {item.class} • {item.teacher}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  );
}
