"use client";

import { AppShell } from "@/components/layout";
import { Card } from "@/components/ui";
import {
  KPICard,
  AttendanceTrendChart,
  QuickActions,
  ActivityTimeline,
  StudentDistributionChart,
} from "@/components/dashboard";
import {
  Users,
  UserRound,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";

export default function DashboardPage() {
  // Sample data
  const studentData = [
    { value: 1200 },
    { value: 1220 },
    { value: 1215 },
    { value: 1230 },
    { value: 1240 },
    { value: 1245 },
    { value: 1248 },
  ];

  const teacherData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 86 },
    { value: 87 },
    { value: 87 },
  ];

  const attendanceData = [
    { value: 82 },
    { value: 83 },
    { value: 84 },
    { value: 85 },
    { value: 84 },
    { value: 86 },
    { value: 88.5 },
  ];

  const assessmentData = [
    { value: 65 },
    { value: 70 },
    { value: 72 },
    { value: 68 },
    { value: 75 },
    { value: 78 },
    { value: 82 },
  ];

  return (
    <AppShell showHeader={true}>
      {/* School Info Banner */}
      <div className="mb-[24px] flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-secondary)]">
          SMA Negeri 1 Yogyakarta
        </span>
        <span>•</span>
        <span>Tahun Ajaran 2024/2025</span>
        <span>•</span>
        <span>Semester Genap</span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
        <KPICard
          title="Total Siswa"
          value="1.248"
          subtitle="siswa aktif"
          trend="dari bulan lalu"
          trendValue="+2.4%"
          isPositive={true}
          icon={<Users className="w-6 h-6" />}
          color="primary"
          data={studentData}
        />
        <KPICard
          title="Guru & Staff"
          value="87"
          subtitle="46 guru, 41 staff"
          trend="dari tahun lalu"
          trendValue="+3.2%"
          isPositive={true}
          icon={<UserRound className="w-6 h-6" />}
          color="success"
          data={teacherData}
        />
        <KPICard
          title="Presensi Hari Ini"
          value="88.5%"
          subtitle="1.102 dari 1.248 siswa"
          trend="dari kemarin"
          trendValue="+3.2%"
          isPositive={true}
          icon={<CalendarCheck className="w-6 h-6" />}
          color="info"
          data={attendanceData}
        />
        <KPICard
          title="Penilaian"
          value="82%"
          subtitle="rapor terisi"
          trend="dari target"
          trendValue="-8%"
          isPositive={false}
          icon={<GraduationCap className="w-6 h-6" />}
          color="warning"
          data={assessmentData}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions className="mb-[24px]" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] mb-[24px]">
        {/* Attendance Trend Chart - 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>

        {/* Student Distribution Chart - 1 column */}
        <div>
          <StudentDistributionChart />
        </div>
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline />
    </AppShell>
  );
}
