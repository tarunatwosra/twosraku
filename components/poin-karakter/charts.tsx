"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Award, Calendar } from "lucide-react"

interface PointTrendChartProps {
  data: {
    date: string
    positive: number
    negative: number
  }[]
  className?: string
}

const COLORS = {
  positive: "var(--success)",
  negative: "var(--danger)",
}

export function PointTrendChart({ data, className }: PointTrendChartProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Trend Poin 30 Hari
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[12px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--text-muted)]">Positif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[var(--danger)]" />
            <span className="text-[var(--text-muted)]">Negatif</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-light)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border-light)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke={COLORS.positive}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.positive }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke={COLORS.negative}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.negative }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

interface CategoryBreakdownChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  className?: string
}

export function CategoryBreakdownChart({
  data,
  className,
}: CategoryBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Poin per Kategori
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                `${value} poin (${((value / total) * 100).toFixed(1)}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[12px] text-[var(--text-muted)] truncate">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface MonthlyComparisonChartProps {
  data: {
    month: string
    positive: number
    negative: number
  }[]
  className?: string
}

export function MonthlyComparisonChart({
  data,
  className,
}: MonthlyComparisonChartProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Perbandingan Bulanan
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-light)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border-light)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
            />
            <Bar
              dataKey="positive"
              name="Positif"
              fill={COLORS.positive}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="negative"
              name="Negatif"
              fill={COLORS.negative}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
