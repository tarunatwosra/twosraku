"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface AttendanceTrendChartProps {
  className?: string;
}

const data = [
  { day: "Sen", hadir: 92, izin: 4, sakit: 2, alpha: 2 },
  { day: "Sel", hadir: 94, izin: 3, sakit: 2, alpha: 1 },
  { day: "Rab", hadir: 91, izin: 5, sakit: 3, alpha: 1 },
  { day: "Kam", hadir: 95, izin: 3, sakit: 1, alpha: 1 },
  { day: "Jum", hadir: 93, izin: 4, sakit: 2, alpha: 1 },
  { day: "Sab", hadir: 89, izin: 6, sakit: 3, alpha: 2 },
];

const timeRanges = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "Semester", value: "semester" },
];

export function AttendanceTrendChart({ className }: AttendanceTrendChartProps) {
  const [selectedRange, setSelectedRange] = useState("7d");

  return (
    <Card className={className} padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Tren Presensi
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Statistik kehadiran siswa minggu ini
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-[18px]">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={cn(
                "px-3 py-1.5 text-[12px] font-medium rounded-[14px] transition-all duration-200",
                selectedRange === range.value
                  ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-light)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              domain={[80, 100]}
              tickFormatter={(value) => `${value}%`}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "18px",
                padding: "12px 16px",
                boxShadow: "var(--shadow-md)",
              }}
              labelStyle={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: 8 }}
              itemStyle={{ color: "var(--text-secondary)", fontSize: 13, paddingBottom: 4 }}
              formatter={(value) => [`${value}%`, ""]}
            />
            <Line
              type="monotone"
              dataKey="hadir"
              name="Hadir"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="izin"
              name="Izin"
              stroke="#4F7CFF"
              strokeWidth={2.5}
              dot={{ fill: "#4F7CFF", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="sakit"
              name="Sakit"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={{ fill: "#F59E0B", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="alpha"
              name="Alpha"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ fill: "#EF4444", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-[24px] mt-[16px] pt-[16px] border-t border-[var(--border-light)]">
        <div className="flex items-center gap-[8px]">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[12px] text-[var(--text-secondary)]">Hadir</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="w-3 h-3 rounded-full bg-[#4F7CFF]" />
          <span className="text-[12px] text-[var(--text-secondary)]">Izin</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-[12px] text-[var(--text-secondary)]">Sakit</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-[12px] text-[var(--text-secondary)]">Alpha</span>
        </div>
      </div>
    </Card>
  );
}
