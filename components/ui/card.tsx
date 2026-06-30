"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "ghost";
  padding?: "sm" | "md" | "lg" | "none";
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-[28px]
      transition-all duration-200 ease-out
    `;

    const variants = {
      default: `
        bg-[var(--surface-primary)]
        shadow-[var(--shadow-sm)]
      `,
      outlined: `
        bg-[var(--surface-primary)]
        border border-[var(--border-light)]
      `,
      ghost: `
        bg-transparent
      `,
    };

    const paddings = {
      none: "",
      sm: "p-[20px]",
      md: "p-[28px]",
      lg: "p-[36px]",
    };

    const hoverStyles = hoverable
      ? "hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
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
        className={cn("flex flex-col space-y-1.5", className)}
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
        className={cn("flex items-center pt-4", className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
