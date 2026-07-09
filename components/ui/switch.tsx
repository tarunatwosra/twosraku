"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: "sm" | "md" | "lg"
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, size = "md", disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: {
        track: "h-5 w-9",
        thumb: "h-4 w-4",
        translate: "translate-x-4",
        translateOff: "translate-x-0.5",
      },
      md: {
        track: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
        translateOff: "translate-x-0.5",
      },
      lg: {
        track: "h-7 w-14",
        thumb: "h-6 w-6",
        translate: "translate-x-7",
        translateOff: "translate-x-0.5",
      },
    }

    const sizes = sizeClasses[size]

    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "relative bg-[var(--border-default)] peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-2 rounded-full transition-colors duration-200",
            sizes.track,
            checked && "bg-[var(--primary)]"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 bg-white rounded-full shadow-md transition-transform duration-200 ease-out",
              sizes.thumb,
              checked ? sizes.translate : sizes.translateOff
            )}
          />
        </div>
      </label>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
