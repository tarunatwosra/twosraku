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
      style,
      ...props
    },
    ref
  ) => {
    // Base styles for all buttons
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-[18px]
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-40 disabled:cursor-not-allowed
      cursor-pointer
    `;

    // Variant-specific inline styles
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontWeight: 600,
          };
        case "secondary":
          return {
            backgroundColor: "#F8FAFC",
            color: "#1E293B",
            fontWeight: 500,
            border: "1px solid #E2E8F0",
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: "#64748B",
            fontWeight: 500,
            border: "1px solid #E2E8F0",
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: "#64748B",
            fontWeight: 500,
            border: "1px solid transparent",
          };
        case "danger":
          return {
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontWeight: 600,
          };
        case "success":
          return {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
            fontWeight: 600,
          };
        default:
          return {};
      }
    };

    // Hover styles
    const getHoverStyles = (): React.CSSProperties => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: "#1D4ED8",
            transform: "translateY(-1px)",
          };
        case "secondary":
          return {
            backgroundColor: "#F1F5F9",
            borderColor: "#CBD5E1",
            color: "#1E293B",
          };
        case "outline":
          return {
            backgroundColor: "#F8FAFC",
            borderColor: "#CBD5E1",
            color: "#1E293B",
          };
        case "ghost":
          return {
            backgroundColor: "#F1F5F9",
            color: "#1E293B",
          };
        case "danger":
          return {
            backgroundColor: "#DC2626",
          };
        case "success":
          return {
            backgroundColor: "#16A34A",
          };
        default:
          return {};
      }
    };

    // Size-specific styles
    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case "sm":
          return { height: "36px", paddingLeft: "14px", paddingRight: "14px", fontSize: "13px" };
        case "md":
          return { height: "44px", paddingLeft: "22px", paddingRight: "22px", fontSize: "15px" };
        case "lg":
          return { height: "52px", paddingLeft: "26px", paddingRight: "26px", fontSize: "15px" };
        case "icon":
          return { width: "40px", height: "40px", padding: "0" };
        default:
          return { height: "44px", paddingLeft: "22px", paddingRight: "22px", fontSize: "15px" };
      }
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, className)}
        style={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...style,
        }}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => {
          const hoverStyles = getHoverStyles();
          Object.assign(e.currentTarget.style, hoverStyles);
        }}
        onMouseLeave={(e) => {
          const variantStyles = getVariantStyles();
          const sizeStyles = getSizeStyles();
          Object.assign(e.currentTarget.style, variantStyles);
          Object.assign(e.currentTarget.style, sizeStyles);
        }}
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
