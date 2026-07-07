"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "outline" | "secondary" | "default";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  icon?: React.ReactNode;
  soft?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "neutral", size = "md", children, dot, icon, soft = true, ...props },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium
      transition-all duration-200 ease-out
      border
      whitespace-nowrap
    `;

    const variants = {
      primary: soft
        ? `bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 hover:bg-[var(--primary)]/15`
        : `bg-[var(--primary)] text-white border-transparent`,
      success: soft
        ? `bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100`
        : `bg-emerald-500 text-white border-transparent`,
      warning: soft
        ? `bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100`
        : `bg-amber-500 text-white border-transparent`,
      danger: soft
        ? `bg-red-50 text-red-600 border-red-200 hover:bg-red-100`
        : `bg-red-500 text-white border-transparent`,
      info: soft
        ? `bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100`
        : `bg-blue-500 text-white border-transparent`,
      neutral: soft
        ? `bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-150`
        : `bg-slate-500 text-white border-transparent`,
      outline: `
        bg-transparent border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]
      `,
      secondary: `
        bg-[var(--surface-secondary)] text-[var(--text-muted)] border-transparent hover:bg-[var(--surface-hover)]
      `,
      default: `
        bg-[var(--primary)] text-white border-transparent
      `,
    };

    const sizes = {
      sm: "h-[22px] px-[10px] text-[11px] rounded-full",
      md: "h-[26px] px-[12px] text-[12px] rounded-full",
      lg: "h-[30px] px-[14px] text-[13px] rounded-full",
    };

    const dotColors = {
      primary: "bg-[var(--primary)]",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-blue-500",
      neutral: "bg-slate-500",
      outline: "bg-[var(--border-default)]",
      secondary: "bg-slate-500",
      default: "bg-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          "gap-1.5",
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse",
              dotColors[variant]
            )}
          />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
