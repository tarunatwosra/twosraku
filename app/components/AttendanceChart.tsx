"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";

const data = [
  { name: "Hadir", value: 1102, percent: 88.5, color: "#22c55e" },
  { name: "Izin", value: 98, percent: 7.9, color: "#3b82f6" },
  { name: "Sakit", value: 32, percent: 2.6, color: "#eab308" },
  { name: "Alpha", value: 16, percent: 1.0, color: "#ef4444" },
];

export function AttendanceChart() {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Presensi Hari Ini
        </h3>
        <a
          href="#"
          className="flex items-center gap-0.5 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Lihat detail presensi
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="flex items-center gap-[24px]">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[24px] font-bold text-[var(--text-primary)]">
              88.5%
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-[12px]">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-[10px]">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[14px] text-[var(--text-secondary)]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {item.value.toLocaleString("id-ID")}
                </span>
                <span className="text-[12px] text-[var(--text-muted)] w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
