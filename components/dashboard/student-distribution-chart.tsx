"use client";

import { Card } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface StudentDistributionChartProps {
  className?: string;
}

const data = [
  { grade: "X", count: 420, color: "#4F7CFF" },
  { grade: "XI IPA", count: 180, color: "#22c55e" },
  { grade: "XI IPS", count: 160, color: "#F59E0B" },
  { grade: "XII IPA", count: 170, color: "#06b6d4" },
  { grade: "XII IPS", count: 150, color: "#8b5cf6" },
];

export function StudentDistributionChart({ className }: StudentDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={className} padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Distribusi Siswa
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Jumlah siswa berdasarkan kelas
          </p>
        </div>
        <div className="text-right">
          <p className="text-[24px] font-bold text-[var(--text-primary)]">
            {total.toLocaleString("id-ID")}
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">Total Siswa</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-light)"
              horizontal={false}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              type="category"
              dataKey="grade"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 13 }}
              width={50}
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
              itemStyle={{ color: "var(--text-secondary)", fontSize: 13 }}
              formatter={(value) => [`${value} siswa`, ""]}
              cursor={{ fill: "var(--surface-hover)" }}
            />
            <Bar
              dataKey="count"
              name="Jumlah"
              radius={[0, 8, 8, 0]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-[16px] mt-[16px] pt-[16px] border-t border-[var(--border-light)]">
        {data.map((item) => (
          <div key={item.grade} className="flex items-center gap-[8px]">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[12px] text-[var(--text-secondary)]">
              {item.grade}
            </span>
            <span className="text-[12px] font-medium text-[var(--text-primary)]">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
