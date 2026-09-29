"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Size classes using design tokens
    const sizeClasses = {
      sm: "h-[36px] px-[14px] text-[13px]",
      md: "h-[44px] px-[22px] text-[15px]",
      lg: "h-[52px] px-[26px] text-[15px]",
      icon: "w-[44px] h-[44px] p-0",
    };

    // Variant classes using design tokens
    const variantClasses = {
      primary: cn(
        "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
        "focus-visible:ring-[var(--primary)]",
        "hover:-translate-y-[1px] hover:shadow-md"
      ),
      secondary: cn(
        "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
        "border border-[var(--border-default)]",
        "hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)]"
      ),
      outline: cn(
        "bg-transparent text-[var(--text-secondary)]",
        "border border-[var(--border-default)]",
        "hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
      ),
      ghost: cn(
        "bg-transparent text-[var(--text-secondary)]",
        "hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
      ),
      danger: cn(
        "bg-[var(--danger)] text-white hover:bg-[#DC2626]",
        "focus-visible:ring-[var(--danger)]",
        "hover:-translate-y-[1px] hover:shadow-md"
      ),
      success: cn(
        "bg-[var(--success)] text-white hover:bg-[#16A34A]",
        "focus-visible:ring-[var(--success)]",
        "hover:-translate-y-[1px] hover:shadow-md"
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base classes
          "inline-flex items-center justify-center gap-2",
          "font-semibold rounded-[18px]",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
          "cursor-pointer select-none",
          // Size
          sizeClasses[size],
          // Variant
          variantClasses[variant],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Memuat...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
