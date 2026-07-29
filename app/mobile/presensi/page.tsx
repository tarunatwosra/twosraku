"use client";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui";
import { CalendarCheck, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobilePresensiPage() {
  return (
    <MobileShell>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Presensi
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Kelola kehadiran siswa
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--success-soft)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--success)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            1,180
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Hadir</p>
        </Card>

        <Card className="p-4" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--danger-soft)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--danger)]" />
            </div>
          </div>
          <p className="text-[22px] font-bold text-[var(--text-primary)]">
            48
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Tidak Hadir</p>
        </Card>
      </div>

      {/* Attendance by Class */}
      <Card className="p-0 overflow-hidden" padding="none">
        <div className="px-4 py-3 border-b border-[var(--border-light)]/60">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Per Kelas
          </h3>
        </div>
        <div className="divide-y divide-[var(--border-light)]/40">
          {[
            { class: "X IPA 1", present: 36, total: 38 },
            { class: "X IPA 2", present: 35, total: 37 },
            { class: "X IPS 1", present: 32, total: 36 },
            { class: "XI IPA 1", present: 38, total: 38 },
            { class: "XI IPS 1", present: 30, total: 35 },
          ].map((item) => (
            <div key={item.class} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {item.class}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {item.present}/{item.total} siswa
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-[var(--success)]">
                  {Math.round((item.present / item.total) * 100)}%
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
