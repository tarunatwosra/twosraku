"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "neutral", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium
      rounded-full
      transition-colors duration-200
    `;

    const variants = {
      primary: `
        bg-[var(--primary-soft)] text-[var(--primary)]
      `,
      success: `
        bg-[var(--success-soft)] text-[var(--success)]
      `,
      warning: `
        bg-[var(--warning-soft)] text-[var(--warning)]
      `,
      danger: `
        bg-[var(--danger-soft)] text-[var(--danger)]
      `,
      info: `
        bg-[var(--info-soft)] text-[var(--info)]
      `,
      neutral: `
        bg-[var(--surface-hover)] text-[var(--text-secondary)]
      `,
    };

    const sizes = {
      sm: "h-[22px] px-[8px] text-[11px]",
      md: "h-[28px] px-[12px] text-[13px]",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
