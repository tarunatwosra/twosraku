"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), 200)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-xs rounded-lg shadow-lg border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 duration-150",
            positionClasses[side],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-popover border-l border-t border-border rotate-45",
              side === "top" && "top-full left-1/2 -translate-x-1/2 border-r border-b",
              side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 border-l border-t",
              side === "left" && "left-full top-1/2 -translate-y-1/2 border-r border-t",
              side === "right" && "right-full top-1/2 -translate-y-1/2 border-l border-b"
            )}
          />
        </div>
      )}
    </div>
  )
}
