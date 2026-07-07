"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  ring?: boolean;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt = "", fallback, size = "md", status, ring = true, ...props },
    ref
  ) => {
    const sizes = {
      xs: "w-6 h-6 text-[10px]",
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-14 h-14 text-lg",
      xl: "w-20 h-20 text-2xl",
    };

    const ringSizes = {
      xs: "ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-primary)]",
      sm: "ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-primary)]",
      md: "ring-2 ring-white ring-offset-2 ring-offset-[var(--surface-primary)]",
      lg: "ring-3 ring-white ring-offset-2 ring-offset-[var(--surface-primary)]",
      xl: "ring-4 ring-white ring-offset-2 ring-offset-[var(--surface-primary)]",
    };

    const statusSizes = {
      xs: "w-2 h-2 border-[1.5px]",
      sm: "w-2.5 h-2.5 border-2",
      md: "w-3 h-3 border-2",
      lg: "w-3.5 h-3.5 border-2",
      xl: "w-4 h-4 border-2",
    };

    const statusPositions = {
      xs: "bottom-0 right-0",
      sm: "bottom-0 right-0",
      md: "bottom-0 right-0",
      lg: "bottom-0.5 right-0.5",
      xl: "bottom-0.5 right-0.5",
    };

    const statusColors = {
      online: "bg-emerald-500 border-white",
      offline: "bg-slate-400 border-white",
      away: "bg-amber-500 border-white",
      busy: "bg-red-500 border-white",
    };

    const getFallbackText = () => {
      if (fallback) return fallback;
      return alt
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        className="relative inline-flex items-center justify-center flex-shrink-0"
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            `
            relative inline-flex items-center justify-center
            rounded-2xl
            overflow-hidden
            bg-gradient-to-br from-[var(--primary)]/15 via-[var(--primary)]/10 to-[var(--primary)]/5
            text-[var(--primary)]
            font-semibold
            shadow-sm
            transition-all duration-200 ease-out
            group-hover:shadow-md
            `,
            sizes[size],
            ring && ringSizes[size],
            className
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <span className="select-none">{getFallbackText()}</span>
          )}

          {/* Subtle overlay on hover for interactive feedback */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
        </div>

        {status && (
          <span
            className={cn(
              "absolute rounded-full shadow-sm",
              statusPositions[size],
              statusSizes[size],
              statusColors[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
