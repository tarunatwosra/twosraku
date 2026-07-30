"use client";

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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileDashboardPage() {
  // Sample data
  const stats = {
    totalStudents: 1248,
    attendanceToday: {
      present: 1180,
      total: 1248,
      percentage: 94.5,
    },
    assessmentCompletion: 78,
    savingsTotal: 125,
  };

  // Sample pending attendance
  const pendingAttendance = 3;

  return (
    <MobileShell showHeaderGreeting={true}>
      {/* KPI Cards - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 mt-3">
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

      {/* Pending Attendance Alert - Bold */}
      {pendingAttendance > 0 && (
        <Card className="mb-4 bg-[var(--danger)] border-2 border-[var(--danger)] shadow-[var(--shadow-md)]" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">
                {pendingAttendance} Absensi Belum Diinput
              </p>
              <p className="text-[12px] text-white/80">
                Segera lengkapi untuk hari ini
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-[14px]">{pendingAttendance}</span>
            </div>
          </div>
        </Card>
      )}

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

      {/* Bottom Spacing for Safe Area */}
      <div className="h-4" />
    </MobileShell>
  );
}
