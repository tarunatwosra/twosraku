"use client";

import Link from "next/link";
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
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentCharacter {
  id: string;
  name: string;
  class: string;
  points: number;
  rank: number;
}

interface CharacterPointsVisualizationProps {
  className?: string;
}

const monthlyData = [
  { month: "Jan", positive: 240, negative: 45 },
  { month: "Feb", positive: 280, negative: 38 },
  { month: "Mar", positive: 310, negative: 52 },
  { month: "Apr", positive: 295, negative: 41 },
  { month: "Mei", positive: 340, negative: 35 },
  { month: "Jun", positive: 380, negative: 28 },
];

const topStudents: StudentCharacter[] = [
  { id: "1", name: "Ahmad Fauzi", class: "X IPA 1", points: 1250, rank: 1 },
  { id: "2", name: "Siti Nurhaliza", class: "XI IPA 2", points: 1180, rank: 2 },
  { id: "3", name: "Budi Santoso", class: "X IPA 2", points: 1120, rank: 3 },
  { id: "4", name: "Dewi Lestari", class: "XII IPS 1", points: 1050, rank: 4 },
  { id: "5", name: "Rizki Pratama", class: "XI IPS 2", points: 980, rank: 5 },
];

const rankColors = ["#F59E0B", "#94A3B8", "#CD7C2D", "#94A3B8", "#94A3B8"];

export function CharacterPointsVisualization({
  className,
}: CharacterPointsVisualizationProps) {
  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Visualisasi Poin Karakter
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Distribusi poin karakter bulanan
          </p>
        </div>
        <Link
          href="/karakter"
          className="flex items-center gap-1 text-[13px] text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
        >
          Detail
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        {/* Monthly Distribution Chart */}
        <div>
          <h4 className="text-[14px] font-medium text-[var(--text-primary)] mb-3">
            Distribusi Bulanan
          </h4>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-primary)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    `${value} poin`,
                    name === "positive" ? "Positif" : "Negatif",
                  ]}
                />
                <Bar dataKey="positive" name="Positif" radius={[4, 4, 0, 0]} barSize={16}>
                  {monthlyData.map((_, index) => (
                    <Cell key={`positive-${index}`} fill="#22c55e" />
                  ))}
                </Bar>
                <Bar dataKey="negative" name="Negatif" radius={[4, 4, 0, 0]} barSize={16}>
                  {monthlyData.map((_, index) => (
                    <Cell key={`negative-${index}`} fill="#EF4444" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="text-[12px] text-[var(--text-secondary)]">
                Positif
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="text-[12px] text-[var(--text-secondary)]">
                Negatif
              </span>
            </div>
          </div>
        </div>

        {/* Top Students */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[var(--warning)]" />
            <h4 className="text-[14px] font-medium text-[var(--text-primary)]">
              Top 5 Siswa
            </h4>
          </div>
          <div className="space-y-[12px]">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-[12px] p-[10px] rounded-[14px] hover:bg-[var(--surface-secondary)] transition-colors"
              >
                {/* Rank */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-[12px] flex items-center justify-center text-[12px] font-bold",
                    student.rank <= 3
                      ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                      : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                  )}
                  style={{
                    backgroundColor:
                      student.rank <= 3 ? "var(--warning-soft)" : undefined,
                    color:
                      student.rank <= 3 ? "var(--warning)" : undefined,
                  }}
                >
                  {student.rank <= 3 ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    student.rank
                  )}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                    {student.name}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {student.class}
                  </p>
                </div>

                {/* Points */}
                <div className="flex items-center gap-1 text-[var(--success)]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[14px] font-semibold">
                    {student.points.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
