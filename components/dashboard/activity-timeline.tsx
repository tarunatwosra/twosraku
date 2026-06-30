"use client";

import { Card } from "@/components/ui";
import {
  UserPlus,
  ClipboardCheck,
  FileText,
  AlertCircle,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  icon: typeof UserPlus;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    icon: UserPlus,
    iconColor: "text-[var(--primary)]",
    iconBg: "bg-[var(--primary-soft)]",
    title: "Siswa baru terdaftar",
    description: "Rizki Pratama加入了X IPA 1",
    time: "5 menit yang lalu",
  },
  {
    id: "2",
    icon: ClipboardCheck,
    iconColor: "text-[var(--success)]",
    iconBg: "bg-[var(--success-soft)]",
    title: "Presensi diinput",
    description: "Presensi kelas X IPA 1 selesai diinput",
    time: "15 menit yang lalu",
  },
  {
    id: "3",
    icon: FileText,
    iconColor: "text-[var(--warning)]",
    iconBg: "bg-[var(--warning-soft)]",
    title: "Nilai submitted",
    description: "Nilai Matematika XI IPS 1 sudah diupload",
    time: "1 jam yang lalu",
  },
  {
    id: "4",
    icon: AlertCircle,
    iconColor: "text-[var(--danger)]",
    iconBg: "bg-[var(--danger-soft)]",
    title: "Peringatan keterlambatan",
    description: "5 siswa terlambat lebih dari 3 kali",
    time: "2 jam yang lalu",
  },
  {
    id: "5",
    icon: GraduationCap,
    iconColor: "text-[var(--info)]",
    iconBg: "bg-[var(--info-soft)]",
    title: "Prestasi baru",
    description: "Tim basket memenangkan lomba antar sekolah",
    time: "3 jam yang lalu",
  },
  {
    id: "6",
    icon: Megaphone,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    title: "Pengumuman baru",
    description: "Jadwal ujian tengah semester diumumkan",
    time: "4 jam yang lalu",
  },
];

interface ActivityTimelineProps {
  className?: string;
}

export function ActivityTimeline({ className }: ActivityTimelineProps) {
  return (
    <Card className={className} padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Aktivitas Terbaru
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Aktivitas sistem dalam 24 jam terakhir
          </p>
        </div>
        <a
          href="#"
          className="text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat semua
        </a>
      </div>

      {/* Timeline */}
      <div className="space-y-[16px]">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-[16px]">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-[18px] flex items-center justify-center flex-shrink-0",
                  activity.iconBg
                )}
              >
                <activity.icon className={cn("w-5 h-5", activity.iconColor)} />
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-[var(--border-light)] mt-[8px]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-[16px]">
              <p className="text-[14px] font-medium text-[var(--text-primary)]">
                {activity.title}
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                {activity.description}
              </p>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <a
        href="#"
        className="flex items-center justify-center gap-1 mt-[16px] py-[10px] text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border-light)] hover:border-[var(--primary)] rounded-[18px] transition-colors"
      >
        Lihat lebih banyak aktivitas
      </a>
    </Card>
  );
}
