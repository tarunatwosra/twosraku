"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
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
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium
      rounded-[18px]
      transition-all duration-200 ease-out
      focus-visible:outline-2 focus-visible:outline-offset-2
      disabled:opacity-40 disabled:cursor-not-allowed
      active:scale-[0.98]
      hover:translate-y-[-2px] hover:shadow-md
    `;

    const variants = {
      primary: `
        bg-[var(--primary)] text-white
        hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]
        focus-visible:outline-[var(--border-focus)]
      `,
      secondary: `
        bg-[var(--surface-hover)] text-[var(--text-primary)]
        hover:bg-[var(--surface-active)]
        focus-visible:outline-[var(--border-focus)]
      `,
      outline: `
        border border-[var(--border-default)] text-[var(--text-primary)]
        bg-transparent hover:bg-[var(--surface-hover)]
        focus-visible:outline-[var(--border-focus)]
      `,
      ghost: `
        text-[var(--text-secondary)]
        hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]
        focus-visible:outline-[var(--border-focus)]
      `,
      danger: `
        bg-[var(--danger)] text-white
        hover:bg-red-600 active:bg-red-700
        focus-visible:outline-red-500
      `,
      success: `
        bg-[var(--success)] text-white
        hover:bg-green-600 active:bg-green-700
        focus-visible:outline-green-500
      `,
    };

    const sizes = {
      sm: "h-[36px] px-[14px] text-[13px]",
      md: "h-[44px] px-[22px] text-[15px]",
      lg: "h-[52px] px-[26px] text-[15px]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
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
