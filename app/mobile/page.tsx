"use client";

import { useState, useEffect } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { MobileKPICard } from "@/components/dashboard/mobile-kpi-card";
import { MobileScheduleCard } from "@/components/dashboard/mobile-schedule-card";
import { MobileAnnouncementsCard } from "@/components/dashboard/mobile-announcements-card";
import { MobileActivityCard } from "@/components/dashboard/mobile-activity-card";
import { Card } from "@/components/ui";
import { getClassesAttendanceStatus, type ClassAttendanceStatus } from "@/lib/attendance-days";
import {
  Users,
  CalendarCheck,
  Wallet,
  GraduationCap,
  AlertCircle,
  Sun,
  Loader2,
  ChevronRight,
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

  // Attendance schedule state
  const [schedule, setSchedule] = useState<ClassAttendanceStatus[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // Fetch attendance schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await getClassesAttendanceStatus();
        if (data) {
          // Filter hanya yang ada jadwal presensi hari ini
          const todaySchedule = data.filter((item) => item.isAttendanceDay);
          setSchedule(todaySchedule);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Calculate pending attendance
  const pendingAttendance = schedule.filter((s) => !s.hasAttendanceRecorded).length;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Get short date format
  const getShortDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <MobileShell showHeaderGreeting={false}>
      {/* Greeting Card */}
      <Card className="mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] border-2 border-[var(--primary)] shadow-[var(--shadow-md)]" padding="md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-white">
              {getGreeting()}, Administrator
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] text-white/80">
                {getShortDate()}
              </span>
              <span className="text-[12px] text-white/80">•</span>
              <span className="text-[12px] text-white/80 font-medium">
                2025/2026
              </span>
            </div>
          </div>
        </div>
      </Card>

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

      {/* Pending Attendance Alert - Bold */}
      {pendingAttendance > 0 && !scheduleLoading && (
        <Card className="mb-4 bg-[var(--danger)] border-2 border-[var(--danger)] shadow-[var(--shadow-md)]" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">
                {pendingAttendance} Presensi Belum Diinput
              </p>
              <p className="text-[12px] text-white/80">
                Segera lengkapi untuk hari ini
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-[14px]">{pendingAttendance}</span>
            </div>
          </div>
          {/* List of classes with pending attendance */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="space-y-2">
              {schedule
                .filter((s) => !s.hasAttendanceRecorded)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.classId} className="flex items-center justify-between text-white/90">
                    <span className="text-[13px]">{item.className}</span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">
                      {item.majorName}
                    </span>
                  </div>
                ))}
              {pendingAttendance > 3 && (
                <p className="text-[12px] text-white/70 text-center">
                  +{pendingAttendance - 3} kelas lainnya
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Schedule Loading */}
      {scheduleLoading && (
        <Card className="mb-4 bg-[var(--surface-secondary)] border border-[var(--border-light)]" padding="md">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
            <p className="text-[13px] text-[var(--text-muted)]">Memuat jadwal presensi...</p>
          </div>
        </Card>
      )}

      {/* No Schedule Today */}
      {!scheduleLoading && schedule.length === 0 && (
        <Card className="mb-4 bg-[var(--info-soft)] border border-[var(--info)]" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--info)] flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--info)]">
                Tidak Ada Jadwal Presensi
              </p>
              <p className="text-[12px] text-[var(--info)] opacity-80">
                Tidak ada kelas yang dijadwalkan presensi hari ini
              </p>
            </div>
          </div>
        </Card>
      )}

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
