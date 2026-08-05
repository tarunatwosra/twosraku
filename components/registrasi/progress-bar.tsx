"use client"

import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import type { RegistrationStep } from "@/types/registrasi"

// Step icons - smaller for mobile
const STEP_ICONS: Record<string, React.ReactNode> = {
  personal: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  address: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  academic: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  parents: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  health: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  other: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
}

export interface RegistrationProgressBarProps {
  steps: Array<{ key: RegistrationStep; label: string }>
  currentStep: RegistrationStep
  progress: number // 0-100
  onStepClick?: (step: RegistrationStep) => void
  className?: string
}

export function RegistrationProgressBar({
  steps,
  currentStep,
  progress,
  onStepClick,
  className,
}: RegistrationProgressBarProps) {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)
  const isComplete = currentStepIndex === steps.length - 1 && progress === 100

  return (
    <div className={cn("w-full", className)}>
      {/* Top Section - Progress Info */}
      <div className="mb-3">
        {/* Step Counter Header - Compact on mobile */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Animated counter badge - smaller on mobile, with glow */}
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center shadow-lg shadow-[var(--primary)]/40">
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <span className="text-sm sm:text-base font-bold text-white">
                    {currentStepIndex + 1}
                  </span>
                )}
              </div>
              {/* Pulse ring for active state - visible on mobile too */}
              {!isComplete && (
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[var(--primary)]/30 animate-ping" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[150px] sm:max-w-none">
                {isComplete ? "Selesai!" : steps[currentStepIndex]?.label}
              </p>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                {isComplete
                  ? "Semua langkah selesai"
                  : `Langkah ${currentStepIndex + 1}/${steps.length}`}
              </p>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-[var(--primary)]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Modern Progress Bar - Glow effect on active progress */}
        <div className="relative h-1.5 sm:h-2 rounded-full overflow-visible">
          {/* Glow effect behind progress */}
          {progress > 0 && (
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: "transparent",
                boxShadow: "0 0 20px 4px rgba(79, 124, 255, 0.4), 0 0 40px 8px rgba(99, 102, 241, 0.2)",
              }}
            />
          )}

          {/* Track background */}
          <div className="absolute inset-0 bg-[var(--border-default)] rounded-full" />

          {/* Progress fill with gradient */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #4F7CFF 0%, #6366F1 50%, #8B5CF6 100%)`,
            }}
          />

          {/* Shine effect - animated shimmer */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              width: `${progress}%`,
            }}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-shine"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Step Indicators - Responsive Grid */}
      <div className="relative">
        {/* Connecting Line - adjusted for mobile */}
        <div className="absolute top-4 sm:top-[22px] left-4 right-4 sm:left-6 sm:right-6 h-0.5 bg-[var(--border-default)]" />

        {/* Steps - compact on mobile */}
        <div className="flex justify-between px-1 sm:px-2">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep
            const isCompleted = index < currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <button
                key={step.key}
                onClick={() => onStepClick?.(step.key)}
                disabled={!onStepClick}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-1 sm:p-1.5 rounded-xl transition-all duration-300 flex-1 max-w-[52px] sm:max-w-[60px]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
                  isActive && "bg-[var(--primary)]/5",
                  isCompleted && "hover:bg-[var(--primary)]/5 cursor-pointer",
                  isPending && "cursor-default",
                  onStepClick && "cursor-pointer"
                )}
              >
                {/* Step Circle - smaller on mobile */}
                <div
                  className={cn(
                    "relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    // Active state
                    isActive && [
                      "bg-gradient-to-br from-[var(--primary)] to-indigo-600",
                      "shadow-md sm:shadow-lg shadow-[var(--primary)]/30 sm:shadow-[var(--primary)]/40",
                      isPending ? "" : "scale-105 sm:scale-110",
                    ],
                    // Completed state
                    isCompleted && [
                      "bg-[var(--primary)]",
                      "shadow-sm shadow-[var(--primary)]/20",
                    ],
                    // Pending state
                    isPending && [
                      "bg-[var(--surface-secondary)]",
                      "border border-[var(--border-default)]",
                    ]
                  )}
                >
                  {/* Inner content */}
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : isActive ? (
                    <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                  ) : (
                    <span className="text-[var(--text-muted)] text-xs sm:text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Icon - positioned inside circle, hidden on small mobile */}
                <div
                  className={cn(
                    "absolute top-1 sm:top-1.5 transition-all duration-300",
                    isActive && "text-white scale-75",
                    isCompleted && "text-white/80 scale-75",
                    isPending && "text-[var(--text-muted)] scale-75"
                  )}
                >
                  {STEP_ICONS[step.key]}
                </div>

                {/* Label - condensed on mobile */}
                <span
                  className={cn(
                    "text-[9px] sm:text-[10px] font-medium transition-colors duration-300 text-center leading-tight truncate w-full mt-5 sm:mt-0",
                    isActive && "text-[var(--primary)] font-semibold",
                    isCompleted && "text-[var(--primary)]/80",
                    isPending && "text-[var(--text-muted)]"
                  )}
                >
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Compact version for tighter spaces
export function RegistrationProgressCompact({
  steps,
  currentStep,
  progress,
  className,
}: Omit<RegistrationProgressBarProps, "onStepClick">) {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)
  const isComplete = currentStepIndex === steps.length - 1 && progress === 100

  return (
    <div className={cn("w-full", className)}>
      {/* Compact progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[var(--primary)]">
          {currentStepIndex + 1}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          / {steps.length}
        </span>

        {/* Mini progress */}
        <div className="flex-1 h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs font-medium text-[var(--primary)]">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Current step label */}
      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mt-1">
        {isComplete ? "✓ " : ""}{steps[currentStepIndex]?.label}
      </p>
    </div>
  )
}

export default RegistrationProgressBar
