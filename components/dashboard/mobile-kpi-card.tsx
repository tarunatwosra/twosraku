"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export interface MobileKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendValue?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info" | "purple";
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
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    icon: "text-white",
    chart: "#8b5cf6",
    text: "text-purple-500",
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

export function MobileKPICard({
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
}: MobileKPICardProps) {
  const colors = colorMap[color];
  const chartData = data || defaultData;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        colors.bg,
        "hover:shadow-[var(--shadow-sm)] transition-all duration-200",
        className
      )}
      padding="md"
    >
      <div className="flex flex-col">
        {/* Top Row - Title & Icon */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[12px] font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0",
                colors.iconBg
              )}
            >
              <div className={colors.icon}>{icon}</div>
            </div>
          )}
        </div>

        {/* Value */}
        <p className="text-[26px] font-bold text-[var(--text-primary)] leading-tight mt-2">
          {value}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[12px] text-[var(--text-muted)] mt-1">
            {subtitle}
          </p>
        )}

        {/* Bottom Row - Trend & Chart */}
        <div className="flex items-end justify-between mt-3">
          {/* Trend */}
          {(trend || trendValue) && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className={cn("w-3.5 h-3.5", colors.text)} />
              ) : (
                <TrendingDown className={cn("w-3.5 h-3.5", colors.text)} />
              )}
              {trendValue && (
                <span className={cn("text-[12px] font-semibold", colors.text)}>
                  {trendValue}
                </span>
              )}
              {trend && (
                <span className="text-[11px] text-[var(--text-muted)]">
                  {trend}
                </span>
              )}
            </div>
          )}

          {/* Mini Chart */}
          <div className="w-[60px] h-[32px]">
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
    </Card>
  );
}
