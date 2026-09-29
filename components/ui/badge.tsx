"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "outline" | "secondary" | "default" | "purple";
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

    // Soft variants with better contrast ratios (WCAG AA compliant)
    const softVariants = {
      primary: `
        bg-[var(--primary-soft)] text-[#2563EB] border-[var(--primary)]/20
        hover:bg-[var(--primary)]/15
      `,
      success: `
        bg-[var(--success-soft)] text-[#15803D] border-[var(--success)]/20
        hover:bg-[var(--success)]/15
      `,
      warning: `
        bg-[var(--warning-soft)] text-[#B45309] border-[var(--warning)]/20
        hover:bg-[var(--warning)]/15
      `,
      danger: `
        bg-[var(--danger-soft)] text-[#B91C1C] border-[var(--danger)]/20
        hover:bg-[var(--danger)]/15
      `,
      info: `
        bg-[var(--info-soft)] text-[#0E7490] border-[var(--info)]/20
        hover:bg-[var(--info)]/15
      `,
      purple: `
        bg-[var(--purple-soft)] text-[#7C3AED] border-[var(--purple)]/20
        hover:bg-[var(--purple)]/15
      `,
      neutral: `
        bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-default)]
        hover:bg-[var(--surface-hover)]
      `,
      outline: `
        bg-transparent border-[var(--border-default)] text-[var(--text-secondary)]
        hover:bg-[var(--surface-secondary)]
      `,
      secondary: `
        bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-transparent
        hover:bg-[var(--surface-hover)]
      `,
      default: `
        bg-[var(--primary)] text-white border-transparent
      `,
    };

    // Solid variants (high contrast)
    const solidVariants = {
      primary: `bg-[var(--primary)] text-white border-transparent`,
      success: `bg-[var(--success)] text-white border-transparent`,
      warning: `bg-[var(--warning)] text-white border-transparent`,
      danger: `bg-[var(--danger)] text-white border-transparent`,
      info: `bg-[var(--info)] text-white border-transparent`,
      purple: `bg-[var(--purple)] text-white border-transparent`,
      neutral: `bg-[var(--text-secondary)] text-white border-transparent`,
      outline: `
        bg-transparent border-[var(--border-default)] text-[var(--text-secondary)]
        hover:bg-[var(--surface-secondary)]
      `,
      secondary: `
        bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-transparent
        hover:bg-[var(--surface-hover)]
      `,
      default: `bg-[var(--primary)] text-white border-transparent`,
    };

    const variants = soft ? softVariants : solidVariants;

    const sizes = {
      sm: "h-[22px] px-[10px] text-[11px] rounded-full",
      md: "h-[26px] px-[12px] text-[12px] rounded-full",
      lg: "h-[30px] px-[14px] text-[13px] rounded-full",
    };

    // Dot colors with WCAG AA compliant colors
    const dotColors = {
      primary: "bg-[var(--primary)]",
      success: "bg-[var(--success)]",
      warning: "bg-[var(--warning)]",
      danger: "bg-[var(--danger)]",
      info: "bg-[var(--info)]",
      purple: "bg-[var(--purple)]",
      neutral: "bg-[var(--text-secondary)]",
      outline: "bg-[var(--border-strong)]",
      secondary: "bg-[var(--text-secondary)]",
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
