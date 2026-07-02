"use client";

import { Card } from "@/components/ui";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

interface AssessmentProgressWidgetProps {
  className?: string;
}

const completionData = [
  { name: "Selesai", value: 78, color: "#22c55e" },
  { name: "Belum", value: 22, color: "#e5e7eb" },
];

const subjectData = [
  { subject: "Matematika", completion: 85 },
  { subject: "Bahasa Indonesia", completion: 92 },
  { subject: "Bahasa Inggris", completion: 78 },
  { subject: "Fisika", completion: 71 },
  { subject: "Kimia", completion: 65 },
  { subject: "Biologi", completion: 68 },
];

export function AssessmentProgressWidget({
  className,
}: AssessmentProgressWidgetProps) {
  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Progress Penilaian
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Statistik penilaian semester ini
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-[140px] h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-bold text-[var(--text-primary)]">
                78%
              </span>
              <span className="text-[12px] text-[var(--text-muted)]">
                Terisi
              </span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="text-[12px] text-[var(--text-secondary)]">
                Selesai
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#e5e7eb]" />
              <span className="text-[12px] text-[var(--text-secondary)]">
                Belum
              </span>
            </div>
          </div>
        </div>

        {/* Subject Progress Bar */}
        <div>
          <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-3">
            Per Mata Pelajaran
          </h4>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectData}
                layout="vertical"
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="subject"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-primary)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "14px",
                    padding: "8px 12px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}%`, "Completion"]}
                />
                <Bar
                  dataKey="completion"
                  radius={[0, 8, 8, 0]}
                  barSize={16}
                  fill="#4F7CFF"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
