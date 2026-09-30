"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  indicatorClassName?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, showLabel = false, size = "md", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="w-full" {...props} ref={ref}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Kelengkapan Data</span>
            <span className="text-xs font-medium text-foreground">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-secondary/50",
            sizeClasses[size],
            className
          )}
        >
          <div
            className={cn(
              "h-full w-full flex-1 bg-primary transition-all duration-300 ease-out rounded-full",
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
