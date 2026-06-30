"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--danger)] ml-0.5">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            `
            w-full h-[48px] px-4
            bg-[var(--surface-primary)]
            border border-[var(--border-default)]
            rounded-[18px]
            text-[15px] text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            transition-all duration-200
            focus:outline-none focus:border-[var(--border-focus)]
            focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:bg-[var(--surface-secondary)]
            `,
            error && "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[13px] text-[var(--danger)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-[13px] text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
