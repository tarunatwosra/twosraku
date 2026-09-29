"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, label, indeterminate, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {/* Hidden native input */}
        <input
          ref={innerRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />

        {/* Custom checkbox box */}
        <div
          className={cn(
            "w-4 h-4 rounded-[6px] border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0",
            checked
              ? "bg-[var(--primary)] border-[var(--primary)]"
              : indeterminate
                ? "bg-[var(--primary)]/60 border-[var(--primary)]"
                : "bg-white border-[var(--border-strong)] hover:border-[var(--primary)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-1"
          )}
        >
          {checked && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {indeterminate && !checked && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          )}
        </div>

        {/* Optional label */}
        {label && (
          <span className="ml-2 text-[13px] text-[var(--text-primary)]">{label}</span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
