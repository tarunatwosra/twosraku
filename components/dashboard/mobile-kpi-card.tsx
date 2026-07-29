"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface MobileKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info" | "purple";
  className?: string;
}

const colorMap = {
  primary: {
    bg: "bg-[var(--primary-soft)]",
    iconBg: "bg-[var(--primary)]",
    icon: "text-white",
  },
  success: {
    bg: "bg-[var(--success-soft)]",
    iconBg: "bg-[var(--success)]",
    icon: "text-white",
  },
  warning: {
    bg: "bg-[var(--warning-soft)]",
    iconBg: "bg-[var(--warning)]",
    icon: "text-white",
  },
  danger: {
    bg: "bg-[var(--danger-soft)]",
    iconBg: "bg-[var(--danger)]",
    icon: "text-white",
  },
  info: {
    bg: "bg-[var(--info-soft)]",
    iconBg: "bg-[var(--info)]",
    icon: "text-white",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    icon: "text-white",
  },
};

export function MobileKPICard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  className,
}: MobileKPICardProps) {
  const colors = colorMap[color];

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        colors.bg,
        className
      )}
      padding="md"
    >
      <div className="flex items-center gap-3">
        {/* Left - Icon */}
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0",
              colors.iconBg
            )}
          >
            <div className={colors.icon}>{icon}</div>
          </div>
        )}

        {/* Right - Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          <p className="text-[20px] font-bold text-[var(--text-primary)] leading-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
