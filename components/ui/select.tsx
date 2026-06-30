"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, placeholder, options, id, ...props },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[14px] font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && (
              <span className="text-[var(--danger)] ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              `
              w-full h-[48px] px-4 pr-10
              bg-[var(--surface-primary)]
              border border-[var(--border-default)]
              rounded-[18px]
              text-[15px] text-[var(--text-primary)]
              appearance-none
              cursor-pointer
              transition-all duration-200
              focus:outline-none focus:border-[var(--border-focus)]
              focus:shadow-[0_0_0_3px_rgba(79,124,255,0.1)]
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:bg-[var(--surface-secondary)]
              `,
              error && "border-[var(--danger)] focus:border-[var(--danger)]",
              !props.value && "text-[var(--text-muted)]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
              error ? "text-[var(--danger)]" : "text-[var(--text-muted)]"
            )}
          />
        </div>
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

Select.displayName = "Select";

export { Select };
