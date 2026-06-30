"use client";

import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendValue: string;
  isPositive: boolean;
  color: "blue" | "emerald" | "purple";
  data?: { value: number }[];
}

const colorMap = {
  blue: {
    bg: "bg-[var(--primary-soft)]",
    chart: "var(--primary)",
  },
  emerald: {
    bg: "bg-[var(--success-soft)]",
    chart: "var(--success)",
  },
  purple: {
    bg: "bg-purple-50",
    chart: "#8b5cf6",
  },
};

export function MetricCard({
  title,
  value,
  trend,
  trendValue,
  isPositive,
  color,
  data,
}: MetricCardProps) {
  const colors = colorMap[color];

  const defaultData = [
    { value: 20 },
    { value: 25 },
    { value: 23 },
    { value: 28 },
    { value: 32 },
    { value: 30 },
    { value: 35 },
  ];

  const chartData = data || defaultData;

  return (
    <Card
      className={`
        ${colors.bg}
        hover:shadow-[var(--shadow-md)]
        transition-all duration-200
      `}
      padding="md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[var(--text-secondary)] mb-1">
            {title}
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)] mb-2">
            {value}
          </p>
          <div className="flex items-center gap-1.5">
            {isPositive && (
              <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            )}
            <span
              className={`text-[13px] font-semibold ${
                isPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-[13px] text-[var(--text-muted)]">{trend}</span>
          </div>
        </div>
        <div className="w-20 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.chart}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
