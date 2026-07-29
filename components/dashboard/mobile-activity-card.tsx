"use client";

import { Card } from "@/components/ui";
import { Activity, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number;
  time: string;
  user: string;
  action: string;
  target: string;
}

interface MobileActivityCardProps {
  activities?: ActivityItem[];
  className?: string;
}

// Sample data
const sampleActivities: ActivityItem[] = [
  {
    id: 1,
    time: "10 menit lalu",
    user: "Budi Santoso",
    action: "menginput",
    target: "nilai Matematika X IPA 1",
  },
  {
    id: 2,
    time: "25 menit lalu",
    user: "Siti Aminah",
    action: "mengabsen",
    target: "kehadiran kelas X IPA 2",
  },
  {
    id: 3,
    time: "1 jam lalu",
    user: "Ahmad Dahlan",
    action: "menambahkan",
    target: "siswa baru Anisa Rahman",
  },
  {
    id: 4,
    time: "2 jam lalu",
    user: "Dewi Lestari",
    action: "mengupdate",
    target: "data tabungan siswa XII IPS 1",
  },
  {
    id: 5,
    time: "3 jam lalu",
    user: "Admin",
    action: "membuat",
    target: "laporan bulanan Juni",
  },
];

export function MobileActivityCard({
  activities = sampleActivities,
  className,
}: MobileActivityCardProps) {
  return (
    <Card className={cn("p-0 overflow-hidden", className)} padding="none">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-light)]/60">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Aktivitas Terbaru
          </h3>
        </div>
        <button className="text-[12px] text-[var(--primary)] font-medium flex items-center gap-0.5 hover:opacity-80 transition-opacity">
          Lihat Semua
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-[var(--border-light)]/40">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="px-4 py-3 flex items-start gap-3"
          >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <div className="w-px h-full bg-[var(--border-light)]/60 absolute top-2" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 -mt-0.5">
              <p className="text-[13px] text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  {activity.user}
                </span>{" "}
                {activity.action}{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {activity.target}
                </span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[11px] text-[var(--text-muted)]">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
