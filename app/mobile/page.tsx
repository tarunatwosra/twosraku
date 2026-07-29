"use client";

import { useState } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { MobileKPICard } from "@/components/dashboard/mobile-kpi-card";
import { MobileQuickActions } from "@/components/dashboard/mobile-quick-actions";
import { MobileScheduleCard } from "@/components/dashboard/mobile-schedule-card";
import { MobileAnnouncementsCard } from "@/components/dashboard/mobile-announcements-card";
import { MobileActivityCard } from "@/components/dashboard/mobile-activity-card";
import { Card } from "@/components/ui";
import {
  Users,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample data
  const stats = {
    totalStudents: 1248,
    attendanceToday: {
      present: 1180,
      total: 1248,
      percentage: 94.5,
    },
    assessmentCompletion: 78,
    specialUnits: 300,
    savingsTotal: 125,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <MobileShell showHeaderGreeting={true}>
      {/* Refresh Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[var(--text-secondary)]",
            "bg-[var(--surface-primary)] rounded-[12px]",
            "border border-[var(--border-light)]/60",
            "hover:bg-[var(--surface-hover)] transition-colors",
            isRefreshing && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className={cn("w-3 h-3 rounded-full bg-current", isRefreshing && "animate-pulse")} />
          Refresh
        </button>
      </div>

      {/* KPI Cards - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MobileKPICard
          title="Total Siswa"
          value={stats.totalStudents.toLocaleString("id-ID")}
          subtitle="siswa"
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <MobileKPICard
          title="Presensi"
          value={`${stats.attendanceToday.percentage.toFixed(0)}%`}
          subtitle={`${stats.attendanceToday.present} hadir`}
          icon={<CalendarCheck className="w-5 h-5" />}
          color="success"
        />
        <MobileKPICard
          title="Tabungan"
          value={`Rp${stats.savingsTotal}jt`}
          subtitle="saldo"
          icon={<Wallet className="w-5 h-5" />}
          color="warning"
        />
        <MobileKPICard
          title="Penilaian"
          value={`${stats.assessmentCompletion}%`}
          subtitle="rapor"
          icon={<GraduationCap className="w-5 h-5" />}
          color="info"
        />
      </div>

      {/* Quick Actions */}
      <MobileQuickActions className="mb-4" />

      {/* Today's Schedule */}
      <div className="mb-4">
        <MobileScheduleCard />
      </div>

      {/* Announcements */}
      <div className="mb-4">
        <MobileAnnouncementsCard />
      </div>

      {/* Activity Timeline */}
      <div className="mb-4">
        <MobileActivityCard />
      </div>

      {/* Quick Stats Card */}
      <Card className="mb-4" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-purple-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Unit Khusus
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                {stats.specialUnits} anggota
              </p>
            </div>
          </div>
          <span className="text-[14px] font-semibold text-purple-500">
            {stats.specialUnits}
          </span>
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  );
}
