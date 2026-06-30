"use client";

import { TrendingUp } from "lucide-react";
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
    bg: "bg-blue-50",
    border: "border-blue-100",
    chart: "#3b82f6",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    chart: "#10b981",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    chart: "#8b5cf6",
  },
};

export default function MetricCard({
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
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl p-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mb-1.5">{value}</p>
          <div className="flex items-center gap-1">
            {isPositive && (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-xs text-gray-400">{trend}</span>
          </div>
        </div>
        <div className="w-20 h-10">
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
    </div>
  );
}
