"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendValue?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  data?: { value: number }[];
  className?: string;
}

const colorMap = {
  primary: {
    bg: "bg-[var(--primary-soft)]",
    iconBg: "bg-[var(--primary)]",
    icon: "text-white",
    chart: "var(--primary)",
    text: "text-[var(--primary)]",
  },
  success: {
    bg: "bg-[var(--success-soft)]",
    iconBg: "bg-[var(--success)]",
    icon: "text-white",
    chart: "var(--success)",
    text: "text-[var(--success)]",
  },
  warning: {
    bg: "bg-[var(--warning-soft)]",
    iconBg: "bg-[var(--warning)]",
    icon: "text-white",
    chart: "var(--warning)",
    text: "text-[var(--warning)]",
  },
  danger: {
    bg: "bg-[var(--danger-soft)]",
    iconBg: "bg-[var(--danger)]",
    icon: "text-white",
    chart: "var(--danger)",
    text: "text-[var(--danger)]",
  },
  info: {
    bg: "bg-[var(--info-soft)]",
    iconBg: "bg-[var(--info)]",
    icon: "text-white",
    chart: "var(--info)",
    text: "text-[var(--info)]",
  },
};

const defaultData = [
  { value: 20 },
  { value: 25 },
  { value: 23 },
  { value: 28 },
  { value: 32 },
  { value: 30 },
  { value: 35 },
];

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  isPositive = true,
  icon,
  color = "primary",
  data,
  className,
}: KPICardProps) {
  const colors = colorMap[color];
  const chartData = data || defaultData;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        colors.bg,
        "hover:shadow-[var(--shadow-md)] transition-all duration-200",
        className
      )}
      padding="md"
    >
      <div className="flex items-start justify-between gap-[16px]">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-[13px] font-medium text-[var(--text-secondary)] mb-2">
            {title}
          </p>

          {/* Value */}
          <p className="text-[32px] font-bold text-[var(--text-primary)] leading-tight mb-2">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-[13px] text-[var(--text-muted)] mb-2">
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {(trend || trendValue) && (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className={cn("w-4 h-4", colors.text)} />
              ) : (
                <TrendingDown className={cn("w-4 h-4", colors.text)} />
              )}
              {trendValue && (
                <span className={cn("text-[13px] font-semibold", colors.text)}>
                  {trendValue}
                </span>
              )}
              {trend && (
                <span className="text-[13px] text-[var(--text-muted)]">
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right - Icon or Chart */}
        <div className="flex flex-col items-end gap-[12px]">
          {icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-[18px] flex items-center justify-center",
                colors.iconBg
              )}
            >
              <div className={colors.icon}>{icon}</div>
            </div>
          )}
          <div className="w-[80px] h-[48px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.chart}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
