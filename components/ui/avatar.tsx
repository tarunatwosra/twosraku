"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt = "", fallback, size = "md", ...props },
    ref
  ) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
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
        ref={ref}
        className={cn(
          `
          relative inline-flex items-center justify-center
          rounded-[18px]
          overflow-hidden
          bg-[var(--primary-soft)]
          text-[var(--primary)]
          font-semibold
          `,
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getFallbackText()}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
