"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "ghost" | "elevated" | "soft";
  padding?: "sm" | "md" | "lg" | "none";
  hoverable?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverable = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-3xl
      transition-all duration-200 ease-out
      relative
      overflow-hidden
    `;

    const variants = {
      default: `
        bg-white
        border border-[var(--border-light)]/60
        shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.06)]
      `,
      elevated: `
        bg-white
        border border-[var(--border-light)]/40
        shadow-[0_4px_12px_rgba(15,23,42,0.08),0_2px_4px_rgba(15,23,42,0.04)]
      `,
      outlined: `
        bg-white
        border border-[var(--border-default)]
      `,
      ghost: `
        bg-transparent
        border border-transparent
      `,
      soft: `
        bg-[var(--surface-secondary)]
        border border-[var(--border-light)]/40
        shadow-none
      `,
    };

    const paddings = {
      none: "",
      sm: "p-5",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hoverable
      ? `
        hover:shadow-[0_8px_24px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.06)]
        hover:-translate-y-0.5
        hover:border-[var(--border-default)]
        cursor-pointer
      `
      : "";

    const glowStyles = glow
      ? `
        before:absolute before:inset-0 before:rounded-3xl
        before:bg-gradient-to-br before:from-[var(--primary)]/5 before:to-transparent
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          glowStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4 border-b border-[var(--border-light)]/60", className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Title
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-[18px] font-semibold leading-none tracking-tight text-[var(--text-primary)]",
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card Description
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-[14px] text-[var(--text-secondary)]", className)}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pt-4", className)} {...props} />
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center pt-4 mt-4 border-t border-[var(--border-light)]/60", className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
